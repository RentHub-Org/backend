import convict from 'convict';
export interface TConfigSchema {
    databaseUrl: string;
    jwtTokenSecret: string;
    telegramBotToken: string;
    btfsNodeUrl: string;
}
export declare const schema: convict.Schema<TConfigSchema>;
