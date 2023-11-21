"use client";
import React, { useEffect, useState, useMemo, useRef } from "react";
import styles from "@/styles/strategies.module.scss";
import { Badge, Button, ButtonGroup, Dropdown, Tab, Tabs, Offcanvas, Popover, Form, Overlay } from "react-bootstrap";
import Link from "next/link";
import dynamic from "next/dynamic";
import _ from "lodash";
import StrategiesSidebar from "./StrategiesSidebar";
import StrategiesTable from "./strategiesTable";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

import { useAppDispatch, useAppSelector } from "@/hooks/reduxCommon";
import { fetchOptionGreek, optionGreekData, optionGreekStatus } from "@/redux/slices/optionGreekSlice";
import { fetchTradeData, tradingData, tradingDataStatusNum } from "@/redux/slices/tradeDataSlice";
import { setStrategyData } from "@/redux/slices/allStrategiesSlice";
import { useRouter, useSearchParams } from "next/navigation";
import DateSlider from "@/app/trade/DateSlider";
import Alert from "react-bootstrap/Alert";
import BuyStrategies from "@/app/strategies/buystrateigs";
import SummaryHelper from "@/utils/OptionStrategyCalculation";
import options from "@/utils/optionSummeryCalc";
import SpreadSheetViewModel from "@/utils/SpreadSheetCalculation";
import { setData, setLoading } from "@/redux/slices/optionTypeSlice";
import KnowMore from "./knowmore";
import { useTranslation } from "react-i18next";
import DoubleLeg from "@/utils/doubleLegStrategy";
import TripleLeg from "@/utils/tripleLegStrategy";
import MultiLeg from "@/utils/multiLegStrategy";
import { Timeline } from "./timeline";
import { Leg } from "@/utils/legs";
import { optionStrategiSelectionData } from "@/redux/slices/optionStrategySlice";
import { setDatesIndexes } from "@/redux/slices/allDatesIndexSlice";
import { data } from "@/utils/knowmore";
import { setDatesSelection } from "@/redux/slices/datesSelectionSlice";
import { addCommasFixedTwoToNumber, addCommasToNumber } from "@/utils/prize";
import { fetchOptionGreekChains } from "@/redux/slices/optionGreekChainsSlice";
import Loader from "@/components/loader";
import { getStrategyIdFromLegs, addDollarSignCommasToNumber } from "@/utils/positions";
import { getStratergyNameForStrategyId } from "@/constants/searchStrategiesObjectData";

const StratergiesChart = dynamic(() => import("@/components/charts/stratergychart"), {
  ssr: false,
});
enum LegType {
  Call = 0,
  Put = 1,
  Stock = 2,
}
export enum DirectionType {
  Buy = 1,
  Sell = -1,
}

enum FilterType {
  ProfitLossDollar = 0,
  ProfitLossPercentage = 1,
}

enum ActiveTabType {
  table = "table",
  graph = "graph",
}

interface IElement {
  id: number;
  x: number;
  y: number;
  title: number;
  purchase: number;
  type: number;
  category: number;
}

const Strategies = ({ tradeData, getYaxisData, data1, getExpiryDate, values1, strategyType, tradeDataStock1 }) => {
  const selectedExpirationDate: any = useAppSelector(optionGreekData);
  const valuesForTrade: any = useAppSelector(tradingData);
  const allStrategies: any = useAppSelector((state) => state.allStrategies?.strategies);
  const searchParams = useSearchParams();
  const [showPopup, setShowPopup] = useState(false);
  const [target, setTarget] = useState(null);
  const [coveredShares, setCoveredShares] = useState(1);
  const search: string | null = searchParams.get("q");
  const analyzeUpdateId = useRef(null);
  const expirationUri: string | null = searchParams.get("expiration");
  const dispatch = useAppDispatch();
  const [expiryDate, setExpiryDate] = useState<any>();
  const [show, setShow] = useState(false);
  const [showAlert, setShowAlert] = useState(true);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [value1, setValue] = useState<number>(0);
  const [updatedRange, setUpdatedRange] = useState<number>(0);
  const [filtertype, setFilterType] = useState(FilterType.ProfitLossPercentage);
  const [activeTabKey, setActiveTabKey] = useState<string>(ActiveTabType.graph);
  const [yAxisState, setYAxis] = useState([]);
  const [containerState, setContainer] = useState([]);
  const [delta, setDelta] = useState<number>(null);
  const [theta, setTheta] = useState<number>(null);
  const [gamma, setGamma] = useState<number>(null);
  const [vega, setVega] = useState<number>(null);
  const [rho, setRho] = useState<number>(null);
  const [strategiesNameNew, setStrategiesName] = useState("");
  const [strategySelection, setStrategySelection] = useState({
    type: "call",
    optionType: "call",
    legType: LegType.Call,
    direction: DirectionType.Buy,
    strategyTypeForLeg: "Long Call",
    legType1: LegType.Stock,
    legType2: LegType.Call,
    legType3: LegType.Call,
    direction1: DirectionType.Buy,
    direction2: DirectionType.Sell,
    direction3: DirectionType.Sell,
  });
  const [strategy, setStrategy] = useState<any>({});
  const [pageLoading, setPageLoading] = useState({ message: "", loading: false });
  const [alerts, setAlerts] = useState<any>([]);
  const [strategyTypeForLeg, setStrategyTypeForLeg] = useState<string>("");
  const [volatility, setVolatility] = useState<number>(40);
  const [elements, setElementsCount] = useState<any>();
  const [yValue, setYValue] = useState<number>();
  const [greeksValues, setGreekValues] = useState<any>([]);
  const router = useRouter();
  const selectedDate = useAppSelector((state) => state.datesSelected.date);
  const [newlyAddedLeg, setNewlyAddedLeg] = useState<Leg>({
    strike: 0,
    size: 1,
    purchasePrice: 0,
    direction: DirectionType.Buy,
    type: LegType.Call,
    expiration: new Date(),
    symbol: "",
    volatility: 1,
    range: 1,
    indexOfStrikePrice: 1,
    index: 1,
    y: 0,
  });
  const [newlyAddedElement, setNewlyAddedElement] = useState<IElement>({
    id: 10,
    x: 2400,
    y: 10,
    title: 240,
    purchase: 0,
    type: LegType.Call,
    category: DirectionType.Buy,
  });
  const [selectedSymbol, setSelectedSymbol] = useState<any>(null);
  const [expirationDateUTC, setExpirationDateUTC] = useState<any>(null);
  const [showUnderLying, setShowUnderLying] = useState<boolean>(false);
  const [nearestStrike, setNearestStrike] = useState();
  const { t, i18n } = useTranslation();
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  // make symbol accordind to date and strike
  const getSymbolValue = (item, ticker, date) => {
    const strikeVal = String(item?.strike * 1000).padStart(8, "0");
    const expirationFormatted = date?.split("-")[0]?.substring(2) + date?.split("-")[1] + date?.split("-")[2];
    const typeValue = item?.type === 0 ? "C" : item?.type === 1 ? "P" : "";
    const symbolCheck = ticker + expirationFormatted + typeValue + strikeVal;
    return symbolCheck;
  };

  let spredTable = useMemo(() => {
    const SpreadSheetView = new SpreadSheetViewModel(strategy, filtertype);
    SpreadSheetView.setChartRange(value1);
    SpreadSheetView.calculateData();
    const { yAxis, container } = SpreadSheetView.getDetails();
    setYAxis(yAxis);
    setContainer(container);

    return SpreadSheetView;
  }, [strategy, filtertype, value1]);

  const spreadTableForProfitLoss = useMemo(() => {
    const SpreadSheetView = new SpreadSheetViewModel(strategy, 0);
    SpreadSheetView.setChartRange(value1);
    SpreadSheetView.calculateData();
    const { yAxis, container } = SpreadSheetView.getDetails();
    return container;
  }, [strategy, value1]);

  useEffect(() => {
    let chainStrategy = JSON.parse(sessionStorage.getItem("chainStrategy") || null);
    if (chainStrategy && expirationUri === selectedExpirationDate[0]?.expiration_date) {
      // setPageLoading({ message: "line 183 triggered", loading: true });
      if (analyzeUpdateId?.current) {
        clearTimeout(analyzeUpdateId?.current);
      }

      analyzeUpdateId.current = setTimeout(() => {
        sessionStorage.removeItem("chainStrategy");
        const legs = chainStrategy?.legs?.map((leg) => {
          return { ...leg, expiration: new Date(leg.expiration) };
        });
        setStrategy({ ...chainStrategy, legs });
        // setPageLoading({ message: "line 183 stopped", loading: false });
      }, 3000);
    }
  }, [selectedExpirationDate, allStrategies]);

  useEffect(() => {
    if (search) {
      dispatch(fetchTradeData(search));
    }
  }, [search, dispatch]);

  useEffect(() => {
    if (expirationUri && expirationUri !== selectedDate) {
      dispatch(setDatesSelection(expirationUri));
    }
  }, [expirationUri]);

  useEffect(() => {
    if (selectedDate) {
      dispatch(fetchOptionGreek({ searchKey: search, expiration: selectedDate }));
      setPageLoading({ message: "", loading: true });
      dispatch(fetchOptionGreekChains({ searchKey: search, expiration: selectedDate }))
        .then(() => {
          setPageLoading({ message: "", loading: false });
        })
        .catch((error) => {
          setPageLoading({ message: "", loading: false });
        });
    }
  }, [search, selectedDate]);

  useEffect(() => {
    if (allStrategies?.legs) {
      setStrategy(allStrategies);
    }
  }, [allStrategies]);
  useEffect(() => {
    if (strategy && Object.keys(strategy || {}).length) {
      //dispatch(setStrategyData(strategy));
      if (!value1) {
        initialValue(strategy);
      }
    }
  }, [strategy]);

  useMemo(() => {
    if (!_.isEqual(strategy, allStrategies)) {
      dispatch(setStrategyData(strategy));
    }
  }, [strategy]);

  //let expirationDateUTC;
  useEffect(() => {
    const expirationDates = new Date(selectedDate);
    let expirationDateUTCTemp = new Date(
      expirationDates.getUTCFullYear(),
      expirationDates.getUTCMonth(),
      expirationDates.getUTCDate(),
      expirationDates.getUTCHours(),
      expirationDates.getUTCMinutes(),
      expirationDates.getUTCSeconds()
    );
    expirationDateUTCTemp.setHours(16, 0, 0, 0);

    setExpirationDateUTC(expirationDateUTCTemp);

    handleStrategySelection(false, expirationDateUTCTemp);
    if (selectedExpirationDate[0]?.root_symbol && selectedExpirationDate[0]?.root_symbol !== selectedSymbol) {
      setSelectedSymbol(selectedExpirationDate[0]?.root_symbol);
    }
  }, [selectedExpirationDate]);

  const tradeDataMap = valuesForTrade.filter((item: any) => item?.symbol === search);
  const tradeDataStock = parseFloat(tradeDataMap[0]?.last);

  useEffect(() => {
    let arr: any = [];
    if (selectedExpirationDate.length > 0) {
      selectedExpirationDate.forEach((item: any) => {
        const trimNumber = item.strike;
        arr.push(trimNumber);
      });

      const nearestStrike = Math.min(...arr.filter((strike: number) => strike >= tradeDataStock));
      const nearestObject = selectedExpirationDate.find((item: any) => item.strike === nearestStrike);
      setExpiryDate(nearestObject?.expiration_date);
      setNearestStrike(nearestObject?.strike);
    }
  }, [selectedExpirationDate, tradeDataStock]);

  useEffect(() => {
    const strategyId = getStrategyIdFromLegs(allStrategies?.legs);
    const strategiesName = Number(strategyId) === 0 ? "Custom" : getStratergyNameForStrategyId(strategyId);
    setStrategiesName(strategiesName);
  }, [allStrategies]);

  const handleStrategySelection = (typChange: boolean, expirationDateUTCTemp?: any) => {
    let chainStrategy = JSON.parse(sessionStorage.getItem("chainStrategy") || null);
    if (chainStrategy) {
      return;
    }
    // setPageLoading({ message: "line 286 triggered", loading: true });

    const {
      legType,
      optionType,
      direction,
      strategyTypeForLeg,
      legType1,
      legType2,
      direction1,
      direction2,
      legType3,
      direction3,
    } = strategySelection;

    let getData: any = [];
    if (strategySelection.type === "call") {
      getData = options(tradeDataStock, legType, optionType, direction, strategyTypeForLeg);
    } else if (strategySelection.type === "double leg") {
      getData = DoubleLeg(tradeDataStock, legType1, direction1, legType2, direction2, strategyTypeForLeg);
    } else if (strategySelection.type === "triple leg") {
      getData = TripleLeg(
        tradeDataStock,
        legType,
        direction,
        legType1,
        direction1,
        legType2,
        direction2,
        strategyTypeForLeg
      );
    } else if (strategySelection.type === "multi leg") {
      getData = MultiLeg(
        tradeDataStock,
        legType,
        direction,
        legType1,
        direction1,
        legType2,
        direction2,
        legType3,
        direction3,
        strategyTypeForLeg
      );
    }

    setStrategy(getData);
    // setPageLoading({ message: "line 333 stopped", loading: false });
    setStrategyTypeForLeg(strategySelection.strategyTypeForLeg);
  };

  useEffect(() => {
    if (strategySelection) {
      handleStrategySelection(true);
    }
  }, [strategySelection]);

  const handleRangeSlider = (value: any) => {
    setValue(value);
    spredTable.setChartRange(value);
    const { yAxis, container } = spredTable.getDetails();
    setYAxis(yAxis);
    setContainer(container);
    spredTable.calculateData();
  };

  useEffect(() => {
    if (allStrategies?.legs) {
      const getVolatility = allStrategies?.legs?.map((leg: Leg) => {
        if (leg?.volatility) {
          const volatilityCalc = +leg?.volatility;
          return volatilityCalc;
        }
        return 0;
      });
      if (getVolatility.length > 0) {
        const sumVolatility = getVolatility.reduce(
          (accumulator: number, currentValue: number) => accumulator + currentValue,
          0
        );
        const averageVolatility = sumVolatility / getVolatility.length;
        setVolatility(averageVolatility);
      }
    }
  }, [allStrategies]);

  const handleVolatilitySlider = (value: any) => {
    setVolatility(value);
    if (strategy && strategy?.legs) {
      const legsArray = allStrategies?.legs.map((leg: Leg) => {
        return { ...leg, volatility: +value };
      });
      const newStrategy = { ...strategy, legs: legsArray };
      setStrategy(newStrategy);
    }
  };

  useEffect(() => {
    if (containerState && containerState.length > 0) {
      dispatch(setData(containerState));
      dispatch(setLoading(false));
    }
  }, [containerState, dispatch]);
  const summary = useMemo(() => {
    return new SummaryHelper(allStrategies);
  }, [allStrategies]);

  const Breakeven = useMemo(() => summary.getBreakEvenValue(), [summary]);
  const getValues = useMemo(() => summary.getMinMaxProfit(), [summary]);
  const netValue = useMemo(() => summary.calculateNetValue(), [summary]);
  let initialRange = 0;

  const initialValue: any = (strategy) => {
    const expirationDate = strategy?.legs?.find((leg) => leg.type !== "stock")?.expiration;

    if (expirationDate) {
      for (let range = 5; range < 100; range += 5) {
        spredTable.setChartRange(range);
        const data: { [key: number]: number } = spredTable.getDataForSelectedDate(expirationDate);
        const model = new SummaryHelper(spredTable.strategy);

        let breakPointWithoutCurrency = model.getBreakEvenValue()?.replace(/\$/g, "");
        breakPointWithoutCurrency = breakPointWithoutCurrency?.replace(/ /g, "");
        const breakPoints = breakPointWithoutCurrency
          ?.split(",")
          ?.map((value) => parseFloat(value))
          .filter((value) => !isNaN(value));
        const xAxisValues: number[] = Object.keys(data)?.map(Number);
        const maxXValue = Math.max(...xAxisValues);
        const minXValue = Math.min(...xAxisValues);

        const shouldIncreaseRange: boolean = spredTable.checkForChartRange(maxXValue, minXValue, breakPoints);

        if (!shouldIncreaseRange) {
          handleRangeSlider(range);
          initialRange = range;
          break;
        }
      }
    }
  };

  useEffect(() => {
    if (elements?.length > 0) {
      if (greeksValues && greeksValues.length > 0) {
        let sumDelta = 0;
        let sumTheta = 0;
        let sumGamma = 0;
        let sumVega = 0;
        let sumRHO = 0;
        greeksValues?.map((item) => {
          const deltaValue = item?.greeks?.delta * 100 * item?.direction;
          sumDelta += deltaValue;
          setDelta(sumDelta);
          const thetaValue = item?.greeks?.theta * 100 * item?.direction;
          sumTheta += thetaValue;
          setTheta(sumTheta);
          const gammaValue = item?.greeks?.gamma * 100 * item?.direction;
          sumGamma += gammaValue;
          setGamma(sumGamma);
          const vegaValue = item?.greeks?.vega * 100 * item?.direction;
          sumVega += vegaValue;
          setVega(sumVega);
          const RHOValue = item?.greeks?.rho * 100 * item?.direction;
          sumRHO += RHOValue;
          setRho(sumRHO);
        });
      }
    } else {
      setDelta(0);
      setTheta(0);
      setGamma(0);
      setVega(0);
      setRho(0);
    }
  }, [greeksValues, elements, selectedExpirationDate]);

  const addDollorToValues = (value: string) => {
    const absValue = Math.abs(parseInt(value));
    const valueWithDollor = parseInt(value) < 0 ? "-$" + absValue : "$" + absValue;
    return valueWithDollor;
  };
  const handleAddLegsStrike = (legType: string) => {
    let arr: any = [];
    const parts = legType.split("-");
    let type = "";
    if (parts.length > 1) {
      type = parts[1];
    }
    let strikeValue =
      allStrategies?.legs?.length > 0
        ? allStrategies?.legs[allStrategies?.legs.length - 1]?.strike + 10
        : nearestStrike;

    let purchaseValue = 0;
    let volatilityValue = 0;
    const matchingObjects = selectedExpirationDate.filter((selectedItem) => {
      return selectedItem.strike === strikeValue && selectedItem.option_type === type;
    });

    if (matchingObjects && matchingObjects.length > 0) {
      purchaseValue = matchingObjects[0]?.ask + matchingObjects[0]?.bid / 2;
      volatilityValue = matchingObjects[0]?.greeks?.mid_iv * 100;
    }

    const maxId = Math.max(...elements.map((o) => o.id));

    switch (legType) {
      case "buy-call":
        const elementBuyCall = {
          id: maxId + 1,
          x: strikeValue * 9.4,
          y: -24,
          title: strikeValue,
          purchase: purchaseValue,
          volatilty: volatilityValue,
          type: LegType.Call,
          category: DirectionType.Buy,
        };
        const legElementForBuyCall = {
          strike: strikeValue,
          size: 1,
          actualQualtity: DirectionType.Buy,
          purchasePrice: purchaseValue,
          direction: DirectionType.Buy,
          type: LegType.Call,
          expiration: expirationDateUTC,
          symbol: "",
          volatility: volatilityValue,
          range: 1,
          indexOfStrikePrice: 1,
          index: 1,
          y: 0,
        };

        setNewlyAddedElement(elementBuyCall);
        setNewlyAddedLeg(legElementForBuyCall);
        break;
      case "buy-put":
        const elementBuyPut = {
          id: maxId + 1,
          x: strikeValue * 9.4,
          y: -24,
          title: strikeValue,
          purchase: purchaseValue,
          volatilty: volatilityValue,
          type: LegType.Put,
          category: DirectionType.Buy,
        };
        const legElementForBuyPut = {
          strike: strikeValue,
          size: 1,
          actualQualtity: DirectionType.Buy,
          purchasePrice: purchaseValue,
          direction: DirectionType.Buy,
          type: LegType.Put,
          expiration: expirationDateUTC,
          symbol: "",
          volatility: volatilityValue,
          range: 1,
          indexOfStrikePrice: 1,
          index: 1,
          y: 0,
        };
        setNewlyAddedElement(elementBuyPut);
        setNewlyAddedLeg(legElementForBuyPut);
        break;
      case "sell-call":
        const elementSellCall = {
          id: maxId + 1,
          x: strikeValue * 9.4,
          y: -24,
          title: strikeValue,
          purchase: purchaseValue,
          volatilty: volatilityValue,
          type: LegType.Call,
          category: DirectionType.Sell,
        };
        const legElementForSellCall = {
          strike: strikeValue,
          size: -1,
          actualQualtity: DirectionType.Sell,
          purchasePrice: purchaseValue,
          direction: DirectionType.Sell,
          type: LegType.Call,
          expiration: expirationDateUTC,
          symbol: "",
          volatility: volatilityValue,
          range: 1,
          indexOfStrikePrice: 1,
          index: 1,
          y: 0,
        };
        setNewlyAddedElement(elementSellCall);
        setNewlyAddedLeg(legElementForSellCall);
        break;
      case "sell-put":
        const elementSellPut = {
          id: maxId + 1,
          x: strikeValue * 9.4,
          y: -24,
          title: strikeValue,
          purchase: purchaseValue,
          volatilty: volatilityValue,
          type: LegType.Put,
          category: DirectionType.Sell,
        };
        const legElementForSellPut = {
          strike: strikeValue,
          size: -1,
          actualQualtity: DirectionType.Sell,
          purchasePrice: purchaseValue,
          direction: DirectionType.Sell,
          type: 1,
          expiration: expirationDateUTC,
          symbol: "",
          volatility: volatilityValue,
          range: 1,
          indexOfStrikePrice: 1,
          index: 1,
          y: 0,
        };
        setNewlyAddedElement(elementSellPut);
        setNewlyAddedLeg(legElementForSellPut);
        break;

      default:
        break;
    }
  };

  const handleAddStock = (type: string) => {
    setShowAlert(true);
    const newAlert = `${type} 100 shares at $ ${tradeDataStock}`;
    const stockPrice = tradeDataStock.toFixed(2);
    const variantClass = type === "Long" ? "success" : type === "Short" ? "danger" : null;
    setAlerts([
      ...alerts,
      {
        text: newAlert,
        variant: variantClass,
        price: stockPrice,
        quantity: 1,
        type,
        tradeDataStock,
      },
    ]);
    setCoveredShares(1);
    setShowUnderLying(true);
  };
  useEffect(() => {
    const matchingItem = elements?.find((item) => item.title === tradeDataStock);
    if (matchingItem) {
      const newAlert = `${matchingItem.type === 2 ? "Long" : ""} 100 shares at $ ${tradeDataStock}`;

      const stockPrice = tradeDataStock;
      const variantClass =
        matchingItem.type === 0 || matchingItem.type === 2 ? "success" : matchingItem.type === 1 ? "danger" : null;
      setAlerts(() => [
        {
          text: newAlert,
          variant: variantClass,
          price: stockPrice,
          quantity: 1,
          type: matchingItem.type === 2 ? "Long" : "",
          tradeDataStock,
        },
      ]);
      setCoveredShares(1);
    }

    const isUnderLying = elements?.find((item) => item?.underlying);
    if (isUnderLying) {
      const newAlert = `${isUnderLying.type === 2 ? "Long" : ""} ${
        isUnderLying.quantity * 100
      } shares at $ ${tradeDataStock}`;
      const stockPrice = isUnderLying.strike;
      const variantClass =
        isUnderLying.type === 0 || isUnderLying.type === 2 ? "success" : isUnderLying.type === 1 ? "danger" : null;
      setAlerts(() => [
        {
          text: newAlert,
          variant: variantClass,
          price: stockPrice,
          quantity: isUnderLying.quantity,
          type: isUnderLying.type === 2 ? "Long" : "",
          tradeDataStock,
        },
      ]);
      setCoveredShares(isUnderLying.quantity);
    }
  }, [elements, tradeDataStock]);
  useMemo(() => {}, [coveredShares]);

  const handleClearAll = () => {
    setAlerts([]);
    setShowUnderLying(false);
    const updatedItems = [];
    if (strategy && strategy.legs) {
      const updatedLegs = [];
      let newStrategy = { ...strategy, legs: updatedLegs };
      dispatch(setStrategyData(newStrategy));
    }
    setElementsCount(updatedItems);
  };

  useEffect(() => {
    setUpdatedRange(value1);
  }, [value1]);

  useEffect(() => {
    setUpdatedRange(volatility);
  }, [volatility]);

  const handleCloseAlert = (index) => {
    // const updatedAlerts = [...alerts];
    // updatedAlerts.splice(index, 1); // Remove the alert at the current index
    // setAlerts(updatedAlerts); // Update the state to remove the alert
    // if (!updatedAlerts.length) {
    //   setShowUnderLying(false);
    // }
    if (strategy && strategy.legs) {
      const updatedLegsNew = allStrategies?.legs.filter((leg) => leg.type !== 2);
      let newStrategy = { ...strategy, legs: updatedLegsNew };
      dispatch(setStrategyData(newStrategy));
    }
    setAlerts([]);
  };
  const disabledElement =
    elements && elements?.some((item) => item.type === 2) ? elements?.length >= 5 : elements && elements?.length >= 4;

  const [selectedStrategy, setSelectedStrategy] = useState(null);
  const [showChild, setShowChild] = useState(false);
  const KnowMoreClick = () => {
    setSelectedStrategy(strategiesNameNew);
    setShowChild(true);
  };
  const [categoryName, setCategoryName] = useState(null);
  const handleDataUpdate = (newData: string) => {
    setCategoryName(newData);
    categoryName == false ? setShowChild(false) : "";
  };

  const selectedStrategyData = data.find((strategy) => strategy.name === strategiesNameNew);

  const result = strategy?.legs;
  const filteredTypeCheck = result?.filter((obj) => obj.type === 2 || showUnderLying);
  const showUnderlyingSec = filteredTypeCheck?.length > 0;

  const netTitle = netValue?.title;
  return (
    <main className={styles.strategies}>
      <div className="row m-0 strategiesContainer">
        <StrategiesSidebar setStrategySelection={setStrategySelection} onDataUpdate={handleDataUpdate} />
        <section className="col-12 col-lg-10 col-md-9 p-0">
          <div className={styles.optionHeader}>
            <div className={styles.leftHead}>
              <h5>
                {allStrategies?.legs?.length > 0 ? strategiesNameNew : ""}

                {allStrategies?.legs?.length > 0
                  ? selectedStrategyData?.categories.map((cat, index) => (
                      <Badge key={index} bg={cat?.color}>
                        <span className={cat?.icon}></span> {cat?.name}
                      </Badge>
                    ))
                  : null}
              </h5>
              {allStrategies?.legs?.length > 0 && strategiesNameNew !== "Custom" && allStrategies?.name !== "Custom" ? (
                <>
                  <p>{selectedStrategyData?.preview}</p>
                  <span className="text-primary cursor" key={strategiesNameNew} onClick={KnowMoreClick}>
                    Know more
                  </span>
                </>
              ) : null}
            </div>
            <div className={styles.rightBtn}>
              <Dropdown>
                <Dropdown.Toggle variant="outline-primary" id="dropdown-split-basic">
                  + &nbsp; {t("strategiesDrop.Add")}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.ItemText>{t("strategiesDrop.Options")}</Dropdown.ItemText>
                  <Dropdown.Item disabled={disabledElement} onClick={() => handleAddLegsStrike("buy-call")}>
                    {t("strategiesDrop.Buy Call")}
                    <span className="icon-double_arrow"></span>
                  </Dropdown.Item>
                  <Dropdown.Item disabled={disabledElement} onClick={() => handleAddLegsStrike("buy-put")}>
                    {t("strategiesDrop.Buy Put")} <span className="icon-double_arrow"></span>
                  </Dropdown.Item>
                  <Dropdown.Item disabled={disabledElement} onClick={() => handleAddLegsStrike("sell-call")}>
                    {t("strategiesDrop.Sell Call")} <span className="icon-double_arrow red"></span>
                  </Dropdown.Item>
                  <Dropdown.Item disabled={disabledElement} onClick={() => handleAddLegsStrike("sell-put")}>
                    {t("strategiesDrop.Sell Put")} <span className="icon-double_arrow red"></span>
                  </Dropdown.Item>
                  <Dropdown.ItemText>{t("strategiesDrop.Underlying")}</Dropdown.ItemText>
                  <Dropdown.Item disabled={alerts && alerts.length >= 1} onClick={() => handleAddStock("Long")}>
                    {t("strategiesDrop.Buy")} {tradeDataMap[0]?.symbol} <span className="icon-double_arrow"></span>
                  </Dropdown.Item>
                  <Dropdown.Item disabled={alerts && alerts.length >= 1} onClick={() => handleAddStock("Short")}>
                    {t("strategiesDrop.Sell")} {tradeDataMap[0]?.symbol} <span className="icon-double_arrow"></span>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>

              <div
                style={{
                  cursor: alerts?.length === 0 && elements?.length === 0 ? "not-allowed" : "pointer",
                }}
              >
                <Button
                  disabled={alerts?.length === 0 && elements?.length === 0}
                  variant="outline-primary"
                  onClick={handleShow}
                >
                  <span className="icon-link"></span>
                  {t("Chain.Place Order")}
                </Button>
              </div>
            </div>
          </div>
          <DateSlider setType={() => {}} page="option-strategies" elements={elements} />

          {showChild && <KnowMore Category={selectedStrategy} onDataUpdate={handleDataUpdate}></KnowMore>}

          <div className={styles.strategiesDetails}>
            <div className={`${styles.stockContainer}`}>
              <ul>
                <li>
                  <label>{netValue?.title === "Net Credit" ? "Net Credit" : `${t("StockInfo.Net Debit")}`}</label>
                  <strong>{netValue?.value ? <> {addDollarSignCommasToNumber(netValue?.value)}</> : "$0"}</strong>
                </li>
                <li>
                  <label>{t("StockInfo.Max Loss")}</label>
                  <strong>{addDollarSignCommasToNumber(getValues?.min)}</strong>
                </li>
                <li>
                  <label>{t("StockInfo.Max Profit")}</label>
                  <strong>{addDollarSignCommasToNumber(getValues?.max)}</strong>
                </li>
                <li>
                  <label>{t("StockInfo.Breakeven")}</label>
                  <strong>{Breakeven}</strong>
                </li>
              </ul>
            </div>
            <div className="">
              <ul>
                <li className={styles.greekValue}>
                  <strong>Greek Value:</strong>
                </li>
                <li>
                  <label>{t("StockInfo.Delta")} (Δ)</label>
                  <strong>{addDollarSignCommasToNumber(delta)}</strong>
                </li>
                <li>
                  <label>{t("StockInfo.Theta")}(Θ)</label>
                  <strong>{addDollarSignCommasToNumber(theta)}</strong>
                </li>
                <li>
                  <label>{t("StockInfo.Gamma")}(Γ)</label>
                  <strong>{addDollarSignCommasToNumber(gamma)}</strong>
                </li>
                <li>
                  <label>{t("StockInfo.Vega")} (v)</label>
                  <strong>{addDollarSignCommasToNumber(vega)}</strong>
                </li>
                <li>
                  <label>{t("StockInfo.RHO")}(ρ)</label>
                  <strong>{addDollarSignCommasToNumber(rho)}</strong>
                </li>
              </ul>
            </div>
          </div>
          {pageLoading.loading && (
            <>
              <Loader />
            </>
          )}
          <div style={{ opacity: pageLoading.loading ? 0 : 1 }}>
            <div className={styles.tabsAlert}>
              {showUnderlyingSec &&
                alerts?.map((item, index) => {
                  return (
                    <div
                      key={item.text}
                      onClick={(e) => {
                        setTarget(e.target);
                        setShowPopup(true);
                        setCoveredShares(item.quantity);
                      }}
                    >
                      <Alert
                        key={index}
                        variant={item.variant}
                        show={showAlert}
                        className={styles.sucessmsg}
                        onClose={() => handleCloseAlert(index)}
                        dismissible
                      >
                        Shares at {strategy?.legs?.[0]?.size * 100} at {item?.tradeDataStock?.toFixed(2)}
                      </Alert>
                    </div>
                  );
                })}
              <Overlay
                show={showPopup}
                target={target}
                placement="bottom"
                containerPadding={20}
                rootClose
                onHide={() => setShowPopup(false)}
              >
                <Popover id="popover-contained" className="TimelinePopup">
                  <Popover.Header as="h3">Shares</Popover.Header>
                  <Popover.Body>
                    <div className="qty" style={{ display: "flex" }}>
                      <label>Quantity</label>
                      <div className="quantity">
                        <button
                          onClick={() => {
                            setStrategy((prev) => {
                              let legs = [...(prev?.legs || [])];
                              legs = legs.map((leg, index) => {
                                const prevLeg = { ...leg };
                                if (index == 0) {
                                  prevLeg.size = prevLeg.size == 1 ? -1 : --prevLeg.size;
                                }
                                return prevLeg;
                              });
                              return { ...prev, legs };
                            });
                          }}
                          className="minus"
                        >
                          <span className="icon-previous"></span>
                        </button>
                        <Form.Control type="number" value={`${strategy?.legs?.[0]?.size}`} readOnly />
                        <button
                          onClick={() => {
                            setStrategy((prev) => {
                              let legs = [...(prev?.legs || [])];
                              legs = legs.map((leg, index) => {
                                const prevLeg = { ...leg };
                                if (index == 0) {
                                  prevLeg.size = prevLeg.size == -1 ? 1 : ++prevLeg.size;
                                }
                                return prevLeg;
                              });
                              return { ...prev, legs };
                            });
                          }}
                          className="plus"
                        >
                          <span className="icon-next"></span>
                        </button>
                      </div>
                    </div>
                  </Popover.Body>
                </Popover>
              </Overlay>
              <div className={"ms-auto strategiesBtn"}>
                <Button variant="link" className="clearAll" onClick={handleClearAll}>
                  Clear All
                </Button>
                {activeTabKey === ActiveTabType.table && (
                  <ButtonGroup className={styles.btnGroup}>
                    <Button
                      variant="link"
                      id="one_day"
                      className={`element ${filtertype === FilterType.ProfitLossDollar ? "btn-primary" : ""}`}
                      onClick={() => setFilterType(FilterType.ProfitLossDollar)}
                    >
                      {t("OptionsStrategies.Option Value")}
                    </Button>
                    <Button
                      variant="link"
                      id="one_month"
                      className={`element ${filtertype === FilterType.ProfitLossPercentage ? "btn-primary" : ""}`}
                      onClick={() => setFilterType(FilterType.ProfitLossPercentage)}
                    >
                      {t("OptionsStrategies.Profit Loss")}
                    </Button>
                  </ButtonGroup>
                )}
              </div>
            </div>
            <Timeline
              getExpiryDate={expiryDate}
              data1={strategy}
              filterType={filtertype}
              inputData={undefined}
              value1={0}
              strategyTypeForLeg={strategyTypeForLeg}
              newlyAddedElement={newlyAddedElement}
              newlyAddedLeg={newlyAddedLeg}
              setElementsCount={setElementsCount}
              setGreekValues={setGreekValues}
              search={search}
              strategySelection={strategySelection}
              handleRangeSlider={handleRangeSlider}
              setLoading={setPageLoading}
            />
            <div className={styles.chartMain}>
              <div className="ChartContainer">
                <Tabs
                  activeKey={activeTabKey}
                  onSelect={(type: string) => {
                    if (type !== activeTabKey) {
                      // setFilterType(
                      //   type === ActiveTabType.graph
                      //     ? FilterType.ProfitLossPercentage
                      //     : FilterType.ProfitLossDollar
                      // );
                      setActiveTabKey(type);
                    }
                  }}
                  id="uncontrolled-tab-example"
                  className=""
                >
                  <Tab eventKey={ActiveTabType.graph} title="Chart">
                    <StratergiesChart
                      getExpiryDate={expiryDate}
                      data1={strategy}
                      filterType={filtertype}
                      rangeValue={value1}
                      volatilityValue={volatility}
                      updatedRange={updatedRange}
                      Breakeven={Breakeven}
                    />
                  </Tab>
                  <Tab eventKey={ActiveTabType.table} title="Table">
                    <StrategiesTable
                      getExpiryDate={expiryDate}
                      getYaxisData={yAxisState}
                      spreadTableForProfitLoss={spreadTableForProfitLoss}
                    />
                  </Tab>
                </Tabs>
              </div>
              <div className="RangeSelector">
                <div className="row">
                  <div className="col-sm-6 mb-3 mb-sm-0 col-12">
                    <label>
                      {t("Range")}: <span>{value1}</span>
                    </label>
                    <Slider value={value1} onChange={handleRangeSlider} />
                  </div>
                  <div className="col-sm-6 col-12">
                    <label>
                      {t("Implied Volatility")}: <span>{volatility ? volatility.toFixed(2) : 0}</span>
                    </label>
                    <Slider value={volatility} onChange={handleVolatilitySlider} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Offcanvas className={styles.buyStrategiesPopup} show={show} onHide={handleClose} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Buy Strategies - {`"${strategy?.ticker}"`}</Offcanvas.Title>
        </Offcanvas.Header>

        <BuyStrategies
          handleClose={handleClose}
          alerts={alerts}
          actionType={""}
          tradeDataMap={tradeDataMap}
          pageTitle="strategies"
          optionDashboardRows={[]}
          showUnderlyingSec={showUnderlyingSec}
          netTitle={netTitle}
          coveredValue={(strategy?.legs?.[0]?.size || 1) * 100}
        />
      </Offcanvas>
    </main>
  );
};

export default Strategies;
