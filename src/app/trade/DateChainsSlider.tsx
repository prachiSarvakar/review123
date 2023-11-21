"use client";
import React, { useEffect, useState } from "react";
import {
  fetchOptionStrategySelection,
  optionSelectionStatusCheck,
  optionStrategiSelectionData,
} from "@/redux/slices/optionStrategySlice";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxCommon";
import { usePathname, useRouter, useSearchParams, useSelectedLayoutSegment } from "next/navigation";
import { fetchOptionGreekChains } from "@/redux/slices/optionGreekChainsSlice";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper";
import { formatDate } from "@/utils/dates";
import { setDatesIndexes } from "@/redux/slices/allDatesIndexSlice";
import { setDatesSelection } from "@/redux/slices/datesSelectionSlice";

const DateSlider = ({ setType = () => {} }) => {
  const dispatch = useAppDispatch();
  const optionStrategiSelectionDates: any = useAppSelector(optionStrategiSelectionData);
  const allDatesIndex: any = useAppSelector((state) => state.allDatesIndexes?.indexes);
  const selectedDate = useAppSelector((state) => state.datesSelected.date);
  const searchParams = useSearchParams();
  const search: string | null = searchParams.get("q");
  const router = useRouter();
  const pathname = usePathname();
  const swiperRef: any = "";

  useEffect(() => {
    if (search) {
      dispatch(fetchOptionStrategySelection(search));
    }
  }, [search, dispatch]);

  useEffect(() => {
    if (optionStrategiSelectionDates) {
      if (optionStrategiSelectionDates?.date?.length > 0) {
        if (allDatesIndex === 0) {
          dispatch(setDatesSelection(optionStrategiSelectionDates.date[0]));
        }
      }
    }
  }, [search, optionStrategiSelectionDates]);

  useEffect(() => {
    if (search && selectedDate) {
      const selectedIndex = optionStrategiSelectionDates?.date?.findIndex((date) => date === selectedDate);
      if (selectedIndex !== -1) {
        dispatch(setDatesIndexes(selectedIndex));
      }
      router.push(`${pathname}?q=${search}&expiration=${selectedDate}&greeks=true`);
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
  };

  return (
    <div className="navigation-wrapper strategies-slide">
      <Swiper {...SwiperOption}>
        {optionStrategiSelectionDates?.date?.map((item: any, index: number) => {
          const year = item.slice(2, 4);
          const curYear = new Date();
          const covstring = curYear.getFullYear().toString();
          const currentYear = covstring.slice(2, 4);
          return (
            <SwiperSlide
              key={index}
              onClick={() => {
                handleDateData(search, item);
                setType();
              }}
              className={index === allDatesIndex ? "active" : ""}
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
