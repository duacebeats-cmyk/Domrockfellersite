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
    <section id="como-funciona" style={{ padding: '80px 0', background: 'rgba(11, 17, 32, 0.6)' }}>
      <div className="container">
        
        <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 60px' }}>
          <span className="badge badge-gold" style={{ marginBottom: '14px' }}>
            <Scale size={15} /> Metodologia Jurídica e Pericial
          </span>
          <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', marginBottom: '16px', color: '#FFFFFF' }}>
            Como Funciona a <span className="text-gradient-gold">Ação Revisional na Prática</span>
          </h2>
          <p style={{ fontSize: '1.05rem', color: '#94A3B8' }}>
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
                  padding: '32px 24px', 
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <div style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '14px',
                      background: 'rgba(245, 158, 11, 0.12)',
                      border: '1px solid rgba(245, 158, 11, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FBBF24'
                    }}>
                      <Icon size={26} />
                    </div>
                    <span style={{ fontSize: '2rem', fontWeight: 800, color: 'rgba(255, 255, 255, 0.12)', fontFamily: 'monospace' }}>
                      {step.num}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.18rem', marginBottom: '12px', color: '#F8FAFC' }}>
                    {step.title}
                  </h3>

                  <p style={{ fontSize: '0.88rem', color: '#94A3B8', lineHeight: 1.6, marginBottom: '20px' }}>
                    {step.desc}
                  </p>
                </div>

                <div>
                  <span style={{
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: '#FDE68A',
                    background: 'rgba(245, 158, 11, 0.1)',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    border: '1px solid rgba(245, 158, 11, 0.25)'
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
          marginTop: '40px',
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(245, 158, 11, 0.08))',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          borderRadius: '16px',
          padding: '24px 30px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: 'rgba(245, 158, 11, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FBBF24',
              flexShrink: 0
            }}>
              <CheckCircle size={24} />
            </div>
            <div>
              <div style={{ color: '#F8FAFC', fontWeight: 700, fontSize: '1.05rem' }}>
                Segurança Jurídica & Pagamento Direto no Banco ou Juízo
              </div>
              <div style={{ color: '#94A3B8', fontSize: '0.85rem' }}>
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
            style={{ whiteSpace: 'nowrap' }}
          >
            <span>Iniciar Estudo Pericial</span>
            <ArrowRight size={16} />
          </button>
        </div>

      </div>
    </section>
  );
}
