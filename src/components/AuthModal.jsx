import React, { useState } from 'react';
import { X, Lock, Mail, User, Phone, Building2, ShieldCheck, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

export function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  
  // Login fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
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
      setErrorMsg('Falha ao autenticar.');
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
        setErrorMsg(result.message || 'Falha ao cadastrar.');
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
        style={{ padding: '36px', maxWidth: '480px' }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="close-btn"
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255, 255, 255, 0.05)',
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
          <X size={18} />
        </button>

        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(16, 185, 129, 0.2))',
            border: '1px solid rgba(245, 158, 11, 0.4)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FBBF24',
            marginBottom: '14px'
          }}>
            <Lock size={26} />
          </div>

          <h3 style={{ fontSize: '1.6rem', color: '#FFFFFF' }}>
            Portal Dom RockFeller
          </h3>
          <p style={{ fontSize: '0.86rem', color: '#94A3B8', marginTop: '4px' }}>
            Acesso seguro para Clientes e Administradores
          </p>
        </div>

        {/* Tab Switcher */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          background: 'rgba(255, 255, 255, 0.04)',
          borderRadius: '12px',
          padding: '4px',
          marginBottom: '22px'
        }}>
          <button
            type="button"
            onClick={() => { setMode('login'); setErrorMsg(''); }}
            style={{
              padding: '10px',
              borderRadius: '9px',
              border: 'none',
              background: mode === 'login' ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
              color: mode === 'login' ? '#34D399' : '#94A3B8',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Entrar
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setErrorMsg(''); }}
            style={{
              padding: '10px',
              borderRadius: '9px',
              border: 'none',
              background: mode === 'register' ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
              color: mode === 'register' ? '#34D399' : '#94A3B8',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Criar Conta
          </button>
        </div>

        {/* Error message alert */}
        {errorMsg && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.35)',
            borderRadius: '10px',
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#F87171',
            fontSize: '0.85rem',
            marginBottom: '16px'
          }}>
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* LOGIN FORM */}
        {mode === 'login' ? (
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">
                <Mail size={15} color="#34D399" /> E-mail
              </label>
              <input
                type="email"
                required
                className="form-input"
                placeholder="seu.email@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <Lock size={15} color="#34D399" /> Senha
              </label>
              <input
                type="password"
                required
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: '6px' }}
            >
              {loading ? 'Entrando...' : (
                <>
                  <span>Entrar no Sistema</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>

          </form>
        ) : (
          /* REGISTRATION FORM (Auto-assigned role: 'cliente') */
          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label className="form-label">
                <User size={15} color="#34D399" /> Nome Completo
              </label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="Seu Nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <Mail size={15} color="#34D399" /> E-mail
              </label>
              <input
                type="email"
                required
                className="form-input"
                placeholder="seu.email@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <Lock size={15} color="#34D399" /> Criar Senha
              </label>
              <input
                type="password"
                required
                className="form-input"
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="grid-2" style={{ gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">
                  <Phone size={15} color="#34D399" /> WhatsApp
                </label>
                <input
                  type="tel"
                  required
                  className="form-input"
                  placeholder="(27) ou (48)..."
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Building2 size={15} color="#34D399" /> Sede
                </label>
                <select
                  className="form-select"
                  value={cityUnit}
                  onChange={(e) => setCityUnit(e.target.value)}
                >
                  <option value="Vitória - ES">Vitória - ES</option>
                  <option value="Florianópolis - SC">Florianópolis - SC</option>
                </select>
              </div>
            </div>

            {/* Note about Client level access */}
            <div style={{
              background: 'rgba(59, 130, 246, 0.08)',
              border: '1px solid rgba(59, 130, 246, 0.25)',
              borderRadius: '8px',
              padding: '10px 12px',
              fontSize: '0.76rem',
              color: '#93C5FD',
              margin: '10px 0 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <ShieldCheck size={16} color="#60A5FA" style={{ flexShrink: 0 }} />
              <span>Contas cadastradas pelo site possuem <strong>nível de Cliente</strong> com acesso seguro aos seus contratos.</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-lg"
              style={{ width: '100%' }}
            >
              {loading ? 'Cadastrando...' : 'Criar Minha Conta de Cliente'}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
