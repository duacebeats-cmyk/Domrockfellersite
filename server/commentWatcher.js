// Dom RockFeller Comment Watcher & Auto-Responder Bot
// Continuously monitors Instagram posts for incoming comments and automatically replies with trained AI

import { instagramService } from './instagramService.js';
import { aiResponder } from './aiResponder.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, 'data', 'database.json');

export class CommentWatcher {
  constructor() {
    this.intervalId = null;
    this.pollIntervalMs = 60000; // Checa a cada 60 segundos
    this.isScanning = false;
    this.repliedCommentIds = new Set();
    this.loadRepliedIds();
  }

  loadRepliedIds() {
    try {
      if (fs.existsSync(DB_PATH)) {
        const raw = fs.readFileSync(DB_PATH, 'utf-8');
        const db = JSON.parse(raw);
        if (Array.isArray(db.repliedInstagramComments)) {
          this.repliedCommentIds = new Set(db.repliedInstagramComments);
        }
      }
    } catch (e) {
      console.error('[COMMENT-WATCHER] Erro ao carregar histórico:', e.message);
    }
  }

  saveRepliedId(commentId, interactionData) {
    this.repliedCommentIds.add(commentId);
    try {
      if (fs.existsSync(DB_PATH)) {
        const raw = fs.readFileSync(DB_PATH, 'utf-8');
        const db = JSON.parse(raw);
        if (!Array.isArray(db.repliedInstagramComments)) {
          db.repliedInstagramComments = [];
        }
        db.repliedInstagramComments.push(commentId);

        if (!Array.isArray(db.aiInteractions)) {
          db.aiInteractions = [];
        }
        db.aiInteractions.push(interactionData);

        fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf-8');
      }
    } catch (e) {
      console.error('[COMMENT-WATCHER] Erro ao salvar comentário respondido:', e.message);
    }
  }

  /**
   * Executa varredura completa nos posts recentes
   */
  async scanAndReply() {
    if (this.isScanning) return { scanning: true, count: 0 };
    if (!instagramService.isConfigured()) return { configured: false, count: 0 };

    this.isScanning = true;
    let repliesCount = 0;

    try {
      // 1. Buscar últimos posts
      const posts = await instagramService.getRecentMedia(5);

      for (const post of posts) {
        // 2. Buscar comentários de cada post
        const comments = await instagramService.getComments(post.id);

        for (const comment of comments) {
          // Ignorar se já foi respondido nesta sessão ou no histórico
          if (this.repliedCommentIds.has(comment.id)) continue;

          // Ignorar comentários feitos pela própria conta oficial
          if (comment.username === 'domrockfellervix') {
            this.repliedCommentIds.add(comment.id);
            continue;
          }

          // 3. IA analisa o texto do seguidor e gera a resposta estratégica
          const replyText = aiResponder.generateReply(comment.username, comment.text);

          console.log(`[AI-RESPONDER] Novo comentário de @${comment.username} no post ${post.id}: "${comment.text}"`);
          console.log(`[AI-RESPONDER] Gerando resposta inteligente: "${replyText.substring(0, 80)}..."`);

          try {
            // 4. Dispara a resposta na Meta Graph API
            const result = await instagramService.replyComment(comment.id, replyText);

            if (result?.success) {
              repliesCount++;
              console.log(`[AI-RESPONDER] ✅ Comentário respondido com sucesso! Reply ID: ${result.replyId}`);
              
              this.saveRepliedId(comment.id, {
                commentId: comment.id,
                username: comment.username,
                userText: comment.text,
                replyText: replyText,
                replyId: result.replyId,
                postId: post.id,
                timestamp: new Date().toISOString()
              });
            }
          } catch (replyErr) {
            console.error(`[AI-RESPONDER] ❌ Falha ao responder comentário ${comment.id}:`, replyErr.message);
          }
        }
      }
    } catch (err) {
      console.error('[COMMENT-WATCHER] Erro durante a varredura:', err.message);
    } finally {
      this.isScanning = false;
    }

    return { success: true, replied: repliesCount };
  }

  start() {
    if (this.intervalId) return;
    console.log('[COMMENT-WATCHER] Monitor de Comentários do Instagram Iniciado (Polling a cada 60s).');
    this.intervalId = setInterval(() => this.scanAndReply(), this.pollIntervalMs);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}

export const commentWatcher = new CommentWatcher();
