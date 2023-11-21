"use client";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxCommon";
import { IEvent } from "@/redux/slices/accountHistorySlice";
import { fetchWatchlistGraph } from "@/redux/slices/watchlistSlice";
import React, { useState, useEffect, useMemo } from "react";
import { fetchProfileDetails, profileData } from "@/redux/slices/profileSlice";
import { fetchPositionList, positionList, positionListStatusNum } from "@/redux/slices/positionListSlice";
import { arrangeDataForTable, getDetailsFromSymbol, getTickerFromOptionSymbol } from "@/utils/positions";
import { fetchQuotesData, quotesData } from "@/redux/slices/quoteSlice";
import { fetchOrderList, orderList, orderStatusNumber } from "@/redux/slices/orderListSlice";

import { useTranslation } from "react-i18next";
import { Container, Row, Col, Table, Accordion, Card, Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { useAccordionButton } from "react-bootstrap/AccordionButton";
import { useRouter } from "next/navigation";
import { addCommasToNumber } from "@/utils/prize";

import { unitDependencies } from "mathjs";
import styles from "@/styles/setting.module.scss";

const Icon = ({ id, children, title }) => (
  <OverlayTrigger overlay={<Tooltip id={id}>{title}</Tooltip>}>{children}</OverlayTrigger>
);

const addDollorToValues = (value: number) => {
  const absValue = Math.abs(value).toFixed(2);
  const valueWithDollor = value < 0 ? "-$" + addCommasToNumber(absValue) : "$" + addCommasToNumber(absValue);
  return valueWithDollor;
};

const TradingJournal = () => {
  const { t, i18n } = useTranslation();
  const profile: any = useAppSelector(profileData);

  const history: any = useAppSelector((state) => state.accountHistory.history);
  const gainLoss: any = useAppSelector((state) => state.accountGainLoss.gainLoss);
  const positions: any = useAppSelector(positionList);
  const symbolData: any = useAppSelector(quotesData);
  const orders: any = useAppSelector(orderList);
  const accounts = profile?.profile?.account;
  let data = orders?.order;
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [selectedAccount, setSelectedAccount] = useState("");
  const [accountHistory, setAccountHistory] = useState([]);
  const [accountGainLoss, setAccountGainLoss] = useState([]);
  const [position, setPosition] = useState([]);
  const [mergedArray, setMergedArray] = useState([]);
  const [mergedArrayOrders, setMergedArrayOrders] = useState([]);

  useEffect(() => {
    setAccountHistory(history);
  }, [history]);
  useEffect(() => {
    setAccountGainLoss(gainLoss);
  }, [gainLoss]);
  useEffect(() => {
    setPosition(positions);
  }, [gainLoss]);

  let positionData = positions?.position;
  let symbolArray = [];

  useEffect(() => {
    if (positionData === null || positionData === undefined) {
      // Check for null value (not a string "null")
      positionData = []; // Initialize data as an empty array
    }
    if (positionData) {
      positionData.forEach((item) => {
        symbolArray.push(item.symbol);
      });
      if (symbolArray.length) {
        dispatch(fetchQuotesData(symbolArray));
      }
    }
  }, [positions, data, dispatch]);

  useEffect(() => {
    if (symbolData && positions?.position) {
      const mergedArray = positions?.position.map((obj1) => {
        const matchingObj = symbolData.find((obj2) => obj2.symbol === obj1.symbol);
        if (matchingObj) {
          const mergedObj = { ...obj1, ...matchingObj, date_acquired: obj1.date_acquired };
          return mergedObj;
        }

        return obj1;
      });

      const seperatedData = arrangeDataForTable(mergedArray);

      setMergedArray(seperatedData);

      if (symbolData && orders?.orders) {
        // alert()
        if (Array.isArray(orders?.orders)) {
          let mergedArray = orders?.orders.map((obj1) => {
            const matchingObj = symbolData.find((obj2) => obj2.symbol === obj1.symbol);

            if (matchingObj) {
              // Create a new object with the properties of obj1
              const newObj = { ...obj1 };

              for (const key in matchingObj) {
                if (!(key in newObj)) {
                  newObj[key] = matchingObj[key];
                }
              }

              return newObj;
            }

            return obj1;
          });
          // Sort orders by transaction_date in ascending order
          const sortedMergedArray = mergedArray.sort((order1, order2) => {
            const date1 = new Date(order1.transaction_date).getTime();
            const date2 = new Date(order2.transaction_date).getTime();
            return date1 - date2;
          });
          setMergedArray(sortedMergedArray);
        } else {
          const mergedObject = { ...orders?.orders, ...symbolData.find((obj) => obj.symbol === orders?.orders.symbol) };
          setMergedArray([mergedObject]);
        }
      }
    }
  }, [symbolData, positions?.position, orders?.orders]);

  const formatValue = (amount, addComma) => {
    if (amount == 0) {
      return "$" + amount;
    } else if (amount < 0) {
      return "-$" + Math.abs(amount).toFixed(2);
    } else if (amount > 0) {
      if (addComma) {
        return "$" + addCommasToNumber(Math.abs(amount).toFixed(2));
      }
      return "$" + Math.abs(amount).toFixed(2);
    } else {
      return "$" + 0;
    }
  };

  const getRealized = (symbol, date) => {
    // return positions?.position?.find((event) => event?.symbol === symbol);//  && event?.date_acquired === date
    let gain_loss = 0;
    mergedArray
      .filter((event) => event?.symbol === symbol)
      .map((event) => event.entries)
      .map((event) => {
        const mark = event[0].main.lastCustomValue
          ? addCommasToNumber(event[0].main.lastCustomValue)
          : addCommasToNumber(((event[0].main.ask + event[0].main.bid) / 2).toFixed(2));

        //mrk value
        const mrk_value = addCommasToNumber((mark * event[0].main.quantity).toFixed(2));

        //total gain loss
        gain_loss = mark ? addCommasToNumber((mark - event[0].main.cost_basis)?.toFixed(2)) : "-";

        // gain_loss = (((event[0]['main'].ask + event[0]['main'].bid) / 2) * event[0]['main'].quantity) - (event[0]['main'].cost_basis);
      });
    return gain_loss;
  };

  // positions.position

  const getUnRealize = (shortSymbol, fullSymbol, date) => {
    {
      let total_gain_loss = 0;
      positionObjectArr
        .filter((m) => {
          const acSymbol = getTickerFromOptionSymbol(m.symbol);
          return acSymbol === shortSymbol || m.symbol === shortSymbol;
        })
        .map((item) => {
          total_gain_loss = total_gain_loss + item.total_gain_loss;
        });

      return total_gain_loss;
    }
  };

  const getSide = (symbol) => {
    {
      // return mergedArrayOrders.find((event) => event?.symbol === symbol);
      const symbolDetails = mergedArrayOrders.find((event) => event?.symbol == symbol);
      return symbolDetails;
    }
  };

  function groupBySymbol(data) {
    const groupedData = {};

    data?.forEach?.((event) => {
      let newEvent = {}; // Clone the event object

      const symbol = event.shortsymbol;

      if (symbol) {
        if (!groupedData[symbol]) {
          groupedData[symbol] = [];
        }

        // const unRealized = getUnRealize(event.shortsymbol, event.symbol, event?.open_date);
        // const unRealized = getUnRealize(event?.symbol, event?.open_date);

        // const realized = getRealized(symbol, event?.open_date);
        // const realized = getRealized(event?.symbol, event?.open_date);

        // const side = getSide(symbol, event?.open_date);
        // const side = getSide(event?.symbol, event?.open_date);
        // Create a new 'trade' object with the desired properties
        newEvent = {
          ...event,
          gl_unrealize: 0,
          // gl_unrealized: unRealized,
          // gain_loss: unRealized ? 0 : event.gain_loss
          /* side: side?.side || '',
          order_id: side?.id || '',
          gl_unrealized: unRealized || 0,
          gl_gain_loss: realized || 0, */

          /* gl_close_date: realized?.close_date || undefined,
          gl_open_date: realized?.open_date || undefined, */
        };

        groupedData[symbol].push(newEvent);
      }
    });

    positionObjectArr.map((item) => {
      const symbol = getTickerFromOptionSymbol(item.symbol);
      if (symbol && !(symbol in groupedData)) {
        groupedData[symbol] = [];
      } else if (!symbol && !(item.symbol in groupedData)) {
        groupedData[item.symbol] = [];
      }
    });

    return groupedData;
  }

  const CustomToggle = ({ children, eventKey }) => {
    const decoratedOnClick = useAccordionButton(eventKey, () => {});

    return (
      // <Button variant="light" onClick={decoratedOnClick}>{children}</Button>
      <span style={{ cursor: "pointer" }} onClick={decoratedOnClick}>
        {children}
      </span>
    );
  };

  const positionObjectArr = useMemo(() => {
    if (!positions?.position) {
      return [];
    }
    return positions?.position.map((obj1) => {
      const matchingObj = symbolData.find((obj2) => obj2.symbol === obj1.symbol);
      if (matchingObj) {
        const mergedObj = { ...obj1, ...matchingObj, date_acquired: obj1.date_acquired };

        const mark = (mergedObj.ask + mergedObj.bid) / 2;
        const mrk_value = ["stock", "etf"].includes(mergedObj.type)
          ? mark * mergedObj.quantity
          : mark * mergedObj.quantity * 100;
        // if (obj1.symbol === "spy") {

        // }
        const total_gain_loss = mrk_value - mergedObj.cost_basis;
        mergedObj.mark = mark;
        mergedObj.mrk_value = mrk_value;
        mergedObj.total_gain_loss = total_gain_loss;
        return mergedObj;
      }

      return obj1;
    });
  }, [positions, symbolData]);

  // const getUnRealizetrNew = (symbol) => {
  //   if (!positionObjectArr || positionObjectArr.length === 0) {
  //     return []
  //   }

  //   const r = positionObjectArr.filter((p) => {
  //     const acSymbol = getTickerFromOptionSymbol(p.symbol);
  //     return ((acSymbol === symbol) || (p.symbol === symbol))
  //   });
  //   return r;
  // }

  const getUnRealizetr = (symbol) => {
    let customtr = [];

    mergedArray
      .filter((m) => m.symbol == symbol)
      .map((e) => e.entries)
      .map((entry, i) => {
        entry.map((e) => {
          if (e.main.symbol == symbol) {
            const mark = e.main.lastCustomValue
              ? Number(e.main.lastCustomValue)
              : addCommasToNumber(((e.main.ask + e.main.bid) / 2).toFixed(2));
            let total_gain_loss = mark ? mark - e.main.cost_basis : 0;
            // let newObj = {...e, total_gain_loss:total_gain_loss}
            const mrk_value = addCommasToNumber((mark * e.main.quantity).toFixed(2));
            e.main.total_gain_loss = total_gain_loss;
            e.main.mark = mark;
            e.main.mrk_value = mrk_value;

            customtr.push(e);
          }
        });
      });

    return customtr;
  };

  const HistoryList = useMemo(() => {
    // const gainlossAndOrders = [...accountGainLoss,data];

    const tmp = accountGainLoss.map((item, index) => {
      return { ...item, shortsymbol: getDetailsFromSymbol(item.symbol).ticker };
    });

    const list = groupBySymbol(tmp);

    return Object.keys(list || {}).map((symbol, index) => {
      // Calculate the total GL Gain/Loss for the current symbol group
      let totalGlGainLoss = 0;
      let totalGlunrealized = 0;
      list[symbol].forEach((item) => {
        // totalGlunrealized += parseInt(item?.gl_unrealized) || 0;
        totalGlGainLoss += parseInt(item?.gain_loss) || 0;
      });

      positionObjectArr
        .filter((p) => {
          const acSymbol = getTickerFromOptionSymbol(p.symbol);
          return acSymbol === symbol || p.symbol === symbol;
        })
        .map((event, index) => {
          totalGlunrealized = totalGlunrealized + event.total_gain_loss;
        });

      return (
        <Accordion key={index.toString()} alwaysOpen={false}>
          <Card className={styles.JournalCard}>
            <Card.Header className="p-0">
              <div className={styles.InfoLogo}>
                <CustomToggle eventKey={index.toString()}>
                  <Table className={styles.JournalTable}>
                    <tr>
                      <td>
                        <div className={styles.stockInfo}>
                          <div className={styles.logo}>
                            <Image
                              height={20}
                              width={50}
                              src={
                                !symbol
                                  ? "../assets/images/apple.svg"
                                  : `https://storage.googleapis.com/iexcloud-hl37opg/api/logos/${symbol}.png`
                              }
                              alt={symbol}
                            />
                          </div>
                          <span>{symbol}</span>
                        </div>
                      </td>
                      <td className={totalGlunrealized >= 0 ? "text-success" : "text-danger"}>
                        {addDollorToValues(totalGlunrealized)}
                      </td>
                      <td className={totalGlGainLoss >= 0 ? "text-success" : "text-danger"}>
                        {addDollorToValues(totalGlGainLoss)}
                      </td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                    </tr>
                  </Table>
                </CustomToggle>
              </div>
            </Card.Header>
            <Accordion.Collapse eventKey={index.toString()}>
              <Card.Body>
                <Table className={styles.JournalTable}>
                  <tbody>
                    {list[symbol].map((item, itemIndex) => {
                      let side = getSide(item.symbol);
                      side = side?.side || "-";

                      return (
                        // {symbolData[symbol].map((item, itemIndex) => (
                        <tr key={itemIndex}>
                          <td>{item?.symbol}</td>
                          <td>{addDollorToValues(item.gl_unrealize)} </td>
                          <td>{addDollorToValues(item?.gain_loss || 0)}</td>
                          <td>{item?.quantity}</td>
                          <td>{side} </td>
                          <td>{new Date(item?.open_date).toDateString()}</td>
                          <td>{addDollorToValues(item?.cost)}</td>
                        </tr>
                      );
                    })}

                    {positionObjectArr
                      .filter((p) => {
                        const acSymbol = getTickerFromOptionSymbol(p.symbol);
                        return acSymbol === symbol || p.symbol === symbol;
                      })
                      .map((event, index) => {
                        let side = getSide(symbol);
                        side = side?.side || "-";

                        return (
                          <tr key={index}>
                            <td>{event?.symbol}</td>
                            <td>{addDollorToValues(event?.total_gain_loss)}</td>
                            <td>{addDollorToValues(0)}</td>
                            <td>{event?.quantity}</td>
                            <td>{side}</td>
                            <td>{event?.date_acquired ? new Date(event?.date_acquired).toDateString() : ""}</td>

                            <td>{addDollorToValues(event?.mark)}</td>
                          </tr>
                        );
                      })}

                    <tr>
                      <td>Total </td>
                      <td className={totalGlunrealized >= 0 ? "text-success" : "text-danger"}>
                        {addDollorToValues(totalGlunrealized)}
                      </td>
                      <td className={totalGlGainLoss >= 0 ? "text-success" : "text-danger"}>
                        {addDollorToValues(totalGlGainLoss)}
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>
      );
    });
  }, [accountHistory, positionObjectArr]);

  return (
    <section className={styles.TradingJournal}>
      <Container fluid>
        <Row>
          <Col md={12} xs={12}>
            <Table className={styles.JournalTable}>
              <thead>
                <tr>
                  <th>Symbol</th>
                  <th>Un-Realized</th>
                  <th>Realized</th>
                  <th>Quantity</th>
                  <th>Side</th>
                  <th>Date</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={9} className="p-0">
                    {HistoryList}
                  </td>
                </tr>

                {/* <!-- Add more rows as needed --> */}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default TradingJournal;
