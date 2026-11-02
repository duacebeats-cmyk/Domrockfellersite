import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { instagramService } from './instagramService.js';
import { socialScheduler } from './scheduler.js';
import { commentWatcher } from './commentWatcher.js';
import { aiResponder } from './aiResponder.js';
import {
  hashPassword,
  verifyPassword,
  createToken,
  securityHeadersMiddleware,
  globalRateLimiterMiddleware,
  authRateLimiter,
  registerRateLimiter,
  leadRateLimiter,
  chatRateLimiter,
  sanitizeBodyMiddleware,
  authenticateToken,
  requireAuth,
  requireRole
} from './security.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// 1. HTTP Security Headers (Proteção contra clickjacking, MIME-sniffing, XSS)
app.use(securityHeadersMiddleware);

// 2. Global Rate Limiter contra DDoS e spam de requisições
app.use(globalRateLimiterMiddleware);

// 3. CORS com restrição e credenciais seguras
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || origin.includes('localhost') || origin.includes('127.0.0.1') || origin.includes('domrockfeller.com.br')) {
      callback(null, true);
    } else {
      callback(new Error('Bloqueado pela política de segurança CORS'));
    }
  },
  credentials: true
}));

// 4. Limitação estrita de tamanho de payload para prevenir exaustão de memória
app.use(express.json({ limit: '1mb' }));

// 5. Sanitização recursiva do body contra injeções de script/HTML
app.use(sanitizeBodyMiddleware);

// 6. Autenticação criptográfica de Bearer Token
app.use(authenticateToken);

app.use(express.static(path.join(__dirname, '../public')));

const DIST_DIR = path.join(__dirname, '../dist');
if (fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR));
}

const DATA_DIR = path.join(__dirname, 'data');
const DB_PATH = path.join(DATA_DIR, 'database.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial realistic seed data for Vitória (ES) and Florianópolis (SC)
const INITIAL_DATA = {
  users: [
    {
      id: 'usr-admin-1',
      name: 'Diretoria Dom RockFeller',
      email: 'admin@domrockfeller.com.br',
      password: 'admin123',
      phone: '(27) 3099-4450',
      role: 'admin', // 'admin' | 'funcionario' | 'cliente'
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
  ],
  chatQueue: [
    {
      id: 'ticket-101',
      clientName: 'Carlos Eduardo Mendes',
      clientPhone: '(27) 99844-3321',
      clientEmail: 'carlos.mendes@gmail.com',
      cityUnit: 'Vitória - ES',
      vehicleModel: 'Jeep Compass Longitude 2021',
      status: 'aguardando', // 'aguardando' | 'em_atendimento' | 'finalizado'
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
  ],
  leads: [
    {
      id: 'contract-101',
      name: 'Rodrigo Silveira Ramos',
      phone: '(27) 99874-2210',
      email: 'rodrigo.ramos@gmail.com',
      cityUnit: 'Vitória - ES',
      vehicleType: 'Carro',
      vehicleModel: 'Jeep Compass Longitude 2021',
      vehiclePlate: 'RQK-4E28',
      bank: 'Santander Financiamentos',
      processNumber: '0012845-88.2026.8.08.0024 (4ª Vara Cível de Vitória)',
      installmentValue: 2450,
      installmentsRemaining: 38,
      contractResidualTotal: 93100,
      estimatedPayoff: 29800,
      estimatedSavings: 63300,
      discountPercentage: 68,
      delayStatus: '1 a 3 parcelas em atraso',
      status: 'Ação Revisional Protocolada',
      paymentStatus: 'Pendente',
      notes: [
        { date: '2026-10-08T10:15:00Z', author: 'Dr. Lucas (Jurídico Vitória)', text: 'Petição inicial distribuída na 4ª Vara Cível de Vitória. Pleiteado pedido liminar e autorização para depósito incontroverso de R$ 940/mês.' },
        { date: '2026-10-06T14:30:00Z', author: 'Perito Contábil Carlos (Dom RockFeller)', text: 'Laudo pericial contábil finalizado comprovando taxa de juros 2.8% a.m. contra média BACEN de 1.45% a.m.' }
      ],
      createdAt: '2026-10-05T09:12:00Z',
      updatedAt: '2026-10-08T10:15:00Z'
    },
    {
      id: 'contract-102',
      name: 'Mariana Duarte Becker',
      phone: '(48) 99188-4432',
      email: 'mariana.becker@outlook.com',
      cityUnit: 'Florianópolis - SC',
      vehicleType: 'Carro',
      vehicleModel: 'Toyota Corolla XEi 2022',
      vehiclePlate: 'RIX-9A10',
      bank: 'BV Financeira',
      processNumber: '5004123-10.2026.8.24.0001 (2ª Vara Cível de Florianópolis)',
      installmentValue: 2180,
      installmentsRemaining: 32,
      contractResidualTotal: 69760,
      estimatedPayoff: 22320,
      estimatedSavings: 47440,
      discountPercentage: 68,
      delayStatus: 'Em dia',
      status: 'Pago / Baixa de Gravame',
      paymentStatus: 'Pago',
      notes: [
        { date: '2026-10-04T16:20:00Z', author: 'Dr. Felipe (Jurídico Floripa)', text: 'Boleto bancário oficial de liquidação BV pago com sucesso! Protocolo de baixa de gravame confirmado no DETRAN-SC.' },
        { date: '2026-10-02T11:00:00Z', author: 'Dra. Camila (Conciliação)', text: 'Acordo judicial homologado pelo magistrado nos autos do processo nº 5004123-10.2026.8.24.0001.' }
      ],
      createdAt: '2026-09-28T09:40:00Z',
      updatedAt: '2026-10-04T16:20:00Z'
    },
    {
      id: 'contract-103',
      name: 'Guilherme Fontana',
      phone: '(48) 98845-9011',
      email: 'guilherme.fontana@empresa.com.br',
      cityUnit: 'Florianópolis - SC',
      vehicleType: 'Caminhão',
      vehicleModel: 'VW Delivery 9.170 2020',
      vehiclePlate: 'MCP-8H91',
      bank: 'Bradesco Financiamentos',
      processNumber: '5008920-44.2026.8.24.0090 (Vara Regional Bancária)',
      installmentValue: 3950,
      installmentsRemaining: 44,
      contractResidualTotal: 173800,
      estimatedPayoff: 55600,
      estimatedSavings: 118200,
      discountPercentage: 68,
      delayStatus: 'Mais de 3 parcelas / Risco de Busca e Apreensão',
      status: 'Depósito Incontroverso Ativo',
      paymentStatus: 'Em Negociação',
      notes: [
        { date: '2026-10-07T08:15:00Z', author: 'Dr. Felipe (Jurídico Floripa)', text: 'Comprovante do 1º depósito judicial incontroverso juntado aos autos. Proteção preventiva contra atos de busca e apreensão comunicada ao banco.' },
        { date: '2026-10-06T18:40:00Z', author: 'Dra. Camila (Jurídico)', text: 'Cliente orientado com transparência sobre os riscos do Decreto-Lei 911/69. Defesa prévia protocolada.' }
      ],
      createdAt: '2026-10-06T18:40:00Z',
      updatedAt: '2026-10-07T08:15:00Z'
    },
    {
      id: 'contract-104',
      name: 'Beatriz Vasconcellos Silva',
      phone: '(27) 99654-7789',
      email: 'beatriz.vasc@gmail.com',
      cityUnit: 'Vitória - ES',
      vehicleType: 'Carro',
      vehicleModel: 'Hyundai Creta Pulse 2021',
      vehiclePlate: 'ODU-3G15',
      bank: 'Banco Pan',
      processNumber: 'Em elaboração pericial',
      installmentValue: 1980,
      installmentsRemaining: 28,
      contractResidualTotal: 55440,
      estimatedPayoff: 18850,
      estimatedSavings: 36590,
      discountPercentage: 66,
      delayStatus: 'Em dia',
      status: 'Ficha em Análise',
      paymentStatus: 'Pendente',
      notes: [
        { date: '2026-10-07T16:50:00Z', author: 'Perito Contábil Carlos (Vitória)', text: 'Ficha em análise pericial. Auditoria contábil de juros abusivos e venda casada de seguro prestamista em curso.' }
      ],
      createdAt: '2026-10-07T16:00:00Z',
      updatedAt: '2026-10-07T16:50:00Z'
    },
    {
      id: 'contract-105',
      name: 'Fábio Meireles Souza',
      phone: '(27) 99712-6543',
      email: 'fabio.meireles@uol.com.br',
      cityUnit: 'Vitória - ES',
      vehicleType: 'Carro',
      vehicleModel: 'Chevrolet Onix Premier 2023',
      vehiclePlate: 'SPU-2B44',
      bank: 'Itaú / Itaucard',
      processNumber: 'Pendente envio de documentação',
      installmentValue: 1650,
      installmentsRemaining: 42,
      contractResidualTotal: 69300,
      estimatedPayoff: 22800,
      estimatedSavings: 46500,
      discountPercentage: 67,
      delayStatus: '1 a 3 parcelas em atraso',
      status: 'Pendente Documentação',
      paymentStatus: 'Pendente',
      notes: [
        { date: '2026-10-08T09:10:00Z', author: 'Atendimento Vitória', text: 'Solicitado envio de fotos legíveis do CRLV e do contrato original para o perito concluir a impugnação de encargos.' }
      ],
      createdAt: '2026-10-08T09:10:00Z',
      updatedAt: '2026-10-08T09:10:00Z'
    },
    {
      id: 'contract-106',
      name: 'Carlos Eduardo Mendes',
      phone: '(27) 99844-3321',
      email: 'carlos.mendes@gmail.com',
      cityUnit: 'Vitória - ES',
      vehicleType: 'Carro',
      vehicleModel: 'Jeep Renegade Trailhawk 2022',
      vehiclePlate: 'FKM-7H33',
      bank: 'Banco Safra',
      processNumber: '0034190-12.2026.8.08.0024 (1ª Vara Cível)',
      installmentValue: 2790,
      installmentsRemaining: 36,
      contractResidualTotal: 100440,
      estimatedPayoff: 32140,
      estimatedSavings: 68300,
      discountPercentage: 68,
      delayStatus: '1 a 3 parcelas em atraso',
      status: 'Acordo Homologado (Pendente Pagamento)',
      paymentStatus: 'Pendente',
      notes: [
        { date: '2026-10-08T11:40:00Z', author: 'Dra. Camila (Jurídico Vitória)', text: 'Banco Safra acatou a proposta de quitação integral com redução de 68%. Boleto bancário oficial de liquidação emitido com vencimento para 15/10/2026. Aguardando pagamento.' }
      ],
      createdAt: '2026-10-04T14:20:00Z',
      updatedAt: '2026-10-08T11:40:00Z'
    }
  ],
  stats: {
    totalSettledAmount: 18450000,
    totalVehiclesCleared: 3840,
    averageDiscountPercentage: 68,
    activeNegotiations: 245
  }
};

function readDb() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      fs.writeFileSync(DB_PATH, JSON.stringify(INITIAL_DATA, null, 2), 'utf-8');
      return INITIAL_DATA;
    }
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    let data;
    try {
      data = JSON.parse(raw);
    } catch (e) {
      data = { ...INITIAL_DATA };
    }

    // Ensure leads / contracts exist
    if (!data.leads || data.leads.length === 0) {
      data.leads = INITIAL_DATA.leads;
    }

    // Ensure chatQueue exists
    if (!data.chatQueue) {
      data.chatQueue = INITIAL_DATA.chatQueue;
    }

    // Ensure staff/admin users exist
    if (!data.users) {
      data.users = INITIAL_DATA.users;
    } else {
      const hasStaff = data.users.some(u => u.email === 'atendente@domrockfeller.com.br');
      if (!hasStaff) {
        data.users.push(INITIAL_DATA.users.find(u => u.email === 'atendente@domrockfeller.com.br'));
      }
      const hasAdmin = data.users.some(u => u.email === 'admin@domrockfeller.com.br');
      if (!hasAdmin) {
        data.users.push(INITIAL_DATA.users.find(u => u.email === 'admin@domrockfeller.com.br'));
      }
    }
    return data;
  } catch (err) {
    console.error('Error reading database, resetting:', err);
    return INITIAL_DATA;
  }
}

function writeDb(data) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing database:', err);
    return false;
  }
}

readDb();

// ==================== AUTHENTICATION & USERS ENDPOINTS ====================

// 1. Login (Protegido por rate-limiting, scrypt hash e HMAC session token)
app.post('/api/auth/login', (req, res) => {
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  if (authRateLimiter.isLimited(ip)) {
    return res.status(429).json({
      success: false,
      message: 'Muitas tentativas de login com erro. Por motivos de segurança, tente novamente em 15 minutos.'
    });
  }

  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Informe e-mail e senha.' });
  }

  const db = readDb();
  const user = db.users.find(u => u.email.toLowerCase().trim() === email.toLowerCase().trim());

  if (!user) {
    return res.status(401).json({ success: false, message: 'E-mail ou senha incorretos.' });
  }

  const verification = verifyPassword(password, user.password);
  if (!verification.valid) {
    return res.status(401).json({ success: false, message: 'E-mail ou senha incorretos.' });
  }

  // Auto-upgrade de hash para scrypt se for legado
  if (verification.needsUpgrade) {
    user.password = hashPassword(password);
    writeDb(db);
  }

  authRateLimiter.reset(ip);

  const token = createToken(user);
  const { password: _, ...safeUser } = user;
  res.json({ success: true, token, user: safeUser });
});

// 2. Register (Estritamente nível 'cliente', validação de senha e rate limiting)
app.post('/api/auth/register', (req, res) => {
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  if (registerRateLimiter.isLimited(ip)) {
    return res.status(429).json({
      success: false,
      message: 'Limite de cadastros excedido para este IP. Aguarde antes de tentar novamente.'
    });
  }

  const { name, email, password, phone, cityUnit } = req.body;
  
  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Nome, e-mail e senha são obrigatórios.' });
  }

  if (typeof password !== 'string' || password.length < 6) {
    return res.status(400).json({ success: false, message: 'A senha deve conter no mínimo 6 caracteres.' });
  }

  const db = readDb();
  const cleanEmail = email.toLowerCase().trim();
  const existing = db.users.find(u => u.email.toLowerCase().trim() === cleanEmail);
  if (existing) {
    return res.status(400).json({ success: false, message: 'Já existe uma conta cadastrada com este e-mail.' });
  }

  const newUser = {
    id: `usr-${Date.now()}`,
    name,
    email: cleanEmail,
    password: hashPassword(password),
    phone: phone || '',
    role: 'cliente', // STRICT: new website registrations are always 'cliente'
    cityUnit: cityUnit || 'Vitória - ES',
    isOnline: false,
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);
  writeDb(db);

  const token = createToken(newUser);
  const { password: _, ...safeUser } = newUser;
  res.status(201).json({ success: true, token, user: safeUser });
});

// 3. List all users (ESTRITO: Somente Administradores com Token Válido)
app.get('/api/users', requireRole(['admin']), (req, res) => {
  const db = readDb();
  const safeUsers = db.users.map(({ password, ...u }) => u);
  res.json({ success: true, count: safeUsers.length, data: safeUsers });
});

// 4. Update user role (ESTRITO: Somente Administradores)
app.patch('/api/users/:id/role', requireRole(['admin']), (req, res) => {
  const { role } = req.body;
  
  if (!['admin', 'funcionario', 'cliente'].includes(role)) {
    return res.status(400).json({ success: false, message: 'Nível de conta inválido. Use "admin", "funcionario" ou "cliente".' });
  }

  const db = readDb();
  const userIndex = db.users.findIndex(u => u.id === req.params.id);

  if (userIndex === -1) {
    return res.status(404).json({ success: false, message: 'Usuário não encontrado.' });
  }

  if (db.users[userIndex].email === 'admin@domrockfeller.com.br' && role !== 'admin') {
    return res.status(400).json({ success: false, message: 'A conta do Administrador principal não pode ser alterada.' });
  }

  db.users[userIndex].role = role;
  writeDb(db);

  const { password: _, ...safeUser } = db.users[userIndex];
  res.json({ success: true, message: `Nível de acesso alterado para ${role.toUpperCase()}.`, user: safeUser });
});

// 5. Toggle agent online/offline status (ESTRITO: Funcionários e Admin)
app.post('/api/agents/toggle-status', requireRole(['admin', 'funcionario']), (req, res) => {
  const { userId, isOnline } = req.body;
  const db = readDb();
  const user = db.users.find(u => u.id === userId);
  if (user) {
    user.isOnline = isOnline;
    writeDb(db);
  }
  res.json({ success: true, isOnline: user ? user.isOnline : true });
});

// 6. Check online agents count
app.get('/api/agents/status', (req, res) => {
  const db = readDb();
  const onlineAgents = db.users.filter(u => (u.role === 'admin' || u.role === 'funcionario') && u.isOnline);
  res.json({ 
    success: true, 
    onlineCount: onlineAgents.length,
    agents: onlineAgents.map(a => ({ id: a.id, name: a.name, role: a.role, cityUnit: a.cityUnit }))
  });
});

// ==================== LIVE CHAT QUEUE (HUMAN ATTENDANCE) ====================

// 7. Get chat queue (ESTRITO: Apenas Admin e Funcionários)
app.get('/api/chat-queue', requireRole(['admin', 'funcionario']), (req, res) => {
  const db = readDb();
  const queue = db.chatQueue || [];
  res.json({ success: true, data: queue });
});

// 8. Client joins live support queue (Protegido por Rate Limiting)
app.post('/api/chat-queue/join', (req, res) => {
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  if (chatRateLimiter.isLimited(ip)) {
    return res.status(429).json({
      success: false,
      message: 'Muitas solicitações de atendimento simultâneas. Por favor, aguarde alguns instantes.'
    });
  }

  const { clientName, clientPhone, clientEmail, cityUnit, vehicleModel, initialMessage } = req.body;
  const db = readDb();
  
  if (!clientName) {
    return res.status(400).json({ success: false, message: 'Nome é obrigatório para entrar na fila.' });
  }

  const newTicket = {
    id: `ticket-${Date.now()}`,
    clientName,
    clientPhone: clientPhone || '',
    clientEmail: clientEmail || '',
    cityUnit: cityUnit || 'Vitória - ES',
    vehicleModel: vehicleModel || 'Veículo em análise',
    status: 'aguardando', // 'aguardando' | 'em_atendimento' | 'finalizado'
    assignedTo: null,
    createdAt: new Date().toISOString(),
    messages: [
      {
        id: `msg-${Date.now()}`,
        sender: 'cliente',
        senderName: clientName,
        text: initialMessage || 'Olá! Gostaria de falar com um atendente humano sobre a quitação do meu veículo.',
        timestamp: new Date().toISOString()
      }
    ]
  };

  db.chatQueue = db.chatQueue || [];
  db.chatQueue.unshift(newTicket);
  writeDb(db);

  res.status(201).json({ success: true, data: newTicket });
});

// 9. Staff (Admin or Funcionario) assumes ticket
app.post('/api/chat-queue/:id/assign', requireRole(['admin', 'funcionario']), (req, res) => {
  const { agentId, agentName, agentRole } = req.body;
  const db = readDb();
  const ticket = db.chatQueue.find(t => t.id === req.params.id);

  if (!ticket) {
    return res.status(404).json({ success: false, message: 'Chamado não encontrado.' });
  }

  ticket.status = 'em_atendimento';
  ticket.assignedTo = {
    id: agentId || req.user.id,
    name: agentName || req.user.name || 'Consultor Dom RockFeller',
    role: agentRole || req.user.role || 'funcionario'
  };

  ticket.messages.push({
    id: `msg-${Date.now()}`,
    sender: 'sistema',
    senderName: 'Sistema',
    text: `🔔 O atendente ${ticket.assignedTo.name} entrou na sala e assumiu o atendimento.`,
    timestamp: new Date().toISOString()
  });

  writeDb(db);
  res.json({ success: true, data: ticket });
});

// 10. Send message in active ticket
app.post('/api/chat-queue/:id/message', (req, res) => {
  const { sender, senderName, text } = req.body;
  if (!text) {
    return res.status(400).json({ success: false, message: 'Mensagem vazia.' });
  }

  const db = readDb();
  const ticket = db.chatQueue.find(t => t.id === req.params.id);

  if (!ticket) {
    return res.status(404).json({ success: false, message: 'Chamado não encontrado.' });
  }

  const newMsg = {
    id: `msg-${Date.now()}`,
    sender: sender || 'atendente', // 'cliente' | 'atendente' | 'sistema'
    senderName: senderName || 'Atendente',
    text,
    timestamp: new Date().toISOString()
  };

  ticket.messages.push(newMsg);
  writeDb(db);

  res.json({ success: true, data: newMsg, ticket });
});

// 11. Get ticket details & messages (Client & Agent polling)
app.get('/api/chat-queue/:id', (req, res) => {
  const db = readDb();
  const ticket = db.chatQueue.find(t => t.id === req.params.id);
  if (!ticket) {
    return res.status(404).json({ success: false, message: 'Chamado não encontrado.' });
  }
  res.json({ success: true, data: ticket });
});

// 12. Close ticket (ESTRITO: Funcionários e Admin)
app.post('/api/chat-queue/:id/close', requireRole(['admin', 'funcionario']), (req, res) => {
  const db = readDb();
  const ticket = db.chatQueue.find(t => t.id === req.params.id);
  if (ticket) {
    ticket.status = 'finalizado';
    ticket.messages.push({
      id: `msg-${Date.now()}`,
      sender: 'sistema',
      senderName: 'Sistema',
      text: 'Atendimento finalizado com sucesso. Agradecemos o contato com a Dom RockFeller!',
      timestamp: new Date().toISOString()
    });
    writeDb(db);
  }
  res.json({ success: true, data: ticket });
});

// ==================== REST API ENDPOINTS ====================

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Dom RockFeller API', timestamp: new Date().toISOString() });
});

// Client Portal: Get cases associated with logged in client (ANTI-IDOR SECURE)
app.get('/api/client/my-cases', (req, res) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Faça login para consultar seus processos.' });
  }

  const db = readDb();
  let myCases = [];

  if (req.user.role === 'cliente') {
    // Cliente só pode ver processos vinculados ao seu e-mail ou telefone autenticado
    const userEmail = (req.user.email || '').toLowerCase();
    const userPhone = (req.user.phone || '').replace(/\D/g, '');
    myCases = db.leads.filter(l => {
      const matchEmail = l.email && l.email.toLowerCase() === userEmail;
      const matchPhone = userPhone && l.phone && l.phone.replace(/\D/g, '') === userPhone;
      return matchEmail || matchPhone;
    });
  } else {
    // Admin ou Funcionário podem consultar por filtro
    const { email, phone } = req.query;
    if (email || phone) {
      myCases = db.leads.filter(l => {
        const matchEmail = email && l.email && l.email.toLowerCase() === email.toLowerCase();
        const matchPhone = phone && l.phone && l.phone.replace(/\D/g, '') === phone.replace(/\D/g, '');
        return matchEmail || matchPhone;
      });
    } else {
      myCases = db.leads;
    }
  }

  res.json({ success: true, count: myCases.length, data: myCases });
});

// Get all leads (ESTRITO: Somente Admin e Funcionários)
app.get('/api/leads', requireRole(['admin', 'funcionario']), (req, res) => {
  const db = readDb();
  let leads = [...db.leads];
  const { search, unit, status, delay } = req.query;

  if (search) {
    const q = search.toLowerCase();
    leads = leads.filter(l => 
      l.name.toLowerCase().includes(q) ||
      l.phone.toLowerCase().includes(q) ||
      l.vehicleModel.toLowerCase().includes(q) ||
      l.bank.toLowerCase().includes(q)
    );
  }

  if (unit && unit !== 'Todas') {
    leads = leads.filter(l => l.cityUnit.toLowerCase().includes(unit.toLowerCase()));
  }

  if (status && status !== 'Todos') {
    leads = leads.filter(l => l.status === status);
  }

  if (delay && delay !== 'Todos') {
    leads = leads.filter(l => l.delayStatus === delay);
  }

  leads.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  res.json({ success: true, count: leads.length, data: leads });
});

// Create new contract / lead (Público com Rate Limiting e Sanitização)
app.post('/api/leads', (req, res) => {
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  if (leadRateLimiter.isLimited(ip)) {
    return res.status(429).json({
      success: false,
      message: 'Muitos envios de simulação neste intervalo. Por segurança, aguarde alguns minutos.'
    });
  }
  const db = readDb();
  const {
    name,
    phone,
    email,
    cityUnit,
    vehicleType,
    vehicleModel,
    vehiclePlate,
    processNumber,
    paymentStatus,
    bank,
    installmentValue,
    installmentsRemaining,
    delayStatus,
    status = 'Ficha em Análise',
    notes = []
  } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ success: false, message: 'Nome e telefone são obrigatórios.' });
  }

  const pValue = Number(installmentValue) || 1500;
  const pRemaining = Number(installmentsRemaining) || 36;
  const contractResidualTotal = pValue * pRemaining;
  
  let discountRate = 0.68;
  if (delayStatus && delayStatus.includes('Mais de 3')) {
    discountRate = 0.72;
  } else if (delayStatus && delayStatus.includes('Em dia')) {
    discountRate = 0.64;
  }

  const estimatedPayoff = Math.round(contractResidualTotal * (1 - discountRate));
  const estimatedSavings = contractResidualTotal - estimatedPayoff;
  const discountPercentage = Math.round(discountRate * 100);

  // Inferred payment status if not explicitly provided
  let computedPaymentStatus = paymentStatus;
  if (!computedPaymentStatus) {
    if (status && status.toLowerCase().includes('pago')) computedPaymentStatus = 'Pago';
    else if (status && status.toLowerCase().includes('negocia')) computedPaymentStatus = 'Em Negociação';
    else computedPaymentStatus = 'Pendente';
  }

  const newLead = {
    id: `contract-${Date.now()}`,
    name,
    phone,
    email: email || '',
    cityUnit: cityUnit || 'Vitória - ES',
    vehicleType: vehicleType || 'Carro',
    vehicleModel: vehicleModel || 'Veículo Financiado',
    vehiclePlate: vehiclePlate ? vehiclePlate.toUpperCase() : 'Não informada',
    processNumber: processNumber || 'Em análise pericial inicial',
    paymentStatus: computedPaymentStatus,
    bank: bank || 'BV Financeira',
    installmentValue: pValue,
    installmentsRemaining: pRemaining,
    contractResidualTotal,
    estimatedPayoff,
    estimatedSavings,
    discountPercentage,
    delayStatus: delayStatus || 'Em dia',
    status,
    notes: [
      {
        date: new Date().toISOString(),
        author: 'Sistema Dom RockFeller',
        text: `Contrato cadastrado: ${vehicleModel || 'Veículo'} (${vehiclePlate || 'S/ Placa'}). Saldo residual R$ ${contractResidualTotal.toLocaleString('pt-BR')} sob análise pericial.`
      },
      ...notes
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.leads.unshift(newLead);
  writeDb(db);

  res.status(201).json({ success: true, data: newLead });
});

// Update contract / lead (ESTRITO: Somente Admin e Funcionários)
app.patch('/api/leads/:id', requireRole(['admin', 'funcionario']), (req, res) => {
  const db = readDb();
  const leadIndex = db.leads.findIndex(l => l.id === req.params.id);

  if (leadIndex === -1) {
    return res.status(400).json({ success: false, message: 'Contrato não encontrado.' });
  }

  const existing = db.leads[leadIndex];
  const { status, paymentStatus, vehiclePlate, processNumber, noteText, noteAuthor, ...updates } = req.body;

  const updatedNotes = [...(existing.notes || [])];
  if (noteText) {
    updatedNotes.unshift({
      date: new Date().toISOString(),
      author: noteAuthor || req.user?.name || 'Consultor Dom RockFeller',
      text: noteText
    });
  }

  // Automatic note if status changed
  if (status && status !== existing.status) {
    updatedNotes.unshift({
      date: new Date().toISOString(),
      author: noteAuthor || req.user?.name || 'Assessoria Dom RockFeller',
      text: `Status do processo alterado para: "${status}".`
    });
  }

  let finalPaymentStatus = paymentStatus || existing.paymentStatus;
  if (!paymentStatus && status) {
    if (status.toLowerCase().includes('pago')) finalPaymentStatus = 'Pago';
  }

  const updatedLead = {
    ...existing,
    ...updates,
    vehiclePlate: vehiclePlate !== undefined ? vehiclePlate : existing.vehiclePlate,
    processNumber: processNumber !== undefined ? processNumber : existing.processNumber,
    paymentStatus: finalPaymentStatus,
    status: status || existing.status,
    notes: updatedNotes,
    updatedAt: new Date().toISOString()
  };

  db.leads[leadIndex] = updatedLead;
  writeDb(db);

  res.json({ success: true, data: updatedLead });
});

// Contracts endpoint aliases (ESTRITO: Somente Admin e Funcionários)
app.get('/api/contracts', requireRole(['admin', 'funcionario']), (req, res) => {
  const db = readDb();
  res.json({ success: true, count: db.leads.length, data: db.leads });
});
app.post('/api/contracts', (req, res) => {
  // redirect logic to /api/leads
  req.url = '/api/leads';
  app.handle(req, res);
});

// Delete lead (ESTRITO: Somente Administradores)
app.delete('/api/leads/:id', requireRole(['admin']), (req, res) => {
  const db = readDb();
  const leadIndex = db.leads.findIndex(l => l.id === req.params.id);

  if (leadIndex === -1) {
    return res.status(404).json({ success: false, message: 'Lead não encontrado.' });
  }

  const deleted = db.leads.splice(leadIndex, 1);
  writeDb(db);

  res.json({ success: true, message: 'Lead removido com sucesso.', data: deleted[0] });
});

// ================= BULK ACTIONS (AÇÕES EM MASSA) =================
// 1. Bulk update status (ESTRITO: Admin e Funcionários)
app.post('/api/leads/bulk-status', requireRole(['admin', 'funcionario']), (req, res) => {
  const { ids = [], status, author } = req.body;
  if (!ids.length || !status) {
    return res.status(400).json({ success: false, message: 'IDs e novo status são obrigatórios.' });
  }

  const db = readDb();
  let updatedCount = 0;
  const now = new Date().toISOString();

  db.leads = db.leads.map(lead => {
    if (ids.includes(lead.id)) {
      updatedCount++;
      const updatedNotes = [...(lead.notes || [])];
      updatedNotes.unshift({
        date: now,
        author: author || req.user?.name || 'Diretoria Dom RockFeller (Ação em Massa)',
        text: `Status do processo alterado em massa para: "${status}".`
      });

      let finalPayment = lead.paymentStatus;
      if (status.toLowerCase().includes('pago')) finalPayment = 'Pago';

      return {
        ...lead,
        status,
        paymentStatus: finalPayment,
        notes: updatedNotes,
        updatedAt: now
      };
    }
    return lead;
  });

  writeDb(db);
  res.json({ success: true, count: updatedCount, message: `${updatedCount} contratos atualizados para status "${status}".` });
});

// 2. Bulk update payment status (ESTRITO: Admin e Funcionários)
app.post('/api/leads/bulk-payment', requireRole(['admin', 'funcionario']), (req, res) => {
  const { ids = [], paymentStatus, author } = req.body;
  if (!ids.length || !paymentStatus) {
    return res.status(400).json({ success: false, message: 'IDs e status de pagamento são obrigatórios.' });
  }

  const db = readDb();
  let updatedCount = 0;
  const now = new Date().toISOString();

  db.leads = db.leads.map(lead => {
    if (ids.includes(lead.id)) {
      updatedCount++;
      const updatedNotes = [...(lead.notes || [])];
      updatedNotes.unshift({
        date: now,
        author: author || req.user?.name || 'Diretoria Dom RockFeller (Ação em Massa)',
        text: `Status financeiro do contrato alterado em lote para: "${paymentStatus.toUpperCase()}".`
      });

      let finalProcessStatus = lead.status;
      if (paymentStatus === 'Pago' && !lead.status.includes('Pago') && !lead.status.includes('Quitado')) {
        finalProcessStatus = 'Pago / Baixa de Gravame';
      }

      return {
        ...lead,
        paymentStatus,
        status: finalProcessStatus,
        notes: updatedNotes,
        updatedAt: now
      };
    }
    return lead;
  });

  writeDb(db);
  res.json({ success: true, count: updatedCount, message: `${updatedCount} contratos atualizados para pagamento "${paymentStatus}".` });
});

// 3. Bulk delete contracts (ESTRITO: Somente Administradores)
app.post('/api/leads/bulk-delete', requireRole(['admin']), (req, res) => {
  const { ids = [] } = req.body;
  if (!ids.length) {
    return res.status(400).json({ success: false, message: 'IDs para exclusão são obrigatórios.' });
  }

  const db = readDb();
  const initialLength = db.leads.length;
  db.leads = db.leads.filter(lead => !ids.includes(lead.id));
  const deletedCount = initialLength - db.leads.length;

  writeDb(db);
  res.json({ success: true, count: deletedCount, message: `${deletedCount} contratos excluídos com sucesso.` });
});

// Reset database (ESTRITO: Somente Administradores)
app.post('/api/reset-demo', requireRole(['admin']), (req, res) => {
  writeDb(INITIAL_DATA);
  res.json({ success: true, message: 'Banco de dados restaurado com dados de teste.' });
});

// Dashboard stats (ESTRITO: Admin e Funcionários)
app.get('/api/stats', requireRole(['admin', 'funcionario']), (req, res) => {
  const db = readDb();
  const leads = db.leads;

  const totalLeads = leads.length;
  const unitVitoria = leads.filter(l => l.cityUnit.includes('Vitória')).length;
  const unitFloripa = leads.filter(l => l.cityUnit.includes('Florianópolis')).length;
  
  const totalResidual = leads.reduce((acc, curr) => acc + (curr.contractResidualTotal || 0), 0);
  const totalEstimatedSavings = leads.reduce((acc, curr) => acc + (curr.estimatedSavings || 0), 0);
  const completedLeads = leads.filter(l => l.status === 'Quitado com Sucesso').length;

  res.json({
    success: true,
    data: {
      totalLeads,
      unitVitoria,
      unitFloripa,
      totalResidual,
      totalEstimatedSavings,
      completedLeads,
      globalStats: db.stats
    }
  });
});

// AI Chatbot endpoint (Protegido por Rate Limiting e Sanitização)
app.post('/api/chat', (req, res) => {
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  if (chatRateLimiter.isLimited(ip)) {
    return res.status(429).json({
      success: false,
      message: 'Limite de mensagens para o assistente atingido. Por favor, aguarde 1 minuto.'
    });
  }
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ success: false, message: 'Mensagem vazia' });
  }

  const text = message.toLowerCase();
  const clean = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  let reply = '';
  let actions = [];

  if (clean.includes('vitoria') || clean.includes('espirito santo') || text.includes(' es')) {
    reply = `📍 **Sede Dom RockFeller em Vitória - ES**:
Estamos no prestigiado Centro Empresarial Vitória:
**Endereço**: Av. Américo Buaiz, 501 - Enseada do Suá, Vitória - ES.
📞 **Telefone**: (27) 3099-4450
📲 **WhatsApp**: (27) 99872-3344
🕒 **Horário**: Segunda a Sexta, das 08:30 às 18:00.

Você pode agendar uma reunião presencial com nossos assessores jurídicos ou ser atendido 100% online!`;
    actions = [
      { label: '🙋 Falar com Atendente Humano', action: 'join_queue' },
      { label: 'Agendar em Vitória', action: 'schedule_vitoria' },
      { label: 'WhatsApp (27)', action: 'whatsapp_vitoria' }
    ];
  } else if (clean.includes('florianopolis') || clean.includes('floripa') || clean.includes('santa catarina') || text.includes(' sc')) {
    reply = `📍 **Sede Dom RockFeller em Florianópolis - SC**:
Nosso escritório no coração da Ilha:
**Endereço**: Av. Rio Branco, 847 - Centro, Florianópolis - SC (Ed. Premier Tower).
📞 **Telefone**: (48) 3224-8890
📲 **WhatsApp**: (48) 99125-6677
🕒 **Horário**: Segunda a Sexta, das 08:30 às 18:00.

Venha tomar um café conosco ou realize sua perícia sem custo pelo WhatsApp!`;
    actions = [
      { label: '🙋 Falar com Atendente Humano', action: 'join_queue' },
      { label: 'Agendar em Floripa', action: 'schedule_floripa' },
      { label: 'WhatsApp (48)', action: 'whatsapp_floripa' }
    ];
  } else if (clean.includes('atendente') || clean.includes('humano') || clean.includes('pessoa') || clean.includes('fila') || clean.includes('falar com alguem')) {
    reply = `🙋 **Atendimento Humano em Tempo Real**:
Nossa equipe de consultores e advogados de Vitória e Florianópolis está disponível.
Deseja entrar na fila de atendimento com um atendente humano agora mesmo?`;
    actions = [
      { label: 'Entrar na Fila com Atendente', action: 'join_queue' },
      { label: 'WhatsApp Direto', action: 'open_whatsapp' }
    ];
  } else if (clean.includes('como funciona') || clean.includes('funciona') || clean.includes('processo') || clean.includes('metodologia') || clean.includes('revisional')) {
    reply = `⚖️ **Metodologia da Assessoria Jurídica & Ação Revisional Legítima**:

1. **Perícia Técnica Contábil**: Realizamos auditoria matemática no contrato para apontar anatocismo ilegal, juros acima da taxa média do Banco Central e tarifas abusivas (TAC, TEC, seguros embutidos).
2. **Ação Revisional na Justiça**: Nossos advogados parceiros ajuízam ação revisional fundamentada no Código de Defesa do Consumidor e teses vinculantes do STJ.
3. **Ciência Clara sobre Busca e Apreensão**: Mantemos o cliente 100% informado dos riscos do Decreto-Lei 911/69, pleiteando depósito judicial de parcelas incontroversas e medidas protetivas.
4. **Acordo Judicial Homologado**: Diante da solidez do laudo pericial, a instituição financeira frequentemente formula acordos com redução expressiva para quitação integral com baixa do gravame no DETRAN!`;
    actions = [
      { label: 'Simular Ação Revisional', action: 'open_simulator' },
      { label: '🙋 Falar com Consultor', action: 'join_queue' }
    ];
  } else if (clean.includes('busca e apreensao') || clean.includes('apreensao') || clean.includes('atraso') || clean.includes('atrasadas') || clean.includes('oficial') || clean.includes('notificacao')) {
    reply = `🛡️ **Transparência e Defesa Contra Riscos de Busca e Apreensão**:

• **Ciência do Risco Legal**: O ajuizamento de ação revisional ou a suspensão unilateral de pagamento não anula por si só a possibilidade de ação de busca e apreensão pelo banco credor (Decreto-Lei 911/69). Mantemos você sempre ciente dessa realidade.
• **Atuação Preventiva**: Pleiteamos em juízo o depósito dos valores incontroversos, tutela de urgência e realizamos monitoramento diário nos tribunais estaduais (TJES e TJSC).
• **Defesa Processual**: Havendo ajuizamento bancário, realizamos defesa técnica tempestiva comprovando abusividade das taxas e buscando a suspensão da liminar ou acordo vantajoso.

Você já recebeu notificação extrajudicial ou tem parcelas em atraso?`;
    actions = [
      { label: '🙋 Falar com Consultor Agora', action: 'join_queue' },
      { label: '⚖️ Estudo Revisional Prévia', action: 'open_simulator' },
      { label: '🚨 Urgência no WhatsApp', action: 'open_whatsapp_urgent' }
    ];
  } else if (clean.includes('juros') || clean.includes('abusiv') || clean.includes('taxa')) {
    reply = `📊 **Análise Pericial de Juros Abusivos**:

A grande maioria dos contratos de financiamento veicular aplica juros remuneratórios muito superiores à Taxa Média de Mercado divulgada pelo Banco Central do Brasil (BACEN), configurando vantagem manifestamente excessiva.

Nossa equipe pericial recalcula todo o fluxo contratual pelo método justo, apurando o saldo real incontroverso para instruir uma **ação revisional legítima perante o Poder Judiciário**.`;
    actions = [
      { label: '⚖️ Simular Meu Contrato', action: 'open_simulator' },
      { label: '🙋 Falar com Perito', action: 'join_queue' }
    ];
  } else {
    reply = `Olá! Sou o assistente da **Dom RockFeller** — Assessoria Jurídica e Consultoria Financeira. 🏛️⚖️

Somos especializados em:
• **Perícia Contábil de Juros Abusivos** em contratos de financiamento de veículos;
• **Ações Revisionais Legítimas na Justiça** baseadas no CDC e precedentes do STJ;
• **Orientação preventiva transparente sobre riscos de busca e apreensão** (Decreto-Lei 911/69).

Como posso orientar o seu caso hoje?`;
    actions = [
      { label: '⚖️ Simular Ação Revisional', action: 'open_simulator' },
      { label: '🙋 Falar com Atendente Humano', action: 'join_queue' },
      { label: '📍 Sede Vitória (ES)', action: 'schedule_vitoria' },
      { label: '📍 Sede Floripa (SC)', action: 'schedule_floripa' }
    ];
  }

  res.json({
    success: true,
    reply,
    actions,
    timestamp: new Date().toISOString()
  });
});

// ==========================================
// INSTAGRAM SOCIAL MEDIA AGENT ENDPOINTS
// ==========================================

// 1. Obter Status da Conexão com o Instagram
app.get('/api/instagram/status', async (req, res) => {
  const db = readDb();
  const config = db.instagramConfig || {
    accessToken: process.env.INSTAGRAM_ACCESS_TOKEN || '',
    accountId: process.env.INSTAGRAM_ACCOUNT_ID || ''
  };

  if (config.accessToken && config.accountId) {
    instagramService.setCredentials(config.accessToken, config.accountId);
  }

  const profile = await instagramService.getProfile();
  res.json({
    isConfigured: instagramService.isConfigured(),
    accountId: config.accountId || '',
    hasToken: Boolean(config.accessToken),
    ...profile
  });
});

// 2. Salvar ou Atualizar Credenciais da Meta (ESTRITO: Somente Administradores)
app.post('/api/instagram/config', requireRole(['admin']), async (req, res) => {
  const { accessToken, accountId } = req.body;
  if (!accessToken || !accountId) {
    return res.status(400).json({ error: 'accessToken e accountId são obrigatórios.' });
  }

  const db = readDb();
  db.instagramConfig = {
    accessToken,
    accountId,
    updatedAt: new Date().toISOString()
  };
  writeDb(db);

  instagramService.setCredentials(accessToken, accountId);
  const testResult = await instagramService.getProfile();

  res.json({
    success: true,
    message: testResult.connected ? 'Instagram conectado com sucesso!' : 'Credenciais salvas, mas a Meta retornou erro de autenticação.',
    ...testResult
  });
});

// 3. Publicar Mídia (ESTRITO: Admin e Funcionários)
app.post('/api/instagram/publish', requireRole(['admin', 'funcionario']), async (req, res) => {
  const { type, imageUrl, videoUrl, imageUrls, caption } = req.body;
  const db = readDb();
  const config = db.instagramConfig;

  if (config?.accessToken && config?.accountId) {
    instagramService.setCredentials(config.accessToken, config.accountId);
  }

  try {
    let result;
    if (type === 'reel') {
      if (!videoUrl) return res.status(400).json({ error: 'videoUrl é obrigatório para Reels.' });
      result = await instagramService.publishReel(videoUrl, caption);
    } else if (type === 'carousel') {
      if (!imageUrls || imageUrls.length < 2) return res.status(400).json({ error: 'imageUrls com pelo menos 2 imagens é obrigatório.' });
      result = await instagramService.publishCarousel(imageUrls, caption);
    } else {
      if (!imageUrl) return res.status(400).json({ error: 'imageUrl é obrigatório para post de foto.' });
      result = await instagramService.publishPhoto(imageUrl, caption);
    }

    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. Buscar Posts Recentes
app.get('/api/instagram/posts', async (req, res) => {
  const db = readDb();
  const config = db.instagramConfig;

  if (config?.accessToken && config?.accountId) {
    instagramService.setCredentials(config.accessToken, config.accountId);
  }

  try {
    const limit = Number(req.query.limit) || 10;
    const posts = await instagramService.getRecentMedia(limit);
    res.json({ success: true, posts });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. Responder Comentário (ESTRITO: Admin e Funcionários)
app.post('/api/instagram/reply-comment', requireRole(['admin', 'funcionario']), async (req, res) => {
  const { commentId, message } = req.body;
  if (!commentId || !message) {
    return res.status(400).json({ error: 'commentId e message são obrigatórios.' });
  }

  const db = readDb();
  const config = db.instagramConfig;

  if (config?.accessToken && config?.accountId) {
    instagramService.setCredentials(config.accessToken, config.accountId);
  }

  try {
    const result = await instagramService.replyComment(commentId, message);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 6. Obter Fila de Publicações Programadas
app.get('/api/instagram/schedule', requireRole(['admin', 'funcionario']), (req, res) => {
  res.json({ success: true, schedule: socialScheduler.getSchedule() });
});

// 7. Adicionar Nova Publicação à Fila Programada
app.post('/api/instagram/schedule', requireRole(['admin', 'funcionario']), (req, res) => {
  const item = req.body;
  if (!item.title || (!item.imageUrl && !item.videoUrl)) {
    return res.status(400).json({ error: 'Título e mídia (imagem ou vídeo) são obrigatórios.' });
  }
  const scheduled = socialScheduler.addScheduledItem(item);
  res.json({ success: true, item: scheduled });
});

// Inicia o motor de agendamento automático
socialScheduler.start();

// 8. Varredura e Resposta Automática a Comentários com IA
app.post('/api/instagram/scan-comments', requireRole(['admin', 'funcionario']), async (req, res) => {
  const result = await commentWatcher.scanAndReply();
  res.json(result);
});

// 9. Histórico de Interações da IA no Instagram & Playbook
app.get('/api/instagram/interactions', requireRole(['admin', 'funcionario']), (req, res) => {
  const db = readDb();
  res.json({
    success: true,
    interactions: db.aiInteractions || [],
    playbook: aiResponder.getConversationPlaybook()
  });
});

// 10. Simulação / Teste do Motor de IA com Texto de Comentário
app.post('/api/instagram/simulate-comment', (req, res) => {
  const { username, text } = req.body;
  const intent = aiResponder.classifyIntent(text || '');
  const reply = aiResponder.generateReply(username || 'cliente_exemplo', text || '');
  res.json({
    success: true,
    intent,
    reply
  });
});

// 11. Catálogo Completo dos 35 Veículos para Futura Quitação (Público)
app.get('/api/cars-catalog', (req, res) => {
  try {
    const catalogPath = path.join(__dirname, '../public/carros-estoque/catalogo.json');
    if (fs.existsSync(catalogPath)) {
      const data = JSON.parse(fs.readFileSync(catalogPath, 'utf-8'));
      return res.json({ success: true, catalog: data, total: data.length });
    }
    res.status(404).json({ success: false, error: 'Catálogo de veículos não encontrado.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 12. Destaques Oficiais Estruturados para Instagram (Público)
app.get('/api/highlights', (req, res) => {
  try {
    const highlightsPath = path.join(__dirname, '../public/destaques/destaques.json');
    if (fs.existsSync(highlightsPath)) {
      const data = JSON.parse(fs.readFileSync(highlightsPath, 'utf-8'));
      return res.json({ success: true, highlights: data });
    }
    res.status(404).json({ success: false, error: 'Destaques não encontrados.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 13. Publicar Story de Veículo no Instagram via Meta API (ESTRITO: Admin e Funcionários)
app.post('/api/instagram/publish-story', requireRole(['admin', 'funcionario']), async (req, res) => {
  const { imageUrl } = req.body;
  if (!imageUrl) {
    return res.status(400).json({ error: 'imageUrl é obrigatório para publicar story.' });
  }

  const db = readDb();
  const config = db.instagramConfig;
  if (config?.accessToken && config?.accountId) {
    instagramService.setCredentials(config.accessToken, config.accountId);
  }

  try {
    const result = await instagramService.publishStory(imageUrl);
    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 14. Publicar Reel de Veículo no Instagram via Meta API (ESTRITO: Admin e Funcionários)
app.post('/api/instagram/publish-reel', requireRole(['admin', 'funcionario']), async (req, res) => {
  const { videoUrl, caption, shareToFeed } = req.body;
  if (!videoUrl) {
    return res.status(400).json({ error: 'videoUrl é obrigatório para publicar reel.' });
  }

  const db = readDb();
  const config = db.instagramConfig;
  if (config?.accessToken && config?.accountId) {
    instagramService.setCredentials(config.accessToken, config.accountId);
  }

  try {
    const result = await instagramService.publishReel(videoUrl, caption || 'Estoque Exclusivo Dom RockFeller', shareToFeed ?? true);
    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 15. Obter Prospects do Instagram (Radar de Clientes em Potencial - ESTRITO)
app.get('/api/instagram/prospects', requireRole(['admin', 'funcionario']), (req, res) => {
  const db = readDb();
  res.json({
    success: true,
    prospects: db.socialProspects || [],
    dailyFollowLimit: 20,
    followedToday: (db.socialProspects || []).filter(p => p.status === 'seguido' || p.status === 'dm_enviada').length
  });
});

// 16. Atualizar Status de Prospecção do Lead no Instagram (ESTRITO)
app.post('/api/instagram/prospects/:id/status', requireRole(['admin', 'funcionario']), (req, res) => {
  const { id } = req.params;
  const { status, note } = req.body;
  const db = readDb();
  const prospects = db.socialProspects || [];
  const target = prospects.find(p => p.id === id);

  if (!target) {
    return res.status(404).json({ success: false, error: 'Prospect não encontrado.' });
  }

  target.status = status || target.status;
  target.lastAction = new Date().toISOString();
  if (note) target.internalNote = note;

  writeDb(db);
  res.json({ success: true, prospect: target });
});

// 17. Adicionar Novo Lead / Perfil ao Radar de Prospecção (ESTRITO)
app.post('/api/instagram/prospects', requireRole(['admin', 'funcionario']), (req, res) => {
  const { username, name, city, niche, targetVehicle, suggestedDm } = req.body;
  if (!username) {
    return res.status(400).json({ success: false, error: 'username do Instagram é obrigatório.' });
  }

  const db = readDb();
  if (!db.socialProspects) db.socialProspects = [];

  const newProspect = {
    id: `prsp-${Date.now()}`,
    username: username.replace(/^@/, '').trim(),
    name: name || username,
    city: city || 'Vitória - ES',
    niche: niche || 'Geral / Automotivo',
    targetVehicle: targetVehicle || 'Veículo do Estoque',
    interestReason: 'Adicionado manualmente ao radar',
    followers: 'N/A',
    status: 'novo',
    lastAction: null,
    suggestedDm: suggestedDm || `Olá ${name || username}! Tudo bem? A Dom RockFeller está com 35 veículos em cessão com quitação bancária de até 70%. Gostaria de conferir o catálogo?`
  };

  db.socialProspects.unshift(newProspect);
  writeDb(db);
  res.json({ success: true, prospect: newProspect });
});

// 18. Obter Agenda de Postagens do Instagram (Playbook Rockfeller Carros - ESTRITO)
app.get('/api/social/schedule', requireRole(['admin', 'funcionario']), (req, res) => {
  res.json({ success: true, schedule: socialScheduler.getSchedule() });
});

// 19. Disparo Manual / Imediato de Item Agendado (ESTRITO)
app.post('/api/social/schedule/trigger/:id', requireRole(['admin', 'funcionario']), async (req, res) => {
  const { id } = req.params;
  const schedule = socialScheduler.getSchedule();
  const item = schedule.find(s => s.id === id);
  if (!item) return res.status(404).json({ success: false, error: 'Item não encontrado na agenda.' });

  try {
    let result;
    if (item.type === 'reel' && (item.videoUrl || item.mediaPath)) {
      result = await instagramService.publishReel(item.videoUrl || item.mediaUrl, item.caption);
    } else if (item.type === 'story' && (item.imageUrl || item.mediaPath)) {
      result = await instagramService.publishStory(item.imageUrl || item.mediaUrl);
    } else {
      result = await instagramService.publishPhoto(item.imageUrl || item.mediaUrl, item.caption);
    }
    item.status = 'published';
    item.publishedAt = new Date().toISOString();
    socialScheduler.saveSchedule();
    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// SPA Fallback: Qualquer rota não-API direciona para o index.html compilado do React
if (fs.existsSync(DIST_DIR)) {
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/carros-estoque')) {
      return next();
    }
    res.sendFile(path.join(DIST_DIR, 'index.html'));
  });
}

// Inicia o observador contínuo de comentários da IA e a agenda social
commentWatcher.start();
socialScheduler.start();

app.listen(PORT, () => {
  console.log(`Dom RockFeller API running on port ${PORT}`);
});
