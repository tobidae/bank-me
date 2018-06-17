export interface BankAccount {
  name: string;
  balances: AccountBalance;
  subtype: string;
  mask: string;
  account_id: string;
  official_name: string;
}
export interface AccountBalance {
  available: string;
  current: string;
  limit: string;
}

export interface AccountInfo {
  account: string;
  routing: string;
  wire_routing: string;
  account_id: string;
}

export interface BankTransaction {
  name: string;
  category: [string];
  amount: string;
  date: string;
  account_id: string;
  transaction_id: string;
  pending: boolean;
}

export enum PlaidErrors {
  PRODUCT_NOT_READY = 'PRODUCT_NOT_READY'
}
