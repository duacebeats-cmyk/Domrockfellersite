import React, { useState, useEffect } from 'react';
import { 
  Car, ShieldCheck, CheckCircle2, Clock, Banknote, Building2, 
  MessageSquare, ArrowRight, PlusCircle, AlertCircle, Sparkles, FileText, 
  Download, Zap, X, ShieldAlert, Scale, RefreshCw, Check, Award, ChevronRight
} from 'lucide-react';
import { api } from '../services/api';

const MAX_VEHICLES_PER_ACCOUNT = 10;

export function ClientPortal({ currentUser, onOpenSimulator, onBackToSite, onOpenChat }) {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastSyncTime, setLastSyncTime] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Modal para cliente cadastrar outro veículo/contrato
  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false);
  const [newVehicleForm, setNewVehicleForm] = useState({
    vehicleType: 'Carro',
    vehicleModel: '',
    vehicleYear: '2022',
    vehiclePlate: '',
    bank: 'Santander Financiamentos',
    installmentValue: 1800,
    installmentsRemaining: 36,
    delayStatus: 'Em dia',
    cityUnit: currentUser?.cityUnit || 'Vitória - ES',
    clientNotes: '',
    agreedTerms: true
  });
  const [submittingVehicle, setSubmittingVehicle] = useState(false);

  const fetchCases = async () => {
    if (!currentUser) return;
    try {
      const myCases = await api.getMyCases(currentUser.email, currentUser.phone);
      if (myCases && myCases.length > 0) {
        setCases(myCases);
      } else {
        // Exemplo inicial caso não encontre contrato exato
        setCases([
          {
            id: 'client-case-demo',
            vehicleModel: 'Jeep Compass Longitude Turboflex',
            vehiclePlate: 'RQK-4E28',
            processNumber: '0012845-88.2026.8.08.0024 (4ª Vara Cível de Vitória)',
            bank: 'Santander Financiamentos',
            installmentValue: 2450,
            installmentsRemaining: 38,
            contractResidualTotal: 93100,
            estimatedPayoff: 29800,
            estimatedSavings: 63300,
            discountPercentage: 68,
            cityUnit: currentUser.cityUnit || 'Vitória - ES',
            delayStatus: 'Em dia',
            status: 'Ação Revisional Protocolada',
            paymentStatus: 'Pendente',
            notes: [
              {
                date: new Date().toISOString(),
                author: 'Dr. Lucas (Jurídico Dom RockFeller)',
                text: 'Ação Revisional distribuída na 4ª Vara Cível. Petição com pedido liminar para autorização de depósitos judiciais incontroversos.'
              },
              {
                date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
                author: 'Auditoria Pericial Dom RockFeller',
                text: 'Laudo pericial contábil finalizado. Identificado spread bancário abusivo e capitalização composta indevida de juros.'
              }
            ]
          }
        ]);
      }
      setLastSyncTime(new Date());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCases();
    // Polling contínuo em tempo real para acompanhar ao vivo o processo do carro
    const pollInterval = setInterval(() => {
      fetchCases();
    }, 3500);

    return () => clearInterval(pollInterval);
  }, [currentUser]);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    fetchCases();
  };

  const handleAddVehicleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return;

    if (cases.length >= MAX_VEHICLES_PER_ACCOUNT) {
      alert(`Limite máximo de ${MAX_VEHICLES_PER_ACCOUNT} veículos atingido para esta conta.`);
      return;
    }

    setSubmittingVehicle(true);
    try {
      const pValue = Number(newVehicleForm.installmentValue) || 1500;
      const pRemaining = Number(newVehicleForm.installmentsRemaining) || 36;
      const residual = pValue * pRemaining;

      const payload = {
        name: currentUser.name,
        email: currentUser.email,
        phone: currentUser.phone || '(27) 99874-2210',
        cityUnit: newVehicleForm.cityUnit || currentUser.cityUnit || 'Vitória - ES',
        vehicleType: newVehicleForm.vehicleType,
        vehicleModel: newVehicleForm.vehicleModel,
        vehiclePlate: newVehicleForm.vehiclePlate.toUpperCase(),
        processNumber: 'Ficha em Análise para Aprovação da Diretoria',
        bank: newVehicleForm.bank,
        installmentValue: pValue,
        installmentsRemaining: pRemaining,
        delayStatus: newVehicleForm.delayStatus,
        status: 'Ficha em Análise',
        paymentStatus: 'Pendente',
        notes: [
          {
            date: new Date().toISOString(),
            author: `Cliente ${currentUser.name} (Portal)`,
            text: `Ficha de solicitação enviada pelo cliente para aprovação da Diretoria. Veículo: ${newVehicleForm.vehicleModel} (Placa ${newVehicleForm.vehiclePlate.toUpperCase()}). Saldo estimado: R$ ${residual.toLocaleString('pt-BR')}. ${newVehicleForm.clientNotes ? `Obs do cliente: "${newVehicleForm.clientNotes}"` : ''}`
          }
        ]
      };

      await api.createLead(payload);
      setIsAddVehicleOpen(false);
      setNewVehicleForm({
        vehicleType: 'Carro',
        vehicleModel: '',
        vehicleYear: '2022',
        vehiclePlate: '',
        bank: 'Santander Financiamentos',
        installmentValue: 1800,
        installmentsRemaining: 36,
        delayStatus: 'Em dia',
        cityUnit: currentUser.cityUnit || 'Vitória - ES',
        clientNotes: '',
        agreedTerms: true
      });
      await fetchCases();
    } catch (err) {
      console.error(err);
      alert('Erro ao enviar ficha do veículo. Tente novamente.');
    } finally {
      setSubmittingVehicle(false);
    }
  };

  const getStatusBadge = (st) => {
    switch (st) {
      case 'Pago / Baixa de Gravame':
      case 'Quitado com Sucesso':
        return { label: '✅ Quitado / Baixa de Gravame Concluída', color: '#10B981', bg: 'rgba(16, 185, 129, 0.18)' };
      case 'Acordo Homologado (Pendente Pagamento)':
        return { label: '📜 Acordo Homologado Judicialmente', color: '#38BDF8', bg: 'rgba(56, 189, 248, 0.18)' };
      case 'Acordo em Negociação':
      case 'Negociação Bancária':
        return { label: '🤝 Mesa de Acordo Judicial Aberta', color: '#F472B6', bg: 'rgba(236, 72, 153, 0.18)' };
      case 'Depósito Incontroverso Ativo':
        return { label: '🏛️ Depósito Judicial Incontroverso Ativo', color: '#C084FC', bg: 'rgba(168, 85, 247, 0.18)' };
      case 'Ação Revisional Protocolada':
        return { label: '⚖️ Ação Revisional Protocolada na Justiça', color: '#FBBF24', bg: 'rgba(245, 158, 11, 0.18)' };
      case 'Pendente Documentação':
        return { label: '⏳ Pendente Documentação (CRLV / Contrato)', color: '#F97316', bg: 'rgba(249, 115, 22, 0.18)' };
      case 'Ficha em Análise':
      case 'Em Análise':
      default:
        return { label: '📋 Ficha em Análise Pericial Contábil', color: '#60A5FA', bg: 'rgba(59, 130, 246, 0.18)' };
    }
  };

  const getStepNumber = (st) => {
    if (st === 'Pago / Baixa de Gravame' || st === 'Quitado com Sucesso') return 5;
    if (st === 'Acordo Homologado (Pendente Pagamento)') return 4;
    if (st === 'Acordo em Negociação' || st === 'Negociação Bancária' || st === 'Proposta Enviada') return 4;
    if (st === 'Depósito Incontroverso Ativo') return 3;
    if (st === 'Ação Revisional Protocolada') return 2;
    return 1; // Ficha em Análise / Pendente Documentação
  };

  const isLimitReached = cases.length >= MAX_VEHICLES_PER_ACCOUNT;

  return (
    <div style={{ padding: '40px 0 80px', minHeight: '85vh' }}>
      <div className="container">
        
        {/* Welcome Header */}
        <div className="glass-card" style={{ padding: '30px', marginBottom: '24px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #F59E0B, #10B981, #F59E0B)' }} />
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
                <span className="badge badge-emerald">
                  <ShieldCheck size={14} /> Portal do Cliente Dom RockFeller
                </span>

                {/* Live Polling Badge Indicator */}
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '3px 10px',
                  borderRadius: '16px',
                  background: 'rgba(16, 185, 129, 0.12)',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  color: '#34D399'
                }}>
                  <span style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#10B981',
                    display: 'inline-block',
                    boxShadow: '0 0 8px #10B981'
                  }} />
                  <span>AO VIVO</span>
                  <span style={{ color: '#94A3B8', fontWeight: 500, fontSize: '0.7rem' }}>
                    &bull; Atualizado às {lastSyncTime.toLocaleTimeString('pt-BR')}
                  </span>
                </div>

                <button
                  onClick={handleManualRefresh}
                  className="btn btn-secondary btn-sm"
                  style={{ padding: '3px 8px', fontSize: '0.72rem' }}
                  title="Sincronizar processo agora"
                >
                  <RefreshCw size={12} className={isRefreshing ? 'animate-spin' : ''} />
                  <span>Atualizar</span>
                </button>
              </div>

              <h1 style={{ fontSize: '2rem', color: '#FFFFFF', margin: '4px 0' }}>
                Olá, {currentUser?.name}!
              </h1>
              <p style={{ color: '#94A3B8', fontSize: '0.92rem' }}>
                Acompanhe ao vivo o andamento da ação revisional, perícia de juros e o status da desalienação dos seus veículos em <strong>{currentUser?.cityUnit || 'Vitória - ES'}</strong>.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                onClick={() => setIsAddVehicleOpen(true)}
                disabled={isLimitReached}
                className={`btn ${isLimitReached ? 'btn-secondary' : 'btn-gold'} btn-sm`}
                style={{ fontWeight: 800 }}
                title={isLimitReached ? 'Limite máximo de 10 veículos atingido' : 'Enviar ficha de outro veículo'}
              >
                <PlusCircle size={16} />
                <span>+ Cadastrar Veículo ({cases.length}/{MAX_VEHICLES_PER_ACCOUNT})</span>
              </button>

              <button
                onClick={onOpenChat}
                className="btn btn-secondary btn-sm"
              >
                <MessageSquare size={16} color="#FBBF24" />
                <span>Chat com a Diretoria</span>
              </button>

              <button
                onClick={onBackToSite}
                className="btn btn-secondary btn-sm"
              >
                Voltar ao Site
              </button>
            </div>
          </div>
        </div>

        {/* Account Fleet Quota Banner (Limite de até 10 veículos) */}
        <div className="glass-card" style={{ padding: '18px 24px', marginBottom: '24px', border: isLimitReached ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid rgba(245, 158, 11, 0.25)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Car size={20} color="#FBBF24" />
              <div>
                <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#FFFFFF' }}>
                  Gestão de Frota da Conta:
                </span>
                <span style={{ fontSize: '0.86rem', color: '#94A3B8', marginLeft: '8px' }}>
                  Você possui <strong>{cases.length}</strong> de até <strong>{MAX_VEHICLES_PER_ACCOUNT}</strong> veículos cadastrados para negociação.
                </span>
              </div>
            </div>

            <span style={{
              fontSize: '0.8rem',
              fontWeight: 800,
              padding: '3px 10px',
              borderRadius: '12px',
              background: isLimitReached ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)',
              color: isLimitReached ? '#F87171' : '#FBBF24',
              border: `1px solid ${isLimitReached ? '#EF4444' : '#F59E0B'}`
            }}>
              {isLimitReached ? 'LIMITE MÁXIMO ATINGIDO (10/10)' : `${MAX_VEHICLES_PER_ACCOUNT - cases.length} VAGA(S) RESTANTE(S)`}
            </span>
          </div>

          {/* Progress Bar of Account Capacity */}
          <div style={{ height: '7px', width: '100%', background: 'rgba(255, 255, 255, 0.06)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${(cases.length / MAX_VEHICLES_PER_ACCOUNT) * 100}%`,
              background: isLimitReached ? 'linear-gradient(90deg, #F59E0B, #EF4444)' : 'linear-gradient(90deg, #10B981, #F59E0B)',
              borderRadius: '4px',
              transition: 'width 0.4s ease'
            }} />
          </div>

          {isLimitReached && (
            <div style={{ marginTop: '10px', fontSize: '0.8rem', color: '#F87171', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertCircle size={14} />
              <span>Limite de 10 veículos atingido para esta conta. Caso sua empresa possua frota maior, fale com a Diretoria Executiva para assessoria corporativa.</span>
            </div>
          )}
        </div>

        {/* Process Guarantee & Legal Transparency Notice */}
        <div style={{
          background: 'rgba(245, 158, 11, 0.05)',
          border: '1px solid rgba(245, 158, 11, 0.25)',
          borderRadius: '12px',
          padding: '16px 20px',
          marginBottom: '28px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          fontSize: '0.86rem',
          color: '#E2E8F0'
        }}>
          <Scale size={24} color="#FBBF24" style={{ flexShrink: 0 }} />
          <div>
            <strong>Transparência Jurídica & Mitigação de Riscos:</strong> A Dom RockFeller ajuíza ações revisionais legítimas fundamentadas no Código de Defesa do Consumidor e súmulas do STJ. Mantemos você 100% informado dos riscos do Decreto-Lei 911/69 (busca e apreensão), instruindo medidas liminares e depósitos judiciais para proteção do seu patrimônio.
          </div>
        </div>

        {/* Header Section for Vehicles */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
          <h2 style={{ fontSize: '1.4rem', color: '#FFFFFF', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Car size={22} color="#FBBF24" />
            <span>Veículos e Fichas sob Assessoria da Dom RockFeller ({cases.length})</span>
          </h2>

          <div style={{ fontSize: '0.84rem', color: '#94A3B8' }}>
            Acompanhe o status em tempo real sincronizado diretamente com a assessoria jurídica
          </div>
        </div>

        {/* Vehicles / Contracts List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {cases.map((cs, idx) => {
            const badge = getStatusBadge(cs.status);
            const stepNum = getStepNumber(cs.status);
            const isPaid = cs.paymentStatus === 'Pago' || cs.status?.includes('Pago') || cs.status?.includes('Quitado');
            const isUnderApproval = cs.status === 'Ficha em Análise' || cs.status?.includes('Análise');

            return (
              <div 
                key={cs.id || idx} 
                className="glass-card" 
                style={{ 
                  padding: '30px', 
                  border: isPaid ? '1.5px solid rgba(16, 185, 129, 0.4)' : isUnderApproval ? '1.5px solid rgba(245, 158, 11, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
                  position: 'relative'
                }}
              >
                
                {/* Live Tracking Status Bar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
                      <h3 style={{ fontSize: '1.5rem', color: '#FFFFFF', margin: 0 }}>{cs.vehicleModel}</h3>
                      
                      {/* Realistic Mercosul Plate Badge */}
                      <span className="vehicle-plate-badge" title="Placa do Veículo Cadastrada">
                        {cs.vehiclePlate || 'S/ PLACA'}
                      </span>

                      {/* Approval Status Badge */}
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontSize: '0.74rem',
                        fontWeight: 800,
                        background: isUnderApproval ? 'rgba(245, 158, 11, 0.18)' : 'rgba(16, 185, 129, 0.18)',
                        color: isUnderApproval ? '#FDE68A' : '#34D399',
                        border: `1px solid ${isUnderApproval ? '#F59E0B' : '#10B981'}`
                      }}>
                        {isUnderApproval ? '🟡 FICHA EM ANÁLISE PELA DIRETORIA' : '🟢 FICHA APROVADA PARA NEGOCIAÇÃO'}
                      </span>

                      {/* Financial Status Badge */}
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontSize: '0.74rem',
                        fontWeight: 800,
                        background: isPaid ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.15)',
                        color: isPaid ? '#34D399' : '#FBBF24',
                        border: isPaid ? '1px solid #10B981' : '1px solid #F59E0B'
                      }}>
                        {isPaid ? '🟢 FINANCEIRO: PAGO / LIQUIDADO' : '⏳ FINANCEIRO: PENDENTE DE ACORDO'}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.88rem', color: '#94A3B8', display: 'flex', flexWrap: 'wrap', gap: '14px' }}>
                      <span>Banco Financiador: <strong style={{ color: '#E2E8F0' }}>{cs.bank}</strong></span>
                      <span>&bull;</span>
                      <span>Sede Responsável: <strong style={{ color: '#FDE68A' }}>{cs.cityUnit}</strong></span>
                      <span>&bull;</span>
                      <span>
                        Processo Judicial: <strong style={{ color: '#60A5FA' }}>{cs.processNumber || 'Em fase pericial prévia'}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Main Process Status Pill */}
                  <span style={{
                    padding: '8px 16px',
                    borderRadius: '24px',
                    fontSize: '0.84rem',
                    fontWeight: 800,
                    color: badge.color,
                    background: badge.bg,
                    border: `1.5px solid ${badge.color}60`,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    {badge.label}
                  </span>
                </div>

                {/* Esteira Visual do Processo do Carro (5 Etapas) */}
                <div style={{ marginBottom: '28px', background: 'rgba(255, 255, 255, 0.02)', padding: '20px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Clock size={16} color="#FBBF24" />
                      <span>Esteira de Andamento do Carro em Tempo Real (Fase {stepNum} de 5):</span>
                    </div>
                    <span style={{ fontSize: '0.78rem', color: '#10B981', fontWeight: 700 }}>
                      {stepNum === 5 ? '100% Concluído' : `${stepNum * 20}% do Fluxo Processual`}
                    </span>
                  </div>

                  {/* Progress Pipeline Labels */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(5, 1fr)',
                    fontSize: '0.76rem',
                    color: '#94A3B8',
                    marginBottom: '10px',
                    gap: '8px'
                  }}>
                    <div style={{ color: stepNum >= 1 ? '#FDE68A' : '#64748B', fontWeight: stepNum >= 1 ? 700 : 400 }}>
                      1. Auditoria Pericial
                    </div>
                    <div style={{ color: stepNum >= 2 ? '#FDE68A' : '#64748B', fontWeight: stepNum >= 2 ? 700 : 400 }}>
                      2. Ação Revisional
                    </div>
                    <div style={{ color: stepNum >= 3 ? '#FDE68A' : '#64748B', fontWeight: stepNum >= 3 ? 700 : 400 }}>
                      3. Depósito Judicial
                    </div>
                    <div style={{ color: stepNum >= 4 ? '#FDE68A' : '#64748B', fontWeight: stepNum >= 4 ? 700 : 400 }}>
                      4. Homologação de Acordo
                    </div>
                    <div style={{ color: stepNum >= 5 ? '#34D399' : '#64748B', fontWeight: stepNum >= 5 ? 800 : 400 }}>
                      5. Quitação & Baixa
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div style={{ height: '8px', width: '100%', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${(stepNum / 5) * 100}%`,
                      background: stepNum === 5 ? 'linear-gradient(90deg, #10B981, #059669)' : 'linear-gradient(90deg, #F59E0B, #10B981)',
                      borderRadius: '4px',
                      transition: 'width 0.5s ease'
                    }} />
                  </div>
                </div>

                {/* Financial Overview Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '16px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  borderRadius: '16px',
                  padding: '20px',
                  marginBottom: '24px'
                }}>
                  <div>
                    <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>Dívida Contratual Original</div>
                    <div style={{ fontSize: '1.15rem', color: '#94A3B8', textDecoration: 'line-through', fontWeight: 600 }}>
                      R$ {cs.contractResidualTotal?.toLocaleString('pt-BR')}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                      {cs.installmentsRemaining} parcelas de R$ {cs.installmentValue?.toLocaleString('pt-BR')}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.78rem', color: '#34D399', fontWeight: 600 }}>Quitação Negociada Alvo</div>
                    <div style={{ fontSize: '1.4rem', color: '#34D399', fontWeight: 800 }}>
                      R$ {cs.estimatedPayoff?.toLocaleString('pt-BR')}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                      Boleto pago diretamente à instituição credora
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.78rem', color: '#FBBF24', fontWeight: 600 }}>Sua Economia Estimada</div>
                    <div style={{ fontSize: '1.4rem', color: '#FBBF24', fontWeight: 800 }}>
                      R$ {cs.estimatedSavings?.toLocaleString('pt-BR')}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 700 }}>
                      ~{cs.discountPercentage}% de Redução
                    </div>
                  </div>
                </div>

                {/* Team Updates / Timeline notes */}
                {cs.notes && cs.notes.length > 0 && (
                  <div style={{ marginBottom: '24px' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#E2E8F0', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Clock size={15} color="#FBBF24" /> Atualizações ao Vivo da Assessoria Jurídica:
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {cs.notes.slice(0, 3).map((nt, noteIdx) => (
                        <div
                          key={noteIdx}
                          style={{
                            padding: '14px 18px',
                            background: noteIdx === 0 ? 'rgba(245, 158, 11, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                            borderLeft: noteIdx === 0 ? '3px solid #F59E0B' : '3px solid rgba(255,255,255,0.1)',
                            borderRadius: '8px',
                            fontSize: '0.88rem',
                            color: '#CBD5E1'
                          }}
                        >
                          <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginBottom: '4px', display: 'flex', justifyContent: 'space-between' }}>
                            <strong style={{ color: '#FDE68A' }}>{nt.author}</strong>
                            <span>{new Date(nt.date).toLocaleDateString('pt-BR')} às {new Date(nt.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <div>{nt.text}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Direct Action for this Vehicle */}
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <a
                      href={`https://api.whatsapp.com/send?phone=${cs.cityUnit?.includes('Florianópolis') ? '5548991256677' : '5527998723344'}&text=Ol%C3%A1!%20Sou%20o(a)%20cliente%20${encodeURIComponent(currentUser.name)}%20e%20gostaria%20de%20informa%C3%A7%C3%B5es%20ao%20vivo%20sobre%20meu%20${encodeURIComponent(cs.vehicleModel)}%20(Placa%20${encodeURIComponent(cs.vehiclePlate || '')}).`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary btn-sm"
                    >
                      <MessageSquare size={16} />
                      <span>Falar com Assessor de {cs.cityUnit}</span>
                    </a>

                    <button
                      onClick={onOpenChat}
                      className="btn btn-secondary btn-sm"
                    >
                      <Zap size={15} color="#FBBF24" />
                      <span>Chat ao Vivo no Portal</span>
                    </button>
                  </div>

                  <span style={{ fontSize: '0.78rem', color: '#64748B' }}>
                    Identificador do Contrato: #{cs.id}
                  </span>
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* Modal: Ficha de Cadastro de Veículo para Aprovação de Quitação */}
      {isAddVehicleOpen && (
        <div className="modal-overlay" onClick={() => setIsAddVehicleOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '34px', maxWidth: '640px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span className="badge badge-gold">
                    <Award size={13} /> Ficha de Aprovação
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#34D399', fontWeight: 700 }}>
                    Vaga {cases.length + 1} de {MAX_VEHICLES_PER_ACCOUNT}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.45rem', color: '#FFFFFF', margin: 0 }}>
                  Ficha de Cadastramento para Aprovação de Quitação
                </h3>
                <p style={{ color: '#94A3B8', fontSize: '0.84rem', margin: '4px 0 0' }}>
                  Envie os dados do veículo e financiamento para auditoria pericial e aprovação da Diretoria Dom RockFeller.
                </p>
              </div>
              <button
                onClick={() => setIsAddVehicleOpen(false)}
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

            <form onSubmit={handleAddVehicleSubmit}>
              <div className="grid-3" style={{ gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Tipo</label>
                  <select
                    className="form-select"
                    value={newVehicleForm.vehicleType}
                    onChange={(e) => setNewVehicleForm({ ...newVehicleForm, vehicleType: e.target.value })}
                  >
                    <option value="Carro">Carro de Passeio</option>
                    <option value="SUV / Picape">SUV / Picape</option>
                    <option value="Moto">Motocicleta</option>
                    <option value="Caminhão / Utilitário">Caminhão / Utilitário</option>
                  </select>
                </div>

                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Marca e Modelo do Veículo</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="Ex: Toyota Corolla Cross XRE 2.0"
                    value={newVehicleForm.vehicleModel}
                    onChange={(e) => setNewVehicleForm({ ...newVehicleForm, vehicleModel: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid-2" style={{ gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Placa do Veículo (Padrão Mercosul)</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="Ex: RIX-9A10"
                    style={{ textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.05em' }}
                    value={newVehicleForm.vehiclePlate}
                    onChange={(e) => setNewVehicleForm({ ...newVehicleForm, vehiclePlate: e.target.value.toUpperCase() })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Banco / Financeira Credora</label>
                  <select
                    className="form-select"
                    value={newVehicleForm.bank}
                    onChange={(e) => setNewVehicleForm({ ...newVehicleForm, bank: e.target.value })}
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
                  <label className="form-label">Valor Parcela Atual (R$)</label>
                  <input
                    type="number"
                    required
                    className="form-input"
                    value={newVehicleForm.installmentValue}
                    onChange={(e) => setNewVehicleForm({ ...newVehicleForm, installmentValue: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Parcelas Restantes</label>
                  <input
                    type="number"
                    required
                    className="form-input"
                    value={newVehicleForm.installmentsRemaining}
                    onChange={(e) => setNewVehicleForm({ ...newVehicleForm, installmentsRemaining: e.target.value })}
                  />
                </div>
              </div>

              {/* Real-time calculated residual total */}
              <div style={{
                background: 'rgba(245, 158, 11, 0.08)',
                border: '1px solid rgba(245, 158, 11, 0.25)',
                borderRadius: '10px',
                padding: '10px 14px',
                marginBottom: '14px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.84rem'
              }}>
                <span style={{ color: '#E2E8F0' }}>Dívida Residual Calculada:</span>
                <strong style={{ color: '#FBBF24', fontSize: '1rem' }}>
                  R$ {((Number(newVehicleForm.installmentValue) || 0) * (Number(newVehicleForm.installmentsRemaining) || 0)).toLocaleString('pt-BR')}
                </strong>
              </div>

              <div className="grid-2" style={{ gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Situação Atual das Parcelas</label>
                  <select
                    className="form-select"
                    value={newVehicleForm.delayStatus}
                    onChange={(e) => setNewVehicleForm({ ...newVehicleForm, delayStatus: e.target.value })}
                  >
                    <option value="Em dia">Em dia</option>
                    <option value="1 a 3 parcelas em atraso">1 a 3 parcelas em atraso</option>
                    <option value="Mais de 3 parcelas / Risco de Busca e Apreensão">Mais de 3 parcelas / Notificado</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Sede Preferida para Assessoria</label>
                  <select
                    className="form-select"
                    value={newVehicleForm.cityUnit}
                    onChange={(e) => setNewVehicleForm({ ...newVehicleForm, cityUnit: e.target.value })}
                  >
                    <option value="Vitória - ES">Vitória - ES (Enseada do Suá)</option>
                    <option value="Florianópolis - SC">Florianópolis - SC (Centro)</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Observações para a Diretoria (Opcional)</label>
                <textarea
                  className="form-input"
                  rows={2}
                  placeholder="Ex: Tenho interesse em quitar com proposta à vista assim que o laudo comprovar a taxa abusiva..."
                  value={newVehicleForm.clientNotes}
                  onChange={(e) => setNewVehicleForm({ ...newVehicleForm, clientNotes: e.target.value })}
                  style={{ resize: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '16px', fontSize: '0.78rem', color: '#94A3B8' }}>
                <input
                  type="checkbox"
                  id="agreeTerms"
                  required
                  checked={newVehicleForm.agreedTerms}
                  onChange={(e) => setNewVehicleForm({ ...newVehicleForm, agreedTerms: e.target.checked })}
                  style={{ marginTop: '2px', accentColor: '#F59E0B' }}
                />
                <label htmlFor="agreeTerms" style={{ cursor: 'pointer' }}>
                  Declaro que as informações acima são verídicas e autorizo a auditoria pericial preliminar pela equipe jurídica da Dom RockFeller para elaboração da proposta de quitação.
                </label>
              </div>

              <button
                type="submit"
                disabled={submittingVehicle}
                className="btn btn-gold btn-lg"
                style={{ width: '100%', fontWeight: 800 }}
              >
                {submittingVehicle ? 'Protocolando Ficha na Diretoria...' : '📤 Enviar Ficha para Aprovação da Diretoria'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
