export interface User {
  username: string;
  email: string;
  password: string;
  balanceRUB: number;
  balanceUSD: number;
  balanceEUR: number;
}

export interface Finance {
  _id?: string;
  category_id: string;
  currency: string;
  type: number;
  amount: number;
  date: string;
  description: string;
  categoryName?: string;
}

export interface Category {
  _id?: string;
  title: string;
  color: string;
}
