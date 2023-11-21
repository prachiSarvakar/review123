"use client";
import { useRef } from "react";
import Image from "next/image";
import styles from "@/styles/trade.module.scss";
import Logo from "@/assets/images/apple.svg";
import Landing from "@/assets/images/landing.png";
import { Card, Button } from "react-bootstrap";
import Cookies from "js-cookie";
import { SERACHED_STOCK_DATA } from "@/constants/common";
import { todayDate, yesterdayDate } from "@/utils/dates";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { addCommasFixedTwoToNumber, addCommasToNumber } from "@/utils/prize";
import { addDollarSignCommasToNumber } from "@/utils/positions";

// const PlaceHolder = ({ searchFocused, setSearchFocused }: any) => {
const PlaceHolder = () => {
  const stockData: any = Cookies?.get(SERACHED_STOCK_DATA) ? Cookies?.get(SERACHED_STOCK_DATA) : "{}";
  const stockDataParced = JSON.parse(stockData) || [];
  const stockDataSliced = stockDataParced.length > 0 ? stockDataParced : [];
  const router = useRouter();

  const onClickHandler = (index: any) => {
    router.push(`/trade?q=${stockDataSliced[index]?.symbol}&start=${yesterdayDate}&end=${todayDate}`);
  };

  const { t, i18n } = useTranslation();
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div>
      <Card className={styles.tradeLanding}>
        <Card.Body className={styles.landingPage}>
          <Image src={Landing} alt="Opcion Sigma Trade" className="img-fluid" />
          <h3>{t("landingtitle")}</h3>
          {/* <input ref={inputRef}/> */}
          {/* <Button variant="outline-primary" onClick={() => {inputRef.current.focus()}}>Lets Trade <span className="icon-arrow"></span></Button> */}
          <Button variant="outline-primary">
            {t("letstrade")} <span className="icon-arrow"></span>
          </Button>
        </Card.Body>
      </Card>
      <Card className={styles.LandingList}>
        <Card.Body className={styles.list}>
          <div>{stockDataSliced.length > 0 && <h6 className={styles.recentTitle}>{t("recentsearches")}</h6>}</div>
          {stockDataSliced.length > 0 && (
            <ul className={styles.recentSearch}>
              {stockDataSliced[0] && (
                <li className={styles.searchItem} onClick={() => onClickHandler(0)}>
                  <span className={styles.logo}>
                    <Image
                      src={
                        !stockDataSliced[0].symbol
                          ? "../assets/images/apple.svg"
                          : `https://storage.googleapis.com/iexcloud-hl37opg/api/logos/${stockDataSliced[0].symbol}.png`
                      }
                      alt="Picture of the author"
                      fill={true}
                    />
                  </span>
                  <div className={styles.ItemInfo}>
                    <h3 className={styles.Name}>
                      {!stockDataSliced[0] ? "Apple Inc" : stockDataSliced[0]?.description}
                      <span className={styles.symbol}>(NASDAQ: {stockDataSliced[0].symbol})</span>
                    </h3>
                    <div className={styles.priceMain}>
                      <span className={styles.currency}>$</span>
                      <span className={styles.price}>
                        {stockDataSliced[0]?.open === 0
                          ? 0
                          : addCommasFixedTwoToNumber(stockDataSliced[0]?.open) || "-"}
                      </span>
                      <span className={styles.change}>
                        {stockDataSliced[0]?.change === 0
                          ? 0
                          : addDollarSignCommasToNumber(stockDataSliced[0]?.change) || "-"}{" "}
                        (
                        {stockDataSliced[0]?.change_percentage === 0
                          ? 0
                          : addCommasFixedTwoToNumber(stockDataSliced[0]?.change_percentage) || "-"}
                        )
                        {stockDataSliced[0]?.change_percentage === 0 || stockDataSliced[0]?.change_percentage > 0 ? (
                          <span className="icon-up up"></span>
                        ) : (
                          <span className="icon-down down"></span>
                        )}
                      </span>
                    </div>
                  </div>
                </li>
              )}
              {stockDataSliced[1] && (
                <li className={styles.searchItem} onClick={() => onClickHandler(1)}>
                  <span className={styles.logo}>
                    <Image
                      src={
                        !stockDataSliced[1].symbol
                          ? "../assets/images/apple.svg"
                          : `https://storage.googleapis.com/iexcloud-hl37opg/api/logos/${stockDataSliced[1].symbol}.png`
                      }
                      alt="Picture of the author"
                      fill={true}
                    />
                  </span>
                  <div className={styles.ItemInfo}>
                    <h3 className={styles.Name}>
                      {!stockDataSliced[1] ? "Apple Inc" : stockDataSliced[1]?.description}
                      <span className={styles.symbol}>(NASDAQ: {stockDataSliced[1].symbol})</span>
                    </h3>
                    <div className={styles.priceMain}>
                      <span className={styles.currency}>$</span>
                      <span className={styles.price}>
                        {stockDataSliced[1]?.open === 0
                          ? 0
                          : addCommasFixedTwoToNumber(stockDataSliced[1]?.open) || "-"}
                      </span>
                      <span className={styles.change}>
                        {stockDataSliced[1]?.change === 0
                          ? 0
                          : addDollarSignCommasToNumber(stockDataSliced[1]?.change) || "-"}{" "}
                        (
                        {stockDataSliced[1]?.change_percentage === 0
                          ? 0
                          : addCommasFixedTwoToNumber(stockDataSliced[1]?.change_percentage) || "-"}
                        )
                        {stockDataSliced[1]?.change_percentage === 0 || stockDataSliced[1]?.change_percentage > 0 ? (
                          <span className="icon-up up"></span>
                        ) : (
                          <span className="icon-down down"></span>
                        )}
                      </span>
                    </div>
                  </div>
                </li>
              )}
              {stockDataSliced[2] && (
                <li className={styles.searchItem} onClick={() => onClickHandler(2)}>
                  <span className={styles.logo}>
                    <Image
                      src={
                        !stockDataSliced[2].symbol
                          ? "../assets/images/apple.svg"
                          : `https://storage.googleapis.com/iexcloud-hl37opg/api/logos/${stockDataSliced[2].symbol}.png`
                      }
                      alt="Picture of the author"
                      fill={true}
                    />
                  </span>
                  <div className={styles.ItemInfo}>
                    <h3 className={styles.Name}>
                      {!stockDataSliced[2] ? "Apple Inc" : stockDataSliced[2]?.description}
                      <span className={styles.symbol}>(NASDAQ: {stockDataSliced[2].symbol})</span>
                    </h3>
                    <div className={styles.priceMain}>
                      <span className={styles.currency}>$</span>
                      <span className={styles.price}>
                        {stockDataSliced[2]?.open === 0
                          ? 0
                          : addCommasFixedTwoToNumber(stockDataSliced[2]?.open) || "-"}
                      </span>
                      <span className={styles.change}>
                        {stockDataSliced[2]?.change === 0
                          ? 0
                          : addDollarSignCommasToNumber(stockDataSliced[2]?.change) || "-"}{" "}
                        (
                        {stockDataSliced[2]?.change_percentage === 0
                          ? 0
                          : addCommasFixedTwoToNumber(stockDataSliced[2]?.change_percentage) || "-"}
                        )
                        {stockDataSliced[2]?.change_percentage === 0 || stockDataSliced[2]?.change_percentage > 0 ? (
                          <span className="icon-up up"></span>
                        ) : (
                          <span className="icon-down down"></span>
                        )}
                      </span>
                    </div>
                  </div>
                </li>
              )}
              {stockDataSliced[3] && (
                <li className={styles.searchItem} onClick={() => onClickHandler(3)}>
                  <span className={styles.logo}>
                    <Image
                      src={
                        !stockDataSliced[3].symbol
                          ? "../assets/images/apple.svg"
                          : `https://storage.googleapis.com/iexcloud-hl37opg/api/logos/${stockDataSliced[3].symbol}.png`
                      }
                      alt="Picture of the author"
                      fill={true}
                    />
                  </span>
                  <div className={styles.ItemInfo}>
                    <h3 className={styles.Name}>
                      {!stockDataSliced[3] ? "Apple Inc" : stockDataSliced[3]?.description}
                      <span className={styles.symbol}>(NASDAQ: {stockDataSliced[3].symbol})</span>
                    </h3>
                    <div className={styles.priceMain}>
                      <span className={styles.currency}>$</span>
                      <span className={styles.price}>
                        {stockDataSliced[3]?.open === 0
                          ? 0
                          : addCommasFixedTwoToNumber(stockDataSliced[3]?.open) || "-"}
                      </span>
                      <span className={styles.change}>
                        {stockDataSliced[3]?.change === 0
                          ? 0
                          : addDollarSignCommasToNumber(stockDataSliced[3]?.change) || "-"}{" "}
                        (
                        {stockDataSliced[3]?.change_percentage === 0
                          ? 0
                          : addCommasFixedTwoToNumber(stockDataSliced[3]?.change_percentage) || "-"}
                        )
                        {stockDataSliced[3]?.change_percentage === 0 || stockDataSliced[3]?.change_percentage > 0 ? (
                          <span className="icon-up up"></span>
                        ) : (
                          <span className="icon-down down"></span>
                        )}
                      </span>
                    </div>
                  </div>
                </li>
              )}
            </ul>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default PlaceHolder;
