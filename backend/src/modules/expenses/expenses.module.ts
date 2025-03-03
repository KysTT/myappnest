import { Module } from '@nestjs/common';
import { PrismaModule } from '@modules/database/prisma.module';
import { ExpenseController } from '@modules/expenses/controllers/expenses.controller';
import { ExpensesService } from '@modules/expenses/services/expenses.service';
import { ExpensesRepository } from '@modules/expenses/repository/expenses.repository';

@Module({
  imports: [PrismaModule],
  controllers: [ExpenseController],
  providers: [ExpensesService, ExpensesRepository],
})
export class ExpensesModule {}
