"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  fetchOptionStrategySelection,
  optionSelectionStatusCheck,
  optionStrategiSelectionData,
} from "@/redux/slices/optionStrategySlice";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxCommon";
import { usePathname, useRouter, useSearchParams, useSelectedLayoutSegment } from "next/navigation";
import { fetchOptionGreek, optionGreekData, optionGreekStatus } from "@/redux/slices/optionGreekSlice";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper";
import { formatDate, formatedDate } from "@/utils/dates";
import { setDatesIndexes } from "@/redux/slices/allDatesIndexSlice";
import { setDatesSelection } from "@/redux/slices/datesSelectionSlice";
import { fetchOptionGreekChains } from "@/redux/slices/optionGreekChainsSlice";
import styles from "@/styles/trade.module.scss";

interface DateSliderProps {
  setType: any;
  page: string;
  elements?: any;
}

const DateSlider: React.FC<DateSliderProps> = ({ setType = () => {}, page, elements }) => {
  const dispatch = useAppDispatch();
  const optionStrategiSelectionDates: any = useAppSelector(optionStrategiSelectionData);
  const allDatesIndex: any = useAppSelector((state) => state.allDatesIndexes?.indexes);
  const selectedDate = useAppSelector((state) => state.datesSelected.date);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const searchParams: any = useSearchParams();
  const search: string | null = searchParams.get("q");
  const expirationUri: string | null = searchParams.get("expiration");
  const router = useRouter();
  const pathname = usePathname();
  const swiperRef: any = useRef();
  useEffect(() => {
    if (search) {
      dispatch(fetchOptionStrategySelection(search));
    }
  }, [search, dispatch]);

  useEffect(() => {
    if (optionStrategiSelectionDates) {
      if (optionStrategiSelectionDates?.date?.length > 0) {
        if (allDatesIndex === 0) {
          const selectedDateObj = new Date(optionStrategiSelectionDates.date[0]);
          selectedDateObj.setMonth(selectedDateObj.getMonth() + 1);
          const newExpiration = formatedDate(selectedDateObj);

          if (!expirationUri) {
            if (optionStrategiSelectionDates.date.includes(newExpiration)) {
              dispatch(setDatesSelection(newExpiration));
            } else {
              const nearestPreviousDate = optionStrategiSelectionDates.date
                .filter((date) => new Date(date) < selectedDateObj)
                .pop(); // Get the last date in the filtered array
              if (nearestPreviousDate) {
                dispatch(setDatesSelection(nearestPreviousDate));
              }
            }
          } else {
            dispatch(setDatesSelection(expirationUri));
          }
        }
      }
    }
  }, [search, optionStrategiSelectionDates]);

  useEffect(() => {
    if (search && selectedDate) {
      const selectedIndex = optionStrategiSelectionDates?.date?.findIndex((date) => date === selectedDate);
      if (selectedIndex !== -1 && swiperRef.current) {
        setCurrentSlideIndex(selectedIndex);
        swiperRef.current.swiper.slideTo(selectedIndex - 2);
        dispatch(setDatesIndexes(selectedIndex));
      } else {
        setCurrentSlideIndex(0);
        swiperRef.current.swiper.slideTo(0);
        dispatch(setDatesIndexes(0));
      }

      const params = new URLSearchParams(searchParams);
      params.set("q", search);
      params.set("expiration", selectedDate);
      params.set("greeks", "true");
      if (!params.has("strategy")) {
        params.set("strategy", "1");
      }
      router.push(`${pathname}?${params.toString()}`);
      // router.push(`${pathname}?q=${search}&expiration=${selectedDate}&greeks=true`);
      if (page === "chains") {
        dispatch(fetchOptionGreek({ searchKey: search, expiration: selectedDate }));
      }
      dispatch(fetchOptionGreekChains({ searchKey: search, expiration: selectedDate }));
    }
  }, [search, selectedDate, dispatch, pathname, router, optionStrategiSelectionDates?.date]);

  const handleDateData = (search: any, expiration: any) => {
    if (search && expiration) {
      dispatch(setDatesSelection(expiration));
    }
  };

  const SwiperOption: any = {
    spaceBetween: 30,
    slidesPerView: "auto",
    navigation: true,
    modules: [Navigation],
    slideActiveClass: null,
    initialSlide: currentSlideIndex,
  };

  return (
    <div className={`navigation-wrapper strategies-slide ${elements?.length === 0 ? styles.disabledSwiper : ""}`}>
      <Swiper {...SwiperOption} ref={swiperRef}>
        {optionStrategiSelectionDates?.date?.map((item: any, index: number) => {
          const year = item.slice(2, 4);
          const curYear = new Date();
          const covstring = curYear.getFullYear().toString();
          const currentYear = covstring.slice(2, 4);
          return (
            <SwiperSlide
              style={{
                cursor: elements?.length === 0 ? "not-allowed" : "pointer",
              }}
              key={index}
              onClick={() => {
                if (page === "chains") {
                  handleDateData(search, item);
                  setType();
                } else {
                  if (elements?.length > 0) {
                    handleDateData(search, item);
                    setType();
                  }
                }
              }}
              className={
                page === "chains"
                  ? index === currentSlideIndex
                    ? "active"
                    : ""
                  : index === currentSlideIndex && elements?.length > 0
                  ? "active"
                  : ""
              }
            >
              {formatDate(item)} <span>{year == currentYear ? "" : `('${year})`}</span>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

function Arrow(props: { disabled?: boolean; left?: boolean; onClick: (e: any) => void }) {
  const disabeld = props.disabled ? " arrow--disabled" : "";
  return (
    <span onClick={props.onClick} className={`arrow ${props.left ? "arrow--left" : "arrow--right"} ${disabeld}`}>
      {props.left && <span className="icon-arrow"></span>}
      {!props.left && <span className="icon-arrow"></span>}
    </span>
  );
}

export default DateSlider;
