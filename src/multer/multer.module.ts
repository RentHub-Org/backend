import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    MulterModule.register({
      // Multer configuration options go here
    }),
  ],
  exports: [MulterModule],
})

export class MulterModule {}