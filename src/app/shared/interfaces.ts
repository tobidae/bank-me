export interface BankAccount {
  name: string;
  balances: any[];
  subtype: string;
  mask: string;
  account_id: string;
  official_name: string;
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
