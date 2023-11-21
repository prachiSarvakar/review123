import { store } from "@/redux/store";
import { Strategy } from "./strategy";
import { Leg, Leg2 } from "./legs";

export default function DoubleLeg(
  currentStockPrice: number,
  type1: number,
  direction: number,
  type2: number,
  direction2: number,
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
      const trimNumber = item?.strike;
      arr.push(trimNumber);
    });

    let nearestStrikeForCall = Math.min(...arr?.filter((strike: number) => strike >= currentStockPrice));

    const nearestObjectForCall = callOptions?.find((item) => item?.strike === nearestStrikeForCall);

    let nearestStrikeForPut = Math.min(...arr?.filter((strike: number) => strike >= currentStockPrice));

    const nearestObjectForPut = putOptions?.find((item) => item?.strike === nearestStrikeForPut);

    const nearestObjectIndexForCall = callOptions?.findIndex((obj) => obj === nearestObjectForCall);
    const fiveJumpsHigherIndexCall = nearestObjectIndexForCall + 5;
    const fiveJumpsLowerIndexCall = nearestObjectIndexForCall - 5;
    const fiveJumpsHigherObjectCall = callOptions[fiveJumpsHigherIndexCall];
    const fiveJumpsLowerObjectCall = callOptions[fiveJumpsLowerIndexCall];

    const nearestObjectCallvolatility = nearestObjectForCall?.greeks?.mid_iv * 100;
    const fiveJumpsHighervolatilityCall = fiveJumpsHigherObjectCall?.greeks?.mid_iv * 100;
    const fiveJumpsLowervolatilityCall = fiveJumpsLowerObjectCall?.greeks?.mid_iv * 100;

    const nearestObjectCallpurchasePrice = (nearestObjectForCall?.ask + nearestObjectForCall?.bid) / 2;
    const fivehigherPurchasePriceCall = (fiveJumpsHigherObjectCall?.ask + fiveJumpsHigherObjectCall?.bid) / 2;
    const fivelowerPurchasePriceCall = (fiveJumpsLowerObjectCall?.ask + fiveJumpsLowerObjectCall?.bid) / 2;

    const nearestObjectIndexForPut = putOptions.findIndex((obj) => obj === nearestObjectForPut);

    const fiveJumpsHigherIndexPut = nearestObjectIndexForPut + 5;
    const fiveJumpsLowerIndexPut = nearestObjectIndexForPut - 5;
    const fiveJumpsHigherObjectPut = putOptions[fiveJumpsHigherIndexPut];
    const fiveJumpsLowerObjectPut = putOptions[fiveJumpsLowerIndexPut];

    const nearestObjectPutvolatility = nearestObjectForPut?.greeks?.mid_iv * 100;
    const fiveJumpsHighervolatilityPut = fiveJumpsHigherObjectPut?.greeks?.mid_iv * 100;
    const fiveJumpsLowervolatilityPut = fiveJumpsLowerObjectPut?.greeks?.mid_iv * 100;

    const nearestObjectPutpurchasePrice = (nearestObjectForPut?.ask + nearestObjectForPut?.bid) / 2;
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
      strategyType === "Covered Call"
        ? currentStockPrice
        : strategyType === "Protective Put"
          ? currentStockPrice
          : strategyType === "Bull Call Spread"
            ? nearestObjectForCall?.strike
            : strategyType === "Bear Put Spread"
              ? nearestObjectForPut?.strike
              : strategyType === "Bear Call Spread"
                ? fiveJumpsLowerObjectCall?.strike
                : strategyType === "Bull Put Spread"
                  ? fiveJumpsLowerObjectPut?.strike
                  : strategyType === "Call Vertical Spread"
                    ? nearestObjectForCall?.strike
                    : strategyType === "Put Vertical Spread"
                      ? fiveJumpsLowerObjectPut?.strike
                      : strategyType === "Long Straddle"
                        ? nearestObjectForPut?.strike
                        : strategyType === "Short Straddle"
                          ? nearestObjectForPut?.strike
                          : strategyType === "Long Strangle"
                            ? fiveJumpsLowerObjectPut?.strike
                            : strategyType === "Short Strangle"
                              ? fiveJumpsLowerObjectPut?.strike
                              : strategyType === "Synthetic Call"
                                ? currentStockPrice
                                : strategyType === "Synthetic Put"
                                  ? currentStockPrice
                                  : strategyType === "Synthetic Long Stock"
                                    ? fiveJumpsLowerObjectPut?.strike
                                    : strategyType === "Synthetic Short Stock"
                                      ? fiveJumpsLowerObjectPut?.strike
                                      : strategyType === "Strap"
                                        ? nearestObjectForCall?.strike
                                        : strategyType === "Strip"
                                          ? nearestObjectForCall?.strike
                                          : strategyType === "Long Guts"
                                            ? fiveJumpsLowerObjectCall?.strike
                                            : strategyType === "Short Guts"
                                              ? fiveJumpsLowerObjectCall?.strike
                                              : strategyType === "Long Combo"
                                                ? fiveJumpsLowerObjectPut?.strike
                                                : strategyType === "Short Combo"
                                                  ? fiveJumpsLowerObjectPut?.strike
                                                  : strategyType === "Call Vertical spread"
                                                    ? fiveJumpsLowerObjectCall?.strike
                                                    : strategyType === "Put Vertical spread"
                                                      ? fiveJumpsLowerObjectPut?.strike
                                                      : null;

    const strike2 =
      strategyType === "Covered Call"
        ? fiveJumpsHigherObjectCall?.strike
        : strategyType === "Protective Put"
          ? fiveJumpsLowerObjectPut?.strike
          : strategyType === "Bull Call Spread"
            ? fiveJumpsHigherObjectCall?.strike
            : strategyType === "Bear Put Spread"
              ? fiveJumpsHigherObjectPut?.strike
              : strategyType === "Bear Call Spread"
                ? nearestObjectForCall?.strike
                : strategyType === "Bull Put Spread"
                  ? nearestObjectForPut?.strike
                  : strategyType === "Call Vertical Spread"
                    ? fiveJumpsHigherObjectCall?.strike
                    : strategyType === "Put Vertical Spread"
                      ? nearestObjectForPut?.strike
                      : strategyType === "Long Straddle"
                        ? nearestObjectForCall?.strike
                        : strategyType === "Short Straddle"
                          ? nearestObjectForCall?.strike
                          : strategyType === "Long Strangle"
                            ? fiveJumpsHigherObjectCall?.strike
                            : strategyType === "Short Strangle"
                              ? fiveJumpsHigherObjectCall?.strike
                              : strategyType === "Synthetic Call"
                                ? nearestObjectForPut?.strike
                                : strategyType === "Synthetic Put"
                                  ? nearestObjectForCall?.strike
                                  : strategyType === "Synthetic Long Stock"
                                    ? fiveJumpsHigherObjectCall?.strike
                                    : strategyType === "Synthetic Short Stock"
                                      ? fiveJumpsHigherObjectCall?.strike
                                      : strategyType === "Strap"
                                        ? nearestObjectForPut?.strike
                                        : strategyType === "Strip"
                                          ? nearestObjectForPut?.strike
                                          : strategyType === "Long Guts"
                                            ? fiveJumpsHigherObjectPut?.strike
                                            : strategyType === "Short Guts"
                                              ? fiveJumpsHigherObjectPut?.strike
                                              : strategyType === "Long Combo"
                                                ? fiveJumpsHigherObjectCall?.strike
                                                : strategyType === "Short Combo"
                                                  ? fiveJumpsHigherObjectCall?.strike
                                                  : strategyType === "Call Vertical spread"
                                                    ? fiveJumpsHigherObjectCall?.strike
                                                    : strategyType === "Put Vertical spread"
                                                      ? fiveJumpsHigherObjectPut?.strike
                                                      : null;

    const sizes1 =
      strategyType === "Strap"
        ? 2
        : strategyType === "Put Vertical Backspread"
          ? 2
          : strategyType === "Put Vertical Spread"
            ? 2
            : 1;
    const sizes2 =
      strategyType === "Call Vertical Spread"
        ? 2
        : strategyType === "Strip"
          ? 2
          : strategyType === "Call Vertical spread"
            ? 2
            : 1;

    const purchase =
      strategyType === "Covered Call"
        ? currentStockPrice
        : strategyType === "Protective Put"
          ? currentStockPrice
          : strategyType === "Synthetic Call"
            ? currentStockPrice
            : strategyType === "Synthetic Put"
              ? currentStockPrice
              : strategyType === "Bull Call Spread"
                ? nearestObjectCallpurchasePrice
                : strategyType === "Bear Put Spread"
                  ? nearestObjectPutpurchasePrice
                  : strategyType === "Bear Call Spread"
                    ? fivelowerPurchasePriceCall
                    : strategyType === "Bull Put Spread"
                      ? fivelowerPurchasePricePut
                      : strategyType === "Call Vertical Spread"
                        ? nearestObjectCallpurchasePrice
                        : strategyType === "Put Vertical Spread"
                          ? fivelowerPurchasePricePut
                          : strategyType === "Long Straddle"
                            ? nearestObjectPutpurchasePrice
                            : strategyType === "Short Straddle"
                              ? nearestObjectPutpurchasePrice
                              : strategyType === "Long Strangle"
                                ? fivelowerPurchasePricePut
                                : strategyType === "Short Strangle"
                                  ? fivelowerPurchasePricePut
                                  : strategyType === "Synthetic Long Stock"
                                    ? fivelowerPurchasePricePut
                                    : strategyType === "Synthetic Short Stock"
                                      ? fivelowerPurchasePricePut
                                      : strategyType === "Strap"
                                        ? nearestObjectCallpurchasePrice
                                        : strategyType === "Strip"
                                          ? nearestObjectCallpurchasePrice
                                          : strategyType === "Long Guts"
                                            ? fivelowerPurchasePriceCall
                                            : strategyType === "Short Guts"
                                              ? fivelowerPurchasePriceCall
                                              : strategyType === "Long Combo"
                                                ? fivelowerPurchasePricePut
                                                : strategyType === "Short Combo"
                                                  ? fivelowerPurchasePricePut
                                                  : strategyType === "Call Vertical spread"
                                                    ? fivelowerPurchasePriceCall
                                                    : strategyType === "Put Vertical spread"
                                                      ? fivelowerPurchasePricePut
                                                      : null;

    const purchase2 =
      strategyType === "Covered Call"
        ? fivehigherPurchasePriceCall
        : strategyType === "Protective Put"
          ? fivelowerPurchasePricePut
          : strategyType === "Bull Call Spread"
            ? fivehigherPurchasePriceCall
            : strategyType === "Bear Put Spread"
              ? fivehigherPurchasePricePut
              : strategyType === "Bear Call Spread"
                ? nearestObjectCallpurchasePrice
                : strategyType === "Bull Put Spread"
                  ? nearestObjectPutpurchasePrice
                  : strategyType === "Call Vertical Spread"
                    ? fivehigherPurchasePriceCall
                    : strategyType === "Put Vertical Spread"
                      ? nearestObjectPutpurchasePrice
                      : strategyType === "Long Straddle"
                        ? nearestObjectCallpurchasePrice
                        : strategyType === "Short Straddle"
                          ? nearestObjectCallpurchasePrice
                          : strategyType === "Long Strangle"
                            ? fivehigherPurchasePriceCall
                            : strategyType === "Short Strangle"
                              ? fivehigherPurchasePriceCall
                              : strategyType === "Synthetic Call"
                                ? nearestObjectPutpurchasePrice
                                : strategyType === "Synthetic Put"
                                  ? nearestObjectCallpurchasePrice
                                  : strategyType === "Synthetic Long Stock"
                                    ? fivehigherPurchasePriceCall
                                    : strategyType === "Synthetic Short Stock"
                                      ? fivehigherPurchasePriceCall
                                      : strategyType === "Strap"
                                        ? nearestObjectPutpurchasePrice
                                        : strategyType === "Strip"
                                          ? nearestObjectPutpurchasePrice
                                          : strategyType === "Long Guts"
                                            ? fivehigherPurchasePricePut
                                            : strategyType === "Short Guts"
                                              ? fivehigherPurchasePricePut
                                              : strategyType === "Long Combo"
                                                ? fivehigherPurchasePriceCall
                                                : strategyType === "Short Combo"
                                                  ? fivehigherPurchasePriceCall
                                                  : strategyType === "Call Vertical Backspread"
                                                    ? fivehigherPurchasePriceCall
                                                    : strategyType === "Put Vertical Backspread"
                                                      ? fivehigherPurchasePricePut
                                                      : null;

    const volatility1 =
      strategyType === "Covered Call"
        ? 0
        : strategyType === "Protective Put"
          ? 0
          : strategyType === "Synthetic Call"
            ? 0
            : strategyType === "Synthetic Put"
              ? 0
              : strategyType === "Bull Call Spread"
                ? nearestObjectCallvolatility
                : strategyType === "Bear Put Spread"
                  ? nearestObjectPutvolatility
                  : strategyType === "Bear Call Spread"
                    ? fiveJumpsLowervolatilityCall
                    : strategyType === "Bull Put Spread"
                      ? fiveJumpsLowervolatilityPut
                      : strategyType === "Call Vertical Spread"
                        ? nearestObjectCallvolatility
                        : strategyType === "Put Vertical Spread"
                          ? fiveJumpsLowervolatilityPut
                          : strategyType === "Long Straddle"
                            ? nearestObjectPutvolatility
                            : strategyType === "Short Straddle"
                              ? nearestObjectPutvolatility
                              : strategyType === "Long Strangle"
                                ? fiveJumpsLowervolatilityPut
                                : strategyType === "Short Strangle"
                                  ? fiveJumpsLowervolatilityPut
                                  : strategyType === "Synthetic Long Stock"
                                    ? fiveJumpsLowervolatilityPut
                                    : strategyType === "Synthetic Short Stock"
                                      ? fiveJumpsLowervolatilityPut
                                      : strategyType === "Strap"
                                        ? nearestObjectCallvolatility
                                        : strategyType === "Strip"
                                          ? nearestObjectCallvolatility
                                          : strategyType === "Long Guts"
                                            ? fiveJumpsLowervolatilityCall
                                            : strategyType === "Short Guts"
                                              ? fiveJumpsLowervolatilityCall
                                              : strategyType === "Long Combo"
                                                ? fiveJumpsLowervolatilityPut
                                                : strategyType === "Short Combo"
                                                  ? fiveJumpsLowervolatilityPut
                                                  : strategyType === "Call Vertical spread"
                                                    ? fiveJumpsLowervolatilityCall
                                                    : strategyType === "Put Vertical spread"
                                                      ? fiveJumpsLowervolatilityPut
                                                      : null;

    const volatility2 =
      strategyType === "Covered Call"
        ? fiveJumpsHighervolatilityCall
        : strategyType === "Protective Put"
          ? fiveJumpsLowervolatilityPut
          : strategyType === "Bull Call Spread"
            ? fiveJumpsHighervolatilityCall
            : strategyType === "Bear Put Spread"
              ? fiveJumpsHighervolatilityPut
              : strategyType === "Bear Call Spread"
                ? nearestObjectCallvolatility
                : strategyType === "Bull Put Spread"
                  ? nearestObjectPutvolatility
                  : strategyType === "Call Vertical Spread"
                    ? fiveJumpsHighervolatilityCall
                    : strategyType === "Put Vertical Spread"
                      ? nearestObjectPutvolatility
                      : strategyType === "Long Straddle"
                        ? nearestObjectCallvolatility
                        : strategyType === "Short Straddle"
                          ? nearestObjectCallvolatility
                          : strategyType === "Long Strangle"
                            ? fiveJumpsHighervolatilityCall
                            : strategyType === "Short Strangle"
                              ? fiveJumpsHighervolatilityCall
                              : strategyType === "Synthetic Call"
                                ? nearestObjectPutvolatility
                                : strategyType === "Synthetic Put"
                                  ? nearestObjectCallvolatility
                                  : strategyType === "Synthetic Long Stock"
                                    ? fiveJumpsHighervolatilityCall
                                    : strategyType === "Synthetic Short Stock"
                                      ? fiveJumpsHighervolatilityCall
                                      : strategyType === "Strap"
                                        ? nearestObjectPutvolatility
                                        : strategyType === "Strip"
                                          ? nearestObjectPutvolatility
                                          : strategyType === "Long Guts"
                                            ? fiveJumpsHighervolatilityPut
                                            : strategyType === "Short Guts"
                                              ? fiveJumpsHighervolatilityPut
                                              : strategyType === "Long Combo"
                                                ? fiveJumpsHighervolatilityCall
                                                : strategyType === "Short Combo"
                                                  ? fiveJumpsHighervolatilityCall
                                                  : strategyType === "Call Vertical spread"
                                                    ? fiveJumpsHighervolatilityCall
                                                    : strategyType === "Put Vertical spread"
                                                      ? fiveJumpsHighervolatilityPut
                                                      : null;

    const leg: Leg = {
      strike: strike1,
      size: sizes1,
      // "actualQualtity" can have -ve values i.e sell -> -ve qualtity, 
      // but the "quantity" variable will have only +ve values.
      actualQualtity: direction === 1 ? sizes1 : -sizes1,
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
      volatility: isNaN(volatility1) ? 0 : volatility2,
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
      legs: new Array(),
      name: strategyType,
      shareURL: "",
      sortOrder: 1,
      quoteDescription: nearestObjectForCall?.description,
      changePercentage: 0,
    };
    strategy.legs.push(leg);
    strategy.legs.push(leg2);
    return strategy;
  }
}
