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
          <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', marginBottom: '16px', color: '#0F172A' }}>
            Sedes Dom RockFeller em <span style={{ color: '#2563EB' }}>Florianópolis</span> e <span className="text-gradient-gold">Vitória</span>
          </h2>
          <p style={{ fontSize: '1.05rem', color: '#475569' }}>
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
                border: office.isComingSoon ? '1.5px solid rgba(217, 119, 6, 0.3)' : '1.5px solid rgba(37, 99, 235, 0.3)',
                position: 'relative',
                overflow: 'hidden',
                background: '#FFFFFF',
                boxShadow: '0 6px 24px -2px rgba(15, 23, 42, 0.06)'
              }}
            >
              {/* Top Accent Strip */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: office.isComingSoon ? 'linear-gradient(90deg, #F59E0B, #B45309)' : 'linear-gradient(90deg, #3B82F6, #1D4ED8)'
              }} />

              {/* Header Badge & Title - Centered */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '22px', gap: '6px' }}>
                <span 
                  style={{ 
                    fontSize: '0.75rem', 
                    fontWeight: 800, 
                    textTransform: 'uppercase', 
                    color: office.isComingSoon ? '#876214' : '#0A2540', 
                    letterSpacing: '0.06em',
                    background: office.isComingSoon ? 'rgba(197, 155, 39, 0.12)' : 'rgba(10, 37, 64, 0.08)',
                    border: `1px solid ${office.isComingSoon ? 'rgba(197, 155, 39, 0.35)' : 'rgba(10, 37, 64, 0.2)'}`,
                    padding: '4px 14px',
                    borderRadius: '20px'
                  }}
                >
                  {office.statusBadge}
                </span>
                <h3 style={{ fontSize: '1.8rem', color: '#0A2540', margin: '4px 0 0', fontWeight: 800 }}>
                  {office.city}
                </h3>
                <div style={{ fontSize: '0.94rem', color: '#475569', fontWeight: 600 }}>
                  {office.building}
                </div>
              </div>

              {/* Address details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '26px' }}>
                
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <MapPin size={18} color={office.isComingSoon ? '#C59B27' : '#0A2540'} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div style={{ fontSize: '0.9rem', color: '#1E293B', lineHeight: 1.5 }}>
                    <strong style={{ color: '#0A2540' }}>{office.address}</strong><br />
                    {office.neighborhood} • {office.cep}<br />
                    <span style={{ fontSize: '0.8rem', color: '#64748B' }}>{office.reference}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Clock size={18} color={office.isComingSoon ? '#C59B27' : '#0A2540'} style={{ flexShrink: 0 }} />
                  <div style={{ fontSize: '0.9rem', color: '#334155' }}>
                    {office.hours}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Phone size={18} color={office.isComingSoon ? '#C59B27' : '#0A2540'} style={{ flexShrink: 0 }} />
                  <a href={`tel:${office.phone.replace(/\D/g, '')}`} style={{ fontSize: '0.9rem', color: '#0A2540', fontWeight: 700 }}>
                    {office.phone}
                  </a>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <MessageSquare size={18} color={office.isComingSoon ? '#C59B27' : '#0A2540'} style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: '0.9rem', color: '#0A2540', fontWeight: 700 }}>
                    WhatsApp: {office.whatsappFormatted}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Mail size={18} color={office.isComingSoon ? '#C59B27' : '#0A2540'} style={{ flexShrink: 0 }} />
                  <a href={`mailto:${office.email}`} style={{ fontSize: '0.9rem', color: '#876214', fontWeight: 700 }}>
                    {office.email}
                  </a>
                </div>

              </div>

              {/* Amenities / Coming Soon Notice */}
              <div style={{
                background: office.isComingSoon ? 'rgba(197, 155, 39, 0.08)' : '#F8FAFC',
                border: office.isComingSoon ? '1px dashed rgba(197, 155, 39, 0.4)' : '1px solid #E2E8F0',
                borderRadius: '12px',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                gap: '10px',
                fontSize: '0.82rem',
                color: office.isComingSoon ? '#876214' : '#475569',
                marginBottom: '26px'
              }}>
                {office.isComingSoon ? (
                  <>
                    <Sparkles size={16} color="#C59B27" style={{ flexShrink: 0 }} />
                    <span>Inauguração presencial em breve no ES. Atendimento online e recepção de perícias já disponível.</span>
                  </>
                ) : (
                  <>
                    <Coffee size={16} color="#059669" style={{ flexShrink: 0 }} />
                    <span>Recepção executiva com café, estrutura corporativa e perícia contratual presencial.</span>
                  </>
                )}
              </div>

              {/* Action Buttons - Centered */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <a
                  href={`https://api.whatsapp.com/send?phone=${office.whatsapp}&text=Ol%C3%A1!%20Gostaria%20de%20atendimento%20com%20a%20equipe%20da%20Dom%20RockFeller%20(${office.city}).`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-primary"
                  style={{ flex: 1, minWidth: 'min(100%, 180px)' }}
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
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
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
