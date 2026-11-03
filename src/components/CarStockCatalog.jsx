import React, { useState, useEffect } from 'react';
import { 
  Car, ShieldCheck, Sparkles, Filter, Search, Download, ExternalLink, 
  Play, Eye, CheckCircle2, ArrowRight, Flame, Award, Zap, DollarSign,
  TrendingDown, MessageCircle, FileText, Check, HelpCircle, ChevronRight, X
} from 'lucide-react';

export function CarStockCatalog({ onSelectCarForSimulation, onOpenChat }) {
  const [catalog, setCatalog] = useState([]);
  const [highlights, setHighlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('TODOS');
  const [priceRangeFilter, setPriceRangeFilter] = useState('TODOS');
  const [sortBy, setSortBy] = useState('PADRAO'); // 'PADRAO' | 'MENOR_PRECO' | 'MAIOR_PRECO' | 'MAIOR_ECONOMIA' | 'MAIS_NOVO'
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(8);
  
  // Modals
  const [previewStory, setPreviewStory] = useState(null);
  const [selectedDossier, setSelectedDossier] = useState(null);
  const [showReelModal, setShowReelModal] = useState(false);
  const [showHowItWorksModal, setShowHowItWorksModal] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState('carros'); // 'carros' | 'destaques' | 'como_funciona'

  useEffect(() => {
    // Fetch catalog
    fetch('/api/cars-catalog')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.catalog) {
          setCatalog(data.catalog);
        }
      })
      .catch(() => {
        fetch('/carros-estoque/catalogo.json')
          .then(r => r.json())
          .then(data => setCatalog(data))
          .catch(e => console.error(e));
      })
      .finally(() => setLoading(false));

    // Fetch highlights
    fetch('/api/highlights')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.highlights) {
          setHighlights(data.highlights);
        }
      })
      .catch(() => {
        fetch('/destaques/destaques.json')
          .then(r => r.json())
          .then(data => setHighlights(data))
          .catch(e => console.error(e));
      });
  }, []);

  // Filter & Sort Logic
  const filteredAndSortedCars = catalog.filter(car => {
    const matchesSearch = car.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          car.year.toString().includes(searchQuery) ||
                          car.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

    // Category Filter
    if (activeCategory === 'LUXO' && car.highlight !== 'PREMIUM & LUXO') return false;
    if (activeCategory === 'SUVS' && car.highlight !== 'SUVs & PICAPES') return false;
    if (activeCategory === 'SEDANS' && car.highlight !== 'SEDANS & HATCHS') return false;
    if (activeCategory === 'ATE_35K' && car.highlight !== 'ATÉ R$ 35 MIL') return false;
    if (activeCategory === 'ELETRICOS' && car.highlight !== 'ELÉTRICOS & NOVOS') return false;

    // Price Range Filter
    if (priceRangeFilter === 'ATE_35K' && car.pricePayoff > 35000) return false;
    if (priceRangeFilter === '35K_60K' && (car.pricePayoff <= 35000 || car.pricePayoff > 60000)) return false;
    if (priceRangeFilter === '60K_100K' && (car.pricePayoff <= 60000 || car.pricePayoff > 100000)) return false;
    if (priceRangeFilter === 'ACIMA_100K' && car.pricePayoff <= 100000) return false;

    return true;
  }).sort((a, b) => {
    if (sortBy === 'MENOR_PRECO') return a.pricePayoff - b.pricePayoff;
    if (sortBy === 'MAIOR_PRECO') return b.pricePayoff - a.pricePayoff;
    if (sortBy === 'MAIOR_ECONOMIA') return (b.savingsEstimated || 0) - (a.savingsEstimated || 0);
    if (sortBy === 'MAIS_NOVO') return parseInt(b.year) - parseInt(a.year);
    return a.id - b.id;
  });

  const displayedCars = filteredAndSortedCars.slice(0, visibleCount);

  const generateWhatsappUrl = (car) => {
    const text = encodeURIComponent(
      `Olá! Estive na Vitrine da Dom RockFeller e tenho interesse na futura quitação do veículo:\n\n` +
      `🚗 *Modelo:* ${car.name} (${car.year})\n` +
      `💰 *Valor da Futura Quitação:* ${car.formattedPrice}\n` +
      `📊 *FIPE Estimada:* ${car.fipeFormatted || 'Consultar'}\n\n` +
      `Gostaria de agendar atendimento para entender a cessão de direitos e receber a perícia do contrato.`
    );
    return `https://wa.me/5548920049681?text=${text}`;
  };

  return (
    <section id="estoque" style={{ padding: '80px 0', background: '#07090e', borderTop: '1px solid rgba(245, 158, 11, 0.15)' }}>
      <div className="container">
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '880px', margin: '0 auto 40px' }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '8px', 
            background: 'rgba(245, 158, 11, 0.12)', 
            border: '1px solid rgba(245, 158, 11, 0.35)', 
            padding: '6px 18px', 
            borderRadius: '30px', 
            marginBottom: '16px' 
          }}>
            <Sparkles size={16} color="#FBBF24" />
            <span style={{ color: '#FDE68A', fontSize: '0.85rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Vitrine VIP Oficial • Cessão de Direitos &amp; Futura Quitação
            </span>
          </div>

          <h2 style={{ fontSize: '2.6rem', fontWeight: 900, color: '#0F172A', marginBottom: '16px', lineHeight: 1.2 }}>
            Vitrine de Veículos com <span style={{ color: '#D97706' }}>Futura Quitação</span>
          </h2>
          <p style={{ color: '#475569', fontSize: '1.08rem', lineHeight: 1.6 }}>
            Veículos em processo de renegociação bancária. O comprador assume a posse e circulação do veículo com respaldo pericial forense enquanto nossa equipe jurídica negocia a quitação integral com até <strong>70% de desconto sobre o residual bancário</strong>.
          </p>

          {/* Quick Hub Badges */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '14px', 
            marginTop: '22px', 
            flexWrap: 'wrap' 
          }}>
            <a 
              href="https://www.instagram.com/p/DeQm5PMjkYS/" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)',
                color: '#FFFFFF',
                padding: '9px 18px',
                borderRadius: '8px',
                fontSize: '0.88rem',
                fontWeight: 700,
                textDecoration: 'none',
                boxShadow: '0 4px 15px rgba(253, 29, 29, 0.3)'
              }}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
              </svg>
              <span>Ver Estoque no Instagram Oficial</span>
              <ExternalLink size={14} />
            </a>

            <button
              onClick={() => setShowReelModal(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(245, 158, 11, 0.15)',
                border: '1px solid rgba(245, 158, 11, 0.4)',
                color: '#FDE68A',
                padding: '9px 18px',
                borderRadius: '8px',
                fontSize: '0.88rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <Play size={16} color="#FBBF24" />
              <span>Vídeo Reel das Máquinas (1080x1920)</span>
            </button>

            <button
              onClick={() => setShowHowItWorksModal(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(34, 197, 94, 0.15)',
                border: '1px solid rgba(34, 197, 94, 0.4)',
                color: '#86efac',
                padding: '9px 18px',
                borderRadius: '8px',
                fontSize: '0.88rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <ShieldCheck size={16} color="#4ade80" />
              <span>Como Funciona a Futura Quitação?</span>
            </button>
          </div>
        </div>

        {/* Sub-Tabs: Vitrine / Destaques */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '12px', 
          marginBottom: '32px' 
        }}>
          <button
            onClick={() => setActiveSubTab('carros')}
            style={{
              padding: '10px 24px',
              borderRadius: '10px',
              fontWeight: 800,
              fontSize: '0.92rem',
              cursor: 'pointer',
              border: activeSubTab === 'carros' ? '1.5px solid #D97706' : '1px solid #CBD5E1',
              background: activeSubTab === 'carros' ? 'rgba(217, 119, 6, 0.12)' : '#FFFFFF',
              color: activeSubTab === 'carros' ? '#B45309' : '#475569',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)'
            }}
          >
            <Car size={18} color={activeSubTab === 'carros' ? '#B45309' : '#475569'} />
            <span>Vitrine Completa (35 Veículos)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('destaques')}
            style={{
              padding: '10px 24px',
              borderRadius: '10px',
              fontWeight: 800,
              fontSize: '0.92rem',
              cursor: 'pointer',
              border: activeSubTab === 'destaques' ? '1.5px solid #D97706' : '1px solid #CBD5E1',
              background: activeSubTab === 'destaques' ? 'rgba(217, 119, 6, 0.12)' : '#FFFFFF',
              color: activeSubTab === 'destaques' ? '#B45309' : '#475569',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)'
            }}
          >
            <Award size={18} color={activeSubTab === 'destaques' ? '#B45309' : '#475569'} />
            <span>Capas de Destaques Instagram (6)</span>
          </button>
        </div>

        {/* TAB 1: VITRINE DE VEÍCULOS */}
        {activeSubTab === 'carros' && (
          <>
            {/* Filter Toolbar */}
            <div style={{
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.05)',
              borderRadius: '16px',
              padding: '20px 24px',
              marginBottom: '36px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              
              {/* Top Row: Categories */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {[
                    { id: 'TODOS', label: 'Todos (35)' },
                    { id: 'LUXO', label: '💎 Luxo & Importados (9)' },
                    { id: 'SUVS', label: '🚙 SUVs & Picapes (11)' },
                    { id: 'SEDANS', label: '🚗 Sedans & Hatchs (8)' },
                    { id: 'ATE_35K', label: '💰 Até R$ 35 Mil (7)' },
                    { id: 'ELETRICOS', label: '⚡ Elétricos (4)' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveCategory(tab.id)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '8px',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        border: activeCategory === tab.id ? '1.5px solid #D97706' : '1px solid #E2E8F0',
                        background: activeCategory === tab.id ? 'rgba(217, 119, 6, 0.12)' : '#F8FAFC',
                        color: activeCategory === tab.id ? '#B45309' : '#475569',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Search Bar */}
                <div style={{ position: 'relative', minWidth: '260px' }}>
                  <Search size={16} color="#64748B" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    placeholder="Buscar por nome, ano..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px 8px 36px',
                      borderRadius: '8px',
                      background: '#FFFFFF',
                      border: '1px solid #CBD5E1',
                      color: '#0F172A',
                      fontSize: '0.88rem',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              {/* Bottom Row: Price Filter & Sorter */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                flexWrap: 'wrap', 
                gap: '12px',
                paddingTop: '12px',
                borderTop: '1px solid #F1F5F9'
              }}>
                {/* Price Brackets */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>Faixa de Valor:</span>
                  {[
                    { id: 'TODOS', label: 'Qualquer Valor' },
                    { id: 'ATE_35K', label: 'Até R$ 35k' },
                    { id: '35K_60K', label: 'R$ 35k a 60k' },
                    { id: '60K_100K', label: 'R$ 60k a 100k' },
                    { id: 'ACIMA_100K', label: 'Acima de R$ 100k' }
                  ].map(p => (
                    <button
                      key={p.id}
                      onClick={() => setPriceRangeFilter(p.id)}
                      style={{
                        padding: '4px 12px',
                        borderRadius: '6px',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        border: priceRangeFilter === p.id ? '1px solid #D97706' : '1px solid #E2E8F0',
                        background: priceRangeFilter === p.id ? 'rgba(217, 119, 6, 0.12)' : '#F8FAFC',
                        color: priceRangeFilter === p.id ? '#B45309' : '#64748B'
                      }}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>

                {/* Sorter */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>Ordenar por:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    style={{
                      background: '#FFFFFF',
                      border: '1px solid #CBD5E1',
                      color: '#0F172A',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '0.82rem',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="PADRAO">Ordem Original</option>
                    <option value="MENOR_PRECO">Menor Valor de Quitação</option>
                    <option value="MAIOR_PRECO">Maior Valor de Quitação</option>
                    <option value="MAIOR_ECONOMIA">Maior Desconto / Economia</option>
                    <option value="MAIS_NOVO">Ano Mais Novo</option>
                  </select>
                </div>
              </div>

            </div>

            {/* Showcase Cars Grid */}
            {loading ? (
              <div style={{ textAlign: 'center', padding: '60px 0', color: '#94A3B8' }}>
                Carregando vitrine de veículos...
              </div>
            ) : filteredAndSortedCars.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 0', color: '#94A3B8' }}>
                Nenhum veículo encontrado para os filtros selecionados.
              </div>
            ) : (
              <>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))',
                  gap: '22px',
                  width: '100%'
                }}>
                {displayedCars.map(car => (
                  <div
                    key={car.id}
                    style={{
                      background: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      borderRadius: '18px',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                      position: 'relative',
                      boxShadow: '0 4px 18px -2px rgba(15, 23, 42, 0.06)'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'translateY(-5px)';
                      e.currentTarget.style.boxShadow = '0 16px 32px -4px rgba(15, 23, 42, 0.1), 0 0 1px 1px rgba(217, 119, 6, 0.3)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 18px -2px rgba(15, 23, 42, 0.06)';
                    }}
                  >
                    {/* Car Image with Badge */}
                    <div style={{ position: 'relative', width: '100%', height: '230px', background: '#F1F5F9' }}>
                      <img 
                        src={car.imageClean} 
                        alt={car.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        loading="lazy"
                      />
                      
                      {/* Year Badge */}
                      <span style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        background: 'rgba(15, 23, 42, 0.85)',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        color: '#FFFFFF',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        padding: '4px 10px',
                        borderRadius: '6px'
                      }}>
                        ANO {car.year}
                      </span>

                      {/* Highlight Tag */}
                      <span style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        background: '#D97706',
                        color: '#FFFFFF',
                        fontSize: '0.72rem',
                        fontWeight: 900,
                        padding: '4px 10px',
                        borderRadius: '6px',
                        letterSpacing: '0.04em',
                        boxShadow: '0 2px 8px rgba(217, 119, 6, 0.4)'
                      }}>
                        {car.highlight}
                      </span>

                      {/* Discount Pill Floating */}
                      {car.discountPct && (
                        <div style={{
                          position: 'absolute',
                          bottom: '12px',
                          left: '12px',
                          background: '#059669',
                          color: '#FFFFFF',
                          fontWeight: 900,
                          fontSize: '0.75rem',
                          padding: '4px 10px',
                          borderRadius: '20px',
                          boxShadow: '0 2px 8px rgba(5, 150, 105, 0.35)'
                        }}>
                          🔥 {car.discountPct}% OFF NA QUITAÇÃO
                        </div>
                      )}
                    </div>

                    {/* Card Body */}
                    <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      
                      <div style={{ fontSize: '0.8rem', color: '#D97706', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>
                        {car.category}
                      </div>

                      <h3 style={{ fontSize: '1.28rem', fontWeight: 900, color: '#0F172A', marginBottom: '14px', lineHeight: 1.3 }}>
                        {car.name}
                      </h3>

                      {/* COMPARISON BOX: FIPE VS QUITAÇÃO */}
                      <div style={{
                        background: '#F8FAFC',
                        border: '1px solid #E2E8F0',
                        borderRadius: '14px',
                        padding: '14px 16px',
                        marginBottom: '16px'
                      }}>
                        {/* FIPE vs Payoff */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '8px' }}>
                          <div>
                            <span style={{ fontSize: '0.72rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 600 }}>Tabela FIPE: </span>
                            <span style={{ fontSize: '0.88rem', color: '#94A3B8', textDecoration: 'line-through', fontWeight: 700 }}>
                              {car.fipeFormatted || 'R$ ' + (car.pricePayoff * 2.2).toLocaleString('pt-BR')}
                            </span>
                          </div>
                          
                          <span style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 800 }}>
                            Economia: {car.savingsFormatted || 'R$ ' + (car.pricePayoff * 1.2).toLocaleString('pt-BR')}
                          </span>
                        </div>

                        {/* Payoff Value Big */}
                        <div>
                          <div style={{ fontSize: '0.72rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.05em' }}>
                            Futura Quitação Estimada
                          </div>
                          <div style={{ fontSize: '1.95rem', fontWeight: 900, color: '#D97706', lineHeight: 1.1 }}>
                            {car.formattedPrice}
                          </div>
                        </div>

                        <div style={{ fontSize: '0.7rem', color: '#64748B', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <ShieldCheck size={12} color="#059669" />
                          <span>Contrato sob auditoria pericial judicial</span>
                        </div>
                      </div>

                      {/* CTA Buttons */}
                      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        
                        {/* WhatsApp Direct Interest */}
                        <a
                          href={generateWhatsappUrl(car)}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            background: 'linear-gradient(135deg, #10B981, #059669)',
                            color: '#FFFFFF',
                            padding: '10px',
                            fontWeight: 800,
                            fontSize: '0.88rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            borderRadius: '8px',
                            textDecoration: 'none',
                            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)'
                          }}
                        >
                          <MessageCircle size={17} />
                          <span>Tenho Interesse neste Veículo</span>
                        </a>

                        {/* Secondary Actions */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                          
                          <button
                            onClick={() => setSelectedDossier(car)}
                            style={{
                              padding: '8px',
                              background: '#F1F5F9',
                              border: '1px solid #CBD5E1',
                              borderRadius: '8px',
                              color: '#1E293B',
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px'
                            }}
                          >
                            <FileText size={13} color="#64748B" />
                            <span>Ver Dossiê</span>
                          </button>

                          <button
                            onClick={() => {
                              if (onSelectCarForSimulation) {
                                onSelectCarForSimulation(car);
                              } else {
                                const el = document.getElementById('simulador');
                                if (el) el.scrollIntoView({ behavior: 'smooth' });
                              }
                            }}
                            style={{
                              padding: '8px',
                              background: 'rgba(217, 119, 6, 0.08)',
                              border: '1px solid rgba(217, 119, 6, 0.3)',
                              borderRadius: '8px',
                              color: '#B45309',
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px'
                            }}
                          >
                            <span>Simulador</span>
                            <ArrowRight size={13} />
                          </button>

                        </div>

                        {/* Story View & Download Pill */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px', fontSize: '0.75rem' }}>
                          <button
                            onClick={() => setPreviewStory(car)}
                            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                          >
                            <Eye size={12} color="#FBBF24" />
                            <span>Ver Story (1080x1920)</span>
                          </button>

                          <a
                            href={car.storyImage || `/stories/story_carro_${String(car.id).padStart(2, '0')}.jpg`}
                            download={`story_${car.name.replace(/\s+/g, '_')}.jpg`}
                            style={{ color: '#FBBF24', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}
                          >
                            <Download size={12} />
                            <span>Baixar Arte</span>
                          </a>
                        </div>

                      </div>

                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons to View More or Collapse */}
              {filteredAndSortedCars.length > visibleCount && (
                <div style={{ textAlign: 'center', marginTop: '36px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                  <button
                    onClick={() => setVisibleCount(prev => prev + 8)}
                    className="btn btn-gold btn-lg"
                    style={{ minWidth: 'min(100%, 280px)', fontWeight: 800, padding: '14px 28px' }}
                  >
                    <span>Ver Mais Veículos (+{filteredAndSortedCars.length - visibleCount} disponíveis)</span>
                    <ChevronRight size={18} />
                  </button>
                  <div style={{ fontSize: '0.82rem', color: '#94A3B8' }}>
                    Exibindo {displayedCars.length} de {filteredAndSortedCars.length} veículos no estoque
                  </div>
                </div>
              )}

              {visibleCount >= filteredAndSortedCars.length && filteredAndSortedCars.length > 8 && (
                <div style={{ textAlign: 'center', marginTop: '28px' }}>
                  <button
                    onClick={() => {
                      setVisibleCount(8);
                      const el = document.getElementById('estoque');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="btn btn-secondary btn-sm"
                    style={{ color: '#94A3B8', borderColor: 'rgba(255,255,255,0.1)' }}
                  >
                    <span>Mostrar Menos (Recolher para 8 Veículos)</span>
                  </button>
                </div>
              )}
            </>
          )}
          </>
        )}

        {/* TAB 2: HIGHLIGHTS (DESTAQUES) COVERS */}
        {activeSubTab === 'destaques' && (
          <div>
            <div style={{
              background: '#0d111a',
              border: '1px solid rgba(245, 158, 11, 0.2)',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '32px',
              textAlign: 'center'
            }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '8px' }}>
                Capas Oficiais dos 6 Destaques do Instagram (@domrockfellervix)
              </h3>
              <p style={{ color: '#94A3B8', fontSize: '0.95rem', maxWidth: '720px', margin: '0 auto' }}>
                Criadas sob medida na identidade visual Preto Ônix &amp; Ouro Imperial da Dom RockFeller. Disponíveis em formato circular 1080x1080 (para capa) e 1080x1920 (para postar no Story).
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '24px'
            }}>
              {highlights.map(h => (
                <div
                  key={h.id}
                  style={{
                    background: '#0c0f17',
                    border: '1px solid rgba(245, 158, 11, 0.25)',
                    borderRadius: '16px',
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center'
                  }}
                >
                  <div style={{
                    width: '180px',
                    height: '180px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: '3px solid #FBBF24',
                    boxShadow: '0 0 20px rgba(245, 158, 11, 0.3)',
                    marginBottom: '18px'
                  }}>
                    <img 
                      src={`/destaques/destaque_${h.id}.jpg`} 
                      alt={h.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>

                  <h4 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#FFFFFF', marginBottom: '4px' }}>
                    {h.title} {h.subtitle}
                  </h4>
                  <div style={{ fontSize: '0.8rem', color: '#FBBF24', fontWeight: 700, marginBottom: '8px' }}>
                    {h.carsCount > 0 ? `${h.carsCount} VEÍCULOS NO ESTOQUE` : 'DESTAQUE INSTITUCIONAL'}
                  </div>
                  <p style={{ fontSize: '0.85rem', color: '#94A3B8', marginBottom: '18px', minHeight: '40px' }}>
                    {h.carsList}
                  </p>

                  <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                    <a
                      href={`/destaques/destaque_${h.id}.jpg`}
                      download={`capa_destaque_${h.id}.jpg`}
                      className="btn btn-sm btn-gold"
                      style={{ flex: 1, padding: '9px', fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                    >
                      <Download size={14} />
                      <span>Capa 1:1</span>
                    </a>
                    <a
                      href={`/destaques/story_destaque_${h.id}.jpg`}
                      download={`story_destaque_${h.id}.jpg`}
                      style={{
                        flex: 1,
                        padding: '9px',
                        background: 'rgba(255, 255, 255, 0.08)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: '6px',
                        color: '#FFFFFF',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                      <Download size={14} />
                      <span>Story 9:16</span>
                    </a>
                  </div>

                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* MODAL 1: DOSSIÊ DO VEÍCULO */}
      {selectedDossier && (
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
            border: '2px solid #FBBF24',
            borderRadius: '24px',
            maxWidth: '640px',
            width: '100%',
            overflow: 'hidden',
            boxShadow: '0 25px 60px rgba(0,0,0,0.9)',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '18px 24px',
              borderBottom: '1px solid rgba(245, 158, 11, 0.2)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: '#0d111a'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ShieldCheck size={20} color="#FBBF24" />
                <span style={{ fontWeight: 900, color: '#FFFFFF', fontSize: '1.1rem' }}>
                  Dossiê Pericial • {selectedDossier.name}
                </span>
              </div>
              <button 
                onClick={() => setSelectedDossier(null)}
                style={{ background: 'none', border: 'none', color: '#94A3B8', fontSize: '1.4rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
              {/* Photo & Summary */}
              <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
                <img 
                  src={selectedDossier.imageClean} 
                  alt={selectedDossier.name}
                  style={{ width: '220px', height: '150px', objectFit: 'cover', borderRadius: '12px', border: '1px solid rgba(245, 158, 11, 0.3)' }}
                />
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <div style={{ fontSize: '0.8rem', color: '#FBBF24', fontWeight: 700 }}>{selectedDossier.category}</div>
                  <h4 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#FFFFFF', margin: '4px 0 8px' }}>{selectedDossier.name}</h4>
                  <div style={{ fontSize: '0.85rem', color: '#94A3B8' }}>Ano de Fabricação: <strong style={{ color: '#FFFFFF' }}>{selectedDossier.year}</strong></div>
                  <div style={{ fontSize: '0.85rem', color: '#94A3B8' }}>Status Jurídico: <strong style={{ color: '#4ade80' }}>{selectedDossier.legalStatus || 'Alienação Fiduciária • Em Negociação'}</strong></div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div style={{
                background: 'rgba(245, 158, 11, 0.08)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                borderRadius: '16px',
                padding: '18px',
                marginBottom: '20px'
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', textAlign: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: '#94A3B8', textTransform: 'uppercase' }}>FIPE Mercado</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#cbd5e1', textDecoration: 'line-through' }}>
                      {selectedDossier.fipeFormatted || 'R$ ' + (selectedDossier.pricePayoff * 2.2).toLocaleString('pt-BR')}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: '#FBBF24', textTransform: 'uppercase', fontWeight: 800 }}>Futura Quitação</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#FDE68A' }}>
                      {selectedDossier.formattedPrice}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: '#4ade80', textTransform: 'uppercase', fontWeight: 800 }}>Sua Economia</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#4ade80' }}>
                      {selectedDossier.savingsFormatted || 'R$ ' + (selectedDossier.pricePayoff * 1.2).toLocaleString('pt-BR')}
                    </div>
                  </div>
                </div>
              </div>

              {/* Legal Guarantees */}
              <div style={{ marginBottom: '20px' }}>
                <h5 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '10px' }}>
                  Garantias da Assessoria Dom RockFeller:
                </h5>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    'Contrato formal de Cessão de Direitos com base no Art. 286 do Código Civil;',
                    'Laudo pericial financeiro prévio atestando anatocismo e abusividades;',
                    'Blindagem jurídica preventiva contra busca e apreensão (Decreto-Lei 911/69);',
                    'Acompanhamento processual presencial em Vitória (ES) e Florianópolis (SC);',
                    'Quitação definitiva averbada junto ao Detran ao término da liquidação bancária.'
                  ].map((text, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.85rem', color: '#CBD5E1' }}>
                      <CheckCircle2 size={16} color="#22c55e" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '10px' }}>
                <a
                  href={generateWhatsappUrl(selectedDossier)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-gold"
                  style={{ flex: 1, padding: '12px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', textDecoration: 'none' }}
                >
                  <MessageCircle size={18} />
                  <span>Falar com Perito no WhatsApp</span>
                </a>
                <button
                  onClick={() => {
                    const car = selectedDossier;
                    setSelectedDossier(null);
                    if (onSelectCarForSimulation) {
                      onSelectCarForSimulation(car);
                    } else {
                      const el = document.getElementById('simulador');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="btn btn-secondary"
                  style={{ padding: '12px 20px' }}
                >
                  Simular
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: STORY PREVIEW (1080x1920) */}
      {previewStory && (
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
            maxWidth: '460px',
            width: '100%',
            overflow: 'hidden',
            boxShadow: '0 20px 50px rgba(0,0,0,0.8)'
          }}>
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ fontWeight: 800, color: '#FDE68A', fontSize: '0.95rem' }}>
                Story Oficial (1080x1920) • {previewStory.name}
              </span>
              <button 
                onClick={() => setPreviewStory(null)}
                style={{ background: 'none', border: 'none', color: '#FFFFFF', fontSize: '1.2rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div style={{ padding: '16px', textAlign: 'center', background: '#050609' }}>
              <img 
                src={`/stories/story_carro_${String(previewStory.id).padStart(2, '0')}.jpg`} 
                alt={previewStory.name}
                style={{
                  width: '100%',
                  maxHeight: '65vh',
                  objectFit: 'contain',
                  borderRadius: '12px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
                }}
              />
            </div>

            <div style={{ padding: '16px 20px', display: 'flex', gap: '12px' }}>
              <a
                href={`/stories/story_carro_${String(previewStory.id).padStart(2, '0')}.jpg`}
                download={`story_carro_${previewStory.id}.jpg`}
                className="btn btn-gold"
                style={{ flex: 1, padding: '10px', textAlign: 'center', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <Download size={16} />
                <span>Baixar Story em Alta Definição</span>
              </a>
              <button
                onClick={() => setPreviewStory(null)}
                style={{
                  padding: '10px 18px',
                  background: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#CBD5E1',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: COMO FUNCIONA A FUTURA QUITAÇÃO */}
      {showHowItWorksModal && (
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
            border: '2px solid #22c55e',
            borderRadius: '24px',
            maxWidth: '620px',
            width: '100%',
            overflow: 'hidden',
            boxShadow: '0 25px 60px rgba(0,0,0,0.9)'
          }}>
            <div style={{
              padding: '18px 24px',
              borderBottom: '1px solid rgba(34, 197, 94, 0.2)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: '#0d1319'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ShieldCheck size={22} color="#4ade80" />
                <span style={{ fontWeight: 900, color: '#FFFFFF', fontSize: '1.15rem' }}>
                  Entenda a Compra com Futura Quitação
                </span>
              </div>
              <button 
                onClick={() => setShowHowItWorksModal(false)}
                style={{ background: 'none', border: 'none', color: '#94A3B8', fontSize: '1.4rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '14px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#FBBF24', color: '#000', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>1</div>
                <div>
                  <h5 style={{ color: '#FFFFFF', fontSize: '1rem', fontWeight: 800, marginBottom: '4px' }}>Cessão de Direitos Contratuais</h5>
                  <p style={{ color: '#94A3B8', fontSize: '0.88rem', lineHeight: 1.5 }}>
                    O adquirente assume a posse direta e fruição do veículo mediante contrato formal de cessão, amparado pelos artigos 286 e 421 do Código Civil Brasileiro.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '14px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#FBBF24', color: '#000', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>2</div>
                <div>
                  <h5 style={{ color: '#FFFFFF', fontSize: '1rem', fontWeight: 800, marginBottom: '4px' }}>Auditoria Forense &amp; Blindagem</h5>
                  <p style={{ color: '#94A3B8', fontSize: '0.88rem', lineHeight: 1.5 }}>
                    Nossa banca pericial calcula os juros abusivos e tarifas indevidas, instaurando medidas de proteção contra busca e apreensão perante o Decreto-Lei 911/69.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '14px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#22c55e', color: '#000', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>3</div>
                <div>
                  <h5 style={{ color: '#FFFFFF', fontSize: '1rem', fontWeight: 800, marginBottom: '4px' }}>Quitação com até 70% de Desconto</h5>
                  <p style={{ color: '#94A3B8', fontSize: '0.88rem', lineHeight: 1.5 }}>
                    Negociação direta com a mesa de crédito da instituição financeira para liquidação definitiva pelo saldo incontroverso com baixa do gravame no Detran.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowHowItWorksModal(false)}
                className="btn btn-gold"
                style={{ marginTop: '10px', width: '100%', padding: '12px', fontWeight: 800 }}
              >
                Entendi, Quero Ver os Carros
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: REEL VIDEO */}
      {showReelModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.88)',
          backdropFilter: 'blur(10px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: '#090c12',
            border: '2px solid #FBBF24',
            borderRadius: '24px',
            maxWidth: '440px',
            width: '100%',
            overflow: 'hidden',
            boxShadow: '0 25px 60px rgba(0,0,0,0.9)'
          }}>
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ fontWeight: 800, color: '#FDE68A', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Play size={16} color="#FBBF24" />
                <span>Reel Oficial do Estoque (1080x1920)</span>
              </span>
              <button 
                onClick={() => setShowReelModal(false)}
                style={{ background: 'none', border: 'none', color: '#FFFFFF', fontSize: '1.2rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div style={{ padding: '16px', background: '#000000', textAlign: 'center' }}>
              <video 
                src="/reels/reel_estoque_domrockfeller.mp4" 
                controls 
                autoPlay 
                style={{
                  width: '100%',
                  maxHeight: '65vh',
                  borderRadius: '12px'
                }}
              />
            </div>

            <div style={{ padding: '16px 20px', display: 'flex', gap: '12px' }}>
              <a
                href="/reels/reel_estoque_domrockfeller.mp4"
                download="reel_estoque_domrockfeller.mp4"
                className="btn btn-gold"
                style={{ flex: 1, padding: '11px', textAlign: 'center', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <Download size={16} />
                <span>Baixar Vídeo do Reel (.MP4)</span>
              </a>
              <button
                onClick={() => setShowReelModal(false)}
                style={{
                  padding: '11px 18px',
                  background: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#CBD5E1',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
