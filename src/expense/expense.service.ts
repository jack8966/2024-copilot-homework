import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Expense } from './interfaces/expense.interface';
import { CreateExpenseDto } from './dto/create-expense.dto';

@Injectable()
export class ExpenseService {
  private readonly logger = new Logger(ExpenseService.name);

  constructor(
    @InjectModel('Expense') private readonly expenseModel: Model<Expense>,
  ) {}

  async create(createExpenseDto: CreateExpenseDto): Promise<Expense> {
    this.logger.log(`Creating expense: ${JSON.stringify(createExpenseDto)}`);
    const createdExpense = new this.expenseModel(createExpenseDto);
    return await createdExpense.save();
  }

  async findAll(
    title: string,
    startDate: string,
    endDate: string,
  ): Promise<Expense[]> {
    this.logger.log(
      `Finding all expenses with title: ${title}, startDate: ${startDate}, endDate: ${endDate}`,
    );
    if (
      new Date(startDate) > new Date(endDate) ||
      new Date(endDate).getTime() - new Date(startDate).getTime() >
        30 * 24 * 60 * 60 * 1000
    ) {
      this.logger.error('Invalid date range');
      throw new BadRequestException('Invalid date range');
    }
    return await this.expenseModel
      .find({
        title: { $regex: title, $options: 'i' },
        date: { $gte: new Date(startDate), $lte: new Date(endDate) },
      })
      .exec();
  }

  async findOne(id: string): Promise<Expense> {
    this.logger.log(`Finding expense with id: ${id}`);
    const expense = await this.expenseModel.findById(id).exec();
    if (!expense) {
      this.logger.error('Expense not found');
      throw new NotFoundException('Expense not found');
    }
    return expense;
  }

  async update(
    id: string,
    updateExpenseDto: CreateExpenseDto,
  ): Promise<Expense> {
    this.logger.log(`Updating expense with id: ${id}`);
    const updatedExpense = await this.expenseModel
      .findByIdAndUpdate(id, updateExpenseDto, { new: true })
      .exec();
    if (!updatedExpense) {
      this.logger.error('Expense not found');
      throw new NotFoundException('Expense not found');
    }
    return updatedExpense;
  }

  async delete(id: string): Promise<Expense> {
    this.logger.log(`Deleting expense with id: ${id}`);
    const deletedExpense = await this.expenseModel.findByIdAndDelete(id).exec();
    if (!deletedExpense) {
      this.logger.error('Expense not found');
      throw new NotFoundException('Expense not found');
    }
    return deletedExpense;
  }
}
