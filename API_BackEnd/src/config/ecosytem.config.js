module.exports = {
    apps: [
        {
            name: 'CellPhoneStore',
            script: './src/server.js',
            instances: 'max',
            autorestart: true,
            watch: true,
            max_memory_restart: '1G',
            env: {
                NODE_ENV: 'development',
                PORT: 3000,
                DB_URL: 'mongodb://localhost:27017/CellPhoneStore',
            },
            env_production: {
                NODE_ENV: 'production',
                PORT: 3000,
                DB_URL: 'mongodb://localhost:27017/CellPhoneStore',
            },
        },
    ],
};

// pm2 nodejs ecosystem.config.js
