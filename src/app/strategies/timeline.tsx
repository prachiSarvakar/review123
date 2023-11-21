"use client";
import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import Draggable from "react-draggable";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxCommon";
import { fetchOptionGreek, optionGreekData } from "@/redux/slices/optionGreekSlice";
import { setStrategyData } from "@/redux/slices/allStrategiesSlice";
import { setStrikesValue } from "@/redux/slices/strikeDetailSlice";
import { Leg } from "@/utils/legs";
import { Overlay, Popover, Badge, Form } from "react-bootstrap";
import "react-datepicker/dist/react-datepicker.css";
import DateSlider from "@/app/strategies/DateSlider";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper";
import { convertDateToUTCFormat, formatDate, formatDateTypeForLegs, formatedDate } from "@/utils/dates";
import { Howl } from "howler";
import debounce from "lodash/debounce";
import { scrollIntoView } from "seamless-scroll-polyfill";
import { optionStrategiSelectionData } from "@/redux/slices/optionStrategySlice";
import { balancesData } from "@/redux/slices/balanceSlice";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { type } from "os";
import { fetchOptionGreekChains } from "@/redux/slices/optionGreekChainsSlice";
import { addSignAndCommasToNumber, getStrategyIdFromLegs } from "@/utils/positions";
import Loader from "@/components/loader";
import { addCommasFixedTwoToNumber, addCommasToNumber } from "@/utils/prize";
import { t } from "i18next";

const BASE_Y = 0;
const ELEMENT_Y_DIFF = 24;
// As the max scale value is set to 600. The scroll max scroll value is 600 / 5.
const MAX_SCROLL_INDEX = 120;
const yAxisMarkingForBottomPin = 90;
const timeLineXAxisOffSet = -3;
const nearestMultiplier = 10.39;

enum Category {
  Buy = 1,
  Sell = -1,
}

const Buy = "buy";
const Sell = "sell";

interface IElement {
  id: number;
  x: number;
  y: number;
  title: number;
  category: string;
}

interface TimelineProps {
  inputData: any;
  getExpiryDate: Date;
  data1: any;
  filterType: number;
  value1: number;
  strategyTypeForLeg: string;
  newlyAddedLeg: any;
  newlyAddedElement?: any;
  getAllElements?: (elements: IElement[]) => any;
  setGreekValues: any;
  setElementsCount: any;
  search: any;
  strategySelection: any;
  handleRangeSlider: any;
  setLoading: any;
}

const DragSound = new Howl({
  src: ["../assets/sound/Tock.mp3"],
  volume: 0.05,
});

let elementsLocal: any = [];
let prevStratergies: any = [];

export const Timeline: React.FC<TimelineProps> = ({
  getExpiryDate,
  data1,
  filterType,
  strategyTypeForLeg,
  newlyAddedElement,
  getAllElements,
  setElementsCount,
  newlyAddedLeg,
  setGreekValues,
  search,
  strategySelection,
  handleRangeSlider,
  setLoading,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [show, setShow] = useState(false);
  const [target, setTarget] = useState(null);
  const [strategy, setStrategy] = useState<any>([]);
  const [elements, setElements] = useState<any>([]);
  const [strikeValue, setStrikeValue] = useState<any>([]);
  const allStrategies: any = useAppSelector((state) => state.allStrategies.strategies);
  const selectedDate = useAppSelector((state) => state.datesSelected.date);
  const formatedSelectedData = formatDate(selectedDate);
  const dispatch = useAppDispatch();
  const selectedExpirationDate: any = useAppSelector(optionGreekData);
  const optionStrategiSelectionDates: any = useAppSelector(optionStrategiSelectionData);
  const balancesObj: any = useAppSelector(balancesData);
  const [newObjectByStrike, setNewObjectByStrike] = useState<any>([]);
  const [clickedTitle, setClickedTitle] = useState("");
  const [clickedElementId, setClickedElementId] = useState(null);
  const [objectByStrike, setObjectByStrike] = useState<any>([]);
  const [askValue, setAskValue] = useState<number>(null);
  const [bidValue, setBidValue] = useState<number>(null);
  const [midValue, setMidValue] = useState<number>(null);
  const [largestNumber, setLargestNumber] = useState<number>(0);
  const [smallestNumber, setSmallestNumber] = useState<number>(0);
  const [width, setWidth] = useState<number>(0);
  const [isLock, setIsLock] = useState(false);
  const [tradeValues, setTradeValues] = useState<any>(0);
  const [previousName, setPreviousName] = useState("Long Call");
  const [isChangingStrategy, setIsChangingStrategy] = useState(true);
  const [elementPositions, setElementPositions] = useState({});
  const selectedStrikes = useAppSelector((state) => state.allStrikes.strikes);
  const [initialLoad, setInitialLoad] = useState(false);
  const initialQuantity = elements[clickedElementId]?.quantity;
  const [activeIndex, setActiveIndex] = useState<number | null>();
  const [prevDate, setPrevDate] = useState(null);
  const [showLegDate, setShowLegDate] = useState({});
  const router = useRouter();
  const pathname = usePathname();
  const searchParams: any = useSearchParams();
  const uriExpiration: string | null = searchParams.get("expiration");
  const [delta, setDelta] = useState<number>(null);
  const [theta, setTheta] = useState<number>(null);
  const [gamma, setGamma] = useState<number>(null);
  const [vega, setVega] = useState<number>(null);
  const [rho, setRho] = useState<number>(null);
  const [volumeValue, setVolume] = useState<number>(null);
  const [oi, setOi] = useState<number>(null);
  const [iv, setIv] = useState<number>(null);
  const [greeksValue, setGreeksValue] = useState(null);
  const listRef = useRef(null);
  const analyzeUpdateId = useRef(null);
  const Lock = () => {
    setIsLock(!isLock);
  };
  const predefinedColors = ["#9e0af4", "#1b9fdf", "#f4500a", "#46d009"];
  const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * predefinedColors.length);
    return predefinedColors[randomIndex];
  };
  const [currentColor, setCurrentColor] = useState(getRandomColor());

  useEffect(() => {
    const currentDate = formatDateTypeForLegs(elements[clickedElementId]?.expirationDate);
    if (currentDate !== prevDate) {
      setCurrentColor(getRandomColor());
      setPrevDate(currentDate);
    }
  }, [elements, clickedElementId, prevDate]);

  useEffect(() => {
    let arr: any = [];
    if (selectedExpirationDate.length > 0) {
      selectedExpirationDate.forEach((item: any) => {
        const trimNumber = item.strike;
        arr.push(trimNumber);
      });
      const uniqueArray = arr.filter((value, index, self) => self.indexOf(value) === index);
      const largestNumberofStrike = Math.max(...uniqueArray);

      const smallesttNumberofStrike = Math.min(...uniqueArray);
      setLargestNumber(Math.round(largestNumberofStrike));
      setSmallestNumber(Math.round(smallesttNumberofStrike));
      setStrikeValue(uniqueArray);
    }
    if (allStrategies && allStrategies?.legs) {
      const groupedObjectsByStrike = [];
      allStrategies?.legs.forEach((legItem) => {
        const getStrikes = legItem?.strike;
        const direction = legItem?.direction;
        const getType = legItem?.type === 0 ? "call" : legItem?.type === 1 ? "put" : null;
        const matchingObjects = selectedExpirationDate
          .filter((selectedItem) => {
            return selectedItem?.strike === getStrikes && selectedItem?.option_type === getType;
          })
          .map((matchedItem) => {
            return {
              ...matchedItem,
              direction: direction,
            };
          });

        groupedObjectsByStrike.push(...matchingObjects);
        setObjectByStrike(groupedObjectsByStrike);
        setGreekValues(groupedObjectsByStrike);
      });
    }
  }, [selectedExpirationDate, allStrategies]);
  useEffect(() => {
    if (objectByStrike?.length > 0) {
      objectByStrike?.map((item, index) => {
        const deltaValue = item?.greeks?.delta;
        setDelta(deltaValue);
        const thetaValue = item?.greeks?.theta;
        setTheta(thetaValue);
        const gammaValue = item?.greeks?.gamma;
        setGamma(gammaValue);
        const vegaValue = item?.greeks?.vega;
        setVega(vegaValue);
        const RHOValue = item?.greeks?.rho;
        setRho(RHOValue);
        const ivValue = item?.greeks?.mid_iv * 100;
        setIv(ivValue);
        const volumeValue = item?.volume;
        setVolume(volumeValue);
        const oIValue = item?.open_interest;
        setOi(oIValue);
      });
    } else {
      setDelta(0);
      setTheta(0);
      setGamma(0);
      setVega(0);
      setRho(0);
      setIv(0);
      setVolume(0);
      setOi(0);
    }
  }, [objectByStrike, selectedExpirationDate]);

  function findChangedIndex(prev: any, latest: any) {
    if (!prev) return 0;
    if (!latest) return 0;
    for (let i = 0; i < prev.length && i < latest.length; i++) {
      if (prev[i].strike !== latest[i].strike) {
        return i;
      }
    }

    if (prev.length !== latest.length) {
      return Math.min(prev.length, latest.length);
    }
    return -1;
  }

  const stratergyChangeHandler = () => {
    const valueAns = findChangedIndex(prevStratergies?.legs, allStrategies?.legs);
    if (allStrategies?.legs) {
      const localElements = allStrategies?.legs
        .map((leg: Leg, index: number) => {
          let xRelativeToWrapper;
          const wrapperElement = listRef.current;
          const targetLiId = `numberline${Math.round(leg?.strike / 5) * 5}`;
          const targetLiElement = document.getElementById(targetLiId);
          if (targetLiElement && wrapperElement) {
            const wrapperRect = wrapperElement.getBoundingClientRect();
            const liRect = targetLiElement.getBoundingClientRect();
            xRelativeToWrapper = liRect.left - wrapperRect.left;
          }
          let titleValue;
          if (!initialLoad) {
            titleValue = leg?.strike;
          } else {
            titleValue = selectedStrikes[index];
          }

          return {
            id: index,
            x: xRelativeToWrapper - timeLineXAxisOffSet,
            y: leg.category === Category.Buy ? 0 : yAxisMarkingForBottomPin,
            title: titleValue,
            purchase: leg?.purchasePrice,
            type: leg?.type,
            quantity: leg?.size,
            // "actualQualtity" can have -ve values i.e sell -> -ve qualtity,
            // but the "quantity" variable will have only +ve values.
            actualQualtity: leg?.actualQualtity,
            volatilty: leg?.volatility,
            expirationDate: leg?.expiration,
            category: leg?.direction === 1 ? Category.Buy : Category.Sell,
            underlying: leg?.underlying,
          };
        })
        .filter((element) => element !== null);
      setElements(localElements);
      setStrategy(allStrategies);
      elementsLocal = localElements;
    }
  };

  const resize = () => {
    const local = elementsLocal
      ?.map((ele) => {
        let xRelativeToWrapper;
        const wrapperElement = listRef.current;

        const targetLiId = `numberline${Math.round(ele.title / 5) * 5}`;
        const targetLiElement = document.getElementById(targetLiId);
        if (targetLiElement && wrapperElement) {
          const wrapperRect = wrapperElement.getBoundingClientRect();
          const liRect = targetLiElement.getBoundingClientRect();
          xRelativeToWrapper = liRect.left - wrapperRect.left;
        }
        return {
          id: ele.id,
          x: xRelativeToWrapper - timeLineXAxisOffSet,
          y: ele.category === Category.Buy ? 0 : yAxisMarkingForBottomPin,
          title: ele.title,
          purchase: ele?.purchasePrice,
          type: ele?.type,
          quantity: ele?.quantity,
          actualQualtity: ele?.actualQualtity,
          volatilty: ele?.volatility,
          expirationDate: ele?.expiration,
          category: ele?.category,
        };
      })
      .filter((element) => element !== null);
    setElements(local);
    elementsLocal = local;
  };
  // start

  useEffect(() => {
    stratergyChangeHandler();
  }, [allStrategies]);

  const handleResize = () => {
    resize();
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(analyzeUpdateId?.current);
    };
  }, []);

  useEffect(() => {
    setElementsCount(elements);
  }, [elements, setElementsCount]);

  const handleClick = (title, id) => {
    //RS:- Find the item in objectByStrike based on the strike
    const selectedItem = objectByStrike?.find((item) => item.strike === title);
    if (selectedItem) {
      //RS:- Set greeksValue to the greeks object of the selected item
      setGreeksValue(selectedItem.greeks);
      setVolume(selectedItem?.volume);
      setOi(selectedItem?.open_interest);
    }
    setShow(!show);
    setClickedTitle(title);
    setClickedElementId(id);
    const matchingObjects = objectByStrike?.filter((trade) => trade.strike === title);
    const getAskValue = matchingObjects.map((trade) => trade.ask);
    const getBidValue = matchingObjects.map((trade) => trade.bid);
    const getMidValue: any = (Number(getAskValue) + Number(getBidValue)) / 9.4;
    setAskValue(getAskValue);
    setBidValue(getBidValue);
    setMidValue(getMidValue.toFixed(2));
  };
  const getTradeValues = [
    { value: "mid", label: `Mid ${midValue}` },
    { value: "ask", label: `Ask ${askValue}` },
    { value: "bid", label: `Bid ${bidValue}` },
  ];

  const handleDeleteClick = (index: number) => {
    const updatedItems = [...elements];
    const deletedItem = updatedItems.splice(index, 1);

    if (strategy && strategy.legs) {
      const updatedLegs = [...strategy.legs];
      updatedLegs.splice(index, 1);
      let newStrategy = { ...strategy, legs: updatedLegs };
      dispatch(setStrategyData(newStrategy));
    }
    setElements(updatedItems);
    elementsLocal = updatedItems;
    setShow(false);
  };

  useEffect(() => {
    //setElements((oldArray) => [...oldArray, newlyAddedElement]);
  }, [newlyAddedElement]);

  useEffect(() => {
    if (newlyAddedLeg.strike !== 0) {
      if (strategy && strategy?.legs) {
        let allLegs = [...strategy?.legs];
        const legsArray = [...allLegs, { ...newlyAddedLeg }];
        let newStrategy = { ...strategy };
        newStrategy = { ...newStrategy, legs: legsArray, name: "Custom" };
        dispatch(setStrategyData(newStrategy));
      }
    }
  }, [newlyAddedLeg]);

  useEffect(() => {
    if (newlyAddedLeg.strike !== 0) {
      let strategyNumber: any = getStrategyIdFromLegs(allStrategies?.legs);
      const params = new URLSearchParams(searchParams);
      params.set("strategy", strategyNumber);
      router.push(`${pathname}?${params.toString()}`);
    }
  }, [allStrategies]);

  const scrollToStrike = (strikeValue) => {
    if (!listRef.current) return;
    let el = document.querySelector(`.numberline${Math.round(strikeValue / 5) * 5}`);
    if (el) {
      scrollIntoView(el, {
        behavior: "smooth",
        block: "end",
        inline: "center",
      });
    }
  };

  useEffect(() => {
    if (allStrategies) {
      allStrategies?.legs?.map((item) => {
        scrollToStrike(item?.strike);
      });
    }
  }, [allStrategies?.name, selectedExpirationDate, search]);

  useEffect(() => {
    if (allStrategies) {
      allStrategies?.legs?.map((item) => {
        scrollToStrike(item?.strike);
      });
    }
  }, [allStrategies?.ticker]);

  const findNearestValueOfTitle = (value, array) => {
    let closest = array[0];
    const wdth = window.innerWidth;
    let multiplier = nearestMultiplier;
    const getXValue = value / multiplier;
    array.forEach((item) => {
      if (Math.abs(item - getXValue) < Math.abs(closest - getXValue)) {
        closest = item;
      }
    });
    return closest;
  };

  const debouncedHandleDrag = debounce((e, { id, x, y }) => {
    handleDrag(e, { id, x, y });
  }, 0);

  const handleDrag = (e, { id, x, y }) => {
    setIsChangingStrategy(true);

    const updatedPositions = { ...elementPositions, [id]: { x, y } };
    setElementPositions(updatedPositions);
    let targetElement: any = elements.find((ele) => ele.id == id);
    if (!targetElement || !x) {
      return;
    }
    if (targetElement && targetElement.x && targetElement.title && x) {
      const snappedX = findNearestValueOfTitle(x, strikeValue);
      // start
      let xRelativeToWrapper;
      const wrapperElement = listRef.current;
      const targetLiId = `numberline${Math.round(snappedX / 5) * 5}`;
      const targetLiElement = document.getElementById(targetLiId);
      if (targetLiElement && wrapperElement) {
        const wrapperRect = wrapperElement.getBoundingClientRect();
        const liRect = targetLiElement.getBoundingClientRect();
        xRelativeToWrapper = liRect.left - wrapperRect.left;
      }
      // end
      targetElement.x = xRelativeToWrapper - timeLineXAxisOffSet;
      targetElement.y = targetElement.category === Category.Buy ? 0 : yAxisMarkingForBottomPin;
      if (snappedX % 1 !== 0) {
        targetElement.title = Number(snappedX.toFixed(1));
      } else {
        targetElement.title = Math.trunc(snappedX);
      }
      const optionType = targetElement.type === 0 ? "call" : targetElement.type === 1 ? "put" : null;
      const matchingObjects = selectedExpirationDate.filter((selectedItem) => {
        return selectedItem.strike === targetElement.title && selectedItem.option_type === optionType;
      });
      if (matchingObjects && matchingObjects.length > 0) {
        targetElement.purchase = (matchingObjects[0]?.ask + matchingObjects[0]?.bid) / 2;
        targetElement.volatility = matchingObjects[0]?.greeks?.mid_iv * 100;
      }
      const updatedElements = elements
        .map((element) => (element.id === id ? targetElement : element))
        .sort((a, b) => a.x - b.x);

      setElements(updatedElements);
      elementsLocal = updatedElements;
      if (strategy && strategy?.legs) {
        let allLegs = [...strategy?.legs];
        const legsArray: any = [...allLegs];
        legsArray[id] = {
          ...legsArray[id],
          strike: targetElement.title,
          purchasePrice: targetElement.purchase,
          volatility: targetElement.volatility,
          symbol: getSymbolValue(
            { strike: targetElement.title, type: legsArray[id]?.type },
            strategy?.ticker,
            formatedDate(legsArray[id]?.expiration)
          ),
        };
        let newStrategy = { ...strategy };
        newStrategy = { ...newStrategy, legs: legsArray };
        dispatch(setStrategyData(newStrategy));
      }
    }
    dispatch(setStrikesValue(targetElement.title));
    DragSound.play();

    //debounceGetGeneratedSymbol()
  };

  useEffect(() => {
    const titlesToDispatch = elements?.map((item) => item.title);
    dispatch(setStrikesValue(titlesToDispatch));
  }, [elements, dispatch]);

  useEffect(() => {
    setIsChangingStrategy(false);
  }, [selectedExpirationDate]);

  const handletradesData = (tradeValues, id) => {
    const numericValue = parseFloat(tradeValues.split(" ")[1]);
    if (strategy && strategy?.legs) {
      let allLegs = [...strategy?.legs];
      const legsArray: any = [...allLegs];
      legsArray[id] = { ...legsArray[id], purchasePrice: numericValue };
      let newStrategy = { ...strategy };
      newStrategy = { ...newStrategy, legs: legsArray };
      dispatch(setStrategyData(newStrategy));
    }
  };

  const handleQuantityValue = (quantity) => {
    const id = elements[clickedElementId]?.id;
    if (typeof id == "number" && strategy && strategy?.legs) {
      let allLegs = [...strategy?.legs];
      const legsArray: any = [...allLegs];
      const prevDirection = legsArray[id].direction;
      legsArray[id] = {
        ...legsArray[id],
        actualQualtity: quantity,
        size: Math.abs(quantity),
      };
      if (quantity < 1) {
        legsArray[id] = { ...legsArray[id], direction: -1 };
      } else {
        legsArray[id] = { ...legsArray[id], direction: 1 };
      }
      if (prevDirection !== legsArray[id].direction) {
        setShow(false);
      }
      let newStrategy = { ...strategy };
      newStrategy = { ...newStrategy, legs: legsArray };
      dispatch(setStrategyData(newStrategy));
    }
  };

  const decrementButtonClicked = () => {
    const prevQuantity = elements[clickedElementId]?.actualQualtity;
    let quantity = prevQuantity - 1;
    if (quantity === 0) {
      --quantity;
    }
    handleQuantityValue(quantity);
  };

  const incrementButtonClicked = () => {
    const prevQuantity = elements[clickedElementId]?.actualQualtity;
    let quantity = prevQuantity + 1;
    if (quantity === 0) {
      ++quantity;
    }
    handleQuantityValue(quantity);
  };

  // timeline
  const NumbersOfItem: any = [];
  const scaleXEnd = largestNumber;
  for (let i = 0; i <= scaleXEnd; i += 5) {
    NumbersOfItem.push(i);
  }
  const elementRef = useRef(null);

  useEffect(() => {
    setWidth(elementRef?.current?.getBoundingClientRect().width);
  }, [width]);
  const TotalWidth = (12 + width) * NumbersOfItem.length + 15;

  useEffect(() => {
    if (allStrategies?.name && allStrategies?.name !== previousName) {
      setElementPositions({});
      setIsChangingStrategy(false);
      setPreviousName(allStrategies.name);
    }
  }, [allStrategies?.name, previousName]);

  useEffect(() => {
    if (clickedElementId !== null) {
      // setQuantity(1);
    }
  }, [clickedElementId]);

  const handleItemClick = (index: number) => {
    setActiveIndex(index);
  };

  // make symbol accordind to date and strike
  const getSymbolValue = (item, ticker, date) => {
    const strikeVal = String(item?.strike * 1000).padStart(8, "0");
    const expirationFormatted = date?.split("-")[0]?.substring(2) + date?.split("-")[1] + date?.split("-")[2];
    const typeValue = item?.type === 0 ? "C" : item?.type === 1 ? "P" : "";
    const symbolCheck = ticker + expirationFormatted + typeValue + strikeVal;
    return symbolCheck;
  };

  const handleDateData = (date: any, id: any) => {
    const convertedDate = convertDateToUTCFormat(date);
    if (strategy && strategy?.legs) {
      let allLegs = [...strategy?.legs];
      const legsArray: any = [...allLegs];
      legsArray[id] = {
        ...legsArray[id],
        expiration: convertedDate,
        symbol: getSymbolValue(legsArray[id], strategy?.ticker, date),
      };
      let newStrategy = { ...strategy };
      newStrategy = { ...newStrategy, legs: legsArray };
      dispatch(setStrategyData(newStrategy));
      dispatch(
        fetchOptionGreekChains({
          searchKey: strategy?.ticker,
          expiration: date,
        })
      );
    }

    if (strategy?.legs[id]?.expiration && formatedSelectedData !== formatDate(convertedDate)) {
      setShowLegDate({ ...showLegDate, [id]: true });
    } else {
      setShowLegDate({ ...showLegDate, [id]: false });
    }

    if (strategySelection.type === "call" && strategy?.legs?.length === 1) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("expiration", formatedDate(date));
      router.push(`${pathname}?${params.toString()}`);
    }
  };

  const SwiperOption: any = {
    spaceBetween: 30,
    slidesPerView: "auto",
    navigation: true,
    modules: [Navigation],
    slideActiveClass: null,
  };

  const renderingElements = useMemo(() => {
    const updatedElements = [...elements]
      .filter(({ type }) => type === 0 || type == 1)
      .map((el) => {
        const closestTarget = Math.round(el.title / 5) * 5;
        let additionLeft = closestTarget - el.title;
        const x = el.x - 20 - additionLeft * 9.5;
        return {
          ...el,
          x,
          y: el.category == Category.Buy ? 0 : yAxisMarkingForBottomPin,
        };
      });
    const overlapThreshold = 100;

    for (let i = 0; i < updatedElements.length; i++) {
      for (let j = i + 1; j < updatedElements.length; j++) {
        const threshold = updatedElements[j].category === Category.Buy ? -1 * overlapThreshold : 1 * overlapThreshold;
        if (
          Math.abs(updatedElements[i].x - updatedElements[j].x) < overlapThreshold &&
          Math.abs(updatedElements[i].y - updatedElements[j].y) < 60
        ) {
          // If overlap is detected, adjust positions
          updatedElements[j].y =
            updatedElements[j].category === Category.Buy ? updatedElements[j].y - 35 : updatedElements[j].y + 35;
        }
      }
    }
    return updatedElements;
  }, [elements]);
  const stopLoading = () => {
    setLoading({ message: "time line line 183 stopped", loading: false });
  };

  useEffect(() => {
    let legs = JSON.parse(sessionStorage.getItem("legs") || "[]");
    if (legs?.length && uriExpiration === selectedExpirationDate[0]?.expiration_date && allStrategies?.legs?.length) {
      setLoading({ message: "time line line 648 triggeren", loading: true });
      try {
        const updatedLegs = [];
        let shouldUpdateStrategy = 0;
        for (const [i, leg] of legs.entries()) {
          if (leg.type === 2) {
            updatedLegs.push({
              ...allStrategies.legs.find((uLeg) => uLeg.type === 2),
              strike: leg.strike,
              purchasePrice: (leg.ask + leg.bid) / 2,
              volatility: 0,
              symbol: getSymbolValue({ strike: leg.strike, type: 0 }, leg?.ticker, leg.expiration_date),
              type: 2,
              size: Math.abs(leg.quantity),
              actualQualtity: leg.quantity,
              underlying: true,
            });

            continue;
          }
          const matchingObjects = selectedExpirationDate.find((selectedItem) => {
            return selectedItem.strike === leg.strike && selectedItem.option_type === leg.option_type;
          });

          if (matchingObjects) {
            updatedLegs.push({
              ...allStrategies.legs[i],
              direction: leg.quantity > 0 ? 1 : -1,
              strike: matchingObjects.strike,
              purchasePrice: (matchingObjects.ask + matchingObjects.bid) / 2,
              volatility: matchingObjects.greeks?.mid_iv * 100,
              symbol: matchingObjects.symbol,
              type: matchingObjects.option_type === "call" ? 0 : 1,
              size: Math.abs(leg.quantity),
              actualQualtity: leg.quantity,
            });
          }
        }

        if (analyzeUpdateId?.current) {
          clearTimeout(analyzeUpdateId?.current);
        }
        analyzeUpdateId.current = setTimeout(() => {
          sessionStorage.removeItem("legs");
          stopLoading();
          if (["5", "11", "12", "51", "52"].includes(searchParams.get("strategy"))) {
            handleRangeSlider(70);
          } else if (["15"].includes(searchParams.get("strategy"))) {
            handleRangeSlider(25);
          }
          dispatch(setStrategyData({ ...allStrategies, legs: updatedLegs }));
        }, 2500);
      } catch (error) {
        setLoading({ message: "time line error line 183 stopped", loading: false });
      }
    }
  }, [selectedExpirationDate, allStrategies]);

  const midIVValue = greeksValue?.mid_iv * 100;
  return (
    <>
      <div className="timeline-wrapper">
        <div className="timeline">
          <div className="timeline__container" style={{ width: TotalWidth }}>
            {renderingElements.map(({ id, x, y, title, category, quantity, actualQualtity, type, expirationDate }) => {
              const formatedExpirationData = formatDate(expirationDate);
              return (
                <Draggable
                  key={id}
                  axis="x"
                  handle={`.timelinepin${category === 1 ? "C" : "P"}`}
                  position={
                    !isChangingStrategy || title === smallestNumber || title === largestNumber
                      ? {
                          x: x,
                          y: y,
                        }
                      : null
                  }
                  defaultPosition={{
                    x: x,
                    y: y,
                  }}
                  onDrag={(e, data) => {
                    setIsDragging(true);
                    handleDrag(e, { id, ...data });
                  }}
                  defaultClassName={type === 0 ? "call" : "put"}
                  onStop={() => {
                    setTimeout(() => {
                      setIsDragging(false);
                    }, 100);
                  }}
                >
                  {/* RS:- */}
                  <div
                    className={`timelinepin${category === 1 ? "C" : "P"}`}
                    onClick={(e) => {
                      if (!isDragging) {
                        setTarget(e.target);
                        handleClick(title, id);
                      }
                    }}
                  >
                    {title}
                    <span className="qtycount">{actualQualtity}</span>
                    {showLegDate[id] && <span className="qtycount left">{formatedExpirationData}</span>}
                    <span>{type === 0 ? "C" : type === 1 ? "P" : ""}</span>
                    <span className={`icon-arrows ${category === Category.Buy ? "" : "icon-arrows-down"}`}></span>
                  </div>
                </Draggable>
              );
            })}
          </div>
          <ul className="numberLineUl" style={{ width: TotalWidth }} ref={listRef}>
            {NumbersOfItem?.map((number, index) => (
              <li
                key={index}
                id={`numberline${number}`}
                className={`numberline${number}`}
                style={{ opacity: number < smallestNumber ? 0.5 : 1 }}
              >
                <span>
                  <span>{number}</span>
                </span>
              </li>
            ))}
          </ul>
          <ul className="numberLineUl2" style={{ width: TotalWidth }} ref={listRef}>
            {NumbersOfItem?.map((number, index) => (
              <li
                key={index}
                id={`numberline${number}`}
                className={`numberline${number}`}
                style={{ opacity: number < smallestNumber ? 0.5 : 1 }}
              >
                <span>
                  <span></span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Overlay
        show={show}
        target={target}
        placement="bottom"
        containerPadding={20}
        rootClose
        onHide={() => setShow(false)}
      >
        <Popover id="popover-contained" className="TimelinePopup">
          <Popover.Header as="h3">
            {allStrategies?.name} @
            <strong className="ms-1">{elements[clickedElementId]?.title * elements[clickedElementId]?.quantity}</strong>
            <Badge bg="light" text="dark" className="ms-auto me-2">
              {elements[clickedElementId]?.actualQualtity}
            </Badge>
            {elements.length > 1 && (
              <span
                className="icon-delete"
                style={{ cursor: "pointer" }}
                onClick={() => handleDeleteClick(clickedElementId)}
              ></span>
            )}
          </Popover.Header>
          <Popover.Body>
            <div className="change-expiration">
              <label>Change Expiration:</label>
              <div className="navigation-wrapper strategies-slide">
                <Swiper {...SwiperOption}>
                  {optionStrategiSelectionDates?.date?.map((item: any, index: number) => {
                    return (
                      <SwiperSlide
                        key={index}
                        onClick={() => {
                          handleDateData(item, elements[clickedElementId]?.id);
                          handleItemClick(index);
                        }}
                        className={
                          formatDate(item) === formatDate(elements[clickedElementId]?.expirationDate) ? "active" : ""
                        }
                      >
                        {formatDate(item)}
                      </SwiperSlide>
                    );
                  })}
                </Swiper>
              </div>
            </div>
            {/* RS:- displaying options strategies data */}

            <div>
              <div className="" style={{ display: "flex", justifyContent: "space-between", padding: "0rem 1rem" }}>
                <div style={{ marginBottom: "1rem" }}>
                  <label>{t("StockInfo.Delta")} (Δ):</label>
                  <strong>{addSignAndCommasToNumber(greeksValue?.delta) || "--"}</strong>
                </div>
                <div style={{ marginBottom: "1rem" }}>
                  <label>{t("StockInfo.Theta")}(Θ): </label>
                  <strong>{addSignAndCommasToNumber(greeksValue?.theta) || "--"}</strong>
                </div>
              </div>

              <div className="" style={{ display: "flex", justifyContent: "space-between", padding: "0rem 1rem" }}>
                <div style={{ marginBottom: "1rem" }}>
                  <label>{t("StockInfo.Gamma")}(Γ): </label>
                  <strong>{addSignAndCommasToNumber(greeksValue?.gamma) || "--"}</strong>
                </div>
                <div style={{ marginBottom: "1rem" }}>
                  <label>{t("StockInfo.Vega")}(v): </label>
                  <strong>{addSignAndCommasToNumber(greeksValue?.vega) || "--"}</strong>
                </div>
              </div>

              <div className="" style={{ display: "flex", justifyContent: "space-between", padding: "0rem 1rem" }}>
                <div style={{ marginBottom: "1rem" }}>
                  <label>{t("StockInfo.RHO")}(ρ): </label>
                  <strong>{addSignAndCommasToNumber(greeksValue?.rho) || "--"}</strong>
                </div>
                <div style={{ marginBottom: "1rem" }}>
                  <label>{t("StockInfo.IV")}: </label>
                  <strong>{addCommasToNumber(midIVValue?.toFixed(2)) + "%" || "--"}</strong>
                </div>
              </div>

              <div className="" style={{ display: "flex", justifyContent: "space-between", padding: "0rem 1rem" }}>
                <div style={{ marginBottom: "1rem" }}>
                  <label>{t("StockInfo.Volume")}: </label>
                  <strong>{addCommasToNumber(volumeValue?.toFixed(0)) || "--"}</strong>
                </div>
                <div style={{ marginBottom: "1rem" }}>
                  <label>{t("StockInfo.OI")}: </label>
                  <strong>{addCommasToNumber(oi?.toFixed(0)) || "--"}</strong>
                </div>
              </div>
            </div>
            <div style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.08)", margin: "0px 10px", marginBottom: "10px" }}></div>
            <div className="qty">
              <label>Quantity</label>
              <div className="quantity">
                <button
                  onClick={() => {
                    decrementButtonClicked();
                  }}
                  className="minus"
                >
                  <span className="icon-previous"></span>
                </button>
                <Form.Control type="number" value={`${elements[clickedElementId]?.actualQualtity}`} readOnly />
                <button
                  onClick={() => {
                    incrementButtonClicked();
                  }}
                  className="plus"
                >
                  <span className="icon-next"></span>
                </button>
              </div>
            </div>
            <div className="trade">
              <label>Trade</label>
              <Form.Select
                aria-label="Default select example"
                onChange={(e) => {
                  const selectedValue = e.target.value;
                  setTradeValues(selectedValue);
                  handletradesData(selectedValue, elements[clickedElementId]?.id);
                }}
              >
                {getTradeValues.map((tradeValue, index) => {
                  // eslint-disable-next-line react/jsx-key
                  return (
                    <option key={index} value={tradeValue.label}>
                      {tradeValue.label}
                    </option>
                  );
                })}
              </Form.Select>
            </div>
          </Popover.Body>
        </Popover>
      </Overlay>
    </>
  );
};
