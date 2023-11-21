// export const strategy = []

export function calculateOption(
  strategy: string,
  strikePrice: any,
  underlyingPrice: any,
  expiryDate: any,
  pricePerOption: any,
  contracts: any,
  optionType: any,
  buyorSell: any
) {
  const volatility = 62.66;
  const interestRate = 4.0;
  const dividendRate = 2.6;
  const now = new Date();
  now.setHours(10, 0, 0, 0);
  const expirationDate: any = new Date(expiryDate); // Expiration date
  expirationDate.setHours(16, 0, 0, 0);
  const finalArray = [];
  let currentDate: any = new Date(now);
  while (currentDate <= expirationDate) {
    const daysToExpiration = Math.floor((expirationDate - currentDate) / (1000 * 60 * 60 * 24));

    const contractValue = pricePerOption * 100 * contracts;
    const maxRisk =
      strategy === "long"
        ? contractValue
        : (Math.abs(strikePrice - underlyingPrice) - pricePerOption) * 100 * contracts;

    const latter = Math.pow(volatility, 2.0);
    const interest = interestRate;
    const dividend = dividendRate;
    const timetoexp = (daysToExpiration / 365.5) * 100;
    const division = underlyingPrice / strikePrice;
    const getlnSoX = Math.log(division);

    const rminussigma = ((interestRate - dividendRate + latter / 2) * timetoexp) / 1000000;
    const sigmasqrt = Math.max(0.000000000001, (volatility * Math.sqrt(timetoexp)) / 1000);

    const d1 = (getlnSoX + rminussigma) / sigmasqrt;
    const d2 = d1 - sigmasqrt;
    const nd1: any = normalDistribution(d1, 0, 1);
    const nnd1: any = normalDistribution(-d1, 0, 1);
    const nd2: any = normalDistribution(d2, 0, 1);
    const nnd2: any = normalDistribution(-d2, 0, 1);

    const getExpo = Math.exp(((-interestRate / 100) * timetoexp) / 100);
    const getXert = getExpo * strikePrice;
    const getqt = Math.exp(((-dividendRate / 100) * timetoexp) / 100);
    const getS0eqt = underlyingPrice * getqt;
    const getSqrtPi = Math.exp((-1 * Math.pow(d1, 2)) / 2) / Math.sqrt(2 * Math.PI);

    const direction = 1.0;

    const legPrice =
      optionType === "call"
        ? (getS0eqt * nd1 - getXert * nd2) * direction /** direction*/
        : optionType === "put"
        ? getXert * nnd2 - getS0eqt * nnd1 * direction /** direction*/
        : optionType === "stock"
        ? underlyingPrice - pricePerOption * direction /** direction*/
        : 0;

    var pricePaid = 0.0;
    pricePaid += pricePerOption * (100 * contracts) * direction; //Initial CF

    const position = 100 * contracts * direction;

    let maxProfit, maxLoss, breakeven, pnl, pnlPercentage, riskPercentage;

    if (strategy === "long") {
      maxProfit = Number.POSITIVE_INFINITY;
      maxLoss = contractValue * -1;
      breakeven = strikePrice + pricePerOption;
      pnl =
        (Math.abs(strikePrice - underlyingPrice) - pricePerOption) * 100 * contracts * (optionType === "call" ? 1 : -1);
      pnlPercentage = (pnl / contractValue) * 100;
      riskPercentage = (Math.abs(pnl) / maxRisk) * 100;
    } else if (strategy === "short") {
      maxProfit = (Math.abs(strikePrice - underlyingPrice) - pricePerOption) * 100 * contracts;
      maxLoss = contractValue;
      breakeven = strikePrice - pricePerOption;
      pnl =
        (pricePerOption - Math.abs(strikePrice - underlyingPrice)) * 100 * contracts * (optionType === "call" ? 1 : -1);
      pnlPercentage = (pnl / contractValue) * 100;
      riskPercentage = (Math.abs(pnl) / maxRisk) * 100;
    }

    const datesData = {
      daysToExpiration: daysToExpiration,
      contractValue: contractValue,
      maxRisk: maxRisk,
      maxProfit: maxProfit,
      maxLoss: maxLoss,
      breakeven: breakeven,
      pnl: pnl,
      pnlPercentage: pnlPercentage,
      riskPercentage: riskPercentage,
      timetoexp: timetoexp,
      getlnSoX: getlnSoX,
      rminussigma: rminussigma,
      sigmasqrt: sigmasqrt,
      d1: d1,
      d2: d2,
      getExpo: getExpo,
      getXert: getXert,
      getqt: getqt,
      getS0eqt: getS0eqt,
      getSqrtPi: getSqrtPi,
      legPrice: legPrice,
      nd1: nd1,
      nnd1: nnd1,
      nd2: nd2,
      nnd2: nnd2,
      pricePaid: pricePaid,
      // profitLossValue,
      position: position,
      buyorSell: buyorSell,
    };

    currentDate.setDate(currentDate.getDate() + 1);
    finalArray.push(datesData);
  }
  return finalArray;
}

function normalDistribution(x: any, mean = 0, stdDev = 1) {
  if (stdDev <= 0) {
    return null;
  }
  const z = (x - mean) / stdDev;
  return 0.5 * erfc(-z * Math.sqrt(0.5));
}

function erf(x: any) {
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x);

  const t = 1 / (1 + p * x);
  const y = 1 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

  return sign * y;
}
function erfc(x: any) {
  return 1 - erf(x);
}
export const calculate = (
  strategy: any,
  strikePrice: any,
  underlyingPrice: any,
  expiryDate: any,
  pricePerOption: any,
  contracts: any,
  optionType: any,
  buyorSell: any
) => {
  const option = calculateOption(
    strategy,
    strikePrice,
    underlyingPrice,
    expiryDate,
    pricePerOption,
    contracts,
    optionType,
    buyorSell
  );
  //   let price = 0.0;
  //   price += option.legPrice;
  //   const optionValue = option.legPrice * option.position;
  //   const profitLossValue = option.pricePaid - optionValue;
};

export const findNearestLargestValue = (currentStock: any, value: any) => {
  const filteredValues = value.filter((value: any) => value > currentStock);
  const sortedValues = filteredValues.sort((a: any, b: any) => a - b);

  if (sortedValues.length !== 0) {
    return sortedValues[0];
  }
  return null;
};

export const getTablePoints = (breakEven: number) => {
  const posArr: any = [];
  const negArr: any = [];

  let positiveInteger = breakEven;
  let negativeInteger = breakEven;
  for (let i = 1; i < 11; i++) {
    positiveInteger += positiveInteger * 0.01;
    negativeInteger -= negativeInteger * 0.01;
    posArr.unshift({ breakEven: `${+positiveInteger.toFixed(1)}` });
    negArr.push({ breakEven: `${+negativeInteger.toFixed(1)}` });
  }
  return [...posArr, { breakEven }, ...negArr];
};
