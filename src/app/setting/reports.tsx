"use client";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxCommon";
import { accountHistoryDataStatus, fetchAccountHistory, IEvent } from "@/redux/slices/accountHistorySlice";
import { accountGainStatus, fetchAccountGainLoss, IGainLoss } from "@/redux/slices/accountGainLossSlice";
import { fetchWatchlistGraph, watchlistDataStatus } from "@/redux/slices/watchlistSlice";
import React, { useState, useEffect, useMemo } from "react";
import { fetchPaperTradingProfileDetails, fetchProfileDetails, profileData } from "@/redux/slices/profileSlice";
import { useTranslation } from "react-i18next";
import { Container, Row, Col, Table } from "react-bootstrap";
import { useRouter } from "next/navigation";

const addDollorToValues = (value: number) => {
  const absValue = Math.abs(value);
  const valueWithDollor = value < 0 ? "-$" + absValue : "$" + absValue;
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
          <td className={data.gain_loss > 0 ? "text-success" : "text-danger"}>
            {data.gain_loss}({data.gain_loss_percent}%)
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
    <Container fluid>
      <Row>
        <Col md={6} xs={12}>
          <h6>Gain /Loss</h6>
          <Table>
            <thead>
              <th>Name</th>
              <th>Date</th>
              <th>Price</th>
              <th>Gain/Loss</th>
            </thead>
            <tbody>{ProfitLossList}</tbody>
          </Table>
        </Col>
        <Col md={6} xs={12}>
          <h6>History</h6>
          <Table>
            <thead>
              <th>Name</th>
              <th>Type</th>
              <th>Date</th>
              <th>Price</th>
            </thead>
            <tbody>{HistoryList}</tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
};

export default Reports;
