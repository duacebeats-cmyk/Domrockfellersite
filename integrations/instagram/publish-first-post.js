// Publish First Official Post to Dom RockFeller Instagram (@domrockfellervix)
import { InstagramService } from '../../server/instagramService.js';

const ACCESS_TOKEN = 'EAAcmjYVUH90BSsyEzZCysBMUBK6mKZCKQo4mF11ux0ZCWFrXF8yHCqYNlaOjkE2D7QI99F02kmc96ihIm0bMJeSVuLyETZAeK8kCF0pmuj5w2uPpem0Kkdy7C3CLVyL7UO46J5YzZAJKZCYyelW1hGwhZAH7pZB4w6vT9BDKV8PcfL2ON0tZBXsY7O2soWc1bFKeVmVqEMe61ZCufu9t9ox7hDELafFUNWFYYZCEbWLrR2ZCGHDRFk6eortL84SORakzCY8tPbh3ggdM583x8RZCeouP7';
const ACCOUNT_ID = '17841414513976883';
const IMAGE_URL = 'https://files.catbox.moe/xb54d4.jpg';

const CAPTION = `O SEGREDO QUE O BANCO NÃO QUER QUE VOCÊ DESCUBRA SOBRE O SEU FINANCIAMENTO ⚖️🚗

Você já sentiu que paga a parcela do carro rigorosamente em dia há meses ou anos, mas quando olha o extrato, a dívida quase não diminui?

Isso não é coincidência. Em grande parte dos contratos de financiamento no Brasil, os bancos embutem juros compostos (anatocismo), tarifas administrativas ilegais e taxas que superam a média divulgada pelo Banco Central.

Na Dom RockFeller, nossa equipe pericial e jurídica atua para restaurar o equilíbrio do seu patrimônio:

1️⃣ Auditoria Pericial Forense do Contrato (cálculo do valor real justo);
2️⃣ Ação Revisional Legítima fundamentada no CDC e súmulas do STJ;
3️⃣ Estratégia de negociação direta com a mesa de crédito para quitação com até 70% de desconto real à vista.

🛡️ Transparência Jurídica Preventiva:
Atuamos com total ciência dos riscos do Decreto-Lei 911/69 (busca e apreensão), instruindo medidas liminares de urgência e depósitos judiciais para proteger o seu veículo enquanto a negociação acontece.

💬 Quer saber o valor real para quitar o seu veículo com desconto?
Comente "QUITAR" aqui embaixo que nossa equipe pericial enviará a simulação preliminar no seu Direct!

Ou acesse o link oficial na nossa bio para atendimento imediato.

📍 Sedes Presenciais:
• Vitória / ES — Enseada do Suá
• Florianópolis / SC — Centro

#domrockfeller #jurosabusivos #revisionaldeveiculos #quitacaodeveiculos #direitobancario #financiamentodecarros #vitoriaes #florianopolis #direitodoconsumidor`;

async function main() {
  console.log('====================================================');
  console.log('   PUBLICANDO 1º POST OFICIAL NO INSTAGRAM DA META  ');
  console.log('====================================================');
  console.log('• Conta: @domrockfellervix');
  console.log('• Imagem:', IMAGE_URL);
  
  const ig = new InstagramService(ACCESS_TOKEN, ACCOUNT_ID);

  try {
    console.log('\nEnviando para a Meta Graph API...');
    const result = await ig.publishPhoto(IMAGE_URL, CAPTION);
    console.log('\n✅ PUBLICADO COM SUCESSO NO FEED!');
    console.log('Post ID na Meta:', result.postId);
    console.log('Publicado em:', result.publishedAt);
  } catch (err) {
    console.error('\n❌ Erro ao publicar:', err.message);
  }
}

main();
