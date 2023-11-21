import Image from "next/image";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useRouter } from "next/navigation";
import { todayDate, yesterdayDate } from "@/utils/dates";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxCommon";
import React, { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import { fetchQuotesData, quotesData } from "@/redux/slices/quoteSlice";
import { fetchTimesales, timeSales } from "@/redux/slices/timeSalesSlice";
import { addCommasToNumber } from "@/utils/prize";
import { customToFixed } from "@/utils/positions";

const option = {
  chart: {
    animation: false,
    height: 80,
    width: 130,
    plotBackgroundColor: null,
    plotBorderWidth: null,
    plotShadow: false,
    type: "line",
    backgroundColor: "transparent",
  },
  title: {
    text: "",
  },
  annotations: {
    xaxis: [
      {
        borderColor: "transparent",
      },
    ],
  },
  xAxis: {
    // show: false,
    labels: {
      enabled: false, // Hide X-axis labels
    },
    lineColor: "transparent", // Hide X-axis line
    tickLength: 0, // Hide X-axis ticks
    categories: [], // Set categories to an empty array to hide X-axis labels
  },
  yAxis: {
    visible: false, // Hide Y-axis
    gridLineColor: "transparent", // Hide Y-axis grid lines
  },
  plotOptions: {
    series: {
      marker: {
        enabled: false, // Hide data markers
      },
    },
  },
  tooltip: false,
  legend: false,
};

const PortfolioSwiper = ({ lastRefresh }) => {
  const dispatch = useAppDispatch();
  const symbolData: any = useAppSelector(quotesData);
  const timesalesData: any = useAppSelector(timeSales);

  const router = useRouter();
  const symbolArray = [
    "SPY",
    "QQQ",
    "DIA",
    "IWM",
    // "VIX", // Giving 401 error
    "GLD",
    "SLV",
    "TLT",
  ];

  useEffect(() => {
    // const symbolExistsInArray = (symbol, array) => array.some((obj) => obj.symbol === symbol);
    // const symbolsToFetchWithoutDuplicates = symbolArray.filter((symbol) => !symbolExistsInArray(symbol, symbolData));
    dispatch(fetchQuotesData(symbolArray));
    symbolArray.map((symbol) => {
      dispatch(fetchTimesales(symbol));
    });
  }, [dispatch, lastRefresh]);

  const removeDuplicatesByKey = (dataArray, key) => {
    const uniqueKeys = new Set();
    return dataArray.filter((obj) => {
      if (!uniqueKeys.has(obj[key])) {
        uniqueKeys.add(obj[key]);
        return true;
      }
      return false;
    });
  };

  const filteredObjects = symbolData.filter((obj) => symbolArray.includes(obj.symbol));
  const uniqueDataArray = removeDuplicatesByKey(filteredObjects, "symbol");
  const sequenceDataArray = uniqueDataArray.length
    ? symbolArray.map((symb) => {
        return uniqueDataArray.find((unq) => symb === unq.symbol);
      })
    : [];

  const portfolioClass = ["portfolio"];
  const portfolioClass2 = ["portfolio"];
  const isUp = true;
  const isDown = true;

  if (isUp) {
    portfolioClass.push("up");
  }
  if (isDown) {
    portfolioClass2.push("down");
  }

  const selectItem = (item: string) => {
    const firstValue = item.split("(")[0].trim();
    router.push(`/trade?q=${firstValue}&start=${yesterdayDate}&end=${todayDate}`);
  };

  return (
    <Swiper
      spaceBetween={15}
      breakpoints={{
        400: {
          slidesPerView: 1,
          spaceBetween: 15,
        },
        600: {
          slidesPerView: 2,
          spaceBetween: 15,
        },
        900: {
          slidesPerView: 3,
          spaceBetween: 15,
        },
      }}
      className="portfolioList"
      navigation={true}
      modules={[Navigation]}
    >
      {sequenceDataArray.map((portfolio) => {
        let matchingTimeSales, data;
        if (timesalesData.length > 0) {
          matchingTimeSales = timesalesData?.find((series) => series?.symbol === portfolio?.symbol);

          if (Array.isArray(matchingTimeSales?.data?.series?.data)) {
            data = matchingTimeSales?.data?.series?.data?.map?.((dataPoint) => [dataPoint.timestamp, dataPoint.price]);
          } else {
            data = [0, 0];
          }
        } else {
          data = [0, 0];
        }
        const series = {
          series: {
            name: "Line",
            type: "line",
            data,
            color: portfolio?.change_percentage >= 0 ? "#38ad4b" : "#d94041",
            negativeColor: portfolio?.change_percentage >= 0 ? "#38ad4b" : "#d94041",
          },
        };
        return (
          <SwiperSlide
            key={portfolio?.symbol}
            className={portfolio?.change_percentage >= 0 ? portfolioClass?.join(" ") : portfolioClass2?.join(" ")}
          >
            <div
              className="portfolioContent"
              onClick={() => {
                selectItem(portfolio?.symbol);
              }}
            >
              <div className="info">
                <div className="logo">
                  <Image
                    width={25}
                    height={25}
                    src={
                      !portfolio?.symbol
                        ? "../assets/images/apple.svg"
                        : `https://storage.googleapis.com/iexcloud-hl37opg/api/logos/${portfolio?.symbol}.png`
                    }
                    alt={portfolio?.symbol}
                  />
                </div>
                <div className="details">
                  <strong>{portfolio?.symbol}</strong>
                  <span>({portfolio?.description})</span>
                </div>
              </div>
              <div className="price">
                <strong>$ {addCommasToNumber(portfolio?.last?.toFixed(2) || 0)}</strong>
                <span className={portfolio?.change_percentage >= 0 ? "up" : "down"}>
                  {customToFixed(portfolio?.change_percentage) || 0}%
                </span>
              </div>
            </div>
            <div className="chart">
              {portfolio?.prevclose && (portfolio?.close || portfolio?.last) && (
                <HighchartsReact highcharts={Highcharts} options={{ ...option, ...series }} />
              )}
            </div>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};

export default PortfolioSwiper;
