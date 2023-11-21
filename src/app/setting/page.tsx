"use client";
import styles from "@/styles/setting.module.scss";
import { useTranslation } from "react-i18next";
import { Button, Card, Tab, Tabs, Dropdown } from "react-bootstrap";
import { useState } from "react";
import Account from "./account";
import Cash from "./cash";
import Margin from "./margin";
import GainLoss from "./gainloss";
import History from "./history";
import Others from "./other";
import PandL from "./pandl";
import TradingJournal from "./tradingJournal";
// import Image from "next/image";
// import User from "@/assets/images/user.svg";
import { fetchProfileDetails, profileData } from "@/redux/slices/profileSlice";
import { balancesData, statusCheck, fetchBalanceDetails } from "@/redux/slices/balanceSlice";

import { useAppDispatch, useAppSelector } from "@/hooks/reduxCommon";
import { addCommasToNumber } from "@/utils/prize";


const Setting = () => {
  const profile: any = useAppSelector(profileData);
  const balancesObj: any = useAppSelector(balancesData);
  const dispatch = useAppDispatch();

  const { t, i18n } = useTranslation();
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const [activeTab, setActiveTab] = useState("account");
  const handleTabs = (tabKey: string | null) => {
    if (tabKey !== activeTab && tabKey) {
      setActiveTab(tabKey);
    }
  };

  let options = {
    optionBuyingPower: 0,
    stockBuyingPower: 0,
  }

  /* if(balancesObj.balances.account_type == 'cash'){
    options = {
      optionBuyingPower:balancesObj.balances.cash.option_buying_power,
      stockBuyingPower:balancesObj.balances.cash.stock_buying_power,
    }
  } */
  if (balancesObj.balances.account_type == 'margin') {
    options = {
      optionBuyingPower: balancesObj.balances.margin.option_buying_power,
      stockBuyingPower: balancesObj.balances.margin.stock_buying_power,
    }
  }
  if (balancesObj.balances.account_type == 'pdt') {
    options = {
      optionBuyingPower: balancesObj.balances.pdt.option_buying_power,
      stockBuyingPower: balancesObj.balances.pdt.stock_buying_power,
    }
  }

  const formatValue = (amount, addComma) => {
    if (amount == 0) {
      return "$" + amount;
    }
    else if (amount < 0) {
      return "-$" + Math.abs(amount).toFixed(2)

    } else if (amount > 0) {
      if (addComma) {
        return "$" + addCommasToNumber(Math.abs(amount).toFixed(2))
      }
      return "$" + Math.abs(amount).toFixed(2)

    } else {
      return "$" + 0;
    }
  }

  let accountInfo = [
    {
      id: 1,
      title: t("Setting.Total account value"),
      // value: `$ ${(balancesObj.balances.total_equity)?balancesObj.balances.total_equity.toFixed(2):0}`,
      value: formatValue(balancesObj.balances.total_equity, true),
    },
    {
      id: 2,
      title: t("Setting.Total cash value"),
      value: formatValue(balancesObj.balances.total_cash, true),
    },
    {
      id: 3,
      title: t("Setting.Option requirement"),
      value: formatValue(balancesObj.balances.option_requirement, true),
    },
    {
      id: 4,
      title: t("Setting.Margin Option Buying Power"),
      value: formatValue(options.optionBuyingPower, true),
    },
    {
      id: 5,
      title: t("Setting.Margin stock buying power"),
      value: formatValue(options.stockBuyingPower, true),
    },
    {
      id: 6,
      title: t("Setting.Open P/L"),
      value: formatValue(balancesObj.balances.open_pl, true),
    },
  ];





  const AccountKInfo = accountInfo.map((data) => {
    return (
      // eslint-disable-next-line react/jsx-key
      <li>
        <label>{data.title}</label>
        <strong>{data.value}</strong>
      </li>
    );
  });

  return (
    <Card className={styles.settingPage}>
      <Card.Header className={styles.settingHeader}>
        <div className={styles.title}>
          <h2>{t("Setting.title")}</h2>
          <p>{t("Setting.subtitle")}</p>
        </div>
        {/* <div className={styles.rightHeader}>
          {profile && profile?.profile && (profile.status == 200) && <div className={styles.leftInfo}>
            <Image src={User} width={60} height={60} alt="User Info" />
            
            
            <Button variant="outline-primary">{balancesObj.selectedAccountId}</Button>
            <strong>{profile.profile.name}</strong>
          </div>}


          <Button variant="outline-primary" className={styles.logout}>
            <span className="icon-login"></span>
          </Button>
        </div> */}
      </Card.Header>
      <Card.Body className={styles.settingContainer}>
        <div className={styles.accountInfo}>
          <ul>{AccountKInfo}</ul>
        </div>
        <Tabs activeKey={activeTab} onSelect={handleTabs} id="justify-tab-example" className="settingTabs">
          <Tab eventKey="account" title={t("Setting.Account")} className={styles.tabContent}>
            {activeTab === "account" && <Account />}
          </Tab>
          <Tab eventKey="pandL" title={t("Setting.P&L Requirement")} className={styles.tabContent}>
            {activeTab === "pandL" && <PandL />}
          </Tab>
          <Tab eventKey="cash" title={t("Setting.Cash")} className={styles.tabContent}>
            {activeTab === "cash" && <Cash></Cash>}
          </Tab>
          <Tab eventKey="margin" title={t("Setting.Margin")} className={styles.tabContent}>
            {activeTab === "margin" && <Margin />}
          </Tab>
          <Tab eventKey="reports" title={t("Setting.GainLoss")} className={styles.tabContent}>
            {activeTab === "reports" && <GainLoss />}
          </Tab>
          <Tab eventKey="history" title={t("Setting.History")} className={styles.tabContent}>
            {activeTab === "history" && <History />}
          </Tab>
          <Tab eventKey="others" title={t("Setting.Other")} className={styles.tabContent}>
            {activeTab === "others" && <Others />}
          </Tab>
          <Tab eventKey="Trading Journal" title={t("Setting.TradingJournal")} className={styles.tabContent}>
            {activeTab === "Trading Journal" && <TradingJournal />}
          </Tab>
        </Tabs>
      </Card.Body>
    </Card>
  );
};

export default Setting;
