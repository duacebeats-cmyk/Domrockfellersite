// Test script for Instagram Meta Graph API Connection
// Usage: node integrations/instagram/test-connection.js [ACCESS_TOKEN] [ACCOUNT_ID]

import { InstagramService } from '../../server/instagramService.js';

const token = process.argv[2] || process.env.INSTAGRAM_ACCESS_TOKEN;
const accountId = process.argv[3] || process.env.INSTAGRAM_ACCOUNT_ID;

console.log('========================================================');
console.log('   DOM ROCKFELLER - TESTE DE CONEXÃO INSTAGRAM (META)   ');
console.log('========================================================');

if (!token || !accountId) {
  console.log('\n❌ Faltam credenciais para testar!');
  console.log('Uso: node integrations/instagram/test-connection.js <SEU_ACCESS_TOKEN> <SEU_ACCOUNT_ID>');
  console.log('Ou configure as variáveis de ambiente INSTAGRAM_ACCESS_TOKEN e INSTAGRAM_ACCOUNT_ID.\n');
  process.exit(1);
}

console.log(`\nVerificando conta ID: ${accountId}...`);

const ig = new InstagramService(token, accountId);

try {
  const profile = await ig.getProfile();
  if (profile.connected) {
    console.log('\n✅ CONEXÃO ESTABELECIDA COM SUCESSO NA META GRAPH API!');
    console.log(`• Nome da Conta: ${profile.account.name}`);
    console.log(`• @Username: @${profile.account.username}`);
    console.log(`• Seguidores: ${profile.account.followers?.toLocaleString('pt-BR')}`);
    console.log(`• Total de Posts: ${profile.account.postsCount}`);
    console.log(`• Bio: "${profile.account.bio || 'Sem bio informada'}"`);
    console.log('\nO Antigravity agora pode publicar, responder comentários e puxar métricas!');
  } else {
    console.log('\n❌ FALHA AO CONECTAR:');
    console.log(profile.error || profile.message);
  }
} catch (err) {
  console.error('\n❌ Erro inesperado na requisição:', err.message);
}
