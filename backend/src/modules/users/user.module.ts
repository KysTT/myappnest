import { Module } from '@nestjs/common';
import { UserController } from '@modules/users/controllers/user.controller';
import { UserService } from '@modules/users/services/user.service';
import { PrismaModule } from '@modules/database/prisma.module';
import { UserRepository } from '@modules/users/repository/user.repository';

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [UserService, UserRepository],
})
export class UserModule {}
