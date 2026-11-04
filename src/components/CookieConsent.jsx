import React, { useState, useEffect } from 'react';
import { ShieldCheck, Cookie, Check, X, Lock, Settings2, ChevronDown, ChevronUp } from 'lucide-react';

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);

  useEffect(() => {
    const consent = localStorage.getItem('domrockfeller_cookie_consent_v1');
    if (!consent) {
      // Abre somente na primeira vez com entrada suave
      const timer = setTimeout(() => setIsVisible(true), 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('domrockfeller_cookie_consent_v1', JSON.stringify({
      level: 'all',
      date: new Date().toISOString(),
      analytics: true
    }));
    setIsVisible(false);
  };

  const handleAcceptEssential = () => {
    localStorage.setItem('domrockfeller_cookie_consent_v1', JSON.stringify({
      level: 'essential_only',
      date: new Date().toISOString(),
      analytics: false
    }));
    setIsVisible(false);
  };

  const handleSaveCustom = () => {
    localStorage.setItem('domrockfeller_cookie_consent_v1', JSON.stringify({
      level: 'custom',
      date: new Date().toISOString(),
      analytics: analyticsEnabled
    }));
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div 
      className="cookie-modal-overlay"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        background: 'rgba(5, 8, 15, 0.78)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        animation: 'cookieFadeIn 0.3s ease-out forwards'
      }}
    >
      <aside 
        role="dialog"
        aria-modal="true"
        aria-label="Consentimento de Cookies e Privacidade LGPD"
        className="cookie-card-anim"
        style={{
          width: '100%',
          maxWidth: '680px',
          background: 'linear-gradient(145deg, #0D111A 0%, #070A10 100%)',
          border: '1.5px solid rgba(245, 158, 11, 0.4)',
          borderRadius: '24px',
          boxShadow: '0 30px 80px -15px rgba(0, 0, 0, 0.9), 0 0 35px rgba(245, 158, 11, 0.2)',
          padding: '32px 30px',
          color: '#E2E8F0',
          position: 'relative'
        }}
      >
        {/* Header Row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '18px' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '16px',
            background: 'rgba(245, 158, 11, 0.15)',
            border: '1.5px solid rgba(245, 158, 11, 0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FBBF24',
            boxShadow: '0 0 20px rgba(245, 158, 11, 0.3)',
            flexShrink: 0
          }}>
            <Cookie size={28} />
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '4px' }}>
              <h3 style={{ margin: 0, fontSize: '1.24rem', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
                Privacidade & Verificação de Cookies
              </h3>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '3px 10px',
                borderRadius: '20px',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.35)',
                color: '#34D399',
                fontSize: '0.74rem',
                fontWeight: 800
              }}>
                <ShieldCheck size={13} /> LGPD &bull; Lei 13.709/18
              </span>
            </div>
            <p style={{ margin: 0, color: '#CBD5E1', fontSize: '0.88rem', lineHeight: 1.6 }}>
              A <strong>Dom RockFeller</strong> utiliza cookies essenciais e criptografia de ponta a ponta (TLS 1.3) para proteger seus dados pessoais, assegurar o cálculo de perícias contábeis e manter o sigilo de navegação.
            </p>
          </div>

          <button
            onClick={handleAcceptEssential}
            aria-label="Fechar"
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#94A3B8',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#FFFFFF';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#94A3B8';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Collapsible Details */}
        {showPreferences && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '14px',
            padding: '16px 18px',
            marginBottom: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong style={{ color: '#FFFFFF', fontSize: '0.86rem' }}>Cookies de Segurança e Sessão (Obrigatórios)</strong>
                <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>Imprescindíveis para login seguro, 2FA e prevenção de ataques CSRF.</div>
              </div>
              <span style={{ fontSize: '0.76rem', color: '#10B981', fontWeight: 800 }}>Sempre Ativos</span>
            </div>

            <hr style={{ borderColor: 'rgba(255, 255, 255, 0.08)', margin: '2px 0' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong style={{ color: '#FFFFFF', fontSize: '0.86rem' }}>Cookies de Preferência e Estado Regional</strong>
                <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>Memorizam o Estado selecionado para carregar os peritos mais próximos.</div>
              </div>
              <label style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={analyticsEnabled}
                  onChange={(e) => setAnalyticsEnabled(e.target.checked)}
                  style={{ accentColor: '#F59E0B', width: '18px', height: '18px' }}
                />
              </label>
            </div>
          </div>
        )}

        {/* Action Buttons Row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={handleAcceptAll}
              className="btn btn-gold"
              style={{
                padding: '12px 22px',
                fontSize: '0.92rem',
                fontWeight: 800,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 18px rgba(245, 158, 11, 0.35)'
              }}
            >
              <Check size={18} />
              <span>Aceitar Todos os Cookies</span>
            </button>

            {showPreferences ? (
              <button
                onClick={handleSaveCustom}
                className="btn btn-secondary"
                style={{ padding: '12px 18px', fontSize: '0.88rem', color: '#FFFFFF' }}
              >
                Salvar Preferências
              </button>
            ) : (
              <button
                onClick={handleAcceptEssential}
                className="btn btn-secondary"
                style={{ padding: '12px 18px', fontSize: '0.88rem', color: '#CBD5E1' }}
              >
                Apenas Essenciais
              </button>
            )}
          </div>

          <button
            onClick={() => setShowPreferences(!showPreferences)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#FBBF24',
              fontSize: '0.84rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 8px'
            }}
          >
            <Settings2 size={15} />
            <span>{showPreferences ? 'Ocultar Opções' : 'Configurar Preferências'}</span>
            {showPreferences ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>
        </div>

        <style>{`
          @keyframes cookieFadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes cookieScaleUp {
            from {
              opacity: 0;
              transform: scale(0.95) translateY(12px);
            }
            to {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
          }
          .cookie-card-anim {
            animation: cookieScaleUp 0.32s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
        `}</style>
      </aside>
    </div>
  );
}
