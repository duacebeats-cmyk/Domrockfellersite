// Publish Official 35 Vehicles Catalog Announcement to @domrockfellervix
import { InstagramService } from '../../server/instagramService.js';

const ACCESS_TOKEN = 'EAAcmjYVUH90BSsyEzZCysBMUBK6mKZCKQo4mF11ux0ZCWFrXF8yHCqYNlaOjkE2D7QI99F02kmc96ihIm0bMJeSVuLyETZAeK8kCF0pmuj5w2uPpem0Kkdy7C3CLVyL7UO46J5YzZAJKZCYyelW1hGwhZAH7pZB4w6vT9BDKV8PcfL2ON0tZBXsY7O2soWc1bFKeVmVqEMe61ZCufu9t9ox7hDELafFUNWFYYZCEbWLrR2ZCGHDRFk6eortL84SORakzCY8tPbh3ggdM583x8RZCeouP7';
const ACCOUNT_ID = '17841414513976883';
const IMAGE_URL = 'https://files.catbox.moe/xb54d4.jpg';

const CAPTION = `ESTOQUE EXCLUSIVO DOM ROCKFELLER: 35 VEÍCULOS PARA FUTURA QUITAÇÃO 🚗⚖️

Chegou a lista completa com os 35 veículos disponíveis para cessão de direitos e futura quitação com até 70% de desconto sobre o saldo devedor bancário!

Confira as categorias e valores de quitação pericial estimada:

💎 LUXO & IMPORTADOS
• Mercedes GLE 400d AMG 4MATIC: R$ 155.000
• BMW 320i M Sport 2023: R$ 120.000
• BMW X2 Blindada 2019: R$ 87.000
• BMW X3 xDrive 2018: R$ 75.000
• Mercedes-Benz A200: R$ 72.000
• BMW X4 xDrive 2018: R$ 68.000
• Mercedes GLA 200: R$ 54.000
• Mini Cooper S: R$ 43.000
• Audi A3 Sedan: R$ 35.000

🚙 SUVs & PICAPES 4x4
• RAM Rampage Laramie 4x4: R$ 108.000
• VW Tiguan Allspace R-Line: R$ 75.000
• VW Amarok V6 Highline: R$ 70.000
• Fiat Toro Ranch 4x4 Diesel: R$ 70.000
• Jeep Renegade 2025: R$ 55.000
• Fiat Fastback Audace: R$ 52.000
• Fiat Toro Volcano 4x4: R$ 48.000
• Jeep Compass Limited: R$ 45.000
• Jeep Renegade Diesel 4x4: R$ 45.000
• Nissan Kicks SV: R$ 39.000
• Chevrolet Tracker: R$ 36.000

🚗 SEDANS & MODERNOS
• Toyota Corolla XEi 2023: R$ 60.000
• Chevrolet Novo Sonic: R$ 67.000
• Chevrolet Spin Premier (7 lug): R$ 55.000
• VW Virtus TSI 2024: R$ 53.000
• Chevrolet Onix Plus Premier: R$ 45.000
• Chevrolet Onix Sedan 2024: R$ 43.000
• Hyundai HB20 Hatch 2025: R$ 38.000

⚡ ELÉTRICOS & NOVOS
• BYD Dolphin Mini 100% Elétrico: R$ 55.000

💰 OPORTUNIDADES ATÉ R$ 35 MIL
• Chevrolet Onix Hatch 2024: R$ 32.000
• Chevrolet Cruze LT: R$ 30.000
• Hyundai HB20 2020: R$ 25.000
• Fiat Mobi Like 2024: R$ 25.000
• Ford Ka SE 2020: R$ 22.000
• VW Fox Comfortline: R$ 22.000

🛡️ SEGURANÇA JURÍDICA:
Contratos 100% periciados, cessão legal com tutela preventiva contra busca e apreensão (Decreto 911/69 e Código Civil).

💬 QUER O DOSSIÊ COMPLETO DE ALGUM MODELO?
Comente aqui embaixo o NOME DO CARRO (ex: "GLE", "320i", "RAMPAGE", "COROLLA" ou "MOBI") que nosso time envia a perícia completa no seu Direct!

📍 Atendimento VIP Presencial:
• Vitória / ES (Enseada do Suá)
• Florianópolis / SC (Centro)

#domrockfeller #estoquedeveiculos #carrosavenda #futuraquitacao #revisionaldeveiculos #direitobancario #vitoriaes #florianopolis #bmwbrasil #mercedesbrasil #rampage #byd`;

async function main() {
  console.log('Publicando anúncio oficial do Estoque dos 35 Veículos no Instagram...');
  const ig = new InstagramService(ACCESS_TOKEN, ACCOUNT_ID);
  
  try {
    const result = await ig.publishPhoto(IMAGE_URL, CAPTION);
    console.log('✅ PUBLICADO COM SUCESSO NO FEED!');
    console.log('Post ID na Meta:', result.postId);
    console.log('Publicado em:', result.publishedAt);
  } catch (err) {
    console.error('❌ Erro ao publicar:', err.message);
  }
}

main();
