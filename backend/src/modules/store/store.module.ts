import { Module } from '@nestjs/common';
import { PrismaModule } from '@modules/database/prisma.module';
import { StoreController } from '@modules/store/controllers/store.controller';
import { StoreService } from '@modules/store/services/store.service';
import { StoreRepository } from '@modules/store/repository/store.repository';

@Module({
  imports: [PrismaModule],
  controllers: [StoreController],
  providers: [StoreService, StoreRepository],
})
export class StoreModule {}
