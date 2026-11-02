import React from 'react';
import { 
  ShieldCheck, MapPin, Phone, MessageSquare, Lock, User, 
  Clock, Building2, Calculator, ArrowRight, Award, CheckCircle2, 
  ExternalLink, Sparkles 
} from 'lucide-react';

export function Footer({ setActiveView, onOpenSimulator, onOpenAuth, onOpenChat }) {
  const scrollTo = (id) => {
    setActiveView('site');
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer style={{
      background: 'linear-gradient(180deg, #070910 0%, #030508 100%)',
      borderTop: '1px solid rgba(245, 158, 11, 0.25)',
      position: 'relative',
      padding: '80px 0 35px',
      color: '#94A3B8',
      fontSize: '0.88rem',
      overflow: 'hidden'
    }}>
      {/* Ambient Gold Radial Spotlights */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '20%',
        width: '500px',
        height: '250px',
        background: 'radial-gradient(ellipse at top, rgba(245, 158, 11, 0.12) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        top: 0,
        right: '20%',
        width: '400px',
        height: '200px',
        background: 'radial-gradient(ellipse at top, rgba(212, 175, 55, 0.08) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        
        {/* Top Pre-Footer Callout Box */}
        <div 
          className="glass-card"
          style={{
            padding: '36px 40px',
            marginBottom: '65px',
            background: 'radial-gradient(ellipse at top, rgba(20, 28, 44, 0.95) 0%, rgba(10, 14, 22, 0.95) 100%)',
            border: '1.5px solid rgba(245, 158, 11, 0.35)',
            borderRadius: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '24px',
            boxShadow: '0 20px 45px -10px rgba(0, 0, 0, 0.9), 0 0 35px rgba(245, 158, 11, 0.15)'
          }}
        >
          <div style={{ maxWidth: '620px' }}>
            <span className="badge badge-gold" style={{ marginBottom: '12px' }}>
              <Sparkles size={14} /> Assessoria Jurídica & Perícia Contábil
            </span>
            <h3 style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.9rem)', color: '#FFFFFF', fontWeight: 800, marginBottom: '8px' }}>
              Análise de Juros Abusivos & <span className="text-gradient-gold">Ação Revisional Legítima</span>
            </h3>
            <p style={{ color: '#94A3B8', fontSize: '0.94rem', margin: 0, lineHeight: 1.6 }}>
              Visite nossas sedes em <strong>Vitória (ES)</strong> ou <strong>Florianópolis (SC)</strong>, ou solicite sua perícia contábil para identificar abusividades e planejar a proteção do seu veículo na Justiça.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={() => {
                setActiveView('site');
                if (onOpenSimulator) onOpenSimulator();
                else scrollTo('simulador');
              }}
              className="btn btn-gold"
              style={{ padding: '14px 26px' }}
            >
              <Calculator size={17} />
              <span>Simular Ação Revisional</span>
            </button>

            <a
              href="https://api.whatsapp.com/send?phone=5548920049681&text=Ol%C3%A1!%20Gostaria%20de%20consultoria%20jur%C3%ADdica%20com%20a%20Dom%20RockFeller%20sobre%20juros%20abusivos%20e%20a%C3%A7%C3%A3o%20revisional."
              target="_blank"
              rel="noreferrer"
              className="btn btn-secondary"
              style={{ padding: '14px 22px', color: '#34D399', borderColor: 'rgba(16, 185, 129, 0.35)' }}
            >
              <Phone size={16} color="#34D399" />
              <span>WhatsApp Oficial</span>
            </a>
          </div>
        </div>

        {/* 4 Main Footer Columns */}
        <div className="grid-4" style={{ gap: '30px', marginBottom: '55px' }}>
          
          {/* Column 1: Brand & Credibility */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                background: 'radial-gradient(circle, rgba(245, 158, 11, 0.25) 0%, rgba(10, 14, 22, 0.9) 70%)',
                border: '1.5px solid rgba(245, 158, 11, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 16px rgba(245, 158, 11, 0.3)',
                flexShrink: 0
              }}>
                <img 
                  src="/lion-icon.png" 
                  alt="Dom RockFeller" 
                  style={{ width: '36px', height: '36px', objectFit: 'contain' }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '1.35rem', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em', lineHeight: 1 }}>
                    ROCK<span style={{ color: '#FBBF24' }}>FELLER</span>
                  </span>
                  <span style={{ 
                    fontSize: '0.62rem', 
                    background: 'rgba(245, 158, 11, 0.15)', 
                    color: '#FDE68A', 
                    padding: '2px 7px', 
                    borderRadius: '4px', 
                    fontWeight: 800, 
                    border: '1px solid rgba(245, 158, 11, 0.4)',
                    letterSpacing: '0.08em'
                  }}>
                    SOLUÇÕES
                  </span>
                </div>
                <div style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 600, letterSpacing: '0.04em', marginTop: '2px' }}>
                  Dom RockFeller Assessoria Jurídica &amp; Financeira
                </div>
              </div>
            </div>

            <p style={{ lineHeight: 1.65, color: '#94A3B8', marginBottom: '22px', fontSize: '0.88rem' }}>
              Assessoria jurídica e consultoria financeira especializada em perícia contábil de juros abusivos e ajuizamento de ações revisionais legítimas na Justiça, com atendimento presencial e transparente.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '9px', fontSize: '0.8rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#34D399', fontWeight: 600 }}>
                <CheckCircle2 size={15} color="#34D399" /> <span>Sigilo Bancário &amp; Proteção LGPD</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#FDE68A', fontWeight: 600 }}>
                <Award size={15} color="#FBBF24" /> <span>Perícia Contábil Homologada</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#CBD5E1', fontWeight: 600 }}>
                <Lock size={15} color="#60A5FA" /> <span>Liquidação Direta no Banco Credor</span>
              </div>
            </div>
          </div>

          {/* Column 2: Sede Florianópolis - SC (Ativa) */}
          <div 
            className="glass-card" 
            style={{ 
              padding: '26px 20px', 
              borderRadius: '18px',
              border: '1px solid rgba(59, 130, 246, 0.35)',
              background: 'rgba(12, 16, 26, 0.75)'
            }}
          >
            <div style={{ fontWeight: 800, color: '#FFFFFF', fontSize: '1.02rem', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#60A5FA', display: 'inline-block', boxShadow: '0 0 10px #60A5FA' }} />
              <span>Sede Florianópolis - SC</span>
              <span style={{ fontSize: '0.68rem', color: '#60A5FA', border: '1px solid #3B82F6', padding: '2px 6px', borderRadius: '4px', textTransform: 'uppercase', fontWeight: 700 }}>Ativa</span>
            </div>

            <p style={{ lineHeight: 1.55, color: '#CBD5E1', marginBottom: '16px', fontSize: '0.85rem' }}>
              <strong style={{ color: '#FFFFFF' }}>Edifício Jerônimo Coelho</strong><br />
              Rua Gerônimo Coelho, 280 • Sala 1103<br />
              Centro, Florianópolis - SC<br />
              <span style={{ color: '#94A3B8' }}>CEP: 88010-030</span>
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '9px', marginBottom: '14px', fontSize: '0.85rem' }}>
              <a 
                href="tel:48920049681" 
                style={{ color: '#F8FAFC', display: 'inline-flex', alignItems: 'center', gap: '7px', fontWeight: 600 }}
              >
                <Phone size={14} color="#60A5FA" /> +55 48 92004-9681
              </a>
              <a 
                href="https://api.whatsapp.com/send?phone=5548920049681&text=Ol%C3%A1!%20Gostaria%20de%20atendimento%20pela%20sede%20de%20Florian%C3%B3polis%20da%20Dom%20RockFeller." 
                target="_blank" 
                rel="noreferrer" 
                style={{ color: '#34D399', display: 'inline-flex', alignItems: 'center', gap: '7px', fontWeight: 700 }}
              >
                <MessageSquare size={14} color="#34D399" /> WhatsApp: (48) 92004-9681
              </a>
              <a 
                href="mailto:contato@domrockfeller.tech"
                style={{ color: '#FDE68A', display: 'inline-flex', alignItems: 'center', gap: '7px', fontWeight: 600 }}
              >
                <Mail size={14} color="#FBBF24" /> contato@domrockfeller.tech
              </a>
            </div>

            <div style={{ fontSize: '0.78rem', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={13} /> Seg a Sex &bull; 08:30 às 18:00
            </div>
          </div>

          {/* Column 3: Sede Vitória - ES (Inauguração em breve) */}
          <div 
            className="glass-card" 
            style={{ 
              padding: '26px 20px', 
              borderRadius: '18px',
              border: '1px solid rgba(245, 158, 11, 0.28)',
              background: 'rgba(12, 16, 26, 0.75)'
            }}
          >
            <div style={{ fontWeight: 800, color: '#FFFFFF', fontSize: '1.02rem', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#F59E0B', display: 'inline-block', boxShadow: '0 0 10px #F59E0B' }} />
              <span>Sede Vitória - ES</span>
              <span style={{ fontSize: '0.68rem', color: '#FDE68A', border: '1px solid #F59E0B', padding: '2px 6px', borderRadius: '4px', textTransform: 'uppercase', fontWeight: 700 }}>Em Breve</span>
            </div>

            <p style={{ lineHeight: 1.55, color: '#CBD5E1', marginBottom: '16px', fontSize: '0.85rem' }}>
              <strong style={{ color: '#FDE68A' }}>Centro Empresarial Vitória</strong><br />
              Av. Américo Buaiz, 501 • Enseada do Suá<br />
              Vitória - ES • CEP: 29050-911<br />
              <span style={{ color: '#FBBF24', fontSize: '0.78rem', fontWeight: 600 }}>✦ Inauguração em breve</span>
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '9px', marginBottom: '14px', fontSize: '0.85rem' }}>
              <a 
                href="https://api.whatsapp.com/send?phone=5548920049681&text=Ol%C3%A1!%20Gostaria%20de%20atendimento%20online%20para%20o%20Esp%C3%ADrito%20Santo." 
                target="_blank" 
                rel="noreferrer" 
                style={{ color: '#34D399', display: 'inline-flex', alignItems: 'center', gap: '7px', fontWeight: 700 }}
              >
                <MessageSquare size={14} color="#34D399" /> Atendimento Online no ES
              </a>
              <a 
                href="mailto:contato@domrockfeller.tech"
                style={{ color: '#FDE68A', display: 'inline-flex', alignItems: 'center', gap: '7px', fontWeight: 600 }}
              >
                <Mail size={14} color="#FBBF24" /> contato@domrockfeller.tech
              </a>
            </div>

            <div style={{ fontSize: '0.78rem', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={13} /> Suporte Remoto &bull; 08:30 às 18:00
            </div>
          </div>

          {/* Column 4: Quick Navigation & Portal */}
          <div>
            <div style={{ fontWeight: 800, color: '#FFFFFF', fontSize: '1.02rem', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>Navegação & Acesso</span>
            </div>

            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '11px', padding: 0, margin: '0 0 22px' }}>
              <li>
                <a onClick={() => scrollTo('como-funciona')} className="nav-item-link" style={{ padding: '2px 0' }}>
                  Como Funciona a Quitação
                </a>
              </li>
              <li>
                <a onClick={() => scrollTo('simulador')} className="nav-item-link" style={{ padding: '2px 0' }}>
                  Simulador de Economia
                </a>
              </li>
              <li>
                <a onClick={() => scrollTo('sedes')} className="nav-item-link" style={{ padding: '2px 0' }}>
                  Escritórios Vitória & Floripa
                </a>
              </li>
              <li>
                <a onClick={() => scrollTo('casos')} className="nav-item-link" style={{ padding: '2px 0' }}>
                  Casos de Sucesso Reais
                </a>
              </li>
              <li>
                <a onClick={() => scrollTo('faq')} className="nav-item-link" style={{ padding: '2px 0' }}>
                  Perguntas Frequentes
                </a>
              </li>
            </ul>

            <button
              onClick={onOpenAuth}
              className="btn btn-sm btn-gold"
              style={{ width: '100%', padding: '10px 14px', fontSize: '0.84rem', fontWeight: 700 }}
            >
              <User size={15} />
              <span>Área do Cliente & Acesso</span>
            </button>
          </div>

        </div>

        {/* Legal Disclaimer Box */}
        <div style={{
          background: 'rgba(10, 14, 22, 0.75)',
          border: '1px solid rgba(245, 158, 11, 0.18)',
          borderRadius: '16px',
          padding: '20px 24px',
          marginBottom: '35px',
          fontSize: '0.8rem',
          lineHeight: 1.65,
          color: '#64748B'
        }}>
          <strong style={{ color: '#E2E8F0' }}>Aviso de Transparência, Ética e Segurança Jurídica:</strong> A <strong>Dom RockFeller</strong> atua como assessoria jurídica e consultoria financeira especializada em perícia contábil de juros abusivos e na propositura de ações revisionais legítimas perante a Justiça. Todos os clientes são orientados com absoluta clareza sobre os riscos de busca e apreensão decorrentes da mora contratual (Decreto-Lei 911/69), sendo adotadas medidas processuais técnicas preventivas, como o depósito em juízo dos valores incontroversos e pedidos de tutela provisória. Não somos instituição financeira e não concedemos empréstimos.
        </div>

        {/* Bottom Copyright & Unit Credits */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          paddingTop: '25px',
          borderTop: '1px solid rgba(245, 158, 11, 0.12)',
          fontSize: '0.82rem',
          color: '#64748B'
        }}>
          <div>
            &copy; 2026 <strong>Dom RockFeller Assessoria Jurídica & Pericial Ltda.</strong> CNPJ: 42.189.554/0001-82. Todos os direitos reservados.
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#F59E0B' }} />
              Vitória - ES
            </span>
            <span style={{ color: 'rgba(245, 158, 11, 0.3)' }}>|</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#FBBF24' }} />
              Florianópolis - SC
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
