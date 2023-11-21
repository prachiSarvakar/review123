"use client";
import Image from "next/image";
import dynamic from "next/dynamic";
import styles from "@/styles/trade.module.scss";
import { Button, SSRProvider, Tab, Tabs, Offcanvas } from "react-bootstrap";
import Up from "@/assets/images/up.svg";
import Down from "@/assets/images/down.svg";
import Buy from "@/assets/images/buy.svg";
import Sell from "@/assets/images/sell.svg";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxCommon";
import { fetchTradeData, tradingData, tradingDataStatusNum } from "@/redux/slices/tradeDataSlice";
import { exchData } from "../../utils/exchangeValueConstants";
import { todayDate, yesterdayDate } from "@/utils/dates";
import ChartWidget from "@/components/charts/chartWidget";
import Modal from "react-bootstrap/Modal";
import BuySell from "./buysell";
import Cookies from "js-cookie";
import { SERACHED_STOCK_DATA } from "@/constants/common";
import { useTranslation } from "react-i18next";
import { addCommasFixedTwoToNumber, addCommasToNumber } from "@/utils/prize";
import { addDollarSignCommasToNumber } from "@/utils/positions";

const TradeChart = dynamic(() => import("@/components/charts/tradestocks"), {
  ssr: false,
});

enum ActiveTabType {
  buy = "buy",
  sell = "sell",
}

const Stock = () => {
  const valuesForTrade: any = useAppSelector(tradingData);

  const searchParams: any = useSearchParams();
  const search: string | null = searchParams.get("q");
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [selectedStockOrder, setSelectedStockOrder] = useState<any>("");
  const handleClose = () => setShow(false);
  const handleShow = () => {
    setShow(true);
  };
  const [show2, setShow2] = useState(false);

  useEffect(() => {
    if (search) {
      const params = new URLSearchParams(searchParams);
      params.set("q", search);
      router.push(`/trade/?${params.toString()}`);
    }
  }, [search, router]);

  useEffect(() => {
    if (search) {
      dispatch(fetchTradeData(search));
    }
  }, [search, dispatch]);

  const tradeDataMap: any = valuesForTrade.filter((item: any) => item?.symbol === search);
  const mapExchData: any = tradeDataMap[0]?.exch;
  const exchDataforLabel = exchData[mapExchData];

  useEffect(() => {
    if (tradeDataMap.length > 0) {
      storeInCookie(tradeDataMap[0]);
    }
  }, [tradeDataMap]);

  useEffect(() => {
    let res: any = Cookies.get(SERACHED_STOCK_DATA);
    if (res != undefined) {
      res = JSON.parse(res);
    } else {
      res = [];
    }
  }, []);

  const storeInCookie = (value: any) => {
    let res: any = Cookies.get(SERACHED_STOCK_DATA);
    if (res != undefined) {
      res = JSON.parse(res);
    }
    let arr: any = [];
    if (res == undefined) {
      arr = [];
    } else {
      arr = [...res];
    }
    if (!arr.some((item: any) => item.symbol === value.symbol)) {
      arr.unshift(value);
    }
    Cookies.set(SERACHED_STOCK_DATA, JSON.stringify(arr.slice(0, 4)));
  };

  const { t, i18n } = useTranslation();
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <header>
      <SSRProvider>
        <section className={styles.stockMain}>
          <div className="stockDetails">
            <ul>
              <li>
                <label>{t("StockInfo.Exchange")}</label>
                <strong>
                  {exchDataforLabel || "-"}
                  {exchDataforLabel && " "}
                  {tradeDataMap[0]?.symbol || "-"}
                </strong>
              </li>
              <li>
                <label>{t("StockInfo.TodayOpen")}</label>
                <strong>
                  {addDollarSignCommasToNumber(tradeDataMap[0]?.open === 0 ? 0 : tradeDataMap[0]?.open) || "0"}
                </strong>
              </li>
              <li>
                <label>{t("StockInfo.PreviousClose")}</label>
                <strong>
                  {addDollarSignCommasToNumber(tradeDataMap[0]?.prevclose === 0 ? 0 : tradeDataMap[0]?.prevclose) ||
                    "-"}
                </strong>
              </li>
              <li>
                <label>{t("StockInfo.DayRange")}</label>
                <strong>
                  {addDollarSignCommasToNumber(tradeDataMap[0]?.low === 0 ? 0 : tradeDataMap[0]?.low) || "$0.00"}
                  {addDollarSignCommasToNumber(tradeDataMap[0]?.low) && "0"}-
                  {addDollarSignCommasToNumber(tradeDataMap[0]?.high === 0 ? 0 : tradeDataMap[0]?.high) || "$0.00"}
                </strong>
              </li>
              <li>
                <label>{t("StockInfo.Volume")}</label>
                <strong>{tradeDataMap[0]?.volume === 0 ? 0 : addCommasToNumber(tradeDataMap[0]?.volume) || "-"}</strong>
              </li>
            </ul>
            <div className={styles.btnGrp}>
              <Button
                variant="success"
                onClick={() => {
                  setShow(true);
                  setSelectedStockOrder(ActiveTabType.buy);
                }}
              >
                <span className="icon-buy"></span>
                {t("stockPage.Buy Stock")}
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  setShow(true);
                  setSelectedStockOrder(ActiveTabType.sell);
                }}
              >
                <span className="icon-sell"></span>
                {t("stockPage.Sell Stock")}
              </Button>
            </div>
          </div>
          <div className="ChartTabs">
            <div className={styles.stockinformation}>
              <div className={styles.priceMain}>
                <span className={styles.currency}>$</span>
                <span className={styles.price}>
                  {addCommasFixedTwoToNumber(tradeDataMap[0]?.last === 0 ? 0 : tradeDataMap[0]?.last) || "-"}
                </span>
                <span className={styles.change}>
                  {tradeDataMap[0]?.change === 0 ? 0 : addDollarSignCommasToNumber(tradeDataMap[0]?.change)}(
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
              <Button variant="outline-primary" className={styles.btn} onClick={() => setShow2(true)}>
                <span className="icon-fullscreen"></span>
              </Button>
              {/* <div className='filterBtns'>
                      <Button variant="primary">1D</Button>
                      <Button variant="link">1M</Button>
                      <Button variant="link">3M</Button>
                      <Button variant="link">1Y</Button>
                      <Button variant="link">YTD</Button>
                  </div> */}
            </div>
            <ChartWidget />
            {/* <Tabs
            defaultActiveKey="custom"
            id="uncontrolled-tab-example"
            className=""
          >
            <Tab eventKey="custom" title="Chart">
              <TradeChart />
            </Tab>
            <Tab eventKey="widget" title="Widget">
              
            </Tab>
            
          </Tabs> */}
          </div>

          <Modal
            show={show2}
            onHide={() => setShow2(false)}
            dialogClassName="widget"
            aria-labelledby="example-custom-modal-styling-title"
          >
            <Modal.Header closeButton>
              <Modal.Title id="example-custom-modal-styling-title"></Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <ChartWidget />
            </Modal.Body>
          </Modal>
        </section>
        <Offcanvas show={show} onHide={handleClose} placement="end">
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>
              {t("stockPage.Buy/Sell Stock")} - {`"${tradeDataMap[0]?.symbol}"`}
            </Offcanvas.Title>
          </Offcanvas.Header>
          <BuySell
            handleClose={handleClose}
            tradeDataMap={tradeDataMap.map((el) => {
              return { ...el, type: "market" };
            })}
            selectedStockOrder={selectedStockOrder}
          />
        </Offcanvas>
      </SSRProvider>
    </header>
  );
};

export default Stock;
