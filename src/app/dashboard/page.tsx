"use client";
import { Card, Button, Container, Row, Col } from "react-bootstrap";
import "swiper/css";
import "swiper/css/navigation";
import styles from "@/styles/dashboard.module.scss";
import { useTranslation } from "react-i18next";
import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxCommon";
import { fetchOrderList, orderList, orderStatusNumber } from "@/redux/slices/orderListSlice";
import { fetchPositionList, positionList, positionListStatusNum } from "@/redux/slices/positionListSlice";
import { fetchWatchlistGraph, watchlistData, watchlistDataStatus } from "@/redux/slices/watchlistSlice";
import { balancesData, statusCheck } from "@/redux/slices/balanceSlice";
import Whishlist from "./wishlist";
import Positions from "./postions";
import Order from "./order";
import PortfolioSwiper from "./portfolio";
import { useRouter } from "next/navigation";
import { addCommasToNumber } from "@/utils/prize";
import { customToFixed } from "@/utils/positions";

const Dashboard = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();

  const orders: any = useAppSelector(orderList);
  const orderStatusNum: any = useAppSelector(orderStatusNumber);
  const positions: any = useAppSelector(positionList);
  const positionsStatusNum: any = useAppSelector(positionListStatusNum);
  const balancesObj: any = useAppSelector(balancesData);
  const statusNum: any = useAppSelector(statusCheck);
  const watchlistItems: any = useAppSelector(watchlistData);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const [lastRefresh, setLastRefresh] = useState(new Date());
  const router = useRouter();

  useEffect(() => {
    const intervalId = setInterval(handleRefresh, 5000);

    // Clean up the interval when the component is unmounted
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    dispatch(fetchWatchlistGraph());
  }, [lastRefresh]);

  useEffect(() => {
    const accountId = balancesObj.selectedAccountId;
    if (accountId) {
      dispatch(fetchOrderList(accountId));
      dispatch(fetchPositionList(accountId));
      // setLoading(false);
    }
  }, [balancesObj.selectedAccountId, lastRefresh, statusNum, orderStatusNum, positionsStatusNum]);

  const handleRefresh = () => {
    const now = new Date();
    setLastRefresh(now);
  };

  const formatTime = (date) => {
    const now = new Date();
    const diffMilliseconds = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMilliseconds / (1000 * 60 * 60 * 24));

    if (diffDays > 1) {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      });
    } else {
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      });
    }
  };

  return (
    <Card className={styles.Dashboard}>
      {/* {loading ? (
        <Loader />
      ) : ( */}
      <>
        <Card.Header className={styles.Dashboard__header}>
          {/* {t('dashboardtitle')} */}
          <div className={styles.leftheader}>
            <div>
              <Button>{balancesObj.selectedAccountId}</Button>
            </div>
            <ul>
              <li>
                <label>{t("Dashboard.Total Value")} </label>
                <strong>$ {addCommasToNumber(balancesObj?.balances?.total_equity?.toFixed(2) || 0)}</strong>
              </li>
              <li>
                <label>
                  {balancesObj?.balances?.account_type === "cash" ? "Funds available" : t("Dashboard.Open B.P")}{" "}
                </label>
                <strong>
                  ${" "}
                  {addCommasToNumber(
                    customToFixed(
                      balancesObj?.balances?.account_type === "cash"
                        ? balancesObj?.balances?.cash?.cash_available
                        : balancesObj?.balances?.[balancesObj?.balances?.account_type]?.option_buying_power
                    ) || 0
                  )}
                </strong>
              </li>
              <li>
                <label>
                  {balancesObj?.balances?.account_type === "cash" ? "Settled funds" : t("Dashboard.Stock BP")}{" "}
                </label>
                <strong>
                  ${" "}
                  {addCommasToNumber(
                    customToFixed(
                      balancesObj?.balances?.account_type === "cash"
                        ? balancesObj?.balances?.cash?.cash_available - balancesObj?.balances?.cash?.unsettled_funds
                        : balancesObj?.balances?.[balancesObj?.balances?.account_type]?.stock_buying_power
                    ) || 0
                  )}
                </strong>
              </li>
            </ul>
            <a target="_blank" href="http://dash.tradier.com/funding">
              <Button variant="outline-primary">
                <span className="icon-sell"></span>Fund
              </Button>
            </a>
          </div>
          <div className={styles.lastSync}>
            {lastRefresh ? (
              <>
                <label>Last Updated</label>
                <strong>{formatTime(lastRefresh).toLocaleString()}</strong>
                <Button variant="outline-primary" onClick={handleRefresh}>
                  <span className="icon-refresh"></span>
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline-primary" onClick={handleRefresh}>
                  <span className="icon-refresh"></span>
                </Button>
              </>
            )}
          </div>
        </Card.Header>
        <Card.Body className={styles.Dashboard__body}>
          <Container fluid>
            <Row className="justify-content-md-center">
              <Col lg="9" sm="12">
                <h3>{t("Dashboard.Portfolio performance")}</h3>

                <PortfolioSwiper lastRefresh={lastRefresh} />

                <Order
                  positions={positions?.position}
                  selectedAccount={balancesObj?.selectedAccountId}
                  orders={orders?.order}
                />
                <Positions positions={positions?.position} lastRefresh={lastRefresh} />
              </Col>
              <Col lg="3" sm="12" className="watchlistMain">
                <Whishlist watchlist={watchlistItems} lastRefresh={lastRefresh} />
              </Col>
            </Row>
          </Container>
        </Card.Body>
      </>
      {/* )} */}
    </Card>
  );
};
export default Dashboard;
