import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsDate,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateExpenseDto {
  @IsNotEmpty()
  readonly title: string;

  @IsNumber()
  @IsPositive()
  readonly amount: number;

  @Type(() => Date)
  @IsDate()
  readonly date: Date;

  @IsIn(['食', '衣', '住', '行'])
  readonly category: string;
}
