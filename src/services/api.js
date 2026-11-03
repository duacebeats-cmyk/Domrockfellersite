// Dom RockFeller Client API & Auth Service with LocalStorage Fallback
const STORAGE_KEY = 'domrockfeller_leads_v3';
const USERS_KEY = 'domrockfeller_users_v3';
const SESSION_KEY = 'domrockfeller_session_v3';
const QUEUE_KEY = 'domrockfeller_queue_v3';

const INITIAL_FALLBACK_USERS = [
  {
    id: 'usr-admin-1',
    name: 'Diretoria Dom RockFeller',
    email: 'admin@domrockfeller.com.br',
    password: 'admin123',
    phone: '(27) 3099-4450',
    role: 'admin',
    cityUnit: 'Vitória - ES',
    isOnline: true,
    createdAt: '2026-09-01T10:00:00Z'
  },
  {
    id: 'usr-staff-1',
    name: 'Lucas Consultor (Vitória)',
    email: 'atendente@domrockfeller.com.br',
    password: 'atendente123',
    phone: '(27) 99872-3344',
    role: 'funcionario', // ATENDENTE / FUNCIONÁRIO
    cityUnit: 'Vitória - ES',
    isOnline: true,
    createdAt: '2026-09-15T09:00:00Z'
  },
  {
    id: 'usr-client-1',
    name: 'Rodrigo Silveira Ramos',
    email: 'rodrigo.ramos@gmail.com',
    password: 'cliente123',
    phone: '(27) 99874-2210',
    role: 'cliente',
    cityUnit: 'Vitória - ES',
    isOnline: false,
    createdAt: '2026-10-05T09:12:00Z'
  },
  {
    id: 'usr-client-2',
    name: 'Mariana Duarte Becker',
    email: 'mariana.becker@outlook.com',
    password: 'cliente123',
    phone: '(48) 99188-4432',
    role: 'cliente',
    cityUnit: 'Florianópolis - SC',
    isOnline: false,
    createdAt: '2026-09-28T09:40:00Z'
  }
];

const INITIAL_FALLBACK_QUEUE = [
  {
    id: 'ticket-101',
    clientName: 'Carlos Eduardo Mendes',
    clientPhone: '(27) 99844-3321',
    clientEmail: 'carlos.mendes@gmail.com',
    cityUnit: 'Vitória - ES',
    vehicleModel: 'Jeep Compass Longitude 2021',
    status: 'aguardando',
    assignedTo: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
    messages: [
      {
        id: 'msg-1',
        sender: 'cliente',
        senderName: 'Carlos Eduardo Mendes',
        text: 'Olá, estou com 2 parcelas em atraso no Santander e gostaria de saber se consigo suspender a busca e apreensão e quitar.',
        timestamp: new Date(Date.now() - 1000 * 60 * 8).toISOString()
      }
    ]
  }
];

const INITIAL_FALLBACK_LEADS = [
  {
    id: 'lead-101',
    name: 'Rodrigo Silveira Ramos',
    phone: '(27) 99874-2210',
    email: 'rodrigo.ramos@gmail.com',
    cityUnit: 'Vitória - ES',
    vehicleType: 'Carro',
    vehicleModel: 'Jeep Compass Longitude 2021',
    bank: 'Santander Financiamentos',
    installmentValue: 2450,
    installmentsRemaining: 38,
    contractResidualTotal: 93100,
    estimatedPayoff: 29800,
    estimatedSavings: 63300,
    discountPercentage: 68,
    delayStatus: '1 a 3 parcelas em atraso',
    status: 'Negociação Bancária',
    notes: [
      { date: '2026-10-06T14:30:00Z', author: 'Dr. Lucas (Jurídico Vitória)', text: 'Contrato recepcionado. Identificado juros de mora e TAC indevida. Oferta de contraproposta enviada à mesa do Santander.' },
      { date: '2026-10-07T11:00:00Z', author: 'Dra. Camila (Negociação)', text: 'Banco acatou redução preliminar de 55%. Negociando margem final de 68% para fechamento à vista.' }
    ],
    createdAt: '2026-10-05T09:12:00Z',
    updatedAt: '2026-10-07T11:00:00Z'
  },
  {
    id: 'lead-102',
    name: 'Mariana Duarte Becker',
    phone: '(48) 99188-4432',
    email: 'mariana.becker@outlook.com',
    cityUnit: 'Florianópolis - SC',
    vehicleType: 'Carro',
    vehicleModel: 'Toyota Corolla XEi 2022',
    bank: 'BV Financeira',
    installmentValue: 2180,
    installmentsRemaining: 32,
    contractResidualTotal: 69760,
    estimatedPayoff: 22320,
    estimatedSavings: 47440,
    discountPercentage: 68,
    delayStatus: 'Em dia',
    status: 'Quitado com Sucesso',
    notes: [
      { date: '2026-09-28T10:00:00Z', author: 'Patrícia (Atendimento Floripa)', text: 'Cliente com parcelas em dia querendo liquidar antes. Simulação aprovada.' },
      { date: '2026-10-04T16:20:00Z', author: 'Dr. Felipe (Jurídico Floripa)', text: 'Boleto de quitação BV liquidado com 68% de desconto. Baixa de gravame no DETRAN-SC confirmada!' }
    ],
    createdAt: '2026-09-28T09:40:00Z',
    updatedAt: '2026-10-04T16:20:00Z'
  },
  {
    id: 'lead-103',
    name: 'Guilherme Fontana',
    phone: '(48) 98845-9011',
    email: 'guilherme.fontana@empresa.com.br',
    cityUnit: 'Florianópolis - SC',
    vehicleType: 'Caminhão',
    vehicleModel: 'VW Delivery 9.170 2020',
    bank: 'Bradesco Financiamentos',
    installmentValue: 3950,
    installmentsRemaining: 44,
    contractResidualTotal: 173800,
    estimatedPayoff: 55600,
    estimatedSavings: 118200,
    discountPercentage: 68,
    delayStatus: 'Mais de 3 parcelas / Risco de Busca e Apreensão',
    status: 'Proposta Enviada',
    notes: [
      { date: '2026-10-07T08:15:00Z', author: 'Dr. Felipe (Jurídico Floripa)', text: 'Urgência devido a notificação extrajudicial do Bradesco. Blindagem patrimonial e proposta de R$ 55.600 apresentada à mesa.' }
    ],
    createdAt: '2026-10-06T18:40:00Z',
    updatedAt: '2026-10-07T08:15:00Z'
  },
  {
    id: 'lead-104',
    name: 'Beatriz Vasconcellos Silva',
    phone: '(27) 99654-7789',
    email: 'beatriz.vasc@gmail.com',
    cityUnit: 'Vitória - ES',
    vehicleType: 'Carro',
    vehicleModel: 'Hyundai Creta Pulse 2021',
    bank: 'Banco Pan',
    installmentValue: 1980,
    installmentsRemaining: 28,
    contractResidualTotal: 55440,
    estimatedPayoff: 18850,
    estimatedSavings: 36590,
    discountPercentage: 66,
    delayStatus: 'Em dia',
    status: 'Em Análise',
    notes: [
      { date: '2026-10-07T16:50:00Z', author: 'Mariana (Atendimento Vitória)', text: 'Cliente enviou cópia do contrato e carnê. Avaliação pericial da taxa de juros em andamento.' }
    ],
    createdAt: '2026-10-07T16:00:00Z',
    updatedAt: '2026-10-07T16:50:00Z'
  },
  {
    id: 'lead-105',
    name: 'Fábio Meireles Souza',
    phone: '(27) 99712-6543',
    email: 'fabio.meireles@uol.com.br',
    cityUnit: 'Vitória - ES',
    vehicleType: 'Carro',
    vehicleModel: 'Chevrolet Onix Premier 2023',
    bank: 'Itaú / Itaucard',
    installmentValue: 1650,
    installmentsRemaining: 42,
    contractResidualTotal: 69300,
    estimatedPayoff: 22800,
    estimatedSavings: 46500,
    discountPercentage: 67,
    delayStatus: '1 a 3 parcelas em atraso',
    status: 'Novo Lead',
    notes: [
      { date: '2026-10-08T09:10:00Z', author: 'Sistema (Simulador Web)', text: 'Lead gerado via formulário do site. Unidade Vitória selecionada.' }
    ],
    createdAt: '2026-10-08T09:10:00Z',
    updatedAt: '2026-10-08T09:10:00Z'
  }
];

function getLocalUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) {
      localStorage.setItem(USERS_KEY, JSON.stringify(INITIAL_FALLBACK_USERS));
      return INITIAL_FALLBACK_USERS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_FALLBACK_USERS;
  }
}

function saveLocalUsers(users) {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch (e) {
    console.error(e);
  }
}

function getLocalQueue() {
  try {
    const raw = localStorage.getItem(QUEUE_KEY);
    if (!raw) {
      localStorage.setItem(QUEUE_KEY, JSON.stringify(INITIAL_FALLBACK_QUEUE));
      return INITIAL_FALLBACK_QUEUE;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_FALLBACK_QUEUE;
  }
}

function saveLocalQueue(queue) {
  try {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  } catch (e) {
    console.error(e);
  }
}

function getLocalLeads() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_FALLBACK_LEADS));
      return INITIAL_FALLBACK_LEADS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_FALLBACK_LEADS;
  }
}

function saveLocalLeads(leads) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
  } catch (e) {
    console.error(e);
  }
}

export function getAuthHeaders(customHeaders = {}) {
  const headers = { 'Content-Type': 'application/json', ...customHeaders };
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (raw) {
      const user = JSON.parse(raw);
      if (user && user.token) {
        headers['Authorization'] = `Bearer ${user.token}`;
      }
    }
  } catch (e) {}
  return headers;
}

export const api = {
  getAuthHeaders,

  // ================= AUTHENTICATION =================
  getCurrentUser() {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  },

  setCurrentUser(user) {
    if (user) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  },

  logout() {
    localStorage.removeItem(SESSION_KEY);
  },

  async login(email, password) {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        const userWithToken = { ...data.user, token: data.token };
        this.setCurrentUser(userWithToken);
        return { success: true, user: userWithToken };
      }
      return { success: false, message: data.message || 'Credenciais inválidas.' };
    } catch (e) {
      console.warn('Backend API offline, using local users database');
    }

    const users = getLocalUsers();
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim() && (u.password === password || u.password.startsWith('scrypt$')));
    if (found) {
      const { password: _, ...safeUser } = found;
      this.setCurrentUser(safeUser);
      return { success: true, user: safeUser };
    }
    return { success: false, message: 'E-mail ou senha incorretos.' };
  },

  async register({ name, email, password, phone, cityUnit }) {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone, cityUnit })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        const userWithToken = { ...data.user, token: data.token };
        this.setCurrentUser(userWithToken);
        return { success: true, user: userWithToken };
      }
      return { success: false, message: data.message || 'Erro ao registrar.' };
    } catch (e) {
      console.warn('Backend API offline, registering locally');
    }

    const users = getLocalUsers();
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase().trim())) {
      return { success: false, message: 'Já existe uma conta com este e-mail.' };
    }

    const newUser = {
      id: `usr-${Date.now()}`,
      name,
      email: email.toLowerCase().trim(),
      password,
      phone: phone || '',
      role: 'cliente', // STRICT: new accounts are CLIENTE
      cityUnit: cityUnit || 'Vitória - ES',
      isOnline: false,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    saveLocalUsers(users);

    const { password: _, ...safeUser } = newUser;
    this.setCurrentUser(safeUser);
    return { success: true, user: safeUser };
  },

  async socialLogin(provider) {
    const isGoogle = provider.toLowerCase() === 'google';
    const email = isGoogle ? 'usuario.google@gmail.com' : 'usuario.facebook@facebook.com';
    const name = isGoogle ? 'Usuário Google' : 'Usuário Facebook';

    const users = getLocalUsers();
    let user = users.find(u => u.email.toLowerCase() === email);
    if (!user) {
      user = {
        id: `usr-${provider.toLowerCase()}-${Date.now()}`,
        name,
        email,
        phone: '(27) 99888-0000',
        role: 'cliente',
        cityUnit: 'Vitória - ES',
        authProvider: provider,
        isOnline: true,
        createdAt: new Date().toISOString()
      };
      users.push(user);
      saveLocalUsers(users);
    }
    const { password: _, ...safeUser } = user;
    this.setCurrentUser(safeUser);
    return { success: true, user: safeUser };
  },

  async getUsers() {
    try {
      const res = await fetch('/api/users', {
        headers: getAuthHeaders()
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (e) {
      console.warn('API offline, getting local users');
    }
    const users = getLocalUsers();
    return users.map(({ password, ...u }) => u);
  },

  async updateUserRole(userId, newRole) {
    try {
      const res = await fetch(`/api/users/${userId}/role`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ role: newRole })
      });
      if (res.ok) {
        const json = await res.json();
        return json;
      }
    } catch (e) {
      console.warn('API offline, updating user locally');
    }

    const users = getLocalUsers();
    const idx = users.findIndex(u => u.id === userId);
    if (idx !== -1) {
      users[idx].role = newRole;
      saveLocalUsers(users);
      const { password, ...safe } = users[idx];
      return { success: true, user: safe };
    }
    return { success: false, message: 'Usuário não encontrado' };
  },

  async toggleAgentStatus(userId, isOnline) {
    try {
      const res = await fetch('/api/agents/toggle-status', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ userId, isOnline })
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    const users = getLocalUsers();
    const u = users.find(x => x.id === userId);
    if (u) {
      u.isOnline = isOnline;
      saveLocalUsers(users);
    }
    return { success: true, isOnline };
  },

  async getOnlineAgentsStatus() {
    try {
      const res = await fetch('/api/agents/status', {
        headers: getAuthHeaders()
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    const users = getLocalUsers();
    const online = users.filter(u => (u.role === 'admin' || u.role === 'funcionario') && u.isOnline);
    return { success: true, onlineCount: online.length, agents: online };
  },

  // ================= LIVE CHAT QUEUE (HUMAN ATTENDANCE) =================
  async getChatQueue() {
    try {
      const res = await fetch('/api/chat-queue', {
        headers: getAuthHeaders()
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (e) {}
    return getLocalQueue();
  },

  async joinChatQueue(ticketData) {
    try {
      const res = await fetch('/api/chat-queue/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ticketData)
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (e) {}

    const queue = getLocalQueue();
    const newTicket = {
      id: `ticket-${Date.now()}`,
      clientName: ticketData.clientName,
      clientPhone: ticketData.clientPhone || '',
      clientEmail: ticketData.clientEmail || '',
      cityUnit: ticketData.cityUnit || 'Vitória - ES',
      vehicleModel: ticketData.vehicleModel || 'Veículo em análise',
      status: 'aguardando',
      assignedTo: null,
      createdAt: new Date().toISOString(),
      messages: [
        {
          id: `msg-${Date.now()}`,
          sender: 'cliente',
          senderName: ticketData.clientName,
          text: ticketData.initialMessage || 'Olá! Gostaria de falar com um atendente.',
          timestamp: new Date().toISOString()
        }
      ]
    };
    queue.unshift(newTicket);
    saveLocalQueue(queue);
    return newTicket;
  },

  async assignTicket(ticketId, agentData) {
    try {
      const res = await fetch(`/api/chat-queue/${ticketId}/assign`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(agentData)
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (e) {}

    const queue = getLocalQueue();
    const t = queue.find(x => x.id === ticketId);
    if (t) {
      t.status = 'em_atendimento';
      t.assignedTo = agentData;
      t.messages.push({
        id: `msg-${Date.now()}`,
        sender: 'sistema',
        senderName: 'Sistema',
        text: `🔔 O atendente ${agentData.agentName} entrou na sala e assumiu o atendimento.`,
        timestamp: new Date().toISOString()
      });
      saveLocalQueue(queue);
      return t;
    }
    return null;
  },

  async sendTicketMessage(ticketId, messageData) {
    try {
      const res = await fetch(`/api/chat-queue/${ticketId}/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messageData)
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (e) {}

    const queue = getLocalQueue();
    const t = queue.find(x => x.id === ticketId);
    if (t) {
      const newMsg = {
        id: `msg-${Date.now()}`,
        sender: messageData.sender || 'atendente',
        senderName: messageData.senderName || 'Atendente',
        text: messageData.text,
        timestamp: new Date().toISOString()
      };
      t.messages.push(newMsg);
      saveLocalQueue(queue);
      return newMsg;
    }
    return null;
  },

  async getTicket(ticketId) {
    try {
      const res = await fetch(`/api/chat-queue/${ticketId}`);
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (e) {}

    const queue = getLocalQueue();
    return queue.find(x => x.id === ticketId) || null;
  },

  async closeTicket(ticketId) {
    try {
      const res = await fetch(`/api/chat-queue/${ticketId}/close`, {
        method: 'POST',
        headers: getAuthHeaders()
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (e) {}

    const queue = getLocalQueue();
    const t = queue.find(x => x.id === ticketId);
    if (t) {
      t.status = 'finalizado';
      saveLocalQueue(queue);
      return t;
    }
    return null;
  },

  // ================= CLIENT & LEADS =================
  async getMyCases(email, phone) {
    try {
      const params = new URLSearchParams();
      if (email) params.append('email', email);
      if (phone) params.append('phone', phone);
      const res = await fetch(`/api/client/my-cases?${params.toString()}`, {
        headers: getAuthHeaders()
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (e) {}

    const leads = getLocalLeads();
    return leads.filter(l => {
      const matchEmail = email && l.email && l.email.toLowerCase() === email.toLowerCase();
      const matchPhone = phone && l.phone && l.phone.replace(/\D/g, '') === phone.replace(/\D/g, '');
      return matchEmail || matchPhone;
    });
  },

  async getLeads(filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.unit) params.append('unit', filters.unit);
      if (filters.status) params.append('status', filters.status);
      if (filters.delay) params.append('delay', filters.delay);

      const res = await fetch(`/api/leads?${params.toString()}`, {
        headers: getAuthHeaders()
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (e) {}

    let leads = getLocalLeads();
    if (filters.search) {
      const q = filters.search.toLowerCase();
      leads = leads.filter(l =>
        l.name.toLowerCase().includes(q) ||
        l.phone.toLowerCase().includes(q) ||
        l.vehicleModel.toLowerCase().includes(q) ||
        l.bank.toLowerCase().includes(q)
      );
    }
    if (filters.unit && filters.unit !== 'Todas') {
      leads = leads.filter(l => l.cityUnit.toLowerCase().includes(filters.unit.toLowerCase()));
    }
    if (filters.status && filters.status !== 'Todos') {
      leads = leads.filter(l => l.status === filters.status);
    }
    if (filters.delay && filters.delay !== 'Todos') {
      leads = leads.filter(l => l.delayStatus === filters.delay);
    }
    return leads.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  },

  async createLead(leadData) {
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadData)
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (e) {}

    const pValue = Number(leadData.installmentValue) || 1500;
    const pRemaining = Number(leadData.installmentsRemaining) || 36;
    const contractResidualTotal = pValue * pRemaining;
    const discountRate = leadData.delayStatus && leadData.delayStatus.includes('Mais de 3') ? 0.72 : 0.68;
    const estimatedPayoff = Math.round(contractResidualTotal * (1 - discountRate));
    const estimatedSavings = contractResidualTotal - estimatedPayoff;

    const newLead = {
      id: `lead-${Date.now()}`,
      ...leadData,
      installmentValue: pValue,
      installmentsRemaining: pRemaining,
      contractResidualTotal,
      estimatedPayoff,
      estimatedSavings,
      discountPercentage: Math.round(discountRate * 100),
      status: leadData.status || 'Novo Lead',
      notes: [
        {
          date: new Date().toISOString(),
          author: 'Sistema Dom RockFeller',
          text: `Simulação registrada: Saldo R$ ${contractResidualTotal.toLocaleString('pt-BR')} por R$ ${estimatedPayoff.toLocaleString('pt-BR')} estimados.`
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const current = getLocalLeads();
    current.unshift(newLead);
    saveLocalLeads(current);
    return newLead;
  },

  async updateLead(id, updates) {
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (e) {}

    const current = getLocalLeads();
    const idx = current.findIndex(l => l.id === id);
    if (idx !== -1) {
      const existing = current[idx];
      const updatedNotes = [...existing.notes];
      if (updates.noteText) {
        updatedNotes.unshift({
          date: new Date().toISOString(),
          author: updates.noteAuthor || 'Consultor Dom RockFeller',
          text: updates.noteText
        });
      }
      const updated = {
        ...existing,
        ...updates,
        notes: updatedNotes,
        updatedAt: new Date().toISOString()
      };
      current[idx] = updated;
      saveLocalLeads(current);
      return updated;
    }
    return null;
  },

  async deleteLead(id) {
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (res.ok) return true;
    } catch (e) {}
    const current = getLocalLeads();
    const filtered = current.filter(l => l.id !== id);
    saveLocalLeads(filtered);
    return true;
  },

  // ================= BULK ACTIONS (AÇÕES EM MASSA) =================
  async bulkUpdateStatus(ids, status, author) {
    try {
      const res = await fetch('/api/leads/bulk-status', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ ids, status, author })
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    const current = getLocalLeads();
    const now = new Date().toISOString();
    const updated = current.map(l => {
      if (ids.includes(l.id)) {
        const notes = [...(l.notes || [])];
        notes.unshift({
          date: now,
          author: author || 'Diretoria Dom RockFeller',
          text: `Status alterado em massa para: "${status}".`
        });
        let pay = l.paymentStatus;
        if (status.toLowerCase().includes('pago')) pay = 'Pago';
        return { ...l, status, paymentStatus: pay, notes, updatedAt: now };
      }
      return l;
    });
    saveLocalLeads(updated);
    return { success: true, count: ids.length };
  },

  async bulkUpdatePayment(ids, paymentStatus, author) {
    try {
      const res = await fetch('/api/leads/bulk-payment', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ ids, paymentStatus, author })
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    const current = getLocalLeads();
    const now = new Date().toISOString();
    const updated = current.map(l => {
      if (ids.includes(l.id)) {
        const notes = [...(l.notes || [])];
        notes.unshift({
          date: now,
          author: author || 'Diretoria Dom RockFeller',
          text: `Status financeiro alterado em lote para: "${paymentStatus.toUpperCase()}".`
        });
        let st = l.status;
        if (paymentStatus === 'Pago' && !l.status.includes('Pago') && !l.status.includes('Quitado')) {
          st = 'Pago / Baixa de Gravame';
        }
        return { ...l, paymentStatus, status: st, notes, updatedAt: now };
      }
      return l;
    });
    saveLocalLeads(updated);
    return { success: true, count: ids.length };
  },

  async bulkDeleteLeads(ids) {
    try {
      const res = await fetch('/api/leads/bulk-delete', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ ids })
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    const current = getLocalLeads();
    const filtered = current.filter(l => !ids.includes(l.id));
    saveLocalLeads(filtered);
    return { success: true, count: ids.length };
  },

  async getStats() {
    try {
      const res = await fetch('/api/stats', {
        headers: getAuthHeaders()
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (e) {}

    const leads = getLocalLeads();
    return {
      totalLeads: leads.length,
      unitVitoria: leads.filter(l => l.cityUnit.includes('Vitória')).length,
      unitFloripa: leads.filter(l => l.cityUnit.includes('Florianópolis')).length,
      totalResidual: leads.reduce((acc, c) => acc + (c.contractResidualTotal || 0), 0),
      totalEstimatedSavings: leads.reduce((acc, c) => acc + (c.estimatedSavings || 0), 0),
      completedLeads: leads.filter(l => l.status === 'Quitado com Sucesso').length,
      globalStats: {
        totalSettledAmount: 18450000,
        totalVehiclesCleared: 3840,
        averageDiscountPercentage: 68,
        activeNegotiations: 245
      }
    };
  },

  async sendChatMessage(message) {
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {}

    return {
      reply: `Olá! Sou o **AutoBot**, assistente virtual da **Dom RockFeller**. Posso te orientar sobre como quitar seu veículo com até **70% de desconto** ou transferir para um **atendente humano** da nossa equipe.`,
      actions: [
        { label: 'Simular Quitação', action: 'open_simulator' },
        { label: '🙋 Falar com Atendente Humano', action: 'join_queue' },
        { label: 'Sede Vitória (ES)', action: 'schedule_vitoria' },
        { label: 'Sede Floripa (SC)', action: 'schedule_floripa' }
      ]
    };
  },

  // Instagram Integration Methods
  async getInstagramStatus() {
    try {
      const res = await fetch('/api/instagram/status', {
        headers: getAuthHeaders()
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    return { isConfigured: false, connected: false };
  },

  async setInstagramConfig(accessToken, accountId) {
    try {
      const res = await fetch('/api/instagram/config', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ accessToken, accountId })
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    return { success: false };
  },

  async getInstagramPosts() {
    try {
      const res = await fetch('/api/instagram/posts', {
        headers: getAuthHeaders()
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    return { success: false, posts: [] };
  },

  async publishInstagramPost(payload) {
    try {
      const res = await fetch('/api/instagram/publish', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    return { success: false };
  },

  async replyInstagramComment(commentId, message) {
    try {
      const res = await fetch('/api/instagram/reply-comment', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ commentId, message })
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    return { success: false };
  },

  async resetDemoData() {
    try {
      await fetch('/api/reset-demo', {
        method: 'POST',
        headers: getAuthHeaders()
      });
    } catch (e) {}
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_FALLBACK_LEADS));
    localStorage.setItem(USERS_KEY, JSON.stringify(INITIAL_FALLBACK_USERS));
    localStorage.setItem(QUEUE_KEY, JSON.stringify(INITIAL_FALLBACK_QUEUE));
    return INITIAL_FALLBACK_LEADS;
  }
};
