"use client";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxCommon";
import { fetchOptionStrategySelection, optionSelectionStatusCheck } from "@/redux/slices/optionStrategySlice";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import SpreadSheetViewModel from "@/utils/SpreadSheetCalculation";
import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import Loader from "../loader";
import { formatedDate } from "@/utils/dates";
interface TargetComponentProps {
  getExpiryDate: Date;
  data1: any;
  filterType: number;
  rangeValue: number;
  volatilityValue: number;
  updatedRange: number;
  Breakeven: string;
}

const StratergiesChart: React.FC<TargetComponentProps> = ({
  getExpiryDate,
  data1,
  filterType,
  rangeValue,
  volatilityValue,
  updatedRange,
  Breakeven,
}) => {
  const breakEvenLines = useMemo(() => {
    const split = Breakeven?.split(",");
    const breakEven = split?.map((el) => ({
      color: "#1b9fdf",
      width: 2,
      value: el?.replace("$", ""),
      zIndex: 4,
      label: {
        text: `$ ${el}`,
        align: "center",
        verticalAlign: "top", // Center-align the label
        style: {
          color: "#1b9fdf", // Label text color
          fontWeight: "bold",
        },
        y: 25,
      },
    }));

    return Array.isArray(breakEven) ? breakEven : [];
  }, [Breakeven]);
  const dispatch = useAppDispatch();
  const allStrategies: any = useAppSelector((state) => state.allStrategies?.strategies);
  const searchParams = useSearchParams();
  const search: string | null = searchParams.get("q");

  useEffect(() => {
    if (search) {
      dispatch(fetchOptionStrategySelection(search));
    }
  }, [search, dispatch]);

  const spredTable = new SpreadSheetViewModel(allStrategies, filterType);
  let dateToCheck;
  let formatedExpirationDate;
  if (allStrategies) {
    const getExpirationDates = allStrategies?.legs?.map((item) => {
      return new Date(item?.expiration);
    });

    if (getExpirationDates && getExpirationDates.length > 0) {
      const leastExpirationDate = new Date(Math.min(...getExpirationDates));

      formatedExpirationDate = formatedDate(leastExpirationDate);
    }
  }
  if (formatedExpirationDate) {
    dateToCheck = new Date(formatedExpirationDate);
  }
  let expirationDateUTC;
  if (dateToCheck) {
    expirationDateUTC = new Date(
      dateToCheck.getUTCFullYear(),
      dateToCheck.getUTCMonth(),
      dateToCheck.getUTCDate(),
      dateToCheck.getUTCHours(),
      dateToCheck.getUTCMinutes(),
      dateToCheck.getUTCSeconds()
    );
    expirationDateUTC.setHours(16, 0, 0, 0);
  }
  spredTable.setChartRange(rangeValue);
  const getGraphData = spredTable.getDataForSelectedDate(expirationDateUTC);
  const transformedArray = Object.entries(getGraphData).map(([x, y]) => ({
    x: Number(x),
    y,
  }));
  const sortedData = transformedArray.sort((a, b) => a.x - b.x);

  const addDollorToValues = (value: string) => {
    const absValue = Math.abs(parseInt(value));
    const valueWithDollor = parseInt(value) < 0 ? "-$" + absValue : "$" + absValue;
    return valueWithDollor;
  };

  const optionsHC = {
    chart: {
      animation: false,
      type: "area",
      height: window.innerWidth < 767 ? "400px" : `${(9 / 24) * 100}%`,
    },
    title: {
      text: "",
    },
    plotOptions: {
      area: {
        lineWidth: 0,
      },
    },

    series: [
      {
        name: "Stocks",
        type: "area",
        height: 100,
        data: sortedData,
        marker: {
          symbol: "circle", // You can use various symbols like 'circle', 'square', 'diamond', etc.
          radius: 0, // Customize the marker size
        },
        pointStart: Date.UTC(2023, 0),
        pointInterval: 30 * 24 * 36e5,
        color: {
          linearGradient: {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 1,
          },
          stops: [
            [0, "#0b9321"], // Replace with your custom color
            [1, Highcharts.color("#0b9321").setOpacity(0.5).get("rgba")],
            [2, Highcharts.color("#0b9321").setOpacity(0).get("rgba")],
          ],
        },
        negativeColor: {
          linearGradient: {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 1,
          },
          stops: [
            [0, "#d93f3f"], // Replace with your custom color
            [1, Highcharts.color("#d93f3f").setOpacity(0.5).get("rgba")],
            [2, Highcharts.color("#d93f3f").setOpacity(0).get("rgba")],
          ],
        },
      },
    ],
    xAxis: {
      labels: {
        formatter: function () {
          return addDollorToValues(this.value);
        },
      },
      crosshair: {
        // Hover added lines
        width: 1,
        color: "#a4a1a1",
        dashStyle: "longdash",
      },
      plotLines: [
        // Default at 0 added Horizontal line
        {
          color: "#999999",
          width: 2,
          value: data1?.currentPrice || 0,
          zIndex: 4,
          dashStyle: "dot",
        },
        ...breakEvenLines,
      ],
    },
    yAxis: {
      title: {
        text: "Profit/Loss", // Set the title for the y-axis here
      },
      labels: {
        formatter: function () {
          return addDollorToValues(this.value);
        },
      },
      lineColor: "#000000", // Y axis line color
      lineWidth: 1, // Y axis line size
      minorGridLineWidth: 0, // Remove line from Canvas for Y axis lines
      minorTickInterval: "auto", //
      minorTickLength: 5, // length of tick size
      minorTickWidth: 1, // Height of tick size
      crosshair: {
        // Hover added lines
        width: 1,
        color: "#a4a1a1",
        dashStyle: "longdash",
      },
      tickAmount: 12, //Set Number of rows
      plotLines: [
        // Default at 0 added Horizontal line
        {
          color: "#999999",
          width: 2,
          value: 0,
          zIndex: 4,
        },
      ],
    },
    tooltip: {
      useHTML: true,
      // padding: 5,
      // margin: 20,
      formatter: function () {
        const tooltipContent = `
          <div class="custom-tooltip">
            <span class="custom-tooltipY">P&L ${addDollorToValues(this.y.toFixed(1))}</span>
            <span  class="stockPrice">UL Stock ${addDollorToValues(this.x)}</span>
          </div>
      `;
        return tooltipContent;
      },
    },
  };

  return (
    <>
      <div id="chart-timeline">
        <HighchartsReact highcharts={Highcharts} options={optionsHC} />
      </div>
    </>
  );
};
export default StratergiesChart;
