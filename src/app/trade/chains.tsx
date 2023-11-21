"use client";
import styles from "@/styles/chains.module.scss";
import { Button, Dropdown, Alert, ButtonGroup, Offcanvas, Container, Row, Col } from "react-bootstrap";
import strategiesStyles from "@/styles/strategies.module.scss";
import React, { useState, useEffect } from "react";
import ChainTable from "../chains/chainTable";
import DateSlider from "./DateSlider";
import { X } from "react-bootstrap-icons";
import { useRouter, usePathname, useSearchParams, useParams } from "next/navigation";
import { buyOrSellSelectedRemove, clearOptions } from "@/redux/slices/chainsDetailsSlice";
import { useSelector, useDispatch } from "react-redux";
import { Leg } from "@/utils/legs";
import SummaryHelper from "@/utils/OptionStrategyCalculation";
import SpreadSheetViewModel from "@/utils/SpreadSheetCalculation";
import { setData } from "@/redux/slices/optionTypeSlice";
import options from "@/utils/optionSummeryCalc";
import BuyStrategies from "./buystrateigs";
import { fetchTradeData, tradingData } from "@/redux/slices/tradeDataSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxCommon";
import { optionGreekData } from "@/redux/slices/optionGreekSlice";
import { formatedDate, formattedDate } from "@/utils/dates";
import { useTranslation } from "react-i18next";
import { addDollarSignCommasToNumber, getStrategyIdFromLegs } from "@/utils/positions";
import { todayDate, yesterdayDate } from "@/utils/dates";
import { addCommasFixedTwoToNumber, addCommasToNumber } from "@/utils/prize";

enum FilterType {
  ProfitLossDollar = 0,
  ProfitLossPercentage = 1,
}

const Chains = ({
  tradeData,
  getYaxisData,
  data1,
  getExpiryDate,
  values1,
  strategyType,
  tradeDataStock1,
  handleTabs,
}) => {
  const router = useRouter();
  const pathName = usePathname();
  const [show, setShow] = useState(false);
  const [showSaveRespModal, setShowSaveRespModal] = useState(false);
  const [delta, setDelta] = useState<number>(null);
  const [theta, setTheta] = useState<number>(null);
  const [gamma, setGamma] = useState<number>(null);
  const [vega, setVega] = useState<number>(null);
  const [rho, setRho] = useState<number>(null);
  const searchParams: any = useSearchParams();
  const dispatchApp = useAppDispatch();
  const [expiryDate, setExpiryDate] = useState<any>();
  const valuesForTrade: any = useAppSelector(tradingData);
  const selectedOptions = useSelector((state: any) => state.chainsDetails.selectedOptions);
  const search: string | null = searchParams.get("q");
  const tradeDataMap = valuesForTrade.filter((item: any) => item?.symbol === search);
  const tradeDataStock = tradeDataMap[0]?.last;
  const selectedExpirationDate: any = useAppSelector(optionGreekData);
  const [filtertype, setFilterType] = useState(FilterType.ProfitLossDollar);
  const [data, setGetData] = useState<any>();
  const [netDebCred, setNetDebCred] = useState<any>();
  const [nearestValue, setNearestValue] = useState<any>({});
  const dispatch = useDispatch();
  const chainDetials = useSelector((state: any) => state.chainsDetails.data);
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [widthofStrike, setWidthofStrike] = useState(5);
  const calculateNetValue = (strategy: any) => {
    let price = 0.0;
    const direction: any = 1.0;
    let size = 1;
    if (strategy.type !== "stock") {
      price += -((parseFloat(direction) * size * 100 * (strategy.ask + strategy.bid)) / 2);
    }

    let title = "Net Credit";
    if (price < 0) {
      title = "Net Debit";
    }

    return {
      title: title,
      value: price.toFixed(2),
    };
  };

  useEffect(() => {
    if (search) {
      dispatchApp(fetchTradeData(search));
      dispatchApp(clearOptions());
    }
  }, [search, dispatchApp]);

  let getData;

  const selectedOptionData: Leg[] = selectedOptions.map((option, index) => {
    const legTypeVal = option.option_type === "call" ? 0 : 1;
    const optionTypeVal = option.option_type;
    const direction = (() => {
      if (
        option.call_sell === "call-sellToOpen" ||
        option.call_sell === "call-sellToClose" ||
        option.put_sell === "put-sellToOpen" ||
        option.put_sell === "put-sellToClose"
      ) {
        return -1;
      } else if (
        option.call_buy === "call-buyToOpen" ||
        option.call_buy === "call-buyToClose" ||
        option.put_buy === "put-buyToOpen" ||
        option.put_buy === "put-buyToClose"
      ) {
        return 1;
      } else {
        return 0;
      }
    })();
    const strike = option?.strike;
    const expirationDate = option?.expiration_date;
    const expirationDateUTC = new Date(expirationDate);
    let expirationDateUTCTemp = new Date(
      expirationDateUTC.getUTCFullYear(),
      expirationDateUTC.getUTCMonth(),
      expirationDateUTC.getUTCDate(),
      expirationDateUTC.getUTCHours(),
      expirationDateUTC.getUTCMinutes(),
      expirationDateUTC.getUTCSeconds()
    );
    expirationDateUTCTemp.setHours(16, 0, 0, 0);

    const volatility = option?.greeks?.mid_iv * 100;
    const ask = option?.ask || 0;
    const bid = option?.bid || 0;
    const purchasePrice = (ask + bid) / 2;
    const type = option?.option_type;
    const symbol = option?.root_symbol;
    return {
      y: index, // Use the index as the 'y' property
      strike,
      size: 1, // Adjust the size as needed
      purchasePrice,
      direction,
      actualQualtity: direction === 1 ? 1 : -1,
      type: legTypeVal, // You can adjust this based on your needs
      expiration: expirationDateUTCTemp,
      symbol: symbol, // Provide the appropriate symbol
      volatility,
      range: 1, // Adjust the range as needed
      indexOfStrikePrice: 1, // Adjust this as needed
      index,
    };
  });

  const legs = selectedOptionData.map((legData) => {
    return { ...legData }; // Create a copy of legData
  });

  for (let i = 0; i < selectedOptionData.length; i++) {
    const legTypeVal = selectedOptionData[i].legTypeVal;
    const optionTypeVal = selectedOptionData[i].optionTypeVal;
    const direction = selectedOptionData[i].direction;
    const strikeValue = selectedOptionData[i].strike;
    const expirationDateUTCValue = selectedOptionData[i].expirationDateUTC;
    const volatilityValue = selectedOptionData[i].volatility;
    const purchasePriceValue = selectedOptionData[i].purchasePrice;
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
  const Breakeven = summary.getBreakEvenValue();
  const getValues = summary.getMinMaxProfit();
  const netValue = summary.calculateNetValue();
  const spredTable = new SpreadSheetViewModel(data, filtertype);
  spredTable.calculateData();
  const { yAxis, container } = spredTable.getDetails();
  const dispatchSlide = useAppDispatch();

  function formatNumberWithCommas(value: string): string {
    if (value?.toLowerCase() === "infinite") {
      return "Infinite";
    }
    value = value?.replace(/,/g, "")?.replace("$", "");
    const numericValue = parseFloat(value);
    if (!isNaN(numericValue)) {
      if (numericValue >= 0) {
        return `$${numericValue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
      } else {
        return `-$${Math.abs(numericValue).toLocaleString(undefined, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        })}`;
      }
    }
    return value; // Return the original value if it doesn't match any of the above cases
  }

  const formattedValue = formatNumberWithCommas(getValues?.min);
  const formattedValueMax = formatNumberWithCommas(getValues?.max);

  useEffect(() => {
    if (container && container.length > 0) {
      dispatchSlide(setData(container));
    }
  }, [container, dispatchSlide]);

  useEffect(() => {
    let arr: any = [];
    if (selectedExpirationDate.length > 0) {
      selectedExpirationDate.map((item: any) => {
        const trimNumber = item?.strike;
        arr.push(trimNumber);
      });
      const nearestObject = selectedExpirationDate?.reduce((nearest: any, obj: any) => {
        const currentDiff = Math.abs(obj?.strike - tradeDataStock);
        const nearestDiff = Math.abs(nearest?.strike - tradeDataStock);

        if (currentDiff < nearestDiff) {
          return obj;
        } else {
          return nearest;
        }
      });

      setExpiryDate(nearestObject.expiration_date);

      const netDebitCredit = calculateNetValue(nearestObject);
      setNetDebCred(netDebitCredit);
      setNearestValue(nearestObject);
    }
  }, [selectedExpirationDate, tradeDataStock]);

  const removeSelected = (item: any) => {
    if (item["call_sell_id"] != 0) {
      let key = "call_sell";
      dispatch(buyOrSellSelectedRemove({ item, key }));
    } else if (item["call_buy_id"] != 0) {
      let key = "call_buy";
      dispatch(buyOrSellSelectedRemove({ item, key }));
    } else if (item["put_buy_id"] != 0) {
      let key = "put_buy";
      dispatch(buyOrSellSelectedRemove({ item, key }));
    } else if (item["put_sell_id"] != 0) {
      let key = "put_sell";
      dispatch(buyOrSellSelectedRemove({ item, key }));
    }
  };

  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const { t, i18n } = useTranslation();
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const NetDebitText = t("StockInfo.Net Debit");

  useEffect(() => {
    if (selectedOptions && selectedOptions.length > 0) {
      let sumDelta = 0;
      let sumTheta = 0;
      let sumGamma = 0;
      let sumVega = 0;
      let sumRHO = 0;
      const directions = selectedOptions.map((item) => {
        if (
          (item.call_buy === "call-buyToOpen" && item.call_buy_id !== 0) ||
          (item.put_buy === "put-buyToOpen" && item.put_buy_id !== 0) ||
          (item.call_buy === "call-buyToClose" && item.call_buy_id !== 0) ||
          (item.put_buy === "put-buyToClose" && item.put_buy_id !== 0)
        ) {
          return 1;
        } else if (
          (item.call_sell === "call-sellToOpen" && item.call_sell_id !== 0) ||
          (item.put_sell === "put-sellToOpen" && item.put_sell_id !== 0) ||
          (item.call_sell === "call-sellToClose" && item.call_sell_id !== 0) ||
          (item.put_sell === "put-sellToClose" && item.put_sell_id !== 0)
        ) {
          return -1;
        } else {
          return 0;
        }
      });
      selectedOptions?.forEach((item, index) => {
        const deltaValueCheck = parseFloat(item?.greeks?.delta) || 0;
        const validDeltaValue = isNaN(deltaValueCheck) ? 0 : deltaValueCheck;

        const deltaValue = validDeltaValue * 100 * directions[index];
        sumDelta += deltaValue;
        const thetaValue = item?.greeks?.theta * 100 * directions[index];
        sumTheta += thetaValue;
        const gammaValue = item?.greeks?.gamma * 100 * directions[index];
        sumGamma += gammaValue;
        const vegaValue = item?.greeks?.vega * 100 * directions[index];
        sumVega += vegaValue;
        const RHOValue = item?.greeks?.rho * 100 * directions[index];
        sumRHO += RHOValue;
      });
      setDelta(sumDelta);
      setTheta(sumTheta);
      setGamma(sumGamma);
      setVega(sumVega);
      setRho(sumRHO);
    } else {
      // If there's no data in selectedOptions, set all values to 0 or -1 if needed
      setDelta(null);
      setTheta(null);
      setGamma(null);
      setVega(null);
      setRho(null);
    }
  }, [selectedOptions, selectedExpirationDate]);

  const handleClearAll = () => {
    selectedOptions.forEach((item) => {
      if (item["call_sell_id"] !== 0) {
        let key = "call_sell";
        dispatch(buyOrSellSelectedRemove({ item, key }));
      } else if (item["call_buy_id"] !== 0) {
        let key = "call_buy";
        dispatch(buyOrSellSelectedRemove({ item, key }));
      } else if (item["put_buy_id"] !== 0) {
        let key = "put_buy";
        dispatch(buyOrSellSelectedRemove({ item, key }));
      } else if (item["put_sell_id"] !== 0) {
        let key = "put_sell";
        dispatch(buyOrSellSelectedRemove({ item, key }));
      }
    });
  };

  useEffect(() => {
    if (chainDetials?.length > 0) {
      const stockValue = tradeDataStock;
      const callOptions = chainDetials?.filter((option) => option?.option_type === "call");
      const putOptions = chainDetials?.filter((option) => option?.option_type === "put");

      callOptions.sort((a, b) => Math.abs(a?.strike - stockValue) - Math.abs(b?.strike - stockValue));
      putOptions.sort((a, b) => Math.abs(a?.strike - stockValue) - Math.abs(b?.strike - stockValue));

      // Calculate the number of rows to display based on widthofStrike
      const rowCount = widthofStrike * 2; // Display rows on both sides of the nearest strike

      // Select rows based on the calculated rowCount
      const selectedCallOptions = callOptions?.slice(0, rowCount);
      const selectedPutOptions = putOptions?.slice(0, rowCount);

      // Combine selected call and put rows
      const combinedRows = [...selectedCallOptions, ...selectedPutOptions];
      combinedRows?.sort((a, b) => a?.strike - b?.strike);

      setSelectedRows(combinedRows);
    }
  }, [chainDetials, tradeDataStock, widthofStrike]);

  let strategyNumber: any = getStrategyIdFromLegs(getData?.legs);
  const analyzRedirection = () => {
    sessionStorage.setItem("chainStrategy", JSON.stringify({ ...getData, ticker: search }));
    handleTabs("option-strategies");

    const params = new URLSearchParams(searchParams);
    setTimeout(() => {
      params.set("activeTab", "option-strategies");
      params.set("strategy", strategyNumber);
      router.push(`${pathName}?${params.toString()}`);
    }, 3000);
  };
  const netTitle = netValue?.title;
  return (
    <>
      <section className={styles.ChainContainer}>
        <div className="container-fluid p-0">
          <DateSlider setType={() => {}} page="chains" />
          <div className="stockDetails">
            <ul>
              <li>
                <label>{netValue?.title ? netValue?.title : NetDebitText}</label>
                <strong>{netValue?.value ? addDollarSignCommasToNumber(netValue.value) : "-"}</strong>
              </li>
              <li>
                <label>{t("StockInfo.Max Loss")}</label>
                <strong>{formattedValue}</strong>
              </li>
              <li>
                <label>{t("StockInfo.Max Profit")}</label>
                <strong>
                  <strong>{formattedValueMax}</strong>
                </strong>
              </li>
              <li>
                <label>{t("StockInfo.Breakeven")}</label>
                <strong>{Breakeven || "-"}</strong>
              </li>
              <li>
                <label>Delta (Δ)</label>
                <strong>{addCommasFixedTwoToNumber(delta) || "-"}</strong>
              </li>
              <li>
                <label>Theta(Θ)</label>
                <strong>{addCommasFixedTwoToNumber(theta) || "-"}</strong>
              </li>
              <li>
                <label>Gamma(Γ)</label>
                <strong>{addCommasFixedTwoToNumber(gamma) || "-"}</strong>
              </li>
              <li>
                <label>Vega (v)</label>
                <strong>{addCommasFixedTwoToNumber(vega) || "-"}</strong>
              </li>
              <li>
                <label>RHO(ρ)</label>
                <strong>{addCommasFixedTwoToNumber(rho) || "-"}</strong>
              </li>
            </ul>
          </div>
          {selectedOptions.length > 0 ? (
            <Container fluid className="chainLegs">
              <Row>
                {/* <Col lg={3} md={6} xs={12}>
            <Alert key="danger" variant="outline-primary" className={styles.sucessmsg}>
              <div className="d-flex justify-content-between alertInfo">
                <ul className="left-content">
                  <li>
                    <strong>
                      {!search ? "NASDAQ" : tradeDataMap[0]?.symbol}
                      &nbsp;{" "}
                      {/* Commented {chainDetials && chainDetials[0] && formatDate(chainDetials[0]['expiration_date'])} &nbsp; */}
                {/* $ {tradeDataMap[0]?.last === 0 ? 0 : tradeDataMap[0]?.last || "-"}
                    </strong> */}
                {/* Commented <strong>$174.00 </strong> */}
                {/* </li>
                </ul>

                <div className="right-price">
                  <strong>
                    ${" "}
                    {tradeDataMap[0]?.change === 0
                      ? 0
                      : tradeDataMap[0]?.change > 0
                      ? "+" + tradeDataMap[0]?.change
                      : (tradeDataMap[0]?.change < 0 && "-" + tradeDataMap[0]?.change) || "-"}{" "}
                  </strong>

                  <span>
                    (
                    {tradeDataMap[0]?.change_percentage === 0
                      ? 0
                      : (tradeDataMap[0]?.change_percentage !== null && tradeDataMap[0]?.change_percentage + "%") ||
                        "-"}
                    )
                  </span>
                </div>
              </div>
            </Alert>
          </Col> */}

                {/* 
        
        New logic of order
        ===============================================================================================
        */}
                <Col lg={12} md={12} xs={12}>
                  {selectedOptions &&
                    selectedOptions.map((item, index) => (
                      <Alert
                        key={index}
                        variant={
                          (item["call_buy_id"] != 0 && item["call_buy"] == "call-buyToOpen") ||
                          (item["call_buy_id"] != 0 && item["call_buy"] == "call-buyToClose") ||
                          (item["put_buy_id"] != 0 && item["put_buy"] == "put-buyToClose") ||
                          (item["put_buy_id"] != 0 && item["put_buy"] == "put-buyToOpen")
                            ? "success"
                            : "danger"
                        }
                        className={styles.sucessmsg}
                      >
                        <div className="d-flex justify-content-between alertInfo">
                          <ul className="left-content">
                            <li>
                              <strong>
                                {formattedDate(item["expiration_date"])} $ {item?.strike}{" "}
                                {item.option_type ? capitalizeFirstLetter(item.option_type) : ""}
                              </strong>
                              <strong>
                                {/* {(item["call_buy_id"] != 0 && item["call_buy"] == "call-buyToOpen") ||
                                (item["call_buy_id"] != 0 && item["call_buy"] == "call-buyToClose") ||
                                (item["put_buy_id"] != 0 && item["put_buy"] == "put-buyToClose") ||
                                (item["put_buy_id"] != 0 && item["put_buy"] == "put-buyToOpen")
                                  ? "(Buy)"
                                  : "(Sell)"} */}

                                {item["call_buy"] === "call-buyToOpen"
                                  ? "(Buy To Open)"
                                  : item["put_buy"] === "put-buyToOpen"
                                  ? "(Buy To Open)"
                                  : item["call_buy"] === "call-buyToClose"
                                  ? "(Buy To Close)"
                                  : item["put_buy"] === "put-buyToClose"
                                  ? "(Buy To Close)"
                                  : ""}

                                {item["call_sell"] === "call-sellToOpen"
                                  ? "(Sell To Open)"
                                  : item["put_sell"] === "put-sellToOpen"
                                  ? "(Sell To Open)"
                                  : item["call_sell"] === "call-sellToClose"
                                  ? "(Sell To Close)"
                                  : item["put_sell"] === "put-sellToClose"
                                  ? "(Sell To Close)"
                                  : ""}
                              </strong>
                              {/* <strong>$174.00 </strong>
                                  <span className="symbol">C</span> */}
                            </li>
                          </ul>
                          <div className="right-price">
                            <strong>{addDollarSignCommasToNumber((item.bid + item.ask) / 2) || 0} </strong>
                            <span>(-$ {addCommasToNumber(item.change) || 0})</span>
                            <span
                              style={{
                                cursor: "pointer",
                                margin: "2px",
                                color: "red",
                              }}
                              onClick={() => removeSelected(item)}
                              className="close-btn"
                            >
                              <X size={20} />
                            </span>
                          </div>
                        </div>
                      </Alert>
                    ))}
                </Col>

                {/* 
        
        New logic of order
        ===============================================================================================
        */}
              </Row>
            </Container>
          ) : (
            ""
          )}
        </div>

        <div className={styles.notes}>
          <div className={styles.left}>
            <p>
              <span>{t("Chain.Note")}:</span> {t("Chain.NoteDes")}
            </p>
            <div className={styles.StickeWidth}>
              <label>{t("Chain.Strike Count")}</label>
              <select
                value={widthofStrike}
                onChange={(e) => {
                  const selectedWidth = parseInt(e.target.value, 10);
                  setWidthofStrike(selectedWidth);
                }}
                className={styles.dropdown}
              >
                <option value={-1}>All</option>
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={30}>30</option>
                <option value={40}>40</option>
                <option value={50}>50</option>
              </select>
            </div>
            <div className={styles.StickeWidth} onClick={handleClearAll}>
              {selectedOptions.length > 0 ? (
                <label className={styles.clear__act}>Clear All</label>
              ) : (
                <label className={styles.clear}>Clear All</label>
              )}
            </div>
          </div>
          <div className={styles.right}>
            <Button variant="outline-primary" onClick={analyzRedirection} disabled={!selectedOptions?.length}>
              <span className="icon-analysis"></span> Analyze
            </Button>
            <Button disabled={!selectedOptions.length} variant="outline-primary" onClick={handleShow}>
              <span className="icon-link"></span> {t("Chain.Place Order")}
            </Button>
          </div>
        </div>

        <ChainTable stockValue={tradeDataStock} filteredRows={selectedRows} widthofStrike={widthofStrike} />
      </section>

      <Offcanvas className={strategiesStyles.buyStrategiesPopup} show={show} onHide={handleClose} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            Buy Strategies - {`"${selectedOptions.length && selectedOptions[0].root_symbol}"`}
          </Offcanvas.Title>
        </Offcanvas.Header>
        <BuyStrategies
          tradeDataMap={tradeDataMap}
          allItems={selectedOptions}
          removeSelected={removeSelected}
          chainDetials={chainDetials}
          netTitle={netTitle}
        />
      </Offcanvas>

      {/* <Offcanvas className={strategiesStyles.buyStrategiesPopup} show={showSaveRespModal} onHide={handleRespModalClose} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Buy Strategies</Offcanvas.Title>
        </Offcanvas.Header>
        <ApiResp />
      </Offcanvas> */}
    </>
  );
};

export default Chains;
