import {TransactionTypes} from "../types";

export type TransactionResponse = {
  transactionId: string;
  accountId: string;
  transactionType: TransactionTypes;
  initialBalance: number;
  amount: number;
  finalBalance: number;
  status: string;
}
