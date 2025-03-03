import { Module } from '@nestjs/common';
import { UserModule } from '@modules/users/user.module';
import { PrismaModule } from '@modules/database/prisma.module';
import { ExpensesModule } from '@modules/expenses/expenses.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { StoreModule } from '@modules/store/store.module';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    ExpensesModule,
    StoreModule,
    ServeStaticModule.forRoot({
      rootPath: '../../../frontend/dist',
    }),
  ],
})
export class AppModule {}
