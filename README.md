# Dom RockFeller - Assessoria Fiduciária & Quitação de Veículos com Desconto

Plataforma de alta tecnologia desenvolvida em **React 19 + Node.js Express** para a **Dom RockFeller**, assessoria de elite especializada em **quitação antecipada de financiamentos veiculares por valor menor (descontos de 50% a 75%)**, com sedes corporativas em **Vitória (Espírito Santo)** e **Florianópolis (Santa Catarina)**.

---

## 🏛️ Identidade & Sedes

- **Marca**: Dom RockFeller Assessoria Fiduciária
- **Emblema**: Brasão nobre com monograma "DR" em dourado e esmeralda.
- **Sedes Corporativas**:
  - 📍 **Vitória - ES**: *Centro Empresarial Vitória*, Av. Américo Buaiz, 501 - Salas 804/805, Enseada do Suá. Telefone: (27) 3099-4450 / WhatsApp: (27) 99872-3344.
  - 📍 **Florianópolis - SC**: *Premier Tower Corporate*, Av. Rio Branco, 847 - Salas 601/602, Centro. Telefone: (48) 3224-8890 / WhatsApp: (48) 99125-6677.

---

## 🔐 Controle de Acesso & Níveis de Conta (RBAC)

O menu público **não** exibe atalhos diretos para o painel administrativo. O acesso é unificado através do botão **"Entrar"**:

1. **Reconhecimento Automático do Nível da Conta**:
   - O sistema detecta se a conta logada é **Administrador** ou **Cliente**.
2. **Nível Administrador (`admin`)**:
   - Acesso total ao CRM e métricas de toda a operação.
   - Controle de todos os leads de Vitória e Florianópolis.
   - **Gestão de Usuários Exclusiva**: Apenas o administrador tem a permissão de alterar o nível das contas (promover cliente para administrador ou rebaixar administrador para cliente).
3. **Nível Cliente (`cliente`)**:
   - Acesso restrito ao **Portal do Cliente**.
   - Visualização dos seus próprios veículos e contratos em negociação.
   - Acompanhamento da linha do tempo da quitação (*Auditoria Contratual*, *Mesa de Negociação Bancária*, *Emissão de Boleto com Desconto*, *Baixa do Gravame no DETRAN*).
   - Comunicação direta com a assessoria da sua sede.
4. **Novas Contas Criadas pelo Site**:
   - Todo usuário que se cadastra pelo formulário público do site recebe **automaticamente o nível `cliente`**, com acesso restrito e seguro.

### 🔑 Credenciais Padrão de Demonstração

| Perfil | E-mail | Senha | Acesso |
| :--- | :--- | :--- | :--- |
| **Administrador** | `admin@domrockfeller.com.br` | `admin123` | CRM Geral + Gestão de Usuários & Níveis |
| **Cliente** | `rodrigo.ramos@gmail.com` | `cliente123` | Portal do Cliente (Jeep Compass) |
| **Cliente 2** | `mariana.becker@outlook.com` | `cliente123` | Portal do Cliente (Corolla Quitado) |

*(No modal de login, há botões de atalho rápido para preenchimento com 1 clique).*

---

## 🚀 Funcionalidades Principais

- **Menu 100% Responsivo & Ícones Alinhados**: Todos os ícones e elementos do cabeçalho perfeitamente centralizados e adaptados para mobile e desktop.
- **Simulador Financeiro em Tempo Real**: Sliders de parcelas e valores, estimativa de até 75% de desconto e animação de confetes.
- **AutoBot IA**: Assistente virtual integrado que responde dúvidas sobre quitação, risco de busca e apreensão e informa endereços e rotas para as sedes.
- **Painel CRM com Banco de Dados Persistente**: Filtros por sede e status, anotações de atendimento na linha do tempo, exportação para CSV e cadastro manual.

---

## 💻 Como Rodar o Projeto

```bash
# Iniciar Servidor API e Aplicação juntos
npm run dev
```

- **Aplicação Web**: `http://localhost:5173`
- **API REST Backend**: `http://localhost:3001`
