"use client";
import Image from "next/image";
import { todayDate, yesterdayDate } from "@/utils/dates";
import { useRouter } from "next/navigation";
import { LegType } from "@/utils/legs";
import { Offcanvas, Collapse } from "react-bootstrap";
import stylesStrategies from "@/styles/strategies.module.scss";
import { formattedDate, formatedDate } from "@/utils/dates";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import Popups from "../popups/page";
import Rollover from "../popups/rollover";
import Errors from "../popups/errors";
import dynamic from "next/dynamic";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxCommon";
import React, { useEffect, useRef, useState } from "react";
import { fetchQuotesData, quotesData } from "@/redux/slices/quoteSlice";
import { fetchDividends, dividendsData } from "@/redux/slices/dividendsSlice";
import { fetchCalendars, calendarsData } from "@/redux/slices/calendarsSlice";
import BuySell from "../trade/buysell";
import BuyStrategies from "../strategies/buystrateigs";
import {
  addDollarSignCommasToNumber,
  arrangeDataForTable,
  customToFixed,
  getTickerFromOptionSymbol,
  getUpcomingEvent,
  makeSummaryData,
  setSign,
  sortAlphabetically,
  totalGainLossCalculation,
} from "@/utils/positions";
import DropdownWithCheckboxes from "./manageColumns";
import { addCommasToNumber } from "@/utils/prize";

import { useTranslation } from "react-i18next";
import { getStratergyNameForStrategyId } from "@/constants/searchStrategiesObjectData";

const DataTable = dynamic(() => import("react-data-table-component"), {
  ssr: false,
});

const Positions = (positions: any, lastRefresh: string) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const symbolData: any = useAppSelector(quotesData);
  const dividendsDataArr: any = useAppSelector(dividendsData);

  const calendarsDataArr: any = useAppSelector(calendarsData);
  const router = useRouter();

  const [show, setShow] = useState(false);

  const [showBuySell, setShowBuySell] = useState<any>(false);
  const [actionType, setActionType] = useState("add_to_existing");
  const [strategyDescription, setStrategyDescription] = useState("");
  const [strategyTicker, setStrategyTicker] = useState("");
  const [openEntries, setOpenEntries] = useState({});
  const [showStrategy, setShowStrategy] = useState<any>(false);
  const [showStockStrategy, setShowStockStrategy] = useState<any>([]);
  const [show4, setShow4] = useState(false);
  const [selectedStockOrder, setSelectedStockOrder] = useState<any>("buy");
  const [selectedColumns, setSelectedColumns] = useState([
    "days_left",
    "today_gain_loss",
    "total_gain_loss",
    "roi",
    "position_delta",
    "mark",
    "mkt_value",
    "div_date",
    "earnings_date",
    "theta",
    "exit_value",
    "mid",
    "change",
    "value",
    "cost_basis",
    "gain_loss",
  ]);
  const [mergedArray, setMergedArray] = useState([]);
  const [expandedRows, setExpandedRows] = useState({});
  const handleClose = () => {
    setShowBuySell(false);
    setShowStrategy(false);
    setShowStockStrategy([]);
    setSelectedStockOrder("buy");
    setActionType("");
    setStrategyDescription("");
  };
  const Icon = ({ id, children, title }) => (
    <OverlayTrigger overlay={<Tooltip id={id}>{title}</Tooltip>}>{children}</OverlayTrigger>
  );
  const ExpandedComponent = ({ data }) => {
    const handleToggle = (entryId) => {
      setOpenEntries((prevOpenEntries) => ({
        ...prevOpenEntries,
        [entryId]: !prevOpenEntries[entryId],
      }));
    };
    return (
      <ul className="positionDetails">
        {data.entries.map((entry, entryIndex) => {
          
          const isEntryOpen = openEntries[entry.main.id];

          //calculation starts
          // ul_price or mark price
          const mark = entry.main.lastCustomValue ? entry.main.lastCustomValue : (entry.main.ask + entry.main.bid) / 2;

          //mrk value
          const mrk_value = entry.main.mrk_value;

          //total gain loss
          const total_gain_loss = entry.main.total_gain_loss;

          const total_gain_loss_percentage =
            total_gain_loss && entry.main?.cost_basis ? (total_gain_loss / entry.main?.cost_basis) * 100 : 0;

          // roi
          const roi = entry.main.roi ? addCommasToNumber(customToFixed(entry.main.roi)) : 0;
          //div_date
          let div_date = null;

          //earnings_date
          let earnings_date = null;
          earnings_date = getUpcomingEvent(entry.main?.calendars?.results);
          if (Array.isArray(entry?.main?.results)) {
            entry?.main?.results?.forEach((result) => {
              if (result?.tables?.cash_dividends) {
                result?.tables?.cash_dividends?.forEach((cash_dividend) => {
                  const exDate = cash_dividend?.ex_date;
                  if (exDate > div_date) {
                    div_date = exDate;
                  } else if (div_date === null) {
                    div_date = exDate;
                  }
                });
              }
            });
          }

          return (
            <>
              <li className="positionsItem" key={entryIndex + Math.random()}>
                {entry?.others?.length > 0 ? (
                  <span
                    onClick={() => handleToggle(entry.main.id)}
                    aria-controls={`example-collapse-text${entry.main.id}`}
                    aria-expanded={isEntryOpen}
                    className="icon-arrow inner-arrow"
                  ></span>
                ) : (
                  ""
                )}
                <span className="positionsItem__des">
                  {entry.main.symbol} {entry.main.description ? `(${entry.main.description})` : ""}
                </span>
                <span className="positionsItem__ul_price">{addDollarSignCommasToNumber(Number(mark))}</span>
                <span className="positionsItem__qty">{entry.main.mainDisplayQuantity}</span>

                {selectedColumns?.includes("days_left") ? (
                  <span
                    className="positionsItem__days_left"
                    style={{ paddingLeft: "0rem", minWidth: "6.5rem", maxWidth: "6.5rem" }}
                  ></span>
                ) : (
                  <></>
                )}

                {selectedColumns?.includes("mkt_value") ? (
                  <span
                    className="positionsItem__mkt_value"
                    style={{ paddingLeft: "0rem", minWidth: "11rem", maxWidth: "11rem" }}
                  >
                    {addDollarSignCommasToNumber(mrk_value)}
                  </span>
                ) : (
                  <></>
                )}

                {selectedColumns?.includes("cost_basis") ? (
                  <span
                    className="positionsItem__cost"
                    style={{ paddingLeft: "0rem", minWidth: "10rem", maxWidth: "10rem" }}
                  >
                    {addDollarSignCommasToNumber(entry.main?.cost_basis)}
                    <br />
                    {addDollarSignCommasToNumber(entry.main.secCost_basis)}
                  </span>
                ) : (
                  <></>
                )}

                {selectedColumns?.includes("today_gain_loss") ? (
                  <span className="positionsItem__today_gain_loss">
                    <span className={entry?.main?.change <= 0 && entry?.main?.change ? "text-danger" : "text-success"}>
                      {entry?.main?.change ? addDollarSignCommasToNumber(entry?.main?.change) : 0} <br />
                      {entry?.main?.change_percentage ? (
                        <>{addCommasToNumber(customToFixed(entry?.main?.change_percentage))} % </>
                      ) : (
                        ""
                      )}{" "}
                    </span>
                  </span>
                ) : (
                  <></>
                )}
                {selectedColumns?.includes("total_gain_loss") ? (
                  <span className="positionsItem__total_gain_loss">
                    <span className={total_gain_loss <= 0 && total_gain_loss ? "text-danger" : "text-success"}>
                      {total_gain_loss ? addDollarSignCommasToNumber(total_gain_loss) : 0} <br />
                      {customToFixed(setSign(total_gain_loss_percentage, total_gain_loss))} %
                    </span>
                  </span>
                ) : (
                  <></>
                )}
                {selectedColumns?.includes("roi") ? <span className="positionsItem__roi">{roi} %</span> : <></>}
                {selectedColumns?.includes("exit_value") ? (
                  <span className="positionsItem__exit_value">
                    {addDollarSignCommasToNumber(entry?.main?.exitValue)}
                  </span>
                ) : (
                  <></>
                )}
                {selectedColumns?.includes("position_delta") ? (
                  <span className="positionsItem__position_delta">
                    {entry?.main?.delta ? addCommasToNumber(customToFixed(entry?.main?.delta)) : entry.main.quantity} Δ
                  </span>
                ) : (
                  <></>
                )}

                {selectedColumns?.includes("theta") ? (
                  <span className="positionsItem__theta">
                    {entry?.main?.theta ? addDollarSignCommasToNumber(entry?.main?.theta) : "-"}
                  </span>
                ) : (
                  <></>
                )}
                {selectedColumns?.includes("div_date") ? (
                  <span className="positionsItem__div_date">{div_date != null ? formattedDate(div_date) : "-"}</span>
                ) : (
                  <></>
                )}
                {selectedColumns?.includes("earnings_date") ? (
                  <span className="positionsItem__earnings_date">
                    {earnings_date != null ? formattedDate(earnings_date) : "-"}
                  </span>
                ) : (
                  <></>
                )}
                {/* {selectedColumns?.includes('mid') ? <span className="positionsItem__last">$ {entry.main.lastCustomValue ? addCommasToNumber(entry.main.lastCustomValue) : addCommasToNumber(((entry.main.ask + entry.main.bid) / 2).toFixed(2))}</span> : <></>} */}
                <span className="positionsItem__action" style={{ minWidth: "14rem", maxWidth: "14rem" }}>
                  <div className="action_btns">
                    {entry.main.type !== LegType.Stock ? (
                      <Icon title="Roll over" id="t-1">
                        <span
                          className="icon-exchange"
                          onClick={() => {
                            const removedObjects = [];
                            const others = entry.others?.filter((obj) => {
                              if (obj.type === 2) {
                                removedObjects.push(obj);
                                return false;
                              }
                              return true;
                            });

                            setShowStrategy(others);
                            setStrategyDescription(formattedDate(others?.[0]?.expiration_date));
                            setShowStockStrategy(removedObjects);
                            setActionType("roll_over");
                            setStrategyTicker(entry.main.symbol);
                          }}
                        ></span>
                      </Icon>
                    ) : (
                      ""
                    )}
                    {entry.main.type !== LegType.Stock ? (
                      <Icon title="Analyze" id="t-2">
                        <span onClick={() => handleAnalyse(entry)} className="icon-area_chart"></span>
                      </Icon>
                    ) : (
                      ""
                    )}
                    <Icon title="Add to existing" id="t-3">
                      <span
                        className="icon-library_add"
                        onClick={() => {
                          setStrategyTicker(entry.main.symbol);
                          if (entry.main.type === LegType.Stock) {
                            setSelectedStockOrder("buy");
                            setShowBuySell({ ...entry.main, type: "market" });
                          } else {
                            const removedObjects = [];
                            const others = entry.others?.filter((obj) => {
                              if (obj.type === 2) {
                                removedObjects.push(obj);
                                return false;
                              }
                              return true;
                            });
                            setShowStrategy(others);
                            setShowStockStrategy(removedObjects);
                            setActionType("add_to_existing");
                          }
                        }}
                      ></span>
                    </Icon>
                    <Icon title="Close" id="t-4">
                      <span
                        className="icon-do_not_disturb_on"
                        onClick={() => {
                          setStrategyTicker(entry.main.symbol);
                          if (entry.main.type === LegType.Stock) {
                            setSelectedStockOrder("sell");
                            setShowBuySell({ ...entry.main, type: "market" });
                          } else {
                            const removedObjects = [];
                            const others = entry.others?.filter((obj) => {
                              if (obj.type === 2) {
                                removedObjects.push(obj);
                                return false;
                              }
                              return true;
                            });
                            setShowStrategy(others);
                            setShowStockStrategy(removedObjects);
                            setActionType("close");
                          }
                        }}
                      ></span>
                    </Icon>
                  </div>
                </span>
                {/* Render other main properties */}
              </li>
              <Collapse in={isEntryOpen}>
                <ul className="positionDetails" id={`example-collapse-text${entry.main.id}`}>
                  {entry?.others?.map((expandRow) => {
                    if (expandRow.symbol) {
                      const expirationDate = new Date(expandRow.expiration_date);
                      const currentDate = new Date();
                      const millisecondsDiff = expirationDate.getTime() - currentDate.getTime();
                      const daysDiff = Math.ceil(millisecondsDiff / (1000 * 60 * 60 * 24));

                      // ul_price or mark price
                      let mark = (expandRow.ask + expandRow.bid) / 2;
                      mark = !isNaN(mark) ? mark : 0;
                      //mrk value
                      const mrk_value = expandRow?.mark_value;

                      //exit value
                      const exit_value = expandRow.exitValue;

                      //total gain loss
                      const total_gain_loss = expandRow?.total_gain_loss;

                      const total_gain_loss_percentage =
                        total_gain_loss && expandRow?.cost_basis ? (total_gain_loss / expandRow?.cost_basis) * 100 : 0;

                      let delta = 0;
                      if (expandRow.type === 2) {
                        delta = expandRow.quantity;
                      } else {
                        delta = expandRow?.greeks?.delta
                          ? expandRow?.greeks?.delta * 100 * (expandRow.quantity < 0 ? -1 : 1)
                          : 0;
                      }

                      return (
                        <li className="positionsItem" key={expandRow.symbol + Math.random()}>
                          <span style={{ display: "flex", alignItems: "center" }} className="positionsItem__des">
                         
                            {expandRow.description}
                            {/* RS:- Show expired logo when the expiration date is same as the current date */}
                            {expandRow.expiration_date?.includes(currentDate) && (
                              <Image src="../assets/images/cross.svg" alt="login" width={15} height={15} />
                            )}
                            {/* RS:- Calls: In The Money (ITM)
                          If the Leg price (Call) bought is less than the current stock price (UL or Mark) then its ITM
                          */}
                          
                          {expandRow?.description?.toLowerCase?.()?.includes?.("call") ? (
                              <>
                                {parseFloat(expandRow.strike) <= (data?.ask + data?.bid)/2 && (
                                  <Image src="../assets/images/dollar.svg" alt="login" width={15} height={15} />
                                )}
                              </>
                            ) : (
                              <>
                                {/* RS:- Puts: In the Money (ITM)
                          If the Leg price (Put) bought is more than the current stock price (UL or Mark) then its ITM  */}
                                {expandRow?.description?.toLowerCase?.()?.includes?.("put") && (
                                  <>
                                    {parseFloat(expandRow.strike) >= (data?.ask + data?.bid)/2 && (
                                      <Image src="../assets/images/dollar.svg" alt="login" width={15} height={15} />
                                    )}
                                  </>
                                )}
                              </>
                            )}
                            
                          </span>
                          <span className="positionsItem__ul_price">{addDollarSignCommasToNumber(mark)}</span>
                          <span className="positionsItem__qty">{Math.trunc(expandRow.quantity)}</span>

                          {selectedColumns?.includes("days_left") ? (
                            <span
                              className="positionsItem__days_left"
                              style={{ paddingLeft: "0rem", minWidth: "6.5rem", maxWidth: "6.5rem" }}
                            >
                              {!isNaN(daysDiff) ? daysDiff : ""}
                            </span>
                          ) : (
                            <></>
                          )}

                          {selectedColumns?.includes("mkt_value") ? (
                            <span
                              className="positionsItem__mkt_value"
                              style={{ paddingLeft: "0rem", minWidth: "11rem", maxWidth: "11rem" }}
                            >
                              {addDollarSignCommasToNumber(mrk_value)}
                            </span>
                          ) : (
                            <></>
                          )}

                          {selectedColumns?.includes("cost_basis") ? (
                            <span
                              className="positionsItem__cost"
                              style={{ paddingLeft: "0rem", minWidth: "10rem", maxWidth: "10rem" }}
                            >
                              {addDollarSignCommasToNumber(expandRow?.cost_basis)}
                              <br />
                              {addDollarSignCommasToNumber(expandRow.secCost_basis)}{" "}
                            </span>
                          ) : (
                            <></>
                          )}

                          {selectedColumns?.includes("today_gain_loss") ? (
                            <span className="positionsItem__today_gain_loss">
                              <span
                                className={
                                  expandRow.change_percentage <= 0 && expandRow.change_percentage
                                    ? "text-danger"
                                    : "text-success"
                                }
                              >
                                {expandRow?.change ? addDollarSignCommasToNumber(expandRow?.change) : 0}
                                <br />
                                {expandRow?.change_percentage
                                  ? addCommasToNumber(customToFixed(expandRow?.change_percentage))
                                  : 0}{" "}
                                %
                              </span>
                            </span>
                          ) : (
                            <></>
                          )}
                          {selectedColumns?.includes("total_gain_loss") ? (
                            <span className="positionsItem__total_gain_loss">
                              <span
                                className={total_gain_loss <= 0 && total_gain_loss ? "text-danger" : "text-success"}
                              >
                                {total_gain_loss ? addDollarSignCommasToNumber(total_gain_loss) : "0.0"} <br />
                                {customToFixed(setSign(total_gain_loss_percentage, total_gain_loss))} %
                              </span>
                            </span>
                          ) : (
                            <></>
                          )}

                          {selectedColumns?.includes("roi") ? (
                            <span className="positionsItem__roi">
                              {customToFixed(setSign(expandRow?.roi, total_gain_loss))}%
                            </span>
                          ) : (
                            <></>
                          )}
                          {selectedColumns?.includes("exit_value") ? (
                            <span className="positionsItem__exit_value">
                              {" "}
                              {expandRow.type !== LegType.Stock ? (
                                <> $ {addCommasToNumber(customToFixed(exit_value))}</>
                              ) : (
                                ""
                              )}
                            </span>
                          ) : (
                            <></>
                          )}
                          {selectedColumns?.includes("position_delta") ? (
                            <span className="positionsItem__position_delta">{customToFixed(delta)}Δ</span>
                          ) : (
                            <></>
                          )}

                          {selectedColumns?.includes("theta") ? (
                            <span className="positionsItem__theta">
                              {expandRow?.greeks?.theta
                                ? addDollarSignCommasToNumber(expandRow?.greeks?.theta * 100)
                                : ""}
                            </span>
                          ) : (
                            <></>
                          )}
                          {selectedColumns?.includes("div_date") ? (
                            <span className="positionsItem__div_date">{"-"}</span>
                          ) : (
                            <></>
                          )}
                          {selectedColumns?.includes("earnings_date") ? (
                            <span className="positionsItem__earnings_date">{"-"}</span>
                          ) : (
                            <></>
                          )}

                          {/* {selectedColumns?.includes('mid') ? <span className="positionsItem__last">$ {addCommasToNumber(((expandRow.ask + expandRow.bid) / 2).toFixed(2))}</span> : <></>} */}

                          <span className="positionsItem__action" style={{ minWidth: "14rem", maxWidth: "14rem" }}>
                            {expandRow.type !== 2 ? (
                              <Icon title="Roll over" id="t-1">
                                <span
                                  className="icon-exchange"
                                  onClick={() => {
                                    setShowStrategy([expandRow]);
                                    setActionType("roll_over");
                                    setStrategyDescription(expandRow.shortDescription);
                                    setStrategyTicker(expandRow.ticker);
                                  }}
                                ></span>
                              </Icon>
                            ) : (
                              ""
                            )}
                            {expandRow.type !== LegType.Stock && (
                              <Icon title="Analyze" id="t-2">
                                <span
                                  className="icon-area_chart"
                                  onClick={() => {
                                    setStrategyTicker(expandRow.ticker);
                                    handleAnalyse(expandRow, true);
                                  }}
                                ></span>
                              </Icon>
                            )}
                            <Icon title="Add to existing" id="t-3">
                              <span
                                className="icon-library_add"
                                onClick={() => {
                                  setStrategyTicker(expandRow.ticker);
                                  if (expandRow.type === LegType.Stock) {
                                    setSelectedStockOrder("buy");
                                    setShowBuySell({
                                      ...expandRow,
                                      type: "market",
                                    });
                                  } else {
                                    setShowStrategy([expandRow]);
                                    setActionType("add_to_existing");
                                  }
                                }}
                              ></span>
                            </Icon>
                            <Icon title="Close" id="t-4">
                              <span
                                className="icon-do_not_disturb_on"
                                onClick={() => {
                                  setStrategyTicker(expandRow.ticker);
                                  if (expandRow.type === LegType.Stock) {
                                    setSelectedStockOrder("sell");
                                    setShowBuySell({
                                      ...expandRow,
                                      type: "market",
                                    });
                                  } else {
                                    setShowStrategy([expandRow]);
                                    setActionType("close");
                                  }
                                }}
                              ></span>
                            </Icon>
                          </span>
                        </li>
                      );
                    }
                  })}
                </ul>
              </Collapse>
            </>
          );
        })}
      </ul>
    );
  };

  const handleAnalyse = (item: any, isSingleLeg?: boolean | undefined) => {
    let legsData = [];
    let strategyNumber = 1;
    let expirationURI = null;
    const itemName: string = (item?.main?.description || "")?.toLowerCase?.();
    const isCoveredCall: boolean = itemName === "covered call";
    if (isCoveredCall) {
      item.others = item?.others?.map((el) => {
        if (el.quantity && el.quantity / 100 >= 1) {
          el.coveredQuantity = Math.floor(el.quantity / 100);
        }
        return el;
      });
    }
    if (isSingleLeg) {
      expirationURI = item.expiration_date || formatedDate(item.expiration);
      legsData.push({
        expiration_date: expirationURI,
        strike: item.strike,
        ticker: item.ticker,
        option_type: item.option_type,
        type: item.type,
        ask: item.ask,
        bid: item.bid,
        quantity: item?.coveredQuantity || item.quantity,
        mid_iv: item?.greeks?.mid_iv,
      });

      if (item.quantity >= 0 && item.option_type === "call") {
        strategyNumber = 1;
      } else if (item.quantity < 0 && item.option_type === "call") {
        strategyNumber = 2;
      } else if (item.quantity >= 0 && item.option_type === "put") {
        strategyNumber = 3;
      } else if (item.quantity < 0 && item.option_type === "put") {
        strategyNumber = 4;
      }

      const firstValue = item?.ticker;
      sessionStorage.setItem("legs", JSON.stringify(legsData));
      router.push(
        `/trade?q=${firstValue}&start=${yesterdayDate}&end=${todayDate}&activeTab=option-strategies&strategy=${strategyNumber}&expiration=${expirationURI}`
      );

      return;
    }
    for (let key = 1; key <= 53; key++) {
      if (getStratergyNameForStrategyId(key) === item?.main?.description) {
        strategyNumber = key;
        break;
      }
    }

    for (const leg of item?.others) {
      if (leg.type !== 2) {
        expirationURI = leg.expiration_date || formatedDate(leg.expiration);
      }
      legsData.push({
        expiration_date: leg.expiration_date || formatedDate(leg.expiration),
        strike: leg.strike,
        ticker: leg.ticker,
        option_type: leg.option_type,
        type: leg.type,
        ask: leg.ask,
        bid: leg.bid,
        quantity: leg?.coveredQuantity || leg.quantity,
        mid_iv: leg?.greeks?.mid_iv,
      });
    }

    const firstValue = item?.main?.symbol?.split("(")[0].trim();
    sessionStorage.setItem("legs", JSON.stringify(legsData));
    router.push(
      `/trade?q=${firstValue}&start=${yesterdayDate}&end=${todayDate}&activeTab=option-strategies&strategy=${strategyNumber}&expiration=${expirationURI}`
    );
  };

  // Function to check if logo exists or not.
  // maintaining boolean results of the same.
  // function retriggered when length of mergedArray changed.
  const [logoExists, setLogoExists] = useState([]);
  const mergedArrayRef = useRef(mergedArray);
  useEffect(() => {
    mergedArrayRef.current = mergedArray;
  }, [mergedArray]);

  useEffect(() => {
    const checkImageExists = async () => {
      const updatedLogoExists = await Promise.all(
        mergedArray.map((ele) => {
          return new Promise((resolve) => {
            const img = document.createElement("img");
            img.src = `https://storage.googleapis.com/iexcloud-hl37opg/api/logos/${ele.symbol}.png`;

            img.onload = () => {
              resolve(true);
            };

            img.onerror = () => {
              resolve(false);
            };

            img.style.display = "none";
            document.body.appendChild(img);
          });
        })
      );

      setLogoExists(updatedLogoExists);
    };

    checkImageExists();

    return () => {
      mergedArray.forEach((ele, index) => {
        const img = document.getElementById(`img-${ele.symbol}-${index}`);
        if (img) {
          document.body.removeChild(img);
        }
      });
    };
  }, [mergedArrayRef.current.length]);

  const columns = [
    {
      name: t("Dashboard.Symbol"),
      width: "7rem",
      cell: (row, index) => {
        return logoExists[index] ? (
          <div className="Logo">
            <Image
              src={
                !row.symbol
                  ? "../assets/images/apple.svg"
                  : `https://storage.googleapis.com/iexcloud-hl37opg/api/logos/${row.symbol}.png`
              }
              alt={row.symbol}
              fill={true}
            />
          </div>
        ) : (
          <div className={stylesStrategies.letterLogoContainer}>
            <span className={stylesStrategies.letterLogo}>{row.symbol}</span>
          </div>
        );
      },
    },
    {
      name: "",
      width: "25rem",
      cell: (row) => {
        return <>{row.symbol}</>;
      },
    },
    {
      name: t("Dashboard.Mark"),
      width: "10rem",
      cell: (row) => <>{addDollarSignCommasToNumber((row.ask + row.bid) / 2)}</>,
    },
    {
      name: t("Dashboard.Quantity"),
      width: "10rem",
      cell: (row) => row.displayQuantity,
    },
    {
      name: t("Dashboard.Days Left"),
      omit: !selectedColumns?.includes("days_left"),
      width: "5.5rem",
      cell: (row) => row.dayLeft,
    },
    {
      name: t("Dashboard.Mkt Value"),
      omit: !selectedColumns?.includes("mkt_value"),
      width: "11rem",
      cell: (row) => <>{addDollarSignCommasToNumber(row.marketValue)}</>,
    },
    {
      name: t("Dashboard.Cost Basis"),
      omit: !selectedColumns?.includes("cost_basis"),
      width: "11rem",
      cell: (row) => (
        <>
          {addDollarSignCommasToNumber(row?.costBasis)}
          <br />
        </>
      ),
    },
    {
      name: t("Dashboard.Today's Gain/Loss"),
      omit: !selectedColumns?.includes("today_gain_loss"),
      width: "10rem",
      cell: (row) => (
        <span className={row.todayGainLoss <= 0 && row.todayGainLoss ? "text-danger" : "text-success"}>
          {addDollarSignCommasToNumber(row.todayGainLoss)}
        </span>
      ),
    },
    {
      name: t("Dashboard.Total Gain/Loss"),
      omit: !selectedColumns?.includes("total_gain_loss"),
      width: "10rem",
      cell: (row) => (
        <span className={row.totalGainLoss <= 0 && row.totalGainLoss ? "text-danger" : "text-success"}>
          {addDollarSignCommasToNumber(row.totalGainLoss)}
        </span>
      ),
    },
    {
      name: t("Dashboard.ROI"),
      omit: !selectedColumns?.includes("roi"),
      width: "10rem",
      cell: (row) => <>{addCommasToNumber(customToFixed(row.roi))}%</>,
    },
    {
      name: t("Dashboard.Ext Value"),
      omit: !selectedColumns?.includes("exit_value"),
      width: "10rem",
      cell: (row) => addCommasToNumber(customToFixed(row.exitValue)),
    },
    {
      name: t("Dashboard.Position Delta"),
      omit: !selectedColumns?.includes("position_delta"),
      width: "10rem",
      cell: (row) => <>{row.delta || ""} Δ</>,
    },
    {
      name: t("Dashboard.Theta"),
      omit: !selectedColumns?.includes("theta"),
      width: "10rem",
      cell: (row) => <>{addDollarSignCommasToNumber(row.theta) || ""}</>,
    },
    {
      name: t("Dashboard.Div Date"),
      omit: !selectedColumns?.includes("div_date"),
      width: "10rem",
      cell: (row) => (row.divDate ? formattedDate(row.divDate) : ""),
    },
    {
      name: t("Dashboard.Earnings Date"),
      omit: !selectedColumns?.includes("earnings_date"),
      width: "10rem",
      cell: (row) => (row?.earningsDate ? formattedDate(row.earningsDate) : ""),
    },
    // {
    //     name: t("Dashboard.Mid"),
    //     omit: !selectedColumns?.includes('mid'),
    //     width: '15rem',
    // },
    {
      name: t("Dashboard.Action"),
      width: "14rem",
      cell: (row) => (
        <div className="w-100" onClick={() => toggleRowExpansion(false, row)}>
          <span className="icon-exchange disabled"></span>
          <span className="icon-area_chart disabled"></span>
          <span className="icon-library_add disabled"></span>
          <span className="icon-do_not_disturb_on disabled"></span>
        </div>
      ),
    },
  ];

  let data = positions?.positions;
  let symbolArray = [];

  useEffect(() => {
    if (data === null || data === undefined) {
      // Check for null value (not a string "null")
      data = []; // Initialize data as an empty array
    }
    if (data) {
      data?.forEach?.((item) => {
        const symbol = getTickerFromOptionSymbol(item.symbol);
        if (symbol && !symbolArray.includes(symbol)) {
          symbolArray.push(symbol);
        }

        symbolArray.push(item.symbol);
      });
      if (symbolArray.length) {
        dispatch(fetchQuotesData(symbolArray));
        dispatch(fetchDividends(symbolArray));
        dispatch(fetchCalendars(symbolArray));
      }
    }
  }, [data, lastRefresh, dispatch]);

  useEffect(() => {
    if (symbolData && data) {
      const mergedArray = data?.map?.((obj1) => {
        const matchingObj = symbolData.find((obj2) => obj2.symbol === obj1.symbol);
        const thirdArrayObj = dividendsDataArr?.find((item) => item.request === obj1.symbol);
        const calenderArrayObj = calendarsDataArr?.find((item) => item.request === obj1.symbol);
        if (matchingObj) {
          const mergedObj = {
            ...obj1,
            ...matchingObj,
            calendars: calenderArrayObj,
          };

          // If there is a corresponding object in the third array, merge it as well
          if (thirdArrayObj) {
            return { ...mergedObj, ...thirdArrayObj };
          }

          return mergedObj;
        }

        return obj1;
      });
      const seperatedData = arrangeDataForTable(mergedArray);
      const updatedData = makeSummaryData(seperatedData, symbolData);

      setMergedArray(updatedData);
    }
  }, [symbolData, data, dividendsDataArr, calendarsDataArr]);

  const toggleRowExpansion = (value, row) => {
    const newExpandedRows = { ...expandedRows };
    if (newExpandedRows[row.symbol]) {
      delete newExpandedRows[row.symbol];
    } else {
      newExpandedRows[row.symbol] = true;
    }
    setExpandedRows(newExpandedRows);
  };

  const isRowExpanded = (row) => !!expandedRows[row.symbol];

  return (
    <>
      <div className="mt-4 d-flex justify-content-between align-items-center">
        <h3 className="">
          {t("Dashboard.Positions")} ({mergedArray?.length})
        </h3>
        <div className={`${stylesStrategies.Columns} mb-4`}>
          <DropdownWithCheckboxes
            selectedColumns={selectedColumns}
            handleColumnChange={(selectedColumns) => setSelectedColumns(selectedColumns)}
          />
        </div>
      </div>
      <DataTable
        className="DataTable PositionTable"
        paginationPerPage={30}
        columns={columns}
        data={mergedArray ? sortAlphabetically(mergedArray) : []}
        pagination
        expandableRows
        expandableRowsComponent={ExpandedComponent}
        expandOnRowClicked={false}
        onRowExpandToggled={toggleRowExpansion}
        expandableRowExpanded={isRowExpanded}
        fixedHeader={true}
      />
      <Popups
        show={show}
        handleClose={() => setShow(false)}
        handleShow={() => setShow(true)}
        modalTitle="Roll Over"
        className="p-0"
        submit="Submit"
      >
        <Rollover></Rollover>
      </Popups>

      <Popups
        show={show4}
        handleClose={() => setShow4(false)}
        handleShow={() => setShow4(true)}
        className="text-center ClosePopup"
        modalTitle=""
        submit="Submit"
        size="sm"
      >
        <Errors
          modalTitle="Close position"
          modalDesc="Do you want to close this position?"
          gainLoss="+$30.51"
          change="19.9%"
        ></Errors>
      </Popups>
      <Offcanvas show={showBuySell} onHide={handleClose} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            {t("stockPage.Buy/Sell Stock")} - {`"${strategyTicker}"`}
          </Offcanvas.Title>
        </Offcanvas.Header>
        <BuySell
          handleClose={handleClose}
          tradeDataMap={[{ ...showBuySell, isDashboard: true }]}
          selectedStockOrder={selectedStockOrder}
        />
      </Offcanvas>

      <Offcanvas
        className={stylesStrategies.buyStrategiesPopup}
        show={showStrategy}
        onHide={handleClose}
        placement="bottom"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            {actionType === "close"
              ? `Close Strategy - "${strategyTicker}"`
              : actionType === "add_to_existing"
              ? `Add Existing - "${strategyTicker}"`
              : strategyDescription !== ""
              ? `Roll Over from ${strategyDescription} - "${strategyTicker}"`
              : `Roll Over`}{" "}
          </Offcanvas.Title>
        </Offcanvas.Header>
        <BuyStrategies
          handleClose={handleClose}
          actionType={actionType}
          tradeDataMap={showStockStrategy}
          optionDashboardRows={showStrategy}
          pageTitle="dashboard"
          showUnderlyingSec={showStockStrategy?.length > 0 && actionType !== "roll_over" ? true : false}
        />
      </Offcanvas>
    </>
  );
};

export default Positions;
