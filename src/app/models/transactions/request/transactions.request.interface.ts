import {TransactionTypes} from "../types";

export type TransactionRequest = {
  accountId: string;
  transactionType: TransactionTypes;
  amount: number;
  userId: string;
  withdrawalType: "ATM"
}
