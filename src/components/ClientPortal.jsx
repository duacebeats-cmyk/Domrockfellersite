import React, { useState, useEffect, useRef } from 'react';
import { 
  Car, ShieldCheck, CheckCircle2, Clock, Banknote, Building2, 
  MessageSquare, ArrowRight, PlusCircle, AlertCircle, Sparkles, FileText, 
  Download, Zap, X, ShieldAlert, Scale, RefreshCw, Check, Award, ChevronRight,
  Menu, ChevronLeft, User, Camera, Upload, LogOut, Home, Settings, Phone, Mail
} from 'lucide-react';
import { api } from '../services/api';

const MAX_VEHICLES_PER_ACCOUNT = 10;

const ESTADOS_BRASIL = [
  'Santa Catarina (SC)',
  'Espírito Santo (ES)',
  'São Paulo (SP)',
  'Rio de Janeiro (RJ)',
  'Minas Gerais (MG)',
  'Paraná (PR)',
  'Rio Grande do Sul (RS)',
  'Goiás (GO)',
  'Bahia (BA)',
  'Outro Estado'
];

export function ClientPortal({ currentUser, onOpenSimulator, onBackToSite, onOpenChat, onLogout, onUpdateUser }) {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastSyncTime, setLastSyncTime] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Left Collapsible Sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'vehicles' | 'profile'

  // Profile Picture Upload
  const fileInputRef = useRef(null);
  const [profilePhoto, setProfilePhoto] = useState(currentUser?.picture || currentUser?.avatar || '');
  const [photoSuccessMsg, setPhotoSuccessMsg] = useState(false);

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
    cityUnit: currentUser?.cityUnit || 'Santa Catarina (SC)',
    clientNotes: '',
    agreedTerms: true
  });
  const [submittingVehicle, setSubmittingVehicle] = useState(false);

  useEffect(() => {
    if (currentUser?.picture || currentUser?.avatar) {
      setProfilePhoto(currentUser.picture || currentUser.avatar);
    }
  }, [currentUser]);

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('A imagem deve ter no máximo 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target.result;
      setProfilePhoto(base64);

      // Salva no perfil do usuário no localStorage e na sessão
      const updatedUser = {
        ...currentUser,
        picture: base64,
        avatar: base64
      };

      api.setCurrentUser(updatedUser);
      if (onUpdateUser) onUpdateUser(updatedUser);

      // Atualiza também na lista de usuários persistidos
      try {
        const rawUsers = localStorage.getItem('domrockfeller_users_v3');
        if (rawUsers) {
          const users = JSON.parse(rawUsers);
          const idx = users.findIndex(u => u.id === currentUser.id || u.email === currentUser.email);
          if (idx !== -1) {
            users[idx].picture = base64;
            users[idx].avatar = base64;
            localStorage.setItem('domrockfeller_users_v3', JSON.stringify(users));
          }
        }
      } catch (err) {
        console.warn('Erro ao atualizar usuário localmente:', err);
      }

      setPhotoSuccessMsg(true);
      setTimeout(() => setPhotoSuccessMsg(false), 3500);
    };
    reader.readAsDataURL(file);
  };

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
            processNumber: '0012845-88.2026.8.08.0024 (4ª Vara Cível)',
            bank: 'Santander Financiamentos',
            installmentValue: 2450,
            installmentsRemaining: 38,
            contractResidualTotal: 93100,
            estimatedPayoff: 29800,
            estimatedSavings: 63300,
            discountPercentage: 68,
            cityUnit: currentUser.cityUnit || 'Santa Catarina (SC)',
            delayStatus: 'Em dia',
            status: 'Ação Revisional Protocolada',
            paymentStatus: 'Pendente',
            notes: [
              {
                date: new Date().toISOString(),
                author: 'Dr. Lucas (Jurídico Dom RockFeller)',
                text: 'Ação Revisional distribuída na Vara Cível. Petição com pedido liminar para autorização de depósitos judiciais incontroversos.'
              },
              {
                date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
                author: 'Auditoria Pericial Dom RockFeller',
                text: 'Laudo pericial contábil finalizado. Identificado spread bancário abusivo e capitalização indevida de juros.'
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
    const pollInterval = setInterval(() => {
      fetchCases();
    }, 4000);
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
        phone: currentUser.phone || '(48) 92004-9681',
        cityUnit: newVehicleForm.cityUnit || currentUser.cityUnit || 'Santa Catarina (SC)',
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
            text: `Ficha de solicitação enviada pelo cliente. Veículo: ${newVehicleForm.vehicleModel} (Placa ${newVehicleForm.vehiclePlate.toUpperCase()}). Saldo estimado: R$ ${residual.toLocaleString('pt-BR')}. Estado: ${newVehicleForm.cityUnit}.`
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
        cityUnit: currentUser.cityUnit || 'Santa Catarina (SC)',
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
        return { label: 'Quitado / Baixa de Gravame Concluída', color: '#047857', bg: '#DCFCE7', border: '#10B981' };
      case 'Acordo Homologado (Pendente Pagamento)':
        return { label: 'Acordo Homologado Judicialmente', color: '#0369A1', bg: '#E0F2FE', border: '#38BDF8' };
      case 'Acordo em Negociação':
      case 'Negociação Bancária':
        return { label: 'Mesa de Acordo Judicial Aberta', color: '#BE185D', bg: '#FCE7F3', border: '#F472B6' };
      case 'Depósito Incontroverso Ativo':
        return { label: 'Depósito Judicial Incontroverso Ativo', color: '#6D28D9', bg: '#EDE9FE', border: '#A855F7' };
      case 'Ação Revisional Protocolada':
        return { label: 'Ação Revisional Protocolada na Justiça', color: '#B45309', bg: '#FEF3C7', border: '#F59E0B' };
      case 'Pendente Documentação':
        return { label: 'Pendente Documentação (CRLV / Contrato)', color: '#C2410C', bg: '#FFEDD5', border: '#F97316' };
      case 'Ficha em Análise':
      case 'Em Análise':
      default:
        return { label: 'Ficha em Análise Pericial Contábil', color: '#1D4ED8', bg: '#DBEAFE', border: '#3B82F6' };
    }
  };

  const getStepNumber = (st) => {
    if (st === 'Pago / Baixa de Gravame' || st === 'Quitado com Sucesso') return 5;
    if (st === 'Acordo Homologado (Pendente Pagamento)') return 4;
    if (st === 'Acordo em Negociação' || st === 'Negociação Bancária' || st === 'Proposta Enviada') return 4;
    if (st === 'Depósito Incontroverso Ativo') return 3;
    if (st === 'Ação Revisional Protocolada') return 2;
    return 1;
  };

  const isLimitReached = cases.length >= MAX_VEHICLES_PER_ACCOUNT;

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 74px)', background: '#F8FAFC' }}>
      
      {/* Hidden File Input for Profile Picture */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handlePhotoUpload}
        accept="image/*"
        style={{ display: 'none' }}
      />

      {/* ========================================================= */}
      {/* 1. LEFT COLLAPSIBLE SIDEBAR (DESKTOP & MOBILE RESPONSIVE) */}
      {/* ========================================================= */}
      <aside
        className={`client-sidebar ${isSidebarOpen ? 'sidebar-expanded' : 'sidebar-collapsed'} ${isMobileDrawerOpen ? 'mobile-open' : ''}`}
        style={{
          background: '#FFFFFF',
          borderRight: '1px solid #E2E8F0',
          boxShadow: '4px 0 25px rgba(10, 37, 64, 0.04)',
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 0.3s cubic-bezier(0.16, 1, 0.3, 1), transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          zIndex: 100,
          position: 'sticky',
          top: '74px',
          height: 'calc(100vh - 74px)',
          overflowY: 'auto'
        }}
      >
        {/* Sidebar Header & Toggle */}
        <div style={{
          padding: isSidebarOpen ? '20px 22px' : '20px 12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: isSidebarOpen ? 'space-between' : 'center',
          borderBottom: '1px solid #F1F5F9'
        }}>
          {isSidebarOpen ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.05rem', fontWeight: 900, color: '#0A2540' }}>
                DOM <span style={{ color: '#C59B27' }}>PORTAL</span>
              </span>
            </div>
          ) : (
            <div style={{ width: '10px' }} />
          )}

          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="sidebar-toggle-btn"
            title={isSidebarOpen ? 'Recolher Menu Lateral' : 'Expandir Menu Lateral'}
            style={{
              background: '#F1F5F9',
              border: '1px solid #E2E8F0',
              borderRadius: '8px',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#0A2540',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {isSidebarOpen ? <ChevronLeft size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* User Profile Card with Avatar & Photo Upload in Sidebar */}
        <div style={{
          padding: isSidebarOpen ? '20px' : '16px 8px',
          borderBottom: '1px solid #F1F5F9',
          textAlign: 'center'
        }}>
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: '8px' }}>
            <div 
              onClick={() => fileInputRef.current?.click()}
              title="Clique para alterar foto de perfil"
              style={{
                width: isSidebarOpen ? '68px' : '44px',
                height: isSidebarOpen ? '68px' : '44px',
                borderRadius: '50%',
                background: '#F1F5F9',
                border: '2.5px solid #C59B27',
                boxShadow: '0 4px 14px rgba(197, 155, 39, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                cursor: 'pointer',
                margin: '0 auto',
                transition: 'all 0.25s ease'
              }}
            >
              {profilePhoto ? (
                <img 
                  src={profilePhoto} 
                  alt={currentUser?.name} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              ) : (
                <User size={isSidebarOpen ? 32 : 22} color="#0A2540" />
              )}
            </div>

            {/* Camera Badge over avatar */}
            <button
              onClick={() => fileInputRef.current?.click()}
              title="Alterar Foto de Perfil"
              style={{
                position: 'absolute',
                bottom: '-2px',
                right: isSidebarOpen ? '-2px' : '-6px',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: '#0A2540',
                border: '1.5px solid #FFFFFF',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
              }}
            >
              <Camera size={12} />
            </button>
          </div>

          {isSidebarOpen && (
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.94rem', color: '#0A2540', lineHeight: 1.3 }}>
                {currentUser?.name || 'Cliente'}
              </div>
              <div style={{ fontSize: '0.74rem', color: '#059669', fontWeight: 700, marginTop: '2px' }}>
                {currentUser?.cityUnit ? `Estado: ${currentUser.cityUnit}` : 'Conta Verificada'}
              </div>

              <button
                onClick={() => fileInputRef.current?.click()}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#876214',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  marginTop: '4px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  textDecoration: 'underline'
                }}
              >
                <Upload size={11} /> Alterar Foto
              </button>

              {photoSuccessMsg && (
                <div style={{ fontSize: '0.70rem', color: '#047857', fontWeight: 700, marginTop: '4px' }}>
                  ✓ Foto atualizada com sucesso!
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar Nav Items */}
        <nav style={{ padding: '16px 10px', display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
          <button
            onClick={() => { setActiveTab('overview'); setIsMobileDrawerOpen(false); }}
            className={`sidebar-nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            title="Visão Geral & Frotas"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: isSidebarOpen ? '11px 14px' : '11px',
              borderRadius: '10px',
              border: 'none',
              background: activeTab === 'overview' ? 'rgba(197, 155, 39, 0.12)' : 'transparent',
              color: activeTab === 'overview' ? '#876214' : '#1E293B',
              fontWeight: activeTab === 'overview' ? 800 : 600,
              fontSize: '0.90rem',
              cursor: 'pointer',
              justifyContent: isSidebarOpen ? 'flex-start' : 'center',
              transition: 'all 0.2s ease',
              width: '100%'
            }}
          >
            <Car size={18} color={activeTab === 'overview' ? '#C59B27' : '#0A2540'} />
            {isSidebarOpen && <span>Meus Veículos ({cases.length})</span>}
          </button>

          <button
            onClick={() => { setIsAddVehicleOpen(true); setIsMobileDrawerOpen(false); }}
            className="sidebar-nav-item"
            title="Cadastrar Novo Veículo"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: isSidebarOpen ? '11px 14px' : '11px',
              borderRadius: '10px',
              border: 'none',
              background: 'transparent',
              color: '#1E293B',
              fontWeight: 600,
              fontSize: '0.90rem',
              cursor: 'pointer',
              justifyContent: isSidebarOpen ? 'flex-start' : 'center',
              transition: 'all 0.2s ease',
              width: '100%'
            }}
          >
            <PlusCircle size={18} color="#059669" />
            {isSidebarOpen && <span>+ Novo Veículo</span>}
          </button>

          <button
            onClick={() => { setActiveTab('profile'); setIsMobileDrawerOpen(false); }}
            className={`sidebar-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
            title="Meu Perfil & Foto"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: isSidebarOpen ? '11px 14px' : '11px',
              borderRadius: '10px',
              border: 'none',
              background: activeTab === 'profile' ? 'rgba(197, 155, 39, 0.12)' : 'transparent',
              color: activeTab === 'profile' ? '#876214' : '#1E293B',
              fontWeight: activeTab === 'profile' ? 800 : 600,
              fontSize: '0.90rem',
              cursor: 'pointer',
              justifyContent: isSidebarOpen ? 'flex-start' : 'center',
              transition: 'all 0.2s ease',
              width: '100%'
            }}
          >
            <User size={18} color={activeTab === 'profile' ? '#C59B27' : '#0A2540'} />
            {isSidebarOpen && <span>Meu Perfil & Foto</span>}
          </button>

          <button
            onClick={() => { onOpenChat(); setIsMobileDrawerOpen(false); }}
            className="sidebar-nav-item"
            title="Chat com a Diretoria"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: isSidebarOpen ? '11px 14px' : '11px',
              borderRadius: '10px',
              border: 'none',
              background: 'transparent',
              color: '#1E293B',
              fontWeight: 600,
              fontSize: '0.90rem',
              cursor: 'pointer',
              justifyContent: isSidebarOpen ? 'flex-start' : 'center',
              transition: 'all 0.2s ease',
              width: '100%'
            }}
          >
            <MessageSquare size={18} color="#2563EB" />
            {isSidebarOpen && <span>Falar com Diretoria</span>}
          </button>
        </nav>

        {/* Sidebar Footer */}
        <div style={{
          padding: '14px 10px',
          borderTop: '1px solid #F1F5F9',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px'
        }}>
          <button
            onClick={onBackToSite}
            className="sidebar-nav-item"
            title="Voltar ao Site"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: isSidebarOpen ? '10px 14px' : '10px',
              borderRadius: '10px',
              border: 'none',
              background: 'transparent',
              color: '#475569',
              fontWeight: 600,
              fontSize: '0.86rem',
              cursor: 'pointer',
              justifyContent: isSidebarOpen ? 'flex-start' : 'center',
              width: '100%'
            }}
          >
            <Home size={17} color="#64748B" />
            {isSidebarOpen && <span>Voltar ao Site</span>}
          </button>

          {onLogout && (
            <button
              onClick={onLogout}
              className="sidebar-nav-item"
              title="Sair da Conta"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: isSidebarOpen ? '10px 14px' : '10px',
                borderRadius: '10px',
                border: 'none',
                background: 'transparent',
                color: '#DC2626',
                fontWeight: 600,
                fontSize: '0.86rem',
                cursor: 'pointer',
                justifyContent: isSidebarOpen ? 'flex-start' : 'center',
                width: '100%'
              }}
            >
              <LogOut size={17} color="#DC2626" />
              {isSidebarOpen && <span>Sair da Conta</span>}
            </button>
          )}
        </div>
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileDrawerOpen && (
        <div 
          onClick={() => setIsMobileDrawerOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(10, 37, 64, 0.5)',
            backdropFilter: 'blur(4px)',
            zIndex: 99
          }}
        />
      )}

      {/* ========================================================= */}
      {/* 2. MAIN CONTENT AREA (CENTERED, ALIGNED, DARK CRISP TEXT)  */}
      {/* ========================================================= */}
      <main style={{ flex: 1, padding: '28px 24px 80px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        
        {/* Mobile Sidebar Toggle Button Bar */}
        <div className="mobile-sidebar-bar" style={{ display: 'none', marginBottom: '18px', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            onClick={() => setIsMobileDrawerOpen(true)}
            className="btn btn-secondary btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#0A2540', fontWeight: 700 }}
          >
            <Menu size={18} />
            <span>Menu do Painel</span>
          </button>

          <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#0A2540' }}>
            Olá, {currentUser?.name?.split(' ')[0]}
          </span>
        </div>

        {/* ================= TAB 1: OVERVIEW / DASHBOARD ================= */}
        {activeTab === 'overview' && (
          <div>
            {/* Top Welcome Card with High Contrast */}
            <div style={{
              background: '#FFFFFF',
              border: '1.5px solid #E2E8F0',
              borderRadius: '20px',
              padding: '28px 30px',
              marginBottom: '24px',
              boxShadow: '0 4px 20px rgba(10, 37, 64, 0.05)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #F59E0B, #10B981, #F59E0B)' }} />
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '20px',
                      background: '#DCFCE7',
                      color: '#047857',
                      border: '1px solid #10B981',
                      fontSize: '0.76rem',
                      fontWeight: 800,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}>
                      <ShieldCheck size={14} /> Portal do Cliente Dom RockFeller
                    </span>

                    {/* Live Polling Badge */}
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '4px 10px',
                      borderRadius: '16px',
                      background: '#E0F2FE',
                      border: '1px solid #38BDF8',
                      fontSize: '0.74rem',
                      fontWeight: 800,
                      color: '#0369A1'
                    }}>
                      <span style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: '#0284C7',
                        display: 'inline-block',
                        boxShadow: '0 0 6px #0284C7'
                      }} />
                      <span>AO VIVO</span>
                      <span style={{ color: '#0A2540', fontWeight: 600, fontSize: '0.7rem' }}>
                        &bull; Sincronizado às {lastSyncTime.toLocaleTimeString('pt-BR')}
                      </span>
                    </div>

                    <button
                      onClick={handleManualRefresh}
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '4px 10px', fontSize: '0.74rem', color: '#0A2540', fontWeight: 700 }}
                      title="Sincronizar processo agora"
                    >
                      <RefreshCw size={12} className={isRefreshing ? 'animate-spin' : ''} />
                      <span>Atualizar</span>
                    </button>
                  </div>

                  {/* HIGH CONTRAST DARK HEADING */}
                  <h1 style={{ fontSize: '1.9rem', color: '#0A2540', fontWeight: 900, margin: '4px 0 6px', letterSpacing: '-0.02em' }}>
                    Olá, {currentUser?.name}!
                  </h1>
                  
                  {/* HIGH CONTRAST DARK SUBTITLE */}
                  <p style={{ color: '#334E68', fontSize: '0.94rem', margin: 0, fontWeight: 500 }}>
                    Acompanhe ao vivo o andamento da ação revisional, perícia contábil e status da desalienação dos seus veículos no <strong>{currentUser?.cityUnit || 'Estado Santa Catarina (SC)'}</strong>.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => setIsAddVehicleOpen(true)}
                    disabled={isLimitReached}
                    className={`btn ${isLimitReached ? 'btn-secondary' : 'btn-gold'} btn-sm`}
                    style={{ fontWeight: 800 }}
                  >
                    <PlusCircle size={16} />
                    <span>+ Cadastrar Veículo ({cases.length}/{MAX_VEHICLES_PER_ACCOUNT})</span>
                  </button>

                  <button
                    onClick={onOpenChat}
                    className="btn btn-secondary btn-sm"
                    style={{ color: '#0A2540', fontWeight: 700 }}
                  >
                    <MessageSquare size={16} color="#876214" />
                    <span>Chat Diretoria</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Fleet Quota Capacity Banner with Dark Crisp Text */}
            <div style={{
              background: '#FFFFFF',
              border: isLimitReached ? '1.5px solid #EF4444' : '1px solid #E2E8F0',
              borderRadius: '16px',
              padding: '18px 24px',
              marginBottom: '24px',
              boxShadow: '0 2px 10px rgba(10, 37, 64, 0.03)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Car size={22} color="#C59B27" />
                  <div>
                    <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0A2540' }}>
                      Capacidade de Frota da Conta:
                    </span>
                    <span style={{ fontSize: '0.88rem', color: '#334E68', marginLeft: '8px' }}>
                      Você possui <strong style={{ color: '#0A2540' }}>{cases.length}</strong> de até <strong style={{ color: '#0A2540' }}>{MAX_VEHICLES_PER_ACCOUNT}</strong> veículos cadastrados.
                    </span>
                  </div>
                </div>

                <span style={{
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  padding: '4px 12px',
                  borderRadius: '12px',
                  background: isLimitReached ? '#FEE2E2' : '#FEF3C7',
                  color: isLimitReached ? '#DC2626' : '#B45309',
                  border: `1px solid ${isLimitReached ? '#EF4444' : '#F59E0B'}`
                }}>
                  {isLimitReached ? 'LIMITE MÁXIMO ATINGIDO (10/10)' : `${MAX_VEHICLES_PER_ACCOUNT - cases.length} VAGA(S) RESTANTE(S)`}
                </span>
              </div>

              {/* Progress Bar */}
              <div style={{ height: '8px', width: '100%', background: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${(cases.length / MAX_VEHICLES_PER_ACCOUNT) * 100}%`,
                  background: isLimitReached ? 'linear-gradient(90deg, #F59E0B, #EF4444)' : 'linear-gradient(90deg, #10B981, #C59B27)',
                  borderRadius: '4px',
                  transition: 'width 0.4s ease'
                }} />
              </div>
            </div>

            {/* Legal Transparency Alert Box with Dark Readable Typography */}
            <div style={{
              background: '#FFFBEB',
              border: '1.5px solid #FCD34D',
              borderRadius: '14px',
              padding: '16px 20px',
              marginBottom: '26px',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              fontSize: '0.88rem',
              color: '#78350F',
              lineHeight: 1.55
            }}>
              <Scale size={24} color="#B45309" style={{ flexShrink: 0 }} />
              <div>
                <strong style={{ color: '#92400E' }}>Transparência Jurídica &amp; Mitigação de Riscos:</strong> A Dom RockFeller ajuíza ações revisionais legítimas fundamentadas no Código de Defesa do Consumidor e súmulas do STJ. Mantemos você 100% informado dos riscos do Decreto-Lei 911/69 (busca e apreensão), instruindo medidas liminares e depósitos judiciais para proteção do seu patrimônio.
              </div>
            </div>

            {/* Section Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
              <h2 style={{ fontSize: '1.35rem', color: '#0A2540', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Car size={20} color="#C59B27" />
                <span>Veículos sob Assessoria ({cases.length})</span>
              </h2>
              <div style={{ fontSize: '0.84rem', color: '#475569', fontWeight: 600 }}>
                Status e esteira jurídica sincronizados em tempo real
              </div>
            </div>

            {/* Vehicles Cards List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
              {cases.map((cs, idx) => {
                const badge = getStatusBadge(cs.status);
                const stepNum = getStepNumber(cs.status);
                const isPaid = cs.paymentStatus === 'Pago' || cs.status?.includes('Pago') || cs.status?.includes('Quitado');
                const isUnderApproval = cs.status === 'Ficha em Análise' || cs.status?.includes('Análise');

                return (
                  <div 
                    key={cs.id || idx} 
                    style={{ 
                      background: '#FFFFFF',
                      borderRadius: '20px',
                      padding: '28px',
                      border: isPaid ? '2px solid #10B981' : isUnderApproval ? '1.5px solid #F59E0B' : '1.5px solid #E2E8F0',
                      boxShadow: '0 4px 20px rgba(10, 37, 64, 0.05)',
                      position: 'relative'
                    }}
                  >
                    {/* Header Row */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
                          <h3 style={{ fontSize: '1.45rem', color: '#0A2540', fontWeight: 900, margin: 0 }}>
                            {cs.vehicleModel}
                          </h3>

                          {/* Placa Mercosul */}
                          <span style={{
                            padding: '3px 10px',
                            borderRadius: '6px',
                            background: '#0F172A',
                            color: '#FFFFFF',
                            fontFamily: 'monospace',
                            fontSize: '0.84rem',
                            fontWeight: 800,
                            letterSpacing: '0.08em',
                            border: '1.5px solid #334155'
                          }}>
                            {cs.vehiclePlate || 'S/ PLACA'}
                          </span>

                          {/* Badge de Aprovação */}
                          <span style={{
                            padding: '4px 10px',
                            borderRadius: '12px',
                            fontSize: '0.74rem',
                            fontWeight: 800,
                            background: isUnderApproval ? '#FEF3C7' : '#DCFCE7',
                            color: isUnderApproval ? '#92400E' : '#065F46',
                            border: `1px solid ${isUnderApproval ? '#F59E0B' : '#10B981'}`
                          }}>
                            {isUnderApproval ? 'FICHA EM ANÁLISE' : 'FICHA APROVADA'}
                          </span>
                        </div>

                        {/* Metadados do Veículo com ALTA LEGIBILIDADE */}
                        <div style={{ fontSize: '0.88rem', color: '#334E68', display: 'flex', flexWrap: 'wrap', gap: '14px', fontWeight: 600 }}>
                          <span>Banco Financiador: <strong style={{ color: '#0A2540' }}>{cs.bank}</strong></span>
                          <span>&bull;</span>
                          <span>Estado Responsável: <strong style={{ color: '#0A2540' }}>{cs.cityUnit}</strong></span>
                          <span>&bull;</span>
                          <span>Processo Judicial: <strong style={{ color: '#0284C7' }}>{cs.processNumber || 'Em fase pericial contábil'}</strong></span>
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
                        border: `1.5px solid ${badge.border}`,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        {badge.label}
                      </span>
                    </div>

                    {/* Esteira Visual do Processo (5 Etapas) */}
                    <div style={{
                      marginBottom: '24px',
                      background: '#F8FAFC',
                      padding: '18px 20px',
                      borderRadius: '14px',
                      border: '1px solid #E2E8F0'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0A2540', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Clock size={16} color="#C59B27" />
                          <span>Esteira do Processo em Tempo Real (Fase {stepNum} de 5):</span>
                        </div>
                        <span style={{ fontSize: '0.80rem', color: '#047857', fontWeight: 800 }}>
                          {stepNum === 5 ? '100% Concluído' : `${stepNum * 20}% do Fluxo Processual`}
                        </span>
                      </div>

                      {/* Labels com Texto Escuro Legível */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(5, 1fr)',
                        fontSize: '0.78rem',
                        marginBottom: '8px',
                        gap: '6px',
                        fontWeight: 700
                      }}>
                        <div style={{ color: stepNum >= 1 ? '#0A2540' : '#94A3B8' }}>1. Auditoria Pericial</div>
                        <div style={{ color: stepNum >= 2 ? '#0A2540' : '#94A3B8' }}>2. Ação Revisional</div>
                        <div style={{ color: stepNum >= 3 ? '#0A2540' : '#94A3B8' }}>3. Depósito Judicial</div>
                        <div style={{ color: stepNum >= 4 ? '#0A2540' : '#94A3B8' }}>4. Acordo Homologado</div>
                        <div style={{ color: stepNum >= 5 ? '#047857' : '#94A3B8' }}>5. Quitação & Baixa</div>
                      </div>

                      {/* Progress Bar */}
                      <div style={{ height: '8px', width: '100%', background: '#E2E8F0', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{
                          height: '100%',
                          width: `${(stepNum / 5) * 100}%`,
                          background: stepNum === 5 ? 'linear-gradient(90deg, #10B981, #059669)' : 'linear-gradient(90deg, #F59E0B, #10B981)',
                          borderRadius: '4px',
                          transition: 'width 0.4s ease'
                        }} />
                      </div>
                    </div>

                    {/* Financial Summary Grid with Deep Contrast */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '16px',
                      background: '#F8FAFC',
                      borderRadius: '16px',
                      padding: '20px',
                      marginBottom: '22px',
                      border: '1px solid #E2E8F0'
                    }}>
                      <div>
                        <div style={{ fontSize: '0.80rem', color: '#475569', fontWeight: 700, textTransform: 'uppercase' }}>
                          Dívida Contratual Original
                        </div>
                        <div style={{ fontSize: '1.25rem', color: '#64748B', textDecoration: 'line-through', fontWeight: 700 }}>
                          R$ {cs.contractResidualTotal?.toLocaleString('pt-BR')}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#334E68', fontWeight: 600 }}>
                          {cs.installmentsRemaining} parcelas de R$ {cs.installmentValue?.toLocaleString('pt-BR')}
                        </div>
                      </div>

                      <div>
                        <div style={{ fontSize: '0.80rem', color: '#047857', fontWeight: 700, textTransform: 'uppercase' }}>
                          Quitação Alvo Negociada
                        </div>
                        <div style={{ fontSize: '1.45rem', color: '#047857', fontWeight: 900 }}>
                          R$ {cs.estimatedPayoff?.toLocaleString('pt-BR')}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#334E68', fontWeight: 600 }}>
                          Boleto quitado direto no credor
                        </div>
                      </div>

                      <div>
                        <div style={{ fontSize: '0.80rem', color: '#B45309', fontWeight: 700, textTransform: 'uppercase' }}>
                          Economia Estimada para Você
                        </div>
                        <div style={{ fontSize: '1.45rem', color: '#B45309', fontWeight: 900 }}>
                          R$ {cs.estimatedSavings?.toLocaleString('pt-BR')}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#047857', fontWeight: 800 }}>
                          ~{cs.discountPercentage}% de Redução Conquistada
                        </div>
                      </div>
                    </div>

                    {/* Timeline Notes with High-Legibility Dark Typography */}
                    {cs.notes && cs.notes.length > 0 && (
                      <div style={{ marginBottom: '22px' }}>
                        <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0A2540', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Clock size={16} color="#C59B27" /> Atualizações da Assessoria Jurídica:
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          {cs.notes.slice(0, 3).map((nt, noteIdx) => (
                            <div
                              key={noteIdx}
                              style={{
                                padding: '14px 16px',
                                background: noteIdx === 0 ? '#FEF3C7' : '#F1F5F9',
                                borderLeft: noteIdx === 0 ? '4px solid #F59E0B' : '4px solid #CBD5E1',
                                borderRadius: '8px',
                                fontSize: '0.88rem',
                                color: '#0F172A',
                                lineHeight: 1.55
                              }}
                            >
                              <div style={{ fontSize: '0.78rem', color: '#475569', marginBottom: '4px', display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
                                <strong style={{ color: '#0A2540' }}>{nt.author}</strong>
                                <span>{new Date(nt.date).toLocaleDateString('pt-BR')} às {new Date(nt.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                              </div>
                              <div style={{ color: '#1E293B', fontWeight: 500 }}>{nt.text}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Bottom Action Bar */}
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        <a
                          href={`https://api.whatsapp.com/send?phone=5548920049681&text=Ol%C3%A1!%20Sou%20o(a)%20cliente%20${encodeURIComponent(currentUser.name)}%20e%20gostaria%20de%20informa%C3%A7%C3%B5es%20sobre%20o%20ve%C3%ADculo%20${encodeURIComponent(cs.vehicleModel)}%20(Placa%20${encodeURIComponent(cs.vehiclePlate || '')}).`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-primary btn-sm"
                          style={{ fontWeight: 800 }}
                        >
                          <MessageSquare size={16} />
                          <span>Falar com Assessor</span>
                        </a>

                        <button
                          onClick={onOpenChat}
                          className="btn btn-secondary btn-sm"
                          style={{ color: '#0A2540', fontWeight: 700 }}
                        >
                          <Zap size={15} color="#C59B27" />
                          <span>Chat ao Vivo</span>
                        </button>
                      </div>

                      <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>
                        ID Contrato: #{cs.id}
                      </span>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= TAB 2: PROFILE & PHOTO MANAGEMENT ================= */}
        {activeTab === 'profile' && (
          <div style={{
            background: '#FFFFFF',
            borderRadius: '20px',
            padding: '34px',
            border: '1.5px solid #E2E8F0',
            boxShadow: '0 4px 20px rgba(10, 37, 64, 0.05)'
          }}>
            <h2 style={{ fontSize: '1.6rem', color: '#0A2540', fontWeight: 900, marginBottom: '6px' }}>
              Meu Perfil & Foto
            </h2>
            <p style={{ color: '#475569', fontSize: '0.90rem', marginBottom: '28px' }}>
              Gerencie sua foto de exibição, informações de contato e Estado de atendimento.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap', marginBottom: '32px', paddingBottom: '26px', borderBottom: '1px solid #F1F5F9' }}>
              <div style={{ position: 'relative' }}>
                <div style={{
                  width: '90px',
                  height: '90px',
                  borderRadius: '50%',
                  background: '#F1F5F9',
                  border: '3px solid #C59B27',
                  boxShadow: '0 6px 20px rgba(197, 155, 39, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden'
                }}>
                  {profilePhoto ? (
                    <img src={profilePhoto} alt={currentUser?.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <User size={42} color="#0A2540" />
                  )}
                </div>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="btn btn-gold btn-sm"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontWeight: 800, marginBottom: '6px' }}
                >
                  <Camera size={16} />
                  <span>Adicionar / Alterar Foto de Perfil</span>
                </button>
                <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
                  Formatos aceitos: JPG, PNG, WEBP (Máx. 5MB).
                </div>
                {photoSuccessMsg && (
                  <div style={{ fontSize: '0.82rem', color: '#047857', fontWeight: 700, marginTop: '4px' }}>
                    ✓ Foto atualizada e salva com sucesso!
                  </div>
                )}
              </div>
            </div>

            {/* Profile Data Info */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', color: '#475569', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Nome Completo</label>
                <input
                  type="text"
                  readOnly
                  value={currentUser?.name || ''}
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1.5px solid #CBD5E1', background: '#F8FAFC', color: '#0A2540', fontWeight: 700 }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', color: '#475569', fontWeight: 700, display: 'block', marginBottom: '4px' }}>E-mail Cadastrado</label>
                <input
                  type="email"
                  readOnly
                  value={currentUser?.email || ''}
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1.5px solid #CBD5E1', background: '#F8FAFC', color: '#0A2540', fontWeight: 700 }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', color: '#475569', fontWeight: 700, display: 'block', marginBottom: '4px' }}>WhatsApp (com 2FA ativo)</label>
                <input
                  type="text"
                  readOnly
                  value={currentUser?.phone || '(48) 92004-9681'}
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1.5px solid #CBD5E1', background: '#F8FAFC', color: '#0A2540', fontWeight: 700 }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', color: '#475569', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Estado de Atendimento</label>
                <input
                  type="text"
                  readOnly
                  value={currentUser?.cityUnit || 'Santa Catarina (SC)'}
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1.5px solid #CBD5E1', background: '#F8FAFC', color: '#0A2540', fontWeight: 700 }}
                />
              </div>
            </div>

            <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid #F1F5F9' }}>
              <button
                onClick={() => setActiveTab('overview')}
                className="btn btn-secondary"
                style={{ color: '#0A2540', fontWeight: 700 }}
              >
                &larr; Voltar para Meus Veículos
              </button>
            </div>
          </div>
        )}

      </main>

      {/* ========================================================= */}
      {/* 3. MODAL DE CADASTRO DE VEÍCULO (COM ESTADO SELETOR)       */}
      {/* ========================================================= */}
      {isAddVehicleOpen && (
        <div className="modal-overlay" onClick={() => setIsAddVehicleOpen(false)} style={{ zIndex: 1200 }}>
          <div 
            className="modal-content" 
            onClick={(e) => e.stopPropagation()} 
            style={{ 
              padding: '34px', 
              maxWidth: '640px',
              background: '#FFFFFF',
              borderRadius: '24px',
              border: '1.5px solid #E2E8F0',
              boxShadow: '0 25px 65px rgba(10, 37, 64, 0.2)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span className="badge badge-gold">
                    <Award size={13} /> Ficha de Aprovação
                  </span>
                  <span style={{ fontSize: '0.78rem', color: '#047857', fontWeight: 800 }}>
                    Vaga {cases.length + 1} de {MAX_VEHICLES_PER_ACCOUNT}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.45rem', color: '#0A2540', fontWeight: 900, margin: 0 }}>
                  Cadastrar Veículo para Quitação
                </h3>
                <p style={{ color: '#475569', fontSize: '0.86rem', margin: '4px 0 0' }}>
                  Envie os dados do veículo e financiamento para auditoria pericial contábil da Dom RockFeller.
                </p>
              </div>

              <button
                onClick={() => setIsAddVehicleOpen(false)}
                aria-label="Fechar"
                style={{
                  background: '#F1F5F9',
                  border: '1px solid #E2E8F0',
                  color: '#64748B',
                  width: '36px',
                  height: '36px',
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

            <form onSubmit={handleAddVehicleSubmit}>
              <div className="grid-3" style={{ gap: '12px', marginBottom: '12px' }}>
                <div className="form-group">
                  <label className="form-label" style={{ color: '#0A2540', fontWeight: 700 }}>Tipo</label>
                  <select
                    className="form-select"
                    value={newVehicleForm.vehicleType}
                    onChange={(e) => setNewVehicleForm({ ...newVehicleForm, vehicleType: e.target.value })}
                    style={{ background: '#F8FAFC', border: '1.5px solid #CBD5E1', color: '#0A2540', fontWeight: 600 }}
                  >
                    <option value="Carro">Carro de Passeio</option>
                    <option value="SUV / Picape">SUV / Picape</option>
                    <option value="Moto">Motocicleta</option>
                    <option value="Caminhão / Utilitário">Caminhão / Utilitário</option>
                  </select>
                </div>

                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label" style={{ color: '#0A2540', fontWeight: 700 }}>Marca e Modelo</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="Ex: Toyota Corolla Cross XRE 2.0"
                    value={newVehicleForm.vehicleModel}
                    onChange={(e) => setNewVehicleForm({ ...newVehicleForm, vehicleModel: e.target.value })}
                    style={{ background: '#F8FAFC', border: '1.5px solid #CBD5E1', color: '#0A2540' }}
                  />
                </div>
              </div>

              <div className="grid-2" style={{ gap: '14px', marginBottom: '12px' }}>
                <div className="form-group">
                  <label className="form-label" style={{ color: '#0A2540', fontWeight: 700 }}>Placa (Padrão Mercosul)</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="Ex: RIX-9A10"
                    style={{ textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.05em', background: '#F8FAFC', border: '1.5px solid #CBD5E1', color: '#0A2540' }}
                    value={newVehicleForm.vehiclePlate}
                    onChange={(e) => setNewVehicleForm({ ...newVehicleForm, vehiclePlate: e.target.value.toUpperCase() })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ color: '#0A2540', fontWeight: 700 }}>Banco / Financeira Credora</label>
                  <select
                    className="form-select"
                    value={newVehicleForm.bank}
                    onChange={(e) => setNewVehicleForm({ ...newVehicleForm, bank: e.target.value })}
                    style={{ background: '#F8FAFC', border: '1.5px solid #CBD5E1', color: '#0A2540', fontWeight: 600 }}
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

              <div className="grid-2" style={{ gap: '14px', marginBottom: '12px' }}>
                <div className="form-group">
                  <label className="form-label" style={{ color: '#0A2540', fontWeight: 700 }}>Valor Parcela Atual (R$)</label>
                  <input
                    type="number"
                    required
                    className="form-input"
                    value={newVehicleForm.installmentValue}
                    onChange={(e) => setNewVehicleForm({ ...newVehicleForm, installmentValue: e.target.value })}
                    style={{ background: '#F8FAFC', border: '1.5px solid #CBD5E1', color: '#0A2540' }}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ color: '#0A2540', fontWeight: 700 }}>Parcelas Restantes</label>
                  <input
                    type="number"
                    required
                    className="form-input"
                    value={newVehicleForm.installmentsRemaining}
                    onChange={(e) => setNewVehicleForm({ ...newVehicleForm, installmentsRemaining: e.target.value })}
                    style={{ background: '#F8FAFC', border: '1.5px solid #CBD5E1', color: '#0A2540' }}
                  />
                </div>
              </div>

              {/* Dívida Residual */}
              <div style={{
                background: '#FEF3C7',
                border: '1px solid #F59E0B',
                borderRadius: '10px',
                padding: '10px 14px',
                marginBottom: '14px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.86rem'
              }}>
                <span style={{ color: '#92400E', fontWeight: 700 }}>Dívida Residual Estimada:</span>
                <strong style={{ color: '#B45309', fontSize: '1.1rem' }}>
                  R$ {((Number(newVehicleForm.installmentValue) || 0) * (Number(newVehicleForm.installmentsRemaining) || 0)).toLocaleString('pt-BR')}
                </strong>
              </div>

              <div className="grid-2" style={{ gap: '14px', marginBottom: '14px' }}>
                <div className="form-group">
                  <label className="form-label" style={{ color: '#0A2540', fontWeight: 700 }}>Situação das Parcelas</label>
                  <select
                    className="form-select"
                    value={newVehicleForm.delayStatus}
                    onChange={(e) => setNewVehicleForm({ ...newVehicleForm, delayStatus: e.target.value })}
                    style={{ background: '#F8FAFC', border: '1.5px solid #CBD5E1', color: '#0A2540', fontWeight: 600 }}
                  >
                    <option value="Em dia">Em dia</option>
                    <option value="1 a 3 parcelas em atraso">1 a 3 parcelas em atraso</option>
                    <option value="Mais de 3 parcelas / Notificado">Mais de 3 parcelas / Notificado</option>
                  </select>
                </div>

                {/* ESTADO SELECTOR (In place of Sede) */}
                <div className="form-group">
                  <label className="form-label" style={{ color: '#0A2540', fontWeight: 700 }}>Estado de Atendimento</label>
                  <select
                    className="form-select"
                    value={newVehicleForm.cityUnit}
                    onChange={(e) => setNewVehicleForm({ ...newVehicleForm, cityUnit: e.target.value })}
                    style={{ background: '#F8FAFC', border: '1.5px solid #CBD5E1', color: '#0A2540', fontWeight: 600 }}
                  >
                    {ESTADOS_BRASIL.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={submittingVehicle}
                className="btn btn-gold btn-lg"
                style={{ width: '100%', fontWeight: 800, padding: '14px' }}
              >
                {submittingVehicle ? 'Protocolando...' : '📤 Enviar Ficha do Veículo'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Styles for Responsive Sidebar & Mobile Drawer */}
      <style>{`
        .sidebar-expanded {
          width: 260px;
        }
        .sidebar-collapsed {
          width: 74px;
        }
        .sidebar-nav-item:hover {
          background: #F1F5F9 !important;
          color: #876214 !important;
        }
        @media (max-width: 900px) {
          .client-sidebar {
            position: fixed !important;
            top: 0 !important;
            bottom: 0 !important;
            left: 0 !important;
            height: 100vh !important;
            width: 270px !important;
            transform: translateX(-100%);
            z-index: 1100 !important;
          }
          .client-sidebar.mobile-open {
            transform: translateX(0) !important;
          }
          .mobile-sidebar-bar {
            display: flex !important;
          }
        }
      `}</style>
    </div>
  );
}
