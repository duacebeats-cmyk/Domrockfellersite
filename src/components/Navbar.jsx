import React, { useState } from 'react';
import { 
  ShieldCheck, Calculator, Phone, Menu, X, Users, MessageSquare, 
  User, LogIn, LogOut, Crown, CheckCircle2, ChevronDown, ChevronRight,
  Headphones, Car, Scale, Building2, Award, HelpCircle, Sparkles
} from 'lucide-react';

export function Navbar({ 
  activeView, 
  setActiveView, 
  onOpenSimulator, 
  onOpenChat, 
  currentUser, 
  onOpenAuth, 
  onLogout 
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollTo = (id) => {
    setActiveView('site');
    setMobileMenuOpen(false);
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 60);
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(255, 255, 255, 0.96)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid #E2E8F0',
      boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.04)'
    }}>
      {/* Main Nav Bar */}
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '74px' }}>
        
        {/* Brand Logo: Institutional Monogram Seal & Authority Wordmark */}
        <div 
          onClick={() => { setActiveView('site'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15, cursor: 'pointer', userSelect: 'none' }}
          title="Dom RockFeller"
        >
          <span style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.14em', color: '#64748B', textTransform: 'uppercase' }}>
            Assessoria &amp; Perícia
          </span>
          <span style={{ fontSize: '1.42rem', fontWeight: 900, letterSpacing: '-0.025em', color: '#0A2540' }}>
            DOM <span style={{ color: '#C59B27' }}>ROCKFELLER</span>
          </span>
        </div>

        {/* Desktop Navigation Links - Centered, Proportional & Paired with Icons */}
        <nav style={{ display: 'none', alignItems: 'center', gap: '8px' }} className="desktop-nav">
          <a onClick={() => scrollTo('vitrine')} className="nav-item-link">
            <Car size={15} color="#475569" />
            <span>Vitrine</span>
          </a>
          <a onClick={() => scrollTo('como-funciona')} className="nav-item-link">
            <Scale size={15} color="#475569" />
            <span>Como Funciona</span>
          </a>
          <a onClick={() => scrollTo('simulador')} className="nav-item-link">
            <Calculator size={15} color="#475569" />
            <span>Simulador</span>
          </a>
          <a onClick={() => scrollTo('sedes')} className="nav-item-link">
            <Building2 size={15} color="#475569" />
            <span>Nossas Sedes</span>
          </a>
          <a onClick={() => scrollTo('casos')} className="nav-item-link">
            <Award size={15} color="#475569" />
            <span>Casos Reais</span>
          </a>
          <a onClick={() => scrollTo('faq')} className="nav-item-link">
            <HelpCircle size={15} color="#475569" />
            <span>Dúvidas</span>
          </a>
        </nav>

        {/* Action Buttons & Auth State */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          
          {/* Quick Simulation CTA in Header (Desktop) */}
          <button
            onClick={() => scrollTo('simulador')}
            className="btn btn-sm btn-gold hide-on-tablet"
            style={{ padding: '8px 16px', fontSize: '0.84rem' }}
          >
            <Sparkles size={14} />
            <span>Simular Contrato</span>
          </button>

          {/* AUTHENTICATION CONTROL */}
          {!currentUser ? (
            <button
              onClick={onOpenAuth}
              className="btn btn-sm btn-secondary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '8px 16px', fontWeight: 700, fontSize: '0.86rem' }}
              title="Entrar na sua conta"
            >
              <User size={15} color="#475569" />
              <span>Entrar</span>
            </button>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              
              {/* Role specific view switcher button */}
              {currentUser.role === 'admin' && (
                <button
                  onClick={() => setActiveView(activeView === 'admin' ? 'site' : 'admin')}
                  className={`btn btn-sm ${activeView === 'admin' ? 'btn-secondary' : 'btn-gold'}`}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '8px 14px', fontSize: '0.84rem' }}
                  title="Painel Administrativo da Diretoria"
                >
                  <Crown size={15} />
                  <span>{activeView === 'admin' ? 'Ver Site' : 'Painel Admin'}</span>
                </button>
              )}

              {currentUser.role === 'funcionario' && (
                <button
                  onClick={() => setActiveView(activeView === 'admin' ? 'site' : 'admin')}
                  className={`btn btn-sm ${activeView === 'admin' ? 'btn-secondary' : 'btn-gold'}`}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '8px 14px', fontSize: '0.84rem' }}
                  title="Central de Atendimento & CRM"
                >
                  <Headphones size={15} />
                  <span>{activeView === 'admin' ? 'Ver Site' : 'Painel Atendente'}</span>
                </button>
              )}

              {currentUser.role === 'cliente' && (
                <button
                  onClick={() => setActiveView(activeView === 'client' ? 'site' : 'client')}
                  className={`btn btn-sm ${activeView === 'client' ? 'btn-secondary' : 'btn-gold'}`}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '8px 14px', fontSize: '0.84rem' }}
                  title="Acessar Portal do Cliente"
                >
                  <User size={15} />
                  <span>{activeView === 'client' ? 'Ver Site' : 'Minha Área'}</span>
                </button>
              )}

              {/* Logout button */}
              <button
                onClick={onLogout}
                className="btn btn-sm btn-secondary"
                style={{ padding: '8px 10px', color: '#EF4444' }}
                title="Sair da Conta"
              >
                <LogOut size={15} />
              </button>

            </div>
          )}

          {/* Mobile hamburger */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="btn btn-secondary btn-sm mobile-menu-toggle"
            style={{ padding: '8px 10px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
            aria-label="Abrir Menu"
          >
            {mobileMenuOpen ? <X size={20} color="#0F172A" /> : <Menu size={20} color="#0F172A" />}
          </button>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{
          background: '#FFFFFF',
          borderBottom: '2px solid #E2E8F0',
          boxShadow: '0 16px 30px -10px rgba(15, 23, 42, 0.1)',
          padding: '16px 18px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <a onClick={() => scrollTo('vitrine')} className="mobile-nav-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Car size={18} color="#C59B27" />
              </div>
              <span style={{ fontSize: '0.92rem', fontWeight: 600, color: '#1E293B' }}>Vitrine de Veículos (Venda &amp; Quitação)</span>
            </div>
            <ChevronRight size={16} color="#94A3B8" />
          </a>

          <a onClick={() => scrollTo('como-funciona')} className="mobile-nav-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Scale size={18} color="#2563EB" />
              </div>
              <span style={{ fontSize: '0.92rem', fontWeight: 600, color: '#1E293B' }}>Como Funciona a Quitação</span>
            </div>
            <ChevronRight size={16} color="#94A3B8" />
          </a>

          <a onClick={() => scrollTo('simulador')} className="mobile-nav-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Calculator size={18} color="#D97706" />
              </div>
              <span style={{ fontSize: '0.92rem', fontWeight: 600, color: '#1E293B' }}>Simulador de Desconto</span>
            </div>
            <ChevronRight size={16} color="#94A3B8" />
          </a>

          <a onClick={() => scrollTo('sedes')} className="mobile-nav-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Building2 size={18} color="#059669" />
              </div>
              <span style={{ fontSize: '0.92rem', fontWeight: 600, color: '#1E293B' }}>Sedes Floripa &amp; Vitória</span>
            </div>
            <ChevronRight size={16} color="#94A3B8" />
          </a>

          <a onClick={() => scrollTo('casos')} className="mobile-nav-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Award size={18} color="#D97706" />
              </div>
              <span style={{ fontSize: '0.92rem', fontWeight: 600, color: '#1E293B' }}>Casos de Sucesso Reais</span>
            </div>
            <ChevronRight size={16} color="#94A3B8" />
          </a>

          <a onClick={() => scrollTo('faq')} className="mobile-nav-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <HelpCircle size={18} color="#64748B" />
              </div>
              <span style={{ fontSize: '0.92rem', fontWeight: 600, color: '#1E293B' }}>Dúvidas Frequentes</span>
            </div>
            <ChevronRight size={16} color="#94A3B8" />
          </a>

          <hr style={{ borderColor: '#E2E8F0', margin: '6px 0' }} />
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {!currentUser ? (
              <button
                onClick={() => { setMobileMenuOpen(false); onOpenAuth(); }}
                className="btn btn-gold"
                style={{ width: '100%', padding: '12px' }}
              >
                <LogIn size={16} /> Entrar / Minha Conta
              </button>
            ) : (
              <>
                <div style={{ fontSize: '0.85rem', color: '#64748B', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0' }}>
                  <span>Conectado: <strong style={{ color: '#0F172A' }}>{currentUser.name}</strong></span>
                  <span className="badge badge-gold">
                    {currentUser.role.toUpperCase()}
                  </span>
                </div>
                {(currentUser.role === 'admin' || currentUser.role === 'funcionario') ? (
                  <button
                    onClick={() => { setActiveView('admin'); setMobileMenuOpen(false); }}
                    className="btn btn-gold"
                    style={{ width: '100%' }}
                  >
                    <Crown size={16} /> Abrir Painel de Gestão & Chat
                  </button>
                ) : (
                  <button
                    onClick={() => { setActiveView('client'); setMobileMenuOpen(false); }}
                    className="btn btn-gold"
                    style={{ width: '100%' }}
                  >
                    <User size={16} /> Abrir Portal do Cliente
                  </button>
                )}
                <button
                  onClick={() => { onLogout(); setMobileMenuOpen(false); }}
                  className="btn btn-secondary"
                  style={{ color: '#EF4444', width: '100%' }}
                >
                  <LogOut size={16} /> Sair da Conta
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        .nav-item-link {
          font-size: 0.88rem;
          color: #334155;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          padding: 8px 12px;
          border-radius: 8px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          user-select: none;
        }
        .nav-item-link:hover {
          color: #B45309;
          background: rgba(245, 158, 11, 0.08);
          transform: translateY(-1px);
        }
        .nav-highlight {
          color: #B45309 !important;
          background: rgba(245, 158, 11, 0.09) !important;
          border: 1px solid rgba(217, 119, 6, 0.22) !important;
          font-weight: 700 !important;
        }
        .nav-highlight:hover {
          background: rgba(245, 158, 11, 0.16) !important;
        }
        .mobile-nav-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 14px;
          border-radius: 10px;
          border: 1px solid #E2E8F0;
          background: #FFFFFF;
          cursor: pointer;
          transition: background 0.15s ease;
        }
        .mobile-nav-card:active {
          background: #F8FAFC;
        }
        @media (min-width: 960px) {
          .desktop-nav { display: flex !important; }
          .mobile-menu-toggle { display: none !important; }
        }
        @media (max-width: 1080px) {
          .hide-on-tablet { display: none !important; }
        }
      `}</style>
    </header>
  );
}
