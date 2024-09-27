"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schema = void 0;
exports.schema = {
    databaseUrl: {
        doc: 'Primary Database Connection URL',
        default: '<default value here>',
        env: 'DATABASE_URL',
        format: String,
    },
    jwtTokenSecret: {
        doc: 'JWT token secret for signing tokens',
        default: 'next_auth_flux_7938',
        env: 'JWT_AUTH_SECRET',
        format: String,
    },
    telegramBotToken: {
        doc: 'Telegram bot token to access the bot',
        default: '123456:qwerty',
        env: 'TELEGRAM_BOT_TOKEN',
        format: String,
    },
    btfsNodeUrl: {
        doc: 'Link to the BTFS node that is deployed',
        default: 'http://localhost:5001/api/v1',
        env: 'BTFS_NODE_URL',
        format: String,
    },
};
//# sourceMappingURL=config.schema.js.map