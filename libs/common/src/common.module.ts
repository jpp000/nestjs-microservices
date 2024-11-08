import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';

@Module({
  providers: [],
  exports: [],
  imports: [DatabaseModule],
})
export class CommonModule {}
