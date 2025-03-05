import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@modules/database/services/prisma.service';
import { Expense } from '@prisma/client';

@Injectable()
export class ExpensesRepository {
  constructor(private prisma: PrismaService) {}

  async findExpenses(userId: number): Promise<Expense[]> {
    return this.prisma.expense.findMany({
      where: {
        user_id: userId,
      },
    });
  }

  async createExpense(
    date: string,
    title: string,
    amount: number,
    user_id: number,
  ): Promise<Expense> {
    return this.prisma.expense.create({
      data: {
        date: date,
        title: title,
        amount: amount,
        user_id: user_id,
      },
    });
  }

  async findTotalSpent(userId: number): Promise<number> {
    const result = await this.prisma.expense.aggregate({
      where: { user_id: userId },
      _sum: { amount: true },
    });
    return Number(result._sum.amount) || 0;
  }

  async deleteExpense(userId: number, expenseId: number): Promise<Expense> {
    const expense = await this.prisma.expense.findUnique({
      where: { id: expenseId, user_id: userId },
    });
    if (!expense) {
      throw new NotFoundException('Expense not found');
    }
    return this.prisma.expense.delete({
      where: { id: expenseId },
    });
  }
}
