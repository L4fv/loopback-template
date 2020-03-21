module.exports = {
  apps: [{
    name: 'apisauna-js',
    script: 'server/server.js',
    instances: 1,
    exec_mode: 'fork',
    watch: true,
    log_file: '~/.pm2/logs/apisauna-outerr.log',
    out_file: 'NULL', // ~/.pm2/logs/apisauna-out.log
    error_file: 'NULL', // ~/.pm2/logs/apisauna-err.log
    combine_logs: true,
    merge_logs: true,
    env: {
      NODE_ENV: 'production'
    },
    env_development: {
      NODE_ENV: 'development'
    },
    env_localhost: {
      NODE_ENV: 'local'
    }
  }]
};
