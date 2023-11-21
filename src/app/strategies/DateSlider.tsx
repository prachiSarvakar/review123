"use client";
import React, { useEffect, useState } from "react";
import {
  fetchOptionStrategySelection,
  optionSelectionStatusCheck,
  optionStrategiSelectionData,
} from "@/redux/slices/optionStrategySlice";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxCommon";
import { usePathname, useRouter, useSearchParams, useSelectedLayoutSegment } from "next/navigation";
import { fetchOptionGreek, optionGreekStatus } from "@/redux/slices/optionGreekSlice";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper";
import { formatDate } from "@/utils/dates";
import SpreadSheetViewModel from "@/utils/SpreadSheetCalculation";
import { setData } from "@/redux/slices/optionTypeSlice";

const DateSlider = (containerState) => {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [loaded, setLoaded] = useState(false);
  const [dateSelected, setDateSelected] = useState<any>();
  const [expirationDate, setExpirationDate] = useState("");
  const segment = useSelectedLayoutSegment();
  // const [filtertype, setFilterType] = useState(FilterType.ProfitLossDollar);
  const [data, setGetData] = useState<any>();
  // const [sliderRef, instanceRef] = useKeenSlider({
  //   initial: 0,
  //   slideChanged(slider) {
  //     setCurrentSlide(slider.track.details.rel);
  //   },
  //   slides: {
  //     perView: "auto",
  //     spacing: 15,
  //   },
  //   created() {
  //     setLoaded(true);
  //   },
  // });

  const dispatch = useAppDispatch();
  const optionStrategiSelectionDates: any = useAppSelector(optionStrategiSelectionData);
  const searchParams = useSearchParams();
  const search: string | null = searchParams.get("q");
  const router = useRouter();
  const pathname = usePathname();

  const swiperRef: any = "";

  // useEffect(() => {
  //   if (search) {
  //     dispatch(fetchOptionStrategySelection(search));
  //   }
  // }, [search, dispatch]);

  // useEffect(() => {
  //   if (optionStrategiSelectionDates) {
  //     if (optionStrategiSelectionDates?.date?.length > 0) {
  //       setExpirationDate(optionStrategiSelectionDates.date[0]);
  //     }
  //   }
  // }, [search, optionStrategiSelectionDates]);

  // useEffect(() => {
  //   if (search && expirationDate) {
  //     router.push(`${pathname}?q=${search}&expiration=${expirationDate}&greeks=true`);
  //     dispatch(fetchOptionGreek({ searchKey: search, expiration: expirationDate }));
  //   }
  // }, [search, expirationDate, dispatch, pathname, router]);

  // const handleDateData = (search: any, expiration: any) => {
  //   if (search && expiration) {
  //     setExpirationDate(expiration);
  //     // dispatch(setData(containerState));
  //   }
  // };

  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const handleItemClick = (index: number) => {
    setActiveIndex(index);
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
          return (
            <SwiperSlide
              key={index}
              onClick={() => {
                // handleDateData(search, item);
                handleItemClick(index);
              }}
              className={index === activeIndex ? "active" : ""}
            >
              {formatDate(item)}
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
