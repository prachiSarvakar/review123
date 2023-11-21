"use client";
import Image from "next/image";
import { Tab, Tabs, Card, Button, SSRProvider } from "react-bootstrap";
import Stock from "./stock";
import Strategies from "../strategies/strategies";
import Chains from "./chains";
import Wishlist from "@/assets/images/wish_unfilled.png";
import WishlistFilled from "@/assets/images/wish_filled.png";
import Up from "@/assets/images/up.svg";
import Down from "@/assets/images/down.svg";
import styles from "@/styles/trade.module.scss";
import { fetchWatchlistGraph, removeFromWatchlist, addToWatchlist, watchlistData } from "@/redux/slices/watchlistSlice";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxCommon";
import { fetchTradeData, tradingData, tradingDataStatusNum } from "@/redux/slices/tradeDataSlice";
import { useEffect, useMemo, useState } from "react";
import { tradingGraphData } from "@/redux/slices/tradeGraphSlice";
import dynamic from "next/dynamic";
import { useTranslation } from "react-i18next";
import { addCommasFixedTwoToNumber, addCommasToNumber } from "@/utils/prize";
import { addDollarSignCommasToNumber } from "@/utils/positions";

const PlaceHolder = dynamic(() => import("./placeholder"), {
  ssr: false,
});

const Trade = () => {
  const dispatch = useAppDispatch();
  const valuesForTrade: any = useAppSelector(tradingData);
  const [wishlistIcon, setWishlistIcon] = useState(false);
  // const tradingDataStatusNumber: any = useAppSelector(tradingDataStatusNum);

  const tradingGraph: any = useAppSelector(tradingGraphData);
  const watchlistItems: any = useAppSelector(watchlistData);
  // const closeMarketGraph: any = useAppSelector(closeMarketGraphData);
  const searchParams = useSearchParams();
  const search: string | null = searchParams.get("q");
  const activeTabParam: string | null = searchParams.get("activeTab");
  const [activeTab, setActiveTab] = useState(activeTabParam || "stocks");
  const [imgValid, setImgValid] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let intervalId: any;
    if (search) {
      const fetchTradeCall = () => {
        dispatch(fetchTradeData(search));
      };
      intervalId = setInterval(fetchTradeCall, 2000);
      dispatch(fetchTradeData(search));
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [search, dispatch]);

  useEffect(() => {
    const containsSymbol = watchlistItems?.length && watchlistItems?.some((item) => item.symbol === search);
    if (containsSymbol) {
      setWishlistIcon(true);
    } else {
      setWishlistIcon(false);
    }
  }, [watchlistItems]);

  useEffect(() => {
    dispatch(fetchWatchlistGraph());
  }, [search]);

  //const tradeDataMap = valuesForTrade.filter((item: any) => item?.symbol === search);

  const tradeDataMap = useMemo(
    () => [valuesForTrade?.filter((item: any) => item?.symbol === search)?.slice(-1)[0]],
    [search, valuesForTrade]
  );

  const handleTabs = (tabKey: string | null) => {
    if (tabKey !== activeTab && tabKey) {
      setActiveTab(tabKey);
    }
  };

  const { t, i18n } = useTranslation();
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };
  //TODO: Focus on click
  // const handleFocusSearch = () => {
  //   dispatch(focusSearchBar());
  // };

  const toggleWishlistItem = () => {
    if (watchlistItems?.length && watchlistItems?.some((item) => item.symbol === search)) {
      dispatch(removeFromWatchlist(tradeDataMap[0]?.symbol));
      setWishlistIcon(false);
    } else {
      dispatch(addToWatchlist(tradeDataMap[0]?.symbol));
      setWishlistIcon(true);
    }
  };

  useEffect(() => {
    const handleImageError = () => {
      setImgValid(false);
    };

    const handleImageSuccess = () => {
      setImgValid(true);
    };

    const img = document.createElement("img");
    img.src = `https://storage.googleapis.com/iexcloud-hl37opg/api/logos/${search}.png`;
    img.onerror = handleImageError;
    img.onload = handleImageSuccess;

    img.style.display = "none";
    document?.body?.appendChild(img);

    return () => {
      document?.body?.removeChild(img);
    };
  }, [search]);

  return (
    <>
      <Card className="trade">
        <Card.Header className="d-flex align-items-center">
          <div className={styles.stockInfo}>
            <div className={styles.stockLogo}>
              {imgValid ? (
                <Image
                  src={
                    !search
                      ? "../assets/images/apple.svg"
                      : `https://storage.googleapis.com/iexcloud-hl37opg/api/logos/${search}.png`
                  }
                  alt="Default"
                  fill={true}
                />
              ) : (
                <div className={styles.letterLogoContainer}>
                  <span className={styles.letterLogo}>{search}</span>
                </div>
              )}
            </div>
            <div className={styles.info}>
              <h3 className={styles.stockName}>{!search ? "Apple Inc" : tradeDataMap[0]?.description}</h3>
              <span>(NASDAQ:{!search ? "NASDAQ" : tradeDataMap[0]?.symbol})</span>
              <div className={styles.priceMain}>
                <span className={styles.currency}>$</span>
                <span className={styles.price}>
                  {tradeDataMap[0]?.last === 0 ? 0 : addCommasFixedTwoToNumber(tradeDataMap[0]?.last) || "-"}
                </span>
                <span className={styles.change}>
                  $
                  {tradeDataMap[0]?.change === 0
                    ? 0
                    : tradeDataMap[0]?.change > 0
                    ? ` + ${addCommasToNumber(tradeDataMap[0]?.change)}`
                    : addCommasFixedTwoToNumber(tradeDataMap[0]?.change < 0 && +tradeDataMap[0]?.change) || "-"}
                  (
                  {tradeDataMap[0]?.change_percentage === 0
                    ? 0
                    : (tradeDataMap[0]?.change_percentage !== null &&
                        addCommasFixedTwoToNumber(tradeDataMap[0]?.change_percentage) + "%") ||
                      "-"}
                  )
                  {tradeDataMap[0]?.change_percentage === 0 || tradeDataMap[0]?.change_percentage > 0 ? (
                    <Image src={Up} alt="Up" width={14} height={14} />
                  ) : (
                    <Image src={Down} alt="Down" width={14} height={14} />
                  )}
                </span>
              </div>
            </div>
          </div>
          <Button onClick={() => toggleWishlistItem()} variant="outline-primary ms-auto">
            <span className={`m-0 text-center ${wishlistIcon ? "icon-wishlist-filled" : "icon-wishlist"}`}></span>
          </Button>
        </Card.Header>
        <Card.Body className="tradeContent">
          <Tabs activeKey={activeTab} onSelect={handleTabs} id="justify-tab-example" className="mainTabs">
            <Tab eventKey="stocks" title={t("stockPage.Stock")}>
              {activeTab === "stocks" && <Stock />}
            </Tab>
            <Tab eventKey="option-strategies" title={t("stockPage.Option Strategies")}>
              {activeTab === "option-strategies" && (
                <Strategies
                  tradeData={0}
                  getYaxisData={0}
                  data1={undefined}
                  getExpiryDate={undefined}
                  values1={""}
                  strategyType={""}
                  tradeDataStock1={undefined}
                />
              )}
            </Tab>
            <Tab eventKey="chains" title={t("stockPage.Chains")}>
              {activeTab === "chains" && (
                <Chains
                  tradeData={0}
                  getYaxisData={0}
                  data1={undefined}
                  getExpiryDate={undefined}
                  values1={""}
                  strategyType={""}
                  tradeDataStock1={undefined}
                  handleTabs={handleTabs}
                />
              )}
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>
    </>
  );
};
export default Trade;
