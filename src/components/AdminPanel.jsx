import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, Search, Filter, ShieldCheck, Download, Plus, Trash2, Edit3, MessageSquare, 
  CheckCircle, Clock, AlertTriangle, Building2, Car, Banknote, TrendingUp, RefreshCw,
  X, Check, Lock, LogOut, ChevronRight, FileText, Crown, UserCheck, ShieldAlert,
  Headphones, Send, Radio, UserX, Sparkles, Zap, Shield, HelpCircle
} from 'lucide-react';
import { api } from '../services/api';
import { SocialProspectRadar } from './SocialProspectRadar';

// Sugestões de Textos Automáticos do que dizer na Central de Atendimento ao Vivo
const QUICK_REPLIES = [
  {
    category: '👋 Boas-Vindas',
    id: 'bv-1',
    label: 'Apresentação Inicial',
    text: 'Olá! Sou consultor da Dom RockFeller Soluções. Estou à disposição para orientar sobre a perícia de juros abusivos e a ação revisional do seu veículo. Como posso te auxiliar hoje?'
  },
  {
    category: '👋 Boas-Vindas',
    id: 'bv-2',
    label: 'Solicitar Dados do Caso',
    text: 'Prazer em falar com você! Localizei sua solicitação no sistema. Você possui em mãos o contrato de financiamento ou o CRLV do veículo para iniciarmos a auditoria pericial?'
  },
  {
    category: '⚖️ Ação Revisional',
    id: 'rev-1',
    label: 'Como Funciona a Perícia',
    text: 'Nossa equipe contábil audita o contrato para expurgar anatocismo ilegal e tarifas indevidas, instruindo uma ação revisional legítima na Justiça fundamentada no Código de Defesa do Consumidor e súmulas do STJ.'
  },
  {
    category: '⚖️ Ação Revisional',
    id: 'rev-2',
    label: 'Cálculo Incontroverso',
    text: 'Calculamos a prestação real incontroversa para requerer autorização de depósito em juízo, garantindo total fundamentação jurídica para a negociação da quitação por valor justo.'
  },
  {
    category: '🛡️ Busca e Apreensão',
    id: 'ba-1',
    label: 'Alerta Decreto-Lei 911/69',
    text: 'Mantemos você 100% ciente dos riscos de busca e apreensão. Por isso, ajuizamos a ação com pedido liminar de tutela de urgência e depósito judicial incontroverso para salvaguardar o veículo.'
  },
  {
    category: '🛡️ Busca e Apreensão',
    id: 'ba-2',
    label: 'Parcelas em Atraso / Notificação',
    text: 'Se houver parcelas atrasadas ou notificação bancária, ativamos o monitoramento processual contínuo nos tribunais e preparamos a defesa prévia contra eventuais mandados.'
  },
  {
    category: '📄 Documentos',
    id: 'doc-1',
    label: 'Pedir CRLV e Contrato',
    text: 'Por gentileza, nos envie fotos legíveis do CRLV (documento do carro), da CNH e do contrato de financiamento ou extrato bancário para emitirmos o laudo pericial preliminar.'
  },
  {
    category: '📄 Documentos',
    id: 'doc-2',
    label: 'Confirmar Parcelas e Banco',
    text: 'Poderia nos confirmar o banco credor atual, o valor exato da parcela mensal e quantas prestações ainda faltam para quitar o veículo?'
  },
  {
    category: '🤝 Acordo & Pagamento',
    id: 'ac-1',
    label: 'Mesa de Acordo Aberta',
    text: 'Excelente notícia! O banco credor aceitou abrir mesa de conciliação judicial com proposta para quitação antecipada com redução expressiva das parcelas futuras.'
  },
  {
    category: '🤝 Acordo & Pagamento',
    id: 'ac-2',
    label: 'Acordo Homologado & Boleto',
    text: 'O acordo judicial foi homologado pelo juiz! O boleto oficial emitido pelo banco credor já está disponível para liquidação. Após o pagamento, o gravame será desalienado no DETRAN.'
  },
  {
    category: '📍 Sedes Físicas',
    id: 'loc-1',
    label: 'Convite Sede Vitória (ES)',
    text: 'Gostaria de agendar uma visita presencial em nossa sede no Centro Empresarial Vitória (Av. Américo Buaiz, 501, Enseada do Suá)? Será um prazer tomar um café e revisar os autos pessoalmente.'
  },
  {
    category: '📍 Sedes Físicas',
    id: 'loc-2',
    label: 'Convite Sede Floripa (SC)',
    text: 'Podemos agendar um horário em nosso escritório de Florianópolis (Ed. Premier Tower - Av. Rio Branco, 847, Centro)? Nossos consultores jurídicos receberão você com total comodidade.'
  }
];

// Custom Luxury Black & Gold Checkbox with Micro-animations
function LuxuryCheckbox({ checked, indeterminate, onChange, title, id, label }) {
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = Boolean(indeterminate);
    }
  }, [indeterminate]);

  return (
    <label
      htmlFor={id}
      className={`luxury-checkbox-wrapper ${checked ? 'is-checked' : ''} ${indeterminate ? 'is-indeterminate' : ''}`}
      onClick={(e) => {
        // Evita borbulhamento para o clique da linha não disparar duas vezes
        e.stopPropagation();
      }}
      title={title}
    >
      <input
        ref={inputRef}
        type="checkbox"
        id={id}
        checked={Boolean(checked)}
        onChange={onChange}
        className="luxury-checkbox-native"
      />
      <span className="luxury-checkbox-box">
        {checked ? (
          <Check size={13} strokeWidth={3.5} className="luxury-checkbox-icon" />
        ) : indeterminate ? (
          <span className="luxury-checkbox-dash" />
        ) : null}
      </span>
      {label && <span style={{ fontSize: '0.82rem', color: '#E2E8F0', fontWeight: 600 }}>{label}</span>}
    </label>
  );
}

export function AdminPanel({ currentUser, onBackToSite, onOpenAuth }) {
  // Tabs: 'leads' (Gestão de Contratos) | 'queue' (Chat ao Vivo) | 'users' (RBAC)
  const [activeTab, setActiveTab] = useState('leads');

  // Leads & Stats
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Users Management (Admin Exclusive)
  const [usersList, setUsersList] = useState([]);
  const [userActionSuccess, setUserActionSuccess] = useState('');

  // Live Chat Queue (Admin & Funcionario)
  const [chatQueue, setChatQueue] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [staffReplyText, setStaffReplyText] = useState('');
  const [activeQuickCategory, setActiveQuickCategory] = useState('Todas');
  const [isStaffOnline, setIsStaffOnline] = useState(currentUser?.isOnline ?? true);
  const queuePollRef = useRef(null);

  // Filters for Contracts
  const [searchTerm, setSearchTerm] = useState('');
  const [unitFilter, setUnitFilter] = useState('Todas');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [paymentFilter, setPaymentFilter] = useState('Todos');
  const [quickFilterStatus, setQuickFilterStatus] = useState('Todos');

  // Bulk actions on contracts (Seleção Múltipla)
  const [selectedLeadIds, setSelectedLeadIds] = useState(new Set());
  const [bulkTargetStatus, setBulkTargetStatus] = useState('Ação Revisional Protocolada');
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);

  // Selected lead for detail modal
  const [selectedLead, setSelectedLead] = useState(null);
  const [newNoteText, setNewNoteText] = useState('');

  // New contract modal
  const [isNewLeadModalOpen, setIsNewLeadModalOpen] = useState(false);
  const [newLeadForm, setNewLeadForm] = useState({
    name: '',
    phone: '',
    email: '',
    cityUnit: 'Vitória - ES',
    vehicleType: 'Carro',
    vehicleModel: '',
    vehiclePlate: '',
    processNumber: '',
    bank: 'BV Financeira',
    installmentValue: 1800,
    installmentsRemaining: 36,
    delayStatus: 'Em dia',
    status: 'Ficha em Análise',
    paymentStatus: 'Pendente',
    initialNote: ''
  });

  // Load leads, queue and users
  const loadData = async () => {
    setLoading(true);
    try {
      const data = await api.getLeads({
        search: searchTerm,
        unit: unitFilter,
        status: statusFilter
      });
      setLeads(data);
      const s = await api.getStats();
      setStats(s);

      const q = await api.getChatQueue();
      setChatQueue(q || []);
      
      if (currentUser?.role === 'admin') {
        const u = await api.getUsers();
        setUsersList(u);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [searchTerm, unitFilter, statusFilter, currentUser]);

  // Periodic polling for chat queue updates
  useEffect(() => {
    queuePollRef.current = setInterval(async () => {
      const q = await api.getChatQueue();
      if (q) setChatQueue(q);

      if (selectedTicket) {
        const updated = await api.getTicket(selectedTicket.id);
        if (updated) setSelectedTicket(updated);
      }
    }, 2500);

    return () => {
      if (queuePollRef.current) clearInterval(queuePollRef.current);
    };
  }, [selectedTicket]);

  // Toggle online/offline status for agent
  const handleToggleOnline = async () => {
    const next = !isStaffOnline;
    setIsStaffOnline(next);
    if (currentUser?.id) {
      await api.toggleAgentStatus(currentUser.id, next);
    }
  };

  // Staff assumes ticket
  const handleAssignTicket = async (ticket) => {
    const updated = await api.assignTicket(ticket.id, {
      agentId: currentUser?.id || 'staff-1',
      agentName: currentUser?.name || 'Consultor Dom RockFeller',
      agentRole: currentUser?.role || 'funcionario'
    });
    setSelectedTicket(updated);
    const q = await api.getChatQueue();
    setChatQueue(q);
  };

  // Staff sends message to ticket
  const handleSendStaffMessage = async (e) => {
    e.preventDefault();
    if (!staffReplyText.trim() || !selectedTicket) return;

    await api.sendTicketMessage(selectedTicket.id, {
      sender: 'atendente',
      senderName: currentUser?.name || 'Atendente Dom RockFeller',
      text: staffReplyText
    });
    setStaffReplyText('');

    const updated = await api.getTicket(selectedTicket.id);
    setSelectedTicket(updated);
    const q = await api.getChatQueue();
    setChatQueue(q);
  };

  // Staff sends pre-written quick reply directly with 1-click
  const handleSendQuickMessage = async (textToSend) => {
    if (!textToSend?.trim() || !selectedTicket) return;
    await api.sendTicketMessage(selectedTicket.id, {
      sender: 'atendente',
      senderName: currentUser?.name || 'Consultor Dom RockFeller',
      text: textToSend
    });
    const updated = await api.getTicket(selectedTicket.id);
    setSelectedTicket(updated);
    const q = await api.getChatQueue();
    setChatQueue(q);
  };

  const getStatusClass = (st) => {
    if (!st) return 'status-analise';
    if (st.includes('Pago') || st.includes('Quitado')) return 'status-pago';
    if (st.includes('Homologado') || st.includes('Acordo') || st.includes('Proposta')) return 'status-homologado';
    if (st.includes('Ação') || st.includes('Depósito') || st.includes('Processo')) return 'status-processo';
    if (st.includes('Pendente')) return 'status-pendente';
    return 'status-analise';
  };

  // Staff closes ticket
  const handleCloseTicket = async (ticketId) => {
    await api.closeTicket(ticketId);
    const updated = await api.getTicket(ticketId);
    setSelectedTicket(updated);
    const q = await api.getChatQueue();
    setChatQueue(q);
  };

  // Role Change (Only Admin)
  const handleRoleChange = async (userId, targetRole) => {
    if (!currentUser || currentUser.role !== 'admin') {
      alert('Apenas administradores podem alterar níveis de conta.');
      return;
    }

    const res = await api.updateUserRole(userId, targetRole);
    if (res.success) {
      setUserActionSuccess(`Nível do usuário atualizado para ${targetRole.toUpperCase()} com sucesso!`);
      setTimeout(() => setUserActionSuccess(''), 4000);
      const updated = await api.getUsers();
      setUsersList(updated);
    } else {
      alert(res.message || 'Erro ao alterar nível.');
    }
  };

  const handleUpdateStatus = async (leadId, newStatus) => {
    await api.updateLead(leadId, { status: newStatus });
    loadData();
    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead((prev) => ({ ...prev, status: newStatus }));
    }
  };

  const handleAddNote = async (leadId) => {
    if (!newNoteText.trim()) return;
    await api.updateLead(leadId, {
      noteText: newNoteText,
      noteAuthor: `Assessor Dom RockFeller (${currentUser?.name || 'Atendimento'})`
    });
    setNewNoteText('');
    loadData();
    const updated = await api.getLeads();
    const l = updated.find(x => x.id === leadId);
    if (l) setSelectedLead(l);
  };

  const handleDeleteLead = async (leadId) => {
    if (window.confirm('Tem certeza que deseja excluir este contrato do sistema?')) {
      await api.deleteLead(leadId);
      if (selectedLead?.id === leadId) setSelectedLead(null);
      loadData();
    }
  };

  const handleTogglePaymentStatus = async (leadId, currentPayment) => {
    const nextPayment = currentPayment === 'Pago' ? 'Pendente' : 'Pago';
    await api.updateLead(leadId, { 
      paymentStatus: nextPayment,
      noteText: `Status financeiro do contrato alterado para: ${nextPayment.toUpperCase()}.`,
      noteAuthor: `Assessor Dom RockFeller (${currentUser?.name || 'Admin'})`
    });
    loadData();
    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead(prev => ({ ...prev, paymentStatus: nextPayment }));
    }
  };

  // ================= BULK ACTIONS HANDLERS =================
  const handleToggleSelectOne = (id) => {
    setSelectedLeadIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleToggleSelectAll = (displayedLeads) => {
    const displayedIds = displayedLeads.map(l => l.id);
    const allSelected = displayedIds.length > 0 && displayedIds.every(id => selectedLeadIds.has(id));
    
    setSelectedLeadIds(prev => {
      const next = new Set(prev);
      if (allSelected) {
        displayedIds.forEach(id => next.delete(id));
      } else {
        displayedIds.forEach(id => next.add(id));
      }
      return next;
    });
  };

  const handleClearSelection = () => {
    setSelectedLeadIds(new Set());
  };

  const handleBulkUpdateStatus = async () => {
    if (selectedLeadIds.size === 0) return;
    setIsBulkProcessing(true);
    try {
      await api.bulkUpdateStatus(Array.from(selectedLeadIds), bulkTargetStatus, `Diretoria Dom RockFeller (${currentUser?.name || 'Admin'})`);
      await loadData();
      setSelectedLeadIds(new Set());
    } finally {
      setIsBulkProcessing(false);
    }
  };

  const handleBulkUpdatePayment = async (newPayment) => {
    if (selectedLeadIds.size === 0) return;
    setIsBulkProcessing(true);
    try {
      await api.bulkUpdatePayment(Array.from(selectedLeadIds), newPayment, `Diretoria Dom RockFeller (${currentUser?.name || 'Admin'})`);
      await loadData();
      setSelectedLeadIds(new Set());
    } finally {
      setIsBulkProcessing(false);
    }
  };

  const handleBulkDelete = async () => {
    const count = selectedLeadIds.size;
    if (count === 0) return;
    if (window.confirm(`Tem certeza que deseja excluir ${count} contrato(s) selecionado(s) em massa? Esta ação é irreversível.`)) {
      setIsBulkProcessing(true);
      try {
        await api.bulkDeleteLeads(Array.from(selectedLeadIds));
        await loadData();
        setSelectedLeadIds(new Set());
      } finally {
        setIsBulkProcessing(false);
      }
    }
  };

  const handleBulkExportCSV = () => {
    const selectedLeads = leads.filter(l => selectedLeadIds.has(l.id));
    if (!selectedLeads.length) return;
    const headers = ['ID', 'Nome', 'Telefone', 'Email', 'Sede', 'Veiculo', 'Placa', 'Processo', 'Banco', 'Parcela', 'Restantes', 'Saldo Residual', 'Quitacao Estimada', 'Status Processo', 'Status Financeiro'];
    const rows = selectedLeads.map(l => [
      l.id,
      `"${l.name}"`,
      `"${l.phone}"`,
      `"${l.email || ''}"`,
      `"${l.cityUnit}"`,
      `"${l.vehicleModel}"`,
      `"${l.vehiclePlate || ''}"`,
      `"${l.processNumber || ''}"`,
      `"${l.bank}"`,
      l.installmentValue,
      l.installmentsRemaining,
      l.contractResidualTotal,
      l.estimatedPayoff,
      `"${l.status}"`,
      `"${l.paymentStatus || 'Pendente'}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `domrockfeller_contratos_selecionados_${selectedLeads.length}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreateLead = async (e) => {
    e.preventDefault();
    const payload = {
      ...newLeadForm,
      notes: newLeadForm.initialNote ? [
        {
          date: new Date().toISOString(),
          author: `Assessor Dom RockFeller (${currentUser?.name || 'Administrador'})`,
          text: newLeadForm.initialNote
        }
      ] : []
    };
    await api.createLead(payload);
    setIsNewLeadModalOpen(false);
    setNewLeadForm({
      name: '',
      phone: '',
      email: '',
      cityUnit: 'Vitória - ES',
      vehicleType: 'Carro',
      vehicleModel: '',
      vehiclePlate: '',
      processNumber: '',
      bank: 'BV Financeira',
      installmentValue: 1800,
      installmentsRemaining: 36,
      delayStatus: 'Em dia',
      status: 'Ficha em Análise',
      paymentStatus: 'Pendente',
      initialNote: ''
    });
    loadData();
  };

  const handleResetDemo = async () => {
    if (window.confirm('Deseja restaurar a base de clientes com os dados originais de demonstração?')) {
      await api.resetDemoData();
      loadData();
    }
  };

  const exportToCSV = () => {
    if (!leads.length) return;
    const headers = ['ID', 'Nome', 'Telefone', 'Email', 'Sede', 'Veiculo', 'Banco', 'Parcela', 'Restantes', 'Saldo Contratual', 'Quitacao Estimada', 'Economia', 'Desconto %', 'Status'];
    const rows = leads.map(l => [
      l.id,
      `"${l.name}"`,
      `"${l.phone}"`,
      `"${l.email || ''}"`,
      `"${l.cityUnit}"`,
      `"${l.vehicleModel}"`,
      `"${l.bank}"`,
      l.installmentValue,
      l.installmentsRemaining,
      l.contractResidualTotal,
      l.estimatedPayoff,
      l.estimatedSavings,
      l.discountPercentage,
      `"${l.status}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `domrockfeller_clientes_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Permitted roles: 'admin' or 'funcionario'
  const isAuthorizedStaff = currentUser && (currentUser.role === 'admin' || currentUser.role === 'funcionario');

  if (!isAuthorizedStaff) {
    return (
      <div style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px'
      }}>
        <div className="glass-card" style={{ maxWidth: '480px', width: '100%', padding: '40px', textAlign: 'center' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '20px',
            background: 'rgba(245, 158, 11, 0.15)',
            border: '1px solid rgba(245, 158, 11, 0.35)',
            color: '#FBBF24',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px'
          }}>
            <Lock size={32} />
          </div>

          <h2 style={{ fontSize: '1.7rem', color: '#FFFFFF', marginBottom: '8px' }}>
            Acesso Restrito à Equipe
          </h2>
          
          <p style={{ fontSize: '0.92rem', color: '#94A3B8', marginBottom: '26px', lineHeight: 1.6 }}>
            {currentUser ? (
              <>Você está conectado como <strong>{currentUser.name}</strong> com perfil <strong>CLIENTE</strong>. Esta área é restrita a Administradores e Atendentes da Dom RockFeller.</>
            ) : (
              <>É necessário fazer login com uma conta de <strong>Administrador</strong> ou <strong>Atendente/Funcionário</strong> para acessar o gerenciamento e a fila de chat.</>
            )}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button 
              onClick={onOpenAuth} 
              className="btn btn-gold btn-lg" 
              style={{ width: '100%' }}
            >
              <Crown size={18} />
              <span>Entrar com Login da Equipe</span>
            </button>

            <button
              onClick={onBackToSite}
              className="btn btn-secondary"
              style={{ width: '100%' }}
            >
              Voltar ao Site Principal
            </button>
          </div>
        </div>
      </div>
    );
  }

  const waitingCount = chatQueue.filter(t => t.status === 'aguardando').length;

  return (
    <div style={{ padding: '30px 0 80px', minHeight: '90vh' }}>
      <div className="container">
        
        {/* Top Header Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '28px',
          paddingBottom: '20px',
          borderBottom: '1px solid rgba(245, 158, 11, 0.2)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="badge badge-gold">
                {currentUser.role === 'admin' ? <Crown size={14} /> : <Headphones size={14} />}
                {currentUser.role === 'admin' ? 'Painel da Diretoria' : 'Painel do Atendente'}
              </span>
              <span style={{
                fontSize: '0.75rem',
                padding: '4px 10px',
                borderRadius: '20px',
                background: isStaffOnline ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                color: isStaffOnline ? '#34D399' : '#F87171',
                border: `1px solid ${isStaffOnline ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontWeight: 700
              }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: isStaffOnline ? '#10B981' : '#EF4444' }} />
                {isStaffOnline ? 'DISPONÍVEL PARA ATENDER' : 'OFFLINE'}
              </span>
            </div>
            <h1 style={{ fontSize: '2rem', color: '#FFFFFF', marginTop: '8px' }}>
              RockFeller Soluções &bullet; Central de Operações
            </h1>
            <p style={{ fontSize: '0.9rem', color: '#94A3B8' }}>
              Atendimento em tempo real, gestão de contratos fiduciários e negociações bancárias.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {/* Toggle Online status button */}
            <button
              onClick={handleToggleOnline}
              className={`btn btn-sm ${isStaffOnline ? 'btn-secondary' : 'btn-gold'}`}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <Radio size={14} color={isStaffOnline ? '#10B981' : '#FBBF24'} />
              <span>{isStaffOnline ? 'Ficar Offline' : 'Ficar Online no Chat'}</span>
            </button>

            <button
              onClick={() => setIsNewLeadModalOpen(true)}
              className="btn btn-gold btn-sm"
              style={{ fontWeight: 700 }}
            >
              <Plus size={16} /> + Adicionar Contrato / Processo
            </button>

            <button
              onClick={exportToCSV}
              className="btn btn-secondary btn-sm"
              title="Exportar base para planilha CSV"
            >
              <Download size={16} /> Exportar CSV
            </button>

            <button
              onClick={onBackToSite}
              className="btn btn-secondary btn-sm"
            >
              Voltar ao Site
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div style={{
          display: 'flex',
          gap: '10px',
          borderBottom: '1px solid rgba(245, 158, 11, 0.15)',
          marginBottom: '26px',
          overflowX: 'auto'
        }}>
          <button
            type="button"
            onClick={() => setActiveTab('leads')}
            style={{
              padding: '12px 20px',
              border: 'none',
              borderBottom: activeTab === 'leads' ? '3px solid #F59E0B' : '3px solid transparent',
              background: 'transparent',
              color: activeTab === 'leads' ? '#FBBF24' : '#94A3B8',
              fontWeight: 700,
              fontSize: '0.95rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              whiteSpace: 'nowrap'
            }}
          >
            <Banknote size={18} />
            <span>Gestão de Contratos ({leads.length})</span>
          </button>

          {/* Live Support Queue Tab (For Admin and Funcionario) */}
          <button
            type="button"
            onClick={() => setActiveTab('queue')}
            style={{
              padding: '12px 20px',
              border: 'none',
              borderBottom: activeTab === 'queue' ? '3px solid #F59E0B' : '3px solid transparent',
              background: 'transparent',
              color: activeTab === 'queue' ? '#FBBF24' : '#94A3B8',
              fontWeight: 700,
              fontSize: '0.95rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              whiteSpace: 'nowrap'
            }}
          >
            <Headphones size={18} />
            <span>Central de Chat ao Vivo</span>
            {waitingCount > 0 && (
              <span style={{
                background: '#EF4444',
                color: '#FFFFFF',
                fontSize: '0.72rem',
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: '12px'
              }}>
                {waitingCount} na fila
              </span>
            )}
          </button>

          {/* User management tab (ONLY FOR ADMIN) */}
          {currentUser.role === 'admin' && (
            <button
              type="button"
              onClick={() => setActiveTab('users')}
              style={{
                padding: '12px 20px',
                border: 'none',
                borderBottom: activeTab === 'users' ? '3px solid #F59E0B' : '3px solid transparent',
                background: 'transparent',
                color: activeTab === 'users' ? '#FBBF24' : '#94A3B8',
                fontWeight: 700,
                fontSize: '0.95rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                whiteSpace: 'nowrap'
              }}
            >
              <Crown size={18} />
              <span>Controle de Níveis de Usuários ({usersList.length})</span>
            </button>
          )}

          {/* Social Prospect Radar Tab */}
          <button
            type="button"
            onClick={() => setActiveTab('prospects')}
            style={{
              padding: '12px 20px',
              border: 'none',
              borderBottom: activeTab === 'prospects' ? '3px solid #F59E0B' : '3px solid transparent',
              background: 'transparent',
              color: activeTab === 'prospects' ? '#FBBF24' : '#94A3B8',
              fontWeight: 700,
              fontSize: '0.95rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              whiteSpace: 'nowrap'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
            </svg>
            <span>🎯 Radar de Clientes (Instagram)</span>
          </button>
        </div>

        {/* ================= TAB 1: LEADS & CLIENTES ================= */}
        {activeTab === 'leads' && (
          <>
            {/* Metric Cards KPI */}
            <div className="grid-4" style={{ marginBottom: '32px' }}>
              <div className="glass-card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94A3B8', fontSize: '0.85rem' }}>
                  <span>Total de Negociações</span>
                  <Users size={18} color="#FBBF24" />
                </div>
                <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#FFFFFF', margin: '8px 0 4px' }}>
                  {stats?.totalLeads || leads.length}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>
                  ES: <strong style={{ color: '#FBBF24' }}>{stats?.unitVitoria || 0}</strong> &bull; SC: <strong style={{ color: '#60A5FA' }}>{stats?.unitFloripa || 0}</strong>
                </div>
              </div>

              <div className="glass-card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94A3B8', fontSize: '0.85rem' }}>
                  <span>Dívidas Mapeadas</span>
                  <Banknote size={18} color="#FBBF24" />
                </div>
                <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#FBBF24', margin: '8px 0 4px' }}>
                  R$ {((stats?.totalResidual || 0) / 1000).toFixed(0)} mil
                </div>
                <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>
                  Volume residual sob assessoria
                </div>
              </div>

              <div className="glass-card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94A3B8', fontSize: '0.85rem' }}>
                  <span>Economia Estimada</span>
                  <TrendingUp size={18} color="#FDE68A" />
                </div>
                <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#FDE68A', margin: '8px 0 4px' }}>
                  R$ {((stats?.totalEstimatedSavings || 0) / 1000).toFixed(0)} mil
                </div>
                <div style={{ fontSize: '0.78rem', color: '#FBBF24', fontWeight: 600 }}>
                  ~68% de desconto médio
                </div>
              </div>

              <div className="glass-card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94A3B8', fontSize: '0.85rem' }}>
                  <span>Veículos Quitados</span>
                  <CheckCircle size={18} color="#10B981" />
                </div>
                <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#34D399', margin: '8px 0 4px' }}>
                  {stats?.completedLeads || 0}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>
                  Gravames desalienados no DETRAN
                </div>
              </div>
            </div>

            {/* Quick Status Tabs (Filtros Rápidos em 1 Clique) */}
            <div style={{
              display: 'flex',
              gap: '8px',
              overflowX: 'auto',
              marginBottom: '18px',
              paddingBottom: '4px'
            }}>
              {[
                { id: 'Todos', label: 'Todos os Contratos', count: leads.length },
                { id: 'Ficha em Análise', label: '📋 Ficha em Análise', count: leads.filter(l => l.status === 'Ficha em Análise' || l.status === 'Em Análise').length },
                { id: 'Pendente', label: '⏳ Pendente', count: leads.filter(l => l.status === 'Pendente Documentação' || l.paymentStatus === 'Pendente').length },
                { id: 'Ação Revisional', label: '⚖️ Ação Revisional', count: leads.filter(l => l.status.includes('Ação') || l.status.includes('Depósito')).length },
                { id: 'Acordo', label: '🤝 Acordo Homologado', count: leads.filter(l => l.status.includes('Acordo') || l.status.includes('Negociação')).length },
                { id: 'Pago', label: '✅ Pago / Baixa de Gravame', count: leads.filter(l => l.paymentStatus === 'Pago' || l.status.includes('Pago') || l.status.includes('Quitado')).length }
              ].map(pill => (
                <button
                  key={pill.id}
                  type="button"
                  onClick={() => setQuickFilterStatus(pill.id)}
                  style={{
                    padding: '7px 14px',
                    borderRadius: '20px',
                    border: quickFilterStatus === pill.id ? '1.5px solid #F59E0B' : '1px solid rgba(255, 255, 255, 0.08)',
                    background: quickFilterStatus === pill.id ? 'rgba(245, 158, 11, 0.22)' : 'rgba(255, 255, 255, 0.03)',
                    color: quickFilterStatus === pill.id ? '#FDE68A' : '#94A3B8',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span>{pill.label}</span>
                  <span style={{
                    background: quickFilterStatus === pill.id ? '#F59E0B' : 'rgba(255, 255, 255, 0.1)',
                    color: quickFilterStatus === pill.id ? '#0A0D14' : '#E2E8F0',
                    fontSize: '0.72rem',
                    padding: '1px 6px',
                    borderRadius: '10px',
                    fontWeight: 800
                  }}>
                    {pill.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Filter Toolbar */}
            <div className="glass-card" style={{ padding: '16px 20px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
                
                <div style={{ flex: '1 1 240px', position: 'relative' }}>
                  <Search size={16} color="#64748B" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Buscar por nome, placa, modelo, banco ou processo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ paddingLeft: '38px', height: '42px', fontSize: '0.88rem' }}
                  />
                </div>

                <div style={{ flex: '0 1 170px' }}>
                  <select
                    className="form-select"
                    value={unitFilter}
                    onChange={(e) => setUnitFilter(e.target.value)}
                    style={{ height: '42px', fontSize: '0.88rem' }}
                  >
                    <option value="Todas">Todas as Sedes</option>
                    <option value="Vitória - ES">Vitória - ES</option>
                    <option value="Florianópolis - SC">Florianópolis - SC</option>
                  </select>
                </div>

                <div style={{ flex: '0 1 180px' }}>
                  <select
                    className="form-select"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    style={{ height: '42px', fontSize: '0.88rem' }}
                  >
                    <option value="Todos">Status do Processo</option>
                    <option value="Ficha em Análise">Ficha em Análise</option>
                    <option value="Pendente Documentação">Pendente Documentação</option>
                    <option value="Ação Revisional Protocolada">Ação Revisional Protocolada</option>
                    <option value="Depósito Incontroverso Ativo">Depósito Incontroverso Ativo</option>
                    <option value="Acordo em Negociação">Acordo em Negociação</option>
                    <option value="Acordo Homologado (Pendente Pagamento)">Acordo Homologado</option>
                    <option value="Pago / Baixa de Gravame">Pago / Baixa de Gravame</option>
                  </select>
                </div>

                <div style={{ flex: '0 1 170px' }}>
                  <select
                    className="form-select"
                    value={paymentFilter}
                    onChange={(e) => setPaymentFilter(e.target.value)}
                    style={{ height: '42px', fontSize: '0.88rem' }}
                  >
                    <option value="Todos">Status Financeiro</option>
                    <option value="Pago">🟢 Pago / Liquidado</option>
                    <option value="Pendente">🟠 Pendente</option>
                    <option value="Em Negociação">🔵 Em Negociação</option>
                  </select>
                </div>

              </div>
            </div>

            {/* Bulk Actions Floating Toolbar (Aparece com animação suave quando houver contratos selecionados) */}
            {selectedLeadIds.size > 0 && (
              <div 
                className="bulk-floating-toolbar"
                style={{
                  background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.22), rgba(12, 16, 25, 0.98))',
                  border: '1.5px solid #F59E0B',
                  borderRadius: '16px',
                  padding: '14px 22px',
                  marginBottom: '18px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span 
                    key={selectedLeadIds.size}
                    className="bulk-count-badge"
                    style={{
                      background: 'linear-gradient(135deg, #FFF1B8 0%, #F59E0B 50%, #D97706 100%)',
                      color: '#0A0D14',
                      padding: '5px 14px',
                      borderRadius: '16px',
                      fontWeight: 800,
                      fontSize: '0.84rem',
                      boxShadow: '0 0 12px rgba(245, 158, 11, 0.4)'
                    }}
                  >
                    <Check size={14} strokeWidth={3} style={{ marginRight: '6px' }} />
                    {selectedLeadIds.size} {selectedLeadIds.size === 1 ? 'contrato selecionado' : 'contratos selecionados'}
                  </span>
                  <span style={{ fontSize: '0.9rem', color: '#FFFFFF', fontWeight: 700 }}>
                    Ações em Massa nos Contratos:
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  {/* Mudar Status em Massa */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <select
                      className="form-select"
                      value={bulkTargetStatus}
                      onChange={(e) => setBulkTargetStatus(e.target.value)}
                      style={{ padding: '6px 10px', height: '36px', fontSize: '0.82rem', width: 'auto' }}
                    >
                      <option value="Ficha em Análise">📋 Ficha em Análise</option>
                      <option value="Pendente Documentação">⏳ Pendente Documentação</option>
                      <option value="Ação Revisional Protocolada">⚖️ Ação Revisional Protocolada</option>
                      <option value="Depósito Incontroverso Ativo">🏛️ Depósito Incontroverso Ativo</option>
                      <option value="Acordo em Negociação">🤝 Acordo em Negociação</option>
                      <option value="Acordo Homologado (Pendente Pagamento)">📜 Acordo Homologado</option>
                      <option value="Pago / Baixa de Gravame">✅ Pago / Baixa de Gravame</option>
                    </select>
                    <button
                      type="button"
                      disabled={isBulkProcessing}
                      onClick={handleBulkUpdateStatus}
                      className="btn btn-gold btn-sm"
                      style={{ padding: '6px 12px', fontSize: '0.8rem', fontWeight: 800 }}
                    >
                      {isBulkProcessing ? 'Atualizando...' : 'Aplicar Status'}
                    </button>
                  </div>

                  {/* Marcar Pago */}
                  <button
                    type="button"
                    disabled={isBulkProcessing}
                    onClick={() => handleBulkUpdatePayment('Pago')}
                    className="btn btn-secondary btn-sm"
                    style={{ color: '#34D399', borderColor: '#10B981', padding: '6px 12px', fontSize: '0.8rem', fontWeight: 700 }}
                    title="Marcar todos os contratos selecionados como PAGO"
                  >
                    Marcar Pago ({selectedLeadIds.size})
                  </button>

                  {/* Marcar Pendente */}
                  <button
                    type="button"
                    disabled={isBulkProcessing}
                    onClick={() => handleBulkUpdatePayment('Pendente')}
                    className="btn btn-secondary btn-sm"
                    style={{ color: '#FBBF24', borderColor: '#F59E0B', padding: '6px 12px', fontSize: '0.8rem', fontWeight: 700 }}
                    title="Marcar todos os contratos selecionados como PENDENTE"
                  >
                    Marcar Pendente ({selectedLeadIds.size})
                  </button>

                  {/* Exportar Selecionados */}
                  <button
                    type="button"
                    onClick={handleBulkExportCSV}
                    className="btn btn-secondary btn-sm"
                    style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                    title="Exportar contratos selecionados em planilha CSV"
                  >
                    <Download size={14} /> Exportar ({selectedLeadIds.size})
                  </button>

                  {/* Excluir Selecionados */}
                  <button
                    type="button"
                    disabled={isBulkProcessing}
                    onClick={handleBulkDelete}
                    className="btn btn-secondary btn-sm"
                    style={{ color: '#F87171', borderColor: 'rgba(239, 68, 68, 0.4)', padding: '6px 12px', fontSize: '0.8rem' }}
                    title="Excluir contratos selecionados"
                  >
                    <Trash2 size={14} /> Excluir
                  </button>

                  {/* Desmarcar Todos */}
                  <button
                    type="button"
                    onClick={handleClearSelection}
                    className="btn btn-secondary btn-sm"
                    style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                    title="Desmarcar todos"
                  >
                    <X size={14} /> Desmarcar
                  </button>
                </div>
              </div>
            )}

            {/* Contracts Data Table */}
            <div className="glass-card" style={{ overflow: 'hidden' }}>
              {/* Interactive Selection Hint & Active Counter */}
              <div style={{
                padding: '14px 20px',
                borderBottom: '1px solid rgba(245, 158, 11, 0.12)',
                background: 'rgba(255, 255, 255, 0.015)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px'
              }}>
                <div className="selection-hint-pill">
                  <Sparkles size={14} color="#FBBF24" />
                  <span><strong>Seleção Rápida:</strong> Clique em qualquer parte da linha de um contrato para selecioná-lo ou desmarcá-lo instantaneamente.</span>
                </div>
                {selectedLeadIds.size > 0 && (
                  <div style={{ fontSize: '0.82rem', color: '#FDE68A', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#F59E0B', boxShadow: '0 0 8px #F59E0B' }} />
                    <span><strong>{selectedLeadIds.size}</strong> contrato(s) selecionado(s) para ações conjuntas</span>
                  </div>
                )}
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                  {(() => {
                    const displayed = leads.filter(l => {
                      if (paymentFilter !== 'Todos' && l.paymentStatus !== paymentFilter) return false;
                      if (quickFilterStatus !== 'Todos') {
                        if (quickFilterStatus === 'Ficha em Análise' && l.status !== 'Ficha em Análise' && l.status !== 'Em Análise') return false;
                        if (quickFilterStatus === 'Pendente' && l.status !== 'Pendente Documentação' && l.paymentStatus !== 'Pendente') return false;
                        if (quickFilterStatus === 'Ação Revisional' && !l.status.includes('Ação') && !l.status.includes('Depósito')) return false;
                        if (quickFilterStatus === 'Acordo' && !l.status.includes('Acordo') && !l.status.includes('Negociação') && !l.status.includes('Proposta')) return false;
                        if (quickFilterStatus === 'Pago' && l.paymentStatus !== 'Pago' && !l.status.includes('Pago') && !l.status.includes('Quitado')) return false;
                      }
                      return true;
                    });

                    const allSelected = displayed.length > 0 && displayed.every(l => selectedLeadIds.has(l.id));

                    return (
                      <>
                        <thead>
                          <tr style={{ background: 'rgba(255, 255, 255, 0.03)', borderBottom: '1px solid rgba(245, 158, 11, 0.15)', color: '#FDE68A' }}>
                            <th style={{ padding: '14px 14px', width: '52px', textAlign: 'center' }}>
                              <LuxuryCheckbox
                                id="select-all-leads-header"
                                checked={allSelected}
                                indeterminate={displayed.some(l => selectedLeadIds.has(l.id)) && !allSelected}
                                onChange={() => handleToggleSelectAll(displayed)}
                                title={allSelected ? "Desmarcar todos os contratos" : "Selecionar todos os contratos visíveis nesta página"}
                              />
                            </th>
                            <th style={{ padding: '14px 18px' }}>Cliente & Contato</th>
                            <th style={{ padding: '14px 18px' }}>Veículo & Placa</th>
                            <th style={{ padding: '14px 18px' }}>Banco & Processo Judicial</th>
                            <th style={{ padding: '14px 18px' }}>Dívida Residual</th>
                            <th style={{ padding: '14px 18px' }}>Acordo / Economia</th>
                            <th style={{ padding: '14px 18px' }}>Status do Processo</th>
                            <th style={{ padding: '14px 18px' }}>Financeiro</th>
                            <th style={{ padding: '14px 18px', textAlign: 'right' }}>Ações</th>
                          </tr>
                        </thead>
                        <tbody>
                          {displayed.length === 0 ? (
                            <tr>
                              <td colSpan={9} style={{ textAlign: 'center', padding: '40px', color: '#94A3B8' }}>
                                Nenhum contrato encontrado com os filtros selecionados.
                              </td>
                            </tr>
                          ) : (
                            displayed.map((lead) => {
                              const isSelected = selectedLeadIds.has(lead.id);

                              return (
                                <tr
                                  key={lead.id}
                                  className={`contract-table-row ${isSelected ? 'is-selected' : ''}`}
                                  onClick={(e) => {
                                    // Se o clique foi em um botão, dropdown de status, link ou input, não altera a seleção da linha
                                    if (e.target.closest('button, select, a, input, textarea, label')) {
                                      return;
                                    }
                                    handleToggleSelectOne(lead.id);
                                  }}
                                  title="Clique em qualquer parte do contrato para selecionar ou desmarcar"
                                >
                                  <td style={{ padding: '16px 14px', textAlign: 'center', position: 'relative' }}>
                                    <LuxuryCheckbox
                                      id={`checkbox-lead-${lead.id}`}
                                      checked={isSelected}
                                      onChange={() => handleToggleSelectOne(lead.id)}
                                      title={isSelected ? "Desmarcar este contrato" : "Selecionar este contrato"}
                                    />
                                  </td>

                                  <td style={{ padding: '16px 18px' }}>
                                    <div style={{ fontWeight: 700, color: '#FFFFFF' }}>{lead.name}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#FBBF24' }}>{lead.phone}</div>
                                    {lead.email && <div style={{ fontSize: '0.74rem', color: '#94A3B8' }}>{lead.email}</div>}
                                  </td>

                          <td style={{ padding: '16px 18px' }}>
                            <div style={{ color: '#E2E8F0', fontWeight: 600 }}>{lead.vehicleModel}</div>
                            <div style={{ marginTop: '4px' }}>
                              <span className="vehicle-plate-badge">
                                {lead.vehiclePlate || 'S/ PLACA'}
                              </span>
                            </div>
                          </td>

                          <td style={{ padding: '16px 18px' }}>
                            <div style={{ color: '#FDE68A', fontWeight: 700, fontSize: '0.84rem' }}>{lead.bank}</div>
                            <div style={{ fontSize: '0.74rem', color: '#94A3B8', marginTop: '3px' }}>
                              {lead.processNumber || 'Em análise pericial'}
                            </div>
                            <div style={{ fontSize: '0.72rem', color: lead.cityUnit?.includes('Vitória') ? '#FBBF24' : '#60A5FA', marginTop: '2px' }}>
                              {lead.cityUnit}
                            </div>
                          </td>

                          <td style={{ padding: '16px 18px' }}>
                            <div style={{ color: '#94A3B8', textDecoration: 'line-through', fontSize: '0.82rem' }}>
                              R$ {lead.contractResidualTotal?.toLocaleString('pt-BR')}
                            </div>
                            <div style={{ fontSize: '0.74rem', color: '#64748B' }}>
                              {lead.installmentsRemaining}x de R$ {lead.installmentValue?.toLocaleString('pt-BR')}
                            </div>
                          </td>

                          <td style={{ padding: '16px 18px' }}>
                            <div style={{ color: '#FBBF24', fontWeight: 800, fontSize: '0.95rem' }}>
                              R$ {lead.estimatedPayoff?.toLocaleString('pt-BR')}
                            </div>
                            <div style={{ fontSize: '0.76rem', color: '#34D399', fontWeight: 600 }}>
                              Economia: R$ {lead.estimatedSavings?.toLocaleString('pt-BR')} ({lead.discountPercentage}% off)
                            </div>
                          </td>

                          <td style={{ padding: '16px 18px' }}>
                            <select
                              className={`status-pill ${getStatusClass(lead.status)}`}
                              value={lead.status}
                              onChange={(e) => handleUpdateStatus(lead.id, e.target.value)}
                              style={{ border: 'none', cursor: 'pointer', outline: 'none' }}
                            >
                              <option value="Ficha em Análise">Ficha em Análise</option>
                              <option value="Pendente Documentação">Pendente Documentação</option>
                              <option value="Ação Revisional Protocolada">Ação Revisional Protocolada</option>
                              <option value="Depósito Incontroverso Ativo">Depósito Incontroverso Ativo</option>
                              <option value="Acordo em Negociação">Acordo em Negociação</option>
                              <option value="Acordo Homologado (Pendente Pagamento)">Acordo Homologado</option>
                              <option value="Pago / Baixa de Gravame">Pago / Baixa de Gravame</option>
                              <option value="Quitado com Sucesso">Quitado com Sucesso</option>
                            </select>
                          </td>

                          <td style={{ padding: '16px 18px' }}>
                            <button
                              type="button"
                              onClick={() => handleTogglePaymentStatus(lead.id, lead.paymentStatus)}
                              className={`status-pill ${lead.paymentStatus === 'Pago' ? 'status-pago' : lead.paymentStatus === 'Em Negociação' ? 'status-negociacao' : 'status-pendente'}`}
                              style={{ border: 'none', cursor: 'pointer' }}
                              title="Clique para alternar status financeiro"
                            >
                              {lead.paymentStatus === 'Pago' ? '✅ PAGO' : lead.paymentStatus === 'Em Negociação' ? '🔵 EM NEGOCIAÇÃO' : '⏳ PENDENTE'}
                            </button>
                          </td>

                          <td style={{ padding: '16px 18px', textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', gap: '8px' }}>
                              <button
                                onClick={() => setSelectedLead(lead)}
                                className="btn btn-secondary btn-sm"
                                style={{ padding: '6px 10px' }}
                                title="Ver Histórico & Linha do Tempo"
                              >
                                <FileText size={15} />
                              </button>

                              <a
                                href={`https://api.whatsapp.com/send?phone=55${lead.phone.replace(/\D/g, '')}&text=Ol%C3%A1%20${encodeURIComponent(lead.name)},%20sou%20da%20RockFeller%20Solu%C3%A7%C3%B5es%20(${encodeURIComponent(lead.cityUnit)}).%20Estamos%20com%20sua%20an%C3%A1lise%20de%20quita%C3%A7%C3%A3o%20do%20${encodeURIComponent(lead.vehicleModel)}%20pronta.`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-primary btn-sm"
                                style={{ padding: '6px 10px' }}
                                title="Chamar no WhatsApp"
                              >
                                <MessageSquare size={15} />
                              </a>

                              <button
                                onClick={() => handleDeleteLead(lead.id)}
                                className="btn btn-secondary btn-sm"
                                style={{ padding: '6px 10px', color: '#F87171' }}
                                title="Excluir Lead"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </>
                    );
                  })()}
                </table>
              </div>
            </div>
          </>
        )}

        {/* ================= TAB 2: CENTRAL DE CHAT & FILA AO VIVO ================= */}
        {activeTab === 'queue' && (
          <div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1.3fr',
              gap: '24px'
            }}>
              {/* Queue List Column */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '1.2rem', color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Headphones size={20} color="#FBBF24" /> Clientes na Fila ({chatQueue.length})
                  </h3>
                  <button
                    onClick={loadData}
                    className="btn btn-secondary btn-sm"
                    style={{ padding: '6px 10px' }}
                  >
                    <RefreshCw size={14} /> Atualizar
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {chatQueue.length === 0 ? (
                    <div className="glass-card" style={{ padding: '30px', textAlign: 'center', color: '#94A3B8' }}>
                      Nenhum cliente aguardando na fila de chat no momento.
                    </div>
                  ) : (
                    chatQueue.map((t) => {
                      const isWaiting = t.status === 'aguardando';
                      const isSelected = selectedTicket?.id === t.id;

                      return (
                        <div
                          key={t.id}
                          className="glass-card"
                          onClick={() => setSelectedTicket(t)}
                          style={{
                            padding: '18px',
                            cursor: 'pointer',
                            border: isSelected ? '1.5px solid #F59E0B' : isWaiting ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
                            background: isSelected ? 'rgba(245, 158, 11, 0.08)' : 'rgba(12, 16, 25, 0.85)'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                            <div>
                              <div style={{ fontWeight: 700, color: '#FFFFFF', fontSize: '1rem' }}>{t.clientName}</div>
                              <div style={{ fontSize: '0.78rem', color: '#FBBF24' }}>{t.clientPhone} &bull; {t.cityUnit}</div>
                            </div>
                            <span style={{
                              fontSize: '0.72rem',
                              fontWeight: 800,
                              padding: '3px 8px',
                              borderRadius: '12px',
                              background: isWaiting ? 'rgba(245, 158, 11, 0.2)' : t.status === 'em_atendimento' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.06)',
                              color: isWaiting ? '#FBBF24' : t.status === 'em_atendimento' ? '#34D399' : '#94A3B8',
                              border: `1px solid ${isWaiting ? '#F59E0B' : '#10B981'}`
                            }}>
                              {isWaiting ? 'AGUARDANDO' : t.status === 'em_atendimento' ? 'EM ATENDIMENTO' : 'FINALIZADO'}
                            </span>
                          </div>

                          <div style={{ fontSize: '0.82rem', color: '#CBD5E1', marginBottom: '10px' }}>
                            {t.messages[t.messages.length - 1]?.text?.slice(0, 75)}...
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: '#64748B' }}>
                            <span>{new Date(t.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                            {isWaiting && (
                              <button
                                onClick={(e) => { e.stopPropagation(); handleAssignTicket(t); }}
                                className="btn btn-gold btn-sm"
                                style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                              >
                                Assumir Atendimento
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Active Ticket Conversation Column */}
              <div>
                {selectedTicket ? (
                  <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', height: '600px' }}>
                    {/* Header of Active Ticket */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid rgba(245, 158, 11, 0.2)', marginBottom: '16px' }}>
                      <div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF' }}>{selectedTicket.clientName}</div>
                        <div style={{ fontSize: '0.8rem', color: '#FBBF24' }}>
                          {selectedTicket.clientPhone} &bull; {selectedTicket.cityUnit}
                        </div>
                        {selectedTicket.assignedTo && (
                          <div style={{ fontSize: '0.75rem', color: '#34D399' }}>
                            Atendido por: {selectedTicket.assignedTo.name} ({selectedTicket.assignedTo.role.toUpperCase()})
                          </div>
                        )}
                      </div>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        {selectedTicket.status !== 'em_atendimento' && (
                          <button
                            onClick={() => handleAssignTicket(selectedTicket)}
                            className="btn btn-gold btn-sm"
                          >
                            Assumir
                          </button>
                        )}
                        {selectedTicket.status !== 'finalizado' && (
                          <button
                            onClick={() => handleCloseTicket(selectedTicket.id)}
                            className="btn btn-secondary btn-sm"
                            style={{ color: '#F87171' }}
                          >
                            Finalizar
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Chat Messages Body */}
                    <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', paddingRight: '8px' }}>
                      {selectedTicket.messages.map((m) => {
                        const isAgent = m.sender === 'atendente';
                        const isSys = m.sender === 'sistema';

                        if (isSys) {
                          return (
                            <div key={m.id} style={{ textAlign: 'center', fontSize: '0.75rem', color: '#FBBF24', padding: '4px 10px', background: 'rgba(245, 158, 11, 0.08)', borderRadius: '8px' }}>
                              {m.text}
                            </div>
                          );
                        }

                        return (
                          <div
                            key={m.id}
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: isAgent ? 'flex-end' : 'flex-start',
                              maxWidth: '100%'
                            }}
                          >
                            <span style={{ fontSize: '0.72rem', color: '#64748B', marginBottom: '2px' }}>
                              {m.senderName} &bull; {new Date(m.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            <div
                              style={{
                                maxWidth: '85%',
                                padding: '10px 14px',
                                borderRadius: '14px',
                                background: isAgent ? 'linear-gradient(135deg, #F59E0B, #B45309)' : 'rgba(255, 255, 255, 0.06)',
                                color: isAgent ? '#0A0D14' : '#FFFFFF',
                                fontWeight: isAgent ? 700 : 400,
                                fontSize: '0.88rem'
                              }}
                            >
                              {m.text}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Sugestões Rápidas de Textos & Ações Automáticas */}
                    {selectedTicket.status !== 'finalizado' && (
                      <div style={{
                        marginTop: '12px',
                        padding: '12px 14px',
                        background: 'rgba(245, 158, 11, 0.05)',
                        border: '1px solid rgba(245, 158, 11, 0.22)',
                        borderRadius: '12px'
                      }}>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '8px',
                          flexWrap: 'wrap',
                          gap: '6px'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 700, color: '#FDE68A' }}>
                            <Sparkles size={14} color="#FBBF24" />
                            <span>Sugestões Rápidas do que Dizer no Atendimento:</span>
                          </div>
                          <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
                            Clique no texto para preencher ou em <strong style={{ color: '#FBBF24' }}>⚡ 1-Click</strong> para disparar
                          </span>
                        </div>

                        {/* Abas de Categorias de Respostas Rápidas */}
                        <div style={{
                          display: 'flex',
                          gap: '6px',
                          overflowX: 'auto',
                          paddingBottom: '6px',
                          marginBottom: '8px'
                        }}>
                          {['Todas', '👋 Boas-Vindas', '⚖️ Ação Revisional', '🛡️ Busca e Apreensão', '📄 Documentos', '🤝 Acordo & Pagamento', '📍 Sedes Físicas'].map(cat => (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => setActiveQuickCategory(cat)}
                              style={{
                                padding: '4px 9px',
                                borderRadius: '12px',
                                border: activeQuickCategory === cat ? '1px solid #F59E0B' : '1px solid rgba(255, 255, 255, 0.08)',
                                background: activeQuickCategory === cat ? 'rgba(245, 158, 11, 0.25)' : 'rgba(255, 255, 255, 0.03)',
                                color: activeQuickCategory === cat ? '#FDE68A' : '#94A3B8',
                                fontSize: '0.73rem',
                                fontWeight: activeQuickCategory === cat ? 700 : 500,
                                cursor: 'pointer',
                                whiteSpace: 'nowrap',
                                transition: 'all 0.15s ease'
                              }}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>

                        {/* Chips / Cards de Sugestões Rápidas */}
                        <div style={{
                          display: 'flex',
                          gap: '8px',
                          overflowX: 'auto',
                          paddingBottom: '4px',
                          maxHeight: '110px',
                          flexWrap: 'wrap'
                        }}>
                          {QUICK_REPLIES
                            .filter(qr => activeQuickCategory === 'Todas' || qr.category === activeQuickCategory)
                            .map((qr) => (
                              <div
                                key={qr.id}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  background: 'rgba(15, 23, 42, 0.85)',
                                  border: '1px solid rgba(245, 158, 11, 0.28)',
                                  borderRadius: '16px',
                                  padding: '4px 8px 4px 10px',
                                  fontSize: '0.75rem',
                                  color: '#E2E8F0',
                                  transition: 'all 0.15s ease'
                                }}
                                title={qr.text}
                              >
                                <span
                                  onClick={() => setStaffReplyText(qr.text)}
                                  style={{
                                    fontWeight: 600,
                                    color: '#FDE68A',
                                    cursor: 'pointer',
                                    maxWidth: '220px',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                  }}
                                  title={`Clique para colar: "${qr.text}"`}
                                >
                                  {qr.label}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleSendQuickMessage(qr.text)}
                                  style={{
                                    border: 'none',
                                    background: 'linear-gradient(135deg, #F59E0B, #B45309)',
                                    color: '#0A0D14',
                                    borderRadius: '8px',
                                    padding: '2px 6px',
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '2px',
                                    fontSize: '0.68rem',
                                    fontWeight: 800
                                  }}
                                  title="Enviar mensagem agora com 1 clique"
                                >
                                  <Zap size={10} /> 1-Click
                                </button>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}

                    {/* Operator Message Input */}
                    {selectedTicket.status !== 'finalizado' ? (
                      <form onSubmit={handleSendStaffMessage} style={{ display: 'flex', gap: '8px', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Digite sua resposta ou clique nas sugestões acima..."
                          value={staffReplyText}
                          onChange={(e) => setStaffReplyText(e.target.value)}
                        />
                        <button type="submit" className="btn btn-gold" style={{ padding: '0 20px' }}>
                          <Send size={16} />
                        </button>
                      </form>
                    ) : (
                      <div style={{ textAlign: 'center', color: '#94A3B8', fontSize: '0.85rem', paddingTop: '12px' }}>
                        Este atendimento foi finalizado.
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="glass-card" style={{ padding: '50px 30px', textAlign: 'center', color: '#94A3B8' }}>
                    <Headphones size={40} color="#FBBF24" style={{ margin: '0 auto 16px' }} />
                    <h4 style={{ fontSize: '1.2rem', color: '#FFFFFF', marginBottom: '6px' }}>Selecione um Chamado</h4>
                    <p style={{ fontSize: '0.88rem' }}>Clique em um dos clientes na lista ao lado para ver as mensagens e responder ao vivo.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: USER MANAGEMENT & RBAC (ADMIN ONLY) ================= */}
        {activeTab === 'users' && currentUser.role === 'admin' && (
          <div>
            <div style={{
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12), rgba(12, 16, 25, 0.95))',
              border: '1px solid rgba(245, 158, 11, 0.35)',
              borderRadius: '16px',
              padding: '20px 24px',
              marginBottom: '26px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: 'rgba(245, 158, 11, 0.2)',
                  color: '#FBBF24',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Crown size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', color: '#FFFFFF', marginBottom: '2px' }}>
                    Gestão de Níveis de Acesso (Administrador Exclusivo)
                  </h3>
                  <p style={{ fontSize: '0.86rem', color: '#CBD5E1' }}>
                    Você pode definir o nível de qualquer conta: <strong>Administrador</strong>, <strong>Funcionário/Atendente</strong> ou <strong>Cliente</strong>.
                  </p>
                </div>
              </div>
            </div>

            {userActionSuccess && (
              <div style={{
                background: 'rgba(245, 158, 11, 0.15)',
                border: '1px solid rgba(245, 158, 11, 0.4)',
                borderRadius: '10px',
                padding: '12px 18px',
                color: '#FBBF24',
                fontSize: '0.9rem',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <CheckCircle size={18} />
                <span>{userActionSuccess}</span>
              </div>
            )}

            {/* Users Table */}
            <div className="glass-card" style={{ overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                  <thead>
                    <tr style={{ background: 'rgba(255, 255, 255, 0.03)', borderBottom: '1px solid rgba(245, 158, 11, 0.15)', color: '#FDE68A' }}>
                      <th style={{ padding: '14px 18px' }}>Usuário</th>
                      <th style={{ padding: '14px 18px' }}>E-mail</th>
                      <th style={{ padding: '14px 18px' }}>Telefone</th>
                      <th style={{ padding: '14px 18px' }}>Sede</th>
                      <th style={{ padding: '14px 18px' }}>Nível de Acesso Atual</th>
                      <th style={{ padding: '14px 18px', textAlign: 'right' }}>Alterar Nível da Conta</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersList.map((user) => {
                      const isAdmin = user.role === 'admin';
                      const isStaff = user.role === 'funcionario';
                      const isMainAdmin = user.email === 'admin@domrockfeller.com.br';

                      return (
                        <tr
                          key={user.id}
                          style={{
                            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                            transition: 'background 0.15s ease'
                          }}
                        >
                          <td style={{ padding: '16px 18px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <div style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '50%',
                                background: isAdmin ? 'linear-gradient(135deg, #F59E0B, #B45309)' : isStaff ? 'linear-gradient(135deg, #3B82F6, #1D4ED8)' : 'linear-gradient(135deg, #10B981, #047857)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#FFFFFF',
                                fontWeight: 700,
                                fontSize: '0.85rem'
                              }}>
                                {user.name?.charAt(0) || 'U'}
                              </div>
                              <div>
                                <div style={{ fontWeight: 700, color: '#FFFFFF' }}>{user.name}</div>
                                {isMainAdmin && <div style={{ fontSize: '0.72rem', color: '#FBBF24' }}>Administrador Principal</div>}
                              </div>
                            </div>
                          </td>

                          <td style={{ padding: '16px 18px', color: '#E2E8F0' }}>
                            {user.email}
                          </td>

                          <td style={{ padding: '16px 18px', color: '#94A3B8' }}>
                            {user.phone || 'Não informado'}
                          </td>

                          <td style={{ padding: '16px 18px', color: '#94A3B8' }}>
                            {user.cityUnit || 'Vitória - ES'}
                          </td>

                          <td style={{ padding: '16px 18px' }}>
                            <span style={{
                              padding: '4px 12px',
                              borderRadius: '20px',
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              background: isAdmin ? 'rgba(245, 158, 11, 0.15)' : isStaff ? 'rgba(59, 130, 246, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                              color: isAdmin ? '#FBBF24' : isStaff ? '#60A5FA' : '#34D399',
                              border: `1px solid ${isAdmin ? 'rgba(245, 158, 11, 0.4)' : isStaff ? 'rgba(59, 130, 246, 0.4)' : 'rgba(16, 185, 129, 0.4)'}`,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px'
                            }}>
                              {isAdmin ? <Crown size={13} /> : isStaff ? <Headphones size={13} /> : <UserCheck size={13} />}
                              {isAdmin ? 'ADMINISTRADOR' : isStaff ? 'FUNCIONÁRIO / ATENDENTE' : 'CLIENTE'}
                            </span>
                          </td>

                          <td style={{ padding: '16px 18px', textAlign: 'right' }}>
                            {isMainAdmin ? (
                              <span style={{ fontSize: '0.8rem', color: '#64748B', fontStyle: 'italic' }}>Protegido</span>
                            ) : (
                              <select
                                value={user.role}
                                onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                style={{
                                  background: 'rgba(255, 255, 255, 0.06)',
                                  border: '1px solid rgba(245, 158, 11, 0.3)',
                                  color: '#FFFFFF',
                                  padding: '6px 12px',
                                  borderRadius: '8px',
                                  fontSize: '0.82rem',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                  outline: 'none'
                                }}
                              >
                                <option value="cliente">Definir como: CLIENTE</option>
                                <option value="funcionario">Definir como: ATENDENTE / FUNCIONÁRIO</option>
                                <option value="admin">Promover a: ADMINISTRADOR</option>
                              </select>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 4: SOCIAL PROSPECT RADAR ================= */}
        {activeTab === 'prospects' && (
          <SocialProspectRadar />
        )}

      </div>

      {/* Detail & Timeline Modal */}
      {selectedLead && (
        <div className="modal-overlay" onClick={() => setSelectedLead(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '32px', maxWidth: '700px' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <span className={`status-pill ${getStatusClass(selectedLead.status)}`}>
                  {selectedLead.status}
                </span>
                <h3 style={{ fontSize: '1.6rem', color: '#FFFFFF', marginTop: '6px' }}>
                  {selectedLead.name}
                </h3>
                <div style={{ fontSize: '0.85rem', color: '#94A3B8' }}>
                  Unidade: <strong style={{ color: '#E2E8F0' }}>{selectedLead.cityUnit}</strong> &bull; Telefone: {selectedLead.phone}
                </div>
              </div>

              <button
                onClick={() => setSelectedLead(null)}
                className="close-btn"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: 'none',
                  color: '#94A3B8',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  cursor: 'pointer'
                }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '14px',
              padding: '18px',
              marginBottom: '24px',
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '14px'
            }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Veículo & Placa</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFFFFF' }}>{selectedLead.vehicleModel}</div>
                <div style={{ marginTop: '4px' }}>
                  <span className="vehicle-plate-badge">{selectedLead.vehiclePlate || 'S/ PLACA'}</span>
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Banco & Processo Judicial</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FDE68A' }}>{selectedLead.bank}</div>
                <div style={{ fontSize: '0.75rem', color: '#60A5FA', marginTop: '2px', wordBreak: 'break-all' }}>
                  {selectedLead.processNumber || 'Em perícia preliminar'}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Saldo Original</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#94A3B8', textDecoration: 'line-through' }}>
                  R$ {selectedLead.contractResidualTotal?.toLocaleString('pt-BR')}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#CBD5E1' }}>
                  {selectedLead.installmentsRemaining}x de R$ {selectedLead.installmentValue?.toLocaleString('pt-BR')}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Quitação & Financeiro</div>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#FBBF24' }}>
                  R$ {selectedLead.estimatedPayoff?.toLocaleString('pt-BR')}
                </div>
                <div style={{ marginTop: '4px' }}>
                  <button
                    type="button"
                    onClick={() => handleTogglePaymentStatus(selectedLead.id, selectedLead.paymentStatus)}
                    className={`status-pill ${selectedLead.paymentStatus === 'Pago' ? 'status-pago' : 'status-pendente'}`}
                    style={{ border: 'none', cursor: 'pointer', fontSize: '0.72rem', padding: '3px 8px' }}
                    title="Clique para alternar PAGO / PENDENTE"
                  >
                    {selectedLead.paymentStatus === 'Pago' ? '✅ PAGO' : '⏳ PENDENTE'} (Alternar)
                  </button>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '1.05rem', color: '#FFFFFF', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={16} color="#FBBF24" /> Histórico de Acompanhamento ao Vivo & Notas
              </h4>

              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Adicionar nota sobre a perícia ou andamento processual..."
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleAddNote(selectedLead.id); }}
                />
                <button
                  type="button"
                  onClick={() => handleAddNote(selectedLead.id)}
                  className="btn btn-primary btn-sm"
                  style={{ whiteSpace: 'nowrap' }}
                >
                  Salvar Nota
                </button>
              </div>

              <div style={{
                maxHeight: '220px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}>
                {selectedLead.notes && selectedLead.notes.length > 0 ? (
                  selectedLead.notes.map((nt, i) => (
                    <div
                      key={i}
                      style={{
                        padding: '12px 14px',
                        borderRadius: '10px',
                        background: 'rgba(255, 255, 255, 0.03)',
                        borderLeft: '3px solid #F59E0B',
                        fontSize: '0.85rem'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94A3B8', fontSize: '0.75rem', marginBottom: '4px' }}>
                        <strong>{nt.author}</strong>
                        <span>{new Date(nt.date).toLocaleDateString('pt-BR')}</span>
                      </div>
                      <div style={{ color: '#E2E8F0', lineHeight: 1.5 }}>
                        {nt.text}
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ color: '#64748B', fontSize: '0.85rem' }}>Nenhuma anotação registrada ainda.</div>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '0.85rem', color: '#94A3B8' }}>Status do Processo:</span>
                <select
                  className={`status-pill ${getStatusClass(selectedLead.status)}`}
                  value={selectedLead.status}
                  onChange={(e) => handleUpdateStatus(selectedLead.id, e.target.value)}
                  style={{ border: 'none', cursor: 'pointer', outline: 'none' }}
                >
                  <option value="Ficha em Análise">Ficha em Análise</option>
                  <option value="Pendente Documentação">Pendente Documentação</option>
                  <option value="Ação Revisional Protocolada">Ação Revisional Protocolada</option>
                  <option value="Depósito Incontroverso Ativo">Depósito Incontroverso Ativo</option>
                  <option value="Acordo em Negociação">Acordo em Negociação</option>
                  <option value="Acordo Homologado (Pendente Pagamento)">Acordo Homologado</option>
                  <option value="Pago / Baixa de Gravame">Pago / Baixa de Gravame</option>
                  <option value="Quitado com Sucesso">Quitado com Sucesso</option>
                </select>
              </div>

              <a
                href={`https://api.whatsapp.com/send?phone=55${selectedLead.phone.replace(/\D/g, '')}&text=Ol%C3%A1%20${encodeURIComponent(selectedLead.name)},%20somos%20da%20Dom%20RockFeller%20Solu%C3%A7%C3%B5es.%20Temos%20uma%20atualiza%C3%A7%C3%A3o%20sobre%20a%20per%C3%ADcia%20do%20seu%20${encodeURIComponent(selectedLead.vehicleModel)}%20(Placa%20${encodeURIComponent(selectedLead.vehiclePlate || '')}).`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-sm"
              >
                <MessageSquare size={16} /> Enviar WhatsApp
              </a>
            </div>

          </div>
        </div>
      )}

      {/* Manual New Contract Modal */}
      {isNewLeadModalOpen && (
        <div className="modal-overlay" onClick={() => setIsNewLeadModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '34px', maxWidth: '680px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '1.5rem', color: '#FFFFFF', margin: 0 }}>Adicionar Novo Contrato Veicular</h3>
                <p style={{ color: '#94A3B8', fontSize: '0.85rem', margin: '4px 0 0' }}>
                  Cadastre o carro e processo judicial para acompanhamento ao vivo do cliente e da assessoria.
                </p>
              </div>
              <button
                onClick={() => setIsNewLeadModalOpen(false)}
                className="close-btn"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: 'none',
                  color: '#94A3B8',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateLead}>
              <div className="grid-2" style={{ gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Nome Completo do Cliente</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="Ex: João da Silva Santos"
                    value={newLeadForm.name}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">E-mail (para Login no Portal do Cliente)</label>
                  <input
                    type="email"
                    required
                    className="form-input"
                    placeholder="cliente@email.com"
                    value={newLeadForm.email}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid-2" style={{ gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Telefone / WhatsApp</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="(27) 99999-8888"
                    value={newLeadForm.phone}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, phone: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Sede de Atendimento</label>
                  <select
                    className="form-select"
                    value={newLeadForm.cityUnit}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, cityUnit: e.target.value })}
                  >
                    <option value="Vitória - ES">Vitória - ES</option>
                    <option value="Florianópolis - SC">Florianópolis - SC</option>
                  </select>
                </div>
              </div>

              <div className="grid-3" style={{ gap: '14px' }}>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Veículo (Marca/Modelo/Ano)</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="Ex: Jeep Compass Longitude 2023"
                    value={newLeadForm.vehicleModel}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, vehicleModel: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Placa do Carro</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="Ex: RQK-4E28"
                    style={{ textTransform: 'uppercase', fontWeight: 700 }}
                    value={newLeadForm.vehiclePlate}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, vehiclePlate: e.target.value.toUpperCase() })}
                  />
                </div>
              </div>

              <div className="grid-2" style={{ gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Processo Judicial / Distribuição</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Ex: 0012845-88.2026.8.08.0024"
                    value={newLeadForm.processNumber}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, processNumber: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Banco Financiador</label>
                  <select
                    className="form-select"
                    value={newLeadForm.bank}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, bank: e.target.value })}
                  >
                    <option value="Santander Financiamentos">Santander Financiamentos</option>
                    <option value="BV Financeira">BV Financeira</option>
                    <option value="Bradesco Financiamentos">Bradesco Financiamentos</option>
                    <option value="Itaú / Itaucard">Itaú / Itaucard</option>
                    <option value="Banco Pan">Banco Pan</option>
                    <option value="Banco Safra">Banco Safra</option>
                    <option value="Outro Banco">Outro Banco</option>
                  </select>
                </div>
              </div>

              <div className="grid-2" style={{ gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Valor Parcela (R$)</label>
                  <input
                    type="number"
                    required
                    className="form-input"
                    value={newLeadForm.installmentValue}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, installmentValue: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Parcelas Restantes</label>
                  <input
                    type="number"
                    required
                    className="form-input"
                    value={newLeadForm.installmentsRemaining}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, installmentsRemaining: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid-2" style={{ gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Status Inicial do Processo</label>
                  <select
                    className="form-select"
                    value={newLeadForm.status}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, status: e.target.value })}
                  >
                    <option value="Ficha em Análise">📋 Ficha em Análise</option>
                    <option value="Pendente Documentação">⏳ Pendente Documentação</option>
                    <option value="Ação Revisional Protocolada">⚖️ Ação Revisional Protocolada</option>
                    <option value="Depósito Incontroverso Ativo">🏛️ Depósito Incontroverso Ativo</option>
                    <option value="Acordo em Negociação">🤝 Acordo em Negociação</option>
                    <option value="Acordo Homologado (Pendente Pagamento)">📜 Acordo Homologado</option>
                    <option value="Pago / Baixa de Gravame">✅ Pago / Baixa de Gravame</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Status Financeiro</label>
                  <select
                    className="form-select"
                    value={newLeadForm.paymentStatus}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, paymentStatus: e.target.value })}
                  >
                    <option value="Pendente">🟠 Pendente</option>
                    <option value="Pago">🟢 Pago / Liquidado</option>
                    <option value="Em Negociação">🔵 Em Negociação</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Nota Pericial Inicial / Despacho</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ex: Contrato e CRLV recepcionados. Auditoria pericial em andamento."
                  value={newLeadForm.initialNote}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, initialNote: e.target.value })}
                />
              </div>

              <button type="submit" className="btn btn-gold btn-lg" style={{ width: '100%', marginTop: '10px', fontWeight: 800 }}>
                + Salvar Contrato e Ativar Acompanhamento ao Vivo
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
