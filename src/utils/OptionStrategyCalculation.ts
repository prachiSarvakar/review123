import { Strategy } from "@/utils/strategy";
import { Leg } from "@/utils/legs";

enum LegType {
  Call = 0,
  Put = 1,
  Stock = 2,
}
export default class SummaryHelper {
  private strategy: Strategy;

  constructor(strategy: Strategy) {
    this.strategy = strategy;
  }

  private getCallOptionValue(
    value: number,
    strike: number,
    legSelectionValue: number,
    direction: number,
    size: number
  ): number {
    return Math.round((Math.max(value - strike, 0) - legSelectionValue) * (direction * size * 100));
  }

  private getPutOptionValue(
    value: number,
    strike: number,
    legSelectionValue: number,
    direction: number,
    size: number
  ): number {
    return Math.round((Math.max(strike - value, 0) - legSelectionValue) * (direction * size * 100));
  }

  private getCallBreakEven(strike: number, legSelectionValue: number, direction: number, size: number): number {
    const million: number = 1000000;
    const millionOptionValue = this.getCallOptionValue(million, strike, legSelectionValue, direction, size);
    const legValue = this.getCallOptionValue(strike, strike, legSelectionValue, direction, size);
    const breakEven = million - (millionOptionValue / (millionOptionValue - legValue)) * (million - strike);
    return this.roundToDecimal(breakEven, 2);
  }

  private roundToDecimal(value: number, decimalPlaces: number): number {
    const factor = Math.pow(10, decimalPlaces);
    return Math.round(value * factor) / factor;
  }

  private getPutBreakEven(strike: number, legSelectionValue: number, direction: number, size: number): number {
    const zeroOptionValue = this.getPutOptionValue(0, strike, legSelectionValue, direction, size);
    const legValue = this.getPutOptionValue(strike, strike, legSelectionValue, direction, size);
    const breakEven = strike - (legValue / (legValue - zeroOptionValue)) * (strike - 0);
    return this.roundToDecimal(breakEven, 2);
  }

  private getSingleLegBreakEven(leg: Leg): number {
    const strike = leg.strike;
    const size = Number(leg.size);
    const legSelectionValue = this.roundToDecimal(leg.purchasePrice, 2);
    switch (leg.type) {
      case LegType.Call:
        return this.getCallBreakEven(strike, legSelectionValue, Number(leg.direction), size);
      case LegType.Put:
        return this.getPutBreakEven(strike, legSelectionValue, Number(leg.direction), size);
      case LegType.Stock:
        return 0.0;
    }
  }

  private getDoubleLegBreakEven(legs: Leg[], firstStrike: number, secondStrike: number): number {
    const legsArray = [...legs];
    const sortedLegs = legsArray.sort((a, b) => a.strike - b.strike);
    const firstLegOptionValue = this.getTotalOptionValue(sortedLegs, firstStrike);
    const secondLegOptionValue = this.getTotalOptionValue(sortedLegs, secondStrike);
    if (Math.sign(firstLegOptionValue) !== Math.sign(secondLegOptionValue)) {
      const breakEven =
        secondStrike -
        (secondLegOptionValue / (secondLegOptionValue - firstLegOptionValue)) * (secondStrike - firstStrike);
      return this.roundToDecimal(breakEven, 2);
    }
    return 0;
  }

  private getTotalOptionValue(legs: Leg[], option: number): number {
    let optionValue = 0.0;
    if (this.strategy?.legs) {
      for (const leg of legs) {
        const strike = leg?.strike || 0;
        const size = Number(leg?.size);
        const selectionValue = this.roundToDecimal(leg?.purchasePrice, 2);
        const direction = Number(leg?.direction);
        switch (leg?.type) {
          case LegType.Call:
            optionValue += this.getCallOptionValue(option, strike, selectionValue, direction, size);
            break;
          case LegType.Put:
            optionValue += this.getPutOptionValue(option, strike, selectionValue, direction, size);
            break;
          case LegType.Stock:
            optionValue += Math.round((option - leg.purchasePrice) * (100 * leg.direction));
            break;
        }
      }
    }

    return optionValue;
  }

  private getStockDoubleLegBreakEven(legs: Leg[], firstStrike: number, secondStrike: number): number {
    if (legs.find((leg) => leg.type !== LegType.Stock)?.type === LegType.Put) {
      return this.getDoubleLegBreakEven(legs, firstStrike, 1000000);
    }
    return this.getDoubleLegBreakEven(legs, 0, secondStrike);
  }

  private getStockTripleLegBreakEven(legs: Leg[]): string {
    let breakEven = "";
    const firstBreakEven = this.getDoubleLegBreakEven(legs, 0, legs[1].strike);
    if (firstBreakEven !== 0) {
      breakEven = `${firstBreakEven < 0 ? "- " : ""}$${Math.abs(firstBreakEven)}`;
    }
    const strike = legs[1].strike !== legs[2].strike ? legs[2].strike : 1000000;
    const secondBreakEven = this.getDoubleLegBreakEven(legs, legs[1].strike, strike);
    if (secondBreakEven !== 0) {
      if (breakEven !== "") {
        breakEven += ", ";
      }
      breakEven += `${secondBreakEven < 0 ? "- " : ""}$${Math.abs(secondBreakEven)}`;
    }
    if (secondBreakEven === 0 && strike !== 1000000) {
      const secondBreakEven = this.getDoubleLegBreakEven(legs, legs[1].strike, 1000000);
      if (secondBreakEven !== 0) {
        if (breakEven !== "") {
          breakEven += ", ";
        }
        breakEven += `${secondBreakEven < 0 ? "- " : ""}$${Math.abs(secondBreakEven)}`;
      }
    }
    return breakEven !== "" ? breakEven : "None";
  }

  private getTripleLegBreakEven(legs: Leg[]): string {
    const zeroBreakEven = this.getDoubleLegBreakEven(legs, 0, legs[0]?.strike);
    let breakEvenString = this.getBreakEvenString(zeroBreakEven, "");
    const firstBreakEven = this.getDoubleLegBreakEven(legs, legs[0]?.strike, legs[1]?.strike);
    breakEvenString = this.getBreakEvenString(firstBreakEven, breakEvenString);
    const secondBreakEven = this.getDoubleLegBreakEven(legs, legs[1]?.strike, legs[2]?.strike);
    breakEvenString = this.getBreakEvenString(secondBreakEven, breakEvenString);
    const millionBreakEven = this.getDoubleLegBreakEven(legs, legs[2]?.strike, 1000000);
    breakEvenString = this.getBreakEvenString(millionBreakEven, breakEvenString);
    return breakEvenString !== "" ? breakEvenString : "None";
  }

  private getQuadLegBreakEven(unsortedlegs: Leg[]): string {
    const legs = [...unsortedlegs].sort((a, b) => a.strike - b.strike);
    const zeroBreakEven = this.getDoubleLegBreakEven(legs, 0, legs[0]?.strike);
    let breakEvenString = this.getBreakEvenString(zeroBreakEven, "");
    const firstBreakEven = this.getDoubleLegBreakEven(legs, legs[0]?.strike, legs[1]?.strike);
    breakEvenString = this.getBreakEvenString(firstBreakEven, breakEvenString);
    const secondBreakEven = this.getDoubleLegBreakEven(legs, legs[1]?.strike, legs[2]?.strike);
    breakEvenString = this.getBreakEvenString(secondBreakEven, breakEvenString);
    const thirdBreakEven = this.getDoubleLegBreakEven(legs, legs[2]?.strike, legs[3]?.strike);
    breakEvenString = this.getBreakEvenString(thirdBreakEven, breakEvenString);
    const millionBreakEven = this.getDoubleLegBreakEven(legs, legs[3]?.strike, 1000000);
    breakEvenString = this.getBreakEvenString(millionBreakEven, breakEvenString);
    return breakEvenString !== "" ? breakEvenString : "None";
  }
  getBreakEvenValue(): string {
    if (this.strategy && this.strategy?.legs) {
      const newLegs = [...this.strategy?.legs];
      const legsArray = [...newLegs];
      let legs = legsArray.sort(
        (a, b) => (a.type === LegType.Stock && b.type !== LegType.Stock ? -1 : 1) && a.strike - b.strike
      );
      switch (legs?.length) {
        case 1:
          const breakEvenCase1 = this.getSingleLegBreakEven(legs[0]);
          return `${breakEvenCase1 < 0 ? "- " : ""}$${Math.abs(breakEvenCase1)}`;
        case 2:
          if (legs.filter((leg) => leg.type === LegType.Stock).length === 0) {
            const zeroBreakEven = this.getDoubleLegBreakEven(legs, 0, legs[0]?.strike);
            let breakEvenString = this.getBreakEvenString(zeroBreakEven, "");
            const breakEven = this.getDoubleLegBreakEven(legs, legs[0]?.strike, legs[1]?.strike);
            breakEvenString = this.getBreakEvenString(breakEven, breakEvenString);
            const millionBreakEven = this.getDoubleLegBreakEven(legs, legs[1]?.strike, 1000000);
            breakEvenString = this.getBreakEvenString(millionBreakEven, breakEvenString);
            return breakEvenString;
          } else {
            const breakEven = this.getStockDoubleLegBreakEven(legs, this.strategy.currentPrice, legs[1]?.strike);
            return `${breakEven < 0 ? "- " : ""}$${Math.abs(breakEven)}`;
          }
        case 3:
          if (legs.filter((leg) => leg?.type === LegType.Stock).length === 0) {
            const breakEven = this.getTripleLegBreakEven(legs);
            return breakEven;
          } else {
            return this.getStockTripleLegBreakEven(legs);
          }
        case 4:
          const breakEven = this.getQuadLegBreakEven(legs);
          return breakEven;
        default:
          return "$0";
      }
    }
  }

  calculateNetValue(): { title: string; value: number } {
    let price = 0.0;
    if (this.strategy?.legs) {
      for (const leg of this.strategy?.legs) {
        if (leg?.type !== LegType.Stock) {
          const purchasePrice = leg?.purchasePrice; // Assuming it's already a number
          const roundedPrice = Math.round(purchasePrice * 100) / 100; // Round to two decimal places
          price += -(leg?.direction * leg?.size * 100 * (roundedPrice ? roundedPrice : 0));
        }
      }
      let title = "Net Credit";
      if (price < 0) {
        title = "Net Debit";
      }
      return {
        title: title,
        value: Math.round(price),
      };
    }
  }
  private getBreakEvenString(breakEven: number, breakEvenString: string): string {
    if (breakEven !== 0) {
      if (breakEvenString !== "") {
        breakEvenString += ", ";
      }
      breakEvenString += `${breakEven < 0 ? "- " : ""}$${Math.abs(breakEven)}`;
    }
    return breakEvenString;
  }

  getMinMaxProfit(): { min: string; max: string } {
    return this.calculateLossProfit();
  }

  private withCommas(value: number): string {
    const numberFormatter = new Intl.NumberFormat();
    return numberFormatter.format(value);
  }
  private getMinMaxValue(legs: Leg[], option: number, previousOption: number | undefined): number {
    const optionValue = this.getTotalOptionValue(legs, option);
    if (option < 1000000) {
      return optionValue;
    }
    const millionValue3 = this.getTotalOptionValue(legs, 1000003);
    const millionValue4 = this.getTotalOptionValue(legs, 1000004);
    if (millionValue3 === millionValue4) {
      return optionValue;
    }
    return previousOption ?? 0;
  }

  private getLegsOptionValues(legs: Leg[], previousOption: number | undefined): number[] {
    const values: number[] = [];
    if (legs?.length > 0) {
      values.push(this.getMinMaxValue(legs, legs[0].strike, previousOption));
    }
    if (legs?.length > 1) {
      values.push(this.getMinMaxValue(legs, legs[1]?.strike, values[values.length - 1]));
    }
    if (legs?.length > 2) {
      values.push(this.getMinMaxValue(legs, legs[2]?.strike, values[values.length - 1]));
    }
    if (legs?.length > 3) {
      values.push(this.getMinMaxValue(legs, legs[3]?.strike, values[values.length - 1]));
    }
    return values;
  }

  private calculateLossProfit(): { min: string; max: string } {
    if (this.strategy) {
      const legs = this.strategy?.legs;
      const legOptionValues: number[] = [];
      legOptionValues.push(this.getMinMaxValue(legs, 0, null));
      legOptionValues.push(...this.getLegsOptionValues(legs, legOptionValues[legOptionValues.length - 1]));
      legOptionValues.push(this.getMinMaxValue(legs, 1000000, legOptionValues[legOptionValues.length - 1]));
      legOptionValues.push(this.getMinMaxValue(legs, 1000001, legOptionValues[legOptionValues.length - 1]));
      legOptionValues.push(this.getMinMaxValue(legs, 1000002, legOptionValues[legOptionValues.length - 1]));
      const millionValue3 = this.getTotalOptionValue(legs, 1000003);
      const millionValue4 = this.getTotalOptionValue(legs, 1000004);
      legOptionValues.push(this.getMinMaxValue(legs, 1000003, legOptionValues[legOptionValues.length - 1]));
      legOptionValues.push(this.getMinMaxValue(legs, 1000004, legOptionValues[legOptionValues.length - 1]));
      const minValue = Math.min(...legOptionValues);
      let min = this.withCommas(minValue).replace(".00", ".0");
      if (millionValue3 !== millionValue4 && millionValue4 < 0) {
        min = "Infinite";
      }
      if (millionValue4 > 0 && millionValue4 !== millionValue3) {
        return { min, max: "Infinite" };
      }
      const maxValue = Math.max(...legOptionValues);
      const max = this.withCommas(maxValue);
      return { min, max };
    }
  }
}
