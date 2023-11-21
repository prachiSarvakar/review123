import { store } from "@/redux/store";
import { Leg } from "./legs";
import { Strategy } from "./strategy";

enum OptionSelectionType {
  Bid = 0,
  Mid = 1,
  Ask = 1,
}

export default function options(
  currentStockPrice: number,
  type: number,
  values: string,
  direction: number,
  strategyType: string,
  strike?: number,
  expiration_date?: any,
  purchasePriceVal?: number,
  volatilityVal?: number,
  symbol?: any,
  legsData?: any
) {
  const selectedExpirationDate: any = store.getState().optionGreek;
  let arr: any = [];
  let strategy: Strategy | null = null;

  if (selectedExpirationDate?.entities?.length > 0) {
    const getOptionType = selectedExpirationDate?.entities?.filter((item) => {
      return item.option_type === values;
    });
    getOptionType.forEach((item: any) => {
      const trimNumber = item.strike;
      arr.push(trimNumber);
    });
    const nearestStrike = Math.min(...arr.filter((strike: number) => strike >= currentStockPrice));
    const nearestObject = getOptionType?.find((item: any) => item.strike === nearestStrike);
    const volatility = nearestObject?.greeks?.mid_iv * 100;
    const purchasePrice = (nearestObject?.ask + nearestObject?.bid) / 2;
    const expiryDate = nearestObject?.expiration_date;

    const expirationDate = new Date(expiryDate);

    const expirationDateUTC = new Date(
      expirationDate.getUTCFullYear(),
      expirationDate.getUTCMonth(),
      expirationDate.getUTCDate(),
      expirationDate.getUTCHours(),
      expirationDate.getUTCMinutes(),
      expirationDate.getUTCSeconds()
    );

    expirationDateUTC.setHours(16, 0, 0, 0);
    if (strategyType === "custom") {
      const leg: Leg = {
        strike: strike,
        size: 1,
        purchasePrice: purchasePriceVal,
        direction: direction,
        type: type,
        expiration: expiration_date,
        symbol: symbol,
        volatility: isNaN(volatilityVal) ? 0 : volatilityVal,
        range: 1,
        indexOfStrikePrice: 1,
        index: 0,
        y: 0,
      };

      strategy = {
        strategyId: 1,
        ticker: nearestObject?.root_symbol,
        currentPrice: currentStockPrice,
        purchasePrice: purchasePriceVal,
        interestRate: 0,
        dividend: 0,
        createdDateTime: new Date(),
        legs: legsData,
        name: strategyType,
        shareURL: "",
        sortOrder: 1,
        quoteDescription: nearestObject?.description,
        changePercentage: 0,
      };
      return strategy;
    } else {
      const leg: Leg = {
        strike: nearestObject?.strike,
        size: 1,
        // "actualQualtity" can have -ve values i.e sell -> -ve qualtity,
        // but the "quantity" variable will have only +ve values.
        actualQualtity: direction === 1 ? 1 : -1,
        purchasePrice: purchasePrice,
        direction: direction,
        type: type,
        expiration: expirationDateUTC,
        symbol: nearestObject?.symbol,
        volatility: isNaN(volatility) ? 0 : volatility,
        range: 1,
        indexOfStrikePrice: 1,
        index: 0,
        y: 0,
      };

      strategy = {
        strategyId: 1,
        ticker: nearestObject?.root_symbol,
        currentPrice: currentStockPrice,
        purchasePrice: purchasePrice,
        interestRate: 0,
        dividend: 0,
        createdDateTime: new Date(),
        legs: [leg],
        name: strategyType,
        shareURL: "",
        sortOrder: 1,
        quoteDescription: nearestObject?.description,
        changePercentage: 0,
      };

      return strategy;
    }
  }
}
