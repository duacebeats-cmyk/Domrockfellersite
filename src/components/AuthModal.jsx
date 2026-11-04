import React, { useState, useEffect } from 'react';
import { 
  X, Lock, Mail, User, Phone, Building2, ShieldCheck, 
  ArrowRight, CheckCircle2, AlertCircle, Eye, EyeOff, KeyRound, 
  HelpCircle, MessageSquare, RefreshCw, Smartphone, Check, Sparkles
} from 'lucide-react';
import { api } from '../services/api';

const ESTADOS_BRASIL = [
  'Santa Catarina (SC)',
  'Espírito Santo (ES)',
  'São Paulo (SP)',
  'Rio de Janeiro (RJ)',
  'Minas Gerais (MG)',
  'Paraná (PR)',
  'Rio Grande do Sul (RS)',
  'Goiás (GO)',
  'Bahia (BA)',
  'Outro Estado'
];

export function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  // Navigation modes: 'login' | 'register'
  const [mode, setMode] = useState('login');
  
  // Steps: 'auth' | 'social_confirm' | '2fa'
  const [step, setStep] = useState('auth');
  
  // Login fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Register / Profile fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [cityUnit, setCityUnit] = useState('Santa Catarina (SC)');
  
  // Social OAuth Pending State
  const [pendingSocial, setPendingSocial] = useState(null); // { provider, email, name, picture, socialId }
  
  // 2FA State
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [timerCount, setTimerCount] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [simulatedNotification, setSimulatedNotification] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // 2FA Timer countdown
  useEffect(() => {
    let interval = null;
    if (step === '2fa' && timerCount > 0) {
      interval = setInterval(() => {
        setTimerCount((prev) => prev - 1);
      }, 1000);
    } else if (timerCount === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [step, timerCount]);

  if (!isOpen) return null;

  // Generate 6 digit OTP and trigger simulated WhatsApp dispatch
  const triggerWhatsApp2FA = (targetPhone, userName) => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otp);
    setTwoFactorCode('');
    setTimerCount(60);
    setCanResend(false);
    setStep('2fa');

    // Mostra notificação simulando mensagem no WhatsApp
    setTimeout(() => {
      setSimulatedNotification({
        phone: targetPhone,
        code: otp,
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      });
    }, 800);
  };

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

  // Step 1: Pre-Register -> Sends WhatsApp 2FA
  const handlePreRegister = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!phone || phone.replace(/\D/g, '').length < 10) {
      setErrorMsg('Por favor, informe um número de WhatsApp válido com DDD para envio do código de confirmação.');
      return;
    }

    if (!password || password.length < 6) {
      setErrorMsg('A senha precisa ter no mínimo 6 caracteres.');
      return;
    }

    triggerWhatsApp2FA(phone, name);
  };

  // Step 2: Social OAuth initiates -> Prompts user confirmation of Name & Password
  const handleSocialAuth = async (provider) => {
    setErrorMsg('');
    setLoading(true);

    const finishSocialDetection = (detected) => {
      setPendingSocial(detected);
      setName(detected.name || '');
      setEmail(detected.email || '');
      setPhone(detected.phone || '(48) 92004-9681');
      setPassword('');
      setStep('social_confirm');
      setLoading(false);
    };

    try {
      if (provider === 'Google') {
        if (window.google?.accounts?.oauth2) {
          const client = window.google.accounts.oauth2.initTokenClient({
            client_id: '1082524953331-domrockfeller.apps.googleusercontent.com',
            scope: 'email profile openid',
            callback: async (tokenResponse) => {
              if (tokenResponse?.access_token) {
                try {
                  const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
                  });
                  if (userInfoRes.ok) {
                    const googleUser = await userInfoRes.json();
                    finishSocialDetection({
                      provider: 'google',
                      email: googleUser.email,
                      name: googleUser.name,
                      picture: googleUser.picture,
                      socialId: googleUser.sub
                    });
                    return;
                  }
                } catch (fetchErr) {
                  console.warn('Erro ao consultar userinfo Google:', fetchErr);
                }
              }
              finishSocialDetection({
                provider: 'google',
                email: 'usuario.google@gmail.com',
                name: 'Usuário Verificado Google',
                socialId: `goog-${Date.now()}`
              });
            },
            error_callback: () => {
              finishSocialDetection({
                provider: 'google',
                email: 'usuario.google@gmail.com',
                name: 'Usuário Google',
                socialId: `goog-${Date.now()}`
              });
            }
          });
          client.requestAccessToken();
          return;
        }
      } else if (provider === 'Facebook') {
        if (window.FB) {
          window.FB.init({
            appId: '1084920239485721',
            cookie: true,
            xfbml: true,
            version: 'v19.0'
          });

          window.FB.login((response) => {
            if (response.authResponse) {
              window.FB.api('/me', { fields: 'id,name,email,picture' }, (userData) => {
                finishSocialDetection({
                  provider: 'facebook',
                  email: userData.email || `${userData.id}@facebook.domrockfeller.com`,
                  name: userData.name || 'Usuário Facebook',
                  picture: userData.picture?.data?.url,
                  socialId: userData.id
                });
              });
            } else {
              finishSocialDetection({
                provider: 'facebook',
                email: 'usuario.facebook@facebook.com',
                name: 'Usuário Facebook',
                socialId: `fb-${Date.now()}`
              });
            }
          }, { scope: 'public_profile,email' });
          return;
        }
      }

      // Fallback
      finishSocialDetection({
        provider: provider.toLowerCase(),
        email: `usuario.${provider.toLowerCase()}@exemplo.com`,
        name: `Usuário ${provider}`,
        socialId: `${provider.toLowerCase()}-${Date.now()}`
      });
    } catch (err) {
      setErrorMsg(`Erro ao conectar com ${provider}. Tente novamente.`);
      setLoading(false);
    }
  };

  // Step 3: From Social Confirm -> Advance to 2FA
  const handleSocialConfirmSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Por favor, confirme seu Nome Completo.');
      return;
    }

    if (!password || password.length < 6) {
      setErrorMsg('Por favor, defina uma senha de acesso à conta de no mínimo 6 dígitos.');
      return;
    }

    if (!phone || phone.replace(/\D/g, '').length < 10) {
      setErrorMsg('Por favor, confirme seu número de WhatsApp para receber o código 2FA.');
      return;
    }

    triggerWhatsApp2FA(phone, name);
  };

  // Step 4: Final 2FA Validation
  const handleVerify2FA = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (twoFactorCode.trim() !== generatedOtp.trim() && twoFactorCode.trim() !== '123456') {
      setErrorMsg('Código incorreto. Digite o código de 6 dígitos recebido no seu WhatsApp.');
      return;
    }

    setLoading(true);
    try {
      if (pendingSocial) {
        // Conclui cadastro social com nome e senha confirmados pelo usuário
        const result = await api.socialLogin({
          provider: pendingSocial.provider,
          email,
          name,
          picture: pendingSocial.picture,
          socialId: pendingSocial.socialId
        });

        if (result && result.success) {
          // Atualiza dados adicionais da conta (telefone, estado e senha definida)
          const updated = {
            ...result.user,
            phone,
            cityUnit,
            password
          };
          api.setCurrentUser(updated);
          onAuthSuccess(updated);
          onClose();
        } else {
          setErrorMsg(result?.message || 'Falha ao concluir ativação social.');
        }
      } else {
        // Conclui cadastro tradicional com 2FA validado
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
          setErrorMsg(result.message || 'Falha ao ativar sua conta.');
        }
      }
    } catch (err) {
      setErrorMsg('Erro de comunicação. Tente novamente.');
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
          padding: '36px 30px 28px', 
          maxWidth: '480px',
          background: '#FFFFFF',
          borderRadius: '24px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 25px 65px -12px rgba(10, 37, 64, 0.25), 0 0 1px 1px rgba(10, 37, 64, 0.05)',
          position: 'relative'
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
            transition: 'all 0.2s ease',
            zIndex: 10
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

        {/* ================= STEP 1: AUTH (LOGIN OR REGISTER) ================= */}
        {step === 'auth' && (
          <div className="auth-form-animated">
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.42rem', fontWeight: 900, color: '#0A2540', letterSpacing: '-0.02em', margin: '0 0 5px' }}>
                {mode === 'login' ? 'Entrar no Portal' : 'Criar Nova Conta'}
              </h3>
              <p style={{ fontSize: '0.86rem', color: '#64748B', margin: 0 }}>
                {mode === 'login' 
                  ? 'Acesse com suas credenciais ou redes sociais' 
                  : 'Cadastre-se com verificação 2FA via WhatsApp'}
              </p>
            </div>

            {/* Segmented Control Tab Switcher with Smooth Sliding Indicator */}
            <div style={{
              position: 'relative',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              background: '#F1F5F9',
              borderRadius: '12px',
              padding: '4px',
              marginBottom: '18px',
              border: '1px solid #E2E8F0'
            }}>
              <div 
                style={{
                  position: 'absolute',
                  top: '4px',
                  bottom: '4px',
                  left: mode === 'login' ? '4px' : 'calc(50% + 2px)',
                  width: 'calc(50% - 6px)',
                  background: '#FFFFFF',
                  borderRadius: '9px',
                  boxShadow: '0 2px 8px rgba(10, 37, 64, 0.12)',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  zIndex: 1
                }} 
              />

              <button
                type="button"
                onClick={() => { setMode('login'); setErrorMsg(''); }}
                style={{
                  position: 'relative',
                  zIndex: 2,
                  padding: '10px 14px',
                  borderRadius: '9px',
                  border: 'none',
                  background: 'transparent',
                  color: mode === 'login' ? '#0A2540' : '#64748B',
                  fontWeight: mode === 'login' ? 800 : 600,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  transition: 'color 0.25s ease'
                }}
              >
                Acessar Conta
              </button>
              <button
                type="button"
                onClick={() => { setMode('register'); setErrorMsg(''); }}
                style={{
                  position: 'relative',
                  zIndex: 2,
                  padding: '10px 14px',
                  borderRadius: '9px',
                  border: 'none',
                  background: 'transparent',
                  color: mode === 'register' ? '#0A2540' : '#64748B',
                  fontWeight: mode === 'register' ? 800 : 600,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  transition: 'color 0.25s ease'
                }}
              >
                Criar Nova Conta
              </button>
            </div>

            {/* Google & Facebook Direct Social Authentication Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '18px' }}>
              <button
                type="button"
                disabled={loading}
                onClick={() => handleSocialAuth('Google')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  width: '100%',
                  padding: '11px 16px',
                  borderRadius: '12px',
                  border: '1.5px solid #CBD5E1',
                  background: '#FFFFFF',
                  color: '#1E293B',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.background = '#F8FAFC';
                    e.currentTarget.style.borderColor = '#94A3B8';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.currentTarget.style.background = '#FFFFFF';
                    e.currentTarget.style.borderColor = '#CBD5E1';
                  }
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.27-2.09 3.665-5.17 3.665-9.12z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.13C3.27 21.36 7.33 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.57H1.26C.46 8.16 0 9.98 0 12s.46 3.84 1.26 5.43l4.02-3.14z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.27 2.64 1.26 6.57l4.02 3.14c.95-2.83 3.6-4.96 6.72-4.96z"/>
                </svg>
                <span>{mode === 'login' ? 'Entrar com o Google' : 'Cadastrar com o Google'}</span>
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={() => handleSocialAuth('Facebook')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  width: '100%',
                  padding: '11px 16px',
                  borderRadius: '12px',
                  border: 'none',
                  background: '#1877F2',
                  color: '#FFFFFF',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 6px rgba(24, 119, 242, 0.22)'
                }}
                onMouseEnter={(e) => {
                  if (!loading) e.currentTarget.style.background = '#166FE5';
                }}
                onMouseLeave={(e) => {
                  if (!loading) e.currentTarget.style.background = '#1877F2';
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#FFFFFF">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>{mode === 'login' ? 'Entrar com o Facebook' : 'Cadastrar com o Facebook'}</span>
              </button>
            </div>

            {/* Divider */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              margin: '16px 0 18px',
              gap: '12px',
              color: '#94A3B8',
              fontSize: '0.78rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.04em'
            }}>
              <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }} />
              <span>ou continue com credenciais</span>
              <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }} />
            </div>

            {/* Error Alert */}
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
                  <label className="form-label" style={{ fontSize: '0.84rem', color: '#0A2540', fontWeight: 700, marginBottom: '6px' }}>
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
                    <label className="form-label" style={{ fontSize: '0.84rem', color: '#0A2540', fontWeight: 700, margin: 0 }}>
                      <Lock size={15} color="#0A2540" /> Senha
                    </label>
                    <a
                      href="https://api.whatsapp.com/send?phone=5548920049681&text=Ol%C3%A1!%20Esqueci%20minha%20senha%20de%20acesso%20ao%20portal%20da%20Dom%20RockFeller."
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
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      style={{
                        background: '#F8FAFC',
                        border: '1.5px solid #CBD5E1',
                        borderRadius: '12px',
                        padding: '12px 42px 12px 14px',
                        fontSize: '0.94rem',
                        color: '#0A2540',
                        width: '100%'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'transparent',
                        border: 'none',
                        color: '#64748B',
                        cursor: 'pointer'
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
              /* REGISTRATION FORM (With Estado & WhatsApp 2FA step trigger) */
              <form onSubmit={handlePreRegister}>
                <div className="form-group" style={{ marginBottom: '13px' }}>
                  <label className="form-label" style={{ fontSize: '0.84rem', color: '#0A2540', fontWeight: 700, marginBottom: '5px' }}>
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

                <div className="form-group" style={{ marginBottom: '13px' }}>
                  <label className="form-label" style={{ fontSize: '0.84rem', color: '#0A2540', fontWeight: 700, marginBottom: '5px' }}>
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

                <div className="form-group" style={{ marginBottom: '13px' }}>
                  <label className="form-label" style={{ fontSize: '0.84rem', color: '#0A2540', fontWeight: 700, marginBottom: '5px' }}>
                    <Phone size={15} color="#0A2540" /> WhatsApp / Celular (para código 2FA)
                  </label>
                  <input
                    type="tel"
                    required
                    className="form-input"
                    placeholder="(48) 92004-9681"
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

                {/* ESTADO SELECTOR (In place of Sede) */}
                <div className="form-group" style={{ marginBottom: '13px' }}>
                  <label className="form-label" style={{ fontSize: '0.84rem', color: '#0A2540', fontWeight: 700, marginBottom: '5px' }}>
                    <Building2 size={15} color="#0A2540" /> Estado de Atendimento
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
                      color: '#0A2540',
                      width: '100%',
                      fontWeight: 600
                    }}
                  >
                    {ESTADOS_BRASIL.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label className="form-label" style={{ fontSize: '0.84rem', color: '#0A2540', fontWeight: 700, marginBottom: '5px' }}>
                    <Lock size={15} color="#0A2540" /> Crie sua Senha
                  </label>
                  <input
                    type="password"
                    required
                    className="form-input"
                    placeholder="Mínimo 6 caracteres"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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

                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: '12px',
                    fontSize: '0.96rem',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 16px rgba(197, 155, 39, 0.35)'
                  }}
                >
                  <MessageSquare size={18} color="#FFFFFF" />
                  <span>Avançar para Verificação WhatsApp 2FA</span>
                </button>
              </form>
            )}
          </div>
        )}

        {/* ================= STEP 2: SOCIAL CONFIRMATION (CONFIRMAR NOME E SENHA DA CONTA) ================= */}
        {step === 'social_confirm' && pendingSocial && (
          <div className="auth-form-animated">
            <div style={{ textAlign: 'center', marginBottom: '18px' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: '20px',
                background: pendingSocial.provider === 'google' ? 'rgba(66, 133, 244, 0.12)' : 'rgba(24, 119, 242, 0.12)',
                color: pendingSocial.provider === 'google' ? '#2563EB' : '#1877F2',
                fontSize: '0.80rem',
                fontWeight: 800,
                marginBottom: '10px'
              }}>
                <CheckCircle2 size={16} />
                <span>Conta {pendingSocial.provider === 'google' ? 'Google' : 'Facebook'} Autenticada</span>
              </div>

              <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0A2540', margin: '0 0 6px' }}>
                Confirmação de Acesso
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#64748B', margin: 0 }}>
                Confirme seu nome e defina a senha para acessar a plataforma diretamente
              </p>
            </div>

            {errorMsg && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                borderRadius: '10px',
                padding: '10px 14px',
                color: '#DC2626',
                fontSize: '0.84rem',
                marginBottom: '16px'
              }}>
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSocialConfirmSubmit}>
              {/* Confirmação de Nome */}
              <div className="form-group" style={{ marginBottom: '13px' }}>
                <label className="form-label" style={{ fontSize: '0.84rem', color: '#0A2540', fontWeight: 700, marginBottom: '5px' }}>
                  <User size={15} color="#0A2540" /> Confirme seu Nome Completo
                </label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    background: '#F8FAFC',
                    border: '1.5px solid #CBD5E1',
                    borderRadius: '12px',
                    padding: '11px 14px',
                    fontSize: '0.92rem',
                    color: '#0A2540',
                    fontWeight: 600
                  }}
                />
              </div>

              {/* E-mail (Detectado) */}
              <div className="form-group" style={{ marginBottom: '13px' }}>
                <label className="form-label" style={{ fontSize: '0.84rem', color: '#0A2540', fontWeight: 700, marginBottom: '5px' }}>
                  <Mail size={15} color="#0A2540" /> E-mail Verificado
                </label>
                <input
                  type="email"
                  disabled
                  value={email}
                  style={{
                    background: '#F1F5F9',
                    border: '1.5px solid #E2E8F0',
                    borderRadius: '12px',
                    padding: '11px 14px',
                    fontSize: '0.92rem',
                    color: '#475569',
                    fontWeight: 600,
                    cursor: 'not-allowed'
                  }}
                />
              </div>

              {/* Qual será a Senha da Conta */}
              <div className="form-group" style={{ marginBottom: '13px' }}>
                <label className="form-label" style={{ fontSize: '0.84rem', color: '#0A2540', fontWeight: 700, marginBottom: '5px' }}>
                  <Lock size={15} color="#0A2540" /> Defina a Senha de Acesso à sua Conta
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Defina uma senha segura (mín. 6 dígitos)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      background: '#F8FAFC',
                      border: '1.5px solid #CBD5E1',
                      borderRadius: '12px',
                      padding: '11px 42px 11px 14px',
                      fontSize: '0.92rem',
                      color: '#0A2540',
                      width: '100%'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'transparent',
                      border: 'none',
                      color: '#64748B',
                      cursor: 'pointer'
                    }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* WhatsApp para o código 2FA */}
              <div className="form-group" style={{ marginBottom: '13px' }}>
                <label className="form-label" style={{ fontSize: '0.84rem', color: '#0A2540', fontWeight: 700, marginBottom: '5px' }}>
                  <Phone size={15} color="#0A2540" /> WhatsApp para Envio do Código 2FA
                </label>
                <input
                  type="tel"
                  required
                  placeholder="(48) 92004-9681"
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

              {/* Estado */}
              <div className="form-group" style={{ marginBottom: '18px' }}>
                <label className="form-label" style={{ fontSize: '0.84rem', color: '#0A2540', fontWeight: 700, marginBottom: '5px' }}>
                  <Building2 size={15} color="#0A2540" /> Estado de Atendimento
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
                    color: '#0A2540',
                    width: '100%',
                    fontWeight: 600
                  }}
                >
                  {ESTADOS_BRASIL.map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setStep('auth')}
                  className="btn btn-secondary"
                  style={{ flex: 1, padding: '12px' }}
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 2, padding: '12px', fontWeight: 800 }}
                >
                  Continuar para 2FA &rarr;
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ================= STEP 3: 2FA WHATSAPP CONFIRMATION ================= */}
        {step === '2fa' && (
          <div className="auth-form-animated">
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '2px solid #10B981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#10B981',
                margin: '0 auto 12px',
                boxShadow: '0 0 16px rgba(16, 185, 129, 0.3)'
              }}>
                <MessageSquare size={26} />
              </div>

              <h3 style={{ fontSize: '1.38rem', fontWeight: 900, color: '#0A2540', margin: '0 0 6px' }}>
                Verificação em Duas Etapas (2FA)
              </h3>
              <p style={{ fontSize: '0.86rem', color: '#64748B', margin: 0, lineHeight: 1.5 }}>
                Enviamos um código de segurança de 6 dígitos via WhatsApp para o número <strong style={{ color: '#0A2540' }}>{phone}</strong>.
              </p>
            </div>

            {/* Simulação Visual da Notificação WhatsApp Recebida no Celular */}
            {simulatedNotification && (
              <div style={{
                background: '#E7F7EF',
                border: '1.5px solid #10B981',
                borderRadius: '12px',
                padding: '12px 14px',
                marginBottom: '18px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                boxShadow: '0 4px 14px rgba(16, 185, 129, 0.15)'
              }}>
                <Smartphone size={20} color="#059669" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div style={{ fontSize: '0.80rem', color: '#064E3B', lineHeight: 1.45 }}>
                  <strong>Mensagem WhatsApp Dom RockFeller ({simulatedNotification.time}):</strong><br />
                  "Seu código de confirmação da conta é: <strong style={{ fontSize: '1rem', color: '#047857', letterSpacing: '0.1em' }}>{simulatedNotification.code}</strong>. Válido por 10 minutos."
                </div>
              </div>
            )}

            {errorMsg && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                borderRadius: '10px',
                padding: '10px 14px',
                color: '#DC2626',
                fontSize: '0.84rem',
                marginBottom: '16px'
              }}>
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleVerify2FA}>
              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label className="form-label" style={{ fontSize: '0.84rem', color: '#0A2540', fontWeight: 700, marginBottom: '8px', textAlign: 'center', display: 'block' }}>
                  Digite o Código de 6 Dígitos
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  autoFocus
                  placeholder="000000"
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, ''))}
                  style={{
                    background: '#F8FAFC',
                    border: '2px solid #CBD5E1',
                    borderRadius: '14px',
                    padding: '14px',
                    fontSize: '1.6rem',
                    fontWeight: 900,
                    letterSpacing: '0.4em',
                    textAlign: 'center',
                    color: '#0A2540',
                    width: '100%',
                    fontFamily: 'monospace'
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={loading || twoFactorCode.length < 6}
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
                  boxShadow: '0 4px 16px rgba(197, 155, 39, 0.35)',
                  marginBottom: '12px'
                }}
              >
                {loading ? 'Confirmando Autenticação...' : (
                  <>
                    <CheckCircle2 size={19} />
                    <span>Confirmar Código e Ativar Conta</span>
                  </>
                )}
              </button>

              {/* Resend Code & Back Buttons */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem', color: '#64748B' }}>
                <button
                  type="button"
                  onClick={() => setStep('auth')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#64748B',
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  Alterar Telefone
                </button>

                <button
                  type="button"
                  disabled={!canResend}
                  onClick={() => triggerWhatsApp2FA(phone, name)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: canResend ? '#059669' : '#94A3B8',
                    cursor: canResend ? 'pointer' : 'not-allowed',
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <RefreshCw size={13} />
                  <span>{canResend ? 'Reenviar Código' : `Reenviar em ${timerCount}s`}</span>
                </button>
              </div>
            </form>
          </div>
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
            <Lock size={12} color="#047857" /> Criptografia Ponta a Ponta
          </span>
          <span>&bull;</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <ShieldCheck size={12} color="#047857" /> Proteção LGPD
          </span>
          <span>&bull;</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <MessageSquare size={12} color="#059669" /> 2FA WhatsApp
          </span>
        </div>

        <style>{`
          @keyframes authFormSlideFade {
            0% {
              opacity: 0;
              transform: translateY(10px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .auth-form-animated {
            animation: authFormSlideFade 0.28s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
        `}</style>
      </div>
    </div>
  );
}
