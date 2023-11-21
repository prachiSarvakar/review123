"use client";
import { Button, Toast, ToastContainer } from "react-bootstrap";
import { useRouter } from "next/navigation";
import { todayDate, yesterdayDate } from "@/utils/dates";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxCommon";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { fetchQuotesData, quotesData } from "@/redux/slices/quoteSlice";
import { removeFromWatchlist, watchlistDataStatus } from "@/redux/slices/watchlistSlice";
import styles from "@/styles/dashboard.module.scss";
import { useTranslation } from "react-i18next";
import Document from "@/assets/images/document.svg";
import { Howl } from "howler";
import { addCommasToNumber } from "@/utils/prize";
import { addDollarSignCommasToNumber, customToFixed } from "@/utils/positions";

const Whishlist = (props) => {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const symbolData: any = useAppSelector(quotesData);
  const router = useRouter();

  const [updateSuccess, setUpdateSuccess] = useState(false);
  let { watchlist, lastRefresh } = props;

  if (watchlist === "null") {
    watchlist = [];
  }
  const [mergedArray, setMergedArray] = useState([]);
  let symbolArray = [];

  useEffect(() => {
    if (watchlist) {
      watchlist.forEach((item) => {
        symbolArray.push(item.symbol);
      });
      dispatch(fetchQuotesData(symbolArray));
    }
  }, [watchlist, lastRefresh, dispatch]);
  useEffect(() => {
    if (watchlist && symbolData) {
      const mergedArray = [...watchlist];
      symbolData.forEach((obj2) => {
        const matchingIndex = watchlist.findIndex((obj1) => obj1.symbol === obj2.symbol);
        if (matchingIndex !== -1) {
          mergedArray[matchingIndex] = { ...mergedArray[matchingIndex], ...obj2 };
        }
      });
      setMergedArray(mergedArray);
    }
  }, [symbolData, watchlist]);

  const [selectedIds, setSelectedIds] = useState([]);

  const toggleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleDeleteSelected = () => {
    selectedIds.map((selectedId) => {
      dispatch(removeFromWatchlist(encodeURIComponent(selectedId))).then(() => {
        setUpdateSuccess(true);
        setSelectedIds([])
      });
    });
  };

  const selectItem = (item: string) => {
    const firstValue = item.split("(")[0].trim();
    router.push(`/trade?q=${firstValue}&start=${yesterdayDate}&end=${todayDate}`);
  };

  const redirectToTrade = () => {
    router.push(`/trade`);
  };

  const SuccessSound = new Howl({
    src: ["../assets/sound/success.mp3"],
    volume: 1.0,
  });

  return (
    <>
      <div className="d-flex justify-content-between align-items-center">
        <h3 className={styles.watchlistTitle}>
          {t("Dashboard.Watch List")} ({mergedArray?.length})
        </h3>
        <span onClick={handleDeleteSelected} className="icon-delete"></span>
      </div>
      {mergedArray.length !== 0 ? (
        <ul className={styles.wishlist}>
          {mergedArray?.map((watch) => {
            let value2 = watch.close;
            if (watch.close === "null" || watch.close === null) {
              value2 = watch.last;
            }

            return (
              <li key={watch.id + value2 + watch.prevclose} className={styles.wishlist__item}>
                <div
                  className={styles.logo}
                  onClick={() => {
                    selectItem(watch.symbol);
                  }}
                >
                  <Image
                    src={
                      !watch.symbol
                        ? "../assets/images/apple.svg"
                        : `https://storage.googleapis.com/iexcloud-hl37opg/api/logos/${watch.symbol}.png`
                    }
                    alt={watch.symbol}
                    fill={true}
                  />
                </div>
                <div
                  onClick={() => {
                    selectItem(watch.symbol);
                  }}
                  className={styles.info}
                >
                  <h5 className={styles.name}>{watch.symbol}</h5>
                  <p className={styles.symbol}>{watch.description}</p>
                </div>
                <div
                  className={styles.price}
                  onClick={() => {
                    selectItem(watch.symbol);
                  }}
                >
                  <strong>$ {addCommasToNumber(watch.last || 0)}</strong>
                  <span className={watch.change_percentage >= 0 ? styles.up : styles.down}>
                    <span className={watch.change_percentage >= 0 ? "icon-up" : "icon-down"}></span>
                    <span>
                      {addDollarSignCommasToNumber(watch.change) || 0} ({customToFixed(watch.change_percentage || 0)}%)
                    </span>
                  </span>
                </div>
                <div className={styles.actions}>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={selectedIds.includes(watch.id)}
                      onChange={() => toggleSelect(watch.id)}
                    />
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className={styles.noData}>
          <span className={styles.icon}>
            <Image src={Document} fill={true} alt="No Data" />
          </span>
          <strong>No Data</strong>
          <p>Please add item to watchlist</p>
          <Button variant="outline-primary" onClick={redirectToTrade}>
            + Add Now
          </Button>
        </div>
      )}

      <ToastContainer position="top-end" className="p-3">
        <Toast bg="success" show={updateSuccess} onClose={() => setUpdateSuccess(false)} delay={2000}>
          <Toast.Header></Toast.Header>
          <Toast.Body>
            <div className="info">
              <div className="icon">
                <span className="icon-done"></span>
              </div>
              <div className="infoDetails">
                <strong>Success</strong>
                <p>
                  {" "}
                  {selectedIds.length === 1 ? (
                    <>
                      <span className="text-uppercase">{selectedIds[0]}</span> was
                    </>
                  ) : (
                    "Selected items were"
                  )}{" "}
                  removed from your default watchlist.
                </p>
              </div>
            </div>
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
};

export default Whishlist;
