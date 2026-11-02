import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';

export function Faq() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: 'O que é uma Ação Revisional e quando ela é cabível?',
      a: 'A ação revisional é um processo judicial legítimo movido perante o Poder Judiciário para expurgar irregularidades contratuais: juros remuneratórios acima da taxa média de mercado do BACEN, anatocismo (cobrança ilegal de juros sobre juros) e tarifas indevidas embutidas no financiamento (como TAC, TEC e seguros ilícitos). Ela é cabível sempre que houver desequilíbrio e abusividade praticada pela instituição bancária.'
    },
    {
      q: 'Quais são os riscos reais de Busca e Apreensão e como sou orientado?',
      a: 'Nossa premissa fundamental é a transparência: mantemos você 100% ciente de todos os riscos. Pela lei (Decreto-Lei 911/69), havendo parcelas em atraso, o banco credor tem a faculdade de ajuizar ação de busca e apreensão. Por isso, nossa assessoria jurídica atua com defesas técnicas ágeis, requerimento de depósito judicial dos valores incontroversos e medidas preventivas para resguardar o patrimônio e impulsionar uma negociação justa.'
    },
    {
      q: 'Qual é a diferença da Dom RockFeller para promessas fáceis da internet?',
      a: 'Não vendemos milagres. Somos uma consultoria financeira e assessoria jurídica estruturada, com escritórios físicos de portas abertas em Vitória (ES) e Florianópolis (SC). Todo trabalho é fundamentado em laudos contábeis periciais, teses consolidadas no Superior Tribunal de Justiça (STJ) e acompanhamento processual transparente onde o cliente tem ciência de cada andamento.'
    },
    {
      q: 'Como é alcançada a quitação com deságio expressivo na Justiça?',
      a: 'Ao responder à ação revisional com laudo pericial demonstrando o excesso de execução e a cobrança indevida, a mesa jurídica do banco avalia o custo do litígio e o risco de sucumbência. Diante disso, a instituição formula propostas de acordo para liquidação à vista com descontos de 50% a 75% sobre as parcelas futuras, devidamente homologadas pelo juiz com baixa de gravame.'
    },
    {
      q: 'Eu preciso entregar o veículo para a Dom RockFeller durante o processo?',
      a: 'NÃO! O veículo permanece sob sua posse e uso diário. Nossa atuação é exclusivamente técnica, pericial e de assessoria jurídica e negocial perante o Poder Judiciário e a instituição financeira.'
    },
    {
      q: 'Para quem eu pago os valores do acordo ou depósito incontroverso?',
      a: 'Todo e qualquer depósito é efetuado em conta judicial vinculada ao seu processo perante a Justiça, ou diretamente ao banco credor original através de boleto oficial emitido no seu CPF. A Dom RockFeller jamais recebe o montante destinado à liquidação da sua dívida.'
    }
  ];

  return (
    <section id="faq" style={{ padding: '80px 0', position: 'relative' }}>
      <div className="container">
        
        <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 50px' }}>
          <span className="badge badge-emerald" style={{ marginBottom: '14px' }}>
            <HelpCircle size={15} /> Esclarecimento de Dúvidas
          </span>
          <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', marginBottom: '16px', color: '#FFFFFF' }}>
            Perguntas <span className="text-gradient-emerald">Frequentes</span>
          </h2>
          <p style={{ fontSize: '1.05rem', color: '#94A3B8' }}>
            Transparência e segurança jurídica em cada etapa do seu processo de quitação.
          </p>
        </div>

        {/* Accordion List */}
        <div style={{ maxWidth: '850px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="glass-card"
                style={{
                  borderRadius: '16px',
                  border: isOpen ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
                  overflow: 'hidden',
                  transition: 'all 0.25s ease'
                }}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                  style={{
                    width: '100%',
                    padding: '22px 26px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'transparent',
                    border: 'none',
                    color: '#FFFFFF',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '1.05rem',
                    fontWeight: 600,
                    gap: '16px'
                  }}
                >
                  <span>{faq.q}</span>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: isOpen ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isOpen ? '#34D399' : '#94A3B8',
                    flexShrink: 0
                  }}>
                    {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                </button>

                {isOpen && (
                  <div 
                    className="accordion-body"
                    style={{
                      padding: '0 26px 24px',
                      color: '#94A3B8',
                      fontSize: '0.95rem',
                      lineHeight: 1.7,
                      borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                      paddingTop: '16px'
                    }}
                  >
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
