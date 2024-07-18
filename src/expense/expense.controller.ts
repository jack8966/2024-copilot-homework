import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { ExpenseService } from './expense.service';
import { Expense } from './interfaces/expense.interface';

@Controller('expense')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Post()
  async create(@Body() createExpenseDto: CreateExpenseDto) {
    return this.expenseService.create(createExpenseDto);
  }

  @Get()
  async findAll(
    @Query('title') title: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<Expense[]> {
    return this.expenseService.findAll(title, startDate, endDate);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Expense> {
    return this.expenseService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateExpenseDto: CreateExpenseDto,
  ): Promise<Expense> {
    return this.expenseService.update(id, updateExpenseDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Expense> {
    return this.expenseService.delete(id);
  }
}
