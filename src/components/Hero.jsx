import React from 'react';
import { ShieldCheck, TrendingDown, CheckCircle2, MapPin, ArrowRight, Sparkles, Building2, Car, Lock, MessageSquare } from 'lucide-react';

export function Hero({ onOpenSimulator, onOpenChat }) {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section style={{
      position: 'relative',
      padding: '45px 0 65px',
      overflow: 'hidden'
    }}>
      {/* Decorative ambient radial gold spots for light theme */}
      <div style={{
        position: 'absolute',
        top: '-120px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '700px',
        height: '450px',
        background: 'radial-gradient(circle, rgba(245, 158, 11, 0.08) 0%, rgba(37, 99, 235, 0.04) 50%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '940px', margin: '0 auto', textAlign: 'center' }}>

          {/* Introductory Video Section - Dedicated Content Section */}
          <div style={{
            marginBottom: '42px',
            position: 'relative'
          }}>
            {/* Video Player Frame with Gold Accent and Elevated Glow */}
            <div style={{
              maxWidth: '920px',
              margin: '0 auto',
              borderRadius: '24px',
              overflow: 'hidden',
              background: '#000000',
              border: '2px solid rgba(197, 155, 39, 0.45)',
              boxShadow: '0 25px 60px -12px rgba(10, 37, 64, 0.28), 0 0 35px rgba(197, 155, 39, 0.22)',
              position: 'relative'
            }}>
              {/* Video Element */}
              <div style={{
                position: 'relative',
                width: '100%',
                background: '#000000',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <video
                  src="/videos/intro-dom-rockfeller.mp4"
                  controls
                  autoPlay
                  muted
                  loop
                  playsInline
                  style={{
                    width: '100%',
                    maxHeight: '520px',
                    display: 'block',
                    objectFit: 'contain',
                    background: '#000000'
                  }}
                >
                  <source src="/videos/intro-dom-rockfeller.mp4" type="video/mp4" />
                  Seu navegador não suporta a reprodução deste vídeo.
                </video>
              </div>
            </div>
          </div>

          {/* Main Headline */}
          <h1 style={{
            fontSize: 'clamp(2.2rem, 5vw, 3.6rem)',
            fontWeight: 900,
            lineHeight: 1.18,
            marginBottom: '20px',
            color: '#0F172A',
            letterSpacing: '-0.025em'
          }}>
            Análise Pericial de Juros Abusivos e <span className="text-gradient-gold">Ação Revisional na Justiça</span>
          </h1>

          {/* Subheading */}
          <p style={{
            fontSize: 'clamp(1.05rem, 2vw, 1.2rem)',
            color: '#475569',
            lineHeight: 1.68,
            maxWidth: '820px',
            margin: '0 auto 36px'
          }}>
            A <strong>Dom RockFeller</strong> analisa as abusividades contratuais do seu financiamento, ingressa com <strong>ações revisionais legítimas no Poder Judiciário</strong> e mantém você 100% ciente e assistido sobre os <strong>riscos de busca e apreensão</strong>, com defesas técnicas e estratégias eficazes para quitação por valor justo.
          </p>

          {/* Action CTAs */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '45px' }}>
            <button
              onClick={() => scrollTo('simulador')}
              className="btn btn-primary btn-lg"
              style={{ minWidth: 'min(100%, 260px)' }}
            >
              <Sparkles size={20} />
              <span>Simular Perícia do Meu Contrato</span>
            </button>

            <button
              onClick={onOpenChat}
              className="btn btn-secondary btn-lg"
              style={{ minWidth: 'min(100%, 240px)' }}
            >
              <MessageSquare size={18} color="#D97706" />
              <span>Falar com Atendente Humano</span>
            </button>
          </div>

          {/* Trust Guarantees Row */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '24px',
            flexWrap: 'wrap',
            color: '#334155',
            fontSize: '0.88rem',
            fontWeight: 600,
            paddingBottom: '20px'
          }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={18} color="#059669" /> Perícia Contábil Fundamentada no CDC
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={18} color="#059669" /> Defesa Técnica contra Busca e Apreensão
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={18} color="#059669" /> Sede Florianópolis • Vitória (Inauguração em breve)
            </span>
          </div>

        </div>

        {/* Live Metrics Grid */}
        <div className="grid-4" style={{ marginTop: '20px' }}>
          
          <div className="glass-card" style={{ padding: '24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #F59E0B, #B45309)' }} />
            <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#D97706', marginBottom: '4px' }}>R$ 18.4M+</div>
            <div style={{ fontSize: '0.94rem', fontWeight: 700, color: '#0F172A' }}>Economia Gerada</div>
            <div style={{ fontSize: '0.80rem', color: '#64748B', marginTop: '4px' }}>Dinheiro economizado por nossos clientes</div>
          </div>

          <div className="glass-card" style={{ padding: '24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #2563EB, #1D4ED8)' }} />
            <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#0F172A', marginBottom: '4px' }}>+3.800</div>
            <div style={{ fontSize: '0.94rem', fontWeight: 700, color: '#0F172A' }}>Veículos Desalienados</div>
            <div style={{ fontSize: '0.80rem', color: '#64748B', marginTop: '4px' }}>Carros, motos e utilitários quitados</div>
          </div>

          <div className="glass-card" style={{ padding: '24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #10B981, #059669)' }} />
            <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#059669', marginBottom: '4px' }}>Até 75%</div>
            <div style={{ fontSize: '0.94rem', fontWeight: 700, color: '#0F172A' }}>Redução Revisional</div>
            <div style={{ fontSize: '0.80rem', color: '#64748B', marginTop: '4px' }}>Economia em parcelas futuras e encargos</div>
          </div>

          <div className="glass-card" style={{ padding: '24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #D97706, #F59E0B)' }} />
            <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#0F172A', marginBottom: '4px' }}>Sedes Físicas</div>
            <div style={{ fontSize: '0.94rem', fontWeight: 700, color: '#0F172A' }}>Florianópolis &amp; Vitória (Em Breve)</div>
            <div style={{ fontSize: '0.80rem', color: '#64748B', marginTop: '4px' }}>Atendimento presencial e suporte corporativo</div>
          </div>

        </div>

      </div>
    </section>
  );
}
