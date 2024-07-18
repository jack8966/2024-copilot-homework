import { Document } from 'mongoose';

export interface Expense extends Document {
  readonly title: string;
  readonly amount: number;
  readonly date: Date;
  readonly category: string;
}
