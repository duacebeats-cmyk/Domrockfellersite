// Automated Security Test Suite for Dom RockFeller / QuitaFácil
const http = require('http');

const BASE_URL = 'http://localhost:3001';

// Helper to make HTTP requests
function request(options, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(options.path || '/', BASE_URL);
    const reqOptions = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    };

    const req = http.request(reqOptions, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        let parsed = null;
        try {
          parsed = JSON.parse(body);
        } catch {
          parsed = body;
        }
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: parsed
        });
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(typeof data === 'string' ? data : JSON.stringify(data));
    }
    req.end();
  });
}

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failed++;
  }
}

async function runTests() {
  console.log('====================================================');
  console.log('🔒 INICIANDO SUÍTE DE TESTES DE SEGURANÇA E AUDITORIA');
  console.log('====================================================\n');

  let adminToken = null;
  let funcionarioToken = null;
  let clientToken = null;

  // ----------------------------------------------------
  // TEST GROUP 1: Security Headers
  // ----------------------------------------------------
  console.log('--- 1. HTTP Security Headers Audit ---');
  try {
    const res = await request({ path: '/carros-estoque/catalogo.json', method: 'GET' });
    
    assert(res.headers['x-content-type-options'] === 'nosniff', 'Header X-Content-Type-Options: nosniff presente');
    assert(res.headers['x-frame-options'] === 'SAMEORIGIN', 'Header X-Frame-Options: SAMEORIGIN presente');
    assert(res.headers['x-xss-protection']?.includes('mode=block'), 'Header X-XSS-Protection configurado');
    assert(res.headers['referrer-policy'] === 'strict-origin-when-cross-origin', 'Header Referrer-Policy seguro');
    assert(res.headers['content-security-policy']?.includes("default-src 'self'"), 'CSP (Content-Security-Policy) restritivo ativo');
    assert(!res.headers['x-powered-by'], 'Header sensível X-Powered-By ocultado');
  } catch (err) {
    console.error('Erro no teste de headers:', err);
    failed++;
  }

  // ----------------------------------------------------
  // TEST GROUP 2: Authentication & Crypto Hashes
  // ----------------------------------------------------
  console.log('\n--- 2. Autenticação Criptográfica (scrypt) & Tokens ---');
  try {
    // 2.1 Login inválido
    const failRes = await request({
      path: '/api/auth/login',
      method: 'POST'
    }, { email: 'admin@domrockfeller.com.br', password: 'senha_errada_123' });
    assert(failRes.statusCode === 401 && !failRes.data.success, 'Login com senha incorreta é rejeitado com 401');

    // 2.2 Login Admin válido
    const adminRes = await request({
      path: '/api/auth/login',
      method: 'POST'
    }, { email: 'admin@domrockfeller.com.br', password: 'admin123' });
    assert(adminRes.statusCode === 200 && adminRes.data.success && !!adminRes.data.token, 'Login de Admin bem-sucedido com emissão de token');
    adminToken = adminRes.data.token;

    // 2.3 Login Atendente válido
    const funcRes = await request({
      path: '/api/auth/login',
      method: 'POST'
    }, { email: 'atendente@domrockfeller.com.br', password: 'atendente123' });
    assert(funcRes.statusCode === 200 && funcRes.data.success && !!funcRes.data.token, 'Login de Atendente/Funcionário bem-sucedido');
    funcionarioToken = funcRes.data.token;

    // 2.4 Login Cliente válido
    const clientRes = await request({
      path: '/api/auth/login',
      method: 'POST'
    }, { email: 'rodrigo.ramos@gmail.com', password: 'cliente123' });
    assert(clientRes.statusCode === 200 && clientRes.data.success && !!clientRes.data.token, 'Login de Cliente bem-sucedido');
    clientToken = clientRes.data.token;

  } catch (err) {
    console.error('Erro na autenticação:', err);
    failed++;
  }

  // ----------------------------------------------------
  // TEST GROUP 3: RBAC (Role-Based Access Control)
  // ----------------------------------------------------
  console.log('\n--- 3. Controle de Acesso Baseado em Perfis (RBAC) ---');
  try {
    // 3.1 Acesso Anônimo a Leads -> 401
    const anonLeads = await request({ path: '/api/leads', method: 'GET' });
    assert(anonLeads.statusCode === 401, 'Requisição anônima a /api/leads bloqueada com 401');

    // 3.2 Acesso Anônimo a Gestão de Usuários -> 401
    const anonUsers = await request({ path: '/api/users', method: 'GET' });
    assert(anonUsers.statusCode === 401, 'Requisição anônima a /api/users bloqueada com 401');

    // 3.3 Acesso de Cliente a Leads -> 403
    const clientLeads = await request({
      path: '/api/leads',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${clientToken}` }
    });
    assert(clientLeads.statusCode === 403, 'Cliente bloqueado com 403 ao tentar ver todos os leads');

    // 3.4 Acesso de Cliente a Usuários -> 403
    const clientUsers = await request({
      path: '/api/users',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${clientToken}` }
    });
    assert(clientUsers.statusCode === 403, 'Cliente bloqueado com 403 ao tentar ver usuários internos');

    // 3.5 Acesso de Funcionário a Leads -> 200
    const funcLeads = await request({
      path: '/api/leads',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${funcionarioToken}` }
    });
    assert(funcLeads.statusCode === 200 && Array.isArray(funcLeads.data.data), 'Funcionário tem permissão (200) para acessar leads');

    // 3.6 Acesso de Funcionário a Gestão de Usuários -> 403 (Somente Admin)
    const funcUsers = await request({
      path: '/api/users',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${funcionarioToken}` }
    });
    assert(funcUsers.statusCode === 403, 'Funcionário bloqueado com 403 em rota exclusiva de Admin (/api/users)');

    // 3.7 Acesso de Admin a Gestão de Usuários -> 200
    const adminUsers = await request({
      path: '/api/users',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    assert(adminUsers.statusCode === 200 && adminUsers.data.success, 'Admin tem permissão total (200) para gerenciar usuários');

  } catch (err) {
    console.error('Erro no RBAC:', err);
    failed++;
  }

  // ----------------------------------------------------
  // TEST GROUP 4: Anti-IDOR (Insecure Direct Object Reference)
  // ----------------------------------------------------
  console.log('\n--- 4. Proteção Anti-IDOR em Dados Confidenciais de Clientes ---');
  try {
    // Cliente Rodrigo tenta forçar na query ver os dados de Mariana Becker
    const idorRes = await request({
      path: '/api/client/my-cases?email=mariana.becker@outlook.com',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${clientToken}` }
    });

    assert(idorRes.statusCode === 200, 'Endpoint /api/client/my-cases responde');
    // Verifica se os casos retornados pertencem exclusivamente a Rodrigo, e nenhum a Mariana
    const cases = idorRes.data.cases || [];
    const hasMarianaData = cases.some(c => c.email === 'mariana.becker@outlook.com' || c.name?.includes('Mariana'));
    assert(!hasMarianaData, 'IDOR Mitigado: Cliente não consegue ler dados de outros clientes via manipulação de parâmetro');

  } catch (err) {
    console.error('Erro no teste de IDOR:', err);
    failed++;
  }

  // ----------------------------------------------------
  // TEST GROUP 5: Sanitização de Input & Proteção contra XSS
  // ----------------------------------------------------
  console.log('\n--- 5. Sanitização de Input & Prevenção XSS ---');
  try {
    const maliciousPayload = {
      name: 'Tester <script>alert("XSS")</script>',
      phone: '11999999999',
      email: 'xss.tester@seguranca.com.br',
      carModel: 'BMW 320i',
      debtValue: 50000,
      bank: 'Banco Santander <iframe src="evil.com"></iframe>',
      overdueMonths: 3
    };

    const leadRes = await request({
      path: '/api/leads',
      method: 'POST'
    }, maliciousPayload);

    assert(leadRes.statusCode === 201 && leadRes.data.success, 'Lead criado com sucesso via validação');
    const createdLead = leadRes.data.data;
    assert(createdLead && !createdLead.name.includes('<script>') && !createdLead.name.includes('alert'), 'Tags <script> removidas do campo name');
    assert(createdLead && !createdLead.bank.includes('<iframe'), 'Tags <iframe removidas do campo bank');

  } catch (err) {
    console.error('Erro no teste de XSS:', err);
    failed++;
  }

  // ----------------------------------------------------
  // TEST GROUP 6: Vitrine e Rotas Públicas Seguras
  // ----------------------------------------------------
  console.log('\n--- 6. Integridade da Vitrine e Rotas Públicas ---');
  try {
    const catalogRes = await request({ path: '/carros-estoque/catalogo.json', method: 'GET' });
    assert(catalogRes.statusCode === 200 && Array.isArray(catalogRes.data) && catalogRes.data.length >= 25, `Catálogo de carros responde perfeitamente (${catalogRes.data?.length} veículos listados)`);
  } catch (err) {
    console.error('Erro na vitrine pública:', err);
    failed++;
  }

  // ----------------------------------------------------
  // TEST GROUP 7: Prevenção contra Abuso & Rate Limiting
  // ----------------------------------------------------
  console.log('\n--- 7. Rate Limiting contra Ataques de Força Bruta & Flood ---');
  try {
    let rateLimited = false;
    for (let i = 0; i < 32; i++) {
      const res = await request({
        path: '/api/chat-queue/join',
        method: 'POST'
      }, { clientName: 'RateLimitBot' });
      if (res.statusCode === 429) {
        rateLimited = true;
        break;
      }
    }
    assert(rateLimited, 'Mecanismo de Rate Limiting bloqueia flood com HTTP 429 Too Many Requests');
  } catch (err) {
    console.error('Erro no teste de rate limiting:', err);
    failed++;
  }

  // ----------------------------------------------------
  // RESUMO FINAL
  // ----------------------------------------------------
  console.log('\n====================================================');
  console.log(`📊 RESULTADO DOS TESTES DE SEGURANÇA:`);
  console.log(`   Total Passados: ${passed}`);
  console.log(`   Total Falhos:   ${failed}`);
  console.log('====================================================');

  if (failed === 0) {
    console.log('🎉 TODOS OS TESTES DE SEGURANÇA PASSARAM COM SUCESSO!\n');
    process.exit(0);
  } else {
    console.error('⚠️ ALGUNS TESTES FALHARAM.\n');
    process.exit(1);
  }
}

runTests();
