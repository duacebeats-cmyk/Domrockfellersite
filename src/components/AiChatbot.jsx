import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Send, Sparkles, Bot, User, Calculator, 
  ArrowRight, Headphones, CheckCircle2, 
  Clock, AlertCircle, Phone, ArrowUpRight, RotateCcw
} from 'lucide-react';
import { api } from '../services/api';

export function AiChatbot({ isOpen, onToggle, onOpenSimulator, onScrollToSection, currentUser }) {
  // Modes: 'bot' (IA padrão) | 'queue' (Aguardando na fila) | 'live' (Em atendimento ao vivo com consultor)
  const [chatMode, setChatMode] = useState('bot');
  
  // Active ticket for live queue / human attendance
  const [activeTicket, setActiveTicket] = useState(null);
  const [seenTicketMsgIds, setSeenTicketMsgIds] = useState(new Set());
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [onlineAgentsCount, setOnlineAgentsCount] = useState(0);

  // In-chat form data state (for collecting user info directly in the conversation)
  const [inChatForm, setInChatForm] = useState({
    name: currentUser?.name || '',
    phone: currentUser?.phone || '',
    cityUnit: currentUser?.cityUnit || 'Vitória - ES'
  });

  // Conversation messages stream (single unified thread)
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'bot',
      text: 'Olá! Sou o assistente jurídico e financeiro da **Dom RockFeller**. 🏛️⚖️\n\nSomos especialistas na **perícia técnica de juros abusivos**, ajuizamento de **ações revisionais legítimas perante a Justiça** e **orientação transparente sobre riscos de busca e apreensão**.\n\nComo posso te orientar hoje?',
      actions: [
        { label: '🏛️ Falar com a Diretoria / WhatsApp', action: 'request_human_support' },
        { label: '⚖️ Simular Ação Revisional', action: 'open_simulator' },
        { label: '🛡️ Riscos de Busca e Apreensão', action: 'ask_risk_info' },
        { label: '📍 Sedes Vitória & Floripa', action: 'scroll_sedes' }
      ]
    }
  ]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);
  const pollIntervalRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      checkOnlineAgents();
    }
  }, [messages, isOpen, chatMode]);

  // Update inChatForm if currentUser changes
  useEffect(() => {
    if (currentUser) {
      setInChatForm(prev => ({
        ...prev,
        name: currentUser.name || prev.name,
        phone: currentUser.phone || prev.phone,
        cityUnit: currentUser.cityUnit || prev.cityUnit
      }));
    }
  }, [currentUser]);

  // Check how many attendants/admins are currently online
  const checkOnlineAgents = async () => {
    try {
      const res = await api.getOnlineAgentsStatus();
      if (res && res.onlineCount !== undefined) {
        setOnlineAgentsCount(res.onlineCount);
        return res.onlineCount;
      }
    } catch (e) {
      console.warn('Erro ao verificar status dos atendentes:', e);
    }
    return 0;
  };

  // Live polling when ticket is active (in queue or with attendant)
  useEffect(() => {
    if (activeTicket && (activeTicket.status === 'aguardando' || activeTicket.status === 'em_atendimento')) {
      pollIntervalRef.current = setInterval(async () => {
        try {
          const updated = await api.getTicket(activeTicket.id);
          if (updated) {
            setActiveTicket(updated);

            // Check if status changed to em_atendimento
            if (updated.status === 'em_atendimento' && chatMode !== 'live') {
              setChatMode('live');
            }

            // Sync messages from ticket into the chat stream
            if (updated.messages && updated.messages.length > 0) {
              setMessages(prev => {
                const currentIds = new Set(prev.map(m => m.id));
                const newItems = [];

                updated.messages.forEach(tm => {
                  if (!currentIds.has(tm.id) && tm.sender !== 'cliente') {
                    newItems.push({
                      id: tm.id,
                      sender: tm.sender === 'sistema' ? 'system' : 'agent',
                      senderName: tm.senderName || updated.assignedTo?.name || 'Consultor',
                      text: tm.text,
                      timestamp: tm.timestamp
                    });
                  }
                });

                if (newItems.length > 0) {
                  return [...prev, ...newItems];
                }
                return prev;
              });
            }

            // If ticket was closed
            if (updated.status === 'finalizado') {
              setChatMode('bot');
              setActiveTicket(null);
              setMessages(prev => [
                ...prev,
                {
                  id: `ended-${Date.now()}`,
                  sender: 'system',
                  text: '🔔 Este atendimento ao vivo foi finalizado pelo consultor. Como o AutoBot pode te ajudar agora?',
                  actions: [
                    { label: 'Simular Nova Quitação', action: 'open_simulator' },
                    { label: '🙋 Falar com Atendente Novamente', action: 'request_human_support' }
                  ]
                }
              ]);
            }
          }
        } catch (e) {
          console.warn('Erro no polling do chamado:', e);
        }
      }, 2500);
    }

    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, [activeTicket, chatMode]);

  // 1. TRIGGER: Directly request human/director support in the chat
  const handleRequestHumanSupport = async () => {
    setIsTyping(true);
    const count = await checkOnlineAgents();
    setIsTyping(false);

    // Se NÃO houver ninguém da diretoria/consultores online -> Transbordo imediato para o WhatsApp
    if (count === 0) {
      const clientName = inChatForm.name || currentUser?.name || 'Cliente';
      const city = inChatForm.cityUnit || currentUser?.cityUnit || 'Vitória - ES';
      const isFloripa = city.toLowerCase().includes('florianópolis') || city.toLowerCase().includes('sc');
      const targetCity = isFloripa ? 'Florianópolis (SC)' : 'Vitória (ES)';

      setMessages(prev => [
        ...prev,
        {
          id: `no-director-online-${Date.now()}`,
          sender: 'bot',
          type: 'whatsapp_redirect',
          text: `🏛️ **Aviso da Diretoria Dom RockFeller:**\n\nIdentificamos que no momento **nenhum membro da Diretoria ou consultor sênior está disponível no chat ao vivo da plataforma**.\n\n📲 Para que você **não precise aguardar**, estamos encaminhando você agora mesmo diretamente para o **WhatsApp Comercial Oficial da nossa Diretoria** com prioridade máxima de atendimento:`,
          actions: [
            {
              label: `📲 WhatsApp Diretoria - Sede Vitória (27) 3099-4450`,
              action: 'open_url',
              url: `https://api.whatsapp.com/send?phone=552730994450&text=${encodeURIComponent(`Olá, Diretoria Dom RockFeller! Meu nome é ${clientName}. Solicitei atendimento no site (Sede Vitória - ES) sobre a quitação do meu veículo.`)}`
            },
            {
              label: `📲 WhatsApp Diretoria - Sede Floripa (48) 3224-8890`,
              action: 'open_url',
              url: `https://api.whatsapp.com/send?phone=554832248890&text=${encodeURIComponent(`Olá, Diretoria Dom RockFeller! Meu nome é ${clientName}. Solicitei atendimento no site (Sede Florianópolis - SC) sobre a quitação do meu veículo.`)}`
            },
            {
              label: '⚖️ Continuar com a IA (Simular Ação Revisional)',
              action: 'open_simulator'
            }
          ]
        }
      ]);
      return;
    }

    // Se houver membros da diretoria/atendentes online -> Abre formulário para fila imediata
    setMessages(prev => [
      ...prev,
      {
        id: `form-req-${Date.now()}`,
        sender: 'bot',
        type: 'human_form',
        text: `🟢 **Consultores da Diretoria Online (${count} disponíveis)!**\n\nNossa equipe especializada de Vitória e Florianópolis está pronta para te atender ao vivo nesta janela.\n\nPor favor, confirme seus dados de contato abaixo para conectar imediatamente:`,
        submitted: false
      }
    ]);
  };

  // 2. SUBMIT: Process submitted contact info directly in chat
  const handleInChatFormSubmit = async (messageId) => {
    const name = inChatForm.name.trim();
    const phone = inChatForm.phone.trim();
    const cityUnit = inChatForm.cityUnit || 'Vitória - ES';

    if (!name || !phone) {
      alert('Por favor, informe seu nome e seu WhatsApp para prosseguir.');
      return;
    }

    setIsSubmittingForm(true);

    // Mark that form as submitted in history
    setMessages(prev => prev.map(m => m.id === messageId ? { ...m, submitted: true, submittedData: { name, phone, cityUnit } } : m));

    // Add user response message with summary
    const userSummaryMsg = {
      id: `user-info-${Date.now()}`,
      sender: 'user',
      text: `Solicitei atendimento com atendente humano.\nNome: ${name} | WhatsApp: ${phone} | Unidade: ${cityUnit}`
    };
    setMessages(prev => [...prev, userSummaryMsg]);

    // Check if any support is online
    const onlineCount = await checkOnlineAgents();

    // CASE A: NO ONLINE SUPPORT AVAILABLE -> FORWARD TO OFFICIAL COMMERCIAL WHATSAPP
    if (onlineCount === 0) {
      setIsSubmittingForm(false);
      const isFloripa = cityUnit.toLowerCase().includes('florianópolis') || cityUnit.toLowerCase().includes('sc');
      const targetPhone = isFloripa ? '554832248890' : '552730994450';
      const targetCity = isFloripa ? 'Florianópolis (SC)' : 'Vitória (ES)';
      const whatsappText = encodeURIComponent(`Olá! Meu nome é ${name}. Solicitei atendimento no site da Dom RockFeller para quitação de veículo (Unidade ${targetCity}) e gostaria de falar com a equipe comercial.`);

      setMessages(prev => [
        ...prev,
        {
          id: `no-agents-${Date.now()}`,
          sender: 'bot',
          type: 'whatsapp_redirect',
          text: `⚠️ **No momento nenhum consultor está online no chat ao vivo.**\n\nNosso atendimento em tempo real na plataforma ocorre de Segunda a Sexta em horário comercial.\n\n📲 Para que você **não precise aguardar**, você pode conversar agora mesmo diretamente com nosso **número comercial oficial do WhatsApp**:`,
          actions: [
            {
              label: `💬 WhatsApp Comercial - Sede Vitória (27) 3099-4450`,
              action: 'open_url',
              url: `https://api.whatsapp.com/send?phone=552730994450&text=${encodeURIComponent(`Olá! Meu nome é ${name}. Solicitei atendimento comercial da Dom RockFeller (Vitória - ES) sobre quitação de veículo.`)}`
            },
            {
              label: `💬 WhatsApp Comercial - Sede Floripa (48) 3224-8890`,
              action: 'open_url',
              url: `https://api.whatsapp.com/send?phone=554832248890&text=${encodeURIComponent(`Olá! Meu nome é ${name}. Solicitei atendimento comercial da Dom RockFeller (Florianópolis - SC) sobre quitação de veículo.`)}`
            },
            {
              label: '💡 Continuar com o AutoBot IA',
              action: 'reset_bot'
            }
          ]
        }
      ]);
      return;
    }

    // CASE B: SUPPORT IS ONLINE -> JOIN LIVE CHAT QUEUE
    try {
      const ticket = await api.joinChatQueue({
        clientName: name,
        clientPhone: phone,
        clientEmail: currentUser?.email || '',
        cityUnit: cityUnit,
        vehicleModel: 'Solicitação via Chat Web',
        initialMessage: `Cliente ${name} solicitou atendimento humano no chat ao vivo.`
      });

      setActiveTicket(ticket);
      setChatMode('queue');

      setMessages(prev => [
        ...prev,
        {
          id: `queue-joined-${Date.now()}`,
          sender: 'bot',
          text: `✅ **Informações confirmadas, ${name}!**\n\nVocê entrou na **fila de atendimento ao vivo** da unidade **${cityUnit}**.\n\n⏳ Nossos consultores disponíveis foram notificados e um atendente assumirá esta mesma conversa aqui em instantes. Aguarde nesta janela ou envie mais dúvidas abaixo!`,
          actions: [
            { label: '↩️ Cancelar espera e voltar ao AutoBot', action: 'cancel_queue' }
          ]
        }
      ]);
    } catch (e) {
      console.error('Erro ao entrar na fila:', e);
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'bot',
          text: 'Houve uma instabilidade ao conectar à fila. Você pode conversar diretamente pelo nosso WhatsApp Comercial:',
          actions: [
            {
              label: '💬 Abrir WhatsApp Comercial Oficial',
              action: 'open_url',
              url: 'https://api.whatsapp.com/send?phone=552730994450&text=Olá!%20Gostaria%20de%20atendimento%20da%20Dom%20RockFeller%20para%20quitação%20de%20veículo.'
            }
          ]
        }
      ]);
    } finally {
      setIsSubmittingForm(false);
    }
  };

  // Cancel waiting in queue
  // Cancel waiting in queue
  const handleCancelQueue = () => {
    setChatMode('bot');
    setActiveTicket(null);
    setMessages(prev => [
      ...prev,
      {
        id: `cancel-${Date.now()}`,
        sender: 'system',
        text: 'Você saiu da fila de espera. O assistente IA está de volta para orientar sobre análise de juros abusivos, ações revisionais e riscos de busca e apreensão.'
      }
    ]);
  };

  // Send message from input box (either to AI or to the active human attendant ticket)
  const handleSendMessage = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    // Check if user is asking to speak with director / human in free text
    const cleanQuery = query.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (chatMode === 'bot' && (
      cleanQuery.includes('atendente') || 
      cleanQuery.includes('humano') || 
      cleanQuery.includes('diretoria') || 
      cleanQuery.includes('diretor') || 
      cleanQuery.includes('dono') || 
      cleanQuery.includes('gerente') || 
      cleanQuery.includes('responsavel') || 
      cleanQuery.includes('falar com pessoa') || 
      cleanQuery.includes('suporte humano') ||
      cleanQuery.includes('whatsapp')
    )) {
      setInput('');
      setMessages(prev => [...prev, { id: `user-${Date.now()}`, sender: 'user', text: query }]);
      handleRequestHumanSupport();
      return;
    }

    // IF IN LIVE OR QUEUE MODE (TALKING WITH HUMAN AGENT)
    if (chatMode === 'live' || chatMode === 'queue') {
      if (!activeTicket) return;
      const clientMsg = {
        id: `msg-${Date.now()}`,
        sender: 'user',
        text: query
      };
      setMessages(prev => [...prev, clientMsg]);
      setInput('');

      await api.sendTicketMessage(activeTicket.id, {
        sender: 'cliente',
        senderName: inChatForm.name || currentUser?.name || 'Cliente',
        text: query
      });

      const updated = await api.getTicket(activeTicket.id);
      if (updated) setActiveTicket(updated);
      return;
    }

    // IF IN AI BOT MODE
    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await api.sendChatMessage(query);
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: response.reply,
          actions: response.actions || []
        }
      ]);
    } catch (e) {
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: 'Tive uma breve oscilação de conexão, mas nossa assessoria jurídica e financeira de Vitória e Florianópolis está à disposição.',
          actions: [
            { label: '🙋 Falar com Atendente Humano', action: 'request_human_support' },
            { 
              label: 'WhatsApp Sede Vitória (27) 3099-4450', 
              action: 'open_url',
              url: 'https://api.whatsapp.com/send?phone=552730994450&text=Olá!%20Gostaria%20de%20consultoria%20jurídica%20sobre%20ação%20revisional%20e%20juros%20abusivos.'
            }
          ]
        }
      ]);
    }
  };

  // Action chips click handler
  const handleActionClick = (action) => {
    if (action.action === 'request_human_support' || action.action === 'join_queue') {
      handleRequestHumanSupport();
    } else if (action.action === 'ask_risk_info') {
      handleSendMessage('Quais são os riscos de busca e apreensão e como a ação revisional legítima protege o cliente?');
    } else if (action.action === 'open_url' && action.url) {
      window.open(action.url, '_blank');
    } else if (action.action === 'cancel_queue') {
      handleCancelQueue();
    } else if (action.action === 'reset_bot') {
      setChatMode('bot');
      setMessages(prev => [
        ...prev,
        {
          id: `bot-reset-${Date.now()}`,
          sender: 'bot',
          text: 'Perfeito! Em que posso te orientar agora? Posso explicar a análise pericial de juros abusivos, simular valores da ação revisional legítima ou esclarecer os riscos de busca e apreensão.',
          actions: [
            { label: '⚖️ Simular Ação Revisional', action: 'open_simulator' },
            { label: '🛡️ Riscos de Busca e Apreensão', action: 'ask_risk_info' },
            { label: '📋 Como Funciona na Justiça', action: 'how_it_works' }
          ]
        }
      ]);
    } else if (action.action === 'open_simulator') {
      onOpenSimulator();
    } else if (action.action === 'schedule_vitoria' || action.action === 'scroll_sedes') {
      onScrollToSection('sedes');
    } else if (action.action === 'schedule_floripa') {
      onScrollToSection('sedes');
    } else if (action.action === 'how_it_works') {
      onScrollToSection('como-funciona');
    } else if (action.action === 'whatsapp_vitoria') {
      window.open('https://api.whatsapp.com/send?phone=552730994450&text=Olá!%20Gostaria%20de%20consultoria%20jurídica%20pela%20sede%20de%20Vitória%20da%20Dom%20RockFeller.', '_blank');
    } else if (action.action === 'whatsapp_floripa') {
      window.open('https://api.whatsapp.com/send?phone=554832248890&text=Olá!%20Gostaria%20de%20consultoria%20jurídica%20pela%20sede%20de%20Florianópolis%20da%20Dom%20RockFeller.', '_blank');
    } else if (action.action === 'open_whatsapp' || action.action === 'open_whatsapp_urgent') {
      window.open('https://api.whatsapp.com/send?phone=552730994450&text=URGENTE:%20Preciso%20de%20orientação%20jurídica%20sobre%20risco%20de%20busca%20e%20apreensão%20e%20ação%20revisional.', '_blank');
    }
  };

  return (
    <>
      {/* Floating trigger with Lion Crown Logo */}
      {!isOpen && (
        <button
          onClick={onToggle}
          style={{
            position: 'fixed',
            bottom: '26px',
            right: '26px',
            zIndex: 999,
            width: '66px',
            height: '66px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, #101625 0%, #060910 100%)',
            border: '2px solid #F59E0B',
            boxShadow: '0 8px 30px rgba(245, 158, 11, 0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
          className="animate-pulse-subtle chat-floating-btn"
          title="Falar com a Dom RockFeller Soluções"
        >
          <img 
            src="/lion-icon.png" 
            alt="Atendimento" 
            style={{ width: '42px', height: '42px', objectFit: 'contain' }}
          />
          <span style={{
            position: 'absolute',
            top: '-2px',
            right: '-2px',
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            background: '#F59E0B',
            border: '2px solid #06080D',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.68rem',
            fontWeight: 800,
            color: '#000'
          }}>
            1
          </span>
        </button>
      )}

      {/* Unified Chat Window (No separate tabs - single continuous conversation) */}
      {isOpen && (
        <div 
          className="chat-window-animated"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            width: 'clamp(320px, 92vw, 420px)',
            height: 'clamp(500px, 82vh, 640px)',
            background: '#090C15',
            border: '1.5px solid rgba(245, 158, 11, 0.35)',
            borderRadius: '24px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.9), 0 0 35px rgba(245, 158, 11, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1000,
            overflow: 'hidden'
          }}
        >
          {/* Header */}
          <div style={{
            padding: '16px 20px',
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.16), rgba(12, 16, 26, 0.95))',
            borderBottom: '1px solid rgba(245, 158, 11, 0.2)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'rgba(245, 158, 11, 0.15)',
                border: '1px solid rgba(245, 158, 11, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <img src="/lion-icon.png" alt="Lion" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontWeight: 800, color: '#FFFFFF', fontSize: '0.96rem' }}>
                    {chatMode === 'live' ? `${activeTicket?.assignedTo?.name || 'Consultor Dom RockFeller'}` : 'RockFeller Soluções'}
                  </span>
                  <span style={{ 
                    width: '8px', 
                    height: '8px', 
                    borderRadius: '50%', 
                    background: chatMode === 'queue' ? '#F59E0B' : '#10B981', 
                    display: 'inline-block',
                    boxShadow: chatMode === 'queue' ? '0 0 8px #F59E0B' : '0 0 8px #10B981'
                  }} className={chatMode === 'queue' ? 'animate-pulse-subtle' : ''} />
                </div>
                <div style={{ fontSize: '0.74rem', color: '#FDE68A', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {chatMode === 'live' ? (
                    <span style={{ color: '#34D399', fontWeight: 700 }}>Conectado com Atendente Humano</span>
                  ) : chatMode === 'queue' ? (
                    <span style={{ color: '#FBBF24', fontWeight: 700 }}>Aguardando Atendente na Fila...</span>
                  ) : (
                    <span>Assistente IA &bull; {onlineAgentsCount > 0 ? `${onlineAgentsCount} Suporte Online` : 'Suporte Vitória & Floripa'}</span>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={onToggle}
              className="close-btn"
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: 'none',
                color: '#94A3B8',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Unified Messages History Stream */}
          <div style={{
            flex: 1,
            padding: '18px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
          }}>
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              const isSystem = msg.sender === 'system';
              const isAgent = msg.sender === 'agent';
              const isBot = msg.sender === 'bot';

              if (isSystem) {
                return (
                  <div key={msg.id} style={{ textAlign: 'center', fontSize: '0.78rem', color: '#FDE68A', padding: '8px 14px', background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: '12px' }}>
                    {msg.text}
                  </div>
                );
              }

              return (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isUser ? 'flex-end' : 'flex-start',
                    maxWidth: '100%'
                  }}
                >
                  {/* Sender Name for Agent */}
                  {isAgent && (
                    <span style={{ fontSize: '0.72rem', color: '#34D399', fontWeight: 700, marginBottom: '3px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Headphones size={12} /> {msg.senderName || 'Consultor Dom RockFeller'}
                    </span>
                  )}

                  {/* Message Bubble */}
                  <div
                    style={{
                      maxWidth: '88%',
                      padding: '12px 16px',
                      borderRadius: '16px',
                      background: isUser 
                        ? 'linear-gradient(135deg, #F59E0B, #B45309)' 
                        : isAgent 
                          ? 'rgba(16, 24, 40, 0.98)' 
                          : 'rgba(15, 20, 32, 0.95)',
                      border: isUser 
                        ? 'none' 
                        : isAgent 
                          ? '1px solid rgba(16, 185, 129, 0.4)' 
                          : '1px solid rgba(245, 158, 11, 0.2)',
                      color: isUser ? '#0A0D14' : '#E2E8F0',
                      fontWeight: isUser ? 600 : 400,
                      fontSize: '0.88rem',
                      lineHeight: 1.5,
                      whiteSpace: 'pre-wrap',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.25)'
                    }}
                  >
                    {msg.text}

                    {/* INLINE IN-CHAT FORM FOR COLLECTING USER CONTACT DIRECTLY IN THE CHAT STREAM */}
                    {msg.type === 'human_form' && !msg.submitted && (
                      <div style={{
                        marginTop: '12px',
                        padding: '14px',
                        background: 'rgba(9, 12, 21, 0.95)',
                        border: '1.5px solid rgba(245, 158, 11, 0.4)',
                        borderRadius: '14px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px'
                      }}>
                        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#FBBF24', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Headphones size={15} /> Ficha para Atendimento Humano
                        </div>

                        <div>
                          <label style={{ fontSize: '0.74rem', color: '#94A3B8', display: 'block', marginBottom: '3px' }}>Seu Nome Completo:</label>
                          <input 
                            type="text"
                            value={inChatForm.name}
                            onChange={(e) => setInChatForm(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Ex: Carlos Eduardo Mendes"
                            style={{
                              width: '100%',
                              padding: '8px 10px',
                              background: 'rgba(255, 255, 255, 0.05)',
                              border: '1px solid rgba(245, 158, 11, 0.3)',
                              borderRadius: '8px',
                              color: '#FFFFFF',
                              fontSize: '0.84rem',
                              outline: 'none'
                            }}
                          />
                        </div>

                        <div>
                          <label style={{ fontSize: '0.74rem', color: '#94A3B8', display: 'block', marginBottom: '3px' }}>WhatsApp com DDD:</label>
                          <input 
                            type="tel"
                            value={inChatForm.phone}
                            onChange={(e) => setInChatForm(prev => ({ ...prev, phone: e.target.value }))}
                            placeholder="Ex: (27) 99844-3321"
                            style={{
                              width: '100%',
                              padding: '8px 10px',
                              background: 'rgba(255, 255, 255, 0.05)',
                              border: '1px solid rgba(245, 158, 11, 0.3)',
                              borderRadius: '8px',
                              color: '#FFFFFF',
                              fontSize: '0.84rem',
                              outline: 'none'
                            }}
                          />
                        </div>

                        <div>
                          <label style={{ fontSize: '0.74rem', color: '#94A3B8', display: 'block', marginBottom: '3px' }}>Unidade de Preferência:</label>
                          <select
                            value={inChatForm.cityUnit}
                            onChange={(e) => setInChatForm(prev => ({ ...prev, cityUnit: e.target.value }))}
                            style={{
                              width: '100%',
                              padding: '8px 10px',
                              background: '#0B0F17',
                              border: '1px solid rgba(245, 158, 11, 0.3)',
                              borderRadius: '8px',
                              color: '#FFFFFF',
                              fontSize: '0.84rem',
                              outline: 'none'
                            }}
                          >
                            <option value="Vitória - ES">Sede Vitória - ES</option>
                            <option value="Florianópolis - SC">Sede Florianópolis - SC</option>
                          </select>
                        </div>

                        <button
                          type="button"
                          disabled={isSubmittingForm}
                          onClick={() => handleInChatFormSubmit(msg.id)}
                          style={{
                            marginTop: '4px',
                            background: 'linear-gradient(135deg, #F59E0B, #B45309)',
                            border: 'none',
                            borderRadius: '10px',
                            padding: '10px 14px',
                            color: '#0A0D14',
                            fontWeight: 800,
                            fontSize: '0.84rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            boxShadow: '0 4px 14px rgba(245, 158, 11, 0.3)'
                          }}
                        >
                          {isSubmittingForm ? (
                            <span>Verificando disponibilidade...</span>
                          ) : (
                            <>
                              <Headphones size={16} />
                              <span>Conectar com Consultor</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Action Chips */}
                  {msg.actions && msg.actions.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px', maxWidth: '88%' }}>
                      {msg.actions.map((act, i) => {
                        const isWhatsappAction = act.action === 'open_url' || act.action?.includes('whatsapp');
                        return (
                          <button
                            key={i}
                            onClick={() => handleActionClick(act)}
                            style={{
                              background: isWhatsappAction ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.1)',
                              border: isWhatsappAction ? '1px solid rgba(16, 185, 129, 0.45)' : '1px solid rgba(245, 158, 11, 0.35)',
                              borderRadius: '10px',
                              padding: '8px 12px',
                              color: isWhatsappAction ? '#34D399' : '#FBBF24',
                              fontSize: '0.82rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              gap: '6px',
                              textAlign: 'left',
                              transition: 'all 0.2s',
                              boxShadow: isWhatsappAction ? '0 2px 8px rgba(16, 185, 129, 0.15)' : 'none'
                            }}
                          >
                            <span>{act.label}</span>
                            {isWhatsappAction ? <ArrowUpRight size={14} /> : <ArrowRight size={13} />}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            {isTyping && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#FBBF24', fontSize: '0.8rem', padding: '6px 12px' }}>
                <span className="animate-pulse-subtle">AutoBot está digitando...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Box Footer */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
            style={{
              padding: '12px 16px',
              background: '#070910',
              borderTop: '1px solid rgba(245, 158, 11, 0.16)',
              display: 'flex',
              gap: '8px',
              alignItems: 'center'
            }}
          >
            <input
              type="text"
              placeholder={
                chatMode === 'live' 
                  ? "Digite sua mensagem para o consultor..." 
                  : chatMode === 'queue'
                    ? "Você está na fila. Digite detalhes da sua dúvida..."
                    : "Digite sua dúvida ou peça um atendente..."
              }
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{
                flex: 1,
                background: 'rgba(255, 255, 255, 0.05)',
                border: chatMode === 'live' ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(245, 158, 11, 0.25)',
                borderRadius: '12px',
                padding: '10px 14px',
                color: '#FFFFFF',
                fontSize: '0.88rem',
                outline: 'none'
              }}
            />
            <button
              type="submit"
              disabled={!input.trim()}
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: input.trim() ? 'linear-gradient(135deg, #F59E0B, #B45309)' : 'rgba(255, 255, 255, 0.08)',
                border: 'none',
                color: input.trim() ? '#0A0D14' : '#64748B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: input.trim() ? 'pointer' : 'default',
                transition: 'all 0.2s',
                fontWeight: 700
              }}
            >
              <Send size={17} />
            </button>
          </form>

        </div>
      )}
    </>
  );
}
