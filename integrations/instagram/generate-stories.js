import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const publicDir = path.join(process.cwd(), 'public');
const storiesDir = path.join(publicDir, 'stories');
const destaquesDir = path.join(publicDir, 'destaques');
const stockDir = path.join(publicDir, 'carros-estoque');

if (!fs.existsSync(storiesDir)) fs.mkdirSync(storiesDir, { recursive: true });
if (!fs.existsSync(destaquesDir)) fs.mkdirSync(destaquesDir, { recursive: true });

const catalog = JSON.parse(fs.readFileSync(path.join(stockDir, 'catalogo.json'), 'utf-8'));

function escapeXml(unsafe) {
  return String(unsafe || '').replace(/[<>&'"]/g, c => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
    }
  });
}

async function generateSingleStory(car) {
  const width = 1080;
  const height = 1920;
  
  // Real source image
  const imagePath = path.join(stockDir, car.arquivo);
  
  // Resize car photo to 940x700 with rounded cover
  const carPhotoBuffer = await sharp(imagePath)
    .resize(940, 700, { fit: 'cover', position: 'center' })
    .toBuffer();

  const carPhotoBase64 = `data:image/jpeg;base64,${carPhotoBuffer.toString('base64')}`;

  const safeName = escapeXml((car.nome || '').toUpperCase());
  const safeYear = escapeXml(car.ano || '');
  const safeKm = escapeXml(car.km || '');
  const safePrice = escapeXml(car.valorQuitacaoFormatado || '');
  const safeFipe = escapeXml(car.fipeFormatado || '');
  const safeCategory = escapeXml((car.categoria || '').toUpperCase());
  const safeBadge = escapeXml((car.badge || 'OPORTUNIDADE EXCLUSIVA').toUpperCase());
  const safeMotor = escapeXml(car.motor || '');

  // SVG Template Black & Gold Luxury
  const svgOverlay = `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <!-- Background Luxury Gradient -->
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#05070a" />
        <stop offset="30%" stop-color="#0d1117" />
        <stop offset="70%" stop-color="#090c10" />
        <stop offset="100%" stop-color="#030406" />
      </linearGradient>

      <!-- Gold Gradient -->
      <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#fce7a1" />
        <stop offset="35%" stop-color="#dfb76c" />
        <stop offset="70%" stop-color="#b68936" />
        <stop offset="100%" stop-color="#f5d77f" />
      </linearGradient>

      <!-- Gold Card Gradient -->
      <linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#151b26" />
        <stop offset="100%" stop-color="#0e121a" />
      </linearGradient>

      <!-- Clip Path for Car Photo -->
      <clipPath id="carClip">
        <rect x="70" y="300" width="940" height="700" rx="28" ry="28" />
      </clipPath>
    </defs>

    <!-- Main Background -->
    <rect width="${width}" height="${height}" fill="url(#bgGrad)" />

    <!-- Borders -->
    <rect x="28" y="28" width="1024" height="1864" rx="36" ry="36" fill="none" stroke="#1f293d" stroke-width="2" />
    <rect x="40" y="40" width="1000" height="1840" rx="28" ry="28" fill="none" stroke="url(#goldGrad)" stroke-width="1.5" stroke-opacity="0.35" />

    <!-- Top Corner Accents -->
    <path d="M 60 90 L 60 55 L 95 55" fill="none" stroke="url(#goldGrad)" stroke-width="3" />
    <path d="M 1020 90 L 1020 55 L 985 55" fill="none" stroke="url(#goldGrad)" stroke-width="3" />
    <path d="M 60 1830 L 60 1865 L 95 1865" fill="none" stroke="url(#goldGrad)" stroke-width="3" />
    <path d="M 1020 1830 L 1020 1865 L 985 1865" fill="none" stroke="url(#goldGrad)" stroke-width="3" />

    <!-- HEADER / BRANDING -->
    <g transform="translate(540, 85) scale(0.95)">
      <path d="M -26 12 L -18 -12 L 0 4 L 18 -12 L 26 12 Z" fill="url(#goldGrad)" />
      <circle cx="-18" cy="-16" r="3.5" fill="url(#goldGrad)" />
      <circle cx="0" cy="-2" r="4" fill="url(#goldGrad)" />
      <circle cx="18" cy="-16" r="3.5" fill="url(#goldGrad)" />
    </g>

    <text x="540" y="145" text-anchor="middle" font-family="'Cinzel', 'Georgia', serif" font-size="36" font-weight="bold" fill="url(#goldGrad)" letter-spacing="6">ROCKFELLER CARROS</text>
    <text x="540" y="180" text-anchor="middle" font-family="'Inter', Arial, sans-serif" font-size="15" font-weight="600" fill="#94a3b8" letter-spacing="4">SEMINOVOS SELECIONADOS &amp; QUITAÇÃO</text>

    <!-- BADGE PILL -->
    <g transform="translate(540, 235)">
      <rect x="-240" y="-22" width="480" height="44" rx="22" fill="#161c28" stroke="url(#goldGrad)" stroke-width="1.5" />
      <text x="0" y="7" text-anchor="middle" font-family="'Inter', Arial, sans-serif" font-size="17" font-weight="bold" fill="url(#goldGrad)" letter-spacing="2">✨ ${safeBadge}</text>
    </g>

    <!-- CAR PHOTO -->
    <rect x="68" y="298" width="944" height="704" rx="30" ry="30" fill="none" stroke="url(#goldGrad)" stroke-width="2.5" />
    <image href="${carPhotoBase64}" x="70" y="300" width="940" height="700" preserveAspectRatio="xMidYMid slice" clip-path="url(#carClip)" />

    <!-- Photo Badges -->
    <g transform="translate(95, 330)">
      <rect x="0" y="0" width="160" height="42" rx="12" fill="#05070ae6" stroke="url(#goldGrad)" stroke-width="1.2" />
      <text x="80" y="27" text-anchor="middle" font-family="'Inter', Arial, sans-serif" font-size="17" font-weight="bold" fill="#ffffff">ANO ${safeYear}</text>
    </g>

    <g transform="translate(805, 330)">
      <rect x="0" y="0" width="180" height="42" rx="12" fill="#05070ae6" stroke="#38bdf8" stroke-width="1.2" />
      <text x="90" y="27" text-anchor="middle" font-family="'Inter', Arial, sans-serif" font-size="16" font-weight="bold" fill="#38bdf8">${safeKm}</text>
    </g>

    <text x="980" y="975" text-anchor="end" font-family="'Inter', Arial, sans-serif" font-size="14" font-weight="600" fill="#ffffffcc">@domrockfellervix</text>

    <!-- VEHICLE DETAILS & VALUE CARD -->
    <rect x="70" y="1030" width="940" height="440" rx="28" ry="28" fill="url(#cardGrad)" stroke="url(#goldGrad)" stroke-width="1.8" />
    
    <text x="540" y="1085" text-anchor="middle" font-family="'Inter', Arial, sans-serif" font-size="17" font-weight="700" fill="#dfb76c" letter-spacing="4">${safeCategory}</text>
    <text x="540" y="1145" text-anchor="middle" font-family="'Montserrat', 'Inter', Arial, sans-serif" font-size="36" font-weight="900" fill="#ffffff" letter-spacing="1">${safeName}</text>
    
    <!-- Spec Subline -->
    <text x="540" y="1190" text-anchor="middle" font-family="'Inter', Arial, sans-serif" font-size="18" font-weight="500" fill="#94a3b8">${safeMotor}</text>

    <line x1="220" y1="1225" x2="860" y2="1225" stroke="url(#goldGrad)" stroke-width="1" stroke-opacity="0.3" />

    <!-- Values Grid -->
    <g transform="translate(270, 1285)">
      <text x="0" y="0" text-anchor="middle" font-family="'Inter', Arial, sans-serif" font-size="16" font-weight="600" fill="#94a3b8">TABELA FIPE OFICIAL</text>
      <text x="0" y="42" text-anchor="middle" font-family="'Montserrat', Arial, sans-serif" font-size="28" font-weight="800" fill="#e2e8f0" text-decoration="line-through">${safeFipe}</text>
    </g>

    <line x1="540" y1="1260" x2="540" y2="1340" stroke="#334155" stroke-width="1.5" />

    <g transform="translate(810, 1285)">
      <text x="0" y="0" text-anchor="middle" font-family="'Inter', Arial, sans-serif" font-size="16" font-weight="600" fill="#4ade80">OPORTUNIDADE QUITAÇÃO</text>
      <text x="0" y="46" text-anchor="middle" font-family="'Montserrat', Arial, sans-serif" font-size="44" font-weight="900" fill="url(#goldGrad)">${safePrice}</text>
    </g>

    <!-- Commercial Benefit Tag -->
    <g transform="translate(540, 1420)">
      <rect x="-280" y="-22" width="560" height="44" rx="22" fill="#052e16" stroke="#22c55e" stroke-width="1.5" />
      <text x="0" y="7" text-anchor="middle" font-family="'Inter', Arial, sans-serif" font-size="16" font-weight="800" fill="#4ade80" letter-spacing="1">ACEITAMOS SEU USADO NA TROCA • ENTREGA IMEDIATA</text>
    </g>

    <!-- CALL TO ACTION / STICKER -->
    <g transform="translate(70, 1495)">
      <rect x="0" y="0" width="940" height="215" rx="24" ry="24" fill="#111827" stroke="#374151" stroke-width="1.5" />
      
      <g transform="translate(470, 60)">
        <rect x="-310" y="-34" width="620" height="68" rx="34" fill="url(#goldGrad)" />
        <text x="0" y="10" text-anchor="middle" font-family="'Inter', Arial, sans-serif" font-size="23" font-weight="900" fill="#0b0e14" letter-spacing="1">💬 DIGITE "QUERO" OU CHAME NA DM</text>
      </g>

      <text x="470" y="140" text-anchor="middle" font-family="'Inter', Arial, sans-serif" font-size="19" font-weight="600" fill="#f8fafc">Receba a ficha técnica completa e simule condições no Direct!</text>
      <text x="470" y="175" text-anchor="middle" font-family="'Inter', Arial, sans-serif" font-size="15" font-weight="500" fill="#94a3b8">Atendimento VIP em Vitória (ES) e Florianópolis (SC)</text>
    </g>

    <!-- FOOTER -->
    <text x="540" y="1760" text-anchor="middle" font-family="'Inter', Arial, sans-serif" font-size="15" font-weight="600" fill="#64748b" letter-spacing="2">ROCKFELLER CARROS • PROCEDÊNCIA &amp; TRANSPARÊNCIA</text>
    <text x="540" y="1790" text-anchor="middle" font-family="'Inter', Arial, sans-serif" font-size="14" font-weight="500" fill="#475569">@DOMROCKFELLERVIX • WHATSAPP NO LINK DA BIO</text>
  </svg>
  `;

  const safeFilename = `story_carro_${String(car.id).padStart(2, '0')}.jpg`;
  const outputPath = path.join(storiesDir, safeFilename);

  await sharp(Buffer.from(svgOverlay))
    .jpeg({ quality: 92 })
    .toFile(outputPath);

  console.log(`Generated: ${safeFilename} (${car.nome})`);
  return `/stories/${safeFilename}`;
}

async function main() {
  console.log(`Iniciando geração de stories para ${catalog.length} veículos...`);
  
  for (const car of catalog) {
    try {
      const storyUrl = await generateSingleStory(car);
      car.storyImage = storyUrl;
    } catch (err) {
      console.error(`Erro no carro ${car.id} (${car.nome}):`, err.message);
    }
  }

  fs.writeFileSync(path.join(stockDir, 'catalogo.json'), JSON.stringify(catalog, null, 2), 'utf-8');
  console.log('✅ Todos os 35 Stories gerados com sucesso e salvos em public/stories/!');
}

main();
