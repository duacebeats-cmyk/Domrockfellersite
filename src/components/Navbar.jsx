import React, { useState, useEffect } from 'react';
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
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      background: isScrolled ? 'rgba(255, 255, 255, 0.98)' : 'rgba(255, 255, 255, 0.92)',
      backdropFilter: isScrolled ? 'blur(20px)' : 'blur(14px)',
      WebkitBackdropFilter: isScrolled ? 'blur(20px)' : 'blur(14px)',
      borderBottom: isScrolled ? '1px solid rgba(197, 155, 39, 0.28)' : '1px solid #E2E8F0',
      boxShadow: isScrolled ? '0 10px 30px -4px rgba(10, 37, 64, 0.10)' : '0 4px 20px -2px rgba(15, 23, 42, 0.04)',
      transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
    }}>
      {/* Main Nav Bar */}
      <div 
        className="container" 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          height: isScrolled ? '64px' : '74px',
          transition: 'height 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        
        {/* Brand Logo: Institutional Wordmark */}
        <div 
          onClick={() => { setActiveView('site'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', userSelect: 'none', flexShrink: 0 }}
          title="Dom RockFeller"
        >
          <span style={{ fontSize: '1.38rem', fontWeight: 900, letterSpacing: '-0.025em', color: '#0A2540', whiteSpace: 'nowrap' }}>
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
            <span>Nossos Estados</span>
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
        <div 
          className="mobile-drawer-anim"
          style={{
            background: '#FFFFFF',
            borderBottom: '2px solid #E2E8F0',
            boxShadow: '0 20px 35px -10px rgba(15, 23, 42, 0.12)',
            padding: '16px 18px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}
        >
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
              <span style={{ fontSize: '0.92rem', fontWeight: 600, color: '#1E293B' }}>Estados Floripa &amp; Vitória</span>
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
        @keyframes mobileDrawerSlide {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .mobile-drawer-anim {
          animation: mobileDrawerSlide 0.28s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .desktop-nav {
          display: none;
          align-items: center;
          gap: 6px;
          white-space: nowrap;
          flex-shrink: 0;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .nav-item-link {
          font-size: 0.90rem;
          color: #334E68;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
          padding: 8px 12px;
          border-radius: 8px;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          white-space: nowrap !important;
          flex-shrink: 0;
          user-select: none;
          line-height: 1;
          position: relative;
        }
        .nav-item-link span {
          white-space: nowrap !important;
          line-height: 1;
          transition: color 0.2s ease;
        }
        .nav-item-link svg {
          flex-shrink: 0;
          vertical-align: middle;
          transition: transform 0.2s ease, stroke 0.2s ease;
        }
        .nav-item-link:hover {
          color: #876214;
          background: rgba(197, 155, 39, 0.10);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(197, 155, 39, 0.12);
        }
        .nav-item-link:hover svg {
          stroke: #876214 !important;
          transform: scale(1.1);
        }
        .nav-item-link:active {
          transform: translateY(0px) scale(0.98);
        }
        .nav-highlight {
          color: #876214 !important;
          background: rgba(197, 155, 39, 0.1) !important;
          border: 1px solid rgba(197, 155, 39, 0.3) !important;
          font-weight: 700 !important;
        }
        .nav-highlight:hover {
          background: rgba(197, 155, 39, 0.18) !important;
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
          transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .mobile-nav-card:hover {
          background: #F8FAFC;
          border-color: rgba(197, 155, 39, 0.4);
          transform: translateX(4px);
        }
        .mobile-nav-card:active {
          background: #F1F5F9;
          transform: scale(0.98);
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
