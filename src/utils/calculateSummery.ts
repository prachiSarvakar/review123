import { number } from "mathjs";
import { Leg } from "./legs";

enum LegType {
  Call = 0,
  Put = 1,
  Stock = 2,
}

export default function SummaryHelper() {
  function getCallOptionValue(
    value: number,
    strike: number,
    legSelectionValue: number,
    direction: number,
    size: number
  ): number {
    return Math.round((Math.max(value - strike, 0) - legSelectionValue) * (direction * size * 100));
  }

  function getPutOptionValue(
    value: number,
    strike: number,
    legSelectionValue: number,
    direction: number,
    size: number
  ): number {
    return Math.round((Math.max(strike - value, 0) - legSelectionValue) * (direction * size * 100));
  }

  function getCallBreakEven(strike: number, legSelectionValue: number, direction: number, size: number): number {
    const million: number = 1000000;
    const millionOptionValue = getCallOptionValue(million, strike, legSelectionValue, direction, size);
    const legValue = getCallOptionValue(strike, strike, legSelectionValue, direction, size);
    const breakEven = million - (millionOptionValue / (millionOptionValue - legValue)) * (million - strike);
    return roundToDecimal(breakEven, 2);
  }

  function roundToDecimal(value: number, decimalPlaces: number): number {
    const factor = Math.pow(10, decimalPlaces);
    return Math.round(value * factor) / factor;
  }

  function getPutBreakEven(strike: number, legSelectionValue: number, direction: number, size: number): number {
    const zeroOptionValue = getPutOptionValue(0, strike, legSelectionValue, direction, size);
    const legValue = getPutOptionValue(strike, strike, legSelectionValue, direction, size);
    const breakEven = strike - (legValue / (legValue - zeroOptionValue)) * (strike - 0);
    return roundToDecimal(breakEven, 2);
  }

  function getSingleLegBreakEven(leg: Leg): number {
    const strike = leg.strike;
    const size = Number(leg.size);
    const legSelectionValue = roundToDecimal(leg.purchasePrice, 2);
    switch (leg.type) {
      case LegType.Call:
        return getCallBreakEven(strike, legSelectionValue, Number(leg.direction), size);
      case LegType.Put:
        return getPutBreakEven(strike, legSelectionValue, Number(leg.direction), size);
      case LegType.Stock:
        return 0.0;
    }
  }

  function getDoubleLegBreakEven(legs: Leg[], firstStrike: number, secondStrike: number): number {
    const sortedLegs = legs.sort((a, b) => a.strike - b.strike);
    const firstLegOptionValue = getTotalOptionValue(sortedLegs, firstStrike);
    const secondLegOptionValue = getTotalOptionValue(sortedLegs, secondStrike);
    const breakEven =
      (secondStrike * firstLegOptionValue - firstStrike * secondLegOptionValue) /
      (firstLegOptionValue - secondLegOptionValue);
    return roundToDecimal(breakEven, 2);
  }

  function getTotalOptionValue(legs: Leg[], strike: number): number {
    return legs.reduce((total, leg) => {
      if (leg.type === LegType.Call) {
        return (
          total +
          getCallOptionValue(
            strike,
            leg.strike,
            roundToDecimal(leg.purchasePrice, 2),
            Number(leg.direction),
            Number(leg.size)
          )
        );
      } else if (leg.type === LegType.Put) {
        return (
          total +
          getPutOptionValue(
            strike,
            leg.strike,
            roundToDecimal(leg.purchasePrice, 2),
            Number(leg.direction),
            Number(leg.size)
          )
        );
      } else {
        return total;
      }
    }, 0);
  }

  function getBreakEvenValue(legs: Leg[], firstStrike?: number, secondStrike?: number): string {
    if (firstStrike !== undefined && secondStrike !== undefined) {
      return `${getDoubleLegBreakEven(legs, firstStrike, secondStrike)} (between ${firstStrike} and ${secondStrike})`;
    } else if (firstStrike !== undefined) {
      return `${getSingleLegBreakEven(legs[0])} (at ${firstStrike})`;
    } else {
      return `${getSingleLegBreakEven(legs[0])}`;
    }
  }

  function getMinMaxProfit(legs: Leg[], underlyingPrice: number): { min: string; max: string } {
    const optionValues = legs.map((leg) => {
      if (leg.type === LegType.Call) {
        return getCallOptionValue(
          underlyingPrice,
          leg.strike,
          roundToDecimal(leg.purchasePrice, 2),
          Number(leg.direction),
          Number(leg.size)
        );
      } else if (leg.type === LegType.Put) {
        return getPutOptionValue(
          underlyingPrice,
          leg.strike,
          roundToDecimal(leg.purchasePrice, 2),
          Number(leg.direction),
          Number(leg.size)
        );
      } else {
        return 0;
      }
    });

    const totalValue = optionValues.reduce((total, value) => total + value, 0);
    const minValue = Math.min(...optionValues);
    const maxValue = Math.max(...optionValues);
    return { min: `${totalValue + minValue}`, max: `${totalValue + maxValue}` };
  }

  return {
    getCallOptionValue,
    getPutOptionValue,
    getCallBreakEven,
    roundToDecimal,
    getPutBreakEven,
    getSingleLegBreakEven,
    getDoubleLegBreakEven,
    getTotalOptionValue,
    getBreakEvenValue,
    getMinMaxProfit,
  };
}
