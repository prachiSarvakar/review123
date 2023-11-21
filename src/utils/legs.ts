export enum LegType {
  Call = 0,
  Put = 1,
  Stock = 2,
}

export function getTitle(type: LegType): string {
  switch (type) {
    case LegType.Call:
      return "Call";
    case LegType.Put:
      return "Put";
    case LegType.Stock:
      return "Stock";
  }
}

enum OptionSelectionType {
  Bid = 0,
  Mid,
  Ask,
}

export enum DirectionType {
  Buy = 1,
  Sell = -1,
}

export interface Leg {
  [x: string]: any;
  y: number;
  strike: number;
  size: number;
  purchasePrice: number;
  direction: DirectionType;
  type: LegType;
  expiration?: any;
  symbol: string;
  volatility: any;
  range: number;
  indexOfStrikePrice: number;
  index: number;
}

export interface Leg2 {
  [x: string]: any;
  strike: number;
  size: number;
  purchasePrice: number;
  direction: DirectionType;
  type: LegType;
  expiration?: any;
  symbol: string;
  volatility: any;
  range: OptionSelectionType;
  indexOfStrikePrice: number;
  index: number;
  y: number;
}
export interface Leg3 {
  [x: string]: any;
  strike: number;
  size: number;
  purchasePrice: number;
  direction: DirectionType;
  type: LegType;
  expiration?: any;
  symbol: string;
  volatility: any;
  range: OptionSelectionType;
  indexOfStrikePrice: number;
  index: number;
  y: number;
}

export interface Leg4 {
  [x: string]: any;
  strike: number;
  size: number;
  purchasePrice: number;
  direction: DirectionType;
  type: LegType;
  expiration?: any;
  symbol: string;
  volatility: any;
  range: OptionSelectionType;
  indexOfStrikePrice: number;
  index: number;
  y: number;
}
