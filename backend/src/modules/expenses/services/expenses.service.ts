import { Injectable } from '@nestjs/common';
import { ExpensesRepository } from '@modules/expenses/repository/expenses.repository';
import { Expense } from '@prisma/client';

@Injectable()
export class ExpensesService {
  constructor(private readonly expensesRepository: ExpensesRepository) {}

  async findExpenses(userId: number): Promise<Expense[]> {
    return this.expensesRepository.findExpenses(userId);
  }

  async createExpense(
    date: string,
    title: string,
    amount: number,
    user_id: number,
  ): Promise<Expense> {
    return this.expensesRepository.createExpense(date, title, amount, user_id);
  }

  async findTotalSpent(userId: number): Promise<number> {
    return this.expensesRepository.findTotalSpent(userId);
  }

  async deleteExpense(userId: number, expenseId: number): Promise<Expense> {
    return this.expensesRepository.deleteExpense(userId, expenseId);
  }
}
