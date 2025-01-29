export interface Transaction {
  id: string;
  accountId: string;
  transactionType: 'DEPOSIT' | 'WITHDRAW';
  initialBalance: number;
  amount: number;
  finalBalance: number;
  userId: string;
  timestamp: string;
}
