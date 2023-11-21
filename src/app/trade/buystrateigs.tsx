"use clients";
import { Offcanvas, Button, Form, Alert, ToastContainer, Toast, Spinner } from "react-bootstrap";
import styles from "@/styles/strategies.module.scss";
import React, { useState, useEffect, useMemo } from "react";
import { useAppDispatch } from "@/hooks/reduxCommon";
import { useAppSelector } from "@/hooks/reduxCommon";
import { optionStrategiSelectionData } from "@/redux/slices/optionStrategySlice";
import { useRouter } from "next/navigation";
import { capitalizeFirstLetter, formattedDate } from "@/utils/dates";
import { fetchOptionGreekChains, optionGreekChainsData } from "@/redux/slices/optionGreekChainsSlice";
import { fetchPlaceOrder, fetchPlaceOrderNew, loadingOrderData, placeOrderData } from "@/redux/slices/placeOrderSlice";
import { balancesData, fetchBalanceDetails } from "@/redux/slices/balanceSlice";
import { Howl } from "howler";
import { fetchQuotesData } from "@/redux/slices/quoteSlice";
import { addDollarSignCommasToNumber } from "@/utils/positions";
import { Leg } from "@/utils/legs";
import options from "@/utils/optionSummeryCalc";
import SummaryHelper from "@/utils/OptionStrategyCalculation";

export enum DirectionType {
  Buy = 1,
  Sell = -1,
}
const BuyStrategies = ({ allItems, removeSelected, chainDetials, tradeDataMap, netTitle }) => {
  const dispatch = useAppDispatch();
  const [show, setShow] = useState(false);
  const router = useRouter();
  const [allItemsTmp, setAllItems] = useState([]);
  const [selectedExpirationDates, setSelectedExpirationDates] = useState<any[]>([]);
  const optionStrategiSelectionDates: any = useAppSelector(optionStrategiSelectionData);
  const placeOrderDataResponse: any = useAppSelector(placeOrderData);
  // const loading = useAppSelector(loadingOrderData);
  const optionsClass = [
    { value: "option", label: "option" },
    { value: "multileg", label: "multileg" },
    { value: "combo", label: "combo" },
  ];
  const optionsSides = [
    { value: "buy_to_open", label: "Buy to Open" },
    { value: "sell_to_close", label: "Sell to Close" },
    { value: "sell_to_open", label: "Sell to Open" },
    { value: "buy_to_close", label: "Buy to Close" },
  ];
  const optionsSymbols = [
    { value: "put", label: "Put" },
    { value: "call", label: "Call" },
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
  const optionsData = [
    { value: "buy", label: "Buy" },
    // { value: "buy_to_cover", label: "Buy To Cover" },
    // { value: "sell", label: "Sell" },
    // { value: "sell_short", label: "Sell Short" },
  ];
  const [selectedStrikes, setSelectedStrikes] = useState<any[]>([]);
  const initialQuantity = new Array(allItemsTmp && allItemsTmp?.length).fill(1);
  const [quantity, setQuantity] = useState<any>(initialQuantity);
  const [quantityCombo, setQuantityCombo] = useState<number>(0);
  // const [finalValue, setFinalValue] = useState<number>(null);
  const [finalText, setFinalText] = useState<number>(null);
  const [tradeDataMapValue, setTradeDataMap] = useState([{ last: 0 }]);
  const [selectedTradeValues, setSelectedTradeValues] = useState<any[]>([]);
  const [finalEstimatedCost, setFinalEstimatedCost] = useState<number>();
  const [bidCost, setBidCost] = useState<number>(null);
  const [askCost, setAskCost] = useState<number>(null);
  const [midCost, setMidCost] = useState<number>(null);
  const [selectedClass, setSelectedClass] = useState<any>("");
  const selectedExpirationDate: any = useAppSelector(optionGreekChainsData);
  const [selectedDurationtLable, setSelectedDurationtLable] = useState<string>(optionsDurationData[0].value);
  const [selectedPrice, setSelectedPrice] = useState<any>("");
  const [selectedStop, setSelectedStop] = useState<any>("");
  const [stockValue, setStockValue] = useState<number>(null);
  const balancesObj: any = useAppSelector(balancesData);
  const [selectedMarketLable, setSelectedMarketLable] = useState<string>("");
  const [selectedoptionsTypeData, setSelectedoptionsTypeData] = useState<string>("");
  const [optionsDataLable, setoptionsDataLable] = useState<string>(optionsData[0].value);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [errorMsg, setErrormsg] = useState([]);
  const [showUnderlying, setShowUnderlying] = useState(false);
  const [buttonText, setButtonText] = useState("Add Underlying");
  const [estimateText, setEstimateText] = useState(
    netTitle === "Net Credit" ? "Estimated Credit:" : "Estimated Debit:"
  );
  const [buyingPowerCost, setBuyingPowerCost] = useState<number>(null);
  const [commission, setCommission] = useState(null); // Initialize with null
  // const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (allItemsTmp?.length > 1 || (quantityCombo && showUnderlying)) {
      setSelectedoptionsTypeData(optionsTypeData[0].value);
      setSelectedMarketLable("");
    } else if (allItemsTmp?.length === 1 || (!quantityCombo && !showUnderlying)) {
      setSelectedMarketLable(optionsMarketData[0].value);
      setSelectedoptionsTypeData("");
    }
  }, [allItemsTmp?.length, showUnderlying, quantityCombo]);

  useEffect(() => {
    const lowestStrikeObject = allItemsTmp?.reduce((lowest, item) => {
      if (lowest === null || item?.strike < lowest?.strike) {
        return item;
      }
      return lowest;
    }, null);
    const bidValues = allItemsTmp?.map((item, index) => {
      // const quantityCost = quantity[index] === undefined ? 1 : quantity[index];
      // const quantityCost = quantity[index] === undefined ? (allItemsTmp.length === 1 ? 1 : 1) : quantity[index];

      let minQuantity: any = Math?.min(...quantity);
      if (!isFinite(minQuantity) || isNaN(minQuantity)) {
        minQuantity = 1;
      }
      let valueOfQuantity;

      if (allItemsTmp?.length === 1) {
        valueOfQuantity = 1;
      } else if (allItemsTmp?.length > 1) {
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
    const askValues = allItemsTmp?.map((item, index) => {
      // const quantityCost = quantity[index] === undefined ? 1 : quantity[index];
      let minQuantity: any = Math?.min(...quantity);
      if (!isFinite(minQuantity) || isNaN(minQuantity)) {
        minQuantity = 1;
      }
      let valueOfQuantityAsk;

      if (allItemsTmp?.length === 1) {
        valueOfQuantityAsk = 1;
      } else if (allItemsTmp?.length > 1) {
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

    let bidTotal: any = bidValueCalc?.reduce((accumulator, currentValue) => accumulator + currentValue, 0)?.toFixed(2);
    let askTotal: any = askValueCalc?.reduce((accumulator, currentValue) => accumulator + currentValue, 0)?.toFixed(2);

    let considerStockPrice = tradeDataMap[0]?.bid === 0 ? 0 : tradeDataMap[0]?.bid?.toFixed(2);
    let bidValForUnderlying: any = (Number(bidTotal) + (considerStockPrice / 100) * quantityCombo)?.toFixed(2);
    let askValForUnderlying: any = (Number(askTotal) + (considerStockPrice / 100) * quantityCombo)?.toFixed(2);
    if (bidTotal > 0 && askTotal > 0) {
      parseFloat(bidTotal);
      parseFloat(askTotal);
    } else if (parseFloat(bidTotal) < 0 && parseFloat(askTotal) < 0) {
      Math.abs(bidTotal);
      Math.abs(askTotal);
      if (Math.abs(bidTotal) > Math.abs(askTotal)) {
        // Swap bidTotal and askTotal directly
        [bidTotal, askTotal] = [askTotal, bidTotal];
      }
    } else if (parseFloat(bidTotal) < 0 && parseFloat(askTotal) > 0) {
      if (parseFloat(bidTotal) > parseFloat(askTotal)) {
        // Swap bidTotal and askTotal directly
        [bidTotal, askTotal] = [askTotal, bidTotal];
      }
    }

    const midValueCalc: any = ((Number(bidTotal) + Number(askTotal)) / 2)?.toFixed(2);
    let midValForUnderlying: any = (Number(midValueCalc) + (considerStockPrice / 100) * quantityCombo)?.toFixed(2);

    if (quantityCombo) {
      setMidCost(midValForUnderlying);
      setBidCost(bidValForUnderlying);
      setAskCost(askValForUnderlying);
    } else {
      setMidCost(midValueCalc);
      setBidCost(bidTotal);
      setAskCost(askTotal);
    }
  }, [allItemsTmp, quantity]);

  useEffect(() => {
    // Initialize selectedExpirationDates based on the initial allItemsTmp array
    const initialSelectedDates = allItemsTmp?.map((item) => item?.expiration_date);
    setSelectedExpirationDates(initialSelectedDates);
  }, [allItemsTmp]);
  useEffect(() => {
    const getClass = optionsClass?.map((item) => {
      return item?.value;
    });
    setSelectedClass(getClass);
  }, []);

  const handleClick = (index: number) => {
    const updatedItems = allItemsTmp.filter((_, i) => i !== index);
    // if (updatedItems?.length === 1) {
    //   setSelectedoptionsTypeData("market");
    // }
    setAllItems(updatedItems);
  };
  const getSymbolValue = (item) => {
    const strikeVal = String(item?.strike * 1000).padStart(8, "0");
    const expirationFormatted =
      item?.expiration_date?.split("-")[0]?.substring(2) +
      item?.expiration_date?.split("-")[1] +
      item?.expiration_date?.split("-")[2];
    const typeValue = item?.option_type === "call" ? "C" : item?.option_type === "put" ? "P" : "";
    const symbolCheck = item?.root_symbol + expirationFormatted + typeValue + strikeVal;
    return symbolCheck;
  };
  // To set allItemsTmp Table values useEffect

  useEffect(() => {
    setAllItems(allItems);
  }, [allItems]);

  useEffect(() => {
    if (allItems && selectedExpirationDate) {
      const groupedObjectsByStrike = [];
      allItems?.forEach((legItem, index) => {
        const getStrikes = Number(legItem?.strike);
        const directions = (() => {
          if (
            legItem?.call_sell === "call-sellToOpen" ||
            legItem?.call_sell === "call-sellToClose" ||
            legItem?.put_sell === "put-sellToOpen" ||
            legItem?.put_sell === "put-sellToClose"
          ) {
            return -1;
          } else if (
            legItem?.call_buy === "call-buyToOpen" ||
            legItem?.call_buy === "call-buyToClose" ||
            legItem?.put_buy === "put-buyToOpen" ||
            legItem?.put_buy === "put-buyToClose"
          ) {
            return 1;
          } else {
            return 0; // Default value if none of the conditions are met
          }
        })();
        const sidesTypes = (() => {
          if (
            (legItem?.call_buy === "call-buyToOpen" && legItem?.call_buy_id !== 0) ||
            (legItem?.put_buy === "put-buyToOpen" && legItem?.put_buy_id !== 0)
          ) {
            return "buy_to_open";
          } else if (
            (legItem?.call_buy === "call-buyToClose" && legItem?.call_buy_id !== 0) ||
            (legItem?.put_buy === "put-buyToClose" && legItem?.put_buy_id !== 0)
          ) {
            return "buy_to_close";
          } else if (
            (legItem?.call_sell === "call-sellToOpen" && legItem?.call_sell_id !== 0) ||
            (legItem?.put_sell === "put-sellToOpen" && legItem?.put_sell_id !== 0)
          ) {
            return "sell_to_open";
          } else if (
            (legItem?.call_sell === "call-sellToClose" && legItem?.call_sell_id !== 0) ||
            (legItem?.put_sell === "put-sellToClose" && legItem?.put_sell_id !== 0)
          ) {
            return "sell_to_close";
          }
        })();
        const getType = (() => {
          if (legItem?.option_type === "call") {
            return "call";
          } else if (legItem?.option_type === "put") {
            return "put";
          } else {
            ("");
          }
        })();
        const getDate = legItem?.expiration_date;
        const selectedObject = selectedExpirationDate.find((item) => item.hasOwnProperty(getDate));
        const matchingObjects = selectedObject?.[getDate]
          ?.filter((selectedItem) => {
            return selectedItem?.strike === getStrikes && selectedItem.option_type === getType;
          })
          ?.map((matchedItem) => {
            const calculateMidValue = (matchedItem?.ask + matchedItem?.bid) / 2;
            const symbol = getSymbolValue({
              ...matchedItem,
              direction: directions,
              sides: sidesTypes,
              option_type: getType,
              strike: getStrikes,
              expiration_date: getDate,
            });
            return {
              ...matchedItem,
              direction: directions,
              sides: sidesTypes,
              option_type: getType,
              strike: getStrikes,
              expiration_date: getDate,
              mid: calculateMidValue.toFixed(2),
              symbol,
            };
          });
        groupedObjectsByStrike?.push(...matchingObjects);
      });

      // Update each item with its availableStrikes
      groupedObjectsByStrike?.forEach((item, index) => {
        const expiration_date = item.expiration_date;
        const selectedObject = selectedExpirationDate.find((item) => item.hasOwnProperty(expiration_date));
        const availableStrikes =
          selectedObject?.[expiration_date]
            ?.filter((el) => el?.option_type === item?.option_type)
            .map((el) => el?.strike) || [];
        item.availableStrikes = availableStrikes;
      });

      setAllItems(groupedObjectsByStrike);
    }
  }, [allItems]);

  // To call fetchQuotes and fetchBalanceData API in every 2 seconds
  useEffect(() => {
    const symbolValueArray = allItemsTmp.map((i) => i?.symbol);
    const valueOfSymbol = allItemsTmp[0]?.root_symbol;
    const symbolArray = [valueOfSymbol, ...symbolValueArray];
    const accountIDVal = balancesObj.selectedAccountId;
    // dispatch(fetchQuotesData(symbolArray));
    // dispatch(fetchBalanceDetails(accountIDVal));
    const intervalId = setInterval(() => {
      dispatch(fetchQuotesData(symbolArray)).then((response) => {
        if (response) {
          const uniqueDataArray = response?.payload;
          // Map mid, bid, and ask values from uniqueDataArray and update allItemsTmp
          const updatedItems = allItemsTmp?.map((item) => {
            if (item?.strike === "Strike") {
              return item;
            }
            if (Array.isArray(uniqueDataArray)) {
              const matchingItem = uniqueDataArray?.find((uniqueItem) => {
                return (
                  item?.expiration_date === uniqueItem?.expiration_date &&
                  item?.option_type === uniqueItem?.option_type &&
                  item?.strike === uniqueItem?.strike &&
                  item?.greeks === uniqueItem?.greeks
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
              console.error("uniqueDataArray is not an array");
            }
          });
          setAllItems(updatedItems);
        }
      });
      dispatch(fetchBalanceDetails(accountIDVal));
    }, 2000); // 2000 milliseconds = 2 seconds
    return () => {
      clearInterval(intervalId);
    };
  }, [allItemsTmp, dispatch]);

  useEffect(() => {
    if (allItems && allItemsTmp) {
      const valueOfStock = tradeDataMap[0]?.last;
      setStockValue(valueOfStock);
    }
  }, [allItems, allItemsTmp, tradeDataMap]);

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
      (option) => option?.strike == currentItem?.strike && option.option_type === currentItem.option_type
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
        greeks: optionWithMatchingStrike?.greeks,
      };
    }
  };

  // HandleChange Function for expiration_date, strike and type
  const handleExpirationDateChange = (
    objkey: string,
    value: string | number,
    index: number,
    item: { expiration_date: any; option_type: any; strike: any }
  ) => {
    const search: any = allItemsTmp[0]?.root_symbol;

    // Create a copy of allItemsTmp to modify
    const updatedAllItemsTmp = [...allItemsTmp];

    // Update the specific item in updatedAllItemsTmp
    updatedAllItemsTmp[index] = {
      ...updatedAllItemsTmp[index],
      [objkey]: value,
      symbol: getSymbolValue({ ...updatedAllItemsTmp[index], [objkey]: value }),
    };

    if (objkey === "expiration_date") {
      const expiration: any = value;
      const selectedObject = selectedExpirationDate.find((item) => item.hasOwnProperty(expiration));

      const matchingObjects = selectedObject?.[expiration];
      if (Array.isArray(matchingObjects)) {
        const selectedObject = selectedExpirationDate.find((item) => item.hasOwnProperty(expiration));

        const updatedAvailableStrikes = getAvailableStrike(selectedObject[expiration]);
        const calculatedBidMidAskObject = getBidMidAskObject(selectedObject?.[expiration], updatedAllItemsTmp[index]);

        updatedAllItemsTmp[index] = {
          ...updatedAllItemsTmp[index],
          ...calculatedBidMidAskObject,
          availableStrikes: updatedAvailableStrikes,
        };

        setAllItems((prev) => [...prev.slice(0, index), updatedAllItemsTmp[index], ...prev.slice(index + 1)]);
      } else {
        dispatch(fetchOptionGreekChains({ searchKey: search, expiration })).then((res: any) => {
          const updatedAvailableStrikes = getAvailableStrike(res?.payload?.data);
          const calculatedBidMidAskObject = getBidMidAskObject(res?.payload?.data, updatedAllItemsTmp[index]);

          // Update the specific item in updatedAllItemsTmp with the new availableStrikes
          updatedAllItemsTmp[index] = {
            ...updatedAllItemsTmp[index],
            availableStrikes: updatedAvailableStrikes,
            ...calculatedBidMidAskObject,
          };
          // Set the updated item in the state
          setAllItems((prev) => [...prev.slice(0, index), updatedAllItemsTmp[index], ...prev.slice(index + 1)]);
        });
      }
    } else if (objkey === "strike" || objkey === "option_type") {
      const selectedObject = selectedExpirationDate.find((item) =>
        item.hasOwnProperty(updatedAllItemsTmp[index]?.expiration_date)
      );

      const calculatedBidMidAskObject = getBidMidAskObject(
        selectedObject?.[updatedAllItemsTmp[index]?.expiration_date],
        updatedAllItemsTmp[index]
      );

      updatedAllItemsTmp[index] = {
        ...updatedAllItemsTmp[index],
        ...calculatedBidMidAskObject,
        [objkey]: objkey === "strike" ? Number(value) : value,
      };

      setAllItems((prev) => [...prev.slice(0, index), updatedAllItemsTmp[index], ...prev.slice(index + 1)]);
    } else {
      setAllItems((prev) => [
        ...prev.slice(0, index),
        {
          ...prev[index],
          [objkey]: value,
          symbol: getSymbolValue({ ...prev[index], [objkey]: value }),
        },
        ...prev.slice(index + 1, prev.length),
      ]);
    }
  };
  const handleSelectSides = (value: any, index) => {
    const directionTypeDynm = (() => {
      if (value === "buy_to_open" || value === "buy_to_close") {
        return 1;
      } else if (value === "sell_to_open" || value === "sell_to_close") {
        return -1;
      } else {
        return 0;
      }
    })();
    setAllItems((prev) => [
      ...prev.slice(0, index),
      {
        ...prev[index],
        sides: value,
        // option_type: value,
        direction: directionTypeDynm,
      },
      ...prev.slice(index + 1, prev.length),
    ]);
  };
  const handleQuantityValueChange = (value, index) => {
    const updatedQuantityValues = [...quantity];
    updatedQuantityValues[index] = value;
    setQuantity(updatedQuantityValues);
  };

  useEffect(() => {
    const totalEstimatedCost = midCost * 100;
    let finalCost = 0;
    let stockPriceVal = tradeDataMapValue[0]?.last;
    let quantityValCheck = quantityCombo ? quantityCombo : 1;

    if (
      // selectedMarketLable === "market" ||
      selectedoptionsTypeData === "market" ||
      selectedoptionsTypeData === "even"
    ) {
      if (allItemsTmp?.length >= 2 && buttonText === "Add Underlying") {
        // If allItemsTmp.length is greater than 2, calculate midCost * 100
        finalCost = midCost * 100;
      } else if (!quantityCombo) {
        // If quantityCombo is not set, calculate estimated cost as midCost * 100
        finalCost = midCost * 100;
      } else if (quantityCombo) {
        finalCost = midCost * 100;
      }
      // else {
      //   if (midCost < 0 || buttonText === "Remove Underlying") {
      //     finalCost = -stockPriceVal - totalEstimatedCost * quantityValCheck;
      //   } else if (midCost > 0 || buttonText === "Remove Underlying") {
      //     finalCost = stockPriceVal + totalEstimatedCost * quantityValCheck;
      //   }
      // }
      const estimatedCostTextNq = midCost < 0 ? "Estimated Credit:" : "Estimated Debit:";
      setEstimateText(estimatedCostTextNq);
    } else if (allItemsTmp?.length > 1 && !quantityCombo && selectedoptionsTypeData === "debit") {
      finalCost = selectedPrice * 100;
      setEstimateText("Estimated Debit:");
    } else if (allItemsTmp?.length > 1 && !quantityCombo && selectedoptionsTypeData === "credit") {
      finalCost = selectedPrice * 100;
      setEstimateText("Estimated Credit:");
    } else if (allItemsTmp?.length >= 1 && quantityCombo && showUnderlying && selectedoptionsTypeData === "debit") {
      if (buttonText === "Remove Underlying") {
        finalCost = stockPriceVal + selectedPrice * 100;
      }
      setEstimateText("Estimated Debit:");
    } else if (allItemsTmp?.length >= 1 && quantityCombo && showUnderlying && selectedoptionsTypeData === "credit") {
      if (buttonText === "Remove Underlying") {
        finalCost = selectedPrice * 100 - stockPriceVal;
      }
      const diffValText = finalCost < 0 ? "Estimated Credit:" : "Estimated Debit:";
      setEstimateText(diffValText);
    } else if (selectedMarketLable === "limit") {
      finalCost = selectedPrice * 100 * quantity?.length === 0 ? 1 : quantity[0];
      const estimatedCostTextNquote = midCost < 0 ? "Estimated Credit:" : "Estimated Debit:";
      setEstimateText(estimatedCostTextNquote);
    } else if (selectedMarketLable === "stop_limit") {
      finalCost = selectedPrice * 100 * quantity?.length === 0 ? 1 : quantity[0];
      const estimatedCostTextNquotes = midCost < 0 ? "Estimated Credit:" : "Estimated Debit:";
      setEstimateText(estimatedCostTextNquotes);
    } else if (selectedMarketLable === "stop") {
      finalCost = selectedStop * 100 * quantity?.length === 0 ? 1 : quantity[0];
      const estimatedCostTextNquotesVal = midCost < 0 ? "Estimated Credit:" : "Estimated Debit:";
      setEstimateText(estimatedCostTextNquotesVal);
    } else if (selectedMarketLable === "market" && buttonText === "Add Underlying") {
      const considerQuantity = quantity?.length === 0 ? 1 : quantity[0];
      finalCost = midCost * 100 * considerQuantity;
      const estimatedCostTextNquotesVal = midCost < 0 ? "Estimated Credit:" : "Estimated Debit:";
      setEstimateText(estimatedCostTextNquotesVal);
    } else if (allItemsTmp?.length === 1 && buttonText === "Add Underlying") {
      const considerQuantity = quantity?.length === 0 ? 1 : quantity[0];
      finalCost = midCost * 100 * considerQuantity;
      const estimatedCostTextNquotesVal = midCost < 0 ? "Estimated Credit:" : "Estimated Debit:";
      setEstimateText(estimatedCostTextNquotesVal);
    }

    // setFinalValue(finalCost * -1);
    finalCost = finalCost < 0 ? Math.abs(finalCost) : finalCost;

    setFinalEstimatedCost(finalCost);
  }, [
    midCost,
    quantityCombo,
    tradeDataMapValue,
    selectedMarketLable,
    selectedoptionsTypeData,
    selectedPrice,
    selectedStop,
    quantity,
    buttonText,
    // askCost,
  ]);
  const calculateStockPrice = (quantity, tradeData) => {
    const quantityValue = parseFloat(quantity);
    const stockPrice = parseFloat(tradeDataMap[0]?.last);
    if (isNaN(quantityValue) || quantityValue === null) {
      return 0; // Display initial stock price when quantityValue is 0 or null
    } else if (!isNaN(stockPrice)) {
      return quantityValue * stockPrice; // Update price based on quantity when quantityValue is valid
    } else {
      return 0; // Handle other cases
    }
  };

  useEffect(() => {
    if (allItemsTmp?.length === 1 && buttonText === "Add Underlying") {
      const considerQuantity = quantity?.length === 0 ? 1 : quantity[0];
      const values = Math.abs(midCost * 100 * considerQuantity);
      setFinalEstimatedCost(values);
    }
    if (allItemsTmp?.length === 2 && buttonText === "Add Underlying") {
      const newValues = Math.abs(midCost * 100);
      setFinalEstimatedCost(newValues);
    }
  }, [allItemsTmp?.length, buttonText, quantity, midCost]);

  const handleQuantityComboValueChange = (newValue) => {
    const newValueAsNumber = parseFloat(newValue); // Parse the input as a number
    setQuantityCombo(newValueAsNumber);

    const newStockPrice = calculateStockPrice(newValueAsNumber, tradeDataMapValue[0]);
    setTradeDataMap([{ last: newStockPrice }]);
  };

  const handleTradeValueChange = (value, index) => {
    const updatedTradeValues = [...selectedTradeValues];
    updatedTradeValues[index] = value;
    setSelectedTradeValues(updatedTradeValues);
  };
  const handleSelectDuration = (event) => {
    setSelectedDurationtLable(event.target.value);
  };

  const handleSelectMarket = (event) => {
    setSelectedMarketLable(event.target.value);
  };

  const handleSellBuy = () => {
    let orderData: any = {};
    if (selectedClass[1] === "multileg" && (quantityCombo === 0 || quantityCombo === null) && allItemsTmp?.length > 1) {
      orderData = {
        classType: "multileg",
        type: selectedoptionsTypeData,
        duration: selectedDurationtLable,
        account_id: balancesObj.selectedAccountId,
        symbol: allItemsTmp[0]?.root_symbol,
        price: selectedPrice,
        stop: selectedStop,
        quantity: quantity,
        orders: allItemsTmp.map((item, index) => {
          return {
            quantity: quantity[index] === undefined ? [1] : quantity[index],
            option_symbol: item?.symbol,
            side: item?.sides,
          };
        }),
      };
    } else if (selectedClass[2] === "combo" && quantityCombo > 0 && allItemsTmp?.length <= 2) {
      orderData = {
        classType: "combo",
        type: selectedoptionsTypeData,
        duration: selectedDurationtLable,
        account_id: balancesObj.selectedAccountId,
        symbol: allItemsTmp[0]?.root_symbol,
        price: selectedPrice,
        stop: selectedStop,
        side: optionsDataLable,
        quantity: quantityCombo,
        orders: allItemsTmp.map((item, index) => {
          return {
            quantity: quantity[index] === undefined ? [1] : quantity[index],
            option_symbol: item?.symbol,
            side: item?.sides,
          };
        }),
      };
    } else if (quantityCombo === 0 || (quantityCombo === null && showUnderlying === false)) {
      orderData = {
        classType: "option",
        type: selectedMarketLable,
        duration: selectedDurationtLable,
        account_id: balancesObj.selectedAccountId,
        symbol: allItemsTmp[0]?.root_symbol,
        price: selectedPrice,
        stop: selectedStop,
        side: allItemsTmp[0]?.sides,
        quantity: quantity?.length === 0 ? 1 : quantity,
        option_symbol: allItemsTmp[0]?.symbol,
      };
    }
    dispatch(fetchPlaceOrder(orderData))
      .unwrap()
      .then((res) => {
        handleResponse(res);
      });
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
    } else {
      SuccessSound.play();
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    }
  };
  const stockQuantity = useMemo(() => {
    return quantity.reduce((a, b) => Math.abs(+a) + Math.abs(+b), 0);
  }, [quantity, allItemsTmp]);

  const calcCommission = useMemo(() => {
    if (isNaN(stockQuantity) && !stockQuantity) return;
    let orderData: any = {};
    if (selectedClass[1] === "multileg" && (quantityCombo === 0 || quantityCombo === null) && allItemsTmp?.length > 1) {
      orderData = {
        classType: "multileg",
        type: selectedoptionsTypeData,
        duration: selectedDurationtLable,
        account_id: balancesObj.selectedAccountId,
        symbol: allItemsTmp[0]?.root_symbol,
        price: selectedPrice,
        stop: selectedStop,
        quantity: quantity,
        orders: allItemsTmp.map((item, index) => {
          return {
            quantity: quantity[index] === undefined ? [1] : quantity[index],
            option_symbol: item?.symbol,
            side: item?.sides,
          };
        }),
      };
    } else if (selectedClass[2] === "combo" && quantityCombo > 0 && allItemsTmp?.length <= 2) {
      orderData = {
        classType: "combo",
        type: selectedoptionsTypeData,
        duration: selectedDurationtLable,
        account_id: balancesObj.selectedAccountId,
        symbol: allItemsTmp[0]?.root_symbol,
        price: selectedPrice,
        stop: selectedStop,
        side: optionsDataLable,
        quantity: quantityCombo,
        orders: allItemsTmp.map((item, index) => {
          return {
            quantity: quantity[index] === undefined ? [1] : quantity[index],
            option_symbol: item?.symbol,
            side: item?.sides,
          };
        }),
      };
    } else if (quantityCombo === 0 || (quantityCombo === null && showUnderlying === false)) {
      orderData = {
        classType: "option",
        type: selectedMarketLable,
        duration: selectedDurationtLable,
        account_id: balancesObj.selectedAccountId,
        symbol: allItemsTmp[0]?.root_symbol,
        price: selectedPrice,
        stop: selectedStop,
        side: allItemsTmp[0]?.sides,
        quantity: quantity?.length === 0 ? 1 : quantity,
        option_symbol: allItemsTmp[0]?.symbol,
      };
    }

    if (!orderData.symbol && !stockQuantity) return;
    dispatch(fetchPlaceOrderNew(orderData))
      .then((res: any) => {
        if (res?.payload?.data?.order) {
          const commissionValue = res?.payload?.data?.order;
          setCommission(commissionValue);
        }
      })
      .catch((error) => {});
  }, [stockQuantity, allItemsTmp]);

  const ErrorSound = new Howl({
    src: ["../assets/sound/error.mp3"],
    volume: 1.0,
  });
  const debitOrCreditLabel = finalText < 0 ? "Estimated Debit:" : "Estimated Credit:";

  function isObjectEmpty(obj) {
    return Object?.keys(obj)?.length === 0;
  }

  function checkObjectsInArray(arr) {
    return arr?.map((obj) => isObjectEmpty(obj));
  }

  const isEmptyArray = checkObjectsInArray(allItemsTmp);

  useEffect(() => {
    if (allItemsTmp?.length > 2) {
      // If allItemsTmp.length is greater than 2, disable the button, change buttonText to "Add Underlying," and hide the underlying section
      setButtonText("Add Underlying");
      setShowUnderlying(false);
      setQuantityCombo(null);
    }
  }, [allItemsTmp]);

  const toggleUnderlying = () => {
    if (buttonText === "Remove Underlying") {
      setQuantityCombo(null); // Set quantityCombo to null
      setSelectedMarketLable("market");
      setSelectedoptionsTypeData("market");
    }
    setShowUnderlying(!showUnderlying);
    setButtonText(showUnderlying ? "Add Underlying" : "Remove Underlying");
  };

  let getData;
  const selectedOptionData: any = allItemsTmp?.map((option, index) => {
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
    const symbol = option?.root_symbol;
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

  const legs = selectedOptionData?.map((legData) => {
    return { ...legData }; // Create a copy of legData
  });

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
  const getValues = summary.getMinMaxProfit();
  const netValue = summary.calculateNetValue();
  let minValue: string = getValues?.min;

  useEffect(() => {
    if (selectedoptionsTypeData === "debit") {
      let finalBPForDebit: any = addDollarSignCommasToNumber(finalEstimatedCost);
      setBuyingPowerCost(finalBPForDebit);
    } else if (selectedoptionsTypeData === "credit") {
      // let number = parseFloat(minValue.replace(/,/g, ""));
      // let netValueCalc = Math.abs(netValue?.value);
      // let bpCalc = netValueCalc + Math.abs(number) - selectedPrice * 100;
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
              <label>Stock price</label>
              <strong>
                {tradeDataMap[0]?.last === 0 ? 0 : addDollarSignCommasToNumber(tradeDataMap[0]?.last) || "-"}
              </strong>
            </li>
          </ul>
        </div>
        <div className={styles.legInfo}>
          <div className="d-flex justify-content-between  mb-4 align-items-center">
            <h3>Legs </h3>
            <div>
              <Button variant="outline-primary" onClick={toggleUnderlying} disabled={allItemsTmp.length > 2}>
                {buttonText}
              </Button>
              <Button
                variant="outline-primary"
                disabled={allItemsTmp.length >= 4 ? true : false}
                onClick={() => setAllItems([...allItemsTmp, {}])}
              >
                + Add Leg
              </Button>
            </div>
          </div>
          <ul className={styles.legListing}>
            <li>
              <strong className={styles.expiration}>Expiration</strong>
              <strong className={styles.strike}>Strike</strong>
              <strong className={styles.type}>Type</strong>
              <strong className={styles.side}>Side</strong>
              <strong className={styles.quantity}>Quantity</strong>
              <strong className={styles.trade}>Trade type</strong>
            </li>
            {allItemsTmp?.map((item, index) => {
              return (
                <li key={index}>
                  <div className={styles.expiration}>
                    <Form.Select
                      aria-label="Default select example"
                      onChange={(e) => handleExpirationDateChange("expiration_date", e.target.value, index, item)}
                    >
                      <option value="">Expiration</option>
                      {optionStrategiSelectionDates?.date?.map((dateItem) => {
                        return (
                          <option key={dateItem} value={dateItem} selected={item?.expiration_date === dateItem}>
                            {formattedDate(dateItem)}
                          </option>
                        );
                      })}
                    </Form.Select>
                  </div>
                  {/* <div className={styles.strike}>
                    <Form.Select
                      aria-label="Default select example"
                      onChange={(e) => handleExpirationDateChange("strike", Number(e.target.value), index, item)}
                      value={item?.strike}
                    >
                      <option value="Strike" selected={item.strike === "Strike"}>
                        Strike
                      </option>
                      {chainDetials
                        ?.filter((el: any, index: any) => el?.option_type === item?.option_type)
                        .map((el: any, index: any) => (
                          <option key={el.value} value={el.value} selected={item?.strike === el.strike}>
                            {el?.strike}
                          </option>
                        ))}
                    </Form.Select>
                  </div> */}
                  <div className={styles.strike}>
                    <Form.Select
                      aria-label="Default select example"
                      onChange={(e) => handleExpirationDateChange("strike", e.target.value, index, item)}
                      value={item?.strike}
                    >
                      {/* Add a default "Strike" option */}
                      <option value="Strike" selected={!item?.strike}>
                        Strike
                      </option>

                      {/* Map through available strike values */}
                      {item?.availableStrikes?.map((strikeValue) => (
                        <option key={strikeValue} value={strikeValue} selected={item?.strike === strikeValue}>
                          {strikeValue}
                        </option>
                      ))}
                    </Form.Select>
                  </div>
                  <div className={styles.type}>
                    <Form.Select
                      aria-label="Default select example"
                      onChange={(e) => handleExpirationDateChange("option_type", e.target.value, index, item)}
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
                      min="1"
                      placeholder="1"
                      value={quantity[index] ?? ""}
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
                  {/* {chainDetials && (
                    <div className={styles.trade}>
                      <Form.Select
                        aria-label="Default select example"
                        onChange={(e) => handleTradeValueChange(e.target.value, index)}
                        // value={item.ask} // Set the initial value to the "Ask" value of the current item
                      >
                        {chainDetials
                          ?.filter((el) => el.strike === item.strike)
                          ?.map((el, index) => (
                            <option key={index} value={el.ask}>
                              {`Ask ${el.ask}`}
                            </option>
                          ))}
                        {chainDetials
                          ?.filter((el) => el.strike === item.strike)
                          ?.map((el, index) => (
                            <option key={index} value={el.bid}>
                              {`Bid ${el.bid}`}
                            </option>
                          ))}
                        {chainDetials
                          ?.filter((el) => el.strike === item.strike)
                          ?.map((el, index) => (
                            <option key={index} value={el.mid}>
                              {`Mid ${el.mid}`}
                            </option>
                          ))}
                      </Form.Select>
                    </div>
                  )} */}
                  <span className="icon-delete" style={{ cursor: "pointer" }} onClick={() => handleClick(index)}></span>
                </li>
              );
            })}
          </ul>
          {/* <div className={styles.Infodetails}>
            {allItemsTmp.length > 1 ? (
              <Form.Select
                aria-label="Default select example"
                onChange={(e) => setSelectedoptionsTypeData(e.target.value)}
              >
                {optionsTypeData.map((types) => (
                  <option key={types.value} value={types.value}>
                    {types.label}
                  </option>
                ))}
              </Form.Select>
            ) : allItemsTmp.length === 1 && quantityCombo > 0 ? (
              <Form.Select
                aria-label="Default select example"
                onChange={(e) => setSelectedoptionsTypeData(e.target.value)}
              >
                {optionsTypeData.map((types) => (
                  <option key={types.value} value={types.value}>
                    {types.label}
                  </option>
                ))}
              </Form.Select>
            ) : (
              allItemsTmp.length === 1 &&
              !quantityCombo && (
                <Form.Select aria-label="Default select example" onChange={handleSelectMarket}>
                  {optionsMarketData.map((marketType) => (
                    <option key={marketType.value} value={marketType.value}>
                      {marketType.label}
                    </option>
                  ))}
                </Form.Select>
              )
            )}
            {(allItemsTmp.length === 1 && !quantityCombo && selectedMarketLable === "limit") ||
              selectedoptionsTypeData === "debit" ||
              selectedoptionsTypeData === "credit" ? (
              <Form.Control
                type="number"
                placeholder="Price"
                className={styles.formControl}
                onChange={(event) => setSelectedPrice(event.target.value)}
              />
            ) : null}
            {allItemsTmp.length === 1 && !quantityCombo && selectedMarketLable === "stop" ? (
              <Form.Control
                type="number"
                placeholder="Stop"
                className={styles.formControl}
                onChange={(event) => setSelectedStop(event.target.value)}
              />
            ) : null}
            {allItemsTmp.length === 1 && !quantityCombo && selectedMarketLable === "stop_limit" ? (
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
          </div> */}
          {/* =========NEW========== */}
          <div className={styles.Infodetails}>
            {allItemsTmp.length > 1 ? (
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
            ) : allItemsTmp.length === 1 && quantityCombo ? (
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
            {allItemsTmp.length === 1 && !quantityCombo && selectedMarketLable === "limit" && (
              <Form.Control
                type="number"
                placeholder="Price"
                className={styles.formControl}
                onChange={(event) => setSelectedPrice(event.target.value)}
              />
            )}
            {allItemsTmp.length === 1 &&
              !quantityCombo &&
              selectedMarketLable !== "market" &&
              selectedMarketLable === "stop" && (
                <Form.Control
                  type="number"
                  placeholder="Stop"
                  className={styles.formControl}
                  onChange={(event) => setSelectedStop(event.target.value)}
                />
              )}
            {allItemsTmp.length === 1 &&
              !quantityCombo &&
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
            {allItemsTmp.length >= 1 &&
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
          {/* {allItems.length > 1 && (
            <div className={styles.Infodetails}>
              <Form.Select aria-label="Select Order Type" value={selectedOrderType} onChange={handleOrderTypeChange}>
                <option value="market">Market</option>
                <option value="debit">Debit</option>
                <option value="credit">Credit</option>
                <option value="even">Even</option>
              </Form.Select>
              {(selectedOrderType == "debit" || selectedOrderType == "credit") && (
                <Form.Control type="number" placeholder="Price" value={price} onChange={handlePriceChange} />
              )}
              <Form.Select
                aria-label="Select Time in Force"
                value={selectedTimeInForce}
                onChange={handleTimeInForceChange}
              >
                <option value="day">Day</option>
                <option value="gtc">GTC</option>
                <option value="pre">Pre</option>
                <option value="post">Post</option>
              </Form.Select>
            </div>
          )} */}
          {showUnderlying && allItemsTmp.length <= 2 ? (
            <div className={styles.buySell}>
              <>
                <h3>Underlying</h3>
                <Form.Select aria-label="Default select example">
                  <option>{`${tradeDataMap[0]?.symbol || "-"} ${addDollarSignCommasToNumber(stockValue)}`}</option>
                </Form.Select>
                <Form.Select aria-label="Default select example" onChange={(e) => setoptionsDataLable(e.target.value)}>
                  {optionsData?.map((sideOption) => {
                    return (
                      <option key={sideOption.value} value={sideOption.value}>
                        {sideOption.label}
                      </option>
                    );
                  })}
                </Form.Select>
                <Form.Control
                  type="number"
                  min="1"
                  placeholder="0"
                  value={quantityCombo}
                  onChange={(e) => {
                    handleQuantityComboValueChange(e.target.value);
                  }}
                />
              </>
              <div className={styles.stockPrice}>
                <label>Total Stock Price:</label>
                {quantityCombo === 0 || quantityCombo === null ? (
                  <strong>{"--"}</strong>
                ) : (
                  <strong>
                    {tradeDataMapValue[0]?.last === 0
                      ? "0.00"
                      : addDollarSignCommasToNumber(tradeDataMapValue[0]?.last) || "-"}
                  </strong>
                )}
              </div>
            </div>
          ) : (
            ""
          )}
          <div className={styles.legDetails}>
            <h3>Details</h3>
            {allItemsTmp?.map((item, index) => {
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
                          ? addDollarSignCommasToNumber(item?.mid) || addDollarSignCommasToNumber(item?.mid)
                          : "0.00"}
                      </strong>
                      <span>({addDollarSignCommasToNumber(item?.change)})</span>
                    </div>
                  </div>
                </Alert>
              );
            })}
          </div>
          <div className={styles.orderNetQuote}>
            <div className={styles.qoute}>
              <h3 className={styles.netQuote}>Net Quote</h3>
              <div className="stockDetails buyStrategies">
                <ul>
                  <li>
                    {bidCost < 0 ? <label>Credit Bid</label> : <label>Debit Bid</label>}
                    <strong>{addDollarSignCommasToNumber(Math.abs(bidCost))}</strong>
                  </li>
                  <li>
                    {midCost < 0 ? <label>Credit Mid</label> : <label>Debit Mid</label>}
                    <strong>{addDollarSignCommasToNumber(Math.abs(midCost))}</strong>
                  </li>
                  <li>
                    {askCost < 0 ? <label>Credit Ask</label> : <label>Debit Ask</label>}
                    <strong>{addDollarSignCommasToNumber(Math.abs(askCost))}</strong>
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
                    {commission?.commission ? (
                      <strong> {addDollarSignCommasToNumber(commission?.commission)}</strong>
                    ) : (
                      "-"
                    )}
                  </li>
                  {commission?.cost && (
                    <li>
                      <label>Buying Power {commission?.cost < 0 ? " Increase " : " Decrease "} by</label>
                      {/* <strong>{formatValue(minValue) || "-"}</strong> */}
                      <strong>{addDollarSignCommasToNumber(Math.abs(commission?.cost)) || "-"}</strong>
                    </li>
                  )}
                  {/* <li> */}
                  {/* <label>
                      {estimateText === "Estimated Credit:" ? "Buying power Decrease by" : "Buying power Increase by"}
                    </label> */}
                  {/* <strong>{formatValue(minValue) || "-"}</strong> */}
                  {/* <strong>{buyingPowerCost || "-"}</strong> */}
                  {/* </li> */}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.totalPrice}>
          <label>Estimated {commission?.order_cost > 0 ? "Debit" : "Credit"}</label>
          <strong>{addDollarSignCommasToNumber(Math.abs(commission?.order_cost || 0))} </strong>
        </div>

        <div className={styles.action}>
          <div className="d-grid gap-2">
            <Button
              variant="success"
              className={styles.Preview}
              onClick={handleSellBuy}
              disabled={
                isEmptyArray.some((isEmpty) => isEmpty) ||
                !selectedStrikes ||
                (selectedMarketLable === "limit" && !selectedPrice) ||
                (selectedoptionsTypeData === "debit" && !selectedPrice) ||
                (selectedoptionsTypeData === "credit" && !selectedPrice) ||
                (selectedMarketLable === "stop" && !selectedStop) ||
                (selectedMarketLable === "stop_limit" && (!selectedPrice || !selectedStop)) ||
                allItemsTmp.some((item) => item?.strike === "Strike") ||
                allItemsTmp.some((item) => item?.option_type === "Type") ||
                allItemsTmp.some((item) => item?.sides === "Side") ||
                allItemsTmp.some((item) => !item?.option_type) ||
                allItemsTmp.some((item) => !item?.sides) ||
                allItemsTmp.some((item) => {
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
              {/* {loading ? (
                <div>
                  <Spinner animation="border" />
                </div>
              ) : (
                <> */}
              <span className="icon-buy"></span> Place Order
              {/* </>
              )} */}
            </Button>
            <ToastContainer
              position="top-end"
              className="p-4"
              style={{ position: "fixed", top: "20px", right: "20px", zIndex: "9999" }}
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
                        {" "}
                        {errorMsg.length > 0 ? (
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
          </div>
        </div>
      </form>
    </Offcanvas.Body>
  );
};
export default BuyStrategies;
