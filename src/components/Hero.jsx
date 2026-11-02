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
      padding: '60px 0 70px',
      overflow: 'hidden'
    }}>
      {/* Creative Watermark with Golden Lion Emblem in Background */}
      <div style={{
        position: 'absolute',
        top: '40%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '650px',
        height: '650px',
        opacity: 0.04,
        pointerEvents: 'none',
        zIndex: 0,
        backgroundImage: 'url(/lion-icon.png)',
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        filter: 'blur(1px)'
      }} />

      {/* Decorative ambient radial gold spots */}
      <div style={{
        position: 'absolute',
        top: '-120px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '700px',
        height: '450px',
        background: 'radial-gradient(circle, rgba(245, 158, 11, 0.16) 0%, rgba(212, 175, 55, 0.08) 50%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '940px', margin: '0 auto', textAlign: 'center' }}>
          
          {/* Creative Logo Crest Header in Hero */}
          <div style={{ marginBottom: '22px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{
              position: 'relative',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px'
            }}>
              {/* Pulsing Gold Glow behind Lion */}
              <div style={{
                position: 'absolute',
                width: '140px',
                height: '140px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(245, 158, 11, 0.35) 0%, transparent 70%)',
                filter: 'blur(15px)',
                zIndex: 0
              }} className="animate-pulse-subtle" />

              <img 
                src="/lion-icon.png" 
                alt="RockFeller Soluções" 
                style={{
                  width: '105px',
                  height: '105px',
                  objectFit: 'contain',
                  position: 'relative',
                  zIndex: 1,
                  filter: 'drop-shadow(0 6px 20px rgba(245, 158, 11, 0.5))'
                }}
                className="animate-float"
              />
            </div>

            {/* Badges Row */}
            <div style={{ display: 'inline-flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px' }}>
              <span className="badge badge-gold">
                <ShieldCheck size={15} /> Assessoria Jurídica & Consultoria Financeira
              </span>
              <span className="badge badge-gold" style={{ background: 'rgba(255, 255, 255, 0.04)', borderColor: 'rgba(245, 158, 11, 0.3)' }}>
                <Sparkles size={14} color="#FBBF24" /> Ações Revisionais Legítimas na Justiça
              </span>
              <span className="badge badge-gold" style={{ background: 'rgba(245, 158, 11, 0.08)', borderColor: 'rgba(245, 158, 11, 0.35)' }}>
                Vitória (ES) & Florianópolis (SC)
              </span>
            </div>
          </div>

          {/* Main Headline */}
          <h1 style={{
            fontSize: 'clamp(2.3rem, 5vw, 3.8rem)',
            fontWeight: 900,
            lineHeight: 1.15,
            marginBottom: '22px',
            color: '#FFFFFF'
          }}>
            Análise Pericial de Juros Abusivos e <span className="text-gradient-gold">Ação Revisional na Justiça</span>
          </h1>

          {/* Subheading */}
          <p style={{
            fontSize: 'clamp(1.05rem, 2vw, 1.22rem)',
            color: '#CBD5E1',
            lineHeight: 1.65,
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
              style={{ minWidth: '250px' }}
            >
              <Sparkles size={20} />
              <span>Simular Perícia do Meu Contrato</span>
            </button>

            <button
              onClick={onOpenChat}
              className="btn btn-secondary btn-lg"
              style={{ minWidth: '230px', borderColor: 'rgba(245, 158, 11, 0.4)' }}
            >
              <MessageSquare size={18} color="#FBBF24" />
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
            color: '#CBD5E1',
            fontSize: '0.88rem',
            paddingBottom: '25px'
          }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={18} color="#FBBF24" /> Perícia Contábil Fundamentada no CDC
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={18} color="#FBBF24" /> Defesa Técnica contra Busca e Apreensão
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={18} color="#FBBF24" /> Escritórios Físicos em Vitória (ES) e Florianópolis (SC)
            </span>
          </div>

        </div>

        {/* Live Metrics Grid */}
        <div className="grid-4" style={{ marginTop: '20px' }}>
          
          <div className="glass-card" style={{ padding: '24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #FDE68A, #B45309)' }} />
            <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#FBBF24', marginBottom: '6px' }}>R$ 18.4M+</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#F8FAFC' }}>Economia Gerada</div>
            <div style={{ fontSize: '0.78rem', color: '#94A3B8', marginTop: '4px' }}>Dinheiro economizado por nossos clientes</div>
          </div>

          <div className="glass-card" style={{ padding: '24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #F59E0B, #D97706)' }} />
            <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '6px' }}>+3.800</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#F8FAFC' }}>Veículos Desalienados</div>
            <div style={{ fontSize: '0.78rem', color: '#94A3B8', marginTop: '4px' }}>Carros, motos e utilitários quitados</div>
          </div>

          <div className="glass-card" style={{ padding: '24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #FFE58F, #F59E0B)' }} />
            <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#FBBF24', marginBottom: '6px' }}>Até 75%</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#F8FAFC' }}>Redução Revisional</div>
            <div style={{ fontSize: '0.78rem', color: '#94A3B8', marginTop: '4px' }}>Economia em parcelas futuras e encargos abusivos</div>
          </div>

          <div className="glass-card" style={{ padding: '24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #F59E0B, #FFE58F)' }} />
            <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '6px' }}>2 Sedes</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#F8FAFC' }}>Vitória & Florianópolis</div>
            <div style={{ fontSize: '0.78rem', color: '#94A3B8', marginTop: '4px' }}>Salas corporativas para atendimento presencial</div>
          </div>

        </div>

      </div>
    </section>
  );
}
