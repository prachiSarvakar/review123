enum StrategyName {
  CallDiagonalSpread = "Call Diagonal Spread",
  PutDiagonalSpread = "Put Diagonal Spread",
  CallCalendarSpread = "Call Calendar Spread",
  PutCalendarSpread = "Put Calendar Spread",
}

export function strategyName(index: number): StrategyName | undefined {
  return {
    54: StrategyName.CallDiagonalSpread,
    55: StrategyName.PutDiagonalSpread,
    56: StrategyName.CallCalendarSpread,
    57: StrategyName.PutCalendarSpread,
  }[index];
}

export const itemStrategyAccordionMapping = {
  // starter
  1: "0",
  2: "0",
  3: "0",
  4: "0",
  //  proficient
  5: "1",
  6: "1",
  // debit spreads
  7: "2",
  8: "2",
  // credit spreads
  9: "3",
  10: "3",
  11: "3",
  12: "3",
  // condors
  13: "4",
  14: "4",
  15: "4",
  16: "4",
  17: "4",
  18: "4",
  // straddles
  19: "5",
  20: "5",
  21: "5",
  // strangles
  22: "6",
  23: "6",
  24: "6",
  // butterfly
  25: "7",
  26: "7",
  27: "7",
  28: "7",
  29: "7",
  30: "7",
  // ladder
  31: "8",
  32: "8",
  33: "8",
  34: "8",
  // synthetic
  35: "9",
  36: "9",
  37: "9",
  38: "9",
  39: "9",
  40: "9",
  41: "9",
  42: "9",
  // more
  43: "10",
  44: "10",
  45: "10",
  46: "10",
  47: "10",
  48: "10",
  49: "10",
  50: "10",
  51: "10",
  52: "10",
  53: "10",
  54: "10",
};
