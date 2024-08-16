import { Injectable } from '@nestjs/common';
import convict from 'convict';
import { schema, TConfigSchema } from './config.schema';
import * as dotenv from 'dotenv';

@Injectable()
export class ConfigService {
  private config: convict.Config<TConfigSchema>;

  constructor() {
    this.config = convict(schema);
    const dotEnvFile = dotenv.config().parsed;
    if (dotEnvFile) {
      this.config.load(dotEnvFile);
    }
    this.config.validate({ allowed: 'warn' });
  }

  get(configName: string) {
    return this.config.get(configName);
  }
}

 

// import { Injectable } from '@nestjs/common';
// import Convict from 'convict';
// import { schema, TConfigSchema } from './config.schema';
// import * as dotenv from 'dotenv';

// @Injectable()
// export class ConfigService {
//   config: Convict.Config<TConfigSchema>;

//   constructor() {
//     this.config = Convict(schema);
//     const dotEnvFile = dotenv.config().parsed;
//     if (dotEnvFile) {
//       this.config.load(dotenv.config().parsed);
//     }
//     this.config.validate({ allowed: 'warn' });
//   }

//   get(configName: string) {
//     return this.config.get(configName);
//   }
// }

// src/config/config.service.ts

// import { Injectable } from '@nestjs/common';
// import Convict from 'convict';
// import { schema, TConfigSchema } from './config.schema';

// @Injectable()
// export class ConfigService {
//   private readonly config: Convict.Config<TConfigSchema>;

//   constructor() {
//     this.config = Convict(schema);
//     this.config.validate({ allowed: 'warn' });
//   }

//   get<T extends keyof TConfigSchema>(key: T): TConfigSchema[T] {
//     return this.config.get(key) as any;
//   }
// }
