import React, { useState } from 'react';
import { 
  ShieldCheck, Calculator, Phone, Menu, X, Users, MessageSquare, 
  User, LogIn, LogOut, Crown, CheckCircle2, ChevronDown, Headphones 
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
      background: 'rgba(6, 8, 13, 0.94)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(245, 158, 11, 0.2)'
    }}>
      {/* Top Banner with Locations & Perfectly Centered Icons */}
      <div style={{
        background: 'linear-gradient(90deg, rgba(245, 158, 11, 0.12), rgba(10, 14, 22, 0.95))',
        borderBottom: '1px solid rgba(245, 158, 11, 0.1)',
        fontSize: '0.8rem',
        padding: '7px 0',
        color: '#94A3B8'
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px', flexWrap: 'wrap' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '7px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#F59E0B', display: 'inline-block', boxShadow: '0 0 8px #F59E0B', flexShrink: 0 }}></span>
              <span><strong style={{ color: '#FDE68A' }}>Sede Vitória - ES:</strong> Av. Américo Buaiz, 501 • Enseada do Suá</span>
            </span>

            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '7px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#FBBF24', display: 'inline-block', boxShadow: '0 0 8px #FBBF24', flexShrink: 0 }}></span>
              <span><strong style={{ color: '#FDE68A' }}>Sede Florianópolis - SC:</strong> Av. Rio Branco, 847 • Centro</span>
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <a 
              href="tel:2730994450" 
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#F8FAFC', textDecoration: 'none' }}
            >
              <Phone size={13} color="#FBBF24" />
              <span>(27) 3099-4450</span>
            </a>

            <span style={{ color: 'rgba(245, 158, 11, 0.3)' }}>|</span>

            <a 
              href="tel:4832248890" 
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#F8FAFC', textDecoration: 'none' }}
            >
              <Phone size={13} color="#FBBF24" />
              <span>(48) 3224-8890</span>
            </a>
          </div>

        </div>
      </div>

      {/* Main Nav Bar */}
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' }}>
        
        {/* Brand Logo with Crowned Golden Lion & Transparent Background */}
        <div 
          onClick={() => { setActiveView('site'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', userSelect: 'none' }}
          title="Dom RockFeller Soluções Financeiras"
        >
          {/* Transparent Lion Crown Emblem with Gold Ambient Halo */}
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            background: 'radial-gradient(circle, rgba(245, 158, 11, 0.22) 0%, rgba(10, 14, 22, 0.8) 70%)',
            border: '1.5px solid rgba(245, 158, 11, 0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 16px rgba(245, 158, 11, 0.25)',
            flexShrink: 0,
            transition: 'transform 0.2s ease'
          }}>
            <img 
              src="/lion-icon.png" 
              alt="Dom RockFeller" 
              style={{
                width: '36px',
                height: '36px',
                objectFit: 'contain',
                filter: 'drop-shadow(0 2px 6px rgba(245, 158, 11, 0.45))'
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.4rem', fontWeight: 900, letterSpacing: '-0.02em', color: '#FFFFFF', lineHeight: 1 }}>
              ROCK<span style={{ color: '#FBBF24' }}>FELLER</span>
            </span>
            <span style={{ 
              fontSize: '0.65rem', 
              background: 'rgba(245, 158, 11, 0.15)', 
              color: '#FDE68A', 
              padding: '2px 8px', 
              borderRadius: '4px', 
              fontWeight: 800, 
              border: '1px solid rgba(245, 158, 11, 0.4)',
              letterSpacing: '0.08em',
              lineHeight: 1.4
            }}>
              SOLUÇÕES
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links - Centered & Well-Proportioned */}
        <nav style={{ display: 'none', alignItems: 'center', gap: '26px' }} className="desktop-nav">
          <a onClick={() => scrollTo('estoque')} className="nav-item-link" style={{ color: '#FDE68A', fontWeight: 800 }}>
            ✨ Estoque (35 Carros)
          </a>
          <a onClick={() => scrollTo('como-funciona')} className="nav-item-link">
            Como Funciona
          </a>
          <a onClick={() => scrollTo('simulador')} className="nav-item-link">
            Simulador
          </a>
          <a onClick={() => scrollTo('sedes')} className="nav-item-link">
            Nossas Sedes
          </a>
          <a onClick={() => scrollTo('casos')} className="nav-item-link">
            Casos de Sucesso
          </a>
          <a onClick={() => scrollTo('faq')} className="nav-item-link">
            Dúvidas
          </a>
        </nav>

        {/* Action Buttons & Auth State */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          
          {/* AUTHENTICATION CONTROL (No admin link in public menu!) */}
          {!currentUser ? (
            <button
              onClick={onOpenAuth}
              className="btn btn-sm btn-gold"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '9px 20px', fontWeight: 700, fontSize: '0.88rem' }}
              title="Entrar na sua conta"
            >
              <User size={16} />
              <span>Entrar</span>
            </button>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              
              {/* Role specific view switcher button */}
              {currentUser.role === 'admin' && (
                <button
                  onClick={() => setActiveView(activeView === 'admin' ? 'site' : 'admin')}
                  className={`btn btn-sm ${activeView === 'admin' ? 'btn-secondary' : 'btn-gold'}`}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '8px 16px' }}
                  title="Painel Administrativo da Diretoria"
                >
                  <Crown size={15} color="#0A0D14" />
                  <span>{activeView === 'admin' ? 'Ver Site' : 'Painel Admin'}</span>
                </button>
              )}

              {currentUser.role === 'funcionario' && (
                <button
                  onClick={() => setActiveView(activeView === 'admin' ? 'site' : 'admin')}
                  className={`btn btn-sm ${activeView === 'admin' ? 'btn-secondary' : 'btn-gold'}`}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '8px 16px' }}
                  title="Central de Atendimento & CRM"
                >
                  <Headphones size={15} color="#0A0D14" />
                  <span>{activeView === 'admin' ? 'Ver Site' : 'Painel Atendente'}</span>
                </button>
              )}

              {currentUser.role === 'cliente' && (
                <button
                  onClick={() => setActiveView(activeView === 'client' ? 'site' : 'client')}
                  className={`btn btn-sm ${activeView === 'client' ? 'btn-secondary' : 'btn-gold'}`}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '8px 16px' }}
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
                style={{ padding: '8px 10px' }}
                title="Sair da Conta"
              >
                <LogOut size={15} color="#F87171" />
              </button>

            </div>
          )}

          {/* Mobile hamburger */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="btn btn-secondary btn-sm mobile-menu-toggle"
            style={{ padding: '8px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
            aria-label="Abrir Menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{
          background: '#0B0E17',
          borderBottom: '1px solid rgba(245, 158, 11, 0.2)',
          padding: '20px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px'
        }}>
          <a onClick={() => scrollTo('estoque')} style={{ fontSize: '1rem', color: '#FDE68A', fontWeight: 800, padding: '6px 0' }}>✨ Estoque (35 Carros)</a>
          <a onClick={() => scrollTo('como-funciona')} style={{ fontSize: '1rem', color: '#F8FAFC', padding: '6px 0' }}>Como Funciona</a>
          <a onClick={() => scrollTo('simulador')} style={{ fontSize: '1rem', color: '#F8FAFC', padding: '6px 0' }}>Simulador de Desconto</a>
          <a onClick={() => scrollTo('sedes')} style={{ fontSize: '1rem', color: '#F8FAFC', padding: '6px 0' }}>Sedes Vitória & Floripa</a>
          <a onClick={() => scrollTo('casos')} style={{ fontSize: '1rem', color: '#F8FAFC', padding: '6px 0' }}>Casos de Sucesso</a>
          <a onClick={() => scrollTo('faq')} style={{ fontSize: '1rem', color: '#F8FAFC', padding: '6px 0' }}>Dúvidas Frequentes</a>
          <hr style={{ borderColor: 'rgba(245, 158, 11, 0.15)' }} />
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {!currentUser ? (
              <button
                onClick={() => { setMobileMenuOpen(false); onOpenAuth(); }}
                className="btn btn-gold"
              >
                <LogIn size={16} /> Entrar / Minha Conta
              </button>
            ) : (
              <>
                <div style={{ fontSize: '0.85rem', color: '#94A3B8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Conectado: <strong style={{ color: '#FFFFFF' }}>{currentUser.name}</strong></span>
                  <span className="badge badge-gold">
                    {currentUser.role.toUpperCase()}
                  </span>
                </div>
                {(currentUser.role === 'admin' || currentUser.role === 'funcionario') ? (
                  <button
                    onClick={() => { setActiveView('admin'); setMobileMenuOpen(false); }}
                    className="btn btn-gold"
                  >
                    <Crown size={16} /> Abrir Painel de Gestão & Chat
                  </button>
                ) : (
                  <button
                    onClick={() => { setActiveView('client'); setMobileMenuOpen(false); }}
                    className="btn btn-gold"
                  >
                    <User size={16} /> Abrir Portal do Cliente
                  </button>
                )}
                <button
                  onClick={() => { onLogout(); setMobileMenuOpen(false); }}
                  className="btn btn-secondary"
                  style={{ color: '#F87171' }}
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
          font-size: 0.94rem;
          color: #E2E8F0;
          font-weight: 600;
          cursor: pointer;
          transition: color 0.2s ease, transform 0.2s ease;
          padding: 8px 4px;
          display: inline-block;
        }
        .nav-item-link:hover {
          color: #FBBF24;
          transform: translateY(-1px);
        }
        @media (min-width: 900px) {
          .desktop-nav { display: flex !important; }
          .mobile-menu-toggle { display: none !important; }
        }
        @media (max-width: 640px) {
          .hide-on-mobile { display: none !important; }
        }
      `}</style>
    </header>
  );
}
