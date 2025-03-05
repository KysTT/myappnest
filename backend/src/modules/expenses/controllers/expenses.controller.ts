import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { ExpensesService } from '@modules/expenses/services/expenses.service';
import { Expense } from '@prisma/client';
import { GenericResponse } from '@utils/responses/generic-response';

@Controller('api/expenses')
export class ExpenseController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Get()
  async findExpenses(@Req() req: Request): Promise<Expense[]> {
    return this.expensesService.findExpenses(parseInt(req.cookies['id']));
  }

  @Post()
  async createExpense(
    @Body('date') date: string,
    @Body('title') title: string,
    @Body('amount') amount: number,
    @Req() req: Request,
  ): Promise<Expense> {
    return this.expensesService.createExpense(
      date,
      title,
      amount,
      parseInt(req.cookies['id']),
    );
  }

  @Get('totalSpent')
  async findTotalSpent(@Req() req: Request): Promise<number> {
    return this.expensesService.findTotalSpent(parseInt(req.cookies['id']));
  }

  @Delete(':id')
  async deleteExpense(
    @Req() req: Request,
    @Param('id') expense_id: number,
  ): Promise<GenericResponse<Expense>> {
    try {
      const res = await this.expensesService.deleteExpense(
        parseInt(req.cookies['id']),
        expense_id,
      );
      return new GenericResponse<Expense>(res, {
        success: 'expense was deleted',
      });
    } catch (e) {
      throw e;
    }
  }
}
