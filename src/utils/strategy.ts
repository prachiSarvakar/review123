import { Leg } from '@/utils/legs';

export interface Strategy {
  strategyId: number;
  ticker: string;
  currentPrice: number; // stock price
  purchasePrice: number;
  interestRate?: number; // continuously compounded risk-free interest rate (% p.a.)
  dividend?: number; // continuously compounded dividend yield (% p.a.)
  createdDateTime: Date;
  legs: Leg[];
  name: string;
  shareURL?: string;
  sortOrder: number;
  quoteDescription: string;
  changePercentage: number;
}

enum DirectionType {
  Buy = 1,
  Sell = -1,
}
