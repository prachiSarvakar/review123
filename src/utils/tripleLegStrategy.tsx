import { store } from "@/redux/store";
import { Leg, Leg2, Leg3 } from "./legs";
import { Strategy } from "./strategy";

export default function TripleLeg(
  currentStockPrice: number,
  type1: number,
  direction: number,
  type2: number,
  direction2: number,
  type3: number,
  direction3: number,
  strategyType: string
) {
  const selectedExpirationDate: any = store.getState().optionGreek;
  let arr: any = [];
  let strategy: Strategy | null = null;

  if (selectedExpirationDate?.entities?.length > 0) {
    const callOptions = selectedExpirationDate?.entities?.filter((item) => {
      return item.option_type === "call";
    });
    const putOptions = selectedExpirationDate?.entities?.filter((item) => {
      return item.option_type === "put";
    });
    putOptions.forEach((item: any) => {
      const trimNumber = item.strike;
      arr.push(trimNumber);
    });

    let nearestStrikeForCall = Math.min(...arr?.filter((strike: number) => strike >= currentStockPrice));

    const nearestObjectForCall = callOptions?.find((item) => item.strike === nearestStrikeForCall);

    let nearestStrikeForPut = Math.min(...arr?.filter((strike: number) => strike >= currentStockPrice));

    const nearestObjectForPut = putOptions?.find((item) => item.strike === nearestStrikeForPut);

    const nearestObjectIndexForCall = callOptions?.findIndex((obj) => obj === nearestObjectForCall);
    const fiveJumpsHigherIndexCall = nearestObjectIndexForCall + 5;
    const fiveJumpsLowerIndexCall = nearestObjectIndexForCall - 5;
    const fiveJumpsHigherObjectCall = callOptions[fiveJumpsHigherIndexCall];
    const fiveJumpsLowerObjectCall = callOptions[fiveJumpsLowerIndexCall];

    const nearestObjectCallvolatility = nearestObjectForCall?.greeks?.mid_iv * 100;
    const nearestObjectCallpurchasePrice = (nearestObjectForCall?.ask + nearestObjectForCall?.bid) / 2;
    const fiveJumpsHighervolatilityCall = fiveJumpsHigherObjectCall?.greeks?.mid_iv * 100;
    const fiveJumpsLowervolatilityCall = fiveJumpsLowerObjectCall?.greeks?.mid_iv * 100;

    const fivehigherPurchasePriceCall = (fiveJumpsHigherObjectCall?.ask + fiveJumpsHigherObjectCall?.bid) / 2;
    const fivelowerPurchasePriceCall = (fiveJumpsLowerObjectCall?.ask + fiveJumpsLowerObjectCall?.bid) / 2;

    const nearestObjectIndexForPut = putOptions?.findIndex((obj) => obj === nearestObjectForPut);

    const fiveJumpsHigherIndexPut = nearestObjectIndexForPut + 5;
    const fiveJumpsLowerIndexPut = nearestObjectIndexForPut - 5;
    const fiveJumpsHigherObjectPut = putOptions[fiveJumpsHigherIndexPut];
    const fiveJumpsLowerObjectPut = putOptions[fiveJumpsLowerIndexPut];

    const nearestObjectPutvolatility = nearestObjectForPut?.greeks?.mid_iv * 100;
    const nearestObjectPutpurchasePrice = (nearestObjectForPut?.ask + nearestObjectForPut?.bid) / 2;

    const fiveJumpsHighervolatilityPut = fiveJumpsHigherObjectPut?.greeks?.mid_iv * 100;
    const fiveJumpsLowervolatilityPut = fiveJumpsLowerObjectPut?.greeks?.mid_iv * 100;

    const fivehigherPurchasePricePut = (fiveJumpsHigherObjectPut?.ask + fiveJumpsHigherObjectPut?.bid) / 2;
    const fivelowerPurchasePricePut = (fiveJumpsLowerObjectPut?.ask + fiveJumpsLowerObjectPut?.bid) / 2;

    const expiryDate = nearestObjectForCall?.expiration_date;
    const expirationDate: any = new Date(expiryDate);
    const expirationDateUTC = new Date(
      expirationDate.getUTCFullYear(),
      expirationDate.getUTCMonth(),
      expirationDate.getUTCDate(),
      expirationDate.getUTCHours(),
      expirationDate.getUTCMinutes(),
      expirationDate.getUTCSeconds()
    );

    expirationDateUTC.setHours(16, 0, 0, 0);

    const strike1 =
      strategyType === "Covered Short Straddle"
        ? currentStockPrice
        : strategyType === "Covered Short Strangle"
        ? currentStockPrice
        : strategyType === "Bull Call Ladder"
        ? fiveJumpsLowerObjectCall.strike
        : strategyType === "Bull Put Ladder"
        ? fiveJumpsLowerObjectPut.strike
        : strategyType === "Bear Call Ladder"
        ? fiveJumpsLowerObjectCall.strike
        : strategyType === "Bear Put Ladder"
        ? fiveJumpsLowerObjectPut.strike
        : strategyType === "Synthetic Long Straddle Calls"
        ? currentStockPrice
        : strategyType === "Synthetic Long Straddle Puts"
        ? currentStockPrice
        : strategyType === "Synthetic Short Straddle Calls"
        ? currentStockPrice
        : strategyType === "Synthetic Short Straddle Puts"
        ? currentStockPrice
        : strategyType === "Collar"
        ? currentStockPrice
        : strategyType === "Long Call Butterfly"
        ? fiveJumpsLowerObjectCall.strike
        : strategyType === "Long Put Butterfly"
        ? fiveJumpsLowerObjectPut.strike
        : strategyType === "Short Call Butterfly"
        ? fiveJumpsLowerObjectCall.strike
        : strategyType === "Short Put Butterfly"
        ? fiveJumpsLowerObjectPut.strike
        : null;

    const strike2 =
      strategyType === "Covered Short Straddle"
        ? nearestObjectForPut.strike
        : strategyType === "Covered Short Strangle"
        ? fiveJumpsLowerObjectPut.strike
        : strategyType === "Bull Call Ladder"
        ? nearestObjectForCall?.strike
        : strategyType === "Bull Put Ladder"
        ? nearestObjectForPut.strike
        : strategyType === "Bear Call Ladder"
        ? nearestObjectForCall?.strike
        : strategyType === "Bear Put Ladder"
        ? nearestObjectForPut.strike
        : strategyType === "Synthetic Long Straddle Calls"
        ? fiveJumpsLowerObjectCall.strike
        : strategyType === "Synthetic Long Straddle Puts"
        ? fiveJumpsLowerObjectPut.strike
        : strategyType === "Synthetic Short Straddle Calls"
        ? fiveJumpsLowerObjectCall.strike
        : strategyType === "Synthetic Short Straddle Puts"
        ? fiveJumpsLowerObjectPut.strike
        : strategyType === "Collar"
        ? fiveJumpsLowerObjectPut.strike
        : strategyType === "Long Call Butterfly"
        ? nearestObjectForCall?.strike
        : strategyType === "Long Put Butterfly"
        ? nearestObjectForPut.strike
        : strategyType === "Short Call Butterfly"
        ? nearestObjectForCall?.strike
        : strategyType === "Short Put Butterfly"
        ? nearestObjectForPut.strike
        : null;

    const strike3 =
      strategyType === "Covered Short Straddle"
        ? nearestObjectForCall?.strike
        : strategyType === "Covered Short Strangle"
        ? fiveJumpsHigherObjectCall?.strike
        : strategyType === "Bull Call Ladder"
        ? fiveJumpsHigherObjectCall?.strike
        : strategyType === "Bull Put Ladder"
        ? fiveJumpsHigherObjectPut?.strike
        : strategyType === "Bear Call Ladder"
        ? fiveJumpsHigherObjectCall?.strike
        : strategyType === "Bear Put Ladder"
        ? fiveJumpsHigherObjectPut?.strike
        : strategyType === "Synthetic Long Straddle Calls"
        ? fiveJumpsHigherObjectCall?.strike
        : strategyType === "Synthetic Long Straddle Puts"
        ? fiveJumpsHigherObjectPut?.strike
        : strategyType === "Synthetic Short Straddle Calls"
        ? fiveJumpsHigherObjectCall?.strike
        : strategyType === "Synthetic Short Straddle Puts"
        ? fiveJumpsHigherObjectPut?.strike
        : strategyType === "Collar"
        ? fiveJumpsHigherObjectCall?.strike
        : strategyType === "Long Call Butterfly"
        ? fiveJumpsHigherObjectCall?.strike
        : strategyType === "Long Put Butterfly"
        ? fiveJumpsHigherObjectPut?.strike
        : strategyType === "Short Call Butterfly"
        ? fiveJumpsHigherObjectCall?.strike
        : strategyType === "Short Put Butterfly"
        ? fiveJumpsHigherObjectPut?.strike
        : null;

    const sizes2 =
      strategyType === "Long Call Butterfly"
        ? 2
        : strategyType === "Long Put Butterfly"
        ? 2
        : strategyType === "Short Call Butterfly"
        ? 2
        : strategyType === "Short Put Butterfly"
        ? 2
        : 1;

    const purchase =
      strategyType === "Covered Short Straddle"
        ? currentStockPrice
        : strategyType === "Covered Short Strangle"
        ? currentStockPrice
        : strategyType === "Synthetic Long Straddle Calls"
        ? currentStockPrice
        : strategyType === "Synthetic Long Straddle Puts"
        ? currentStockPrice
        : strategyType === "Synthetic Short Straddle Calls"
        ? currentStockPrice
        : strategyType === "Synthetic Short Straddle Puts"
        ? currentStockPrice
        : strategyType === "Collar"
        ? currentStockPrice
        : strategyType === "Bull Call Ladder"
        ? fivelowerPurchasePriceCall
        : strategyType === "Bull Put Ladder"
        ? fivelowerPurchasePricePut
        : strategyType === "Bear Call Ladder"
        ? fivelowerPurchasePriceCall
        : strategyType === "Bear Put Ladder"
        ? fivelowerPurchasePricePut
        : strategyType === "Long Call Butterfly"
        ? fivelowerPurchasePriceCall
        : strategyType === "Long Put Butterfly"
        ? fivelowerPurchasePricePut
        : strategyType === "Short Call Butterfly"
        ? fivelowerPurchasePriceCall
        : strategyType === "Short Put Butterfly"
        ? fivelowerPurchasePricePut
        : null;
    const purchase2 =
      strategyType === "Covered Short Straddle"
        ? nearestObjectPutpurchasePrice
        : strategyType === "Covered Short Strangle"
        ? fivelowerPurchasePricePut
        : strategyType === "Bull Call Ladder"
        ? nearestObjectCallpurchasePrice
        : strategyType === "Bull Put Ladder"
        ? nearestObjectPutpurchasePrice
        : strategyType === "Bear Call Ladder"
        ? nearestObjectCallpurchasePrice
        : strategyType === "Bear Put Ladder"
        ? nearestObjectPutpurchasePrice
        : strategyType === "Synthetic Long Straddle Calls"
        ? fivelowerPurchasePriceCall
        : strategyType === "Synthetic Long Straddle Puts"
        ? fivelowerPurchasePricePut
        : strategyType === "Synthetic Short Straddle Calls"
        ? fivelowerPurchasePriceCall
        : strategyType === "Synthetic Short Straddle Puts"
        ? fivelowerPurchasePricePut
        : strategyType === "Collar"
        ? fivelowerPurchasePricePut
        : strategyType === "Long Call Butterfly"
        ? nearestObjectCallpurchasePrice
        : strategyType === "Long Put Butterfly"
        ? nearestObjectPutpurchasePrice
        : strategyType === "Short Call Butterfly"
        ? nearestObjectCallpurchasePrice
        : strategyType === "Short Put Butterfly"
        ? nearestObjectPutpurchasePrice
        : null;

    const purchase3 =
      strategyType === "Covered Short Straddle"
        ? nearestObjectCallpurchasePrice
        : strategyType === "Covered Short Strangle"
        ? fivehigherPurchasePriceCall
        : strategyType === "Bull Call Ladder"
        ? fivehigherPurchasePriceCall
        : strategyType === "Bull Put Ladder"
        ? fivehigherPurchasePricePut
        : strategyType === "Bear Call Ladder"
        ? fivehigherPurchasePriceCall
        : strategyType === "Bear Put Ladder"
        ? fivehigherPurchasePricePut
        : strategyType === "Synthetic Long Straddle Calls"
        ? fivehigherPurchasePriceCall
        : strategyType === "Synthetic Long Straddle Puts"
        ? fivehigherPurchasePricePut
        : strategyType === "Synthetic Short Straddle Calls"
        ? fivehigherPurchasePriceCall
        : strategyType === "Synthetic Short Straddle Puts"
        ? fivehigherPurchasePricePut
        : strategyType === "Collar"
        ? fivehigherPurchasePriceCall
        : strategyType === "Long Call Butterfly"
        ? fivehigherPurchasePriceCall
        : strategyType === "Long Put Butterfly"
        ? fivehigherPurchasePricePut
        : strategyType === "Short Call Butterfly"
        ? fivehigherPurchasePriceCall
        : strategyType === "Short Put Butterfly"
        ? fivehigherPurchasePricePut
        : null;

    const volatility1 =
      strategyType === "Covered Short Straddle"
        ? 0
        : strategyType === "Covered Short Strangle"
        ? 0
        : strategyType === "Synthetic Long Straddle Calls"
        ? 0
        : strategyType === "Synthetic Long Straddle Puts"
        ? 0
        : strategyType === "Synthetic Short Straddle Calls"
        ? 0
        : strategyType === "Synthetic Short Straddle Puts"
        ? 0
        : strategyType === "Bull Call Ladder"
        ? fiveJumpsLowervolatilityCall
        : strategyType === "Bull Put Ladder"
        ? fiveJumpsLowervolatilityPut
        : strategyType === "Bear Call Ladder"
        ? fiveJumpsLowervolatilityCall
        : strategyType === "Bear Put Ladder"
        ? fiveJumpsLowervolatilityPut
        : strategyType === "Long Call Butterfly"
        ? fiveJumpsLowervolatilityCall
        : strategyType === "Long Put Butterfly"
        ? fiveJumpsLowervolatilityPut
        : strategyType === "Short Call Butterfly"
        ? fiveJumpsLowervolatilityCall
        : strategyType === "Short Put Butterfly"
        ? fiveJumpsLowervolatilityPut
        : null;

    const volatility2 =
      strategyType === "Covered Short Straddle"
        ? nearestObjectPutvolatility
        : strategyType === "Covered Short Strangle"
        ? fiveJumpsLowervolatilityPut
        : strategyType === "Bull Call Ladder"
        ? nearestObjectCallvolatility
        : strategyType === "Bull Put Ladder"
        ? nearestObjectPutvolatility
        : strategyType === "Bear Call Ladder"
        ? nearestObjectCallvolatility
        : strategyType === "Bear Put Ladder"
        ? nearestObjectPutvolatility
        : strategyType === "Synthetic Long Straddle Calls"
        ? fiveJumpsLowervolatilityCall
        : strategyType === "Synthetic Long Straddle Puts"
        ? fiveJumpsLowervolatilityPut
        : strategyType === "Synthetic Short Straddle Calls"
        ? fiveJumpsLowervolatilityCall
        : strategyType === "Synthetic Short Straddle Puts"
        ? fiveJumpsLowervolatilityPut
        : strategyType === "Collar"
        ? fiveJumpsLowervolatilityPut
        : strategyType === "Long Call Butterfly"
        ? nearestObjectCallvolatility
        : strategyType === "Long Put Butterfly"
        ? nearestObjectPutvolatility
        : strategyType === "Short Call Butterfly"
        ? nearestObjectCallvolatility
        : strategyType === "Short Put Butterfly"
        ? nearestObjectPutvolatility
        : null;

    const volatility3 =
      strategyType === "Covered Short Straddle"
        ? nearestObjectCallvolatility
        : strategyType === "Covered Short Strangle"
        ? fiveJumpsHighervolatilityCall
        : strategyType === "Bull Call Ladder"
        ? fiveJumpsHighervolatilityCall
        : strategyType === "Bull Put Ladder"
        ? fiveJumpsHighervolatilityPut
        : strategyType === "Bear Call Ladder"
        ? fiveJumpsHighervolatilityCall
        : strategyType === "Bear Put Ladder"
        ? fiveJumpsHighervolatilityPut
        : strategyType === "Synthetic Long Straddle Calls"
        ? fiveJumpsHighervolatilityCall
        : strategyType === "Synthetic Long Straddle Puts"
        ? fiveJumpsHighervolatilityPut
        : strategyType === "Synthetic Short Straddle Calls"
        ? fiveJumpsHighervolatilityCall
        : strategyType === "Synthetic Short Straddle Puts"
        ? fiveJumpsHighervolatilityPut
        : strategyType === "Collar"
        ? fiveJumpsHighervolatilityCall
        : strategyType === "Long Call Butterfly"
        ? fiveJumpsHighervolatilityCall
        : strategyType === "Long Put Butterfly"
        ? fiveJumpsHighervolatilityPut
        : strategyType === "Short Call Butterfly"
        ? fiveJumpsHighervolatilityCall
        : strategyType === "Short Put Butterfly"
        ? fiveJumpsHighervolatilityPut
        : null;

    const leg: Leg = {
      strike: strike1,
      size: 1,
      actualQualtity: direction === 1 ? 1 : -1,
      purchasePrice: purchase,
      direction: direction,
      type: type1,
      expiration: expirationDateUTC,
      symbol: nearestObjectForCall?.symbol,
      volatility: isNaN(volatility1) ? 0 : volatility1,
      range: nearestObjectForCall?.Mid,
      indexOfStrikePrice: 1,
      index: 0,
      y: 0,
    };

    const leg2: Leg2 = {
      strike: strike2,
      size: sizes2,
      actualQualtity: direction2 === 1 ? sizes2 : -sizes2,
      purchasePrice: purchase2,
      direction: direction2,
      type: type2,
      expiration: expirationDateUTC,
      symbol: nearestObjectForCall?.symbol,
      volatility: isNaN(volatility1) ? 0 : volatility3,
      range: nearestObjectForCall?.Mid,
      indexOfStrikePrice: 1,
      index: 0,
      y: 0,
    };

    const leg3: Leg3 = {
      strike: strike3,
      size: 1,
      // "actualQualtity" can have -ve values i.e sell -> -ve qualtity, 
      // but the "quantity" variable will have only +ve values.
      actualQualtity: direction3 === 1 ? 1 : -1,
      purchasePrice: purchase3,
      direction: direction3,
      type: type3,
      expiration: expirationDateUTC,
      symbol: nearestObjectForCall?.symbol,
      volatility: isNaN(volatility1) ? 0 : volatility3,
      range: nearestObjectForCall?.Mid,
      indexOfStrikePrice: 1,
      index: 0,
      y: 0,
    };

    strategy = {
      strategyId: 1,
      ticker: nearestObjectForCall?.root_symbol,
      currentPrice: currentStockPrice,
      purchasePrice: nearestObjectCallpurchasePrice,
      interestRate: 0,
      dividend: 0,
      createdDateTime: new Date(),
      legs: [leg, leg2, leg3],
      name: strategyType,
      shareURL: "",
      sortOrder: 1,
      quoteDescription: nearestObjectForCall?.description,
      changePercentage: 0,
    };
    return strategy;
  }
}
