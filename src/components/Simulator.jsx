import React, { useState, useId } from 'react';
import { Calculator, Sparkles, ArrowRight, ShieldCheck, Banknote, Car, AlertTriangle, Building2, Check, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';

export function Simulator({ onCompleteSimulation }) {
  const [vehicleType, setVehicleType] = useState('Carro');
  const [vehicleModel, setVehicleModel] = useState('');
  const [bank, setBank] = useState('BV Financeira');
  const [installmentValue, setInstallmentValue] = useState(1650);
  const [installmentsRemaining, setInstallmentsRemaining] = useState(36);
  const [delayStatus, setDelayStatus] = useState('Em dia');
  const [selectedUnit, setSelectedUnit] = useState('Vitória - ES');

  // Calculation logic
  const totalResidual = installmentValue * installmentsRemaining;
  
  // Discount rate based on delay & parameters
  let discountRate = 0.68;
  if (delayStatus === 'Mais de 3 parcelas / Risco de Busca') {
    discountRate = 0.73;
  } else if (delayStatus === '1 a 3 parcelas em atraso') {
    discountRate = 0.70;
  } else {
    discountRate = 0.65;
  }

  const estimatedPayoff = Math.round(totalResidual * (1 - discountRate));
  const estimatedSavings = totalResidual - estimatedPayoff;
  const discountPercent = Math.round(discountRate * 100);

  const handleSimulate = (e) => {
    e.preventDefault();

    // Trigger celebratory confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10B981', '#34D399', '#F59E0B', '#3B82F6']
    });

    if (onCompleteSimulation) {
      onCompleteSimulation({
        vehicleType,
        vehicleModel: vehicleModel || `${vehicleType} Financiado`,
        bank,
        installmentValue,
        installmentsRemaining,
        delayStatus,
        cityUnit: selectedUnit,
        contractResidualTotal: totalResidual,
        estimatedPayoff,
        estimatedSavings,
        discountPercentage: discountPercent
      });
    }
  };

  return (
    <section id="simulador" style={{ padding: '80px 0', position: 'relative' }}>
      <div className="container">
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 50px' }}>
          <span className="badge badge-gold" style={{ marginBottom: '14px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Calculator size={15} /> Perícia Prévia & Estimativa Revisional
          </span>
          <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', marginBottom: '16px', color: '#FFFFFF' }}>
            Simule o <span className="text-gradient-gold">Recálculo de Juros Abusivos</span>
          </h2>
          <p style={{ fontSize: '1.05rem', color: '#94A3B8' }}>
            Descubra em segundos a estimativa do valor incontroverso expurgando os juros abusivos apurados em uma Ação Revisional legítima na Justiça.
          </p>
        </div>

        {/* Main Simulator Card Layout */}
        <div className="glass-card" style={{
          padding: 'clamp(24px, 4vw, 44px)',
          border: '1px solid rgba(16, 185, 129, 0.25)',
          boxShadow: '0 20px 50px -10px rgba(0,0,0,0.7), 0 0 30px -5px rgba(16, 185, 129, 0.15)'
        }}>
          <div className="grid-2" style={{ alignItems: 'center', gap: '40px' }}>
            
            {/* Form Inputs (Left Column) */}
            <div>
              <form onSubmit={handleSimulate}>
                
                {/* Vehicle Type selector */}
                <div className="form-group">
                  <label className="form-label">
                    <Car size={16} color="#34D399" /> Tipo de Veículo
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                    {['Carro', 'Moto', 'Caminhão'].map((type) => (
                      <button
                        type="button"
                        key={type}
                        onClick={() => setVehicleType(type)}
                        style={{
                          padding: '10px',
                          borderRadius: '10px',
                          background: vehicleType === type ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                          border: `1px solid ${vehicleType === type ? '#10B981' : 'rgba(255, 255, 255, 0.1)'}`,
                          color: vehicleType === type ? '#34D399' : '#94A3B8',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bank Selection */}
                <div className="form-group">
                  <label className="form-label">
                    <Banknote size={16} color="#34D399" /> Banco ou Financeira Credora
                  </label>
                  <select 
                    className="form-select" 
                    value={bank} 
                    onChange={(e) => setBank(e.target.value)}
                  >
                    <option value="BV Financeira">BV Financeira (Banco Votorantim)</option>
                    <option value="Santander Financiamentos">Santander Financiamentos (Aymoré)</option>
                    <option value="Bradesco Financiamentos">Bradesco Financiamentos</option>
                    <option value="Itaú / Itaucard">Itaú / Itaucard Financiamentos</option>
                    <option value="Banco Pan">Banco Pan</option>
                    <option value="Banco Safra">Banco Safra</option>
                    <option value="Omni Financeira">Omni Financeira</option>
                    <option value="Banco do Brasil">Banco do Brasil</option>
                    <option value="Caixa Econômica">Caixa Econômica Federal</option>
                    <option value="Outro Banco">Outra Instituição Financeira</option>
                  </select>
                </div>

                {/* Vehicle Model */}
                <div className="form-group">
                  <label className="form-label">
                    Modelo e Ano do Veículo (opcional)
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Ex: Corolla 2021, Onix 2022, Compass..."
                    value={vehicleModel}
                    onChange={(e) => setVehicleModel(e.target.value)}
                  />
                </div>

                {/* Installment Value Slider */}
                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label className="form-label">Valor da Parcela Mensal:</label>
                    <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#34D399' }}>
                      R$ {Number(installmentValue).toLocaleString('pt-BR')}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="500"
                    max="6000"
                    step="50"
                    value={installmentValue}
                    onChange={(e) => setInstallmentValue(Number(e.target.value))}
                    className="range-slider"
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748B' }}>
                    <span>R$ 500</span>
                    <span>R$ 3.000</span>
                    <span>R$ 6.000+</span>
                  </div>
                </div>

                {/* Remaining Installments Slider */}
                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label className="form-label">Parcelas Restantes:</label>
                    <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#60A5FA' }}>
                      {installmentsRemaining} parcelas
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="60"
                    step="1"
                    value={installmentsRemaining}
                    onChange={(e) => setInstallmentsRemaining(Number(e.target.value))}
                    className="range-slider"
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748B' }}>
                    <span>10 meses</span>
                    <span>36 meses</span>
                    <span>60 meses</span>
                  </div>
                </div>

                {/* Delay status */}
                <div className="form-group">
                  <label className="form-label">
                    <Clock size={16} color="#34D399" /> Situação Atual do Contrato
                  </label>
                  <select
                    className="form-select"
                    value={delayStatus}
                    onChange={(e) => setDelayStatus(e.target.value)}
                  >
                    <option value="Em dia">Parcelas rigorosamente em dia</option>
                    <option value="1 a 3 parcelas em atraso">1 a 3 parcelas em atraso</option>
                    <option value="Mais de 3 parcelas / Risco de Busca">Mais de 3 parcelas / Risco de Busca e Apreensão</option>
                  </select>
                </div>

                {/* Headquarters Preference */}
                <div className="form-group">
                  <label className="form-label">
                    <Building2 size={16} color="#34D399" /> Unidade de Atendimento Mais Próxima
                  </label>
                  <select
                    className="form-select"
                    value={selectedUnit}
                    onChange={(e) => setSelectedUnit(e.target.value)}
                  >
                    <option value="Vitória - ES">Sede Vitória - ES (Enseada do Suá)</option>
                    <option value="Florianópolis - SC">Sede Florianópolis - SC (Centro)</option>
                    <option value="Atendimento Digital">Atendimento 100% Digital (Todo o Brasil)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%', marginTop: '12px' }}
                >
                  <Sparkles size={20} />
                  <span>Obter Proposta Oficial com Desconto</span>
                </button>

              </form>
            </div>

            {/* Simulation Result Card (Right Column) */}
            <div>
              <div style={{
                background: 'linear-gradient(145deg, rgba(16, 24, 40, 0.95), rgba(8, 14, 26, 0.95))',
                borderRadius: '20px',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                padding: 'clamp(24px, 3.5vw, 36px)',
                position: 'relative',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)'
              }}>
                
                {/* Discount Badge */}
                <div style={{
                  position: 'absolute',
                  top: '-15px',
                  right: '25px',
                  background: 'linear-gradient(135deg, #10B981, #059669)',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '0.88rem',
                  padding: '6px 16px',
                  borderRadius: '20px',
                  boxShadow: '0 6px 18px rgba(16, 185, 129, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <Sparkles size={16} /> ~{discountPercent}% DE DESCONTO
                </div>

                <div style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94A3B8', marginBottom: '8px' }}>
                  Estimativa de Quitação Negociada
                </div>

                <div style={{ fontSize: '1.05rem', color: '#CBD5E1', marginBottom: '24px' }}>
                  Instituição: <strong style={{ color: '#FFFFFF' }}>{bank}</strong> &bull; {installmentsRemaining}x parcelas
                </div>

                {/* Total Contracted */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '14px 18px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  borderRadius: '12px',
                  marginBottom: '12px'
                }}>
                  <span style={{ color: '#94A3B8', fontSize: '0.92rem' }}>Saldo Devedor Contratual:</span>
                  <span style={{ fontSize: '1.15rem', color: '#94A3B8', textDecoration: 'line-through' }}>
                    R$ {totalResidual.toLocaleString('pt-BR')}
                  </span>
                </div>

                {/* Estimated Payoff Target */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px 18px',
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: '14px',
                  marginBottom: '14px'
                }}>
                  <div>
                    <div style={{ fontSize: '0.82rem', color: '#34D399', fontWeight: 600 }}>VALOR ESTIMADO PARA QUITAR:</div>
                    <div style={{ fontSize: '0.76rem', color: '#94A3B8' }}>Liquidação à vista negociada</div>
                  </div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#34D399' }}>
                    R$ {estimatedPayoff.toLocaleString('pt-BR')}
                  </div>
                </div>

                {/* Estimated Total Savings Highlight */}
                <div style={{
                  padding: '20px',
                  background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12), rgba(245, 158, 11, 0.04))',
                  border: '1px solid rgba(245, 158, 11, 0.35)',
                  borderRadius: '16px',
                  marginBottom: '24px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '0.85rem', color: '#FBBF24', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Sua Economia Estimada no Bolso:
                  </div>
                  <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#FBBF24', margin: '4px 0' }}>
                    R$ {estimatedSavings.toLocaleString('pt-BR')}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#CBD5E1' }}>
                    Dinheiro que você deixa de pagar em juros bancários futuros!
                  </div>
                </div>

                {/* Trust Points */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.84rem', color: '#94A3B8' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Check size={16} color="#FBBF24" /> Perícia técnica fundamentada no CDC e súmulas do STJ
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Check size={16} color="#FBBF24" /> Transparência e defesa ativa contra risco de busca e apreensão
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Check size={16} color="#FBBF24" /> Atendimento presencial nas sedes de <strong>{selectedUnit}</strong>
                  </div>
                </div>

                {/* Direct Action */}
                <button
                  type="button"
                  onClick={handleSimulate}
                  className="btn btn-gold"
                  style={{ width: '100%', marginTop: '22px' }}
                >
                  <span>Receber Estudo Pericial do Meu Contrato</span>
                  <ArrowRight size={18} />
                </button>

              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
