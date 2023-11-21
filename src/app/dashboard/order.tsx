"use client";
import dynamic from "next/dynamic";
import Popups from "../popups/page";
import stylesStrategies from "@/styles/strategies.module.scss";
import EditOrder from "../popups/editorders";
import { deleteOrder } from "@/redux/slices/orderListSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxCommon";
import React, { useEffect, useState } from "react";
import { fetchQuotesData, quotesData } from "@/redux/slices/quoteSlice";
import BuySell from "../trade/buysell";
import { useTranslation } from "react-i18next";
import { OverlayTrigger, Tooltip, ToastContainer, Toast, Offcanvas } from "react-bootstrap";
import {
  addDollarSignCommasToNumber,
  arrangeDataForTable,
  convertToTitleCase,
  getDetailsFromSymbol,
} from "@/utils/positions";
import { getTitle } from "@/utils/legs";
import Errors from "../popups/errors";
import { Howl } from "howler";
import BuyStrategies from "../strategies/buystrateigs";
import { editPlaceOrder } from "@/redux/slices/placeOrderSlice";

const DataTable = dynamic(() => import("react-data-table-component"), {
  ssr: false,
});

const Order = (props: any) => {
  let data = props?.orders;
  const [show2, setShow2] = useState(false);
  const [show4, setShow4] = useState<boolean | number>(false);
  const [toastStatus, setToastStatus] = useState<string[]>([]);
  const [toastPopup, setToastPopup] = useState(false);
  const [showStrategy, setShowStrategy] = useState<any>(false);
  const [showBuySell, setShowBuySell] = useState<any>(false);
  const [mergedArray, setMergedArray] = useState([]);

  const [selectedStockOrder, setSelectedStockOrder] = useState<any>("buy");
  const [selectedTradeData, setSelectedTradeData] = useState<any>([]);
  const [selectedComboEquityStock, setSelectedComboEquityStock] = useState<any>([]);
  const [editOrderId, setEditOrderId] = useState<number>(0);

  const dispatch = useAppDispatch();
  const symbolData: any = useAppSelector(quotesData);
  const { t, i18n } = useTranslation();
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };
  const Icon = ({ id, children, title }) => (
    <OverlayTrigger overlay={<Tooltip id={id}>{title}</Tooltip>}>{children}</OverlayTrigger>
  );
  const handleClose = () => {
    setShowBuySell(false);
    setShowStrategy(false);
    setEditOrderId(0);
  };

  const ExpandedComponent = ({ data }) => {
    return (
      <ul className="ordersDetails">
        {data.leg.map((entry, entryIndex) => {
          const symbolDetails = getDetailsFromSymbol(entry.option_symbol);
          const inputDate = symbolDetails.expiration;
          const month = inputDate.toLocaleString("en-US", { month: "short" });
          const day = inputDate.getDate();
          const year = inputDate.getFullYear();

          const formattedDate = `${month} ${day} ${year}`;
          return (
            <>
              <li className="ordersItem" key={entryIndex + Math.random()}>
                <span className="ordersItem__des">
                  {entry?.symbol} {formattedDate} ${symbolDetails?.strike} {getTitle(symbolDetails?.type)}
                </span>
                <span className="ordersItem__side">{convertToTitleCase(entry?.side)}</span>
                <span className="ordersItem__quantity">{entry.quantity}</span>
                <span className="ordersItem__type text-capitalize">{entry?.type}</span>
                <span className="ordersItem__duration text-capitalize">{entry?.duration}</span>
                <span className="ordersItem__filled">
                  {entry.status === "filled" ? (
                    <>
                      {entry.exec_quantity} / {entry.quantity}
                      <br />
                      {entry.avg_fill_price ? <>at {addDollarSignCommasToNumber(entry.avg_fill_price)}</> : ""}
                    </>
                  ) : (
                    <>0 / {entry.quantity}</>
                  )}{" "}
                </span>
                <span className="ordersItem__createdDate"></span>
                <span className="ordersItem__status">
                  <span className={` ${entry.status} text-capitalize status-badges`}>
                    {entry.status === "filled" || entry.status === "partially_filled" ? (
                      <span className="icon-done"></span>
                    ) : (
                      ""
                    )}
                    {entry.status === "pending" || entry.status === "open" ? <span className="icon-info"></span> : ""}
                    {entry.status === "rejected" ||
                    entry.status === "error" ||
                    entry.status === "expired" ||
                    entry.status === "canceled" ? (
                      <span className="icon-close"></span>
                    ) : (
                      ""
                    )}
                    {entry?.status}
                  </span>
                </span>
                <span className="ordersItem__action"></span>
              </li>
            </>
          );
        })}
      </ul>
    );
  };

  const SuccessSound = new Howl({
    src: ["../assets/sound/success.mp3"],
    volume: 1.0,
  });

  const ErrorSound = new Howl({
    src: ["../assets/sound/error.mp3"],
    volume: 1.0,
  });

  const setDynamicItemData = (row) => {
    if (row?.option_symbol) {
      const matchingObj = symbolData.find((item) => item.symbol === row.option_symbol);
      setSelectedTradeData([
        {
          ...matchingObj,
          ...row,
          symbol: row?.option_symbol,
          ticker: row.symbol,
        },
      ]);
    } else if (row.leg && row.leg.length > 0) {
      const collectData = [];
      row.leg.map((s) => {
        const matchingObj = symbolData.find((item) => item.symbol === s.option_symbol);
        if (s?.class === "equity") {
          setSelectedComboEquityStock([
            {
              ...matchingObj,
              ...s,
              symbol: s?.option_symbol,
              ticker: row.symbol,
            },
          ]);
        } else {
          collectData.push({
            ...matchingObj,
            ...s,
            symbol: s?.option_symbol,
            ticker: row.symbol,
          });
        }
      });

      setSelectedTradeData(collectData);
    } else {
      setSelectedTradeData([{ ...row, ticker: row.symbol }]);
    }
  };

  const columns = [
    {
      name: t("Dashboard.Symbol"),
      cell: (row) => (
        <>
          {row.symbol}
          <br />({row.description})
        </>
      ),
      sortable: false,
      width: "20rem",
    },
    {
      name: t("Dashboard.Side"),
      selector: (row) => {
        // let side = row.side;
        // row.leg?.map((leg) => {
        //   if (leg.side === "buy_to_close" || leg.side === "sell_to_close") {
        //     side = "buy to close";
        //   } else if (leg.side === "buy_to_open" || leg.side === "sell_to_open") {
        //     side = "buy to open";
        //   } else {
        //     side = leg.side;
        //   }
        // }, 0) || 0;
        return convertToTitleCase("");
      },
      sortable: false,
      width: "10rem",
    },
    {
      name: t("Dashboard.Quantity"),
      sortable: false,
      selector: (row) => Math.trunc(row.quantity),
      width: "10rem",
    },
    {
      name: t("Dashboard.Type"),
      cell: (row) => {
        return (
          <span className="text-capitalize">
            {row.type}
            <br />
            {row.price ? ` @ $${row.price}` : ""}{" "}
          </span>
        );
      },
      sortable: true,
      width: "10rem",
    },
    {
      name: t("Dashboard.Duration"),
      sortable: false,
      selector: (row) => <span className="text-capitalize">{row.duration}</span>,
      width: "10rem",
    },
    {
      name: t("Dashboard.Filled/ Qty"),
      sortable: false,
      cell: (row) => {
        if (row.status === "filled") {
          return (
            <>
              {row.exec_quantity} / {row.quantity}
              <br />
              {row.avg_fill_price ? <>at {addDollarSignCommasToNumber(row.avg_fill_price)}</> : ""}
            </>
          );
        } else {
          return `0 / ${row.quantity}`;
        }
      },
      width: "10rem",
    },
    {
      name: t("Dashboard.Created Date"),
      sortable: true,
      cell: (row) => formatTimeAndDate(row.create_date),
      width: "12rem",
    },
    {
      name: t("Dashboard.Status"),
      sortable: true,
      width: "12rem",
      cell: (row) => (
        <span className={`${row.status} text-capitalize status-badges`}>
          {row.status === "filled" || row.status === "partially_filled" ? <span className="icon-done"></span> : ""}
          {row.status === "pending" || row.status === "open" ? <span className="icon-info"></span> : ""}
          {row.status === "rejected" ||
          row.status === "error" ||
          row.status === "expired" ||
          row.status === "canceled" ? (
            <span className="icon-close"></span>
          ) : (
            ""
          )}
          {row.status}
        </span>
      ),
    },
    {
      name: t("Dashboard.Action"),
      sortable: false,
      width: "15rem",
      cell: (row) => {
        return (
          <div className="action_btns">
            {["open", "pending"].includes(row.status) && (
              <Icon title="Edit" id="t-1">
                <span
                  className="icon-stylus"
                  onClick={() => {
                    if (row.class === "equity") {
                      setShowBuySell(row);
                      setSelectedStockOrder("edit");
                    } else {
                      setShowStrategy(true);
                      setDynamicItemData(row);
                      setEditOrderId(row.id);
                    }
                  }}
                ></span>
              </Icon>
            )}
            <Icon title="Re Trade" id="t-2">
              <span
                className="icon-amend"
                onClick={() => {
                  if (row.class === "equity") {
                    setShowBuySell(row);
                    setSelectedStockOrder("buy");
                  } else {
                    setShowStrategy(true);
                    setDynamicItemData(row);
                  }
                }}
              ></span>
            </Icon>
            {["open", "pending"].includes(row.status) && (
              <Icon title="Cancel" id="t-3">
                <span className="icon-cancel" onClick={() => setShow4(row.id)}></span>
              </Icon>
            )}
          </div>
        );
      },
    },
  ];

  let symbolArray = [];
  useEffect(() => {
    if (data === null || data === undefined) {
      // Check for null value (not a string "null")
      data = []; // Initialize data as an empty array
    }
    if (data) {
      if (!Array.isArray(data)) {
        data = [data];
      }
      data?.forEach?.((item) => {
        if (item.leg && item.leg.length > 0) {
          item.leg.map((s) => {
            symbolArray.push(s.option_symbol);
          });
        } else {
          symbolArray.push(item?.option_symbol || item.symbol);
        }
      });
      if (symbolArray.length) {
        dispatch(fetchQuotesData(symbolArray));
      }
    }
  }, [data, dispatch]);
  useEffect(() => {
    if (symbolData && data) {
      let mergedArrayTemp = [];
      if (Array.isArray(data)) {
        let mergedArray = data?.map?.((obj1) => {
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
        mergedArrayTemp = [...sortedMergedArray];
      } else {
        const mergedObject = {
          ...data,
          ...symbolData.find((obj) => obj.symbol === data.symbol),
        };
        mergedArrayTemp = [mergedObject];
      }

      const customMergedArrayTemp: any = mergedArrayTemp?.map((order) => {
        if (!order.leg) {
          return {
            ...order,
            leg: [order],
          };
        }
        return order;
      });
      setMergedArray(customMergedArrayTemp);
    }
  }, [symbolData, data]);

  const sortByCreateDate = (dataArray) => {
    return dataArray.slice().sort((a, b) => {
      const dateA = new Date(a.create_date);
      const dateB = new Date(b.create_date);
      return dateB.getTime() - dateA.getTime();
    });
  };

  const formatTimeAndDate = (dateString) => {
    const date = new Date(dateString);
    const time = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    const formattedDate = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    return `${time} (${formattedDate})`;
  };

  const handleCancelOrder = () => {
    dispatch(deleteOrder({ orderId: show4, accountId: props.selectedAccount })).then((res: any) => {
      if (res.error) {
        setToastStatus(["Error", res.error.message]);
        setToastPopup(true);
        ErrorSound.play();
      } else {
        setToastStatus(["Success", "Order canceled successfully"]);
        setToastPopup(true);
        SuccessSound.play();
      }
      setShow4(false);
    });
  };

  const handleEditClosePopup = (orderData) => {
    dispatch(editPlaceOrder(orderData)).then((res: any) => {
      setShowBuySell(false);
      setEditOrderId(0);
      if (res.error) {
        setToastStatus(["Error", res.error.message]);
        setToastPopup(true);
        ErrorSound.play();
      } else {
        setToastStatus(["Success", "Order edited successfully"]);
        setToastPopup(true);
        SuccessSound.play();
      }
      setShow4(false);
    });
  };

  const rowPreDisabled = (row) => row.class === "equity";
  return (
    <>
      <h3>
        {t("Dashboard.Orders")} ({mergedArray?.length}){" "}
      </h3>
      <DataTable
        data={mergedArray ? sortByCreateDate(mergedArray) : []}
        columns={columns}
        pagination
        responsive={true}
        className="DataTable OrderTable"
        expandableRows
        expandableRowsComponent={ExpandedComponent}
        expandableRowDisabled={rowPreDisabled}
      />

      <Popups
        show={show2}
        handleClose={() => setShow2(false)}
        handleShow={() => setShow2(true)}
        modalTitle="Edit Order"
        submit="Submit Order"
      >
        <EditOrder></EditOrder>
      </Popups>

      <Popups
        show={show4}
        handleClose={() => setShow4(false)}
        // handleShow={() => setShow4(true)}
        handleSubmit={handleCancelOrder}
        className="text-center ClosePopup"
        modalTitle=""
        submit="Submit"
        size="sm"
      >
        <Errors modalTitle="" modalDesc="Are you sure, you want to cancel this order?"></Errors>
      </Popups>
      <ToastContainer>
        <Toast
          bg={toastStatus[0] === "Error" ? "danger" : "success"}
          show={toastPopup}
          onClose={() => setToastPopup(false)}
          delay={2000}
        >
          <Toast.Header></Toast.Header>
          <Toast.Body>
            <div className="info">
              <div className="icon">
                <span className="icon-close"></span>
              </div>
              <div className="infoDetails">
                <strong>{toastStatus?.[0]}</strong>
                <p>{toastStatus?.[1]}</p>
              </div>
            </div>
          </Toast.Body>
        </Toast>
      </ToastContainer>
      <Offcanvas show={showBuySell} onHide={handleClose} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            {t("stockPage.Buy/Sell Stock")} - {`"${showBuySell?.symbol}"`}
          </Offcanvas.Title>
        </Offcanvas.Header>
        <BuySell
          handleClose={handleClose}
          handleSubmit={handleEditClosePopup}
          tradeDataMap={[showBuySell]}
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
          <Offcanvas.Title>Buy Strategies - {`"${selectedTradeData[0]?.root_symbol}"`}</Offcanvas.Title>
        </Offcanvas.Header>
        <BuyStrategies
          handleClose={handleClose}
          actionType={"editOrder"}
          tradeDataMap={selectedComboEquityStock}
          optionDashboardRows={selectedTradeData}
          pageTitle="dashboard"
          editOrderId={editOrderId}
          showUnderlyingSec={selectedComboEquityStock?.length > 0 ? true : false}
        />
      </Offcanvas>
    </>
  );
};
export default Order;
