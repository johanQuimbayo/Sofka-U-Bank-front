export interface AccountRequest {
  id?: number;
  type: string;
  customerId: number;
  balance: number;
  accountNumber?: number;
}
