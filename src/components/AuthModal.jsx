import React, { useState } from 'react';
import { 
  X, Lock, Mail, User, Phone, Building2, ShieldCheck, 
  ArrowRight, CheckCircle2, AlertCircle, Eye, EyeOff, KeyRound, HelpCircle
} from 'lucide-react';
import { api } from '../services/api';

export function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  
  // Login fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Register fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [cityUnit, setCityUnit] = useState('Vitória - ES');
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const result = await api.login(email, password);
      if (result.success) {
        onAuthSuccess(result.user);
        onClose();
      } else {
        setErrorMsg(result.message || 'E-mail ou senha incorretos.');
      }
    } catch (err) {
      setErrorMsg('Falha ao autenticar. Verifique sua conexão.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const result = await api.register({
        name,
        email,
        password,
        phone,
        cityUnit
      });
      if (result.success) {
        onAuthSuccess(result.user);
        onClose();
      } else {
        setErrorMsg(result.message || 'Falha ao cadastrar conta.');
      }
    } catch (err) {
      setErrorMsg('Erro de comunicação.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1100 }}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()} 
        style={{ 
          padding: '38px 32px 30px', 
          maxWidth: '460px',
          background: '#FFFFFF',
          borderRadius: '24px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 25px 65px -12px rgba(10, 37, 64, 0.25), 0 0 1px 1px rgba(10, 37, 64, 0.05)'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Fechar"
          style={{
            position: 'absolute',
            top: '18px',
            right: '18px',
            background: '#F1F5F9',
            border: '1px solid #E2E8F0',
            color: '#64748B',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#E2E8F0';
            e.currentTarget.style.color = '#0A2540';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#F1F5F9';
            e.currentTarget.style.color = '#64748B';
          }}
        >
          <X size={18} />
        </button>

        {/* Brand Security Header */}
        <div style={{ textAlign: 'center', marginBottom: '22px' }}>
          
          {/* SSL Security Badge */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.74rem',
              fontWeight: 800,
              color: '#047857',
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              padding: '4px 12px',
              borderRadius: '20px',
              letterSpacing: '0.02em',
              textTransform: 'uppercase'
            }}>
              <Lock size={12} color="#047857" />
              <span>Ambiente Seguro 256-bit SSL</span>
            </span>
          </div>

          {/* Institutional Icon */}
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #0A2540 0%, #0F3256 100%)',
            border: '1.5px solid rgba(197, 155, 39, 0.45)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#C59B27',
            boxShadow: '0 4px 14px rgba(10, 37, 64, 0.2)',
            marginBottom: '12px'
          }}>
            <ShieldCheck size={28} color="#C59B27" />
          </div>

          <h3 style={{ fontSize: '1.55rem', fontWeight: 900, color: '#0A2540', letterSpacing: '-0.025em', margin: '0 0 4px' }}>
            Portal Dom RockFeller
          </h3>
          <p style={{ fontSize: '0.88rem', color: '#64748B', margin: 0, lineHeight: 1.5 }}>
            Acesso exclusivo para consulta de perícias e andamento processual.
          </p>
        </div>

        {/* Segmented Control Tab Switcher (Bank / Social Media Style) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          background: '#F1F5F9',
          borderRadius: '12px',
          padding: '4px',
          marginBottom: '22px',
          border: '1px solid #E2E8F0'
        }}>
          <button
            type="button"
            onClick={() => { setMode('login'); setErrorMsg(''); }}
            style={{
              padding: '10px 14px',
              borderRadius: '9px',
              border: 'none',
              background: mode === 'login' ? '#FFFFFF' : 'transparent',
              color: mode === 'login' ? '#0A2540' : '#64748B',
              fontWeight: mode === 'login' ? 800 : 600,
              fontSize: '0.88rem',
              cursor: 'pointer',
              boxShadow: mode === 'login' ? '0 2px 6px rgba(10, 37, 64, 0.08)' : 'none',
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            Acessar Conta
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setErrorMsg(''); }}
            style={{
              padding: '10px 14px',
              borderRadius: '9px',
              border: 'none',
              background: mode === 'register' ? '#FFFFFF' : 'transparent',
              color: mode === 'register' ? '#0A2540' : '#64748B',
              fontWeight: mode === 'register' ? 800 : 600,
              fontSize: '0.88rem',
              cursor: 'pointer',
              boxShadow: mode === 'register' ? '0 2px 6px rgba(10, 37, 64, 0.08)' : 'none',
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            Criar Nova Conta
          </button>
        </div>

        {/* Error message alert */}
        {errorMsg && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            borderRadius: '10px',
            padding: '11px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: '#DC2626',
            fontSize: '0.85rem',
            marginBottom: '18px'
          }}>
            <AlertCircle size={17} style={{ flexShrink: 0 }} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* LOGIN FORM */}
        {mode === 'login' ? (
          <form onSubmit={handleLogin}>
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label" style={{ fontSize: '0.84rem', color: '#334E68', fontWeight: 700, marginBottom: '6px' }}>
                <Mail size={15} color="#0A2540" /> E-mail de Acesso
              </label>
              <input
                type="email"
                required
                className="form-input"
                placeholder="seu.email@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  background: '#F8FAFC',
                  border: '1.5px solid #CBD5E1',
                  borderRadius: '12px',
                  padding: '12px 14px',
                  fontSize: '0.94rem',
                  color: '#0A2540'
                }}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label className="form-label" style={{ fontSize: '0.84rem', color: '#334E68', fontWeight: 700, margin: 0 }}>
                  <Lock size={15} color="#0A2540" /> Senha
                </label>
                <a
                  href="https://api.whatsapp.com/send?phone=5548920049681&text=Ol%C3%A1!%20Esqueci%20minha%20senha%20de%20acesso%20ao%20portal%20da%20Dom%20RockFeller%20e%20gostaria%20de%20recuperar."
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: '0.80rem', color: '#876214', fontWeight: 700 }}
                >
                  Esqueceu a senha?
                </a>
              </div>
              
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="form-input"
                  placeholder="Sua senha secreta"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    background: '#F8FAFC',
                    border: '1.5px solid #CBD5E1',
                    borderRadius: '12px',
                    padding: '12px 42px 12px 14px',
                    fontSize: '0.94rem',
                    color: '#0A2540'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Ocultar senha" : "Ver senha"}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#64748B',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '4px'
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-lg"
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                fontSize: '0.98rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 16px rgba(197, 155, 39, 0.35)'
              }}
            >
              {loading ? 'Validando Acesso Seguro...' : (
                <>
                  <ShieldCheck size={19} />
                  <span>Entrar com Segurança</span>
                </>
              )}
            </button>
          </form>
        ) : (
          /* REGISTRATION FORM (Client Level) */
          <form onSubmit={handleRegister}>
            <div className="form-group" style={{ marginBottom: '14px' }}>
              <label className="form-label" style={{ fontSize: '0.84rem', color: '#334E68', fontWeight: 700, marginBottom: '6px' }}>
                <User size={15} color="#0A2540" /> Nome Completo
              </label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="Seu nome completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  background: '#F8FAFC',
                  border: '1.5px solid #CBD5E1',
                  borderRadius: '12px',
                  padding: '11px 14px',
                  fontSize: '0.92rem',
                  color: '#0A2540'
                }}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '14px' }}>
              <label className="form-label" style={{ fontSize: '0.84rem', color: '#334E68', fontWeight: 700, marginBottom: '6px' }}>
                <Mail size={15} color="#0A2540" /> E-mail
              </label>
              <input
                type="email"
                required
                className="form-input"
                placeholder="seu.email@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  background: '#F8FAFC',
                  border: '1.5px solid #CBD5E1',
                  borderRadius: '12px',
                  padding: '11px 14px',
                  fontSize: '0.92rem',
                  color: '#0A2540'
                }}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '14px' }}>
              <label className="form-label" style={{ fontSize: '0.84rem', color: '#334E68', fontWeight: 700, marginBottom: '6px' }}>
                <Lock size={15} color="#0A2540" /> Criar Senha de Acesso
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="form-input"
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    background: '#F8FAFC',
                    border: '1.5px solid #CBD5E1',
                    borderRadius: '12px',
                    padding: '11px 42px 11px 14px',
                    fontSize: '0.92rem',
                    color: '#0A2540'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Ocultar senha" : "Ver senha"}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#64748B',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '4px'
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="grid-2" style={{ gap: '12px', marginBottom: '14px' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontSize: '0.84rem', color: '#334E68', fontWeight: 700, marginBottom: '6px' }}>
                  <Phone size={15} color="#0A2540" /> WhatsApp
                </label>
                <input
                  type="tel"
                  required
                  className="form-input"
                  placeholder="(DDD) Celular"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{
                    background: '#F8FAFC',
                    border: '1.5px solid #CBD5E1',
                    borderRadius: '12px',
                    padding: '11px 14px',
                    fontSize: '0.92rem',
                    color: '#0A2540'
                  }}
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontSize: '0.84rem', color: '#334E68', fontWeight: 700, marginBottom: '6px' }}>
                  <Building2 size={15} color="#0A2540" /> Sede
                </label>
                <select
                  className="form-select"
                  value={cityUnit}
                  onChange={(e) => setCityUnit(e.target.value)}
                  style={{
                    background: '#F8FAFC',
                    border: '1.5px solid #CBD5E1',
                    borderRadius: '12px',
                    padding: '11px 14px',
                    fontSize: '0.92rem',
                    color: '#0A2540'
                  }}
                >
                  <option value="Florianópolis - SC">Florianópolis - SC (Ativa)</option>
                  <option value="Vitória - ES">Vitória - ES (Em breve)</option>
                </select>
              </div>
            </div>

            {/* Note about Client level access */}
            <div style={{
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '10px',
              padding: '10px 14px',
              fontSize: '0.78rem',
              color: '#475569',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <ShieldCheck size={16} color="#047857" style={{ flexShrink: 0 }} />
              <span>Seus dados são protegidos por sigilo profissional e pela LGPD (Lei 13.709/18).</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-lg"
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                fontSize: '0.98rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 16px rgba(197, 155, 39, 0.35)'
              }}
            >
              {loading ? 'Criando Conta...' : (
                <>
                  <CheckCircle2 size={18} />
                  <span>Concluir Cadastro Seguro</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Security Footer Badges */}
        <div style={{
          marginTop: '22px',
          paddingTop: '16px',
          borderTop: '1px solid #F1F5F9',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '16px',
          fontSize: '0.74rem',
          color: '#64748B',
          fontWeight: 600
        }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <Lock size={12} color="#047857" /> Criptografia de Ponta
          </span>
          <span>&bull;</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <ShieldCheck size={12} color="#047857" /> Proteção LGPD
          </span>
        </div>

      </div>
    </div>
  );
}
