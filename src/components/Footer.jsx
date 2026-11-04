import React from 'react';
import { 
  ShieldCheck, MapPin, Phone, MessageSquare, Lock, User, 
  Clock, Building2, Calculator, ArrowRight, Award, CheckCircle2, 
  ExternalLink, Sparkles, Mail
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
        
        {/* Top Pre-Footer Callout Box - Centered */}
        <div 
          className="glass-card"
          style={{
            padding: '38px 30px',
            marginBottom: '65px',
            background: 'radial-gradient(ellipse at top, rgba(20, 28, 44, 0.95) 0%, rgba(10, 14, 22, 0.95) 100%)',
            border: '1.5px solid rgba(197, 155, 39, 0.35)',
            borderRadius: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            gap: '22px',
            boxShadow: '0 20px 45px -10px rgba(0, 0, 0, 0.9), 0 0 35px rgba(197, 155, 39, 0.15)'
          }}
        >
          <div style={{ maxWidth: '780px' }}>
            <span className="badge badge-gold" style={{ marginBottom: '14px', display: 'inline-flex' }}>
              <Sparkles size={14} /> Assessoria Jurídica & Perícia Contábil
            </span>
            <h3 style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2.1rem)', color: '#FFFFFF', fontWeight: 800, marginBottom: '12px' }}>
              Análise de Juros Abusivos & <span className="text-gradient-gold">Ação Revisional Legítima</span>
            </h3>
            <p style={{ color: '#94A3B8', fontSize: '0.96rem', margin: 0, lineHeight: 1.65 }}>
              Visite nossas sedes em <strong>Vitória (ES)</strong> ou <strong>Florianópolis (SC)</strong>, ou solicite sua perícia contábil para identificar abusividades e planejar a proteção do seu veículo na Justiça.
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <button
              onClick={() => {
                setActiveView('site');
                if (onOpenSimulator) onOpenSimulator();
                else scrollTo('simulador');
              }}
              className="btn btn-gold"
              style={{ padding: '14px 28px' }}
            >
              <Calculator size={17} />
              <span>Simular Ação Revisional</span>
            </button>

            <a
              href="https://api.whatsapp.com/send?phone=5548920049681&text=Ol%C3%A1!%20Gostaria%20de%20consultoria%20jur%C3%ADdica%20com%20a%20Dom%20RockFeller%20sobre%20juros%20abusivos%20e%20a%C3%A7%C3%A3o%20revisional."
              target="_blank"
              rel="noreferrer"
              className="btn btn-secondary"
              style={{ padding: '14px 24px', color: '#34D399', borderColor: 'rgba(16, 185, 129, 0.35)' }}
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
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15, marginBottom: '18px' }}>
              <span style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.14em', color: '#94A3B8', textTransform: 'uppercase' }}>
                Assessoria &amp; Perícia
              </span>
              <span style={{ fontSize: '1.45rem', fontWeight: 900, letterSpacing: '-0.025em', color: '#FFFFFF' }}>
                DOM <span style={{ color: '#D4AF37' }}>ROCKFELLER</span>
              </span>
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
                href="tel:4891502530" 
                style={{ color: '#F8FAFC', display: 'inline-flex', alignItems: 'center', gap: '7px', fontWeight: 600 }}
              >
                <Phone size={14} color="#60A5FA" /> Telefone: (48) 9150-2530
              </a>
              <a 
                href="https://api.whatsapp.com/send?phone=5548920049681&text=Ol%C3%A1!%20Gostaria%20de%20atendimento%20pela%20sede%20de%20Florian%C3%B3polis%20da%20Dom%20RockFeller." 
                target="_blank" 
                rel="noreferrer" 
                style={{ color: '#34D399', display: 'inline-flex', alignItems: 'center', gap: '7px', fontWeight: 700 }}
              >
                <MessageSquare size={14} color="#34D399" /> WhatsApp: +55 48 92004-9681
              </a>
              <a 
                href="mailto:contatorockfellersolucoes@gmail.com"
                style={{ color: '#FDE68A', display: 'inline-flex', alignItems: 'center', gap: '7px', fontWeight: 600, wordBreak: 'break-all' }}
              >
                <Mail size={14} color="#FBBF24" /> contatorockfellersolucoes@gmail.com
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
                <MessageSquare size={14} color="#34D399" /> WhatsApp: +55 48 92004-9681
              </a>
              <a 
                href="mailto:contatorockfellersolucoes@gmail.com"
                style={{ color: '#FDE68A', display: 'inline-flex', alignItems: 'center', gap: '7px', fontWeight: 600, wordBreak: 'break-all' }}
              >
                <Mail size={14} color="#FBBF24" /> contatorockfellersolucoes@gmail.com
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

        {/* Bottom Copyright, Unit Credits & Compact Security Badges in the right corner */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '18px',
          paddingTop: '26px',
          borderTop: '1px solid rgba(245, 158, 11, 0.15)',
          fontSize: '0.82rem',
          color: '#64748B'
        }}>
          {/* Left Side: Corporate Copyright & Unit Addresses */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ color: '#94A3B8', fontSize: '0.82rem', lineHeight: 1.5 }}>
              &copy; 2026 <strong>Rockfeller Solucoes Ltda</strong> &bull; CNPJ: 55.989.699/0001-56 &bull; Sede: Rua Gerônimo Coelho, 280, Sala 1103, Centro, Florianópolis/SC.
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.80rem' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#CBD5E1' }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#FBBF24', boxShadow: '0 0 6px #FBBF24' }} />
                Florianópolis - SC (Sede Matriz)
              </span>
              <span style={{ color: 'rgba(245, 158, 11, 0.4)' }}>|</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#CBD5E1' }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#F59E0B', boxShadow: '0 0 6px #F59E0B' }} />
                Vitória - ES (Em Breve)
              </span>
            </div>
          </div>

          {/* Right Corner (Cantinho Direito): Compact Security Certificate Icons & Symbols */}
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px', 
              flexWrap: 'wrap',
              marginLeft: 'auto'
            }}
            aria-label="Certificados de Segurança do Site"
          >
            {/* SSL 256-Bit */}
            <div 
              title="Certificado SSL 256-Bit TLS 1.3 Ativo - Criptografia Bancária de Ponta a Ponta"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '8px',
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.28)',
                color: '#10B981',
                fontSize: '0.74rem',
                fontWeight: 700,
                letterSpacing: '0.02em',
                transition: 'all 0.2s ease',
                cursor: 'default',
                userSelect: 'none'
              }}
            >
              <Lock size={13} color="#10B981" />
              <span>SSL 256-Bit</span>
            </div>

            {/* Google Safe Browsing */}
            <div 
              title="Google Safe Browsing Verificado - Navegação 100% Segura contra Malwares e Phishing"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '8px',
                background: 'rgba(59, 130, 246, 0.08)',
                border: '1px solid rgba(59, 130, 246, 0.28)',
                color: '#60A5FA',
                fontSize: '0.74rem',
                fontWeight: 700,
                letterSpacing: '0.02em',
                transition: 'all 0.2s ease',
                cursor: 'default',
                userSelect: 'none'
              }}
            >
              <ShieldCheck size={14} color="#60A5FA" />
              <span>Google Seguro</span>
            </div>

            {/* LGPD Compliant */}
            <div 
              title="Proteção de Dados & Sigilo Bancário Conforme LGPD (Lei 13.709/18)"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '8px',
                background: 'rgba(245, 158, 11, 0.08)',
                border: '1px solid rgba(245, 158, 11, 0.28)',
                color: '#FBBF24',
                fontSize: '0.74rem',
                fontWeight: 700,
                letterSpacing: '0.02em',
                transition: 'all 0.2s ease',
                cursor: 'default',
                userSelect: 'none'
              }}
            >
              <Award size={13} color="#FBBF24" />
              <span>LGPD</span>
            </div>

            {/* CNPJ Verificado */}
            <div 
              title="Receita Federal do Brasil - CNPJ 55.989.699/0001-56 Regular e Ativo"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.16)',
                color: '#E2E8F0',
                fontSize: '0.74rem',
                fontWeight: 700,
                letterSpacing: '0.02em',
                transition: 'all 0.2s ease',
                cursor: 'default',
                userSelect: 'none'
              }}
            >
              <CheckCircle2 size={13} color="#10B981" />
              <span>CNPJ Regular</span>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
