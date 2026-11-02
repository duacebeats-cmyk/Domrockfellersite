#!/usr/bin/env node

/**
 * Antigravity MCP Server for Instagram (Meta Graph API)
 * 
 * Provides tools for Antigravity to autonomously act as a Social Media Agent:
 * - Query account stats & profile
 * - Publish Photos, Reels, and Carousels
 * - Read recent media & performance metrics
 * - Respond to comments on posts (e.g. Lead Trigger keywords like "QUITAR")
 * 
 * Usage in Antigravity:
 * In ~/.gemini/config/mcp_config.json or project mcp_config.json:
 * {
 *   "mcpServers": {
 *     "instagram-social-media": {
 *       "command": "node",
 *       "args": ["C:\\Users\\harry\\.gemini\\antigravity-ide\\scratch\\quitafacil-veiculos\\integrations\\instagram\\instagram-mcp-server.js"],
 *       "env": {
 *         "INSTAGRAM_ACCESS_TOKEN": "SEU_TOKEN_AQUI",
 *         "INSTAGRAM_ACCOUNT_ID": "SEU_ID_AQUI"
 *       }
 *     }
 *   }
 * }
 */

import readline from 'readline';

const GRAPH_API_BASE = 'https://graph.facebook.com/v21.0';

const ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;
const ACCOUNT_ID = process.env.INSTAGRAM_ACCOUNT_ID;

const TOOLS = [
  {
    name: 'instagram_get_profile',
    description: 'Retorna informações do perfil comercial do Instagram (seguidores, bio, posts, username) para verificar a conexão.',
    inputSchema: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'instagram_publish_photo',
    description: 'Publica uma foto com legenda no feed do Instagram da empresa.',
    inputSchema: {
      type: 'object',
      properties: {
        imageUrl: { type: 'string', description: 'URL pública da imagem (JPG/PNG)' },
        caption: { type: 'string', description: 'Legenda do post incluindo hashtags' }
      },
      required: ['imageUrl', 'caption']
    }
  },
  {
    name: 'instagram_publish_reel',
    description: 'Publica um vídeo curto (Reels) no Instagram da empresa.',
    inputSchema: {
      type: 'object',
      properties: {
        videoUrl: { type: 'string', description: 'URL pública do vídeo (MP4 vertical 9:16)' },
        caption: { type: 'string', description: 'Legenda do Reel com gancho e chamada para ação' },
        shareToFeed: { type: 'boolean', description: 'Se deve compartilhar também na grade do feed principal (padrão true)' }
      },
      required: ['videoUrl', 'caption']
    }
  },
  {
    name: 'instagram_publish_carousel',
    description: 'Publica um carrossel de 2 a 10 imagens no feed do Instagram.',
    inputSchema: {
      type: 'object',
      properties: {
        imageUrls: {
          type: 'array',
          items: { type: 'string' },
          description: 'Lista de URLs públicas das imagens (2 a 10 fotos)'
        },
        caption: { type: 'string', description: 'Legenda explicativa do carrossel' }
      },
      required: ['imageUrls', 'caption']
    }
  },
  {
    name: 'instagram_get_recent_media',
    description: 'Lista as últimas publicações do perfil com contagem de curtidas, comentários e links.',
    inputSchema: {
      type: 'object',
      properties: {
        limit: { type: 'number', description: 'Quantidade de posts a buscar (padrão 10)' }
      }
    }
  },
  {
    name: 'instagram_reply_comment',
    description: 'Responde um comentário de uma publicação (ótimo para automação de comentários como QUITAR).',
    inputSchema: {
      type: 'object',
      properties: {
        commentId: { type: 'string', description: 'ID do comentário no Instagram' },
        message: { type: 'string', description: 'Texto da resposta a ser enviada publicamente' }
      },
      required: ['commentId', 'message']
    }
  },
  {
    name: 'instagram_get_insights',
    description: 'Consulta métricas gerais da conta (alcance, impressões e visualizações de perfil).',
    inputSchema: {
      type: 'object',
      properties: {
        period: { type: 'string', enum: ['day', 'week', 'days_28'], description: 'Período das métricas (padrão day)' }
      }
    }
  }
];

// Helper to check credentials
function checkAuth() {
  if (!ACCESS_TOKEN || !ACCOUNT_ID) {
    throw new Error('INSTAGRAM_ACCESS_TOKEN ou INSTAGRAM_ACCOUNT_ID não configurados nas variáveis de ambiente.');
  }
}

// Tool Executors
async function executeTool(name, args) {
  checkAuth();

  switch (name) {
    case 'instagram_get_profile': {
      const url = `${GRAPH_API_BASE}/${ACCOUNT_ID}?fields=id,username,name,profile_picture_url,followers_count,follows_count,media_count,biography&access_token=${encodeURIComponent(ACCESS_TOKEN)}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      return data;
    }

    case 'instagram_publish_photo': {
      const containerUrl = `${GRAPH_API_BASE}/${ACCOUNT_ID}/media`;
      const cRes = await fetch(containerUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image_url: args.imageUrl,
          caption: args.caption,
          access_token: ACCESS_TOKEN
        })
      });
      const cData = await cRes.json();
      if (cData.error) throw new Error(cData.error.message);

      const pubUrl = `${GRAPH_API_BASE}/${ACCOUNT_ID}/media_publish`;
      const pubRes = await fetch(pubUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ creation_id: cData.id, access_token: ACCESS_TOKEN })
      });
      const pubData = await pubRes.json();
      if (pubData.error) throw new Error(pubData.error.message);
      return { success: true, postId: pubData.id, status: 'PUBLISHED' };
    }

    case 'instagram_publish_reel': {
      const containerUrl = `${GRAPH_API_BASE}/${ACCOUNT_ID}/media`;
      const cRes = await fetch(containerUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          media_type: 'REELS',
          video_url: args.videoUrl,
          caption: args.caption,
          share_to_feed: args.shareToFeed ?? true,
          access_token: ACCESS_TOKEN
        })
      });
      const cData = await cRes.json();
      if (cData.error) throw new Error(cData.error.message);

      // Wait a few seconds for video container processing
      await new Promise(r => setTimeout(r, 4000));

      const pubUrl = `${GRAPH_API_BASE}/${ACCOUNT_ID}/media_publish`;
      const pubRes = await fetch(pubUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ creation_id: cData.id, access_token: ACCESS_TOKEN })
      });
      const pubData = await pubRes.json();
      if (pubData.error) throw new Error(pubData.error.message);
      return { success: true, postId: pubData.id, status: 'REEL_PUBLISHED' };
    }

    case 'instagram_get_recent_media': {
      const limit = args.limit || 10;
      const url = `${GRAPH_API_BASE}/${ACCOUNT_ID}/media?fields=id,caption,media_type,permalink,timestamp,like_count,comments_count&limit=${limit}&access_token=${encodeURIComponent(ACCESS_TOKEN)}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      return data.data || [];
    }

    case 'instagram_reply_comment': {
      const url = `${GRAPH_API_BASE}/${args.commentId}/replies`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: args.message, access_token: ACCESS_TOKEN })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      return { success: true, replyId: data.id };
    }

    case 'instagram_get_insights': {
      const period = args.period || 'day';
      const url = `${GRAPH_API_BASE}/${ACCOUNT_ID}/insights?metric=impressions,reach,profile_views&period=${period}&access_token=${encodeURIComponent(ACCESS_TOKEN)}`;
      const res = await fetch(url);
      const data = await res.json();
      return data.data || [];
    }

    default:
      throw new Error(`Ferramenta desconhecida: ${name}`);
  }
}

// JSON-RPC 2.0 Standard MCP Protocol over Stdio
const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: false });

rl.on('line', async (line) => {
  if (!line.trim()) return;
  try {
    const request = JSON.parse(line);
    const { id, method, params } = request;

    if (method === 'initialize') {
      const response = {
        jsonrpc: '2.0',
        id,
        result: {
          protocolVersion: '2024-11-05',
          capabilities: { tools: {} },
          serverInfo: { name: 'antigravity-instagram-mcp', version: '1.0.0' }
        }
      };
      process.stdout.write(JSON.stringify(response) + '\n');
    } else if (method === 'tools/list') {
      const response = {
        jsonrpc: '2.0',
        id,
        result: { tools: TOOLS }
      };
      process.stdout.write(JSON.stringify(response) + '\n');
    } else if (method === 'tools/call') {
      try {
        const result = await executeTool(params.name, params.arguments || {});
        const response = {
          jsonrpc: '2.0',
          id,
          result: {
            content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
          }
        };
        process.stdout.write(JSON.stringify(response) + '\n');
      } catch (err) {
        const response = {
          jsonrpc: '2.0',
          id,
          result: {
            content: [{ type: 'text', text: `Erro ao executar ${params.name}: ${err.message}` }],
            isError: true
          }
        };
        process.stdout.write(JSON.stringify(response) + '\n');
      }
    }
  } catch (parseErr) {
    // Ignore invalid JSON lines
  }
});
