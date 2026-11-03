import React from 'react';
import { Search, Scale, FileText, CheckCircle, ShieldAlert, ArrowRight } from 'lucide-react';

export function HowItWorks({ onOpenSimulator }) {
  const steps = [
    {
      num: '01',
      icon: Search,
      title: 'Perícia Técnica de Juros Abusivos',
      desc: 'Nossa equipe contábil e jurídica audita seu contrato de financiamento, apurando discrepâncias com a taxa média do BACEN, anatocismo ilegal (juros sobre juros) e tarifas indevidas embutidas.',
      tag: 'Laudo Pericial Contábil'
    },
    {
      num: '02',
      icon: Scale,
      title: 'Ação Revisional Legítima na Justiça',
      desc: 'Com o respaldo pericial, ingressamos com a Ação Revisional perante o Poder Judiciário, fundamentada no Código de Defesa do Consumidor e súmulas do STJ para expurgar as cláusulas abusivas.',
      tag: 'Ajuizamento Judicial'
    },
    {
      num: '03',
      icon: ShieldAlert,
      title: 'Ciência e Defesa de Busca e Apreensão',
      desc: 'Mantemos você 100% ciente e orientado sobre os riscos reais de busca e apreensão. Atuamos preventivamente com defesas processuais, liminares e depósito em juízo dos valores incontroversos.',
      tag: 'Transparência de Riscos'
    },
    {
      num: '04',
      icon: CheckCircle,
      title: 'Homologação Judicial e Baixa do Gravame',
      desc: 'Pressionada pela robustez da ação judicial, a instituição bancária formula acordo para quitação com deságio expressivo. O acordo é homologado em juízo e o gravame é baixado no DETRAN.',
      tag: 'Quitação com Validade Jurídica'
    }
  ];

  return (
    <section id="como-funciona" style={{ padding: '80px 0', background: '#F1F5F9' }}>
      <div className="container">
        
        <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 60px' }}>
          <span className="badge badge-gold" style={{ marginBottom: '14px' }}>
            <Scale size={15} /> Metodologia Jurídica e Pericial
          </span>
          <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', marginBottom: '16px', color: '#0F172A' }}>
            Como Funciona a <span className="text-gradient-gold">Ação Revisional na Prática</span>
          </h2>
          <p style={{ fontSize: '1.05rem', color: '#475569' }}>
            Um método legítimo, transparente e ético que combate os juros extorsivos na Justiça mantendo você plenamente assessorado e ciente de cada risco processual.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid-4" style={{ position: 'relative' }}>
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div 
                key={idx} 
                className="glass-card" 
                style={{ 
                  padding: '36px 24px', 
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  textAlign: 'center',
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 4px 18px -2px rgba(10, 37, 64, 0.05)'
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '16px',
                    background: 'rgba(197, 155, 39, 0.12)',
                    border: '1.5px solid rgba(197, 155, 39, 0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#C59B27',
                    marginBottom: '12px'
                  }}>
                    <Icon size={28} />
                  </div>

                  <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#C59B27', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '10px' }}>
                    Etapa {step.num}
                  </span>

                  <h3 style={{ fontSize: '1.15rem', marginBottom: '12px', color: '#0A2540', fontWeight: 800, textAlign: 'center' }}>
                    {step.title}
                  </h3>

                  <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.65, marginBottom: '22px', textAlign: 'center' }}>
                    {step.desc}
                  </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                  <span style={{
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: '#876214',
                    background: 'rgba(197, 155, 39, 0.1)',
                    padding: '5px 14px',
                    borderRadius: '6px',
                    border: '1px solid rgba(197, 155, 39, 0.25)',
                    textAlign: 'center'
                  }}>
                    {step.tag}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Security Callout */}
        <div style={{
          marginTop: '45px',
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          boxShadow: '0 6px 20px -2px rgba(10, 37, 64, 0.06)',
          borderRadius: '20px',
          padding: '28px 34px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          textAlign: 'center',
          gap: '18px'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#059669'
            }}>
              <CheckCircle size={26} />
            </div>
            <div>
              <div style={{ color: '#0A2540', fontWeight: 800, fontSize: '1.1rem', marginBottom: '4px' }}>
                Segurança Jurídica &amp; Pagamento Direto no Banco ou Juízo
              </div>
              <div style={{ color: '#475569', fontSize: '0.92rem', maxWidth: '680px', margin: '0 auto' }}>
                Transparência absoluta: os depósitos judiciais ou acordos homologados são feitos em juízo ou diretamente na instituição credora.
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              const el = document.getElementById('simulador');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="btn btn-primary"
            style={{ minWidth: '240px' }}
          >
            <span>Iniciar Estudo Pericial</span>
            <ArrowRight size={16} />
          </button>
        </div>

      </div>
    </section>
  );
}
