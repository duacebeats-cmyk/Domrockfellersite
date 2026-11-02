// Test AI Training and Responses for Dom RockFeller Instagram Auto-Responder

import { aiResponder } from '../../server/aiResponder.js';

const testCases = [
  { username: 'carlos_silva99', text: 'QUITAR' },
  { username: 'marcos_vitoria', text: 'Estou com 3 parcelas atrasadas e com medo de busca e apreensão do meu carro, o que faço?' },
  { username: 'juliana_carvalho', text: 'O meu financiamento é na BV Financeira, vocês conseguem reduzir a parcela e quitar com desconto?' },
  { username: 'roberto_sc', text: 'Onde fica o escritório físico de vocês em Florianópolis? Quero ir presencialmente.' },
  { username: 'felipe_duvida', text: 'Como é possível dar 70% de desconto na quitação? Isso é confiável mesmo ou é golpe?' }
];

console.log('================================================================');
console.log('   DOM ROCKFELLER - TESTE DE TREINAMENTO DA IA DE CONVERSAS     ');
console.log('================================================================\n');

for (const c of testCases) {
  const intent = aiResponder.classifyIntent(c.text);
  const reply = aiResponder.generateReply(c.username, c.text);
  console.log(`[INTENÇÃO CLASSIFICADA: ${intent}]`);
  console.log(`👤 Comentário de @${c.username}: "${c.text}"`);
  console.log(`🤖 Resposta Automática da IA:\n${reply}`);
  console.log('----------------------------------------------------------------\n');
}
