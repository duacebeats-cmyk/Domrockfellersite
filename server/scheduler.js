// Dom RockFeller Social Media Auto-Scheduler Engine
// Automatically dispatches scheduled Instagram Posts (12:15) and Reels (19:30)

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { instagramService } from './instagramService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SCHEDULE_FILE = path.join(__dirname, 'data', 'socialSchedule.json');

// Default Content Pipeline for Dom RockFeller (7-Day Strategic Launch)
const INITIAL_SCHEDULE = [
  {
    id: 'sched-day1-post',
    day: 'Dia 1',
    time: '12:15',
    type: 'post',
    title: 'O que é a Tabela Price e o Anatocismo nos Financiamentos',
    imageUrl: 'https://files.catbox.moe/xb54d4.jpg',
    caption: `VOCÊ SABE COMO A TABELA PRICE MULTIPLICA O VALOR DO SEU CARRO? 📊🚗

Quando você financia um veículo em 48 ou 60 meses, o banco calcula as parcelas pela Tabela Price com juros capitalizados mensalmente (juros sobre juros).

Isso significa que até a metade do contrato você praticamente só amortizou juros e taxas embutidas (TAC, seguro prestamista e tarifa de avaliação).

⚖️ Na Dom RockFeller, nossa auditoria pericial contábil recalcula o saldo real incontroverso para:
1. Expurgar tarifas ilegais e juros abusivos acima da taxa média do BACEN;
2. Pleitear o depósito judicial do valor justo na Justiça;
3. Buscar acordo direto com a mesa de crédito com até 70% de desconto real à vista.

💬 Comente "QUITAR" para receber uma auditoria prévia gratuita do seu contrato no direct!

📍 Atendimento presencial: Vitória (ES) e Florianópolis (SC).

#domrockfeller #jurosabusivos #tabelaprice #quitacaodeveiculos #revisionalveiculos #vitoriaes #florianopolis`,
    status: 'scheduled'
  },
  {
    id: 'sched-day1-reel',
    day: 'Dia 1',
    time: '19:30',
    type: 'reel',
    title: 'Recebeu notificação do banco? Os primeiros 5 dias decisivos',
    videoUrl: 'https://files.catbox.moe/xb54d4.jpg', // Placeholder video asset or script
    caption: `RECEBEU NOTIFICAÇÃO DO BANCO? O QUE FAZER NOS PRIMEIROS 5 DIAS 🚨⚠️

Se você recebeu uma notificação extrajudicial pelo Cartório de Títulos e Documentos comunicando o atraso das parcelas, o cronômetro começou a correr.

De acordo com o Decreto-Lei 911/69, o banco credor pode ajuizar a ação de busca e apreensão. Mas você NÃO está indefeso!

⚖️ Ações Imediatas da Assessoria Dom RockFeller:
1. Análise pericial de urgência das taxas de juros contratuais;
2. Protocolo de pedido de tutela de urgência e depósito judicial incontroverso;
3. Abertura de canal direto com a mesa de conciliação bancária antes da execução do mandado.

💬 Comente "URGENTE" ou chame nossa equipe no link da bio para orientação preventiva e sigilosa.

📍 Vitória / ES • Florianópolis / SC

#domrockfeller #buscaeapreensao #notificacaoextrajudicial #decreto911 #revisionaldeveiculos #direitobancario`,
    status: 'scheduled'
  },
  {
    id: 'sched-day2-post',
    day: 'Dia 2',
    time: '12:15',
    type: 'post',
    title: 'Por que os bancos preferem dar 70% de desconto à vista',
    imageUrl: 'https://files.catbox.moe/xb54d4.jpg',
    caption: `POR QUE O BANCO ACEITA QUITAÇÃO COM ATÉ 70% DE DESCONTO À VISTA? 🏦💡

Muitos clientes perguntam: "Por que uma instituição financeira bilionária aceitaria receber R$ 15 mil em um contrato que tinha R$ 50 mil de saldo devedor?"

A resposta está na contabilidade bancária:
1. PDD (Provisão para Créditos de Liquidação Duvidosa): Quando há litígio judicial e inadimplência, as normas do Banco Central obrigam o banco a imobilizar capital próprio para cobrir o risco.
2. Custo do Leilão: Apreender um veículo, pagar guincho, pátio e leiloeiro gera prejuízo imediato. O carro perde até 40% do valor de tabela no leilão.
3. Liquidação Rápida: Para o banco, receber dinheiro vivo à vista e liberar a provisão no balanço trimestral é muito mais lucrativo do que anos de processo judicial.

⚖️ Quer colocar seu contrato na mesa de negociação estratégica?
💬 Comente "DESCONTO" para analisarmos o residual do seu veículo!

#domrockfeller #negociacaobancaria #quitacaocomdesconto #periciacontabil #financiamentoveicular`,
    status: 'scheduled'
  },
  {
    id: 'sched-day2-reel',
    day: 'Dia 2',
    time: '19:30',
    type: 'reel',
    title: 'Você já pagou 24 parcelas e a dívida não caiu?',
    videoUrl: 'https://files.catbox.moe/xb54d4.jpg',
    caption: `PAGOU 2 ANOS DE FINANCIAMENTO E O SALDO NÃO BAIXOU? ASSISTA ISSO 🚗⚖️

Essa é a sensação de 8 em cada 10 brasileiros que financiaram veículos nos últimos 3 anos: você trabalha, paga a prestação todo mês, mas parece que o carro nunca será seu.

Isso acontece porque a maioria dos contratos embute taxas ilegais que devoram o valor que deveria abater o principal da dívida.

🛡️ Nós auditamos o seu contrato, calculamos o saldo real justo e instruímos a ação revisional legítima para buscar a quitação definitiva.

💬 Comente "QUITAR" agora para receber uma avaliação gratuita do seu contrato!

#domrockfeller #jurosabusivos #parceladocarro #financiamentoauto #vitoriaes`,
    status: 'scheduled'
  }
];

export class SocialScheduler {
  constructor() {
    this.schedule = this.loadSchedule();
    this.intervalId = null;
  }

  loadSchedule() {
    try {
      if (!fs.existsSync(SCHEDULE_FILE)) {
        fs.mkdirSync(path.dirname(SCHEDULE_FILE), { recursive: true });
        fs.writeFileSync(SCHEDULE_FILE, JSON.stringify(INITIAL_SCHEDULE, null, 2), 'utf-8');
        return INITIAL_SCHEDULE;
      }
      const raw = fs.readFileSync(SCHEDULE_FILE, 'utf-8');
      return JSON.parse(raw);
    } catch {
      return INITIAL_SCHEDULE;
    }
  }

  saveSchedule() {
    try {
      fs.writeFileSync(SCHEDULE_FILE, JSON.stringify(this.schedule, null, 2), 'utf-8');
    } catch (e) {
      console.error('Erro ao salvar agenda social:', e.message);
    }
  }

  getSchedule() {
    return this.schedule;
  }

  addScheduledItem(item) {
    const newItem = {
      id: `sched-${Date.now()}`,
      day: item.day || 'Hoje',
      time: item.time || '12:15',
      type: item.type || 'post',
      title: item.title,
      imageUrl: item.imageUrl,
      videoUrl: item.videoUrl,
      caption: item.caption,
      status: 'scheduled',
      createdAt: new Date().toISOString()
    };
    this.schedule.push(newItem);
    this.saveSchedule();
    return newItem;
  }

  /**
   * Checagem periódica executada a cada minuto
   */
  async checkAndDispatch() {
    if (!instagramService.isConfigured()) return;

    const now = new Date();
    const currentHours = String(now.getHours()).padStart(2, '0');
    const currentMinutes = String(now.getMinutes()).padStart(2, '0');
    const currentTimeStr = `${currentHours}:${currentMinutes}`;

    for (const item of this.schedule) {
      if (item.status === 'scheduled' && item.time === currentTimeStr) {
        console.log(`[SCHEDULER] Disparando publicação automática: ${item.title} (${item.type})`);
        try {
          let res;
          if (item.type === 'reel' && (item.videoUrl || item.mediaPath)) {
            const mediaUrl = item.videoUrl || item.mediaUrl;
            if (mediaUrl) {
              res = await instagramService.publishReel(mediaUrl, item.caption);
            }
          } else if (item.type === 'story' && (item.imageUrl || item.mediaPath)) {
            const mediaUrl = item.imageUrl || item.mediaUrl;
            if (mediaUrl) {
              res = await instagramService.publishStory(mediaUrl);
            }
          } else if (item.imageUrl || item.mediaPath) {
            const mediaUrl = item.imageUrl || item.mediaUrl;
            if (mediaUrl) {
              res = await instagramService.publishPhoto(mediaUrl, item.caption);
            }
          }
          if (res?.success) {
            item.status = 'published';
            item.publishedAt = new Date().toISOString();
            item.postId = res.postId;
            this.saveSchedule();
            console.log(`[SCHEDULER] ✅ Publicado com sucesso! Post ID: ${res.postId}`);
          }
        } catch (err) {
          console.error(`[SCHEDULER] ❌ Falha ao publicar ${item.id}:`, err.message);
          item.lastError = err.message;
          this.saveSchedule();
        }
      }
    }
  }

  start() {
    if (this.intervalId) return;
    console.log('[SCHEDULER] Dom RockFeller Social Scheduler iniciado (Verificações a cada 60s).');
    this.intervalId = setInterval(() => this.checkAndDispatch(), 60000);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}

export const socialScheduler = new SocialScheduler();
