import ApexCharts from "apexcharts";
import { useState } from "react";
import ReactApexChart from "react-apexcharts";
import styles from "@/styles/trade.module.scss";
import "@/styles/globals.scss";
import { Button, ButtonGroup, Spinner } from "react-bootstrap";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxCommon";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import {
  fetchTradeDataofGraph,
  tradingGraphData,
  loadingGraphData,
  statusNumberGraphData,
} from "@/redux/slices/tradeGraphSlice";
import { LastMonthEndDate, LastMonthStartDate, firstday, lastday, todayDate, yesterdayDate } from "@/utils/dates";
import { useSelector } from "react-redux";

const Tradechart = () => {
  const dispatch = useAppDispatch();
  const tradingGraph: any = useAppSelector(tradingGraphData);

  const searchParams = useSearchParams();
  const loading = useSelector(loadingGraphData);
  const search: string | null = searchParams.get(`q`);
  const startDate: any = searchParams.get(`start`);
  const endDate: any = searchParams.get(`end`);
  const [seriesData, setSeriesData] = useState<any>([]);
  const router = useRouter();
  const pathname = usePathname();
  const [selection, setSelection] = useState("");

  // useEffect(() => {
  //   dispatch(fetchCloseMarketData());
  // }, []);
  useEffect(() => {
    if (tradingGraph?.[0]?.length > 0) {
      let arr: any = [];
      let finalArr = [];
      tradingGraph?.[0]?.map((itm: any, idx: number) => {
        const trimNumber = itm.price;
        const str_a = trimNumber.toString();
        const finalPrice = Number(str_a).toFixed(3);
        arr.push([itm.time, finalPrice]);
      });

      finalArr.push({
        data: [...arr],
      });

      setSeriesData([...finalArr]);
    } else {
      setSeriesData([]);
    }
  }, [tradingGraph]);

  const diff = new Date(endDate).getTime() - new Date(startDate).getTime();
  const daydiff = diff / (1000 * 60 * 60 * 24);
  useEffect(() => {
    let currSelection = selection;
    switch (daydiff) {
      case 0:
      case 1:
        currSelection = "one_day";
        break;
      case 6:
        currSelection = "one_week";
        break;
      default:
        currSelection = "one_month";
    }
    if (search) {
      setSelection(currSelection);
      dispatch(
        fetchTradeDataofGraph({
          searchKey: search,
          start: startDate,
          end: endDate,
        })
      );
    }
  }, [search, daydiff, dispatch, endDate, selection, startDate]);

  const options: any = {
    chart: {
      id: "area-datetime",
      type: "area",
      height: 500,
    },
    markers: {
      size: 0,
    },
    stroke: {
      show: true,
      curve: "smooth",
      width: 1,
      colors: ["#38AD4B", "#AADFB3", "#FFFFFF"],
    },
    dataLabels: {
      enabled: false,
    },
    grid: {
      yaxis: {
        lines: {
          show: true,
        },
      },
      xaxis: {
        lines: {
          show: true,
        },
      },
    },
    xaxis: {
      type: "datetime",
      //   categories: [1, 2, 3, 4],
      labels: {
        show: true,
        maxWidth: 10,
        rotateAlways: false,
        // formatter: function fomatDate(value: any) {
        //   const date = new Date(value);
        //   const day = date.getDate();
        //   const month = date.toLocaleString("default", { month: "short" });
        //   const year = date.getFullYear().toString().slice(-2);
        //   const formattedDate = `${day} ${month}`;
        //   return formattedDate;
        // },
      },
    },

    yaxis: {
      opposite: true,
    },

    tooltip: {
      enabled: true,
      shared: false,
      custom: function ({ series, seriesIndex, dataPointIndex, w }: any) {
        const xValue = w.globals.seriesX[seriesIndex][dataPointIndex];
        const date = new Date(xValue).toLocaleDateString("en-US");
        const yValue = series[seriesIndex][dataPointIndex];
        // Custom tooltip function
        const tooltipContent = `<div class="custom-tooltip">${yValue} ${date}</div>`;
        return tooltipContent;
      },
    },
    fill: {
      type: "gradient",
      colors: ["#38AD4B", "#AADFB3", "#FFFFFF"],
      borderColor: "#38AD4B",
      gradient: {
        color: "#38AD4B",
        background: "#38AD4B",
        shadeIntensity: 0.8,
        opacityFrom: 0.7,
        opacityTo: 0.9,
      },
    },
    noData: {
      text: "No data found",
    },
  };

  function updateData(timeline: string, e: any) {
    e.preventDefault();
    setSelection(timeline);
    let start: string = "";
    let end: string = "";
    switch (timeline) {
      case "one_day":
        start = yesterdayDate;
        end = todayDate;
        break;
      case "one_week":
        start = firstday;
        end = lastday;
        break;
      case "one_month":
        start = LastMonthStartDate;
        end = LastMonthEndDate;
        break;
      default:
        start = yesterdayDate;
        end = todayDate;
    }
    ApexCharts.exec("area-datetime", "zoomX", new Date(start).getTime(), new Date(end).getTime());
    dispatch(fetchTradeDataofGraph({ searchKey: search, start, end }));
    router.push(`${pathname}?q=${search}&start=${start}&end=${end}`);
  }

  return (
    <>
      <div id="chart">
        <div className="toolbar filterBtns">
          <ButtonGroup>
            <Button
              variant="link"
              id="one_day"
              onClick={(e) => updateData("one_day", e)}
              className={selection === "one_day" ? "btn-primary" : ""}
            >
              1D
            </Button>
            <Button
              variant="link"
              id="one_week"
              onClick={(e) => updateData("one_week", e)}
              className={selection === "one_week" ? "btn-primary" : ""}
            >
              1W
            </Button>
            <Button
              variant="link"
              id="one_month"
              onClick={(e) => updateData("one_month", e)}
              className={selection === "one_month" ? "btn-primary" : ""}
            >
              1M
            </Button>
          </ButtonGroup>
        </div>

        <div id={styles.apexChart}></div>
        <div id="chart-timeline">
          {loading ? (
            <div className="loader-container">
              <Spinner animation="border" />
            </div>
          ) : (
            <ReactApexChart options={{ ...options, selection }} series={seriesData} type="area" height={350} />
          )}
        </div>
      </div>
    </>
  );
};

export default Tradechart;
