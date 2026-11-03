import React from 'react';
import { Star, CheckCircle, ShieldCheck, Quote, ArrowDownRight } from 'lucide-react';

export function Testimonials() {
  const cases = [
    {
      name: 'Carlos Eduardo Mendes',
      city: 'Vitória - ES',
      vehicle: 'Jeep Compass Longitude 2021',
      bank: 'Santander Financiamentos',
      residual: 'R$ 88.200',
      settled: 'R$ 27.340',
      savings: 'R$ 60.860',
      percent: '69%',
      quote: 'Fui atendido presencialmente no Centro Empresarial em Vitória. Estava com 2 parcelas em atraso e notificação bancária. A equipe me orientou com clareza sobre os riscos de busca e apreensão e ajuizou ação revisional com depósito incontroverso. O Santander aceitou acordo e liquidamos a dívida com quase 70% de desconto.',
      date: 'Acordo Homologado em Setembro/2026'
    },
    {
      name: 'Mariana Duarte Becker',
      city: 'Florianópolis - SC',
      vehicle: 'Toyota Corolla XEi 2022',
      bank: 'BV Financeira',
      residual: 'R$ 69.760',
      settled: 'R$ 22.320',
      savings: 'R$ 47.440',
      percent: '68%',
      quote: 'Minhas parcelas estavam em dia, mas o laudo pericial contábil da Dom RockFeller comprovou abusividade nas taxas de juros. Visitei a sede na Rua Gerônimo Coelho no Centro de Floripa. Com a ação revisional legítima, a instituição propôs acordo de quitação antecipada. Gravame baixado no DETRAN-SC!',
      date: 'Acordo Homologado em Outubro/2026'
    },
    {
      name: 'Fabiano Albuquerque',
      city: 'Serra / Vitória - ES',
      vehicle: 'Chevrolet S10 High Country 2020',
      bank: 'Bradesco Financiamentos',
      residual: 'R$ 114.000',
      settled: 'R$ 36.480',
      savings: 'R$ 77.520',
      percent: '68%',
      quote: 'Estava ciente do risco de busca e apreensão do Bradesco. A assessoria jurídica me passou extrema segurança e transparência processual, defendendo a causa com base nas súmulas do STJ. Economizei mais de R$ 77 mil através do acordo judicial. Atendimento exemplar.',
      date: 'Acordo Homologado em Agosto/2026'
    }
  ];

  return (
    <section id="casos" style={{ padding: '80px 0', background: '#F8FAFC' }}>
      <div className="container">
        
        <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 50px' }}>
          <span className="badge badge-gold" style={{ marginBottom: '14px' }}>
            <Star size={15} /> Casos Reais em Vitória e Florianópolis
          </span>
          <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', marginBottom: '16px', color: '#0F172A' }}>
            Resultados de <span className="text-gradient-gold">Ações Revisionais e Acordos</span>
          </h2>
          <p style={{ fontSize: '1.05rem', color: '#475569' }}>
            Processos legítimos com perícia contábil de juros abusivos, gestão transparente de riscos e homologação na Justiça.
          </p>
        </div>

        {/* Testimonials Cards Grid */}
        <div className="grid-3" style={{ gap: '24px' }}>
          {cases.map((item, idx) => (
            <div 
              key={idx} 
              className="glass-card" 
              style={{ 
                padding: '30px', 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'space-between',
                position: 'relative',
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
                boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.05)'
              }}
            >
              <div>
                {/* Top header - Centered */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', gap: '3px', justifyContent: 'center' }}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} fill="#C59B27" color="#C59B27" />
                    ))}
                  </div>
                  <span style={{ fontSize: '0.78rem', color: '#64748B', textAlign: 'center' }}>{item.date}</span>
                </div>

                {/* Savings Pill Box */}
                <div style={{
                  background: 'rgba(5, 150, 105, 0.07)',
                  border: '1px solid rgba(5, 150, 105, 0.25)',
                  borderRadius: '12px',
                  padding: '12px 14px',
                  marginBottom: '18px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: '#64748B' }}>
                    <span>Dívida Original: <strike>{item.residual}</strike></span>
                    <span style={{ color: '#047857', fontWeight: 800 }}>{item.percent} OFF</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                    <span style={{ fontSize: '0.82rem', color: '#0A2540' }}>Quitado por: <strong>{item.settled}</strong></span>
                    <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#047857' }}>Economizou {item.savings}</span>
                  </div>
                </div>

                {/* Quote - Centered */}
                <p style={{ fontSize: '0.9rem', color: '#334E68', fontStyle: 'italic', lineHeight: 1.62, marginBottom: '20px', textAlign: 'center' }}>
                  "{item.quote}"
                </p>

              </div>

              {/* Author Footer - Centered */}
              <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '8px' }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #0A2540, #1B4B79)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#C59B27',
                  fontWeight: 800,
                  fontSize: '1rem',
                  border: '1.5px solid rgba(197, 155, 39, 0.4)'
                }}>
                  {item.name.charAt(0)}
                </div>
                <div>
                  <div style={{ fontWeight: 800, color: '#0A2540', fontSize: '0.95rem' }}>{item.name}</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748B' }}>{item.vehicle} &bull; {item.city}</div>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
