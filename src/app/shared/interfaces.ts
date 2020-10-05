export class BankAccount {
  name: string;
  balances: AccountBalance;
  subtype: string;
  mask: string;
  account_id: string;
  official_name: string;
}
export class AccountBalance {
  available: string;
  current: string;
  limit: string;
}

export class AccountInfo {
  account: string;
  routing: string;
  wire_routing: string;
  account_id: string;
}

export class BankTransaction {
  name: string;
  category: [string];
  category_id: string;
  amount: string;
  date: string;
  account_id: string;
  transaction_id: string;
  pending: boolean;
  isTxSelected: boolean;
}

export enum PlaidErrors {
  PRODUCT_NOT_READY = 'PRODUCT_NOT_READY'
}

export class PlaidInfo {
  clientID: string;
  publicKey: string;
  secretKey: string;
}
