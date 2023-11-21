"use client";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxCommon";
import { IEvent } from "@/redux/slices/accountHistorySlice";
import { IGainLoss } from "@/redux/slices/accountGainLossSlice";
import { fetchWatchlistGraph } from "@/redux/slices/watchlistSlice";
import React, { useState, useEffect, useMemo } from "react";
import { fetchPaperTradingProfileDetails, fetchProfileDetails, profileData } from "@/redux/slices/profileSlice";
import { useTranslation } from "react-i18next";
import { Container, Row, Col, Table } from "react-bootstrap";
import { useRouter } from "next/navigation";
import { addCommasToNumber } from "@/utils/prize";
import styles from "../../styles/setting.module.scss";

const addDollorToValues = (value: number) => {
  const absValue = Math.abs(value);
  const valueWithDollor = value < 0 ? "-$" + addCommasToNumber(absValue) : "$" + addCommasToNumber(absValue);
  return valueWithDollor;
};

const Reports = () => {
  const { t, i18n } = useTranslation();
  const profile: any = useAppSelector(profileData);

  const history: any = useAppSelector((state) => state.accountHistory.history);
  const gainLoss: any = useAppSelector((state) => state.accountGainLoss.gainLoss);
  const accounts = profile?.profile?.account;
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [selectedAccount, setSelectedAccount] = useState("");
  const [accountHistory, setAccountHistory] = useState([]);
  const [accountGainLoss, setAccountGainLoss] = useState([]);

  useEffect(() => {
    dispatch(fetchProfileDetails());
    dispatch(fetchPaperTradingProfileDetails());
    dispatch(fetchWatchlistGraph());
  }, []);

  useEffect(() => {
    /* if (gainLoss?.length > 0) {
      setAccountGainLoss(gainLoss);
    } */
    setAccountGainLoss(gainLoss);
  }, [gainLoss]);

  useEffect(() => {
    if (history?.length > 0) {
      setAccountHistory(history);
    }
  }, [history]);

  useEffect(() => {
    if (Array.isArray(accounts)) {
      setSelectedAccount(accounts?.[0].account_number);
    } else {
      setSelectedAccount(accounts?.account_number);
    }
  }, [profile]);

  /* useEffect(() => {
    if (selectedAccount) {
      dispatch(fetchAccountHistory({ accountId: selectedAccount }));
      dispatch(fetchAccountGainLoss({ accountId: selectedAccount }));
    }
  }, [selectedAccount, dispatch]); */

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

  const ProfitLossList = useMemo(() => {
    if (!accountGainLoss.length) {
      return (
        <tr key={1}>
          <td colSpan={4}>No data found</td>
        </tr>
      );
    }
    return accountGainLoss?.map((data: IGainLoss, index: number) => {
      return (
        <tr key={index}>
          <td>{data.symbol}</td>
          <td>{new Date(data.open_date).toDateString()}</td>
          <td>{addDollorToValues(data.cost)}</td>
          <td>{addDollorToValues(data.proceeds)}</td>
          <td>{addDollorToValues(data.quantity)}</td>
          <td className={data.gain_loss > 0 ? "text-success" : "text-danger"}>
            {formatValue(data.gain_loss, true)} ({data.gain_loss_percent.toFixed(2)}%)
          </td>
        </tr>
      );
    });
  }, [accountGainLoss]);

  const HistoryList = useMemo(() => {
    return accountHistory?.map((data: IEvent, index: number) => {
      return (
        <tr key={index}>
          <td>{data?.trade?.symbol}</td>
          <td>{data.type}</td>
          <td>{new Date(data.date).toDateString()}</td>
          <td>{addDollorToValues(data.amount)}</td>
        </tr>
      );
    });
  }, [accountHistory]);

  return (
    <Container fluid className={styles.GainLoss}>
      <Row>
        <Col md={12} xs={12}>
          <h6>Gain /Loss</h6>
          <Table responsive>
            <thead>
              <th>Name</th>
              <th>Date</th>
              <th>Price</th>
              <th>Proceeds</th>
              <th>Quantity</th>
              <th>Gain/Loss</th>
            </thead>
            <tbody>{ProfitLossList}</tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
};

export default Reports;
