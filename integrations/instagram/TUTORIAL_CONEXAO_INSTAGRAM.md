# 🚀 Guia Passo a Passo: Conectando o Antigravity ao Instagram da Empresa

Este guia mostra como conectar o **Antigravity** diretamente à conta do **Instagram da Dom RockFeller** usando a API Oficial da Meta (Instagram Graph API).

---

## 📌 Requisitos Prévios (2 Minutos)
1. **Conta Comercial no Instagram**: No app do Instagram, vá em *Configurações > Tipo de conta e ferramentas > Mudar para conta profissional (Empresa ou Criador)*.
2. **Página do Facebook Vinculada**: A sua conta comercial do Instagram precisa estar associada a uma Página do Facebook da empresa.

---

## 🛠️ Passo 1: Criar o Aplicativo no Meta for Developers
1. Acesse o portal oficial de desenvolvedores da Meta:  
   👉 [https://developers.facebook.com/](https://developers.facebook.com/)
2. Faça login com a conta do Facebook administradora da página.
3. Clique em **Meus Aplicativos (My Apps)** no canto superior direito e depois em **Criar Aplicativo (Create App)**.
4. Selecione o caso de uso: **Outro (Other)** e avance.
5. Selecione o tipo de app: **Empresa (Business)**.
6. Dê um nome ao aplicativo (ex: `Dom RockFeller Agent`) e confirme.

---

## 🔑 Passo 2: Gerar o Token de Acesso (Access Token)
1. No menu superior da Meta, clique em **Ferramentas (Tools) > Graph API Explorer**:  
   👉 [https://developers.facebook.com/tools/explorer/](https://developers.facebook.com/tools/explorer/)
2. No menu da direita:
   - Em **Aplicativo do Meta (Meta App)**: Selecione o app que você acabou de criar (`Dom RockFeller Agent`).
   - Em **Permissões (User or Page Permissions)**, adicione as permissões essenciais:
     - `instagram_basic`
     - `instagram_content_publish` (para o agente postar fotos, reels e carrosséis)
     - `instagram_manage_comments` (para o agente responder comentários automaticamente)
     - `instagram_manage_insights` (para o agente puxar métricas e relatórios)
     - `pages_show_list`
     - `pages_read_engagement`
3. Clique em **Generate Access Token** e autorize com seu Facebook e Instagram.
4. Copie o **Token** gerado.

---

## 🆔 Passo 3: Descobrir o seu `INSTAGRAM_ACCOUNT_ID`
No próprio **Graph API Explorer**:
1. No campo de consulta URL, digite:
   ```text
   me/accounts?fields=name,instagram_business_account{id,username}
   ```
2. Clique em **Enviar (Submit)**.
3. A resposta JSON trará o `id` da sua conta do Instagram:
   ```json
   {
     "name": "Dom RockFeller",
     "instagram_business_account": {
       "id": "17841400000000000",
       "username": "domrockfeller"
     }
   }
   ```
4. Esse número de 17 dígitos é o seu **`INSTAGRAM_ACCOUNT_ID`**.

---

## ⚡ Passo 4: Testar a Conexão no Terminal (Instantâneo)
Abra o terminal no projeto e execute:
```powershell
node integrations/instagram/test-connection.js SEU_ACCESS_TOKEN SEU_ACCOUNT_ID
```
Se estiver correto, você verá a mensagem:
```text
✅ CONEXÃO ESTABELECIDA COM SUCESSO NA META GRAPH API!
• Nome da Conta: Dom RockFeller
• @Username: @domrockfeller
• Seguidores: X
```

---

## 🤖 Passo 5: Ativar no Antigravity como Servidor MCP
No Antigravity, você pode adicionar o servidor MCP no arquivo `~/.gemini/config/mcp_config.json`:
```json
{
  "mcpServers": {
    "instagram-social-media": {
      "command": "node",
      "args": [
        "C:\\Users\\harry\\.gemini\\antigravity-ide\\scratch\\quitafacil-veiculos\\integrations\\instagram\\instagram-mcp-server.js"
      ],
      "env": {
        "INSTAGRAM_ACCESS_TOKEN": "SEU_TOKEN_AQUI",
        "INSTAGRAM_ACCOUNT_ID": "SEU_ID_AQUI"
      }
    }
  }
}
```

---

## 🎯 Passo 6: Como Usar com o Agente Antigravity
Após conectado, basta pedir para mim no chat:
- *"Publique o Reel com o roteiro de juros abusivos que você criou"*
- *"Responda quem comentou QUITAR no último post enviando o link do nosso WhatsApp"*
- *"Me dê um relatório dos posts mais vistos dos últimos 7 dias"*
