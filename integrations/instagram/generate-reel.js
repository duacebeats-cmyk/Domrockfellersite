import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import sharp from 'sharp';

const publicDir = path.join(process.cwd(), 'public');
const storiesDir = path.join(publicDir, 'stories');
const reelsDir = path.join(publicDir, 'reels');
const tempDir = path.join(reelsDir, 'temp_frames');

if (!fs.existsSync(reelsDir)) fs.mkdirSync(reelsDir, { recursive: true });
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

// Intro Card SVG (1080x1920)
function createIntroSvg() {
  return `
  <svg width="1080" height="1920" viewBox="0 0 1080 1920" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="introBg" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#05070b" />
        <stop offset="40%" stop-color="#111622" />
        <stop offset="70%" stop-color="#0a0c12" />
        <stop offset="100%" stop-color="#040508" />
      </linearGradient>
      <linearGradient id="goldG" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#fff2c7" />
        <stop offset="30%" stop-color="#e3ba6c" />
        <stop offset="70%" stop-color="#b88a35" />
        <stop offset="100%" stop-color="#f5d67f" />
      </linearGradient>
    </defs>

    <rect width="1080" height="1920" fill="url(#introBg)" />
    
    <!-- Top Crown -->
    <g transform="translate(540, 420) scale(2.2)">
      <path d="M -30 15 L -20 -15 L 0 5 L 20 -15 L 30 15 Z" fill="url(#goldG)" />
      <circle cx="-20" cy="-20" r="4" fill="url(#goldG)" />
      <circle cx="0" cy="-3" r="5" fill="url(#goldG)" />
      <circle cx="20" cy="-20" r="4" fill="url(#goldG)" />
      <rect x="-30" y="19" width="60" height="4" rx="2" fill="url(#goldG)" />
    </g>

    <text x="540" y="580" text-anchor="middle" font-family="'Cinzel', 'Georgia', serif" font-size="54" font-weight="bold" fill="url(#goldG)" letter-spacing="8">DOM ROCKFELLER</text>
    <text x="540" y="630" text-anchor="middle" font-family="'Inter', sans-serif" font-size="22" font-weight="600" fill="#cbd5e1" letter-spacing="5">GESTÃO PATRIMONIAL &amp; VEÍCULOS</text>

    <line x1="280" y1="680" x2="800" y2="680" stroke="url(#goldG)" stroke-width="2" />

    <!-- Main Headline -->
    <rect x="140" y="740" width="800" height="80" rx="40" fill="#171e2c" stroke="url(#goldG)" stroke-width="2" />
    <text x="540" y="792" text-anchor="middle" font-family="'Montserrat', sans-serif" font-size="28" font-weight="900" fill="url(#goldG)" letter-spacing="3">🔥 ESTOQUE EXCLUSIVO 2026</text>

    <text x="540" y="920" text-anchor="middle" font-family="'Montserrat', sans-serif" font-size="52" font-weight="900" fill="#ffffff" letter-spacing="1">35 VEÍCULOS PARA</text>
    <text x="540" y="990" text-anchor="middle" font-family="'Montserrat', sans-serif" font-size="56" font-weight="900" fill="url(#goldG)" letter-spacing="1">FUTURA QUITAÇÃO</text>
    
    <!-- Discount Callout -->
    <rect x="190" y="1060" width="700" height="120" rx="24" fill="#0d1117" stroke="#22c55e" stroke-width="3" />
    <text x="540" y="1115" text-anchor="middle" font-family="'Montserrat', sans-serif" font-size="36" font-weight="900" fill="#4ade80">ATÉ 70% DE DESCONTO</text>
    <text x="540" y="1155" text-anchor="middle" font-family="'Inter', sans-serif" font-size="20" font-weight="600" fill="#cbd5e1">SOBRE O SALDO BANCÁRIO RESIDUAL</text>

    <!-- Range of Prices -->
    <g transform="translate(540, 1260)">
      <rect x="-380" y="0" width="760" height="90" rx="20" fill="#111624" stroke="url(#goldG)" stroke-width="1.5" />
      <text x="0" y="55" text-anchor="middle" font-family="'Montserrat', sans-serif" font-size="32" font-weight="800" fill="#ffffff">A PARTIR DE <tspan fill="url(#goldG)">R$ 22.000</tspan></text>
    </g>

    <!-- Bottom Instruction -->
    <text x="540" y="1460" text-anchor="middle" font-family="'Inter', sans-serif" font-size="24" font-weight="700" fill="#f8fafc">👉 VEJA AS MÁQUINAS A SEGUIR</text>
    <text x="540" y="1510" text-anchor="middle" font-family="'Inter', sans-serif" font-size="18" font-weight="500" fill="#94a3b8">@domrockfellervix • Vitória (ES) &amp; Florianópolis (SC)</text>
  </svg>
  `;
}

// Outro Card SVG (1080x1920)
function createOutroSvg() {
  return `
  <svg width="1080" height="1920" viewBox="0 0 1080 1920" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="outroBg" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#040508" />
        <stop offset="35%" stop-color="#121722" />
        <stop offset="70%" stop-color="#090b10" />
        <stop offset="100%" stop-color="#040508" />
      </linearGradient>
      <linearGradient id="goldG2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#fff2c7" />
        <stop offset="30%" stop-color="#e3ba6c" />
        <stop offset="70%" stop-color="#b88a35" />
        <stop offset="100%" stop-color="#f5d67f" />
      </linearGradient>
    </defs>

    <rect width="1080" height="1920" fill="url(#outroBg)" />
    
    <g transform="translate(540, 380) scale(2.2)">
      <path d="M -30 15 L -20 -15 L 0 5 L 20 -15 L 30 15 Z" fill="url(#goldG2)" />
      <circle cx="-20" cy="-20" r="4" fill="url(#goldG2)" />
      <circle cx="0" cy="-3" r="5" fill="url(#goldG2)" />
      <circle cx="20" cy="-20" r="4" fill="url(#goldG2)" />
      <rect x="-30" y="19" width="60" height="4" rx="2" fill="url(#goldG2)" />
    </g>

    <text x="540" y="530" text-anchor="middle" font-family="'Cinzel', serif" font-size="52" font-weight="bold" fill="url(#goldG2)" letter-spacing="8">DOM ROCKFELLER</text>
    <text x="540" y="580" text-anchor="middle" font-family="'Inter', sans-serif" font-size="20" font-weight="600" fill="#a0aec0" letter-spacing="4">DIREITO BANCÁRIO &amp; PERÍCIA JUDICIAL</text>

    <!-- Big Action Box -->
    <rect x="100" y="660" width="880" height="520" rx="36" ry="36" fill="#141a27" stroke="url(#goldG2)" stroke-width="2.5" />

    <text x="540" y="745" text-anchor="middle" font-family="'Montserrat', sans-serif" font-size="34" font-weight="900" fill="#ffffff">QUER ADQUIRIR OU SABER</text>
    <text x="540" y="795" text-anchor="middle" font-family="'Montserrat', sans-serif" font-size="34" font-weight="900" fill="url(#goldG2)">COMO FUNCIONA A QUITAÇÃO?</text>

    <line x1="260" y1="835" x2="820" y2="835" stroke="url(#goldG2)" stroke-width="1.5" opacity="0.5" />

    <!-- Big CTA Button Mockup -->
    <g transform="translate(540, 920)">
      <rect x="-360" y="-45" width="720" height="90" rx="45" fill="url(#goldG2)" />
      <text x="0" y="12" text-anchor="middle" font-family="'Montserrat', sans-serif" font-size="28" font-weight="900" fill="#0b0e14" letter-spacing="1">💬 DIGITE O NOME DO CARRO</text>
    </g>

    <text x="540" y="1040" text-anchor="middle" font-family="'Inter', sans-serif" font-size="22" font-weight="700" fill="#ffffff">Ou envie uma mensagem direta no Direct!</text>
    <text x="540" y="1080" text-anchor="middle" font-family="'Inter', sans-serif" font-size="18" font-weight="500" fill="#94a3b8">Nossa equipe pericial enviará o dossiê completo na hora.</text>

    <text x="540" y="1135" text-anchor="middle" font-family="'Inter', sans-serif" font-size="16" font-weight="700" fill="#4ade80">🛡️ CESSÃO DE DIREITOS 100% AUDITADA &amp; SEGURA</text>

    <!-- Sedes -->
    <g transform="translate(540, 1300)">
      <rect x="-360" y="0" width="720" height="120" rx="20" fill="#0d1117" stroke="#222733" stroke-width="1" />
      <text x="0" y="45" text-anchor="middle" font-family="'Inter', sans-serif" font-size="20" font-weight="700" fill="#ffffff">📍 Atendimento Presencial VIP:</text>
      <text x="0" y="85" text-anchor="middle" font-family="'Inter', sans-serif" font-size="17" font-weight="500" fill="#cbd5e1">Vitória / ES (Enseada do Suá) • Florianópolis / SC (Centro)</text>
    </g>

    <text x="540" y="1520" text-anchor="middle" font-family="'Inter', sans-serif" font-size="22" font-weight="800" fill="url(#goldG2)">SIGA: @DOMROCKFELLERVIX</text>
  </svg>
  `;
}

async function main() {
  console.log('Criando frames de alta definição para o Reel oficial...');

  // 1. Intro Card
  const introPath = path.join(tempDir, 'frame_00_intro.jpg');
  await sharp(Buffer.from(createIntroSvg()))
    .jpeg({ quality: 95 })
    .toFile(introPath);

  // 2. Outro Card
  const outroPath = path.join(tempDir, 'frame_99_outro.jpg');
  await sharp(Buffer.from(createOutroSvg()))
    .jpeg({ quality: 95 })
    .toFile(outroPath);

  // 3. Selection of top machines to showcase in the Reel
  // Mercedes GLE (35), BMW 320i (15), Rampage (13), BMW X4 (6), Corolla (4), BYD Dolphin (9), Amarok (10), Compass (24), Mobi (1)
  const featuredCarIds = [35, 15, 13, 6, 4, 9, 10, 24, 1];
  
  // Create a concat list for FFmpeg
  const concatFilePath = path.join(tempDir, 'concat_list.txt');
  let concatLines = [];

  // Intro: 2.5 seconds
  concatLines.push(`file '${introPath.replace(/\\/g, '/')}'`);
  concatLines.push(`duration 2.5`);

  for (const id of featuredCarIds) {
    const storyFilename = `story_carro_${String(id).padStart(2, '0')}.jpg`;
    const storySrc = path.join(storiesDir, storyFilename);
    if (fs.existsSync(storySrc)) {
      concatLines.push(`file '${storySrc.replace(/\\/g, '/')}'`);
      concatLines.push(`duration 1.8`);
    }
  }

  // Outro: 3.5 seconds
  concatLines.push(`file '${outroPath.replace(/\\/g, '/')}'`);
  concatLines.push(`duration 3.5`);
  // Repeat last frame for ffmpeg concat requirement
  concatLines.push(`file '${outroPath.replace(/\\/g, '/')}'`);

  fs.writeFileSync(concatFilePath, concatLines.join('\n'), 'utf-8');

  console.log('Compilando vídeo Reel vertical MP4 com FFmpeg (1080x1920 @ 30fps)...');
  const outputMp4 = path.join(reelsDir, 'reel_estoque_domrockfeller.mp4');

  // FFmpeg command generating video + synthesized subtle ambient sound track
  const ffmpegCmd = `ffmpeg -y -f concat -safe 0 -i "${concatFilePath}" -f lavfi -i "sine=frequency=110:duration=22" -c:v libx264 -pix_fmt yuv420p -r 30 -c:a aac -b:a 128k -shortest -movflags +faststart "${outputMp4}"`;

  try {
    execSync(ffmpegCmd, { stdio: 'inherit' });
    console.log(`\n🎉 REEL OFICIAL GERADO COM SUCESSO: ${outputMp4}`);
    console.log(`Arquivo disponível na web em: /reels/reel_estoque_domrockfeller.mp4`);
  } catch (err) {
    console.error('Erro ao compilar com ffmpeg:', err.message);
  }
}

main();
