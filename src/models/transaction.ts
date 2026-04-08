export type TransactionType = 'entrada' | 'saida';

export interface FinanceTransaction {
  id?: string;
  description: string;
  type: TransactionType;
  value: number;
  date: Date;
  month: string; // format "yyyy-MM"
  icon: string;
}
