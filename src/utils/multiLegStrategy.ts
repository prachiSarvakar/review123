import { store } from "@/redux/store";
import { Leg, Leg2, Leg3, Leg4 } from "./legs";
import { Strategy } from "./strategy";

enum OptionSelectionType {
  Bid = 0,
  Mid,
  Ask,
}

export default function MultiLeg(
  currentStockPrice: number,
  type1: number,
  direction: number,
  type2: number,
  direction2: number,
  type3: number,
  direction3: number,
  type4: number,
  direction4: number,
  strategyType: string
) {
  const selectedExpirationDate: any = store.getState().optionGreek;
  let arr: any = [];
  let strategy: Strategy | null = null;

  if (selectedExpirationDate.entities?.length > 0) {
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
    const tenJumpsLowerIndexCall = nearestObjectIndexForCall - 10;
    const tenJumpsHigherIndexCall = nearestObjectIndexForCall + 10;
    const fiveJumpsHigherObjectCall = callOptions[fiveJumpsHigherIndexCall];
    const fiveJumpsLowerObjectCall = callOptions[fiveJumpsLowerIndexCall];
    const tenJumpsHigherObjectCall = callOptions[tenJumpsHigherIndexCall];
    const tenJumpsLowerObjectCall = callOptions[tenJumpsLowerIndexCall];

    const nearestObjectCallvolatility = nearestObjectForCall?.greeks?.mid_iv * 100;
    const nearestObjectCallpurchasePrice = (nearestObjectForCall?.ask + nearestObjectForCall?.bid) / 2;
    const fiveJumpsHighervolatilityCall = fiveJumpsHigherObjectCall?.greeks?.mid_iv * 100;
    const fiveJumpsLowervolatilityCall = fiveJumpsLowerObjectCall?.greeks?.mid_iv * 100;
    const tenJumpsLowervolatilityCall = tenJumpsLowerObjectCall?.greeks?.mid_iv * 100;
    const tenJumpsHighervolatilityCall = tenJumpsHigherObjectCall?.greeks?.mid_iv * 100;

    const fivehigherPurchasePriceCall = (fiveJumpsHigherObjectCall?.ask + fiveJumpsHigherObjectCall?.bid) / 2;
    const fivelowerPurchasePriceCall = (fiveJumpsLowerObjectCall?.ask + fiveJumpsLowerObjectCall?.bid) / 2;
    const tenhigherPurchasePriceCall = (tenJumpsHigherObjectCall?.ask + tenJumpsHigherObjectCall?.bid) / 2;
    const tenlowerPurchasePriceCall = (tenJumpsLowerObjectCall?.ask + tenJumpsLowerObjectCall?.bid) / 2;

    const nearestObjectIndexForPut = putOptions.findIndex((obj) => obj === nearestObjectForPut);

    const fiveJumpsHigherIndexPut = nearestObjectIndexForPut + 5;
    const fiveJumpsLowerIndexPut = nearestObjectIndexForPut - 5;
    const tenJumpsLowerIndexPut = nearestObjectIndexForPut - 10;
    const tenJumpsHigherIndexPut = nearestObjectIndexForPut + 10;
    const fiveJumpsHigherObjectPut = putOptions[fiveJumpsHigherIndexPut];
    const fiveJumpsLowerObjectPut = putOptions[fiveJumpsLowerIndexPut];
    const tenJumpsHigherObjectPut = putOptions[tenJumpsHigherIndexPut];
    const tenJumpsLowerObjectPut = putOptions[tenJumpsLowerIndexPut];

    const nearestObjectPutpurchasePrice = (nearestObjectForPut?.ask + nearestObjectForPut?.bid) / 2;

    const nearestObjectPutvolatility = nearestObjectForPut?.greeks?.mid_iv * 100;
    const fiveJumpsHighervolatilityPut = fiveJumpsHigherObjectPut?.greeks?.mid_iv * 100;
    const fiveJumpsLowervolatilityPut = fiveJumpsLowerObjectPut?.greeks?.mid_iv * 100;
    const tenJumpsLowervolatilityPut = tenJumpsLowerObjectPut?.greeks?.mid_iv * 100;
    const tenJumpsHighervolatilityPut = tenJumpsHigherObjectPut?.greeks?.mid_iv * 100;

    const fivehigherPurchasePricePut = (fiveJumpsHigherObjectPut?.ask + fiveJumpsHigherObjectPut?.bid) / 2;
    const fivelowerPurchasePricePut = (fiveJumpsLowerObjectPut?.ask + fiveJumpsLowerObjectPut?.bid) / 2;
    const tenhigherPurchasePricePut = (tenJumpsHigherObjectPut?.ask + tenJumpsHigherObjectPut?.bid) / 2;
    const tenlowerPurchasePricePut = (tenJumpsLowerObjectPut?.ask + tenJumpsLowerObjectPut?.bid) / 2;

    const expiryDate = nearestObjectForCall?.expiration_date;
    const expirationDate: any = new Date(expiryDate); // Expiration date

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
      strategyType === "Long Call Condor"
        ? tenJumpsLowerObjectCall?.strike
        : strategyType === "Long Put Condor"
        ? tenJumpsLowerObjectPut?.strike
        : strategyType === "Iron Condor"
        ? tenJumpsLowerObjectPut?.strike
        : strategyType === "Short Call Condor"
        ? tenJumpsLowerObjectCall?.strike
        : strategyType === "Short Put Condor"
        ? tenJumpsLowerObjectPut?.strike
        : strategyType === "Reverse Iron Condor"
        ? tenJumpsLowerObjectPut?.strike
        : strategyType === "Iron Butterfly"
        ? fiveJumpsLowerObjectPut?.strike
        : strategyType === "Reverse Iron Butterfly"
        ? fiveJumpsLowerObjectPut?.strike
        : strategyType === "Long Box"
        ? tenJumpsLowerObjectPut?.strike
        : null;

    const strike2 =
      strategyType === "Long Call Condor"
        ? fiveJumpsLowerObjectCall?.strike
        : strategyType === "Long Put Condor"
        ? fiveJumpsLowerObjectPut?.strike
        : strategyType === "Iron Condor"
        ? fiveJumpsLowerObjectPut?.strike
        : strategyType === "Short Call Condor"
        ? fiveJumpsLowerObjectCall?.strike
        : strategyType === "Short Put Condor"
        ? fiveJumpsLowerObjectPut?.strike
        : strategyType === "Reverse Iron Condor"
        ? fiveJumpsLowerObjectPut?.strike
        : strategyType === "Iron Butterfly"
        ? nearestObjectForPut?.strike
        : strategyType === "Reverse Iron Butterfly"
        ? nearestObjectForPut?.strike
        : strategyType === "Long Box"
        ? fiveJumpsLowerObjectCall?.strike
        : null;

    const strike3 =
      strategyType === "Long Call Condor"
        ? fiveJumpsHigherObjectCall?.strike
        : strategyType === "Long Put Condor"
        ? fiveJumpsHigherObjectPut?.strike
        : strategyType === "Iron Condor"
        ? fiveJumpsHigherObjectCall?.strike
        : strategyType === "Short Call Condor"
        ? fiveJumpsHigherObjectCall?.strike
        : strategyType === "Short Put Condor"
        ? fiveJumpsHigherObjectPut?.strike
        : strategyType === "Reverse Iron Condor"
        ? fiveJumpsHigherObjectCall?.strike
        : strategyType === "Iron Butterfly"
        ? nearestObjectForCall?.strike
        : strategyType === "Reverse Iron Butterfly"
        ? nearestObjectForCall?.strike
        : strategyType === "Long Box"
        ? fiveJumpsHigherObjectPut?.strike
        : null;

    const strike4 =
      strategyType === "Long Call Condor"
        ? tenJumpsHigherObjectCall?.strike
        : strategyType === "Long Put Condor"
        ? tenJumpsHigherObjectPut?.strike
        : strategyType === "Iron Condor"
        ? tenJumpsHigherObjectCall?.strike
        : strategyType === "Short Call Condor"
        ? tenJumpsHigherObjectCall?.strike
        : strategyType === "Short Put Condor"
        ? tenJumpsHigherObjectPut?.strike
        : strategyType === "Reverse Iron Condor"
        ? tenJumpsHigherObjectCall?.strike
        : strategyType === "Iron Butterfly"
        ? fiveJumpsHigherObjectCall?.strike
        : strategyType === "Reverse Iron Butterfly"
        ? fiveJumpsHigherObjectCall?.strike
        : strategyType === "Long Box"
        ? tenJumpsHigherObjectCall?.strike
        : null;

    const purchase =
      strategyType === "Long Call Condor"
        ? tenlowerPurchasePriceCall
        : strategyType === "Long Put Condor"
        ? tenlowerPurchasePricePut
        : strategyType === "Iron Condor"
        ? tenlowerPurchasePricePut
        : strategyType === "Short Call Condor"
        ? tenlowerPurchasePriceCall
        : strategyType === "Short Put Condor"
        ? tenlowerPurchasePricePut
        : strategyType === "Reverse Iron Condor"
        ? tenlowerPurchasePricePut
        : strategyType === "Iron Butterfly"
        ? fivelowerPurchasePricePut
        : strategyType === "Reverse Iron Butterfly"
        ? fivelowerPurchasePricePut
        : strategyType === "Long Box"
        ? tenlowerPurchasePricePut
        : null;

    const purchase2 =
      strategyType === "Long Call Condor"
        ? fivelowerPurchasePriceCall
        : strategyType === "Long Put Condor"
        ? fivelowerPurchasePricePut
        : strategyType === "Iron Condor"
        ? fivelowerPurchasePricePut
        : strategyType === "Short Call Condor"
        ? fivelowerPurchasePriceCall
        : strategyType === "Short Put Condor"
        ? fivelowerPurchasePricePut
        : strategyType === "Reverse Iron Condor"
        ? fivelowerPurchasePricePut
        : strategyType === "Iron Butterfly"
        ? nearestObjectPutpurchasePrice
        : strategyType === "Reverse Iron Butterfly"
        ? nearestObjectPutpurchasePrice
        : strategyType === "Long Box"
        ? fivelowerPurchasePriceCall
        : null;

    const purchase3 =
      strategyType === "Long Call Condor"
        ? fivehigherPurchasePriceCall
        : strategyType === "Long Put Condor"
        ? fivehigherPurchasePricePut
        : strategyType === "Iron Condor"
        ? fivehigherPurchasePriceCall
        : strategyType === "Short Call Condor"
        ? fivehigherPurchasePriceCall
        : strategyType === "Short Put Condor"
        ? fivehigherPurchasePricePut
        : strategyType === "Reverse Iron Condor"
        ? fivehigherPurchasePriceCall
        : strategyType === "Long Box"
        ? fivehigherPurchasePricePut
        : strategyType === "Iron Butterfly"
        ? nearestObjectCallpurchasePrice
        : strategyType === "Reverse Iron Butterfly"
        ? nearestObjectCallpurchasePrice
        : null;

    const purchase4 =
      strategyType === "Long Call Condor"
        ? tenhigherPurchasePriceCall
        : strategyType === "Long Put Condor"
        ? tenhigherPurchasePricePut
        : strategyType === "Iron Condor"
        ? tenhigherPurchasePriceCall
        : strategyType === "Short Call Condor"
        ? tenhigherPurchasePriceCall
        : strategyType === "Short Put Condor"
        ? tenhigherPurchasePricePut
        : strategyType === "Reverse Iron Condor"
        ? tenhigherPurchasePriceCall
        : strategyType === "Iron Butterfly"
        ? fivehigherPurchasePriceCall
        : strategyType === "Reverse Iron Butterfly"
        ? fivehigherPurchasePriceCall
        : strategyType === "Long Box"
        ? tenhigherPurchasePriceCall
        : null;

    const volatility1 =
      strategyType === "Long Call Condor"
        ? tenJumpsLowervolatilityCall
        : strategyType === "Long Put Condor"
        ? tenJumpsLowervolatilityPut
        : strategyType === "Iron Condor"
        ? tenJumpsLowervolatilityPut
        : strategyType === "Short Call Condor"
        ? tenJumpsLowervolatilityCall
        : strategyType === "Short Put Condor"
        ? tenJumpsLowervolatilityPut
        : strategyType === "Reverse Iron Condor"
        ? tenJumpsLowervolatilityPut
        : strategyType === "Iron Butterfly"
        ? fiveJumpsLowervolatilityPut
        : strategyType === "Reverse Iron Butterfly"
        ? fiveJumpsLowervolatilityPut
        : strategyType === "Long Box"
        ? tenJumpsLowervolatilityPut
        : null;

    const volatility2 =
      strategyType === "Long Call Condor"
        ? fiveJumpsLowervolatilityCall
        : strategyType === "Long Put Condor"
        ? fiveJumpsLowervolatilityPut
        : strategyType === "Iron Condor"
        ? fiveJumpsLowervolatilityPut
        : strategyType === "Short Call Condor"
        ? fiveJumpsLowervolatilityCall
        : strategyType === "Short Put Condor"
        ? fiveJumpsLowervolatilityPut
        : strategyType === "Reverse Iron Condor"
        ? fiveJumpsLowervolatilityPut
        : strategyType === "Iron Butterfly"
        ? nearestObjectPutvolatility
        : strategyType === "Reverse Iron Butterfly"
        ? nearestObjectPutvolatility
        : strategyType === "Long Box"
        ? fiveJumpsLowervolatilityCall
        : null;

    const volatility3 =
      strategyType === "Long Call Condor"
        ? fiveJumpsHighervolatilityCall
        : strategyType === "Long Put Condor"
        ? fiveJumpsHighervolatilityPut
        : strategyType === "Iron Condor"
        ? fiveJumpsHighervolatilityCall
        : strategyType === "Short Call Condor"
        ? fiveJumpsHighervolatilityCall
        : strategyType === "Short Put Condor"
        ? fiveJumpsHighervolatilityPut
        : strategyType === "Reverse Iron Condor"
        ? fiveJumpsHighervolatilityCall
        : strategyType === "Long Box"
        ? fiveJumpsHighervolatilityPut
        : strategyType === "Iron Butterfly"
        ? nearestObjectCallvolatility
        : strategyType === "Reverse Iron Butterfly"
        ? nearestObjectCallvolatility
        : null;

    const volatility4 =
      strategyType === "Long Call Condor"
        ? tenJumpsHighervolatilityCall
        : strategyType === "Long Put Condor"
        ? tenJumpsHighervolatilityPut
        : strategyType === "Iron Condor"
        ? tenJumpsHighervolatilityCall
        : strategyType === "Short Call Condor"
        ? tenJumpsHighervolatilityCall
        : strategyType === "Short Put Condor"
        ? tenJumpsHighervolatilityPut
        : strategyType === "Reverse Iron Condor"
        ? tenJumpsHighervolatilityCall
        : strategyType === "Iron Butterfly"
        ? fiveJumpsHighervolatilityCall
        : strategyType === "Reverse Iron Butterfly"
        ? fiveJumpsHighervolatilityCall
        : strategyType === "Long Box"
        ? tenJumpsHighervolatilityCall
        : null;

    const leg: Leg = {
      strike: Math.floor(strike1),
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
      strike: Math.floor(strike2),
      size: 1,
      actualQualtity: direction2 === 1 ? 1 : -1,
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

    const leg3: Leg3 = {
      strike: Math.floor(strike3),
      size: 1,
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
    const leg4: Leg4 = {
      strike: Math.floor(strike4),
      size: 1,
      actualQualtity: direction4 === 1 ? 1 : -1,
      purchasePrice: purchase4,
      direction: direction4,
      type: type4,
      expiration: expirationDateUTC,
      symbol: nearestObjectForCall?.symbol,
      volatility: isNaN(volatility1) ? 0 : volatility4,
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
      legs: [leg, leg2, leg3, leg4],
      name: strategyType,
      shareURL: "",
      sortOrder: 1,
      quoteDescription: nearestObjectForCall?.description,
      changePercentage: 0,
    };
    return strategy;
  }
}
