export type TransactionTypes = "DEPOSIT" | "WITHDRAWAL";

export type TransactionRequest = {
    accountId: string;
    transactionType: TransactionTypes;
    amount: number;
    userId: string;
    withdrawalType: "ATM"
}

export type TransactionResponse = {
    transactionId: string;
    accountId: string;
    transactionType: TransactionTypes;
    initialBalance: number;
    amount: number;
    finalBalance: number;
    status: string;
}