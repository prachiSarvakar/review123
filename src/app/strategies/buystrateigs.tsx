"use clients";
import { Offcanvas, Button, Form, Dropdown, Alert, Spinner, Toast, ToastContainer } from "react-bootstrap";
import styles from "@/styles/strategies.module.scss";
import React, { useState, useEffect, useMemo } from "react";
import { balancesData, fetchBalanceDetails } from "@/redux/slices/balanceSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxCommon";
import { fetchOptionGreek } from "@/redux/slices/optionGreekSlice";
import { capitalizeFirstLetter, formatedDate, formattedDate } from "@/utils/dates";
import {
  editPlaceOrder,
  fetchPlaceOrder,
  fetchPlaceOrderNew,
  loadingOrderData,
  placeOrderData,
} from "@/redux/slices/placeOrderSlice";
import { fetchTradeData, tradingData } from "@/redux/slices/tradeDataSlice";
import { useRouter } from "next/navigation";
import { optionStrategiSelectionData, fetchOptionStrategySelection } from "@/redux/slices/optionStrategySlice";
import { Howl } from "howler";
import { Leg } from "@/utils/legs";
import { fetchQuotesData } from "@/redux/slices/quoteSlice";
import { fetchOptionGreekChains, optionGreekChainsData } from "@/redux/slices/optionGreekChainsSlice";
import { addDollarSignCommasToNumber, customToFixed } from "@/utils/positions";
import options from "@/utils/optionSummeryCalc";
import SummaryHelper from "@/utils/OptionStrategyCalculation";
interface BuyStrategiesProp {
  tradeDataMap: any;
  optionDashboardRows: any;
  pageTitle: string;
  actionType: string;
  alerts?: any;
  editOrderId?: number;
  showUnderlyingSec: boolean;
  netTitle?: any;
  minValueOfData?: any;
  coveredValue?: number;
  handleClose: any;
}

const BuyStrategies: React.FC<BuyStrategiesProp> = ({
  tradeDataMap,
  optionDashboardRows,
  pageTitle,
  actionType,
  alerts,
  editOrderId,
  showUnderlyingSec,
  netTitle,
  minValueOfData,
  coveredValue = 100,
  handleClose,
}) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [objectByStrike, setObjectByStrike] = useState<any>([]);
  const [strikesValues, setStrikesValue] = useState<any>([]);
  const balancesObj: any = useAppSelector(balancesData);
  const allStrategies: any = useAppSelector((state) => state.allStrategies.strategies);
  const selectedExpirationDate: any = useAppSelector(optionGreekChainsData);
  const valuesForTrade: any = useAppSelector(tradingData);
  const placeOrderDataResponse: any = useAppSelector(placeOrderData);
  const loading = useAppSelector(loadingOrderData);
  const optionStrategiSelectionDates: any = useAppSelector(optionStrategiSelectionData);
  const [selectedStrikes, setSelectedStrikes] = useState<any[]>([]);
  const [selectedExpirationDates, setSelectedExpirationDates] = useState<any[]>([]);
  const [selectedTradeValues, setSelectedTradeValues] = useState<any[]>([]);
  const [selectedPrice, setSelectedPrice] = useState<any>("");
  const [selectedStop, setSelectedStop] = useState<any>("");
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [errorMsg, setErrormsg] = useState([]);
  const [orderPlacedSuccessfully, setOrderPlacedSuccessfully] = useState(false);
  const [tradeDataMapValue, setTradeDataMap] = useState([{ last: 0 }]);
  const [showUnderlying, setShowUnderlying] = useState(false);
  const [buttonText, setButtonText] = useState("Add Underlying");
  const [estimateText, setEstimateText] = useState(
    netTitle === "Net Credit" ? "Estimated Credit:" : "Estimated Debit:"
  );
  const [orderError, setOrderError] = useState(null); // Initialize with null
  const [orderValue, setOrderValue] = useState(null); // Initialize with null
  const optionsClass = [
    { value: "option", label: "option" },
    { value: "multileg", label: "multileg" },
    { value: "combo", label: "combo" },
  ];
  const optionsMarketData = [
    { value: "market", label: "Market" },
    { value: "limit", label: "Limit" },
    { value: "stop", label: "Stop" },
    { value: "stop_limit", label: "Stop Limit" },
  ];

  const optionsTypeData = [
    { value: "market", label: "Market" },
    { value: "debit", label: "Debit" },
    { value: "credit", label: "Credit" },
    { value: "even", label: "Even" },
  ];

  const optionsDurationData = [
    { value: "day", label: "Day" },
    { value: "gtc", label: "GTC" },
    { value: "pre", label: "Pre" },
    { value: "post", label: "Post" },
  ];

  const optionsSymbols = [
    { value: "put", label: "Put" },
    { value: "call", label: "Call" },
  ];

  const optionsSides = [
    { value: "buy_to_open", label: "Buy to Open" },
    { value: "sell_to_open", label: "Sell to Open" },
    { value: "sell_to_close", label: "Sell to Close" },
    { value: "buy_to_close", label: "Buy to Close" },
  ];

  const optionsData = [
    { value: "buy", label: "Buy" },
    // { value: "buy_to_cover", label: "Buy To Cover" },
    { value: "sell", label: "Sell" },
    // { value: "sell_short", label: "Sell Short" },
  ];
  const [quantityOfCombo, setQuantityOfCombo] = useState<number>(showUnderlyingSec ? coveredValue : 0);
  const [averageBidValue, setAverageBidValue] = useState<number>(null);
  const [averageAskValue, setAverageAskValue] = useState<number>(null);
  const [averageMidValue, setAverageMidValue] = useState<number>(null);
  const [types, setTypes] = useState<any>("");
  const [selectedSides, setSelectedSides] = useState<any[]>(optionsSides.map((option) => option.value));
  const [selectedDurationtLable, setSelectedDurationtLable] = useState<string>(optionsDurationData[0].value);
  const [selectedMarketLable, setSelectedMarketLable] = useState<string>(optionsMarketData[0].value);
  const [selectedoptionsTypeData, setSelectedoptionsTypeData] = useState<string>(optionsTypeData[0].value);
  const [optionsDataLable, setoptionsDataLable] = useState<string>(optionsData[0].value);
  const [stockValue, setStockValue] = useState<number>(null);
  const [selectedClass, setSelectedClass] = useState<any>([]);
  const [finalEstimatedCost, setFinalEstimatedCost] = useState<number>(null);
  const [buyingPowerCost, setBuyingPowerCost] = useState<number>(null);

  useEffect(() => {
    if (objectByStrike?.length > 1 || (quantityOfCombo && showUnderlying)) {
      setSelectedoptionsTypeData(optionsTypeData[0].value);
      setSelectedMarketLable("");
    } else if (objectByStrike?.length === 1 || (!quantityOfCombo && !showUnderlying)) {
      setSelectedMarketLable(optionsMarketData[0].value);
      setSelectedoptionsTypeData("");
    }
  }, [objectByStrike?.length, showUnderlying, quantityOfCombo]);

  useEffect(() => {
    if (allStrategies) {
      const sizes = allStrategies?.legs?.map((item) => item?.size) || [];
      setQuantity(sizes);
    }
  }, [allStrategies]);
  const initialQuantity = new Array(objectByStrike && objectByStrike?.length).fill(1);
  // const sizes = allStrategies?.legs?.map((item) => item?.size) || [];
  const [quantity, setQuantity] = useState<any>(initialQuantity);
  const [oldQuantity, setOldQuantity] = useState<any>(initialQuantity);
  let orderDataClose = [];

  const updateAvailableAskBigMidSymbolStrike = async (_objectByStrike, fetchNewStrike = false) => {
    const strikeValueObject = { ...strikesValues };

    // Use map to create an array of promises
    const promises = _objectByStrike.map(async (legItem) => {
      const expiration = legItem?.expiration_date;
      const matchingExpiration = await getMatchingExpirationObject(expiration, _objectByStrike, fetchNewStrike);
      strikeValueObject[expiration] = getAvailableStrike(matchingExpiration);
      const calculatedAskMidBig = getBidMidAskObject(matchingExpiration, legItem);
      return { ...legItem, ...calculatedAskMidBig };
    });

    // Use Promise.all to execute all promises in parallel
    const updatedObjects = await Promise.all(promises);

    setObjectByStrike(updatedObjects);
    setStrikesValue(strikeValueObject);
  };

  const getRollOverDirection = (option_type, side) => {
    // if (option_type === "put") {
    if (side === "buy_to_close") {
      return 1;
    } else if (side === "buy_to_open") {
      return 1;
    } else if (side === "sell_to_close") {
      return -1;
    } else {
      return -1;
    }
    // } else {
    //   if (side === "buy_to_close") {
    //     return -1;
    //   } else if (side === "buy_to_open") {
    //     return -1;
    //   } else if (side === "sell_to_close") {
    //     return 1;
    //   } else {
    //     return 1;
    //   }
    // }
  };

  const getMatchingExpirationObject = async (expirationDate, _objectByStrike, fetchNewStrike = false) => {
    const matchingObject = selectedExpirationDate.find((item) => item.hasOwnProperty(expirationDate));
    let chainOfExpirationData = [];
    if (matchingObject && matchingObject[expirationDate] && !fetchNewStrike) {
      chainOfExpirationData = matchingObject[expirationDate] ?? [];
    } else {
      const res: any = await dispatch(
        fetchOptionGreekChains({
          searchKey: _objectByStrike[0]?.root_symbol || allStrategies?.ticker,
          expiration: expirationDate,
        })
      );
      chainOfExpirationData = res?.payload?.data;
    }
    return chainOfExpirationData;
  };

  const getAvailableStrike = (data) => {
    const strikes = data?.map?.((el) => el?.strike) || [];

    return strikes.reduce((accumulator, currentValue) => {
      if (!accumulator.includes(currentValue)) {
        accumulator.push(currentValue);
      }
      return accumulator;
    }, []);
  };

  const getBidMidAskObject = (data, currentItem) => {
    const optionWithMatchingStrike = data?.find(
      (option) => option.strike == currentItem.strike && option.option_type === currentItem.option_type
    );

    if (optionWithMatchingStrike === undefined) {
      return {
        strike: "Strike",
        mid: 0.0,
        bid: 0,
        ask: 0,
        symbol: optionWithMatchingStrike?.symbol,
      };
    } else {
      const calculateMidValue = (optionWithMatchingStrike?.ask + optionWithMatchingStrike?.bid) / 2;

      // Update the specific item in updatedAllItemsTmp with the new availableStrikes
      return {
        mid: calculateMidValue,
        bid: optionWithMatchingStrike?.bid,
        ask: optionWithMatchingStrike?.ask,
        symbol: optionWithMatchingStrike?.symbol,
      };
    }
  };
  useEffect(() => {
    if (pageTitle === "dashboard" && optionDashboardRows.length) {
      let tempOptionDashboardRows;
      const quantities = [];
      tempOptionDashboardRows = optionDashboardRows.map((item, index) => {
        let direction = item.quantity > 0 ? 1 : -1;
        const calculateMidValue = (item.ask + item.bid) / 2;
        let sideTypes;
        let sideTypesRollover = "";
        let dateCountTemp = null;
        let expirationDate = item?.expiration_date;
        let oldExpirationDate;
        quantities.push(Math.abs(item.quantity));
        if (actionType === "close") {
          sideTypes = (() => {
            if (direction === 1 && selectedSides[0] === "buy_to_open") {
              return "sell_to_close";
            } else if (direction === -1 && selectedSides[1] === "sell_to_open") {
              return "buy_to_close";
            } else if (direction === -1 && selectedSides[2] === "sell_to_close") {
              return "buy_to_close";
            } else if (direction === 1 && selectedSides[3] === "buy_to_close") {
              return "sell_to_close";
            }
            {
              return "";
            }
          })();
        } else if (actionType === "roll_over") {
          sideTypesRollover = (() => {
            if (direction === 1 && selectedSides[0] === "buy_to_open") {
              return "sell_to_close";
            } else if (direction === -1 && selectedSides[1] === "sell_to_open") {
              return "buy_to_close";
            } else if (direction === -1 && selectedSides[2] === "sell_to_close") {
              return "buy_to_close";
            } else if (direction === 1 && selectedSides[3] === "buy_to_close") {
              return "sell_to_close";
            }
            {
              return "";
            }
          })();
          sideTypes = (() => {
            if (direction === 1 && selectedSides[0] === "buy_to_open") {
              return "buy_to_open";
            } else if (direction === -1 && selectedSides[1] === "sell_to_open") {
              return "sell_to_open";
            } else if (direction === -1 && selectedSides[2] === "sell_to_close") {
              return "sell_to_close";
            } else if (direction === 1 && selectedSides[3] === "buy_to_close") {
              return "buy_to_close";
            }
            {
              return "";
            }
          })();
          optionStrategiSelectionDates?.date?.map((dateItem, indexDateItem) => {
            if (item.expiration_date === dateItem) {
              dateCountTemp = indexDateItem + 1;
            } else if (!item.expiration_date) {
              dateCountTemp = 1;
            }
            if (dateCountTemp === indexDateItem) {
              expirationDate = dateItem;
            }
          });
          oldExpirationDate = item.expiration_date;
        } else if (actionType === "editOrder") {
          sideTypes = item.side;
          expirationDate = item.expiration_date;
          direction = ["buy_to_open", "buy_to_close"].includes(item.side) ? 1 : -1;
        } else {
          sideTypes = (() => {
            if (direction === 1 && selectedSides[0] === "buy_to_open") {
              return "buy_to_open";
            } else if (direction === -1 && selectedSides[1] === "sell_to_open") {
              return "sell_to_open";
            } else if (direction === -1 && selectedSides[2] === "sell_to_close") {
              return "sell_to_close";
            } else if (direction === 1 && selectedSides[3] === "buy_to_close") {
              return "buy_to_close";
            }
            {
              return "";
            }
          })();
        }
        if (actionType) {
          return {
            ...item,
            direction,
            mid: calculateMidValue.toFixed(2),
            sides: sideTypes,
            sidesRollover: sideTypesRollover,
            expiration_date: expirationDate,
            old_symbol: item.symbol,
            old_option_symbol: item.symbol,
            old_optionType: item.optionType,
            old_expiration_date: oldExpirationDate,
            old_strike: item.strike,
            old_ask: item.ask,
            old_bid: item.bid,
            old_mid: calculateMidValue.toFixed(2),
            old_sides: sideTypes,
            old_option_type: item?.option_type,
            old_quantity: item?.quantity,
          };
        }
        return {
          ...item,
          direction,
          mid: calculateMidValue.toFixed(2),
          sides: sideTypes,
        };
      });
      if (tradeDataMap.length > 0 && actionType !== "roll_over") {
        setQuantityOfCombo(tradeDataMap[0].quantity);
      }
      setQuantity(quantities);
      setOldQuantity(quantities);
      updateAvailableAskBigMidSymbolStrike(tempOptionDashboardRows, true);
      setObjectByStrike(tempOptionDashboardRows);
      dispatch(fetchTradeData(tempOptionDashboardRows[0]?.ticker));

      dispatch(
        fetchOptionGreek({
          searchKey: tempOptionDashboardRows[0]?.ticker,
          expiration: tempOptionDashboardRows[0]?.expiration_date,
        })
      );
    }
  }, [optionDashboardRows, optionStrategiSelectionDates, actionType]);

  useEffect(() => {
    if (pageTitle === "dashboard" && optionDashboardRows.length) {
      dispatch(fetchOptionStrategySelection(optionDashboardRows[0]?.ticker));
    }
  }, [pageTitle, optionDashboardRows, dispatch]);

  const getSideType = (legItem) => {
    if (legItem.direction === 1 && selectedSides[0] === "buy_to_open") {
      return "buy_to_open";
    } else if (legItem.direction === -1 && selectedSides[1] === "sell_to_open") {
      return "sell_to_open";
    } else if (legItem.direction === -1 && selectedSides[2] === "sell_to_close") {
      return "sell_to_close";
    } else if (legItem.direction === 1 && selectedSides[3] === "buy_to_close") {
      return "buy_to_close";
    }
    {
      return "";
    }
  };
  useEffect(() => {
    if (allStrategies && allStrategies?.legs && pageTitle !== "dashboard") {
      const groupedObjectsByStrike = [];
      allStrategies?.legs.forEach((legItem) => {
        const getStrikes = legItem.strike;
        const directions = legItem.direction;
        const legExpirationDate = formatedDate(legItem.expiration);
        const getType = legItem.type === 0 ? "call" : legItem.type === 1 ? "put" : null;
        const sideTypes = getSideType(legItem);

        const expirationDate = formatedDate(legItem.expiration);
        const chainDataOfDate = selectedExpirationDate.find((item) => item.hasOwnProperty(expirationDate));

        const matchingObjects =
          chainDataOfDate &&
          chainDataOfDate[expirationDate]
            .filter((selectedItem) => {
              return selectedItem.strike === getStrikes && selectedItem.option_type === getType;
            })
            .map((matchedItem) => {
              const calculateMidValue = (matchedItem.ask + matchedItem.bid) / 2;
              return {
                ...matchedItem,
                sides: sideTypes,
                direction: directions,
                mid: calculateMidValue.toFixed(2),
                //expiration: legExpirationDate,
              };
            })
            .filter((el) => el.root_symbol === allStrategies?.ticker);
        if (matchingObjects) {
          groupedObjectsByStrike.push(...matchingObjects);
        } else {
          groupedObjectsByStrike.push({
            ...legItem,
            option_type: getType,
            sides: sideTypes,
            direction: directions,
            expiration_date: expirationDate,
          });
        }
        updateAvailableAskBigMidSymbolStrike(groupedObjectsByStrike);
        setObjectByStrike(groupedObjectsByStrike);
      });
    }
  }, [allStrategies]);

  useEffect(() => {
    const lowestStrikeObject = objectByStrike?.reduce((lowest, item) => {
      if (lowest === null || item?.strike < lowest?.strike) {
        return item;
      }
      return lowest;
    }, null);
    const bidValues = objectByStrike?.map((item, index) => {
      let minQuantity: any = Math?.min(...quantity);
      if (!isFinite(minQuantity) || isNaN(minQuantity) || quantity === undefined) {
        minQuantity = 1;
      }
      for (var i = 0; i < quantity.length; i++) {
        if (quantity[i] === "empty") {
          minQuantity = 0; // Treat 'empty' as 0
        } else if (!isNaN(parseFloat(quantity[i]))) {
          var currentQuantity = parseFloat(quantity[i]);
          minQuantity = Math.min(minQuantity, currentQuantity);
        }
      }
      let valueOfQuantity;

      if (objectByStrike?.length === 1) {
        valueOfQuantity = 1;
      } else if (objectByStrike?.length > 1) {
        valueOfQuantity = quantity[index] === undefined ? 1 / minQuantity : quantity[index] / minQuantity;
      } else if (!Number.isInteger(valueOfQuantity) && quantity[index] % minQuantity !== 0) {
        valueOfQuantity = quantity[index];
      } else if (!isFinite(valueOfQuantity) || isNaN(valueOfQuantity)) {
        valueOfQuantity = 1;
      }

      let value = 0;
      if (lowestStrikeObject?.sides === "buy_to_open" || lowestStrikeObject?.sides === "buy_to_close") {
        if (item?.sides === "buy_to_open" || item?.sides === "buy_to_close") {
          value = item?.bid * Number(valueOfQuantity) * item?.direction;
        } else if (item?.sides === "sell_to_open" || item?.sides === "sell_to_close") {
          value = item?.ask * Number(valueOfQuantity) * item?.direction;
        }
      } else if (lowestStrikeObject?.sides === "sell_to_open" || lowestStrikeObject?.sides === "sell_to_close") {
        if (item?.sides === "buy_to_open" || item?.sides === "buy_to_close") {
          value = item?.ask * Number(valueOfQuantity) * item?.direction;
        } else if (item?.sides === "sell_to_open" || item?.sides === "sell_to_close") {
          value = item?.bid * Number(valueOfQuantity) * item?.direction;
        }
      }
      return value;
    });

    const askValues = objectByStrike?.map((item, index) => {
      // const quantityCost = quantity[index] === undefined ? 1 : quantity[index];
      let minQuantity: any = Math?.min(...quantity);
      if (!isFinite(minQuantity) || isNaN(minQuantity)) {
        minQuantity = 1;
      }
      let valueOfQuantityAsk;

      if (objectByStrike?.length === 1) {
        valueOfQuantityAsk = 1;
      } else if (objectByStrike?.length > 1) {
        valueOfQuantityAsk = quantity[index] === undefined ? 1 / minQuantity : quantity[index] / minQuantity;
      } else if (!Number.isInteger(valueOfQuantityAsk) && quantity[index] % minQuantity !== 0) {
        valueOfQuantityAsk = quantity[index];
      } else if (!isFinite(valueOfQuantityAsk) || isNaN(valueOfQuantityAsk)) {
        valueOfQuantityAsk = 1;
      }

      let value = 0;
      if (lowestStrikeObject?.sides === "buy_to_open" || lowestStrikeObject?.sides === "buy_to_close") {
        if (item?.sides === "buy_to_open" || item?.sides === "buy_to_close") {
          value = item?.ask * Number(valueOfQuantityAsk) * item?.direction;
        } else if (item?.sides === "sell_to_open" || item?.sides === "sell_to_close") {
          value = item?.bid * Number(valueOfQuantityAsk) * item?.direction;
        }
      } else if (lowestStrikeObject?.sides === "sell_to_open" || lowestStrikeObject?.sides === "sell_to_close") {
        if (item?.sides === "buy_to_open" || item?.sides === "buy_to_close") {
          value = item?.bid * Number(valueOfQuantityAsk) * item?.direction;
        } else if (item?.sides === "sell_to_open" || item?.sides === "sell_to_close") {
          value = item?.ask * Number(valueOfQuantityAsk) * item?.direction;
        }
      }
      return value;
    });
    const bidValueCalc = bidValues;
    const askValueCalc = askValues;
    let bidTotal: any = bidValueCalc?.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    let askTotal: any = askValueCalc?.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

    let considerStockPrice =
      pageTitle === "dashboard" ? Number(lastValue) : tradeDataMap[0]?.last === 0 ? 0 : tradeDataMap[0]?.last;
    let bidValForUnderlying: any = Number(bidTotal) + (considerStockPrice / 100) * quantityOfCombo;
    let askValForUnderlying: any = Number(askTotal) + (considerStockPrice / 100) * quantityOfCombo;

    const midValueCalc: any = (Number(bidTotal) + Number(askTotal)) / 2;
    let midValForUnderlying: any = Number(midValueCalc) + (considerStockPrice / 100) * quantityOfCombo;

    // Calculation of MidValue
    if (actionType === "roll_over" && pageTitle === "dashboard") {
      // Find existing mid val
      const existingMidVal = objectByStrike?.map((i) => parseFloat(i?.old_mid));
      const existingBidVal = objectByStrike?.map((i) => parseFloat(i?.old_bid));
      const existingAskVal = objectByStrike?.map((i) => parseFloat(i?.old_ask));
      // const existingDirection = objectByStrike?.map((i) => i?.old_quantity >= 1 ? 1 : -1);
      const existingDirection = objectByStrike?.map((i) => getRollOverDirection(i.old_option_type, i.sidesRollover));
      const existingMidSum: Number = existingMidVal
        ?.map((val1, index) => Math.abs(val1) * existingDirection[index])
        ?.reduce((acc, current) => acc + current, 0);
      const existingBidSum: Number = existingBidVal
        ?.map((val1, index) => Math.abs(val1) * existingDirection[index])
        ?.reduce((acc, current) => acc + current, 0);
      const existingAskSum: Number = existingAskVal
        ?.map((val1, index) => Math.abs(val1) * existingDirection[index])
        ?.reduce((acc, current) => acc + current, 0);
      const quantityDirectionLeg = objectByStrike?.map((i) => {
        return getRollOverDirection(i.option_type, i.sides);
      });
      const rowMidVal = objectByStrike?.map((i) => i?.mid);
      const rowMidSum: Number = quantityDirectionLeg
        ?.map((val1, index) => val1 * Math.abs(rowMidVal[index]))
        ?.reduce((acc, current) => acc + current, 0);
      const midDiffVal: any = quantityOfCombo
        ? Number(existingMidSum) + Number(rowMidSum) + (lastValue / 100) * quantityOfCombo
        : Number(existingMidSum) + Number(rowMidSum);

      const rowBidVal = objectByStrike?.map((i) => i?.bid);
      const rowBidSum: Number = quantityDirectionLeg
        ?.map((val1, index) => val1 * Math.abs(rowBidVal[index]))
        ?.reduce((acc, current) => acc + current, 0);
      let bidDiffVal: any = quantityOfCombo
        ? Number(existingMidSum) + Number(rowBidSum) + (lastValue / 100) * quantityOfCombo
        : Number(existingMidSum) + Number(rowBidSum);

      const rowAskVal = objectByStrike?.map((i) => i?.ask);
      const rowAskSum: Number = quantityDirectionLeg
        ?.map((val1, index) => val1 * Math.abs(rowAskVal[index]))
        ?.reduce((acc, current) => acc + current, 0);
      let askDiffVal: any = quantityOfCombo
        ? Number(existingMidSum) + Number(rowAskSum) + (lastValue / 100) * quantityOfCombo
        : Number(existingMidSum) + Number(rowAskSum);

      if (bidDiffVal > 0 && askDiffVal > 0) {
        parseFloat(bidDiffVal);
        parseFloat(askDiffVal);
      } else if (parseFloat(bidDiffVal) < 0 && parseFloat(askDiffVal) < 0) {
        if (Math.abs(bidDiffVal) > Math.abs(askDiffVal)) {
          [bidDiffVal, askDiffVal] = [askDiffVal, bidDiffVal];
        }
      } else if (parseFloat(bidDiffVal) < 0 && parseFloat(askDiffVal) > 0) {
        if (Math.abs(parseFloat(bidDiffVal)) > parseFloat(askDiffVal)) {
          [bidDiffVal, askDiffVal] = [askDiffVal, bidDiffVal];
        }
      }
      setAverageMidValue(midDiffVal?.toFixed(2));
      setAverageBidValue(bidDiffVal?.toFixed(2));
      setAverageAskValue(askDiffVal?.toFixed(2));
    } else {
      if (bidTotal > 0 && askTotal > 0) {
        parseFloat(bidTotal);
        parseFloat(askTotal);
      } else if (parseFloat(bidTotal) < 0 && parseFloat(askTotal) < 0) {
        // Math.abs(bidTotal);
        // Math.abs(askTotal);
        if (Math.abs(bidTotal) > Math.abs(askTotal)) {
          // Swap bidTotal and askTotal directly
          [bidTotal, askTotal] = [askTotal, bidTotal];
        }
      } else if (parseFloat(bidTotal) < 0 && parseFloat(askTotal) > 0) {
        if (Math.abs(parseFloat(bidTotal)) > parseFloat(askTotal)) {
          // Swap bidTotal and askTotal directly
          [bidTotal, askTotal] = [askTotal, bidTotal];
        }
      }
      if (quantityOfCombo) {
        setAverageMidValue(midValForUnderlying?.toFixed(2));
        setAverageBidValue(bidValForUnderlying?.toFixed(2));
        setAverageAskValue(askValForUnderlying?.toFixed(2));
      } else {
        setAverageMidValue(midValueCalc?.toFixed(2));
        setAverageBidValue(bidTotal?.toFixed(2));
        setAverageAskValue(askTotal?.toFixed(2));
      }
    }
    // setFinalValue(midValueCalc * -1);
  }, [
    objectByStrike,
    quantity,
    oldQuantity,
    actionType,
    quantityOfCombo,
    pageTitle,
    tradeDataMap,
    averageAskValue,
    averageBidValue,
    averageMidValue,
  ]);

  useEffect(() => {
    if (allStrategies && allStrategies.legs && objectByStrike) {
      const allStrikeValues = allStrategies.legs.map((legItem) => legItem.strike);

      const missingStrikes = allStrikeValues.filter((strike) => {
        return !objectByStrike.some((item) => item.strike === strike);
      });
      if (tradeDataMap[0]?.last === missingStrikes[0]) {
        setStockValue(missingStrikes);
      }
    }
  }, [allStrategies, objectByStrike, tradeDataMap]);

  const handleStrikeChange = (value, index) => {
    const updatedStrikes = [...selectedStrikes];
    const _objectByStrike = [...objectByStrike];

    updatedStrikes[index] = value;
    setSelectedStrikes(updatedStrikes);

    // _objectByStrike[index]['strike'] = Number(value);
    const expiration_date = _objectByStrike[index].expiration_date;
    const matchingObject = selectedExpirationDate.find((item) => item.hasOwnProperty(expiration_date));

    const updatedMidBigAsk = getBidMidAskObject(matchingObject && matchingObject[expiration_date], {
      ..._objectByStrike[index],
      strike: Number(value),
    });

    _objectByStrike[index] = {
      ..._objectByStrike[index],
      ...updatedMidBigAsk,
      strike: Number(value),
    };
    setObjectByStrike(_objectByStrike);
  };

  const handleExpirationDateChange = (value, index) => {
    const updatedExpirationDate = [...selectedExpirationDates];
    const _objectByStrike = [...objectByStrike];

    updatedExpirationDate[index] = value;
    _objectByStrike[index]["expiration_date"] = value;
    setObjectByStrike(_objectByStrike);

    updateAvailableAskBigMidSymbolStrike(_objectByStrike);

    setSelectedExpirationDates(updatedExpirationDate);
    if (pageTitle === "dashboard") {
      dispatch(
        fetchOptionGreek({
          searchKey: objectByStrike[0]?.ticker,
          expiration: value,
        })
      );
    }
  };

  const handleTradeValueChange = (value, index) => {
    const updatedTradeValues = [...selectedTradeValues];
    updatedTradeValues[index] = value;
    setSelectedTradeValues(updatedTradeValues);
  };

  const handleQuantityValueChange = (value, index) => {
    const updatedQuantityValues = [...quantity];
    updatedQuantityValues[index] = value;
    setQuantity(updatedQuantityValues);
  };

  const handleOldQuantityValueChange = (value, index) => {
    const updatedQuantityValues = [...oldQuantity];
    updatedQuantityValues[index] = value;
    setOldQuantity(updatedQuantityValues);
  };

  const handleSetTypes = (value, index) => {
    const updatedQuantityValues = [...types];
    const _objectByStrike = [...objectByStrike];
    updatedQuantityValues[index] = value;
    setTypes(updatedQuantityValues);

    // _objectByStrike[index]['option_type'] = value;
    const expiration_date = _objectByStrike[index].expiration_date;
    const matchingObject = selectedExpirationDate.find((item) => item.hasOwnProperty(expiration_date));

    const updatedMidBigAsk = getBidMidAskObject(matchingObject[expiration_date], {
      ..._objectByStrike[index],
      option_type: value,
    });
    _objectByStrike[index] = {
      ..._objectByStrike[index],
      ...updatedMidBigAsk,
      option_type: value,
    };
    setObjectByStrike(_objectByStrike);
  };

  const handleSelectDuration = (event) => {
    setSelectedDurationtLable(event.target.value);
  };

  const handleSelectMarket = (event) => {
    setSelectedMarketLable(event.target.value);
  };

  const handleSelectSides = (value: any, index) => {
    const directions = (() => {
      if (value === "buy_to_open" || value === "buy_to_close") {
        return 1;
      } else if (value === "sell_to_open" || value === "sell_to_close") {
        return -1;
      } else {
        return 0;
      }
    })();

    setObjectByStrike((prev) => [
      ...prev.slice(0, index),
      {
        ...prev[index],
        sides: value,
        direction: directions,
      },
      ...prev.slice(index + 1, prev.length),
    ]);
  };

  const handleClick = (index: number) => {
    const updatedItems = [...objectByStrike];
    updatedItems.splice(index, 1);
    if (pageTitle === "dashboard") {
      const tempQuantity = [...quantity];
      tempQuantity.splice(index, 1);
      setQuantity(tempQuantity);
    }
    setObjectByStrike(updatedItems);
  };

  useEffect(() => {
    const getClass = optionsClass.map((item) => {
      return item.value;
    });
    setSelectedClass(getClass);
  }, []);

  let orderData: any = {};
  if (
    selectedClass[1] === "multileg" &&
    (quantityOfCombo === 0 || quantityOfCombo === null) &&
    objectByStrike?.length > 1
  ) {
    orderData = {
      classType: "multileg",
      type: selectedoptionsTypeData,
      duration: selectedDurationtLable,
      account_id: balancesObj.selectedAccountId,
      symbol: objectByStrike[0]?.root_symbol,
      price: selectedPrice,
      stop: selectedStop,
      quantity: quantity,
      orders: objectByStrike.map((item, index) => {
        return {
          quantity: quantity[index] === undefined ? [1] : quantity[index],
          option_symbol: item?.symbol,
          side: item?.sides,
        };
      }),
    };
  } else if (selectedClass[2] === "combo" && quantityOfCombo > 0 && objectByStrike?.length <= 2) {
    orderData = {
      classType: "combo",
      type: selectedoptionsTypeData,
      duration: selectedDurationtLable,
      account_id: balancesObj.selectedAccountId,
      symbol: objectByStrike[0]?.root_symbol,
      price: selectedPrice,
      stop: selectedStop,
      side: optionsDataLable,
      quantity: quantityOfCombo,
      orders: objectByStrike.map((item, index) => {
        return {
          quantity: quantity[index] === undefined ? [1] : quantity[index],
          option_symbol: item?.symbol,
          side: item?.sides,
        };
      }),
    };
  } else if (quantityOfCombo === 0 || quantityOfCombo === null) {
    orderData = {
      classType: "option",
      type: selectedMarketLable,
      duration: selectedDurationtLable,
      account_id: balancesObj.selectedAccountId,
      symbol: objectByStrike[0]?.root_symbol,
      price: selectedPrice,
      stop: selectedStop,
      side: objectByStrike[0]?.sides,
      quantity: quantity[0],
      option_symbol: objectByStrike[0]?.symbol,
    };
  }
  const handleSellBuy = () => {
    const token = typeof window !== "undefined" && localStorage.getItem("accessToken");
    console.log(token, "login Token");
    if (token) {
      if (editOrderId) {
        orderData.id = editOrderId;
        dispatch(editPlaceOrder(orderData)).then((response) => {
          handleResponse(response);
        });

        return;
      }

      if (actionType === "roll_over") {
        const orderCloseUpdatedSideTypes = objectByStrike.map((item, index) => {
          return {
            quantity: oldQuantity[index] === undefined ? [1] : Number(oldQuantity[index]),
            option_symbol: item.old_option_symbol,
            side: item.sidesRollover,
          };
        });
        const orderDataClose =
          orderCloseUpdatedSideTypes.length === 1
            ? {
                ...orderData,
                classType: "option",
                ...orderCloseUpdatedSideTypes[0],
              }
            : {
                ...orderData,
                classType: "multileg",
                orders: orderCloseUpdatedSideTypes,
              };
        let togetherOrderArray;
        if (orderData.orders) {
          togetherOrderArray = [...orderData.orders, ...orderDataClose.orders];
        } else {
          togetherOrderArray = [
            {
              side: objectByStrike[0]?.sides,
              quantity: Math.abs(quantity[0]),
              option_symbol: objectByStrike[0]?.symbol,
            },
            ...orderCloseUpdatedSideTypes,
          ];
        }
        if (togetherOrderArray.length > 4) {
          dispatch(fetchPlaceOrder(orderData)).then((response) => {
            handleResponse(response);
            dispatch(fetchPlaceOrder(orderDataClose))
              .unwrap()
              .then((response) => {
                handleResponse(response);
              });
          });
        } else {
          orderData = {
            ...orderData,
            classType: "multileg",
            quantity: [...oldQuantity, ...quantity].length,
            orders: togetherOrderArray,
          };
          dispatch(fetchPlaceOrder(orderData))
            .unwrap()
            .then((response) => {
              handleResponse(response);
            });
        }
      } else {
        dispatch(fetchPlaceOrder(orderData))
          .unwrap()
          .then((response) => {
            handleResponse(response);
          });
      }
    } else {
      handleClose();
      router.push("/login");
    }
  };

  const SuccessSound = new Howl({
    src: ["../assets/sound/success.mp3"],
    volume: 1.0,
  });

  const handleResponse = (res) => {
    const placeOrderDataResponse = res?.data;

    if (res?.response?.status >= 400 || (placeOrderDataResponse && placeOrderDataResponse?.errors?.error.length > 0)) {
      let errorMessage;
      if (placeOrderDataResponse && placeOrderDataResponse?.errors?.error.length > 0) {
        errorMessage = placeOrderDataResponse?.errors?.error.map((error) => {
          return error;
        });
        errorMessage = errorMessage.length > 0 ? errorMessage.join(" ") : "-";
      } else {
        errorMessage = res?.response.data;
      }

      setErrormsg(errorMessage);
      setUpdateSuccess(true);
      ErrorSound.play();
    } else if (res.error) {
      setErrormsg(res.error.message);
      setUpdateSuccess(true);
      ErrorSound.play();
    } else {
      setOrderPlacedSuccessfully(true);
      SuccessSound.play();
      setTimeout(() => {
        handleClose();
        router.push("/dashboard");
      }, 1000);
    }
  };

  const ErrorSound = new Howl({
    src: ["../assets/sound/error.mp3"],
    volume: 1.0,
  });

  let lastValue = null;
  let stockTikcer = "";
  let stockPriceOnDashBoard = null;
  if (pageTitle === "dashboard") {
    // Find the object with the matching symbol
    const symbolToFind = optionDashboardRows[0]?.ticker;
    const foundObject = valuesForTrade.find((item) => item.symbol === symbolToFind);

    // Extract the last value if the object was found
    lastValue = foundObject ? foundObject.last : null;
    stockTikcer = foundObject ? foundObject.symbol : "";
    // stockPriceOnDashBoard = foundObject ? foundObject.prevclose : null;
  }
  useEffect(() => {
    const symbolValueArray = objectByStrike.map((i) => i?.symbol);
    const valueOfSymbol = objectByStrike[0]?.root_symbol;
    const symbolArray = [valueOfSymbol, ...symbolValueArray];
    const accountIDVal = balancesObj.selectedAccountId;

    const intervalId = setInterval(() => {
      dispatch(fetchQuotesData(symbolArray)).then((response) => {
        if (response) {
          const uniqueDataArray = response?.payload;
          // Map mid, bid, and ask values from uniqueDataArray and update objectByStrike
          const updatedItems = objectByStrike?.map((item) => {
            if (item?.strike === "Strike") {
              return item;
            }
            if (Array.isArray(uniqueDataArray)) {
              const matchingItem = uniqueDataArray?.find((uniqueItem) => {
                return (
                  item?.expiration_date === uniqueItem?.expiration_date &&
                  item?.option_type === uniqueItem?.option_type &&
                  item?.strike === uniqueItem?.strike
                );
              });

              if (matchingItem) {
                return {
                  ...item,
                  mid: (matchingItem?.bid + matchingItem?.ask) / 2,
                  bid: matchingItem?.bid,
                  ask: matchingItem?.ask,
                };
              } else {
                return item;
              }
            } else if (typeof response?.payload === "object") {
              // Handle the case where payload is a single object
              const uniqueDataArrayNew = [response.payload];
              const matchingItem = uniqueDataArrayNew?.find((uniqueItem) => {
                return (
                  item?.expiration_date === uniqueItem?.expiration_date &&
                  item?.option_type === uniqueItem?.option_type &&
                  item?.strike === uniqueItem?.strike
                );
              });

              if (matchingItem) {
                return {
                  ...item,
                  mid: (matchingItem?.bid + matchingItem?.ask) / 2,
                  bid: matchingItem?.bid,
                  ask: matchingItem?.ask,
                };
              } else {
                return item;
              }
            } else {
              console.error("uniqueDataArray is not an array or object");
            }
          });
          setObjectByStrike(updatedItems);
        }
      });
      dispatch(fetchBalanceDetails(accountIDVal));
    }, 2000); // 2000 milliseconds = 2 seconds
    return () => {
      clearInterval(intervalId);
    };
  }, [objectByStrike, dispatch]);

  useEffect(() => {
    const totalEstimatedCost = averageMidValue * 100;
    let finalCost = 0;
    let stockPriceVal = pageTitle === "dashboard" ? lastValue * quantityOfCombo : tradeDataMapValue[0]?.last;
    let quantityValCheck = quantityOfCombo;

    if (
      // selectedMarketLable === "market" ||
      selectedoptionsTypeData === "market" ||
      selectedoptionsTypeData === "even"
    ) {
      if (objectByStrike?.length >= 2 && buttonText === "Add Underlying") {
        // If objectByStrike.length is greater than 2, calculate midCost * 100
        finalCost = averageMidValue * 100;
      } else if (!quantityOfCombo) {
        // If quantityCombo is not set, calculate estimated cost as averageMidValue * 100
        finalCost = averageMidValue * 100;
      } else if (quantityOfCombo) {
        finalCost = averageMidValue * 100;
      }
      // else if (quantityOfCombo) {
      //   if (averageMidValue < 0 || buttonText === "Remove Underlying") {
      //     finalCost = -stockPriceVal - totalEstimatedCost * quantityValCheck;
      //   } else if (averageMidValue > 0 || buttonText === "Remove Underlying") {
      //     finalCost = stockPriceVal + totalEstimatedCost * quantityValCheck;
      //   }
      // }
      const estimatedCostTextNq = averageMidValue < 0 ? "Estimated Credit:" : "Estimated Debit:";
      setEstimateText(estimatedCostTextNq);
    } else if (objectByStrike?.length > 1 && !quantityOfCombo && selectedoptionsTypeData === "debit") {
      finalCost = selectedPrice * 100;
      setEstimateText("Estimated Debit:");
    } else if (objectByStrike?.length > 1 && !quantityOfCombo && selectedoptionsTypeData === "credit") {
      finalCost = selectedPrice * 100;
      setEstimateText("Estimated Credit:");
    } else if (
      objectByStrike?.length >= 1 &&
      quantityOfCombo &&
      showUnderlying &&
      selectedoptionsTypeData === "debit"
    ) {
      if (buttonText === "Remove Underlying") {
        finalCost = stockPriceVal + selectedPrice * 100;
      }
      setEstimateText("Estimated Debit:");
    } else if (
      objectByStrike?.length >= 1 &&
      quantityOfCombo &&
      showUnderlying &&
      selectedoptionsTypeData === "credit"
    ) {
      if (buttonText === "Remove Underlying") {
        finalCost = stockPriceVal - selectedPrice * 100;
      }
      setEstimateText("Estimated Credit:");
    } else if (selectedMarketLable === "limit" && buttonText === "Add Underlying") {
      finalCost = selectedPrice * 100 * quantity?.length === 0 ? 1 : quantity[0];
      const estimatedCostTextNquote = averageMidValue < 0 ? "Estimated Credit:" : "Estimated Debit:";
      setEstimateText(estimatedCostTextNquote);
    } else if (selectedMarketLable === "stop_limit" && buttonText === "Add Underlying") {
      finalCost = selectedPrice * 100 * quantity?.length === 0 ? 1 : quantity[0];
      const estimatedCostTextNquotes = averageMidValue < 0 ? "Estimated Credit:" : "Estimated Debit:";
      setEstimateText(estimatedCostTextNquotes);
    } else if (selectedMarketLable === "stop" && buttonText === "Add Underlying") {
      finalCost = selectedStop * 100 * quantity?.length === 0 ? 1 : quantity[0];
      const estimatedCostTextNquotesVal = averageMidValue < 0 ? "Estimated Credit:" : "Estimated Debit:";
      setEstimateText(estimatedCostTextNquotesVal);
    } else if (selectedMarketLable === "market" && buttonText === "Add Underlying") {
      const considerQuantity = quantity?.length === 0 ? 1 : quantity[0];
      finalCost = averageMidValue * 100 * considerQuantity;
      const estimatedCostTextNquotesVal = averageMidValue < 0 ? "Estimated Credit:" : "Estimated Debit:";
      setEstimateText(estimatedCostTextNquotesVal);
    } else if (objectByStrike?.length === 1 && buttonText === "Add Underlying") {
      const considerQuantity = quantity?.length === 0 ? 1 : quantity[0];
      finalCost = averageMidValue * 100 * considerQuantity;
      const estimatedCostTextNquotesVal = averageMidValue < 0 ? "Estimated Credit:" : "Estimated Debit:";
      setEstimateText(estimatedCostTextNquotesVal);
    }

    // setFinalValue(finalCost * -1);
    finalCost = finalCost < 0 ? Math.abs(finalCost) : finalCost;
    setFinalEstimatedCost(finalCost);
    if (tradeDataMapValue[0]?.last === 0) {
      const values = quantityOfCombo * tradeDataMap[0]?.last;
      setTradeDataMap([{ last: values }]);
    }
  }, [
    averageMidValue,
    quantityOfCombo,
    tradeDataMapValue,
    selectedMarketLable,
    selectedoptionsTypeData,
    selectedPrice,
    selectedStop,
    quantity,
    buttonText,
    // averageAskValue,
  ]);
  const calculateStockPrice = (quantity, tradeData) => {
    const quantityValue = parseFloat(quantity);
    const stockPrice: any = pageTitle === "dashboard" ? lastValue : tradeDataMap[0]?.last;
    if (isNaN(quantityValue) || quantityValue === null) {
      return 0; // Display initial stock price when quantityValue is 0 or null
    } else if (!isNaN(stockPrice)) {
      return quantityValue * stockPrice; // Update price based on quantity when quantityValue is valid
    } else {
      return 0; // Handle other cases
    }
  };

  const handleQuantityComboValueChange = (newValue) => {
    const newValueAsNumber = parseFloat(newValue); // Parse the input as a number
    setQuantityOfCombo(newValueAsNumber);

    const newStockPrice = calculateStockPrice(newValueAsNumber, tradeDataMapValue[0]);
    setTradeDataMap([{ last: newStockPrice }]);
  };
  function isObjectEmpty(obj) {
    return Object?.keys(obj)?.length === 0;
  }
  function checkObjectsInArray(arr) {
    return arr?.map((obj) => isObjectEmpty(obj));
  }
  const isEmptyArray = checkObjectsInArray(objectByStrike);

  useEffect(() => {
    if (showUnderlyingSec) {
      setButtonText("Remove Underlying");
      setShowUnderlying(true);
    } else {
      setButtonText("Add Underlying");
      setShowUnderlying(false);
    }
  }, [showUnderlyingSec]);

  useEffect(() => {
    if (objectByStrike?.length > 2) {
      // If objectByStrike.length is greater than 2, disable the button, change buttonText to "Add Underlying," and hide the underlying section
      setButtonText("Add Underlying");
      setShowUnderlying(false);
      setQuantityOfCombo(null);
    }
  }, [objectByStrike]);
  useEffect(() => {
    if (objectByStrike?.length === 1 && buttonText === "Add Underlying") {
      const considerQuantity = quantity?.length === 0 ? 1 : quantity[0];
      const values = Math.abs(averageMidValue * 100 * considerQuantity);
      setFinalEstimatedCost(values);
    }
    if (objectByStrike?.length === 2 && buttonText === "Add Underlying") {
      const newValues = Math.abs(averageMidValue * 100);
      setFinalEstimatedCost(newValues);
    }
  }, [objectByStrike?.length, buttonText, quantity, averageMidValue]);

  const toggleUnderlying = () => {
    if (buttonText === "Remove Underlying") {
      setQuantityOfCombo(null); // Set quantityCombo to null
      setSelectedMarketLable("market");
    }
    setShowUnderlying(!showUnderlying);
    setButtonText(showUnderlying ? "Add Underlying" : "Remove Underlying");
  };
  const stockQuantity = useMemo(() => {
    return quantity.reduce((a, b) => Math.abs(+a) + Math.abs(+b), 0);
  }, [quantity, objectByStrike]);

  const calcCommission = useMemo(async () => {
    if (isNaN(stockQuantity) && !stockQuantity) return;
    if (actionType === "roll_over") {
      const orderCloseUpdatedSideTypes = objectByStrike.map((item, index) => {
        return {
          quantity: oldQuantity[index] === undefined ? [1] : Number(oldQuantity[index]),
          option_symbol: item.old_option_symbol,
          side: item.sidesRollover,
        };
      });
      const orderDataClose =
        orderCloseUpdatedSideTypes.length === 1
          ? {
              ...orderData,
              classType: "option",
              ...orderCloseUpdatedSideTypes[0],
            }
          : {
              ...orderData,
              classType: "multileg",
              orders: orderCloseUpdatedSideTypes,
            };

      let togetherOrderArray = [];
      if (orderData.orders) {
        togetherOrderArray = [...orderData.orders, ...orderDataClose.orders];
      } else {
        togetherOrderArray = [
          {
            side: objectByStrike[0]?.sides,
            quantity: Math.abs(quantity[0]),
            option_symbol: objectByStrike[0]?.symbol,
          },
          ...orderCloseUpdatedSideTypes,
        ];
      }
      const data =
        togetherOrderArray.length > 4
          ? [orderData, orderDataClose]
          : [
              {
                ...orderData,
                classType: togetherOrderArray.filter((el) => el.side).length == 1 ? "option" : "multileg",
                quantity: [...oldQuantity, ...quantity].length,
                orders: togetherOrderArray.filter((el) => el.side),
              },
            ];
      const dispatchedData = data?.map(async (order) => {
        const result = await dispatch(fetchPlaceOrder({ ...order, preview: true }));
        return result;
      });

      Promise.all(dispatchedData)
        .then((res: any) => {
          let reducedOrderValues = { cost: 0, order_cost: 0, commission: 0 };
          let errors = "";
          res.forEach((a) => {
            if (a?.payload?.data?.errors?.error) {
              errors += (a?.payload?.data?.errors?.error || "") + " ";
            } else {
              const { cost = 0, order_cost = 0, commission = 0 } = a?.payload?.data?.order || {};
              reducedOrderValues = {
                cost: reducedOrderValues.cost + cost,
                order_cost: reducedOrderValues.order_cost + order_cost,
                commission: reducedOrderValues.commission + commission,
              };
            }
          });
          if (errors) {
            setOrderError(errors);
            setOrderValue(null);
          } else {
            setOrderValue?.(reducedOrderValues);
            setOrderError("");
          }
        })
        .catch((error) => {});
    } else {
      dispatch(fetchPlaceOrder({ ...orderData, preview: true }))
        .then((res: any) => {
          if (res?.payload?.data?.order) {
            const orderValue = res?.payload?.data?.order;
            if (orderValue) {
              setOrderError(null);
              setOrderValue(orderValue);
            }
          } else if (res.payload.data.errors.error) {
            setOrderError(res.payload.data.errors.error);
          }
        })
        .catch((error) => {});
    }
  }, [stockQuantity, objectByStrike]);

  let getData;
  const selectedOptionData: any = objectByStrike?.map((option, index) => {
    const legTypeVal = option?.option_type === "call" ? 0 : 1;
    const optionTypeVal = option?.option_type;
    const direction = (() => {
      if (option.sides === "buy_to_open" || option.sides === "buy_to_close") {
        return 1;
      } else if (option.sides === "sell_to_open" || option.sides === "sell_to_close") {
        return -1;
      } else {
        return 0;
      }
    })();
    const strike = option?.strike;
    const expirationDate = option?.expiration_date;
    const expirationDateUTC = new Date(expirationDate);
    expirationDateUTC.setHours(16, 0, 0, 0);
    const volatility = Number(option?.greeks?.mid_iv) * 100;
    const ask = option?.ask || 0;
    const bid = option?.bid || 0;
    const purchasePrice = Number(ask + bid) / 2;
    const type = option?.option_type;
    const symbol = option?.symbol;

    return {
      y: index, // Use the index as the 'y' property
      strike,
      size: 1, // Adjust the size as needed
      purchasePrice,
      direction,
      type: legTypeVal, // You can adjust this based on your needs
      expiration: expirationDateUTC,
      symbol: symbol, // Provide the appropriate symbol
      volatility,
      range: 1, // Adjust the range as needed
      indexOfStrikePrice: 1, // Adjust this as needed
      index,
    };
  });

  // const legs = selectedOptionData?.map((legData) => {
  //   return { ...legData }; // Create a copy of legData
  // });
  const legs = selectedOptionData
    ?.map((legData) => {
      const hasType2 = allStrategies?.legs?.some((leg) => leg.type === 2);
      const a = allStrategies?.legs?.find((leg) => leg.type === 2);
      if (hasType2 && a.type === 2 && showUnderlyingSec) {
        // Include both legData and the object with type 2
        return [{ ...legData }, { ...a }];
      } else if (buttonText !== "Remove Underlying") {
        // Include only legData
        return { ...legData };
      } else {
        // Include only legData
        return { ...legData };
      }
    })
    ?.flat();

  const tradeDataStock = tradeDataMap[0]?.last;
  for (let i = 0; i < selectedOptionData?.length; i++) {
    const legTypeVal = selectedOptionData[i]?.legTypeVal;
    const optionTypeVal = selectedOptionData[i]?.optionTypeVal;
    const direction = selectedOptionData[i]?.direction;
    const strikeValue = selectedOptionData[i]?.strike;
    const expirationDateUTCValue = selectedOptionData[i]?.expirationDateUTC;
    const volatilityValue = selectedOptionData[i]?.volatility;
    const purchasePriceValue = selectedOptionData[i]?.purchasePrice;
    const symbol = selectedOptionData[i].symbol;
    getData = options(
      tradeDataStock,
      legTypeVal,
      optionTypeVal,
      direction,
      "custom",
      strikeValue,
      expirationDateUTCValue,
      volatilityValue,
      purchasePriceValue,
      symbol,
      legs
    );
  }
  let summary = new SummaryHelper(getData);
  const getValues = summary?.getMinMaxProfit();
  const netValue = summary.calculateNetValue();
  const minValue: any = getValues?.min;

  useEffect(() => {
    if (selectedoptionsTypeData === "debit") {
      let finalBPForDebit: any = addDollarSignCommasToNumber(finalEstimatedCost);
      setBuyingPowerCost(finalBPForDebit);
    } else if (selectedoptionsTypeData === "credit") {
      // let number = parseFloat(minValue.replace(/,/g, ""));
      // let netValueCalc = Math.abs(netValue?.value);
      // let bpCalc = netValueCalc + Math.abs(number) - selectedPrice * 100;
      // // let bpCalc = midCost - selectedPrice * 100 + number;
      // let finalVal: any = "$" + Math.abs(bpCalc);
      let finalVal: any = addDollarSignCommasToNumber(Math.abs(finalEstimatedCost));
      setBuyingPowerCost(finalVal);
    } else if (buttonText === "Add Underlying") {
      // setBuyingPowerCost(formatValue(minValue));
      let newFinalVal: any = addDollarSignCommasToNumber(Math.abs(finalEstimatedCost));
      setBuyingPowerCost(newFinalVal);
    } else if (buttonText === "Remove Underlying") {
      let newFinalVal: any = addDollarSignCommasToNumber(Math.abs(finalEstimatedCost));
      setBuyingPowerCost(newFinalVal);
    }
  }, [selectedoptionsTypeData, finalEstimatedCost, minValue, selectedPrice, netValue, buttonText]);

  function formatValue(value) {
    if (value === "Infinite" || value === "infinite") {
      return "Infinite";
    } else if (value === "0") {
      return "0";
    } else {
      // Replace commas and parse the value to a number
      const numericValue = parseFloat(value?.replace(/,/g, ""));
      if (!isNaN(numericValue)) {
        // Ensure the value is positive and format it
        const formattedValue = Math.abs(numericValue)?.toLocaleString();
        return "$" + formattedValue;
      }
    }
    return value;
  }
  return (
    <Offcanvas.Body>
      <form>
        <div className="stockDetails">
          <ul className="w-100">
            <li>
              <label>Total Value</label>
              <strong>{addDollarSignCommasToNumber(balancesObj?.balances?.total_equity) || 0}</strong>
            </li>
            <li>
              <label>{balancesObj?.balances?.account_type === "cash" ? "Funds available" : "Option B.P"}</label>
              <strong>
                {addDollarSignCommasToNumber(
                  (balancesObj?.balances?.account_type === "cash"
                    ? balancesObj?.balances?.cash?.cash_available
                    : balancesObj?.balances?.[balancesObj?.balances?.account_type]?.option_buying_power) || 0
                )}
              </strong>
            </li>
            <li>
              <label>{balancesObj?.balances?.account_type === "cash" ? "Settled funds" : "Stock B.P"}</label>
              <strong>
                {addDollarSignCommasToNumber(
                  (balancesObj?.balances?.account_type === "cash"
                    ? balancesObj?.balances?.cash?.cash_available - balancesObj?.balances?.cash?.unsettled_funds
                    : balancesObj?.balances?.[balancesObj?.balances?.account_type]?.stock_buying_power) || 0
                )}
              </strong>
            </li>
            <li className="ms-auto">
              <label>Account</label>
              <strong>{balancesObj.selectedAccountId}</strong>
            </li>
            <li>
              <label>Stock Price:</label>
              {pageTitle === "dashboard" ? (
                <strong>{lastValue ? addDollarSignCommasToNumber(lastValue) : "-"}</strong>
              ) : (
                <strong>
                  {tradeDataMap[0]?.last === 0 ? 0 : addDollarSignCommasToNumber(tradeDataMap[0]?.last) || "-"}
                </strong>
              )}
            </li>
          </ul>
        </div>
        <div className={styles.legInfo}>
          <div className="d-flex justify-content-between  mb-4 align-items-center">
            <h3>Legs </h3>
            <div>
              <Button variant="outline-primary" onClick={toggleUnderlying} disabled={objectByStrike?.length > 2}>
                {buttonText}
              </Button>
              {pageTitle !== "dashboard" && (
                <Button
                  variant="outline-primary"
                  disabled={objectByStrike.length >= 4 ? true : false}
                  onClick={() => setObjectByStrike([...objectByStrike, {}])}
                >
                  + Add Leg
                </Button>
              )}
            </div>
          </div>
          {actionType === "roll_over" ? (
            <>
              <h3 style={{ margin: "1rem 1.5rem", fontWeight: "bold" }}>Existing Legs</h3>
              <ul className={styles.legListing}>
                <li>
                  <strong className={styles.expiration}>Expiration</strong>
                  <strong className={styles.strike}>Strike</strong>
                  <strong className={styles.type}>Type</strong>
                  <strong className={styles.side}>Side</strong>
                  <strong className={styles.quantity}>Quantity</strong>
                  <strong className={styles.trade}>Trade type</strong>
                </li>
                {objectByStrike?.map((item, index) => {
                  return (
                    <li key={index}>
                      <div className={styles.expiration}>
                        <Form.Select disabled aria-label="Default select example">
                          {optionStrategiSelectionDates?.date?.map((dateItem) => {
                            return (
                              <option
                                key={dateItem.value}
                                value={dateItem.value}
                                selected={item?.old_expiration_date === dateItem}
                              >
                                {formattedDate(dateItem)}
                              </option>
                            );
                          })}
                        </Form.Select>
                      </div>
                      <div className={styles.strike}>
                        <Form.Select disabled aria-label="Default select example">
                          <option value={item.old_strike}>{item.old_strike}</option>
                        </Form.Select>
                      </div>
                      <div className={styles.type}>
                        <Form.Select disabled aria-label="Default select example">
                          {item.old_option_type === "call" ? (
                            <>
                              <option value="call">Call</option>
                              <option value="put">Put</option>
                            </>
                          ) : item.old_option_type === "put" ? (
                            <>
                              <option value="put">Put</option>
                              <option value="call">Call</option>
                            </>
                          ) : null}
                        </Form.Select>
                      </div>
                      <div className={styles.side}>
                        <Form.Select disabled aria-label="Default select example ">
                          {optionsSides.map((sideOption) => {
                            return (
                              <option
                                key={sideOption.value}
                                value={sideOption.value}
                                selected={item.sidesRollover === sideOption.value}
                              >
                                {sideOption.label}
                              </option>
                            );
                          })}
                        </Form.Select>
                      </div>
                      <div className={styles.quantity}>
                        <Form.Control
                          type="number"
                          placeholder="1"
                          min="1"
                          value={Math.abs(oldQuantity[index])}
                          onChange={(e) => handleOldQuantityValueChange(e.target.value, index)}
                        />
                      </div>
                      <div className={styles.trade}>
                        <Form.Select aria-label="Default select example" aria-readonly>
                          <option value={item.mid}>{`Mid ${Math.abs(item.old_mid)}`}</option>
                          <option value={item.bid}>{`Bid ${item.bid}`}</option>
                          <option value={item.ask}>{`Ask ${item.ask}`}</option>
                        </Form.Select>
                      </div>
                      {/* <span className="icon-delete" style={{ cursor: "pointer" }} onClick={() => handleClick(index)}></span> */}
                    </li>
                  );
                })}
              </ul>
              <h3 style={{ margin: "1rem 1.5rem", fontWeight: "bold" }}>Rollover To</h3>
            </>
          ) : (
            ""
          )}
          <ul className={styles.legListing}>
            <li>
              <strong className={styles.expiration}>Expiration</strong>
              <strong className={styles.strike}>Strike</strong>
              <strong className={styles.type}>Type</strong>
              <strong className={styles.side}>Side</strong>
              <strong className={styles.quantity}>Quantity</strong>
              <strong className={styles.trade}>Trade type</strong>
            </li>
            {objectByStrike.map((item, index) => {
              return (
                <li key={index}>
                  <div className={styles.expiration}>
                    <Form.Select
                      aria-label="Default select example"
                      onChange={(e) => handleExpirationDateChange(e.target.value, index)}
                    >
                      <option value="">Expiration</option>
                      {optionStrategiSelectionDates?.date?.map((dateItem) => {
                        return (
                          <>
                            <option key={dateItem} value={dateItem} selected={item?.expiration_date === dateItem}>
                              {formattedDate(dateItem)}
                            </option>
                          </>
                        );
                      })}
                    </Form.Select>
                  </div>
                  <div className={styles.strike}>
                    <Form.Select
                      aria-label="Default select example"
                      onChange={(e) => handleStrikeChange(e.target.value, index)}
                      value={item?.strike}
                    >
                      {/* <option value={item?.strike}>{item?.strike}</option> */}
                      <option value="Strike" selected={!item?.strike}>
                        Strike
                      </option>
                      {strikesValues[item?.expiration_date] &&
                        strikesValues[item?.expiration_date]?.map((item) => {
                          return (
                            <option key={item} value={item}>
                              {item}
                            </option>
                          );
                        })}
                    </Form.Select>
                  </div>
                  <div className={styles.type}>
                    <Form.Select
                      aria-label="Default select example"
                      onChange={(e) => handleSetTypes(e.target.value, index)}
                      value={item?.option_type}
                    >
                      <option value="">Type</option>
                      {optionsSymbols.map((optionSymbol) => {
                        return (
                          <option
                            key={optionSymbol.value}
                            value={optionSymbol.value}
                            selected={item?.option_type === optionSymbol.value}
                          >
                            {optionSymbol.label}
                          </option>
                        );
                      })}
                    </Form.Select>
                  </div>
                  <div className={styles.side}>
                    <Form.Select
                      aria-label="Default select example"
                      onChange={(e) => handleSelectSides(e.target.value, index)}
                    >
                      <option value="">Side</option>
                      {optionsSides.map((sideOption) => {
                        return (
                          <option
                            key={sideOption.value}
                            value={sideOption.value}
                            selected={item?.sides === sideOption.value}
                          >
                            {sideOption.label}
                          </option>
                        );
                      })}
                    </Form.Select>
                  </div>
                  <div className={styles.quantity}>
                    <Form.Control
                      type="number"
                      placeholder="1"
                      min="1"
                      value={quantity[index]}
                      onChange={(e) => handleQuantityValueChange(e.target.value, index)}
                    />
                  </div>
                  <div className={styles.trade}>
                    <Form.Select
                      aria-label="Default select example"
                      onChange={(e) => handleTradeValueChange(e.target.value, index)}
                    >
                      <option
                        value={
                          typeof item?.mid === "number"
                            ? item?.mid.toFixed(2)
                            : typeof item?.mid === "string"
                            ? parseFloat(item?.mid).toFixed(2)
                            : ""
                        }
                      >
                        {`Mid ${
                          typeof item?.mid === "number"
                            ? item?.mid.toFixed(2)
                            : typeof item?.mid === "string"
                            ? parseFloat(item?.mid).toFixed(2)
                            : "0.00"
                        }`}
                      </option>
                      <option value={item?.bid}>{`Bid ${item?.bid ? item?.bid : 0}`}</option>
                      <option value={item?.ask}>{`Ask ${item?.ask ? item?.ask : 0}`}</option>
                    </Form.Select>
                  </div>
                  <span className="icon-delete" style={{ cursor: "pointer" }} onClick={() => handleClick(index)}></span>
                </li>
              );
            })}
          </ul>

          {/* =========NEW========== */}
          <div className={styles.Infodetails}>
            {objectByStrike.length > 1 ? (
              <Form.Select
                aria-label="Default select example"
                value={selectedoptionsTypeData}
                onChange={(e) => setSelectedoptionsTypeData(e.target.value)}
              >
                {optionsTypeData.map((types) => (
                  <option key={types.value} value={types.value}>
                    {types.label}
                  </option>
                ))}
              </Form.Select>
            ) : objectByStrike.length === 1 && quantityOfCombo ? (
              <Form.Select
                aria-label="Default select example"
                value={selectedoptionsTypeData}
                onChange={(e) => setSelectedoptionsTypeData(e.target.value)}
              >
                {optionsTypeData.map((types) => (
                  <option key={types.value} value={types.value}>
                    {types.label}
                  </option>
                ))}
              </Form.Select>
            ) : (
              <Form.Select
                aria-label="Default select example"
                // onChange={handleSelectMarket}
                value={selectedMarketLable}
                onChange={(e) => setSelectedMarketLable(e.target.value)}
              >
                {optionsMarketData.map((marketType) => (
                  <option key={marketType.value} value={marketType.value}>
                    {marketType.label}
                  </option>
                ))}
              </Form.Select>
            )}
            {objectByStrike.length === 1 && !quantityOfCombo && selectedMarketLable === "limit" && (
              <Form.Control
                type="number"
                placeholder="Price"
                className={styles.formControl}
                onChange={(event) => setSelectedPrice(event.target.value)}
              />
            )}
            {objectByStrike.length === 1 &&
              !quantityOfCombo &&
              selectedMarketLable !== "market" &&
              selectedMarketLable === "stop" && (
                <Form.Control
                  type="number"
                  placeholder="Stop"
                  className={styles.formControl}
                  onChange={(event) => setSelectedStop(event.target.value)}
                />
              )}
            {objectByStrike.length === 1 &&
              !quantityOfCombo &&
              selectedMarketLable !== "market" &&
              selectedMarketLable === "stop_limit" && (
                <>
                  <Form.Control
                    type="number"
                    placeholder="Stop"
                    className={styles.formControl}
                    onChange={(event) => setSelectedStop(event.target.value)}
                  />
                  <Form.Control
                    type="number"
                    placeholder="Limit"
                    className={styles.formControl}
                    onChange={(event) => setSelectedPrice(event.target.value)}
                  />
                </>
              )}
            {objectByStrike.length >= 1 &&
            // quantityCombo &&
            // selectedMarketLable !== "market" &&
            (selectedoptionsTypeData === "debit" || selectedoptionsTypeData === "credit") ? (
              <Form.Control
                type="number"
                placeholder="Price"
                className={styles.formControl}
                onChange={(event) => setSelectedPrice(event.target.value)}
              />
            ) : null}

            <Form.Select aria-label="Default select example" onChange={handleSelectDuration}>
              {optionsDurationData?.map((durationType) => {
                return (
                  <>
                    <option value={durationType.value}>{durationType.label}</option>
                  </>
                );
              })}
            </Form.Select>
          </div>

          {/* =========NEW========== */}

          {/* {showUnderlying &&
          showUnderlyingSec &&
          (stockValue || alerts?.length > 0 || (pageTitle === "dashboard" && tradeDataMap.length)) ? ( */}
          {showUnderlying && objectByStrike?.length <= 2 ? (
            <div className={styles.buySell}>
              <>
                <h3>Underlying</h3>
                <Form.Select aria-label="Default select example">
                  <option>{`${pageTitle === "dashboard" ? stockTikcer : tradeDataMap[0]?.symbol || "-"} ${
                    pageTitle === "dashboard"
                      ? addDollarSignCommasToNumber(lastValue)
                      : addDollarSignCommasToNumber(tradeDataMap[0]?.last)
                  }`}</option>
                </Form.Select>
                {actionType !== "close" ? (
                  <Form.Select
                    aria-label="Default select example"
                    onChange={(e) => setoptionsDataLable(e.target.value)}
                  >
                    {optionsData.map((sideOption) => {
                      return (
                        <option key={sideOption.value} value={sideOption.value}>
                          {sideOption.label}
                        </option>
                      );
                    })}
                  </Form.Select>
                ) : (
                  <Form.Select
                    aria-label="Default select example"
                    onChange={(e) => setoptionsDataLable(e.target.value)}
                  >
                    <option key={"sell"} value={"sell"}>
                      Sell
                    </option>
                  </Form.Select>
                )}
                <Form.Control
                  type="number"
                  placeholder="0"
                  value={quantityOfCombo}
                  onChange={(e) => {
                    handleQuantityComboValueChange(e.target.value);
                  }}
                />
              </>

              <div className={styles.stockPrice}>
                <label>Total Stock Price:</label>

                {pageTitle === "dashboard" ? (
                  <strong>{lastValue ? addDollarSignCommasToNumber(lastValue * quantityOfCombo) : "-"}</strong>
                ) : (
                  <strong>
                    {quantityOfCombo === 0 || quantityOfCombo === null || isNaN(quantityOfCombo)
                      ? "--"
                      : addDollarSignCommasToNumber(tradeDataMapValue[0]?.last) === 0
                      ? 0
                      : addDollarSignCommasToNumber(tradeDataMapValue[0]?.last) || "-"}
                  </strong>
                )}
              </div>
            </div>
          ) : (
            ""
          )}
          {/* ) : null} */}
          <div className={styles.legDetails}>
            <h3>Details</h3>
            {actionType === "roll_over" &&
              objectByStrike?.map((item, index) => {
                return (
                  <Alert
                    key={index}
                    variant={item?.direction === -1 ? "danger" : "success"}
                    className={styles.sucessmsg}
                    onClose={() => setShow(false)}
                  >
                    <div className="d-flex justify-content-between alertInfo">
                      <ul className="left-content">
                        <li>
                          <strong>
                            {formattedDate(item?.old_expiration_date)}
                            {/* {selectedExpirationDates[index] === undefined
                            ? formattedDate(item.expiration_date)
                            : formattedDate(selectedExpirationDates[index])} */}
                          </strong>
                          <strong>${item?.old_strike}</strong>
                          <strong>
                            {capitalizeFirstLetter(item?.old_option_type)}
                            {/* {types[index] === undefined
                            ? capitalizeFirstLetter(item.option_type)
                            : capitalizeFirstLetter(types[index])} */}
                          </strong>
                          <strong>
                            {item?.sidesRollover === "buy_to_open"
                              ? "(Buy To Open)"
                              : item?.sidesRollover === "buy_to_close"
                              ? "(Buy To Close)"
                              : item?.sidesRollover === "sell_to_open"
                              ? "(Sell To Open)"
                              : item?.sidesRollover === "sell_to_close"
                              ? "(Sell To Close)"
                              : ""}
                          </strong>
                        </li>
                      </ul>
                      <div className="right-price">
                        <strong>
                          {item?.old_mid !== undefined
                            ? addDollarSignCommasToNumber(parseFloat(item?.old_mid)) ||
                              addDollarSignCommasToNumber(item?.old_mid)
                            : "0.00"}
                        </strong>
                        <span>({addDollarSignCommasToNumber(item?.change)})</span>
                      </div>
                    </div>
                  </Alert>
                );
              })}
            {objectByStrike.map((item, index) => {
              return (
                <Alert
                  key={index}
                  variant={item?.direction === -1 ? "danger" : "success"}
                  className={styles.sucessmsg}
                  onClose={() => setShow(false)}
                >
                  <div className="d-flex justify-content-between alertInfo">
                    <ul className="left-content">
                      <li>
                        <strong>
                          {formattedDate(item?.expiration_date)}
                          {/* {selectedExpirationDates[index] === undefined
                            ? formattedDate(item.expiration_date)
                            : formattedDate(selectedExpirationDates[index])} */}
                        </strong>
                        <strong>${item?.strike}</strong>
                        <strong>
                          {capitalizeFirstLetter(item?.option_type)}
                          {/* {types[index] === undefined
                            ? capitalizeFirstLetter(item.option_type)
                            : capitalizeFirstLetter(types[index])} */}
                        </strong>
                        <strong>
                          {item?.sides === "buy_to_open"
                            ? "(Buy To Open)"
                            : item?.sides === "buy_to_close"
                            ? "(Buy To Close)"
                            : item?.sides === "sell_to_open"
                            ? "(Sell To Open)"
                            : item?.sides === "sell_to_close"
                            ? "(Sell To Close)"
                            : ""}
                        </strong>
                      </li>
                    </ul>
                    <div className="right-price ms-auto">
                      <strong>
                        {item?.mid !== undefined
                          ? addDollarSignCommasToNumber(parseFloat(item?.mid)) || addDollarSignCommasToNumber(item?.mid)
                          : "0.00"}
                      </strong>
                      <span>({addDollarSignCommasToNumber(item?.change)})</span>
                    </div>
                  </div>
                </Alert>
              );
            })}
          </div>
        </div>

        <div className={styles.orderNetQuote}>
          <div className={styles.qoute}>
            <h3 className={styles.netQuote}>Net Quote</h3>
            <div className="stockDetails buyStrategies">
              <ul>
                <li>
                  <label>
                    {["close"].includes(actionType)
                      ? averageBidValue <= 0
                        ? "Debit Bid"
                        : "Credit Bid"
                      : averageBidValue >= 0
                      ? "Debit Bid"
                      : "Credit Bid"}
                  </label>
                  <strong>{addDollarSignCommasToNumber(Math.abs(averageBidValue))}</strong>
                </li>
                <li>
                  <label>
                    {["close"].includes(actionType)
                      ? averageMidValue <= 0
                        ? "Debit Mid"
                        : "Credit Mid"
                      : averageMidValue >= 0
                      ? "Debit Mid"
                      : "Credit Mid"}
                  </label>
                  <strong>{addDollarSignCommasToNumber(Math.abs(averageMidValue))}</strong>
                </li>
                <li>
                  <label>
                    {["close"].includes(actionType)
                      ? averageAskValue <= 0
                        ? "Debit Ask"
                        : "Credit Ask"
                      : averageAskValue >= 0
                      ? "Debit Ask"
                      : "Credit Ask"}
                  </label>
                  <strong>{addDollarSignCommasToNumber(Math.abs(averageAskValue))}</strong>
                </li>
              </ul>
            </div>
          </div>
          <div className={styles.orderdetails}>
            <h3 className={styles.netQuote}>Order Details</h3>
            <div className="stockDetails buyStrategies">
              <ul>
                {/* <li>
                  <label>Day Trade</label>
                  <strong>04</strong>
                </li> */}
                <li>
                  <label>Commission Fee</label>
                  {orderValue?.commission ? (
                    <strong>{addDollarSignCommasToNumber(orderValue?.commission)}</strong>
                  ) : (
                    "-"
                  )}
                </li>
                {!!orderValue?.cost && (
                  <li>
                    <label>Buying Power {orderValue?.order_cost < 0 ? " Increase " : " Decrease "} by</label>
                    <strong>{addDollarSignCommasToNumber(Math.abs(orderValue?.order_cost)) || "-"}</strong>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>

        <div className={styles.totalPrice}>
          <label>Estimated {orderValue?.cost > 0 ? "Debit" : "Credit"}</label>
          <strong>{addDollarSignCommasToNumber(Math.abs(orderValue?.cost || 0))} </strong>
        </div>
        <div className={styles.action}>
          {orderError && (
            <div style={{ background: "#e3242b", padding: "10px 10px", color: "#ffffff", borderRadius: "10px" }}>
              {orderError}
            </div>
          )}
          <div className="d-grid gap-2">
            <Button
              variant="outline-primary"
              className={styles.Preview}
              onClick={handleSellBuy}
              disabled={
                orderError ||
                isEmptyArray.some((isEmpty) => isEmpty) ||
                !selectedStrikes ||
                ((selectedMarketLable === "limit" ||
                  selectedoptionsTypeData === "debit" ||
                  selectedoptionsTypeData === "credit") &&
                  !selectedPrice) ||
                (selectedMarketLable === "stop" && !selectedStop) ||
                (selectedMarketLable === "stop_limit" && (!selectedPrice || !selectedStop)) ||
                objectByStrike.some((item) => item?.strike === "Strike") ||
                objectByStrike.some((item) => item?.option_type === "Type") ||
                objectByStrike.some((item) => item?.sides === "Side") ||
                objectByStrike.some((item) => !item?.option_type) ||
                objectByStrike.some((item) => !item?.sides) ||
                objectByStrike.some((item) => {
                  return (
                    item?.option_type === null &&
                    item?.sides === null &&
                    item?.strike === null &&
                    item?.expiration_date === null &&
                    Object.values(item).some((value) => value === null)
                  );
                })
                // ||
                // !commission
              }
            >
              <span className="icon-buy"></span> Submit
            </Button>
            <ToastContainer
              position="top-end"
              className="p-4"
              style={{
                position: "fixed",
                top: "20px",
                right: "20px",
                zIndex: "9999",
              }}
            >
              <Toast bg="danger" show={updateSuccess} onClose={() => setUpdateSuccess(false)} delay={100}>
                <Toast.Header></Toast.Header>
                <Toast.Body>
                  <div className="info">
                    <div className="icon">
                      <span className="icon-close"></span>
                    </div>
                    <div className="infoDetails">
                      <strong>Error</strong>
                      <p>
                        {errorMsg.length ? (
                          <>
                            <span>{errorMsg}</span>
                          </>
                        ) : (
                          "BackOffice Rejected the Order"
                        )}
                      </p>
                    </div>
                  </div>
                </Toast.Body>
              </Toast>
            </ToastContainer>

            {orderPlacedSuccessfully && (
              <ToastContainer position="top-end" className="p-3">
                <Toast
                  bg="success"
                  show={orderPlacedSuccessfully}
                  onClose={() => setOrderPlacedSuccessfully(false)}
                  delay={2000}
                >
                  <Toast.Header></Toast.Header>
                  <Toast.Body>
                    <div className="info">
                      <div className="icon">
                        <span className="icon-done"></span>
                      </div>
                      <div className="infoDetails">
                        <strong>Success</strong>
                        <p>
                          <span>Order placed successfully</span>
                        </p>
                      </div>
                    </div>
                  </Toast.Body>
                </Toast>
              </ToastContainer>
            )}
          </div>
        </div>
      </form>
    </Offcanvas.Body>
  );
};

export default BuyStrategies;
