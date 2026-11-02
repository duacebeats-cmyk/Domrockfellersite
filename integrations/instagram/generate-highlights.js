import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const publicDir = path.join(process.cwd(), 'public');
const destaquesDir = path.join(publicDir, 'destaques');

if (!fs.existsSync(destaquesDir)) fs.mkdirSync(destaquesDir, { recursive: true });

const highlightsData = [
  {
    id: 'luxo_importados',
    title: 'LUXO',
    subtitle: 'IMPORTADOS',
    iconType: 'diamond_crown',
    carsCount: 9,
    carsList: 'GLE 400d, BMW 320i, X3, X4, X2 Blindada, Mercedes A200, GLA200, Audi A3, Mini Cooper'
  },
  {
    id: 'suvs_picapes',
    title: 'SUVs & 4x4',
    subtitle: 'PICAPES',
    iconType: 'suv_pickup',
    carsCount: 11,
    carsList: 'Rampage, Amarok V6, Toro Ranch, Tiguan, Fastback, Toro Volcano, Compass, Renegade, Kicks, Tracker'
  },
  {
    id: 'sedans_hatchs',
    title: 'SEDANS',
    subtitle: '& HATCHS',
    iconType: 'sedan_car',
    carsCount: 8,
    carsList: 'Corolla, Novo Sonic, Spin Premier, Virtus, Onix Plus, Onix Premier, HB20 Hatch'
  },
  {
    id: 'ate_35_mil',
    title: 'ATÉ 35 MIL',
    subtitle: 'OPORTUNIDADES',
    iconType: 'gold_tag',
    carsCount: 7,
    carsList: 'Ford Ka, Fox, Mobi, HB20 2020, Cruze, Onix Hatch, Audi A3'
  },
  {
    id: 'eletricos_novos',
    title: 'ELÉTRICOS',
    subtitle: '& MODERNOS',
    iconType: 'electric_energy',
    carsCount: 4,
    carsList: 'BYD Dolphin Mini, Rampage 2026, Fastback 2026, HB20 2025'
  },
  {
    id: 'como_funciona',
    title: 'SEGURANÇA',
    subtitle: 'COMO FUNCIONA',
    iconType: 'justice_shield',
    carsCount: 0,
    carsList: 'Auditoria Forense, Código Civil, Cessão de Direitos e Desconto de até 70%'
  }
];

function getIconSvg(type) {
  switch (type) {
    case 'diamond_crown':
      return `
        <!-- Luxury Diamond Crown -->
        <g fill="url(#goldGrad)" transform="translate(540, 500) scale(2.4)">
          <!-- Crown Base -->
          <path d="M -35 25 L 35 25 L 28 35 L -28 35 Z" opacity="0.9" />
          <circle cx="-25" cy="30" r="2.5" fill="#0c0e14" />
          <circle cx="0" cy="30" r="2.5" fill="#0c0e14" />
          <circle cx="25" cy="30" r="2.5" fill="#0c0e14" />
          <!-- Crown Peaks -->
          <path d="M -35 20 L -40 -10 L -20 5 L 0 -22 L 20 5 L 40 -10 L 35 20 Z" />
          <!-- Gems on Tips -->
          <circle cx="-40" cy="-14" r="5" />
          <circle cx="0" cy="-28" r="6" />
          <circle cx="40" cy="-14" r="5" />
          <circle cx="-20" cy="5" r="3.5" fill="#ffffff" opacity="0.8" />
          <circle cx="20" cy="5" r="3.5" fill="#ffffff" opacity="0.8" />
          <!-- Diamond Center -->
          <polygon points="0,-10 12,5 0,18 -12,5" fill="#ffffff" opacity="0.9" />
        </g>
      `;

    case 'suv_pickup':
      return `
        <!-- SUV / 4x4 Mountain / Traction Icon -->
        <g fill="url(#goldGrad)" transform="translate(540, 505) scale(2.2)">
          <!-- Mountain Peaks in Background -->
          <polygon points="-45,15 -20,-20 0,5 20,-10 45,15" opacity="0.3" fill="none" stroke="url(#goldGrad)" stroke-width="3" />
          <!-- Modern SUV / Pickup Silhouette -->
          <path d="M -48 16 C -48 10 -42 6 -32 5 L -20 5 L -10 -15 L 20 -15 L 36 2 L 48 5 C 52 7 54 11 54 16 L 54 22 C 54 24 52 26 50 26 L 42 26 C 42 18 34 14 26 14 C 18 14 12 18 12 26 L -16 26 C -16 18 -24 14 -32 14 C -40 14 -46 18 -46 26 L -50 26 C -52 26 -54 24 -54 22 L -54 18 Z" />
          <!-- Wheels with Rims -->
          <circle cx="-32" cy="25" r="11" fill="#090b10" stroke="url(#goldGrad)" stroke-width="4" />
          <circle cx="-32" cy="25" r="4" fill="url(#goldGrad)" />
          <circle cx="27" cy="25" r="11" fill="#090b10" stroke="url(#goldGrad)" stroke-width="4" />
          <circle cx="27" cy="25" r="4" fill="url(#goldGrad)" />
          <!-- Windows -->
          <path d="M -8 -11 L -16 3 L 5 3 L 5 -11 Z" fill="#0c0e14" />
          <path d="M 9 -11 L 9 3 L 30 3 L 18 -11 Z" fill="#0c0e14" />
          <!-- 4x4 Badge -->
          <text x="0" y="-30" text-anchor="middle" font-family="'Montserrat', sans-serif" font-size="14" font-weight="900" fill="url(#goldGrad)">4x4 DIESEL &amp; SUV</text>
        </g>
      `;

    case 'sedan_car':
      return `
        <!-- Elegant Executive Sedan Silhouette -->
        <g fill="url(#goldGrad)" transform="translate(540, 505) scale(2.3)">
          <!-- Sleek Coupe / Sedan Profile -->
          <path d="M -52 14 C -50 8 -42 4 -28 3 L -15 -12 C -10 -16 5 -16 22 -12 L 40 4 C 48 6 52 10 52 16 L 52 22 L 44 22 C 44 14 36 12 28 12 C 20 12 14 16 14 22 L -14 22 C -14 16 -20 12 -28 12 C -36 12 -42 16 -42 22 L -52 22 Z" />
          <!-- Wheels -->
          <circle cx="-28" cy="23" r="10" fill="#090b10" stroke="url(#goldGrad)" stroke-width="3.5" />
          <circle cx="-28" cy="23" r="3.5" fill="url(#goldGrad)" />
          <circle cx="29" cy="23" r="10" fill="#090b10" stroke="url(#goldGrad)" stroke-width="3.5" />
          <circle cx="29" cy="23" r="3.5" fill="url(#goldGrad)" />
          <!-- Glass -->
          <path d="M -12 -9 L -22 2 L 0 2 L 0 -9 Z" fill="#090b10" />
          <path d="M 4 -9 L 4 2 L 28 2 L 18 -9 Z" fill="#090b10" />
          <!-- Aerodynamic Lines -->
          <line x1="-48" y1="-22" x2="48" y2="-22" stroke="url(#goldGrad)" stroke-width="2" stroke-dasharray="12,6" opacity="0.6" />
        </g>
      `;

    case 'gold_tag':
      return `
        <!-- Gold Coin / Opportunity Tag -->
        <g transform="translate(540, 505) scale(2.2)">
          <!-- Big Gold Medallion -->
          <circle cx="0" cy="0" r="46" fill="#0c0e14" stroke="url(#goldGrad)" stroke-width="5" />
          <circle cx="0" cy="0" r="38" fill="none" stroke="url(#goldGrad)" stroke-width="1.5" stroke-dasharray="4,4" />
          <!-- R$ Big Symbol -->
          <text x="0" y="14" text-anchor="middle" font-family="'Montserrat', sans-serif" font-size="34" font-weight="900" fill="url(#goldGrad)">R$</text>
          <!-- Stars on rim -->
          <polygon points="0,-42 2,-36 8,-36 3,-32 5,-26 0,-30 -5,-26 -3,-32 -8,-36 -2,-36" fill="url(#goldGrad)" />
          <polygon points="0,42 2,36 8,36 3,32 5,26 0,30 -5,26 -3,32 -8,36 -2,36" fill="url(#goldGrad)" />
          <polygon points="-42,0 -36,2 -36,8 -32,3 -26,5 -30,0 -26,-5 -32,-3 -36,-8 -36,-2" fill="url(#goldGrad)" />
          <polygon points="42,0 36,2 36,8 32,3 26,5 30,0 26,-5 32,-3 36,-8 36,-2" fill="url(#goldGrad)" />
        </g>
      `;

    case 'electric_energy':
      return `
        <!-- Electric Lightning & Tech Shield -->
        <g transform="translate(540, 505) scale(2.3)">
          <!-- Tech Hexagon Ring -->
          <polygon points="0,-48 42,-24 42,24 0,48 -42,24 -42,-24" fill="#090b10" stroke="url(#goldGrad)" stroke-width="4" />
          <polygon points="0,-40 35,-20 35,20 0,40 -35,20 -35,-20" fill="none" stroke="url(#goldGrad)" stroke-width="1.5" opacity="0.5" />
          <!-- Sharp Lightning Bolt -->
          <polygon points="6,-32 -22,4 -2,4 -10,34 22,-4 2,-4" fill="url(#goldGrad)" />
        </g>
      `;

    case 'justice_shield':
    default:
      return `
        <!-- Scales of Justice & Law Shield -->
        <g fill="url(#goldGrad)" transform="translate(540, 505) scale(2.2)">
          <!-- Scales of Justice -->
          <!-- Pillar -->
          <rect x="-3" y="-36" width="6" height="72" rx="2" />
          <rect x="-24" y="32" width="48" height="6" rx="3" />
          <circle cx="0" cy="-38" r="6" />
          <!-- Horizontal Beam -->
          <line x1="-38" y1="-24" x2="38" y2="-24" stroke="url(#goldGrad)" stroke-width="4" />
          <!-- Left Plate -->
          <line x1="-36" y1="-24" x2="-44" y2="2" stroke="url(#goldGrad)" stroke-width="2" />
          <line x1="-36" y1="-24" x2="-28" y2="2" stroke="url(#goldGrad)" stroke-width="2" />
          <path d="M -48 2 C -48 10 -24 10 -24 2 Z" />
          <!-- Right Plate -->
          <line x1="36" y1="-24" x2="28" y2="2" stroke="url(#goldGrad)" stroke-width="2" />
          <line x1="36" y1="-24" x2="44" y2="2" stroke="url(#goldGrad)" stroke-width="2" />
          <path d="M 24 2 C 24 10 48 10 48 2 Z" />
        </g>
      `;
  }
}

function xmlEsc(str) {
  return String(str).replace(/[<>&'"]/g, c => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
    }
  });
}

async function generateHighlightCover(h) {
  const size = 1080;
  const iconSvg = getIconSvg(h.iconType);
  const safeTitle = xmlEsc(h.title);
  const safeSubtitle = xmlEsc(h.subtitle);

  const svg = `
  <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <!-- Radial Luxury Onyx Background -->
      <radialGradient id="bgRadial" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
        <stop offset="0%" stop-color="#181d27" />
        <stop offset="60%" stop-color="#0a0d13" />
        <stop offset="100%" stop-color="#040507" />
      </radialGradient>

      <!-- Liquid Gold Gradient -->
      <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#fff0c2" />
        <stop offset="25%" stop-color="#e6bf70" />
        <stop offset="60%" stop-color="#b68936" />
        <stop offset="85%" stop-color="#dfb76c" />
        <stop offset="100%" stop-color="#fdf1c8" />
      </linearGradient>

      <!-- Filter Glow -->
      <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="10" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>

    <!-- Canvas Background -->
    <rect width="${size}" height="${size}" fill="#050608" />

    <!-- Circular Highlight Boundary (Instagram Crop Guide) -->
    <!-- Outer Glow Ring -->
    <circle cx="540" cy="540" r="440" fill="url(#bgRadial)" stroke="#222836" stroke-width="3" />
    <circle cx="540" cy="540" r="430" fill="none" stroke="url(#goldGrad)" stroke-width="3" opacity="0.4" />

    <!-- Concentric Decorative Rings -->
    <circle cx="540" cy="540" r="390" fill="none" stroke="url(#goldGrad)" stroke-width="6" filter="url(#glow)" opacity="0.8" />
    <circle cx="540" cy="540" r="390" fill="none" stroke="url(#goldGrad)" stroke-width="5" />
    <circle cx="540" cy="540" r="370" fill="none" stroke="url(#goldGrad)" stroke-width="1.5" stroke-dasharray="8,6" opacity="0.6" />
    <circle cx="540" cy="540" r="350" fill="#0d1017" stroke="#1c2230" stroke-width="2" />

    <!-- Small Brand Wordmark Above Icon -->
    <text x="540" y="325" text-anchor="middle" font-family="'Cinzel', 'Georgia', serif" font-size="20" font-weight="bold" fill="url(#goldGrad)" letter-spacing="6">DOM ROCKFELLER</text>
    <line x1="440" y1="345" x2="640" y2="345" stroke="url(#goldGrad)" stroke-width="1.5" opacity="0.6" />

    <!-- Main Central Icon -->
    ${iconSvg}

    <!-- Label Below Icon -->
    <line x1="420" y1="675" x2="660" y2="675" stroke="url(#goldGrad)" stroke-width="1.5" opacity="0.6" />
    <text x="540" y="735" text-anchor="middle" font-family="'Montserrat', 'Inter', Arial, sans-serif" font-size="44" font-weight="900" fill="#ffffff" letter-spacing="3">${safeTitle}</text>
    <text x="540" y="780" text-anchor="middle" font-family="'Montserrat', 'Inter', Arial, sans-serif" font-size="24" font-weight="800" fill="url(#goldGrad)" letter-spacing="5">${safeSubtitle}</text>

    <!-- Subtext -->
    ${h.carsCount > 0 ? `
    <g transform="translate(540, 835)">
      <rect x="-110" y="-18" width="220" height="36" rx="18" fill="#141824" stroke="url(#goldGrad)" stroke-width="1" />
      <text x="0" y="6" text-anchor="middle" font-family="'Inter', sans-serif" font-size="15" font-weight="700" fill="#cbd5e1" letter-spacing="1">${h.carsCount} VEÍCULOS</text>
    </g>
    ` : `
    <g transform="translate(540, 835)">
      <rect x="-130" y="-18" width="260" height="36" rx="18" fill="#141824" stroke="#22c55e" stroke-width="1" />
      <text x="0" y="6" text-anchor="middle" font-family="'Inter', sans-serif" font-size="14" font-weight="700" fill="#4ade80" letter-spacing="1">AUDITORIA FORENSE</text>
    </g>
    `}

    <!-- 4 Cardinal Gold Accent Pins -->
    <circle cx="540" cy="150" r="5" fill="url(#goldGrad)" />
    <circle cx="540" cy="930" r="5" fill="url(#goldGrad)" />
    <circle cx="150" cy="540" r="5" fill="url(#goldGrad)" />
    <circle cx="930" cy="540" r="5" fill="url(#goldGrad)" />
  </svg>
  `;

  // 1. Output 1:1 Cover (1080x1080) for Instagram Highlights
  const cover1x1Filename = `destaque_${h.id}.jpg`;
  const cover1x1Path = path.join(destaquesDir, cover1x1Filename);
  await sharp(Buffer.from(svg))
    .jpeg({ quality: 95 })
    .toFile(cover1x1Path);

  // 2. Also output full 9:16 Story version (1080x1920) for posting directly to Stories to create the Highlight
  const story1x1Buffer = await sharp(cover1x1Path)
    .resize(900, 900)
    .toBuffer();
  const story1x1Base64 = `data:image/jpeg;base64,${story1x1Buffer.toString('base64')}`;

  const storySvg = `
  <svg width="1080" height="1920" viewBox="0 0 1080 1920" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bgStoryGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#05070a" />
        <stop offset="50%" stop-color="#0c0f16" />
        <stop offset="100%" stop-color="#05070a" />
      </linearGradient>
      <linearGradient id="goldGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#fff0c2" />
        <stop offset="50%" stop-color="#dfb76c" />
        <stop offset="100%" stop-color="#b68936" />
      </linearGradient>
    </defs>
    <rect width="1080" height="1920" fill="url(#bgStoryGrad)" />
    
    <!-- Top Branding -->
    <text x="540" y="240" text-anchor="middle" font-family="'Cinzel', serif" font-size="34" font-weight="bold" fill="url(#goldGrad2)" letter-spacing="6">DOM ROCKFELLER</text>
    <text x="540" y="280" text-anchor="middle" font-family="'Inter', sans-serif" font-size="16" font-weight="600" fill="#94a3b8" letter-spacing="4">NOVO DESTAQUE OFICIAL</text>
    <line x1="380" y1="310" x2="700" y2="310" stroke="url(#goldGrad2)" stroke-width="1.5" opacity="0.6" />

    <!-- Center 1:1 Image -->
    <image href="${story1x1Base64}" x="90" y="440" width="900" height="900" />

    <!-- Story Bottom Guide -->
    <g transform="translate(540, 1480)">
      <rect x="-300" y="-30" width="600" height="60" rx="30" fill="#141824" stroke="url(#goldGrad2)" stroke-width="1.5" />
      <text x="0" y="8" text-anchor="middle" font-family="'Inter', sans-serif" font-size="20" font-weight="800" fill="#ffffff">DESTAQUE: ${safeTitle} ${safeSubtitle}</text>
    </g>
    <text x="540" y="1600" text-anchor="middle" font-family="'Inter', sans-serif" font-size="18" font-weight="600" fill="#cbd5e1">Adicione este Story e defina como capa do Destaque</text>
    <text x="540" y="1635" text-anchor="middle" font-family="'Inter', sans-serif" font-size="15" font-weight="500" fill="#64748b">@domrockfellervix • Vitória (ES) e Florianópolis (SC)</text>
  </svg>
  `;
  const storyHighlightFilename = `story_destaque_${h.id}.jpg`;
  const storyHighlightPath = path.join(destaquesDir, storyHighlightFilename);
  await sharp(Buffer.from(storySvg))
    .jpeg({ quality: 95 })
    .toFile(storyHighlightPath);

  console.log(`✅ Capa de destaque gerada: ${cover1x1Filename} & ${storyHighlightFilename}`);
  return {
    ...h,
    coverUrl: `/destaques/${cover1x1Filename}`,
    storyUrl: `/destaques/${storyHighlightFilename}`
  };
}

async function main() {
  console.log('Iniciando geração das 6 capas de Destaques Oficiais para Instagram...');
  const results = [];
  for (const h of highlightsData) {
    const res = await generateHighlightCover(h);
    results.push(res);
  }

  fs.writeFileSync(path.join(destaquesDir, 'destaques.json'), JSON.stringify(results, null, 2), 'utf-8');
  console.log('✨ Todas as capas de destaques geradas com sucesso em public/destaques/!');
}

main();
