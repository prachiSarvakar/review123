"use client";
import { Container, Row, Col, Form } from "react-bootstrap";
import styles from "@/styles/cashflow.module.scss";
import { useTranslation } from "react-i18next";
import React, { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import "react-datepicker/dist/react-datepicker.css";
import MyDateInput from "@/components/sensaDatePicker/sensaDatePicker";
import { useAppDispatch } from "@/hooks/reduxCommon";
import { cashFlowDataToShow, fetchCashFlowApi } from "@/redux/slices/cashflowSlice";
import { useSelector } from "react-redux";

const DataTable = dynamic(() => import("react-data-table-component"), {
  ssr: false,
});
const CashFlow = () => {
  const { t, i18n } = useTranslation();
  const [cashFlowDate, setCashFlowDate] = useState(null);
  const dispatch = useAppDispatch();
  const cashFlowData = useSelector(cashFlowDataToShow);

  function convertTimeFormat(timeString) {
    const [hours, minutes] = timeString?.split(":")?.map(Number);
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedTime = `${formattedHours}:${formattedMinutes} ${ampm}`;
    return formattedTime;
  }

  function formatDate(inputDate) {
    const date = new Date(inputDate);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;
    return formattedDate;
  }

  function formatCostBasis(costBasis) {
    const costBasisNumber = parseFloat(costBasis);
    if (isNaN(costBasisNumber)) {
      return "Invalid Amount";
    }
    if (costBasisNumber >= 1000) {
      const formattedCostBasis = (costBasisNumber / 1000).toFixed(0);
      return `$${formattedCostBasis}K`;
    } else {
      return `$${costBasisNumber}`;
    }
  }

  function formatOptionActivity(optionActivityType) {
    switch (optionActivityType) {
      case "TRADE":
        return "Trade";
      case "SWEEP":
        return "Sweep";
      default:
        return optionActivityType;
    }
  }

  function formatCallPut(callPut) {
    switch (callPut) {
      case "CALL":
        return "Call";
      case "PUT":
        return "put";
      default:
        return callPut;
    }
  }

  function formatSentiment(sentiment) {
    switch (sentiment) {
      case "BULLISH":
        return "Bullish";
      case "BEARISH":
        return "Bearish";
      case "NEUTRAL":
        return "Neutral";
      default:
        return sentiment;
    }
  }

  useEffect(() => {
    dispatch(fetchCashFlowApi());
  }, [dispatch]);

  const combinedData = useMemo(() => {
    if (!Array.isArray(cashFlowData)) {
      return [];
    }

    return cashFlowData.map((dataItem, index) => {
      const responseItem = dataItem;

      return {
        id: dataItem.id,
        time: responseItem && convertTimeFormat(responseItem?.time),
        ticker: responseItem?.ticker,
        voi: responseItem?.aggressor_ind,
        strike: responseItem?.strike_price,
        expiration: formatDate(responseItem?.date_expiration),
        premium: formatCostBasis(responseItem?.cost_basis),
        details: `${responseItem?.volume} @ ${responseItem?.execution_estimate}`,
        type: formatOptionActivity(responseItem?.option_activity_type),
        call_put: formatCallPut(responseItem?.put_call),
        sentiment: formatSentiment(responseItem?.sentiment),
        sweep_score: responseItem?.aggressor_ind,
      };
    });
  }, [cashFlowData]); // Dependencies: cashFlowData

  const columns = [
    {
      name: "Time(EST)",
      selector: (row) => row.time,
    },
    {
      name: "Ticker",
      selector: (row) => row.ticker,
    },
    {
      name: "Voi/OI Ratio",
      selector: (row) => row.voi,
    },
    {
      name: "Strike",
      selector: (row) => row.strike,
    },
    {
      name: "Expiration",
      selector: (row) => row.expiration,
    },
    {
      name: "Premium",
      selector: (row) => row.premium,
    },
    {
      name: "Details",
      selector: (row) => row.details,
    },
    {
      name: "Type",
      selector: (row) => row.type,
    },

    {
      name: "Call/Put",
      selector: (row) => row.call_put,
    },
    {
      name: "Sentiment",
      selector: (row) => row.sentiment,
    },
    {
      name: "Sweep Score",
      cell: (row) => (
        <>
          <div className="w-100 ">
            <div className="cashflowProgressBar">
              <svg
                className="circle"
                viewBox="0 0 33.83098862 33.83098862"
                width="25"
                height="25"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  className="circle_fill"
                  stroke="#000000"
                  stroke-width="3"
                  stroke-dasharray="100,100"
                  stroke-linecap="round"
                  fill="none"
                  cx="16.91549431"
                  cy="16.91549431"
                  r="15.91549431"
                ></circle>
                <circle
                  className="circle_fill"
                  stroke="#FF0000"
                  stroke-width="3"
                  stroke-dasharray="50,100"
                  stroke-linecap="round"
                  fill="none"
                  cx="16.91549431"
                  cy="16.91549431"
                  r="15.91549431"
                ></circle>
              </svg>
              <span>50</span>
            </div>
          </div>
        </>
      ),
    },
    {
      name: t("Action"),
      width: "14rem",
      cell: (row) => (
        <div className="w-100">
          <span className="icon-exchange disabled"></span>
          <span className="icon-area_chart disabled"></span>
          <span className="icon-library_add disabled"></span>
        </div>
      ),
    },
  ];

  return (
    <>
      <Container fluid className={styles.CashFlow}>
        <Row>
          <Col md={12} xs={12}>
            <div className={`d-flex justify-content-between ${styles.cashflowContainer}`}>
              <h3>CashFlow</h3>
              <div className={styles.cashflowFilter}>
                <div className={styles.datepicker}>
                  <MyDateInput setSelectedDate={setCashFlowDate} selectedDate={cashFlowDate} />
                </div>

                <div className="switch-group">
                  <Form.Check type="switch" id="custom-switch" label="Select Range" />
                  <Form.Check type="switch" id="custom-switch" label="Watchlist" />
                  <Form.Check type="switch" id="custom-switch" label="ETF's" />
                </div>
              </div>
            </div>

            <DataTable
              columns={columns}
              paginationPerPage={15}
              data={combinedData}
              pagination
              className={`  ${styles.cashflowTable}`}
            />
          </Col>
        </Row>
      </Container>
    </>
  );
};
export default CashFlow;
