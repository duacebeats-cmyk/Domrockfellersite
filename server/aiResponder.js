// Dom RockFeller Conversational AI Training Engine
// Analyzes incoming comments and generates high-converting, authoritative legal/financial responses

export class AiResponder {
  constructor() {
    this.companyName = 'Dom RockFeller';
    this.units = ['Vitória (ES) - Enseada do Suá', 'Florianópolis (SC) - Centro'];
    this.whatsappNumber = '(27) 3099-4450';
    this.whatsappUrl = 'https://wa.me/552730994450?text=Ol%C3%A1!%20Comentei%20no%20Instagram%20da%20Dom%20RockFeller%20e%20gostaria%20da%20minha%20an%C3%A1lise%20pericial.';
  }

  /**
   * Treina e classifica a intenção do usuário no comentário
   */
  classifyIntent(commentText) {
    const text = commentText.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    // 1. Ceticismo / Como é possível / Confiança (prioridade alta)
    if (
      text.includes('verdade') || text.includes('golpe') || text.includes('confiavel') ||
      text.includes('como assim') || text.includes('duvido') || text.includes('impossivel') ||
      text.includes('sera') || text.includes('funciona mesmo')
    ) {
      return 'SKEPTICISM_PROOF';
    }

    // 2. Busca e Apreensão / Parcelas em Atraso / Urgência
    if (
      text.includes('busca') || text.includes('apreensao') || text.includes('atraso') ||
      text.includes('atrasada') || text.includes('notificacao') || text.includes('mandado') ||
      text.includes('oficial') || text.includes('guincho') || text.includes('perder')
    ) {
      return 'URGENT_SEIZURE_RISK';
    }

    // 3. Localização / Endereço Físico / Sedes
    if (
      text.includes('onde') || text.includes('endereco') || text.includes('presencial') ||
      text.includes('escritorio') || text.includes('sede') || text.includes('ir ai') ||
      text.includes('conhecer')
    ) {
      return 'LOCATION_INQUIRY';
    }

    // 4. Questionamento de Banco Específico
    if (
      text.includes('bv') || text.includes('pan') || text.includes('santander') ||
      text.includes('bradesco') || text.includes('itau') || text.includes('safra') ||
      text.includes('banco') || text.includes('financeira') || text.includes('c6') ||
      text.includes('daycoval') || text.includes('omni')
    ) {
      return 'SPECIFIC_BANK';
    }

    // 5. Gatilhos Diretos de Quitação / Desconto
    if (
      text.includes('quitar') || text.includes('quitacao') || text.includes('desconto') ||
      text.includes('quero') || text.includes('eu quero') || text.includes('como funciona') ||
      text.includes('analise') || text.includes('valor') || text.includes('preco') || text.includes('info')
    ) {
      return 'TRIGGER_PAYOFF';
    }

    return 'GENERAL_INTEREST';
  }

  /**
   * Gera resposta treinada personalizada baseada na intenção
   */
  generateReply(username, commentText) {
    const intent = this.classifyIntent(commentText);
    const userTag = username ? `@${username}` : 'Olá!';

    switch (intent) {
      case 'TRIGGER_PAYOFF':
        return `${userTag} Excelente decisão! ⚖️🚗 Nossa equipe pericial já separou a sua solicitação. Te enviamos todos os detalhes no seu Direct, ou se preferir atendimento prioritário agora, fale direto com nossos peritos no WhatsApp oficial: ${this.whatsappUrl} (Sedes em Vitória/ES e Floripa/SC).`;

      case 'URGENT_SEIZURE_RISK':
        return `${userTag} Muita atenção nesse momento! 🚨⚠️ O Decreto-Lei 911/69 exige atuação preventiva imediata para salvaguardar o veículo. Nós ajuizamos tutela de urgência e depósito judicial incontroverso antes do mandado. Entre em contato urgente pelo nosso WhatsApp oficial da diretoria: ${this.whatsappUrl} ou venha tomar um café em nossa sede!`;

      case 'SPECIFIC_BANK':
        return `${userTag} Sim! Esse é exatamente um dos bancos com maior incidência de juros abusivos e tarifas indevidas onde mais homologamos acordos judiciais com até 70% de desconto real à vista. Te mandamos uma mensagem no direct para calcularmos o residual do seu carro! 📊`;

      case 'LOCATION_INQUIRY':
        return `${userTag} Atendemos presencialmente em nossas duas sedes executivas: 📍 Vitória/ES (Enseada do Suá - Centro Empresarial Vitória) e 📍 Florianópolis/SC (Centro). Também realizamos perícias em todo o Brasil. Chame nossa equipe no WhatsApp: ${this.whatsappNumber}! 🏛️`;

      case 'SKEPTICISM_PROOF':
        return `${userTag} Sua dúvida é 100% compreensível! A redução não é "mágica", é pura matemática contábil fundamentada no CDC e súmulas do STJ. Os bancos aceitam liquidar à vista porque são obrigados pelo BACEN a provisionar prejuízo de contratos em litígio. Confira nossos casos reais no link da bio! ⚖️`;

      default:
        return `${userTag} Olá! Agradecemos o contato. A Dom RockFeller é especializada em perícia contábil de juros abusivos e ações revisionais legítimas de financiamentos. Te mandamos uma mensagem no direct para orientar o seu caso gratuitamente! ⚖️🚗`;
    }
  }

  /**
   * Roteiro de Conversa Treinado para o Direct (DM) ou WhatsApp
   * Usado para treinar o bot em conversas completas de qualificação de 4 passos
   */
  getConversationPlaybook() {
    return {
      step1_greeting: {
        agent: "Olá! Sou o consultor pericial da Dom RockFeller Soluções. Vi seu interesse no Instagram a respeito da quitação do seu veículo com desconto. Me conta: qual é o modelo e ano do seu carro?",
        purpose: "Identificar o bem e estabelecer conexão inicial"
      },
      step2_financial_audit: {
        agent: "Perfeito! E qual é o banco financiador atual, o valor exato da parcela mensal e quantas prestações ainda faltam para quitar?",
        purpose: "Calcular saldo devedor residual e estimar o anatocismo"
      },
      step3_risk_assessment: {
        agent: "Entendido. No momento, o financiamento está com as parcelas rigorosamente em dia ou houve algum atraso / notificação extrajudicial do banco?",
        purpose: "Mapear urgência de busca e apreensão (Decreto 911/69)"
      },
      step4_closing: {
        agent: "Com base nesses dados preliminares, estimamos que o banco embutiu juros que podem reduzir sua quitação em até 65% a 70% à vista. Gostaria que nosso perito emita o Laudo Preliminar Oficial agora? Você prefere atendimento presencial em Vitória/ES, Floripa/SC ou 100% digital pelo WhatsApp?",
        purpose: "Converter em contrato de assessoria revisional"
      }
    };
  }
}

export const aiResponder = new AiResponder();
