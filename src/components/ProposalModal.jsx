import React, { useState } from 'react';
import { X, CheckCircle, ShieldCheck, Send, Sparkles, Building2, Phone, User, Mail, MessageSquare } from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../services/api';

export function ProposalModal({ isOpen, onClose, simulationData, onLeadCreated }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [cityUnit, setCityUnit] = useState(simulationData?.cityUnit || 'Vitória - ES');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [savedLead, setSavedLead] = useState(null);

  if (!isOpen) return null;

  const data = simulationData || {
    vehicleType: 'Carro',
    vehicleModel: 'Veículo Financiado',
    bank: 'BV Financeira',
    installmentValue: 1850,
    installmentsRemaining: 36,
    contractResidualTotal: 66600,
    estimatedPayoff: 21300,
    estimatedSavings: 45300,
    discountPercentage: 68,
    delayStatus: 'Em dia',
    cityUnit: 'Vitória - ES'
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !phone) return;

    setIsSubmitting(true);
    try {
      const newLead = await api.createLead({
        name,
        phone,
        email,
        cityUnit,
        vehicleType: data.vehicleType,
        vehicleModel: data.vehicleModel,
        bank: data.bank,
        installmentValue: data.installmentValue,
        installmentsRemaining: data.installmentsRemaining,
        delayStatus: data.delayStatus,
        contractResidualTotal: data.contractResidualTotal,
        estimatedPayoff: data.estimatedPayoff,
        estimatedSavings: data.estimatedSavings,
        discountPercentage: data.discountPercentage,
        status: 'Novo Lead'
      });

      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 }
      });

      setSavedLead(newLead);
      setSubmittedSuccess(true);
      if (onLeadCreated) onLeadCreated(newLead);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getWhatsAppNumber = () => {
    return cityUnit.includes('Florianópolis') ? '5548991256677' : '5527998723344';
  };

  const generateWhatsAppMessage = () => {
    const text = `Olá! Solicitei a análise na Dom RockFeller para ação revisional de juros abusivos e consultoria jurídica:
*Nome:* ${name}
*Veículo:* ${data.vehicleModel || data.vehicleType}
*Banco:* ${data.bank}
*Saldo Contratual:* R$ ${data.contractResidualTotal?.toLocaleString('pt-BR')}
*Economia Estimada:* R$ ${data.estimatedSavings?.toLocaleString('pt-BR')}
*Unidade:* ${cityUnit}

Gostaria de formalizar o estudo pericial gratuito e entender os passos da ação revisional legítima na Justiça e a prevenção de busca e apreensão.`;
    return encodeURIComponent(text);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '34px' }}>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="close-btn"
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255,255,255,0.06)',
            border: 'none',
            color: '#94A3B8',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <X size={20} />
        </button>

        {!submittedSuccess ? (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <span className="badge badge-emerald" style={{ marginBottom: '10px' }}>
                <Sparkles size={14} /> Perícia Financeira & Análise Jurídica
              </span>
              <h3 style={{ fontSize: '1.7rem', color: '#FFFFFF' }}>
                Formalize sua Análise de Juros Abusivos
              </h3>
              <p style={{ fontSize: '0.9rem', color: '#94A3B8', marginTop: '6px' }}>
                Nossa assessoria jurídica avaliará a viabilidade da ação revisional legítima e estratégias preventivas contra busca e apreensão.
              </p>
            </div>

            {/* Calculated summary pill */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(245, 158, 11, 0.08))',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '14px',
              padding: '16px 20px',
              marginBottom: '24px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.85rem', color: '#CBD5E1' }}>Banco: <strong>{data.bank}</strong></span>
                <span style={{ fontSize: '0.85rem', color: '#34D399', fontWeight: 700 }}>~{data.discountPercentage}% Desconto</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: '0.82rem', color: '#94A3B8' }}>
                  Saldo: <strike>R$ {data.contractResidualTotal?.toLocaleString('pt-BR')}</strike>
                </span>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FBBF24' }}>
                  Economia: R$ {data.estimatedSavings?.toLocaleString('pt-BR')}
                </span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label"><User size={15} color="#34D399" /> Seu Nome Completo</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="Ex: Carlos Eduardo de Oliveira"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="grid-2" style={{ gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label"><Phone size={15} color="#34D399" /> Celular / WhatsApp</label>
                  <input
                    type="tel"
                    required
                    className="form-input"
                    placeholder="(27) 99999-9999 ou (48)..."
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label"><Mail size={15} color="#34D399" /> E-mail (opcional)</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="seuemail@exemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label"><Building2 size={15} color="#34D399" /> Estado de Atendimento</label>
                <select
                  className="form-select"
                  value={cityUnit}
                  onChange={(e) => setCityUnit(e.target.value)}
                >
                  <option value="Santa Catarina - SC">Estado Santa Catarina - SC (Florianópolis - Matriz)</option>
                  <option value="Espírito Santo - ES">Estado Espírito Santo - ES (Vitória)</option>
                  <option value="Atendimento Digital">Atendimento Digital (Demais Estados)</option>
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#94A3B8', margin: '14px 0 20px' }}>
                <ShieldCheck size={16} color="#10B981" />
                <span>Seus dados são protegidos por sigilo bancário (LGPD). Sem cobrança inicial.</span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary btn-lg"
                style={{ width: '100%' }}
              >
                {isSubmitting ? 'Processando Perícia...' : (
                  <>
                    <Send size={18} />
                    <span>Solicitar Estudo Pericial e Análise Revisional</span>
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          /* Success Screen */
          <div style={{ textAlign: 'center', padding: '20px 10px' }}>
            <div style={{
              width: '70px',
              height: '70px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.2)',
              color: '#34D399',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px'
            }}>
              <CheckCircle size={44} />
            </div>

            <h3 style={{ fontSize: '1.8rem', color: '#FFFFFF', marginBottom: '10px' }}>
              Solicitação Pericial Registrada!
            </h3>
            
            <p style={{ color: '#0A2540', fontSize: '0.98rem', maxWidth: '480px', margin: '0 auto 24px', lineHeight: 1.6 }}>
              Olá, <strong>{name}</strong>! Seus dados foram encaminhados à assessoria jurídica e contábil do Estado de <strong>{cityUnit}</strong> para emissão do laudo prévio e planejamento preventivo contra busca e apreensão.
            </p>

            <div style={{
              background: '#F8FAFC',
              border: '1.5px solid #CBD5E1',
              borderRadius: '12px',
              padding: '18px',
              marginBottom: '26px',
              textAlign: 'left'
            }}>
              <div style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 700 }}>Potencial de redução revisional:</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#B45309', margin: '4px 0' }}>
                R$ {data.estimatedSavings?.toLocaleString('pt-BR')} em encargos abusivos
              </div>
              <div style={{ fontSize: '0.84rem', color: '#1E293B', fontWeight: 600 }}>
                Valor incontroverso / liquidação estimada: <strong style={{ color: '#047857' }}>R$ {data.estimatedPayoff?.toLocaleString('pt-BR')}</strong> no banco {data.bank}.
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <a
                href={`https://api.whatsapp.com/send?phone=${getWhatsAppNumber()}&text=${generateWhatsAppMessage()}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-lg"
                style={{ width: '100%', fontWeight: 800 }}
              >
                <MessageSquare size={20} />
                <span>Conversar Agora no WhatsApp de {cityUnit}</span>
              </a>

              <button
                type="button"
                onClick={onClose}
                className="btn btn-secondary"
                style={{ width: '100%' }}
              >
                Fechar e Continuar Navegando
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
