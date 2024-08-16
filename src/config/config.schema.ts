// import Convict from 'convict';

// export interface TConfigSchema{
//   databaseUrl: string;
//   jwtTokenSecret: string;
//   telegramBotToken: string;
//   btfsNodeUrl: string;
// }

// export const Schema: Convict.Schema<TConfigSchema> = {
//   databaseUrl: {
//     doc: 'primary Database Connection Url',
//     default: '<default value here>',
//     env: 'DATABASE_URL',
//   },
//   jwtTokenSecret: {
//     doc: 'jwt token secret fro signing signingt the tokens',
//     default: 'default_token_value',
//     env: 'JWT_AUTH_SECRET',
//   },
//   telegramBotToken: {
//     doc: 'value of the telegramtoken to access the bot',
//     default: '123456:qwerty',
//     env: 'TELEGRAM_BOT_TOKEN'
//   },
//   btfsNodeUrl: {
//     doc: 'link to the btfs node that is been deployed.',
//     default: 'http://localhost:5001/api/v1',
//     env: 'BTFS_NODE_URL'
//   }
// }

// src/config/config.schema.ts

import convict from 'convict';

export interface TConfigSchema {
  databaseUrl: string;
  jwtTokenSecret: string;
  telegramBotToken: string;
  btfsNodeUrl: string;
}

export const schema: convict.Schema<TConfigSchema> = {
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
