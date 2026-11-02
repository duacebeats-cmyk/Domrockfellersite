// Batch Publisher for Instagram Stories & Reels - Dom RockFeller
// Uses Meta Graph API with direct media hosting

import fs from 'fs';
import path from 'path';
import { InstagramService } from '../../server/instagramService.js';

const ACCOUNT_ID = '17841414513976883';
const storiesDir = path.join(process.cwd(), 'public', 'stories');
const destaquesDir = path.join(process.cwd(), 'public', 'destaques');
const reelsDir = path.join(process.cwd(), 'public', 'reels');

/**
 * Upload local file to uguu.se to get a public HTTPS direct link for Meta Graph API
 */
async function uploadToPublicHost(filePath) {
  const buffer = fs.readFileSync(filePath);
  const blob = new Blob([buffer], { type: filePath.endsWith('.mp4') ? 'video/mp4' : 'image/jpeg' });
  const filename = path.basename(filePath);

  const formData = new FormData();
  formData.append('files[]', blob, filename);

  const res = await fetch('https://uguu.se/upload.php', {
    method: 'POST',
    body: formData
  });

  const data = await res.json();
  if (data?.success && data.files?.[0]?.url) {
    return data.files[0].url;
  }
  throw new Error(`Falha ao obter URL pública para ${filename}: ${JSON.stringify(data)}`);
}

/**
 * Publish Stories for a batch of cars
 */
export async function publishStoriesBatch(accessToken, carIds = [35, 15, 13, 6, 4, 9, 10, 1, 7]) {
  console.log(`\n======================================================`);
  console.log(`  PUBLICANDO STORIES NO INSTAGRAM (@domrockfellervix)`);
  console.log(`======================================================`);

  const ig = new InstagramService(accessToken, ACCOUNT_ID);
  const results = [];

  for (const id of carIds) {
    const filename = `story_carro_${String(id).padStart(2, '0')}.jpg`;
    const localPath = path.join(storiesDir, filename);

    if (!fs.existsSync(localPath)) {
      console.warn(`Arquivo não encontrado: ${filename}`);
      continue;
    }

    try {
      console.log(`\n[Carro #${id}] 1. Fazendo upload temporário da imagem...`);
      const publicUrl = await uploadToPublicHost(localPath);
      console.log(`[Carro #${id}] URL pública: ${publicUrl}`);

      console.log(`[Carro #${id}] 2. Criando container de Story na Meta Graph API...`);
      const publishRes = await ig.publishStory(publicUrl);
      console.log(`[Carro #${id}] ✅ Story publicado com sucesso! ID: ${publishRes.postId}`);

      results.push({ id, success: true, postId: publishRes.postId });
      
      // Delay de 2 segundos para respeitar limites da Meta
      await new Promise(r => setTimeout(r, 2000));
    } catch (err) {
      console.error(`[Carro #${id}] ❌ Erro ao publicar:`, err.message);
      results.push({ id, success: false, error: err.message });
    }
  }

  return results;
}

/**
 * Publish Highlight Cover Stories (to enable creating highlights in Instagram app)
 */
export async function publishHighlightStories(accessToken) {
  console.log(`\n======================================================`);
  console.log(`  PUBLICANDO CAPAS DE DESTAQUES COMO STORIES          `);
  console.log(`======================================================`);

  const ig = new InstagramService(accessToken, ACCOUNT_ID);
  const highlightFiles = [
    'story_destaque_luxo_importados.jpg',
    'story_destaque_suvs_picapes.jpg',
    'story_destaque_sedans_hatchs.jpg',
    'story_destaque_ate_35_mil.jpg',
    'story_destaque_eletricos_novos.jpg',
    'story_destaque_como_funciona.jpg'
  ];

  const results = [];
  for (const file of highlightFiles) {
    const localPath = path.join(destaquesDir, file);
    try {
      console.log(`\n[Destaque ${file}] Fazendo upload...`);
      const publicUrl = await uploadToPublicHost(localPath);
      console.log(`[Destaque ${file}] Publicando Story...`);
      const res = await ig.publishStory(publicUrl);
      console.log(`[Destaque ${file}] ✅ Publicado! Post ID: ${res.postId}`);
      results.push({ file, success: true, postId: res.postId });
      await new Promise(r => setTimeout(r, 2000));
    } catch (err) {
      console.error(`[Destaque ${file}] ❌ Erro:`, err.message);
      results.push({ file, success: false, error: err.message });
    }
  }
  return results;
}

/**
 * Publish Reel Video to Instagram
 */
export async function publishReelVideo(accessToken) {
  console.log(`\n======================================================`);
  console.log(`  PUBLICANDO VÍDEO REEL NO INSTAGRAM (@domrockfellervix)`);
  console.log(`======================================================`);

  const ig = new InstagramService(accessToken, ACCOUNT_ID);
  const reelPath = path.join(reelsDir, 'reel_estoque_domrockfeller.mp4');

  if (!fs.existsSync(reelPath)) {
    throw new Error('Vídeo do Reel não encontrado em public/reels/reel_estoque_domrockfeller.mp4');
  }

  console.log('1. Fazendo upload temporário do vídeo MP4...');
  const videoUrl = await uploadToPublicHost(reelPath);
  console.log('Vídeo hospedado em:', videoUrl);

  const caption = `🔥 35 VEÍCULOS PARA FUTURA QUITAÇÃO COM ATÉ 70% DE DESCONTO 🚗⚖️

O estoque oficial Dom RockFeller está liberado! Veículos sob gestão jurídica e auditoria forense contratual.

🏆 DESTAQUES DO ESTOQUE:
• Mercedes GLE 400d AMG 4MATIC: R$ 155.000
• BMW 320i M Sport 2023: R$ 120.000
• RAM Rampage Laramie 4x4: R$ 108.000
• BMW X4 xDrive: R$ 68.000
• Toyota Corolla XEi: R$ 60.000
• BYD Dolphin Mini 100% Elétrico: R$ 55.000
• Amarok V6 Highline: R$ 70.000
• Oportunidades a partir de R$ 22.000 (Ka, Fox, Mobi)

💬 QUER O LAUDO DE ALGUM VEÍCULO?
Comente o NOME DO CARRO aqui embaixo ou envie uma mensagem no Direct!

📍 Atendimento Presencial:
Vitória / ES (Enseada do Suá) & Florianópolis / SC (Centro)

#domrockfeller #reels #carros #futuraquitacao #revisionaldeveiculos #vitoriaes #florianopolis`;

  console.log('2. Enviando Reel para a Meta Graph API...');
  const res = await ig.publishReel(videoUrl, caption, true);
  console.log('✅ REEL PUBLICADO COM SUCESSO! Post ID:', res.postId);
  return res;
}

// CLI Execution if token provided via command line: node publish-stories-batch.js <TOKEN>
const tokenArg = process.argv[2];
if (tokenArg) {
  console.log('Token recebido. Iniciando publicação...');
  publishStoriesBatch(tokenArg)
    .then(() => publishHighlightStories(tokenArg))
    .then(() => publishReelVideo(tokenArg))
    .then(() => console.log('\n🎉 TODAS AS PUBLICAÇÕES CONCLUÍDAS COM SUCESSO!'))
    .catch(e => console.error('\n❌ Erro durante o fluxo:', e));
}
