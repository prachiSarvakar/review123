import { DirectionType } from "@/app/strategies/strategies";
import { evaluate, parse } from "mathjs";
import { Leg } from "./legs";
import { Strategy } from "./strategy";

enum LegType {
  Call = 0,
  Put = 1,
  Stock = 2,
}

enum FilterType {
  ProfitLossDollar = 0,
  ProfitLossPercentage = 1,
}
export default class SpreadSheetViewModel {
  strategy: Strategy;
  undP: number = 45;
  targetDate!: any;
  container: string[][] = [];
  yAxis: string[] = [];
  header: string[] = [];
  filtertype: FilterType = FilterType.ProfitLossDollar;
  private chartRange: number = 10.0;

  constructor(strategy: Strategy, filtertype: FilterType) {
    this.strategy = strategy;
    this.filtertype = filtertype;
    this.setChartRange(this.chartRange);
  }
  setStrategy(strategy) {
    const isCoveredCall = strategy?.name?.toLowerCase() === "covered call";
    let legs = [...(strategy?.legs || [])];
    if (isCoveredCall && legs) {
      legs =
        strategy?.legs?.map((el) => {
          if (el?.type === LegType.Stock) {
            if (el?.size > 100) {
              el.size = Math.floor(el.size / 100);
            }
            return el;
          }
          return el;
        }) || strategy.legs;
    }
    this.strategy = strategy;
  }
  setChartRange(value: number): void {
    this.chartRange = value;
  }

  getChartRange(): number {
    return this.chartRange;
  }

  private clearCache(): void {
    this.yAxis = [];
    this.container = [];
    this.header = [];
  }
  getDetails() {
    return {
      yAxis: this.yAxis,
      container: this.container,
    };
  }

  calculateData(): void {
    this.clearCache();
    if (this.strategy) {
      const date = this.strategy?.legs?.filter((leg) => leg?.type !== LegType.Stock)[0]?.expiration;
      if (!date) return;
      let listOfDates = this.allDates(date);
      const finalYAxisData = this.getCalculatedStrideValues();
      for (const x of finalYAxisData) {
        this.undP = x;

        const tempContainer: string[] = [];
        this.yAxis.push(`$${x.toFixed(1)}`);
        const headerIsEmpty = this.header.length === 0;
        for (let index = 0; index < listOfDates.length; index++) {
          const currentDate = listOfDates[index];
          this.targetDate = this.setHoursMins(currentDate, index === listOfDates.length - 1);
          const optionValue =
            this.getPrice().toFixed(2).toString() === "-0" ? "0" : this.getPrice().toFixed(2).toString();
          let valueToAdd;

          if (this.filtertype === FilterType.ProfitLossDollar) {
            valueToAdd = optionValue;
          } else if (this.filtertype === FilterType.ProfitLossPercentage) {
            valueToAdd = this.getProfitLossValue(parseFloat(optionValue));
          } else {
            valueToAdd = "default Value";
          }
          tempContainer.push(valueToAdd);

          if (headerIsEmpty) {
            this.header.push(
              this.targetDate.toLocaleDateString(undefined, {
                day: "numeric",
                month: "short",
              })
            );
          }
        }
        this.container.push(tempContainer);
      }
    }
  }

  getProfitLossData(price: number, date: Date): { value: number; isProfit: boolean } {
    this.undP = price;
    this.targetDate = this.setHoursMins(date, false);
    const optionValue = this.getPrice();
    const actualProfit = this.getProfitLossValue(optionValue);
    return {
      value: actualProfit,
      isProfit: actualProfit > 0,
    };
  }

  private allDates(endDate: Date): Date[] {
    let currentDate = new Date();
    currentDate.setHours(10, 0, 0, 0);
    let listOfDates: Date[] = [];
    let result: number = this.compareDates(currentDate, endDate);
    while (result === 0 || result === -1) {
      listOfDates.push(currentDate);
      currentDate = this.addDays(currentDate, 1);
      result = this.compareDates(currentDate, endDate);
    }

    return listOfDates;
  }

  private compareDates(date1: Date, date2: Date): number {
    if (date1.getTime() === date2.getTime()) {
      return 0; // Dates are the same
    } else if (date1.getTime() < date2.getTime()) {
      return -1; // date1 is earlier than date2
    } else {
      return 1; // date1 is later than date2
    }
  }

  private addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  private setHoursMins(date: Date, isLastIndex: boolean): Date {
    const result = new Date(date);

    if (isLastIndex) {
      result.setHours(16, 0, 0, 0); // Market close time
    } else {
      result.setHours(10, 0, 0, 0); // Market open time
    }

    return result;
  }

  private updateLastIndex(dates: Date[]): Date[] {
    if (dates.length >= 1) {
      dates.push(dates[dates.length - 1]);
    }
    return dates;
  }

  private getStrikePrice(leg: Leg): number {
    return leg.strike;
  }

  private getInitialPrice(leg: Leg): number {
    return leg.purchasePrice;
  }

  private getVolatility(leg: Leg): number {
    return leg.volatility;
  }

  private getDaysRemaining(leg: Leg, targetDate: Date): number {
    if (leg.expiration) {
      return this.getTimeIntervalInSeconds(leg.expiration, targetDate) / 86400;
    }
    if (leg.type === LegType.Stock && this.strategy.legs.find((leg) => leg.type !== LegType.Stock)?.expiration) {
      return (
        this.getTimeIntervalInSeconds(
          this.strategy.legs.find((leg) => leg.type !== LegType.Stock)!.expiration,
          targetDate
        ) / 86400
      );
    }
    return 0;
  }
  private getTimeIntervalInSeconds(date1: Date, date2: Date): number {
    const time1 = date1.getTime();
    const time2 = date2.getTime();
    const intervalInSeconds = Math.floor((time2 - time1) / 1000);
    return intervalInSeconds;
  }

  private getTimeToExp(leg: Leg): number {
    return (this.getDaysRemaining(leg, this.targetDate) / 365.5) * 100;
  }

  private getLogOfStrikeX(leg: Leg): number {
    const division = this.undP / leg.strike;
    return Math.log(division);
  }

  private getrminussigma(leg: Leg): number {
    const latter = Math.pow(this.getVolatility(leg), 2.0);
    const interest = this.strategy.interestRate;
    const dividend = this.strategy.dividend;
    if (leg.expiration) {
      const timetoexp = ((leg.expiration.getTime() - this.targetDate.getTime()) / 86400000 / 365.5) * 100;
      return ((interest - dividend + latter / 2) * timetoexp) / 1000000;
    }
    return 0;
  }

  private getsigmasqrtt(leg: Leg): number {
    if (leg.expiration) {
      const timetoexp = ((leg.expiration.getTime() - this.targetDate.getTime()) / 86400000 / 365.5) * 100;
      return Math.max(0.000000000001, (this.getVolatility(leg) * Math.sqrt(timetoexp)) / 1000);
    }
    return 0;
  }

  private getd1(leg: Leg): number {
    return (this.getLogOfStrikeX(leg) + this.getrminussigma(leg)) / this.getsigmasqrtt(leg);
  }

  private getd2(leg: Leg): number {
    return this.getd1(leg) - this.getsigmasqrtt(leg);
  }

  private getnd1(leg: Leg): number {
    return this.normalDistribution(this.getd1(leg), 0, 1) ?? 0.0;
  }
  private getnegativend1(leg: Leg): number {
    return this.normalDistribution(-this.getd1(leg), 0, 1) ?? 0.0;
  }

  private getnd2(leg: Leg): number {
    return this.normalDistribution(this.getd2(leg), 0, 1) ?? 0.0;
  }

  private getnegativend2(leg: Leg): number {
    return this.normalDistribution(-this.getd2(leg), 0, 1) ?? 0.0;
  }

  private getExponential(leg: Leg): number {
    return Math.exp(-this.strategy.dividend * this.getTimeToExp(leg));
  }

  private getXert(leg: Leg): number {
    return this.getExponential(leg) * this.getStrikePrice(leg);
  }

  private getS0eqt(leg: Leg): number {
    return this.undP * this.getExponential(leg);
  }

  private getPrice(): number {
    let price: number = 0;
    if (this.strategy?.legs) {
      for (const leg of this.strategy?.legs) {
        price += this.getLegPrice(leg);
      }
      return price;
    }
  }

  private getLegPrice(leg: Leg): number {
    switch (leg?.type) {
      case LegType.Call:
        return (
          (this.getS0eqt(leg) * this.getnd1(leg) - this.getXert(leg) * this.getnd2(leg)) *
          leg?.direction?.valueOf() *
          leg?.size
        );
      case LegType.Put:
        return (
          (this.getXert(leg) * this.getnegativend2(leg) - this.getS0eqt(leg) * this.getnegativend1(leg)) *
          leg?.direction?.valueOf() *
          leg?.size
        );
      case LegType.Stock:
        return (this.undP - leg?.purchasePrice) * leg?.direction?.valueOf() * leg?.size;
    }
  }

  private getPricePaid(): number {
    let pricePaid: number = 0;
    if (this.strategy?.legs) {
      for (const leg of this.strategy?.legs) {
        if (leg?.type !== LegType.Stock) {
          pricePaid += leg?.purchasePrice * (100 * leg?.size) * leg?.direction;
        }
      }
      return pricePaid;
    }
  }

  private getProfitValue(optionValue: number): number {
    return optionValue * 100;
  }

  getProfitLossValue(optionValue: number): number {
    return Math.round(this.getProfitValue(optionValue) - this.getPricePaid());
  }
  fetchPercentage(optionValue: number, legs: Leg[]): string {
    const entryCost = this.getTotalCost(this.strategy?.legs);
    const percentage = ((optionValue * 100 - entryCost) / Math.abs(entryCost)) * 100;
    return this.getBackgroundColor(percentage, optionValue, this.strategy?.legs);
  }

  private getTotalCost(legs: Leg[]): number {
    let cost: number = 0;
    if (this.strategy?.legs) {
      for (const leg of legs) {
        if (leg.type !== LegType.Stock) {
          cost += leg.purchasePrice * leg.size * 100 * leg.direction;
        }
      }
      return cost;
    }
  }

  private roundToDecimal(value: number, decimalPlaces: number): number {
    const factor = 10 ** decimalPlaces;
    return Math.round(value * factor) / factor;
  }

  private getBackgroundColor(percentage: number, optionValue: number, legs: Leg[]): any {
    const value = this.roundToDecimal(percentage, 2);
    if (legs) {
      if (legs?.length === 1 && legs[0]?.direction === 1) {
        return this.getColorForShort(value, optionValue, legs[0]);
      }

      if (isNaN(percentage) || !isFinite(percentage)) {
        return "rgb(255,-0,-0)";
      }

      if (optionValue === 0.0 || legs?.length <= 1) {
        return "rgb(137,-0,-0)";
      }

      if (percentage <= -100) {
        return "rgb(137,-0,-0)";
      }

      const roundedValue = value > 0 ? Math.floor(value) : Math.ceil(value);
      const nearestKey = roundedValue - (roundedValue % 5);

      return;
    }
  }

  private getColorForShort(value: number, optionValue: number, leg: Leg): string {
    if (isNaN(value) || !isFinite(value)) {
      return "red";
    }

    if (leg.type !== LegType.Call) {
      return this.getColorForShortPut(value, optionValue);
    }

    const roundedValue = value > 0 ? Math.floor(value) : Math.ceil(value);
    const nearestKey = roundedValue - (roundedValue % (value > -50 ? 5 : 50));

    if (nearestKey <= -550) {
      return "red";
    }

    return "";
  }

  private getColorForShortPut(value: number, optionValue: number): string {
    const roundedValue = value > 0 ? Math.floor(value) : Math.ceil(value);
    const nearestKey = roundedValue - (roundedValue % (value > -50 ? 5 : 50));

    if (nearestKey >= -49 && nearestKey <= 0) {
      return "white";
    }

    if (nearestKey <= -1000) {
      return "red";
    }

    return "";
  }

  getCalculatedStrideValues(): number[] {
    const strikePrice = Math.floor(this.strategy?.currentPrice);

    const finalYAxis: number[] = this.getIncrementalYAxis(strikePrice, this.chartRange / 10);
    const decrementalYAxis: number[] = this.getDecrementalYAxis(strikePrice, this.chartRange / 10);
    finalYAxis.push(...decrementalYAxis);
    return finalYAxis;
  }

  getCalculatedGraphStrideValues(): number[] {
    const finalYAxis: number[] = this.getCalculatedStrideValues();
    let min: number = Math.min(...finalYAxis);
    let max: number = Math.max(...finalYAxis);
    let value = min;
    const finalGraphYaxis = [];
    while (value <= max) {
      finalGraphYaxis.push(value);
      value += 0.25;
    }
    return finalYAxis.length > finalGraphYaxis.length ? finalYAxis : finalGraphYaxis;
  }

  private getIncrementalYAxis(strikePrice: number, range: number): number[] {
    const values: number[] = [];
    values.push(strikePrice);
    const value = (strikePrice * range) / 100;
    for (let i = 0; i <= 9; i++) {
      const previousValue = values[values.length - 1] || 0;
      const output = previousValue + value;
      values.push(output);
    }
    return values.reverse();
  }

  private getDecrementalYAxis(strikePrice: number, range: number): number[] {
    const values: number[] = [];
    const value = (strikePrice * range) / 100;
    for (let i = 0; i <= 9; i++) {
      const previousValue = i === 0 ? strikePrice : values[values.length - 1] || 0;
      const output = previousValue - value;
      if (output <= 0.0) {
        break;
      }
      values.push(output);
    }
    return values;
  }

  getDataForSelectedDate(date: Date): { [key: number]: number } {
    const yAxis = this.getCalculatedGraphStrideValues().reverse();
    const data: { [key: number]: number } = {};
    this.targetDate = date;
    for (const y of yAxis) {
      this.undP = y;
      data[y] = this.getProfitLossValue(this.getPrice());
    }
    return data;
  }
  private calculateNormalDistribution(x: number, mean: number, standardDeviation: number): number {
    // Create the expression for the normal distribution
    const expression = `1 / (sqrt(2 * pi) * ${standardDeviation}) * exp(-(x - ${mean})^2 / (2 * ${standardDeviation}^2))`;

    // Parse and evaluate the expression with the given value of x
    const parsedExpression = parse(expression);
    const evaluatedExpression = parsedExpression.evaluate({ x });

    // Return the result
    return evaluatedExpression;
  }

  private erfc(x: number) {
    // Approximation of erfc using the complementary error function formula
    const t = 1 / (1 + 0.5 * Math.abs(x));
    const tau =
      t *
      Math.exp(
        -x * x -
          1.26551223 +
          1.00002368 * t +
          0.37409196 * t * t +
          0.09678418 * t * t * t -
          0.18628806 * t * t * t * t +
          0.27886807 * t * t * t * t * t -
          1.13520398 * t * t * t * t * t * t +
          1.48851587 * t * t * t * t * t * t * t -
          0.82215223 * t * t * t * t * t * t * t * t +
          0.17087277 * t * t * t * t * t * t * t * t * t
      );
    return x >= 0 ? tau : 2 - tau;
  }

  private normalDistribution(x: number, μ = 0, σ = 1) {
    if (σ <= 0) return null;
    const z = (x - μ) / σ;
    return 0.5 * this.erfc(-z * Math.sqrt(0.5));
  }

  checkForChartRange(max: number, min: number, breakPoints: number[]): boolean {
    let shouldIncreaseRange: boolean = false;
    const breakPointGap: number = (max - min) / 12;
    for (const breakPoint of breakPoints) {
      if (breakPoint <= min + breakPointGap || max - breakPointGap <= breakPoint) {
        shouldIncreaseRange = true;
        break;
      }
    }

    return shouldIncreaseRange;
  }
}
