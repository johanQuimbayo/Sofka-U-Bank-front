export interface Account {
  id: number;
  type: 'SAVINGS' | 'CHECKING';
  customerId: number;
  balance: number;
  accountNumber: number;
}
