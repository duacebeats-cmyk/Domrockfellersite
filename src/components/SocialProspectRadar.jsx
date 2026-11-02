import React, { useState, useEffect } from 'react';
import { 
  Users, UserPlus, ExternalLink, Copy, Check, ShieldAlert, 
  Sparkles, Filter, Search, Plus, CheckCircle2, MessageSquare, Flame, 
  MapPin, Car, AlertTriangle, ArrowRight, RefreshCw
} from 'lucide-react';
import { api } from '../services/api';

export function SocialProspectRadar() {
  const [prospects, setProspects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeNiche, setActiveNiche] = useState('TODOS');
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newProspect, setNewProspect] = useState({
    username: '',
    name: '',
    city: 'Vitória - ES',
    niche: 'Investidor de Leilões & Oportunidades',
    targetVehicle: 'BMW 320i / Rampage',
    suggestedDm: ''
  });

  const loadProspects = () => {
    setLoading(true);
    fetch('/api/instagram/prospects', {
      headers: api.getAuthHeaders()
    })
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          setProspects(d.prospects || []);
        }
      })
      .catch(e => console.error(e))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProspects();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/instagram/prospects/${id}/status`, {
        method: 'POST',
        headers: api.getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setProspects(prev => prev.map(p => p.id === id ? data.prospect : p));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCopyDm = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 3000);
  };

  const handleAddProspect = async (e) => {
    e.preventDefault();
    if (!newProspect.username) return;

    try {
      const res = await fetch('/api/instagram/prospects', {
        method: 'POST',
        headers: api.getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(newProspect)
      });
      const data = await res.json();
      if (data.success) {
        setProspects(prev => [data.prospect, ...prev]);
        setIsAddModalOpen(false);
        setNewProspect({
          username: '',
          name: '',
          city: 'Vitória - ES',
          niche: 'Investidor de Leilões & Oportunidades',
          targetVehicle: 'BMW 320i / Rampage',
          suggestedDm: ''
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = prospects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                          p.username.toLowerCase().includes(search.toLowerCase()) ||
                          p.niche.toLowerCase().includes(search.toLowerCase()) ||
                          p.city.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;

    if (activeNiche === 'TODOS') return true;
    if (activeNiche === 'LUXO') return p.niche.toLowerCase().includes('luxo');
    if (activeNiche === 'LEILOES') return p.niche.toLowerCase().includes('leil');
    if (activeNiche === 'FROTAS') return p.niche.toLowerCase().includes('frota') || p.niche.toLowerCase().includes('transporte');
    if (activeNiche === 'REVISIONAL') return p.niche.toLowerCase().includes('econ') || p.niche.toLowerCase().includes('aplicativo');
    return true;
  });

  const followedCount = prospects.filter(p => p.status === 'seguido' || p.status === 'dm_enviada' || p.status === 'convertido').length;
  const dmSentCount = prospects.filter(p => p.status === 'dm_enviada' || p.status === 'convertido').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Top Banner with Meta Safety & Growth Guidelines */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(15, 23, 42, 0.8) 100%)',
        border: '1.5px solid rgba(245, 158, 11, 0.35)',
        borderRadius: '16px',
        padding: '24px',
        position: 'relative'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ maxWidth: '820px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span className="badge badge-gold">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
                <span>Prospecção Ativa no Instagram (@domrockfellervix)</span>
              </span>
              <span style={{ fontSize: '0.8rem', color: '#4ade80', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle2 size={13} />
                <span>Diretrizes Anti-Ban da Meta Ativas</span>
              </span>
            </div>

            <h2 style={{ fontSize: '1.6rem', color: '#FFFFFF', fontWeight: 900, marginBottom: '8px' }}>
              Radar de Clientes em Potencial &amp; Abordagem Automotiva
            </h2>
            <p style={{ color: '#94A3B8', fontSize: '0.92rem', lineHeight: 1.6 }}>
              A API oficial da Meta <strong>não permite robôs de auto-follow</strong> para proteger contas contra penalidades de spam. Este radar identifica e organiza pessoas com alto interesse comprovado em compra de veículos, leilões e redução de parcelas em Vitória (ES) e Florianópolis (SC), permitindo que você siga até <strong>20 perfis por dia com 1 clique</strong> e envie abordagens com alta taxa de conversão!
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="btn btn-gold btn-sm"
            style={{ fontWeight: 800, padding: '10px 18px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            <Plus size={16} />
            <span>Adicionar Novo Lead ao Radar</span>
          </button>
        </div>

        {/* Metrics Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '14px',
          marginTop: '20px',
          paddingTop: '18px',
          borderTop: '1px solid rgba(245, 158, 11, 0.15)'
        }}>
          <div style={{ background: '#0a0d14', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '14px' }}>
            <div style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 600 }}>Meta Diária Segura</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#FBBF24' }}>20 Perfis/Dia</div>
            <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Evita restrições temporárias do Instagram</div>
          </div>

          <div style={{ background: '#0a0d14', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '14px' }}>
            <div style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 600 }}>Seguidos no Radar</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#FFFFFF' }}>{followedCount} / {prospects.length}</div>
            <div style={{ fontSize: '0.72rem', color: '#34d399' }}>{Math.round((followedCount / (prospects.length || 1)) * 100)}% de taxa de ação</div>
          </div>

          <div style={{ background: '#0a0d14', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '14px' }}>
            <div style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 600 }}>DMs Enviadas</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#60A5FA' }}>{dmSentCount}</div>
            <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>Com scripts de alta conversão</div>
          </div>

          <div style={{ background: '#0a0d14', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '14px' }}>
            <div style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 600 }}>Base Qualificada</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#FDE68A' }}>{prospects.length} Leads</div>
            <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>Vitória (ES) &amp; Florianópolis (SC)</div>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div style={{
        background: '#0d111a',
        border: '1px solid rgba(245, 158, 11, 0.2)',
        borderRadius: '14px',
        padding: '16px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '14px'
      }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { id: 'TODOS', label: 'Todos os Leads' },
            { id: 'LUXO', label: '💎 Luxo & Importados' },
            { id: 'LEILOES', label: '💰 Investidores & Leilões' },
            { id: 'FROTAS', label: '🚙 Frotas & Transporte' },
            { id: 'REVISIONAL', label: '⚖️ Revisional & Econômicos' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveNiche(tab.id)}
              style={{
                padding: '7px 14px',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                border: activeNiche === tab.id ? '1px solid #FBBF24' : '1px solid rgba(255,255,255,0.08)',
                background: activeNiche === tab.id ? 'rgba(245, 158, 11, 0.22)' : 'transparent',
                color: activeNiche === tab.id ? '#FDE68A' : '#94A3B8'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', minWidth: '240px' }}>
          <Search size={15} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Buscar por @perfil, nome, nicho..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '7px 12px 7px 34px',
              borderRadius: '8px',
              background: '#07090e',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              color: '#FFFFFF',
              fontSize: '0.85rem',
              outline: 'none'
            }}
          />
        </div>
      </div>

      {/* Prospect Cards Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#94A3B8' }}>
          Carregando radar de prospecção...
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#94A3B8' }}>
          Nenhum perfil encontrado para os filtros selecionados.
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
          gap: '20px'
        }}>
          {filtered.map(p => {
            const isFollowed = p.status === 'seguido' || p.status === 'dm_enviada' || p.status === 'convertido';
            return (
              <div
                key={p.id}
                style={{
                  background: 'linear-gradient(180deg, #0e121a 0%, #07090e 100%)',
                  border: isFollowed ? '1.5px solid rgba(34, 197, 94, 0.4)' : '1px solid rgba(245, 158, 11, 0.22)',
                  borderRadius: '16px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  position: 'relative'
                }}
              >
                {/* Header: User & City */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#FFF',
                        fontWeight: 900,
                        fontSize: '1rem',
                        flexShrink: 0
                      }}>
                        {p.name.charAt(0)}
                      </span>
                      <div>
                        <h4 style={{ color: '#FFFFFF', fontWeight: 800, fontSize: '1.05rem', margin: 0, lineHeight: 1.2 }}>
                          {p.name}
                        </h4>
                        <a
                          href={`https://www.instagram.com/${p.username}/`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: '#FBBF24',
                            fontSize: '0.85rem',
                            fontWeight: 700,
                            textDecoration: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <span>@{p.username}</span>
                          <ExternalLink size={12} />
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    padding: '3px 9px',
                    borderRadius: '12px',
                    textTransform: 'uppercase',
                    background: p.status === 'convertido' ? 'rgba(34, 197, 94, 0.2)' :
                                p.status === 'dm_enviada' ? 'rgba(96, 165, 250, 0.2)' :
                                p.status === 'seguido' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255,255,255,0.08)',
                    color: p.status === 'convertido' ? '#4ade80' :
                           p.status === 'dm_enviada' ? '#60a5fa' :
                           p.status === 'seguido' ? '#FDE68A' : '#94A3B8',
                    border: `1px solid ${
                      p.status === 'convertido' ? '#22c55e' :
                      p.status === 'dm_enviada' ? '#3b82f6' :
                      p.status === 'seguido' ? '#FBBF24' : 'rgba(255,255,255,0.1)'
                    }`
                  }}>
                    {p.status === 'convertido' ? '✓ Convertido' :
                     p.status === 'dm_enviada' ? 'DM Enviada' :
                     p.status === 'seguido' ? '✓ Seguido' : 'Novo Lead'}
                  </span>
                </div>

                {/* Details Pills */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.82rem' }}>
                  <div style={{ color: '#CBD5E1', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={14} color="#FBBF24" />
                    <span>{p.city}</span>
                    <span style={{ color: 'rgba(255,255,255,0.2)' }}>•</span>
                    <span style={{ color: '#94A3B8' }}>{p.niche}</span>
                  </div>

                  <div style={{ color: '#CBD5E1', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Car size={14} color="#FBBF24" />
                    <span>Interesse: <strong style={{ color: '#FDE68A' }}>{p.targetVehicle}</strong></span>
                  </div>

                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '8px 10px', borderRadius: '8px', color: '#94A3B8', fontSize: '0.78rem' }}>
                    💡 <em>{p.interestReason}</em>
                  </div>
                </div>

                {/* Suggested DM Box */}
                <div style={{
                  background: '#07090e',
                  border: '1px solid rgba(245, 158, 11, 0.2)',
                  borderRadius: '10px',
                  padding: '10px 12px',
                  fontSize: '0.8rem',
                  color: '#cbd5e1',
                  position: 'relative'
                }}>
                  <div style={{ fontSize: '0.7rem', color: '#FBBF24', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>
                    Script de Abordagem Sugerido (DM):
                  </div>
                  <p style={{ margin: '0 0 8px', lineHeight: 1.4, fontSize: '0.78rem', color: '#E2E8F0' }}>
                    "{p.suggestedDm}"
                  </p>
                  <button
                    onClick={() => handleCopyDm(p.id, p.suggestedDm)}
                    style={{
                      background: copiedId === p.id ? '#16a34a' : 'rgba(245, 158, 11, 0.15)',
                      border: '1px solid rgba(245, 158, 11, 0.3)',
                      color: copiedId === p.id ? '#FFF' : '#FDE68A',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    {copiedId === p.id ? <Check size={12} /> : <Copy size={12} />}
                    <span>{copiedId === p.id ? 'Copiado para o Direct!' : 'Copiar Texto para DM'}</span>
                  </button>
                </div>

                {/* Action Controls */}
                <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  
                  {/* Primary: Follow on Instagram */}
                  <a
                    href={`https://www.instagram.com/${p.username}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      if (p.status === 'novo') handleUpdateStatus(p.id, 'seguido');
                    }}
                    style={{
                      background: isFollowed 
                        ? 'rgba(34, 197, 94, 0.15)' 
                        : 'linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)',
                      border: isFollowed ? '1px solid #22c55e' : 'none',
                      color: isFollowed ? '#86efac' : '#FFFFFF',
                      padding: '9px',
                      borderRadius: '8px',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      textAlign: 'center',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: isFollowed ? 'none' : '0 4px 12px rgba(253, 29, 29, 0.25)'
                    }}
                  >
                    <UserPlus size={15} />
                    <span>{isFollowed ? 'Abrir Perfil no Instagram (Já Seguido)' : `Seguir @${p.username} no Instagram`}</span>
                    <ExternalLink size={13} />
                  </a>

                  {/* Status Toggle Row */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                    <button
                      onClick={() => handleUpdateStatus(p.id, p.status === 'dm_enviada' ? 'seguido' : 'dm_enviada')}
                      style={{
                        padding: '6px',
                        background: p.status === 'dm_enviada' ? 'rgba(96, 165, 250, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '6px',
                        color: p.status === 'dm_enviada' ? '#93c5fd' : '#cbd5e1',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      {p.status === 'dm_enviada' ? '✓ DM Enviada' : 'Marcar DM'}
                    </button>

                    <button
                      onClick={() => handleUpdateStatus(p.id, p.status === 'convertido' ? 'dm_enviada' : 'convertido')}
                      style={{
                        padding: '6px',
                        background: p.status === 'convertido' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '6px',
                        color: p.status === 'convertido' ? '#86efac' : '#cbd5e1',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      {p.status === 'convertido' ? '✓ Em Negociação' : 'Em Negociação'}
                    </button>
                  </div>

                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Adicionar Novo Lead ao Radar */}
      {isAddModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(8px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: '#0a0d14',
            border: '1.5px solid #FBBF24',
            borderRadius: '20px',
            maxWidth: '520px',
            width: '100%',
            overflow: 'hidden',
            boxShadow: '0 25px 60px rgba(0,0,0,0.9)'
          }}>
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: '#0d111a'
            }}>
              <span style={{ fontWeight: 800, color: '#FDE68A', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <UserPlus size={18} color="#FBBF24" />
                <span>Adicionar Perfil ao Radar de Prospecção</span>
              </span>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#FFFFFF', fontSize: '1.2rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddProspect} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                  Usuário no Instagram (@username) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: cliente_vix ou @cliente_vix"
                  value={newProspect.username}
                  onChange={e => setNewProspect({ ...newProspect, username: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: '#07090e',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    color: '#FFFFFF',
                    fontSize: '0.88rem'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                  Nome do Contato
                </label>
                <input
                  type="text"
                  placeholder="ex: Roberto Almeida"
                  value={newProspect.name}
                  onChange={e => setNewProspect({ ...newProspect, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: '#07090e',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    color: '#FFFFFF',
                    fontSize: '0.88rem'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                    Cidade / Unidade
                  </label>
                  <select
                    value={newProspect.city}
                    onChange={e => setNewProspect({ ...newProspect, city: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      background: '#07090e',
                      border: '1px solid rgba(245, 158, 11, 0.3)',
                      color: '#FFFFFF',
                      fontSize: '0.88rem'
                    }}
                  >
                    <option value="Vitória - ES">Vitória - ES</option>
                    <option value="Florianópolis - SC">Florianópolis - SC</option>
                    <option value="Nacional">Outra Região</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                    Segmento / Nicho
                  </label>
                  <select
                    value={newProspect.niche}
                    onChange={e => setNewProspect({ ...newProspect, niche: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      background: '#07090e',
                      border: '1px solid rgba(245, 158, 11, 0.3)',
                      color: '#FFFFFF',
                      fontSize: '0.88rem'
                    }}
                  >
                    <option value="Investidor de Leilões & Oportunidades">Investidor / Leilões</option>
                    <option value="Profissional Liberal / Luxo">Luxo & Importados</option>
                    <option value="Frotista / Motorista Executivo">Frotas & Transporte</option>
                    <option value="Motorista de Aplicativo / Econômico">Econômicos / App</option>
                    <option value="Produtor Rural / Picapes 4x4">Picapes & 4x4</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                  Veículo do Estoque de Maior Afinidade
                </label>
                <input
                  type="text"
                  placeholder="ex: Toyota Corolla 2023 ou Mercedes GLE"
                  value={newProspect.targetVehicle}
                  onChange={e => setNewProspect({ ...newProspect, targetVehicle: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: '#07090e',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    color: '#FFFFFF',
                    fontSize: '0.88rem'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  type="submit"
                  className="btn btn-gold"
                  style={{ flex: 1, padding: '10px', fontWeight: 800 }}
                >
                  Salvar Lead no Radar
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="btn btn-secondary"
                  style={{ padding: '10px 16px' }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
