"use client";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxCommon";
import { IEvent } from "@/redux/slices/accountHistorySlice";
import { fetchWatchlistGraph } from "@/redux/slices/watchlistSlice";
import React, { useState, useEffect, useMemo } from "react";
import { fetchPaperTradingProfileDetails, fetchProfileDetails, profileData } from "@/redux/slices/profileSlice";
import { useTranslation } from "react-i18next";
import { Container, Row, Col, Table } from "react-bootstrap";
import { useRouter } from "next/navigation";
import { addCommasToNumber } from "@/utils/prize";
import { addDollarSignCommasToNumber } from "@/utils/positions";
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

  const HistoryList = useMemo(() => {
    return accountHistory?.map((data: IEvent, index: number) => {
      return (
        <tr key={index}>
          <td>{data?.trade?.symbol}</td>
          <td>{addDollarSignCommasToNumber(data?.trade?.price || 0)}</td>
          <td>{data.type}</td>
          <td>{data?.trade?.description}</td>
          <td>{new Date(data.date).toDateString()}</td>
          <td>{data?.trade?.quantity}</td>
          <td>{data?.trade?.commission}</td>
          <td>{addDollorToValues(data.amount)}</td>
        </tr>
      );
    });
  }, [accountHistory]);

  return (
    <Container fluid className={styles.History}>
      <Row>
        <Col md={12} xs={12}>
          <h6>History</h6>
          <Table responsive>
            <thead>
              <th>Name</th>
              <th>Price</th>
              <th>Type</th>
              <th>Description</th>
              <th>Date</th>
              <th>Quantity</th>
              <th>Commission</th>
              <th>Amount</th>
            </thead>
            <tbody>{HistoryList}</tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
};

export default Reports;
