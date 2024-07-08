import Convict from 'convict';

export interface TConfigSchema{
  databaseUrl: string;
  jwtTokenSecret: string;
  telegramBotToken: string;
  btfsNodeUrl: string;
}

export const Schema: Convict.Schema<TConfigSchema> = {
  databaseUrl: {
    doc: 'primary Database Connection Url',
    default: '<default value here>',
    env: 'DATABASE_URL',
  },
  jwtTokenSecret: {
    doc: 'jwt token secret fro signing signingt the tokens',
    default: 'default_token_value',
    env: 'JWT_AUTH_SECRET',
  },
  telegramBotToken: {
    doc: 'value of the telegramtoken to access the bot',
    default: '123456:qwerty',
    env: 'TELEGRAM_BOT_TOKEN'
  },
  btfsNodeUrl: {
    doc: 'link to the btfs node that is been deployed.',
    default: 'http://localhost:5001/api/v1',
    env: 'BTFS_NODE_URL'
  }
}