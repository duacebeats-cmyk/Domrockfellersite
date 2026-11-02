import React from 'react';
import { MapPin, Phone, MessageSquare, Clock, Building2, Coffee, ShieldCheck, ExternalLink, Mail, Sparkles } from 'lucide-react';

export function Offices({ onOpenSimulator }) {
  const offices = [
    {
      city: 'Florianópolis',
      state: 'Santa Catarina (SC)',
      statusBadge: 'Unidade Oficial Ativa',
      isComingSoon: false,
      building: 'Edifício Jerônimo Coelho',
      address: 'Rua Jerônimo Coelho, 280 - Sala 1103',
      neighborhood: 'Centro, Florianópolis - SC',
      cep: 'CEP: 88010-030',
      email: 'contato@domrockfeller.tech',
      reference: 'Coração comercial e financeiro de Florianópolis',
      phone: '+55 48 92004-9681',
      whatsapp: '5548920049681',
      whatsappFormatted: '+55 48 92004-9681',
      hours: 'Segunda a Sexta: 08:30 às 18:00',
      tagColor: '#3B82F6',
      mapsUrl: 'https://maps.google.com/?q=Rua+Geronimo+Coelho,+280+-+Centro,+Florian%C3%B3polis+-+SC'
    },
    {
      city: 'Vitória',
      state: 'Espírito Santo (ES)',
      statusBadge: 'Inauguração em breve',
      isComingSoon: true,
      building: 'Centro Empresarial Vitória',
      address: 'Av. Américo Buaiz, 501 • Enseada do Suá',
      neighborhood: 'Vitória - ES',
      cep: 'CEP: 29050-911',
      email: 'contato@domrockfeller.tech',
      reference: 'Unidade física em fase final de obras. Atendimento digital e pericial 100% ativo.',
      phone: '+55 48 92004-9681',
      whatsapp: '5548920049681',
      whatsappFormatted: '+55 48 92004-9681',
      hours: 'Atendimento Online: Seg a Sex • 08:30 às 18:00',
      tagColor: '#F59E0B',
      mapsUrl: 'https://maps.google.com/?q=Av.+Am%C3%A9rico+Buaiz,+501+-+Enseada+do+Su%C3%A1,+Vit%C3%B3ria+-+ES'
    }
  ];

  return (
    <section id="sedes" style={{ padding: '80px 0', position: 'relative' }}>
      <div className="container">
        
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 50px' }}>
          <span className="badge badge-emerald" style={{ marginBottom: '14px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Building2 size={15} /> Presença Física &amp; Estrutura Corporativa
          </span>
          <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', marginBottom: '16px', color: '#FFFFFF' }}>
            Sedes Dom RockFeller em <span style={{ color: '#60A5FA' }}>Florianópolis</span> e <span className="text-gradient-gold">Vitória</span>
          </h2>
          <p style={{ fontSize: '1.05rem', color: '#94A3B8' }}>
            A Dom RockFeller oferece assessoria jurídica estruturada e transparente. Atendemos com peritos e especialistas no Sul e Sudeste, esclarecendo os riscos contratuais e conduzindo seu processo com segurança.
          </p>
        </div>

        {/* Dual City Cards Grid */}
        <div className="grid-2" style={{ gap: '30px' }}>
          {offices.map((office, idx) => (
            <div 
              key={idx} 
              className="glass-card" 
              style={{ 
                padding: 'clamp(22px, 4vw, 36px)', 
                border: `1px solid ${office.tagColor}40`,
                position: 'relative',
                overflow: 'hidden',
                background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.9), rgba(10, 16, 28, 0.95))'
              }}
            >
              {/* Header Badge */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '22px', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span 
                      style={{ 
                        fontSize: '0.75rem', 
                        fontWeight: 800, 
                        textTransform: 'uppercase', 
                        color: office.isComingSoon ? '#FDE68A' : '#60A5FA', 
                        letterSpacing: '0.05em',
                        background: office.isComingSoon ? 'rgba(245, 158, 11, 0.2)' : 'rgba(59, 130, 246, 0.15)',
                        border: `1px solid ${office.isComingSoon ? '#F59E0B' : '#3B82F6'}`,
                        padding: '3px 10px',
                        borderRadius: '20px'
                      }}
                    >
                      {office.statusBadge}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.75rem', color: '#FFFFFF', marginTop: '4px' }}>
                    {office.city}
                  </h3>
                  <div style={{ fontSize: '0.92rem', color: '#CBD5E1', fontWeight: 600 }}>
                    {office.building}
                  </div>
                </div>

                <div style={{
                  padding: '10px',
                  borderRadius: '12px',
                  background: `${office.tagColor}15`,
                  border: `1px solid ${office.tagColor}35`,
                  color: office.tagColor
                }}>
                  <Building2 size={26} />
                </div>
              </div>

              {/* Address details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '26px' }}>
                
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <MapPin size={18} color={office.tagColor} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div style={{ fontSize: '0.9rem', color: '#E2E8F0', lineHeight: 1.5 }}>
                    <strong>{office.address}</strong><br />
                    {office.neighborhood} • {office.cep}<br />
                    <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>{office.reference}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Clock size={18} color={office.tagColor} style={{ flexShrink: 0 }} />
                  <div style={{ fontSize: '0.9rem', color: '#E2E8F0' }}>
                    {office.hours}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Phone size={18} color={office.tagColor} style={{ flexShrink: 0 }} />
                  <a href={`tel:${office.phone.replace(/\D/g, '')}`} style={{ fontSize: '0.9rem', color: '#FFFFFF', fontWeight: 600 }}>
                    {office.phone}
                  </a>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <MessageSquare size={18} color={office.tagColor} style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: '0.9rem', color: '#FFFFFF', fontWeight: 600 }}>
                    WhatsApp: {office.whatsappFormatted}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Mail size={18} color={office.tagColor} style={{ flexShrink: 0 }} />
                  <a href={`mailto:${office.email}`} style={{ fontSize: '0.9rem', color: '#FDE68A', fontWeight: 600 }}>
                    {office.email}
                  </a>
                </div>

              </div>

              {/* Amenities / Coming Soon Notice */}
              <div style={{
                background: office.isComingSoon ? 'rgba(245, 158, 11, 0.08)' : 'rgba(255, 255, 255, 0.03)',
                border: office.isComingSoon ? '1px dashed rgba(245, 158, 11, 0.3)' : '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '10px',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '0.82rem',
                color: office.isComingSoon ? '#FDE68A' : '#94A3B8',
                marginBottom: '26px'
              }}>
                {office.isComingSoon ? (
                  <>
                    <Sparkles size={16} color="#FBBF24" style={{ flexShrink: 0 }} />
                    <span>Inauguração presencial em breve no ES. Atendimento online e recepção de perícias já disponível.</span>
                  </>
                ) : (
                  <>
                    <Coffee size={16} color="#FBBF24" style={{ flexShrink: 0 }} />
                    <span>Recepção executiva com café, estrutura corporativa e perícia contratual presencial.</span>
                  </>
                )}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <a
                  href={`https://api.whatsapp.com/send?phone=${office.whatsapp}&text=Ol%C3%A1!%20Gostaria%20de%20atendimento%20com%20a%20equipe%20da%20Dom%20RockFeller%20(${office.city}).`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-primary"
                  style={{ flex: 1, minWidth: 'min(100%, 160px)' }}
                >
                  <MessageSquare size={16} />
                  <span>WhatsApp {office.city}</span>
                </a>

                {!office.isComingSoon && (
                  <a
                    href={office.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-secondary"
                    style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <span>Como Chegar</span>
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
