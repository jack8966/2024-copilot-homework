import { Test, TestingModule } from '@nestjs/testing';
import { ExpenseService } from './expense.service';
import { getModelToken } from '@nestjs/mongoose';
import { CreateExpenseDto } from './dto/create-expense.dto';

describe('ExpenseService', () => {
  let service: ExpenseService;
  const mockExpenseModel = {
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndRemove: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExpenseService,
        {
          provide: getModelToken('Expense'),
          useValue: mockExpenseModel,
        },
      ],
    }).compile();

    service = module.get<ExpenseService>(ExpenseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an expense', async () => {
    const expenseDto: CreateExpenseDto = {
      title: 'Test',
      date: new Date(),
      amount: 100,
      category: '食',
    };
    mockExpenseModel.save.mockResolvedValue(expenseDto);
    expect(await service.create(expenseDto)).toEqual(expenseDto);
  });

  it('should find all expenses', async () => {
    const expenseDto: CreateExpenseDto = {
      title: 'Test',
      date: new Date(),
      amount: 100,
      category: '衣',
    };
    mockExpenseModel.find.mockResolvedValue([expenseDto]);
    expect(await service.findAll('Test', '2022-01-01', '2022-01-31')).toEqual([
      expenseDto,
    ]);
  });

  it('should find one expense', async () => {
    const expenseDto: CreateExpenseDto = {
      title: 'Test',
      date: new Date(),
      amount: 100,
      category: '衣',
    };
    const id = 'someId';
    mockExpenseModel.findById.mockResolvedValue(expenseDto);
    expect(await service.findOne(id)).toEqual(expenseDto);
  });

  it('should update an expense', async () => {
    const updatedExpenseDto: CreateExpenseDto = {
      title: 'Updated Test',
      date: new Date(),
      amount: 200,
      category: '食',
    };
    const id = 'someId';
    mockExpenseModel.findByIdAndUpdate.mockResolvedValue(updatedExpenseDto);
    expect(await service.update(id, updatedExpenseDto)).toEqual(
      updatedExpenseDto,
    );
  });

  it('should delete an expense', async () => {
    const expenseDto: CreateExpenseDto = {
      title: 'Test',
      date: new Date(),
      amount: 100,
      category: '衣',
    };
    const id = 'someId';
    mockExpenseModel.findByIdAndRemove.mockResolvedValue(expenseDto);
    expect(await service.delete(id)).toEqual(expenseDto);
  });

  it('should throw an error when finding a non-existing expense', async () => {
    const id = 'someId';
    mockExpenseModel.findById.mockResolvedValue(null);
    await expect(service.findOne(id)).rejects.toThrow();
  });

  it('should throw an error when updating a non-existing expense', async () => {
    const updatedExpenseDto: CreateExpenseDto = {
      title: 'Updated Test',
      date: new Date(),
      amount: 200,
      category: '食',
    };
    const id = 'someId';
    mockExpenseModel.findByIdAndUpdate.mockResolvedValue(null);
    await expect(service.update(id, updatedExpenseDto)).rejects.toThrow();
  });

  it('should throw an error when deleting a non-existing expense', async () => {
    const id = 'someId';
    mockExpenseModel.findByIdAndRemove.mockResolvedValue(null);
    await expect(service.delete(id)).rejects.toThrow();
  });
});
