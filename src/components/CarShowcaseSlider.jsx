import React, { useState, useEffect } from 'react';
import { 
  Car, ChevronLeft, ChevronRight, Sparkles, ShieldCheck, 
  ArrowRight, Phone, MessageSquare, Gauge, CheckCircle2, TrendingDown
} from 'lucide-react';

const FALLBACK_CARS = [
  {
    id: 1,
    name: "Ford Ka Hatch SE 1.0",
    versao: "SE 1.0 Flex Manual",
    year: 2020,
    km: "112 mil km",
    cambio: "Manual",
    fipeFormatted: "R$ 49.800,00",
    formattedPrice: "R$ 22.000,00",
    formattedSavings: "R$ 27.800,00",
    discountPercent: 56,
    badge: "Oportunidade de Entrada",
    image: "/carros-estoque/carro_01_fiat_mobi_like.jpg"
  },
  {
    id: 2,
    name: "Hyundai HB20 Sense 1.0",
    versao: "Sense 1.0 12V Flex Manual",
    year: 2020,
    km: "112 mil km",
    cambio: "Manual",
    fipeFormatted: "R$ 55.219,00",
    formattedPrice: "R$ 25.000,00",
    formattedSavings: "R$ 30.219,00",
    discountPercent: 55,
    badge: "Excelente Liquidez",
    image: "/carros-estoque/carro_02_hyundai_hb20_hatch_sense.jpg"
  },
  {
    id: 3,
    name: "VW Fox Comfortline 1.6",
    versao: "Comfortline 1.6 MSI Flex",
    year: 2016,
    km: "112 mil km",
    cambio: "Manual",
    fipeFormatted: "R$ 47.595,00",
    formattedPrice: "R$ 22.000,00",
    formattedSavings: "R$ 25.595,00",
    discountPercent: 54,
    badge: "Custo-Benefício",
    image: "/carros-estoque/carro_03_mercedes_benz_gla_200_advance.jpg"
  },
  {
    id: 4,
    name: "Chevrolet Cruze Sport6 LT",
    versao: "Sport6 LT 1.8 16V Flex Aut",
    year: 2015,
    km: "118 mil km",
    cambio: "Automático",
    fipeFormatted: "R$ 61.067,00",
    formattedPrice: "R$ 30.000,00",
    formattedSavings: "R$ 31.067,00",
    discountPercent: 51,
    badge: "Conforto & Porte",
    image: "/carros-estoque/carro_04_toyota_corolla_xei_2_0.jpg"
  },
  {
    id: 5,
    name: "Chevrolet Onix Hatch 1.0",
    versao: "1.0 Flex Manual",
    year: 2024,
    km: "78 mil km",
    cambio: "Manual",
    fipeFormatted: "R$ 68.810,00",
    formattedPrice: "R$ 32.000,00",
    formattedSavings: "R$ 36.810,00",
    discountPercent: 53,
    badge: "Seminovo 2024",
    image: "/carros-estoque/carro_05_mercedes_benz_a200_turbo.jpg"
  },
  {
    id: 6,
    name: "Jeep Compass Longitude",
    versao: "Longitude 2.0 Flex Aut",
    year: 2021,
    km: "64 mil km",
    cambio: "Automático",
    fipeFormatted: "R$ 118.900,00",
    formattedPrice: "R$ 48.000,00",
    formattedSavings: "R$ 70.900,00",
    discountPercent: 60,
    badge: "SUV de Prestígio",
    image: "/carros-estoque/carro_04_toyota_corolla_xei_2_0.jpg"
  }
];

export function CarShowcaseSlider({ onSelectCarForSimulation, onOpenChat }) {
  const [cars, setCars] = useState(FALLBACK_CARS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(3);

  // Responsive cards count: 1 on mobile, 2 on tablet, max 3 on desktop
  useEffect(() => {
    const updateCardsPerView = () => {
      if (window.innerWidth < 768) {
        setCardsPerView(1);
      } else if (window.innerWidth < 1080) {
        setCardsPerView(2);
      } else {
        setCardsPerView(3);
      }
    };

    updateCardsPerView();
    window.addEventListener('resize', updateCardsPerView);
    return () => window.removeEventListener('resize', updateCardsPerView);
  }, []);

  // Fetch full catalog if available
  useEffect(() => {
    fetch('/carros-estoque/catalogo.json')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const formatted = data.map(car => ({
            id: car.id,
            name: car.name || car.nome,
            versao: car.versao || car.categoria,
            year: car.year || car.ano,
            km: car.km || "Revisado",
            cambio: car.cambio || "Manual",
            fipeFormatted: car.fipeFormatted || car.fipeFormatado || "Consulte",
            formattedPrice: car.formattedPrice || car.valorQuitacaoFormatado || "Sob Consulta",
            formattedSavings: car.formattedSavings || `R$ ${((car.fipe || 50000) - (car.pricePayoff || 22000)).toLocaleString('pt-BR')},00`,
            discountPercent: Math.round((((car.fipe || 50000) - (car.pricePayoff || 22000)) / (car.fipe || 50000)) * 100) || 55,
            badge: car.badge || "Oportunidade",
            image: car.image || car.imageClean || `/carros-estoque/${car.arquivo}`
          }));
          setCars(formatted);
        }
      })
      .catch(() => {
        // Keep fallback
      });
  }, []);

  const maxIndex = Math.max(0, cars.length - cardsPerView);

  const handlePrev = () => {
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : maxIndex));
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev < maxIndex ? prev + 1 : 0));
  };

  // Visible items slice for maximum 3 cars
  const visibleCars = cars.slice(currentIndex, currentIndex + cardsPerView);

  return (
    <section id="vitrine" style={{ padding: '70px 0 80px', position: 'relative', background: '#FFFFFF' }}>
      <div className="container">

        {/* Section Header - Centered */}
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 45px' }}>
          <span className="badge badge-gold" style={{ marginBottom: '14px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Car size={15} /> Vitrine Selecionada
          </span>
          <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.7rem)', marginBottom: '14px', color: '#0A2540', fontWeight: 900, letterSpacing: '-0.025em' }}>
            Veículos Disponíveis para <span className="text-gradient-gold">Venda &amp; Quitação Futura</span>
          </h2>
          <p style={{ fontSize: '1.02rem', color: '#475569', lineHeight: 1.65 }}>
            Veículos selecionados com oportunidade de cessão de direitos e quitação judicial com expressivo deságio contratual.
          </p>
        </div>

        {/* Slider Controls Bar: Navigation Arrows & Counter */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          padding: '0 4px'
        }}>
          <div style={{ fontSize: '0.88rem', color: '#64748B', fontWeight: 600 }}>
            Mostrando <strong style={{ color: '#0A2540' }}>{currentIndex + 1}</strong> a <strong style={{ color: '#0A2540' }}>{Math.min(currentIndex + cardsPerView, cars.length)}</strong> de <strong style={{ color: '#0A2540' }}>{cars.length}</strong> veículos
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={handlePrev}
              aria-label="Veículo Anterior"
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: '#FFFFFF',
                border: '1.5px solid #CBD5E1',
                color: '#0A2540',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(10, 37, 64, 0.08)',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#C59B27';
                e.currentTarget.style.color = '#C59B27';
                e.currentTarget.style.transform = 'scale(1.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#CBD5E1';
                e.currentTarget.style.color = '#0A2540';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <ChevronLeft size={20} />
            </button>

            <button
              onClick={handleNext}
              aria-label="Próximo Veículo"
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #0A2540 0%, #0F3256 100%)',
                border: '1.5px solid #C59B27',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(10, 37, 64, 0.25)',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.08)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(197, 155, 39, 0.35)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(10, 37, 64, 0.25)';
              }}
            >
              <ChevronRight size={20} color="#C59B27" />
            </button>
          </div>
        </div>

        {/* 3 Cars Showcase Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${cardsPerView}, 1fr)`,
          gap: '24px',
          alignItems: 'stretch'
        }}>
          {visibleCars.map((car) => (
            <div
              key={car.id}
              className="glass-card"
              style={{
                borderRadius: '20px',
                overflow: 'hidden',
                background: '#FFFFFF',
                border: '1.5px solid #E2E8F0',
                boxShadow: '0 6px 20px -2px rgba(10, 37, 64, 0.06)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              {/* Vehicle Image Container */}
              <div style={{
                position: 'relative',
                width: '100%',
                height: '210px',
                background: '#F1F5F9',
                overflow: 'hidden'
              }}>
                <img
                  src={car.image}
                  alt={car.name}
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.4s ease'
                  }}
                  onError={(e) => {
                    // Fallback to placeholder SVG if image missing
                    e.currentTarget.src = "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80";
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                />

                {/* Top Badge: Disponível para Venda */}
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  background: 'rgba(10, 37, 64, 0.92)',
                  color: '#FFFFFF',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  padding: '5px 11px',
                  borderRadius: '20px',
                  border: '1px solid rgba(197, 155, 39, 0.5)',
                  backdropFilter: 'blur(8px)',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase'
                }}>
                  {car.badge || "Venda & Quitação"}
                </div>

                {/* Discount Tag */}
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                  color: '#FFFFFF',
                  fontSize: '0.75rem',
                  fontWeight: 900,
                  padding: '5px 10px',
                  borderRadius: '8px',
                  boxShadow: '0 4px 10px rgba(5, 150, 105, 0.4)'
                }}>
                  ~{car.discountPercent}% OFF
                </div>
              </div>

              {/* Vehicle Body Info */}
              <div style={{ padding: '22px 20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0A2540', marginBottom: '4px', lineHeight: 1.25 }}>
                    {car.name}
                  </h3>
                  <div style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '14px' }}>
                    {car.year} &bull; {car.versao}
                  </div>

                  {/* Specs Pill Row */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    fontSize: '0.78rem',
                    color: '#475569',
                    padding: '8px 12px',
                    background: '#F8FAFC',
                    borderRadius: '10px',
                    marginBottom: '16px',
                    border: '1px solid #E2E8F0'
                  }}>
                    <span><strong>Câmbio:</strong> {car.cambio}</span>
                    <span>&bull;</span>
                    <span><strong>Km:</strong> {car.km}</span>
                  </div>

                  {/* Pricing Breakdown Box */}
                  <div style={{
                    background: 'rgba(10, 37, 64, 0.03)',
                    border: '1px solid rgba(197, 155, 39, 0.35)',
                    borderRadius: '14px',
                    padding: '14px',
                    marginBottom: '18px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: '#64748B', marginBottom: '4px' }}>
                      <span>Tabela FIPE Referência:</span>
                      <span style={{ textDecoration: 'line-through', fontWeight: 600 }}>{car.fipeFormatted}</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '4px' }}>
                      <span style={{ fontSize: '0.80rem', fontWeight: 800, color: '#0A2540', textTransform: 'uppercase' }}>
                        Quitação Estimada:
                      </span>
                      <span style={{ fontSize: '1.35rem', fontWeight: 900, color: '#047857' }}>
                        {car.formattedPrice}
                      </span>
                    </div>

                    <div style={{
                      marginTop: '6px',
                      paddingTop: '6px',
                      borderTop: '1px dashed #CBD5E1',
                      fontSize: '0.78rem',
                      color: '#876214',
                      fontWeight: 700,
                      textAlign: 'right'
                    }}>
                      Economia de até {car.formattedSavings}
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <button
                    onClick={() => {
                      if (onSelectCarForSimulation) {
                        onSelectCarForSimulation(car);
                      } else {
                        const el = document.getElementById('simulador');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="btn btn-gold"
                    style={{ width: '100%', padding: '11px', fontSize: '0.90rem' }}
                  >
                    <Sparkles size={16} />
                    <span>Simular Quitação Deste Carro</span>
                  </button>

                  <a
                    href={`https://api.whatsapp.com/send?phone=5548920049681&text=Ol%C3%A1!%20Gostaria%20de%20informa%C3%A7%C3%B5es%20sobre%20o%20ve%C3%ADculo%20${encodeURIComponent(car.name)}%20(${car.year})%20anunciado%20para%20venda%20e%20futura%20quita%C3%A7%C3%A3o.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary"
                    style={{ width: '100%', padding: '10px', fontSize: '0.86rem', color: '#0A2540' }}
                  >
                    <MessageSquare size={15} color="#059669" />
                    <span>Tenho Interesse via WhatsApp</span>
                  </a>
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* Carousel Pagination Dots */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '30px' }}>
          {Array.from({ length: Math.ceil(cars.length / cardsPerView) }).map((_, pageIdx) => {
            const isActive = Math.floor(currentIndex / cardsPerView) === pageIdx;
            return (
              <button
                key={pageIdx}
                onClick={() => setCurrentIndex(pageIdx * cardsPerView)}
                aria-label={`Ir para slide ${pageIdx + 1}`}
                style={{
                  width: isActive ? '28px' : '9px',
                  height: '9px',
                  borderRadius: '6px',
                  background: isActive ? '#C59B27' : '#CBD5E1',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease'
                }}
              />
            );
          })}
        </div>

      </div>
    </section>
  );
}
