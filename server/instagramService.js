// Instagram Integration Service for Dom RockFeller
// Uses Meta Graph API (v21.0) for Instagram Professional / Creator Accounts

const GRAPH_API_BASE = 'https://graph.facebook.com/v21.0';

export class InstagramService {
  constructor(accessToken = null, accountId = null) {
    this.accessToken = accessToken || process.env.INSTAGRAM_ACCESS_TOKEN;
    this.accountId = accountId || process.env.INSTAGRAM_ACCOUNT_ID;
  }

  setCredentials(accessToken, accountId) {
    this.accessToken = accessToken;
    this.accountId = accountId;
  }

  isConfigured() {
    return Boolean(this.accessToken && this.accountId);
  }

  /**
   * Valida as credenciais na Meta e retorna dados do perfil conectado
   */
  async getProfile() {
    if (!this.isConfigured()) {
      return { 
        connected: false, 
        message: 'Credenciais do Instagram não configuradas (Access Token ou Account ID ausente)' 
      };
    }

    try {
      const url = `${GRAPH_API_BASE}/${this.accountId}?fields=id,username,name,profile_picture_url,followers_count,follows_count,media_count,biography&access_token=${encodeURIComponent(this.accessToken)}`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.error) {
        return {
          connected: false,
          error: data.error.message,
          type: data.error.type,
          code: data.error.code
        };
      }

      return {
        connected: true,
        account: {
          id: data.id,
          username: data.username,
          name: data.name,
          profilePicture: data.profile_picture_url,
          followers: data.followers_count,
          following: data.follows_count,
          postsCount: data.media_count,
          bio: data.biography
        }
      };
    } catch (err) {
      return { connected: false, error: err.message };
    }
  }

  /**
   * Publica uma foto única no feed com legenda
   */
  async publishPhoto(imageUrl, caption) {
    if (!this.isConfigured()) throw new Error('Instagram não configurado.');

    // 1. Criar container de mídia
    const containerUrl = `${GRAPH_API_BASE}/${this.accountId}/media`;
    const containerRes = await fetch(containerUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image_url: imageUrl,
        caption: caption,
        access_token: this.accessToken
      })
    });
    const containerData = await containerRes.json();
    if (containerData.error) throw new Error(containerData.error.message);

    const creationId = containerData.id;

    // 2. Publicar o container
    return this._publishContainer(creationId);
  }

  /**
   * Publica um Story (formato 9:16 vertical) no perfil do Instagram
   */
  async publishStory(imageUrl) {
    if (!this.isConfigured()) throw new Error('Instagram não configurado.');

    const containerUrl = `${GRAPH_API_BASE}/${this.accountId}/media`;
    const containerRes = await fetch(containerUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        media_type: 'STORIES',
        image_url: imageUrl,
        access_token: this.accessToken
      })
    });
    const containerData = await containerRes.json();
    if (containerData.error) throw new Error(containerData.error.message);

    const creationId = containerData.id;
    return this._publishContainer(creationId);
  }

  /**
   * Publica um vídeo / Reel no Instagram
   */
  async publishReel(videoUrl, caption, shareToFeed = true) {
    if (!this.isConfigured()) throw new Error('Instagram não configurado.');

    // 1. Criar container de mídia para REELS
    const containerUrl = `${GRAPH_API_BASE}/${this.accountId}/media`;
    const containerRes = await fetch(containerUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        media_type: 'REELS',
        video_url: videoUrl,
        caption: caption,
        share_to_feed: shareToFeed,
        access_token: this.accessToken
      })
    });
    const containerData = await containerRes.json();
    if (containerData.error) throw new Error(containerData.error.message);

    const creationId = containerData.id;

    // Aguardar processamento do vídeo pela Meta (pooling leve)
    await this._waitForMediaProcessing(creationId);

    // 2. Publicar o container
    return this._publishContainer(creationId);
  }

  /**
   * Publica um carrossel de até 10 imagens
   */
  async publishCarousel(imageUrls, caption) {
    if (!this.isConfigured()) throw new Error('Instagram não configurado.');
    if (!Array.isArray(imageUrls) || imageUrls.length < 2) {
      throw new Error('Um carrossel precisa ter no mínimo 2 imagens.');
    }

    // 1. Criar containers individuais para cada slide
    const childIds = [];
    for (const img of imageUrls) {
      const itemUrl = `${GRAPH_API_BASE}/${this.accountId}/media`;
      const itemRes = await fetch(itemUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          is_carousel_item: true,
          image_url: img,
          access_token: this.accessToken
        })
      });
      const itemData = await itemRes.json();
      if (itemData.error) throw new Error(`Falha ao preparar slide: ${itemData.error.message}`);
      childIds.push(itemData.id);
    }

    // 2. Criar container carrossel pai
    const carouselUrl = `${GRAPH_API_BASE}/${this.accountId}/media`;
    const carouselRes = await fetch(carouselUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        media_type: 'CAROUSEL',
        children: childIds.join(','),
        caption: caption,
        access_token: this.accessToken
      })
    });
    const carouselData = await carouselRes.json();
    if (carouselData.error) throw new Error(carouselData.error.message);

    // 3. Publicar carrossel
    return this._publishContainer(carouselData.id);
  }

  /**
   * Lista os posts mais recentes com métricas básicas
   */
  async getRecentMedia(limit = 10) {
    if (!this.isConfigured()) throw new Error('Instagram não configurado.');

    const url = `${GRAPH_API_BASE}/${this.accountId}/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,like_count,comments_count&limit=${limit}&access_token=${encodeURIComponent(this.accessToken)}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);

    return data.data || [];
  }

  /**
   * Busca comentários de uma publicação
   */
  async getComments(mediaId) {
    if (!this.isConfigured()) throw new Error('Instagram não configurado.');

    const url = `${GRAPH_API_BASE}/${mediaId}/comments?fields=id,text,username,timestamp,like_count&access_token=${encodeURIComponent(this.accessToken)}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);

    return data.data || [];
  }

  /**
   * Responde a um comentário específico (ex: quando comentam "QUITAR")
   */
  async replyComment(commentId, message) {
    if (!this.isConfigured()) throw new Error('Instagram não configurado.');

    const url = `${GRAPH_API_BASE}/${commentId}/replies`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: message,
        access_token: this.accessToken
      })
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);

    return { success: true, replyId: data.id };
  }

  /**
   * Busca métricas de alcance e impressões da conta
   */
  async getAccountInsights(period = 'day') {
    if (!this.isConfigured()) throw new Error('Instagram não configurado.');

    try {
      const url = `${GRAPH_API_BASE}/${this.accountId}/insights?metric=impressions,reach,profile_views&period=${period}&access_token=${encodeURIComponent(this.accessToken)}`;
      const res = await fetch(url);
      const data = await res.json();
      return data.data || [];
    } catch {
      return [];
    }
  }

  // --- Funções Auxiliares Internas ---
  async _publishContainer(creationId) {
    const publishUrl = `${GRAPH_API_BASE}/${this.accountId}/media_publish`;
    const publishRes = await fetch(publishUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        creation_id: creationId,
        access_token: this.accessToken
      })
    });
    const publishData = await publishRes.json();
    if (publishData.error) throw new Error(publishData.error.message);

    return {
      success: true,
      postId: publishData.id,
      publishedAt: new Date().toISOString()
    };
  }

  async _waitForMediaProcessing(creationId, maxAttempts = 10) {
    for (let i = 0; i < maxAttempts; i++) {
      const statusUrl = `${GRAPH_API_BASE}/${creationId}?fields=status_code&access_token=${encodeURIComponent(this.accessToken)}`;
      const res = await fetch(statusUrl);
      const data = await res.json();
      if (data.status_code === 'FINISHED') return true;
      if (data.status_code === 'ERROR') throw new Error('A Meta falhou ao processar o arquivo de vídeo do Reel.');
      // Aguardar 3 segundos antes da próxima checagem
      await new Promise(r => setTimeout(r, 3000));
    }
    return true;
  }
}

export const instagramService = new InstagramService();
