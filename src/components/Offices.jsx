import React from 'react';
import { MapPin, Phone, MessageSquare, Clock, Building2, Coffee, ShieldCheck, ExternalLink, Calendar } from 'lucide-react';

export function Offices({ onOpenSimulator }) {
  const offices = [
    {
      city: 'Vitória',
      state: 'Espírito Santo (ES)',
      building: 'Centro Empresarial Vitória',
      address: 'Av. Américo Buaiz, 501 - Salas 804 e 805',
      neighborhood: 'Enseada do Suá, Vitória - ES',
      cep: 'CEP: 29050-911',
      reference: 'Ao lado do Shopping Vitória e próximo ao Tribunal de Justiça do ES',
      phone: '(27) 3099-4450',
      whatsapp: '5527998723344',
      whatsappFormatted: '(27) 99872-3344',
      hours: 'Segunda a Sexta: 08:30 às 18:00',
      tagColor: '#10B981',
      mapsUrl: 'https://maps.google.com/?q=Av.+Am%C3%A9rico+Buaiz,+501+-+Enseada+do+Su%C3%A1,+Vit%C3%B3ria+-+ES'
    },
    {
      city: 'Florianópolis',
      state: 'Santa Catarina (SC)',
      building: 'Premier Tower Corporate',
      address: 'Av. Rio Branco, 847 - Salas 601 e 602',
      neighborhood: 'Centro, Florianópolis - SC',
      cep: 'CEP: 88015-205',
      reference: 'Coração financeiro da Ilha, com fácil acesso à Beira-Mar Norte',
      phone: '(48) 3224-8890',
      whatsapp: '5548991256677',
      whatsappFormatted: '(48) 99125-6677',
      hours: 'Segunda a Sexta: 08:30 às 18:00',
      tagColor: '#3B82F6',
      mapsUrl: 'https://maps.google.com/?q=Av.+Rio+Branco,+847+-+Centro,+Florian%C3%B3polis+-+SC'
    }
  ];

  return (
    <section id="sedes" style={{ padding: '80px 0', position: 'relative' }}>
      <div className="container">
        
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 50px' }}>
          <span className="badge badge-emerald" style={{ marginBottom: '14px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Building2 size={15} /> Presença Física & Estrutura Corporativa
          </span>
          <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', marginBottom: '16px', color: '#FFFFFF' }}>
            Sedes Dom RockFeller em <span className="text-gradient-gold">Vitória</span> e <span style={{ color: '#60A5FA' }}>Florianópolis</span>
          </h2>
          <p style={{ fontSize: '1.05rem', color: '#94A3B8' }}>
            A Dom RockFeller não é uma plataforma anônima. Recebemos você pessoalmente com peritos e assessores jurídicos em escritórios corporativos estruturados no Espírito Santo e em Santa Catarina, esclarecendo os riscos de busca e apreensão e o caminho da ação revisional.
          </p>
        </div>

        {/* Dual City Cards Grid */}
        <div className="grid-2" style={{ gap: '30px' }}>
          {offices.map((office, idx) => (
            <div 
              key={idx} 
              className="glass-card" 
              style={{ 
                padding: '36px', 
                border: `1px solid ${office.tagColor}40`,
                position: 'relative',
                overflow: 'hidden',
                background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.9), rgba(10, 16, 28, 0.95))'
              }}
            >
              {/* Header Badge */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '22px' }}>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: office.tagColor, letterSpacing: '0.05em' }}>
                    Sede Regional • {office.state}
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
                  <Building2 size={28} />
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

              </div>

              {/* Coffee / Amenities note */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '10px',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '0.82rem',
                color: '#94A3B8',
                marginBottom: '26px'
              }}>
                <Coffee size={16} color="#FBBF24" />
                <span>Estacionamento no local e atendimento com café e perícia contratual.</span>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <a
                  href={`https://api.whatsapp.com/send?phone=${office.whatsapp}&text=Ol%C3%A1!%20Gostaria%20de%20agendar%20um%20atendimento%20jur%C3%ADdico%20na%20sede%20de%20${office.city}%20da%20Dom%20RockFeller%20para%20an%C3%A1lise%20de%20juros%20abusivos%20e%20a%C3%A7%C3%A3o%20revisional.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-primary"
                  style={{ flex: 1, minWidth: '160px' }}
                >
                  <MessageSquare size={16} />
                  <span>WhatsApp {office.city}</span>
                </a>

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
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
