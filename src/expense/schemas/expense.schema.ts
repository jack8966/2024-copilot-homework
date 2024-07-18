import * as mongoose from 'mongoose';

export const ExpenseSchema = new mongoose.Schema({
  title: String,
  amount: Number,
  date: Date,
  category: String,
});
