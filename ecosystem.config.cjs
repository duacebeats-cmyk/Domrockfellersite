// ==============================================================================
// PM2 CONFIGURATION — DOM ROCKFELLER & ROCKFELLER CARROS
// Gerenciador de processos de alta disponibilidade para VPS Linux
// Uso: pm2 start ecosystem.config.cjs
// ==============================================================================

module.exports = {
  apps: [
    {
      name: 'domrockfeller-web',
      script: 'server/index.js',
      instances: 'max', // Executa em cluster utilizando todos os núcleos da CPU
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env_production: {
        NODE_ENV: 'production',
        PORT: 3001,
        SESSION_SECRET: 'domrockfeller-production-salt-key-2026-vix-floripa'
      },
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      error_file: 'logs/pm2-error.log',
      out_file: 'logs/pm2-out.log',
      merge_logs: true
    }
  ]
};
