"use client";
import { Accordion, Collapse, Form, Button } from "react-bootstrap";
import Image from "next/image";
import Search from "@/assets/images/search.svg";
import styles from "@/styles/strategies.module.scss";
import { useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams, useRouter } from "next/navigation";
import { itemStrategyAccordionMapping } from "@/utils/getStrategyName";
import { useAppSelector } from "@/hooks/reduxCommon";
import searchStrategiesObjectData, { getAccordianId } from "@/constants/searchStrategiesObjectData";
import { getStrategyIdFromLegs } from "@/utils/positions";

enum LegType {
  Call = 0,
  Put = 1,
  Stock = 2,
}
enum DirectionType {
  Buy = 1,
  Sell = -1,
}
interface TargetComponentProps {
  setStrategySelection: any;
  onDataUpdate: any;
}

const StrategiesSidebar: React.FC<TargetComponentProps> = ({ setStrategySelection, onDataUpdate }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(1);
  const [open, setOpen] = useState(true);
  const [activeAccordion, setActiveAccordion] = useState("0");
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const searchParams: any = useSearchParams();
  const strategy: string | null = searchParams.get("strategy");
  const allStrategies: any = useAppSelector((state) => state.allStrategies?.strategies);
  const { t, i18n } = useTranslation();
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const handleItemClick = (index: number) => {
    setActiveIndex(index);
  };

  useEffect(() => {
    if (allStrategies?.legs?.length === 0) {
      setActiveIndex(0);
      setActiveAccordion(null);
    }
  }, [allStrategies]);

  useEffect(() => {
    const strategyId = getStrategyIdFromLegs(allStrategies?.legs);
    setActiveIndex(strategyId);
    const accordionId: any = getAccordianId(strategyId);
    setActiveAccordion(accordionId?.toString());
  }, [allStrategies]);

  const [categoryName, setCategoryName] = useState(false);
  const getLongCall = () => {
    setStrategySelection({
      type: "call",
      legType: LegType.Call,
      optionType: "call",
      direction: DirectionType.Buy,
      strategyTypeForLeg: "Long Call",
    });
    setCategoryName(false);
    onDataUpdate(categoryName);
  };

  const getLongPut = () => {
    setStrategySelection({
      type: "call",
      legType: LegType.Put,
      optionType: "put",
      direction: DirectionType.Buy,
      strategyTypeForLeg: "Long Put",
    });
    setCategoryName(false);
    onDataUpdate(categoryName);
  };

  const getShortCall = () => {
    setStrategySelection({
      type: "call",
      legType: LegType.Call,
      optionType: "call",
      direction: DirectionType.Sell,
      strategyTypeForLeg: "Short Call",
    });
    setCategoryName(false);
    onDataUpdate(categoryName);
  };
  const getShortPut = () => {
    setStrategySelection({
      type: "call",
      legType: LegType.Put,
      optionType: "put",
      direction: DirectionType.Sell,
      strategyTypeForLeg: "Short Put",
    });
    setCategoryName(false);
    onDataUpdate(categoryName);
  };
  const getCashSecuredPut = () => {
    setStrategySelection({
      type: "call",
      legType: LegType.Put,
      optionType: "put",
      direction: DirectionType.Sell,
      strategyTypeForLeg: "Cash Secured Put",
    });
    setCategoryName(false);
    onDataUpdate(categoryName);
  };

  const getCoveredCall = () => {
    setStrategySelection({
      type: "double leg",
      legType1: LegType.Stock,
      direction1: DirectionType.Buy,
      legType2: LegType.Call,
      direction2: DirectionType.Sell,
      strategyTypeForLeg: "Covered Call",
    });
    setCategoryName(false);
    onDataUpdate(categoryName);
  };

  const getProtectivePut = () => {
    setStrategySelection({
      type: "double leg",
      legType1: LegType.Stock,
      direction1: DirectionType.Buy,
      legType2: LegType.Put,
      direction2: DirectionType.Buy,
      strategyTypeForLeg: "Protective Put",
    });
    setCategoryName(false);
    onDataUpdate(categoryName);
  };

  const getBullCallSpread = () => {
    setStrategySelection({
      type: "double leg",
      legType1: LegType.Call,
      direction1: DirectionType.Buy,
      legType2: LegType.Call,
      direction2: DirectionType.Sell,
      strategyTypeForLeg: "Bull Call Spread",
    });
    setCategoryName(false);
    onDataUpdate(categoryName);
  };

  const getBearPutSpread = () => {
    setStrategySelection({
      type: "double leg",
      legType1: LegType.Put,
      direction1: DirectionType.Sell,
      legType2: LegType.Put,
      direction2: DirectionType.Buy,
      strategyTypeForLeg: "Bear Put Spread",
    });
    setCategoryName(false);
    onDataUpdate(categoryName);
  };

  const getBearCallSpread = () => {
    setStrategySelection({
      type: "double leg",
      legType1: LegType.Call,
      direction1: DirectionType.Sell,
      legType2: LegType.Call,
      direction2: DirectionType.Buy,
      strategyTypeForLeg: "Bear Call Spread",
    });
    setCategoryName(false);
    onDataUpdate(categoryName);
  };

  const getBullPutSpread = () => {
    setStrategySelection({
      type: "double leg",
      legType1: LegType.Put,
      direction1: DirectionType.Buy,
      legType2: LegType.Put,
      direction2: DirectionType.Sell,
      strategyTypeForLeg: "Bull Put Spread",
    });
    setCategoryName(false);
    onDataUpdate(categoryName);
  };

  const getRatioCallSpread = () => {
    setStrategySelection({
      type: "double leg",
      legType1: LegType.Call,
      direction1: DirectionType.Buy,
      legType2: LegType.Call,
      direction2: DirectionType.Sell,
      strategyTypeForLeg: "Call Vertical Spread",
    });
    setCategoryName(false);
    onDataUpdate(categoryName);
  };

  const getRatioPutSpread = () => {
    setStrategySelection({
      type: "double leg",
      legType1: LegType.Put,
      direction1: DirectionType.Sell,
      legType2: LegType.Put,
      direction2: DirectionType.Buy,
      strategyTypeForLeg: "Put Vertical Spread",
    });
    setCategoryName(false);
    onDataUpdate(categoryName);
  };

  const getLongStraddle = () => {
    setStrategySelection({
      type: "double leg",
      legType1: LegType.Put,
      direction1: DirectionType.Buy,
      legType2: LegType.Call,
      direction2: DirectionType.Buy,
      strategyTypeForLeg: "Long Straddle",
    });
    setCategoryName(false);
    onDataUpdate(categoryName);
  };

  const getShortStraddle = () => {
    setStrategySelection({
      type: "double leg",
      legType1: LegType.Put,
      direction1: DirectionType.Sell,
      legType2: LegType.Call,
      direction2: DirectionType.Sell,
      strategyTypeForLeg: "Short Straddle",
    });
    setCategoryName(false);
    onDataUpdate(categoryName);
  };

  const getCoveredShortStraddle = () => {
    setStrategySelection({
      type: "triple leg",
      legType: LegType.Stock,
      direction: DirectionType.Buy,
      legType1: LegType.Put,
      direction1: DirectionType.Sell,
      legType2: LegType.Call,
      direction2: DirectionType.Sell,
      strategyTypeForLeg: "Covered Short Straddle",
    });
    setCategoryName(false);
    onDataUpdate(categoryName);
  };

  const getLongStrangle = () => {
    setStrategySelection({
      type: "double leg",
      legType1: LegType.Put,
      direction1: DirectionType.Buy,
      legType2: LegType.Call,
      direction2: DirectionType.Buy,
      strategyTypeForLeg: "Long Strangle",
    });
    setCategoryName(false);
    onDataUpdate(categoryName);
  };

  const getShortStrangle = () => {
    setStrategySelection({
      type: "double leg",
      legType1: LegType.Put,
      direction1: DirectionType.Sell,
      legType2: LegType.Call,
      direction2: DirectionType.Sell,
      strategyTypeForLeg: "Short Strangle",
    });
    setCategoryName(false);
    onDataUpdate(categoryName);
  };

  const getCoveredShortStrangle = () => {
    setStrategySelection({
      type: "triple leg",
      legType: LegType.Stock,
      direction: DirectionType.Buy,
      legType1: LegType.Put,
      direction1: DirectionType.Sell,
      legType2: LegType.Call,
      direction2: DirectionType.Sell,
      strategyTypeForLeg: "Covered Short Strangle",
    });
    setCategoryName(false);
    onDataUpdate(categoryName);
  };

  const getlongCallCondor = () => {
    setStrategySelection({
      type: "multi leg",
      legType: LegType.Call,
      direction: DirectionType.Buy,
      legType1: LegType.Call,
      direction1: DirectionType.Sell,
      legType2: LegType.Call,
      direction2: DirectionType.Sell,
      legType3: LegType.Call,
      direction3: DirectionType.Buy,
      strategyTypeForLeg: "Long Call Condor",
    });
    setCategoryName(false);
    onDataUpdate(categoryName);
  };

  const getlongPutCondor = () => {
    setStrategySelection({
      type: "multi leg",
      legType: LegType.Put,
      direction: DirectionType.Buy,
      legType1: LegType.Put,
      direction1: DirectionType.Sell,
      legType2: LegType.Put,
      direction2: DirectionType.Sell,
      legType3: LegType.Put,
      direction3: DirectionType.Buy,
      strategyTypeForLeg: "Long Put Condor",
    });
    setCategoryName(false);
    onDataUpdate(categoryName);
  };

  const getIronCondor = () => {
    setStrategySelection({
      type: "multi leg",
      legType: LegType.Put,
      direction: DirectionType.Buy,
      legType1: LegType.Put,
      direction1: DirectionType.Sell,
      legType2: LegType.Call,
      direction2: DirectionType.Sell,
      legType3: LegType.Call,
      direction3: DirectionType.Buy,
      strategyTypeForLeg: "Iron Condor",
    });
    setCategoryName(false);
    onDataUpdate(categoryName);
  };
  const getShortCallCondor = () => {
    setStrategySelection({
      type: "multi leg",
      legType: LegType.Call,
      direction: DirectionType.Sell,
      legType1: LegType.Call,
      direction1: DirectionType.Buy,
      legType2: LegType.Call,
      direction2: DirectionType.Buy,
      legType3: LegType.Call,
      direction3: DirectionType.Sell,
      strategyTypeForLeg: "Short Call Condor",
    });
    setCategoryName(false);
    onDataUpdate(categoryName);
  };
  const getShortPutCondor = () => {
    setStrategySelection({
      type: "multi leg",
      legType: LegType.Put,
      direction: DirectionType.Sell,
      legType1: LegType.Put,
      direction1: DirectionType.Buy,
      legType2: LegType.Put,
      direction2: DirectionType.Buy,
      legType3: LegType.Put,
      direction3: DirectionType.Sell,
      strategyTypeForLeg: "Short Put Condor",
    });
    setCategoryName(false);
    onDataUpdate(categoryName);
  };
  const getReverseIronCondor = () => {
    setStrategySelection({
      type: "multi leg",
      legType: LegType.Put,
      direction: DirectionType.Sell,
      legType1: LegType.Put,
      direction1: DirectionType.Buy,
      legType2: LegType.Call,
      direction2: DirectionType.Buy,
      legType3: LegType.Call,
      direction3: DirectionType.Sell,
      strategyTypeForLeg: "Reverse Iron Condor",
    });
    setCategoryName(false);
    onDataUpdate(categoryName);
  };
  const getLongCallButterfly = () => {
    setStrategySelection({
      type: "triple leg",
      legType: LegType.Call,
      direction: DirectionType.Buy,
      legType1: LegType.Call,
      direction1: DirectionType.Sell,
      legType2: LegType.Call,
      direction2: DirectionType.Buy,
      strategyTypeForLeg: "Long Call Butterfly",
    });
    setCategoryName(false);
    onDataUpdate(categoryName);
  };
  const getLongPutButterfly = () => {
    setStrategySelection({
      type: "triple leg",
      legType: LegType.Put,
      direction: DirectionType.Buy,
      legType1: LegType.Put,
      direction1: DirectionType.Sell,
      legType2: LegType.Put,
      direction2: DirectionType.Buy,
      strategyTypeForLeg: "Long Put Butterfly",
    });
    setCategoryName(false);
    onDataUpdate(categoryName);
  };
  const getShortCallButterfly = () => {
    setStrategySelection({
      type: "triple leg",
      legType: LegType.Call,
      direction: DirectionType.Sell,
      legType1: LegType.Call,
      direction1: DirectionType.Buy,
      legType2: LegType.Call,
      direction2: DirectionType.Sell,
      strategyTypeForLeg: "Short Call Butterfly",
    });
    setCategoryName(false);
    onDataUpdate(categoryName);
  };
  const getShortPutButterfly = () => {
    setStrategySelection({
      type: "triple leg",
      legType: LegType.Put,
      direction: DirectionType.Sell,
      legType1: LegType.Put,
      direction1: DirectionType.Buy,
      legType2: LegType.Put,
      direction2: DirectionType.Sell,
      strategyTypeForLeg: "Short Put Butterfly",
    });
    setCategoryName(false);
    onDataUpdate(categoryName);
  };

  const getIronButterfly = () => {
    setStrategySelection({
      type: "multi leg",
      legType: LegType.Put,
      direction: DirectionType.Buy,
      legType1: LegType.Put,
      direction1: DirectionType.Sell,
      legType2: LegType.Call,
      direction2: DirectionType.Sell,
      legType3: LegType.Call,
      direction3: DirectionType.Buy,
      strategyTypeForLeg: "Iron Butterfly",
    });
    setCategoryName(false);
    onDataUpdate(categoryName);
  };
  const getReverseIronButterfly = () => {
    setStrategySelection({
      type: "multi leg",
      legType: LegType.Put,
      direction: DirectionType.Sell,
      legType1: LegType.Put,
      direction1: DirectionType.Buy,
      legType2: LegType.Call,
      direction2: DirectionType.Buy,
      legType3: LegType.Call,
      direction3: DirectionType.Sell,
      strategyTypeForLeg: "Reverse Iron Butterfly",
    });
    setCategoryName(false);
    onDataUpdate(categoryName);
  };
  const getBullCallLadder = () => {
    setStrategySelection({
      type: "triple leg",
      legType: LegType.Call,
      direction: DirectionType.Buy,
      legType1: LegType.Call,
      direction1: DirectionType.Sell,
      legType2: LegType.Call,
      direction2: DirectionType.Sell,
      strategyTypeForLeg: "Bull Call Ladder",
    });
    setCategoryName(false);
    onDataUpdate(categoryName);
  };
  const getBullPutLadder = () => {
    setStrategySelection({
      type: "triple leg",
      legType: LegType.Put,
      direction: DirectionType.Buy,
      legType1: LegType.Put,
      direction1: DirectionType.Buy,
      legType2: LegType.Put,
      direction2: DirectionType.Sell,
      strategyTypeForLeg: "Bull Put Ladder",
    });
    setCategoryName(false);
    onDataUpdate(categoryName);
  };
  const getBearCallLadder = () => {
    setStrategySelection({
      type: "triple leg",
      legType: LegType.Call,
      direction: DirectionType.Sell,
      legType1: LegType.Call,
      direction1: DirectionType.Buy,
      legType2: LegType.Call,
      direction2: DirectionType.Buy,
      strategyTypeForLeg: "Bear Call Ladder",
    });
    setCategoryName(false);
    onDataUpdate(categoryName);
  };
  const getBearPutLadder = () => {
    setStrategySelection({
      type: "triple leg",
      legType: LegType.Put,
      direction: DirectionType.Sell,
      legType1: LegType.Put,
      direction1: DirectionType.Sell,
      legType2: LegType.Put,
      direction2: DirectionType.Buy,
      strategyTypeForLeg: "Bear Put Ladder",
    });
    setCategoryName(false);
    onDataUpdate(categoryName);
  };
  const getsyntheticCall = () => {
    setStrategySelection({
      type: "double leg",
      legType1: LegType.Stock,
      direction1: DirectionType.Buy,
      legType2: LegType.Put,
      direction2: DirectionType.Buy,
      strategyTypeForLeg: "Synthetic Call",
    });
    setCategoryName(false);
    onDataUpdate(categoryName);
  };
  const getsyntheticPut = () => {
    setStrategySelection({
      type: "double leg",
      legType1: LegType.Stock,
      direction1: DirectionType.Sell,
      legType2: LegType.Call,
      direction2: DirectionType.Buy,
      strategyTypeForLeg: "Synthetic Put",
    });
    setCategoryName(false);
    onDataUpdate(categoryName);
  };
  const getsyntheticLongStock = () => {
    setStrategySelection({
      type: "double leg",
      legType1: LegType.Put,
      direction1: DirectionType.Sell,
      legType2: LegType.Call,
      direction2: DirectionType.Buy,
      strategyTypeForLeg: "Synthetic Long Stock",
    });
    setCategoryName(false);
    onDataUpdate(categoryName);
  };
  const getsyntheticShortStock = () => {
    setStrategySelection({
      type: "double leg",
      legType1: LegType.Put,
      direction1: DirectionType.Buy,
      legType2: LegType.Call,
      direction2: DirectionType.Sell,
      strategyTypeForLeg: "Synthetic Short Stock",
    });
    setCategoryName(false);
    onDataUpdate(categoryName);
  };
  const getSyntheticLongStraddleCalls = () => {
    setStrategySelection({
      type: "triple leg",
      legType: LegType.Stock,
      direction: DirectionType.Sell,
      legType1: LegType.Call,
      direction1: DirectionType.Buy,
      legType2: LegType.Call,
      direction2: DirectionType.Buy,
      strategyTypeForLeg: "Synthetic Long Straddle Calls",
    });
    setCategoryName(false);
    onDataUpdate(categoryName);
  };
  const getSyntheticLongStraddlePuts = () => {
    setStrategySelection({
      type: "triple leg",
      legType: LegType.Stock,
      direction: DirectionType.Buy,
      legType1: LegType.Put,
      direction1: DirectionType.Buy,
      legType2: LegType.Put,
      direction2: DirectionType.Buy,
      strategyTypeForLeg: "Synthetic Long Straddle Puts",
    });
    setCategoryName(false);
    onDataUpdate(categoryName);
  };
  const getSyntheticShortStraddleCalls = () => {
    setStrategySelection({
      type: "triple leg",
      legType: LegType.Stock,
      direction: DirectionType.Buy,
      legType1: LegType.Call,
      direction1: DirectionType.Sell,
      legType2: LegType.Call,
      direction2: DirectionType.Sell,
      strategyTypeForLeg: "Synthetic Short Straddle Calls",
    });
    setCategoryName(false);
    onDataUpdate(categoryName);
  };
  const getSyntheticShortStraddlePuts = () => {
    setStrategySelection({
      type: "triple leg",
      legType: LegType.Stock,
      direction: DirectionType.Sell,
      legType1: LegType.Put,
      direction1: DirectionType.Sell,
      legType2: LegType.Put,
      direction2: DirectionType.Sell,
      strategyTypeForLeg: "Synthetic Short Straddle Puts",
    });
    setCategoryName(false);
    onDataUpdate(categoryName);
  };
  const getStrip = () => {
    setStrategySelection({
      type: "double leg",
      legType1: LegType.Call,
      direction1: DirectionType.Buy,
      legType2: LegType.Put,
      direction2: DirectionType.Buy,
      strategyTypeForLeg: "Strip",
    });
    setCategoryName(false);
    onDataUpdate(categoryName);
  };
  const getStrap = () => {
    setStrategySelection({
      type: "double leg",
      legType1: LegType.Call,
      direction1: DirectionType.Buy,
      legType2: LegType.Put,
      direction2: DirectionType.Buy,
      strategyTypeForLeg: "Strap",
    });
    setCategoryName(false);
    onDataUpdate(categoryName);
  };
  const getLongGuts = () => {
    setStrategySelection({
      type: "double leg",
      legType1: LegType.Call,
      direction1: DirectionType.Buy,
      legType2: LegType.Put,
      direction2: DirectionType.Buy,
      strategyTypeForLeg: "Long Guts",
    });
    setCategoryName(false);
    onDataUpdate(categoryName);
  };
  const getShortGuts = () => {
    setStrategySelection({
      type: "double leg",
      legType1: LegType.Call,
      direction1: DirectionType.Sell,
      legType2: LegType.Put,
      direction2: DirectionType.Sell,
      strategyTypeForLeg: "Short Guts",
    });
    setCategoryName(false);
    onDataUpdate(categoryName);
  };
  const getCollar = () => {
    setStrategySelection({
      type: "triple leg",
      legType: LegType.Stock,
      direction: DirectionType.Buy,
      legType1: LegType.Put,
      direction1: DirectionType.Buy,
      legType2: LegType.Call,
      direction2: DirectionType.Sell,
      strategyTypeForLeg: "Collar",
    });
    setCategoryName(false);
    onDataUpdate(categoryName);
  };
  const getLongCombo = () => {
    setStrategySelection({
      type: "double leg",
      legType1: LegType.Put,
      direction1: DirectionType.Sell,
      legType2: LegType.Call,
      direction2: DirectionType.Buy,
      strategyTypeForLeg: "Long Combo",
    });
    setCategoryName(false);
    onDataUpdate(categoryName);
  };
  const getShortCombo = () => {
    setStrategySelection({
      type: "double leg",
      legType1: LegType.Put,
      direction1: DirectionType.Buy,
      legType2: LegType.Call,
      direction2: DirectionType.Sell,
      strategyTypeForLeg: "Short Combo",
    });
    setCategoryName(false);
    onDataUpdate(categoryName);
  };
  const getLongBox = () => {
    setStrategySelection({
      type: "multi leg",
      legType: LegType.Put,
      direction: DirectionType.Sell,
      legType1: LegType.Call,
      direction1: DirectionType.Buy,
      legType2: LegType.Put,
      direction2: DirectionType.Buy,
      legType3: LegType.Call,
      direction3: DirectionType.Sell,
      strategyTypeForLeg: "Long Box",
    });
    setCategoryName(false);
    onDataUpdate(categoryName);
  };
  const getRatioCallBackSpread = () => {
    setStrategySelection({
      type: "double leg",
      legType1: LegType.Call,
      direction1: DirectionType.Sell,
      legType2: LegType.Call,
      direction2: DirectionType.Buy,
      strategyTypeForLeg: "Call Vertical spread",
    });
    setCategoryName(false);
    onDataUpdate(categoryName);
  };
  const getRatioPutBackSpread = () => {
    setStrategySelection({
      type: "double leg",
      legType1: LegType.Put,
      direction1: DirectionType.Buy,
      legType2: LegType.Put,
      direction2: DirectionType.Sell,
      strategyTypeForLeg: "Put Vertical spread",
    });
    setCategoryName(false);
    onDataUpdate(categoryName);
  };

  const handleStrategy = (newStrategy) => {
    if (parseInt(strategy) === parseInt(newStrategy)) {
      handleItemClick(Number(newStrategy));
      selectStrategy(newStrategy);
    }
    const params = new URLSearchParams(searchParams);
    params.set("strategy", newStrategy);
    router.push(`/trade/?${params.toString()}`);
  };

  const selectStrategy = (strategyNumber) => {
    switch (strategyNumber) {
      case 1:
        getLongCall();
        break;
      case 2:
        getShortCall();
        break;
      case 3:
        getLongPut();
        break;
      case 4:
        getShortPut();
        break;
      case 5:
        getCoveredCall();
        break;
      case 6:
        getCashSecuredPut();
        break;
      case 7:
        getBullCallSpread();
        break;
      case 8:
        getBearPutSpread();
        break;
      case 9:
        getBearCallSpread();
        break;
      case 10:
        getBullPutSpread();
        break;
      case 11:
        getRatioCallSpread();
        break;
      case 12:
        getRatioPutSpread();
        break;
      case 13:
        getlongCallCondor();
        break;
      case 14:
        getlongPutCondor();
        break;
      case 15:
        getIronCondor();
        break;
      case 16:
        getShortCallCondor();
        break;
      case 17:
        getShortPutCondor();
        break;
      case 18:
        getReverseIronCondor();
        break;
      case 19:
        getLongStraddle();
        break;
      case 20:
        getShortStraddle();
        break;
      case 21:
        getCoveredShortStraddle();
        break;
      case 22:
        getLongStrangle();
        break;
      case 23:
        getShortStrangle();
        break;
      case 24:
        getCoveredShortStrangle();
        break;
      case 25:
        getLongCallButterfly();
        break;
      case 26:
        getLongPutButterfly();
        break;
      case 27:
        getIronButterfly();
        break;
      case 28:
        getShortCallButterfly();
        break;
      case 29:
        getShortPutButterfly();
        break;
      case 30:
        getReverseIronButterfly();
        break;
      case 31:
        getBullCallLadder();
        break;
      case 32:
        getBullPutLadder();
        break;
      case 33:
        getBearCallLadder();
        break;
      case 34:
        getBearPutLadder();
        break;
      case 35:
        getsyntheticCall();
        break;
      case 36:
        getsyntheticPut();
        break;
      case 37:
        getsyntheticLongStock();
        break;
      case 38:
        getsyntheticShortStock();
        break;
      case 39:
        getSyntheticLongStraddleCalls();
        break;
      case 40:
        getSyntheticLongStraddlePuts();
        break;
      case 41:
        getSyntheticShortStraddleCalls();
        break;
      case 42:
        getSyntheticShortStraddlePuts();
        break;
      case 43:
        getStrip();
        break;
      case 44:
        getStrap();
        break;
      case 45:
        getLongGuts();
        break;
      case 46:
        getShortGuts();
        break;
      case 47:
        getCollar();
        break;
      case 48:
        getLongCombo();
        break;
      case 49:
        getShortCombo();
        break;
      case 50:
        getLongBox();
        break;
      case 51:
        getRatioCallBackSpread();
        break;
      case 52:
        getRatioPutBackSpread();
        break;
      case 53:
        getProtectivePut();
        break;
    }
  };
  // RS:- options strategy searching based on searchQuery
  const strategyData = useMemo(() => {
    if (!searchQuery) return { filteredData: [...searchStrategiesObjectData] };

    const lowerCaseSearchQuery = searchQuery.toLowerCase();

    const filteredData = searchStrategiesObjectData
      .map((strategy, index) => {
        const labelMatches = strategy.label.toLowerCase().includes(lowerCaseSearchQuery);
        const filteredChildren = strategy.children.filter((child) =>
          child.key.toLowerCase().includes(lowerCaseSearchQuery)
        );

        if (labelMatches || filteredChildren.length > 0) {
          return {
            ...strategy,
            children: filteredChildren,
          };
        }

        return null; // Exclude the strategy if there are no matches
      })
      .filter(Boolean); // Remove null elements from the array

    return { filteredData };
  }, [searchQuery]);

  const { filteredData } = strategyData;
  useEffect(() => {
    if (strategy) {
      const accordion = itemStrategyAccordionMapping[strategy];
      setActiveAccordion(accordion?.toString());
      selectStrategy(Number(strategy));
      handleItemClick(Number(strategy));
    }
  }, [strategy]);

  let getWidth = () => {
    setOpen(!open);
  };
  useEffect(() => {
    let getWindowWidth = window.innerWidth;
    if (getWindowWidth < 768) {
      setOpen(!open);
    } else {
      setOpen(open);
    }
  }, []);

  return (
    <>
      <Button
        onClick={getWidth}
        aria-controls="example-collapse-text"
        aria-expanded={open}
        className="SidebarCollapse"
        variant="outline-primary"
      >
        <span className="icon-arrow"></span>
      </Button>
      <Collapse in={open}>
        <aside className="col-12 col-lg-2 col-md-3 p-0">
          <div className={styles.searchSidebar}>
            <Form.Control
              className={styles.seachForm}
              type="text"
              placeholder={t("OptionsStrategies.Search strategy")}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Image src={Search} alt="login" width={15} height={15} className={styles.searchIcon} />
          </div>
          {/* RS:- strategyData rendered after importing from searchStrategiesObjectData */}
          <Accordion
            activeKey={searchQuery || activeAccordion}
            onSelect={(e: any) => {
              setActiveAccordion(e);
            }}
          >
            {filteredData.map((strategy, index) => {
              if (strategy.children.length === 0) return <div style={{ display: "none" }} key={strategy.label} />;
              return (
                <Accordion.Item eventKey={`${searchQuery || strategy.id}`} key={strategy.label}>
                  <Accordion.Header>{strategy.label}</Accordion.Header>
                  <Accordion.Body>
                    <ul className={styles.strategiesList}>
                      {strategy.children.map((child) => {
                        return (
                          <li
                            key={child.strategyId}
                            className={child.strategyId === activeIndex ? "active" : ""}
                            onClick={() => handleStrategy(child.strategyId)}
                          >
                            <span>
                              {t(child.translationKey)}
                              <span className={child.icon}></span>
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </Accordion.Body>
                </Accordion.Item>
              );
            })}
          </Accordion>
        </aside>
      </Collapse>
    </>
  );
};
export default StrategiesSidebar;
