import React from 'react';
import { Home, Car, Calculator, MessageSquare, User } from 'lucide-react';

export function MobileBottomNav({ 
  currentUser, 
  onOpenAuth, 
  setActiveView, 
  activeView 
}) {
  const scrollTo = (id) => {
    if (activeView !== 'site') {
      setActiveView('site');
    }
    setTimeout(() => {
      if (id === 'top') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 60);
  };

  const openWhatsApp = () => {
    window.open(
      'https://api.whatsapp.com/send?phone=5548920049681&text=Ol%C3%A1!%20Gostaria%20de%20atendimento%20da%20Dom%20RockFeller%20sobre%20an%C3%A1lise%20pericial%20e%20revisional.',
      '_blank',
      'noopener,noreferrer'
    );
  };

  const handleAccountClick = () => {
    if (!currentUser) {
      onOpenAuth();
    } else if (currentUser.role === 'admin' || currentUser.role === 'funcionario') {
      setActiveView(activeView === 'admin' ? 'site' : 'admin');
    } else {
      setActiveView(activeView === 'client' ? 'site' : 'client');
    }
  };

  return (
    <>
      <nav 
        className="mobile-bottom-app-bar"
        aria-label="Navegação Rápida Mobile"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 998,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
          borderTop: '1px solid #E2E8F0',
          boxShadow: '0 -4px 22px rgba(10, 37, 64, 0.08)',
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          alignItems: 'center',
          height: '62px',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)'
        }}
      >
        {/* 1. Início */}
        <button
          type="button"
          onClick={() => scrollTo('top')}
          className="mobile-app-nav-item"
          style={{
            background: 'none',
            border: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '3px',
            color: '#475569',
            padding: '6px 0',
            cursor: 'pointer'
          }}
        >
          <Home size={20} color="#0A2540" />
          <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#0A2540' }}>Início</span>
        </button>

        {/* 2. Vitrine */}
        <button
          type="button"
          onClick={() => scrollTo('vitrine')}
          className="mobile-app-nav-item"
          style={{
            background: 'none',
            border: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '3px',
            color: '#475569',
            padding: '6px 0',
            cursor: 'pointer'
          }}
        >
          <Car size={20} color="#C59B27" />
          <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#475569' }}>Vitrine</span>
        </button>

        {/* 3. Simular (Center Highlight / App Action Button) */}
        <button
          type="button"
          onClick={() => scrollTo('simulador')}
          className="mobile-app-nav-item"
          style={{
            background: 'none',
            border: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2px',
            cursor: 'pointer',
            marginTop: '-16px'
          }}
        >
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #0A2540 0%, #0F3256 100%)',
            border: '2px solid #C59B27',
            boxShadow: '0 4px 14px rgba(10, 37, 64, 0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#C59B27'
          }}>
            <Calculator size={22} color="#C59B27" />
          </div>
          <span style={{ fontSize: '0.66rem', fontWeight: 800, color: '#0A2540' }}>Simular</span>
        </button>

        {/* 4. WhatsApp */}
        <button
          type="button"
          onClick={openWhatsApp}
          className="mobile-app-nav-item"
          style={{
            background: 'none',
            border: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '3px',
            color: '#475569',
            padding: '6px 0',
            cursor: 'pointer',
            position: 'relative'
          }}
        >
          <div style={{ position: 'relative' }}>
            <MessageSquare size={20} color="#059669" />
            <span style={{
              position: 'absolute',
              top: '-2px',
              right: '-3px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#10B981',
              boxShadow: '0 0 6px #10B981'
            }} />
          </div>
          <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#047857' }}>WhatsApp</span>
        </button>

        {/* 5. Conta / Portal */}
        <button
          type="button"
          onClick={handleAccountClick}
          className="mobile-app-nav-item"
          style={{
            background: 'none',
            border: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '3px',
            color: '#475569',
            padding: '6px 0',
            cursor: 'pointer'
          }}
        >
          <User size={20} color={currentUser ? '#C59B27' : '#0A2540'} />
          <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#0A2540' }}>
            {currentUser ? 'Meu Perfil' : 'Entrar'}
          </span>
        </button>
      </nav>

      <style>{`
        @media (min-width: 769px) {
          .mobile-bottom-app-bar {
            display: none !important;
          }
        }
        .mobile-app-nav-item {
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .mobile-app-nav-item:hover {
          transform: translateY(-2px);
        }
        .mobile-app-nav-item:active {
          transform: scale(0.90);
        }
      `}</style>
    </>
  );
}
