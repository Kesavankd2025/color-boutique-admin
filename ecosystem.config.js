module.exports = {
  apps: [{
    name: 'nalsuval-admin',
    script: 'npm',
    args: 'start',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '2G', // Restart if memory exceeds 2GB
    env: {
      NODE_ENV: 'development',
      NODE_OPTIONS: '--max-old-space-size=8192'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }]
};