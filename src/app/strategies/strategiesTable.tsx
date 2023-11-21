"use client";
import styles from "@/styles/strategies.module.scss";
import { useAppSelector } from "@/hooks/reduxCommon";
import { useEffect, useMemo, useState } from "react";
import Table from "react-bootstrap/Table";
import Loader from "@/components/loader";
import { LegType, DirectionType } from "@/utils/legs";
import { addCommasToNumber } from "@/utils/prize";

interface TargetComponentProps {
  getYaxisData: any;
  getExpiryDate: Date;
  spreadTableForProfitLoss: string[][];
}

const StrategiesTable: React.FC<TargetComponentProps> = ({ getYaxisData, getExpiryDate, spreadTableForProfitLoss }) => {
  const [data, setData] = useState<any>([]);
  const tableData: any = useAppSelector((state) => state.strategies.data);
  const loading = useAppSelector((state) => state.strategies.loading);
  const allStrategies: any = useAppSelector((state) => state.allStrategies.strategies);

  const listedDated = useMemo(() => {
    const date1: any = new Date();
    const date2: any = new Date(getExpiryDate);
    const expirationDateUTC: any = new Date(
      date2.getUTCFullYear(),
      date2.getUTCMonth(),
      date2.getUTCDate(),
      date2.getUTCHours(),
      date2.getUTCMinutes(),
      date2.getUTCSeconds()
    );
    const diff = (expirationDateUTC - date1) / 864e5;
    const dateFormat: any = { weekday: "long", month: "short", day: "numeric" };

    const dates = Array.from({ length: diff + 2 }, (_, i) => {
      const date = new Date(date1.getTime() + i * 24 * 60 * 60 * 1000);
      const [weekdayStr, dateStr] = date.toLocaleDateString("en-US", dateFormat).split(", ");
      return `${dateStr} `;
    });
    return dates;
  }, [getExpiryDate]);

  useEffect(() => {
    if (getYaxisData) {
      setData(getYaxisData.map((data) => ({ data })));
    }
  }, [getYaxisData]);

  const columns = [{ id: "1", name: "Log ID", dataKey: "data", width: "15%" }];
  const entryCost = useMemo(() => {
    let cost = 0;
    allStrategies?.legs?.forEach((leg) => {
      if (leg.type !== LegType.Stock) {
        cost += leg.purchasePrice * leg.size * 100 * leg.direction;
      }
    });
    return cost;
  }, [allStrategies]);
  function getColorForShortPut(value, optionValue) {
    const roundedValue = value > 0 ? Math.floor(value) : Math.ceil(value);
    const nearestKey = roundedValue - (roundedValue % (value > -50 ? 5 : 50));

    if (!(nearestKey < -49 || nearestKey > 0)) {
      return "white";
    }

    if (nearestKey < -1000) {
      return "rgb(255, 12, 12)";
    }
    const colorMap = {
      "-1000": "rgb(255, 12, 12)",
      "-950": "rgb(255, 24, 24)",
      "-900": "rgb(255, 36, 36)",
      "-850": "rgb(255, 48, 48)",
      "-800": "rgb(255, 61, 61)",
      "-750": "rgb(255, 73, 73)",
      "-700": "rgb(255, 85, 85)",
      "-650": "rgb(255, 97, 97)",
      "-600": "rgb(255, 109, 109)",
      "-550": "rgb(255, 122, 122)",
      "-500": "rgb(255, 134, 134)",
      "-450": "rgb(255, 146, 146)",
      "-400": "rgb(255, 158, 158)",
      "-350": "rgb(255, 182, 182)",
      "-300": "rgb(255, 194, 194)",
      "-250": "rgb(255, 207, 207)",
      "-200": "rgb(255, 218, 218)",
      "-150": "rgb(255, 224, 224)",
      "-100": "rgb(255, 229, 229)",
      "-50": "rgb(255, 231, 231)",
      "5": "rgb(223, 255, 218)",
      "10": "rgb(211, 255, 194)",
      "15": "rgb(199, 255, 170)",
      "20": "rgb(186, 255, 146)",
      "25": "rgb(174, 255, 122)",
      "30": "rgb(162, 255, 97)",
      "35": "rgb(150, 255, 73)",
      "40": "rgb(138, 255, 48)",
      "45": "rgb(126, 255, 24)",
      "50": "rgb(114, 255, 0)",
      "55": "rgb(117, 255, 0)",
      "60": "rgb(101, 255, 0)",
      "65": "rgb(84, 255, 0)",
      "70": "rgb(70, 255, 0)",
      "75": "rgb(56, 255, 0)",
      "80": "rgb(42, 255, 0)",
      "85": "rgb(28, 255, 0)",
      "90": "rgb(14, 255, 0)",
      "95": "rgb(7, 255, 0)",
      "100": "rgb(0, 255, 0)",
    };

    return colorMap[nearestKey] || "white";
  }

  function getColorForShort(value, optionValue, leg) {
    if (!isNaN(value) && isFinite(value)) {
      if (leg.type !== LegType.Call) {
        return getColorForShortPut(value, optionValue);
      }

      let roundedValue = value > 0 ? Math.floor(value) : Math.ceil(value);
      let nearestKey = roundedValue - (roundedValue % (value > -50 ? 5 : 50));

      if (nearestKey > -550) {
        const colorMap = {
          "-550": "rgb(255, 12, 12)",
          "-500": "rgb(255, 24, 24)",
          "-450": "rgb(255, 36, 36)",
          "-400": "rgb(255, 48, 48)",
          "-350": "rgb(255, 61, 61)",
          "-300": "rgb(255, 73, 73)",
          "-250": "rgb(255, 85, 85)",
          "-200": "rgb(255, 97, 97)",
          "-150": "rgb(255, 109, 109)",
          "-100": "rgb(255, 122, 122)",
          "-50": "rgb(255, 134, 134)",
          "-45": "rgb(255, 146, 146)",
          "-40": "rgb(255, 158, 158)",
          "-35": "rgb(255, 182, 182)",
          "-30": "rgb(255, 194, 194)",
          "-25": "rgb(255, 207, 207)",
          "-20": "rgb(255, 218, 218)",
          "-15": "rgb(255, 224, 224)",
          "-10": "rgb(255, 229, 229)",
          "-5": "rgb(255, 231, 231)",
          "0": "white",
          "5": "rgb(223, 255, 218)",
          "10": "rgb(217, 255, 207)",
          "15": "rgb(211, 255, 194)",
          "20": "rgb(205, 255, 182)",
          "25": "rgb(199, 255, 170)",
          "30": "rgb(192, 255, 158)",
          "35": "rgb(186, 255, 146)",
          "40": "rgb(180, 255, 134)",
          "45": "rgb(174, 255, 122)",
          "50": "rgb(168, 255, 109)",
          "55": "rgb(162, 255, 97)",
          "60": "rgb(156, 255, 85)",
          "65": "rgb(150, 255, 73)",
          "70": "rgb(144, 255, 61)",
          "75": "rgb(138, 255, 48)",
          "80": "rgb(132, 255, 36)",
          "85": "rgb(126, 255, 24)",
          "90": "rgb(120, 255, 12)",
          "95": "rgb(114, 255, 0)",
          "100": "rgb(117, 255, 0)",
        };

        return colorMap[nearestKey] || "white";
      }
    }

    return "red";
  }

  function getBackgroundColor(percentage, optionValue, legs) {
    let value = parseFloat(percentage.toFixed(2));

    if (!(legs?.length > 1 || (legs[0] && legs[0].direction === DirectionType.Buy))) {
      return getColorForShort(value, optionValue, legs[0]);
    }

    if (isNaN(percentage) && isFinite(percentage)) {
      return "rgb(255, 0, 0)";
    }
    if (!(optionValue !== 0.0 || legs?.length > 1)) {
      return "rgb(137, 0, 0)";
    }

    if (percentage < -100) {
      return "rgb(137, 0, 0)";
    }
    let roundedValue = value > 0 ? Math.floor(value) : Math.ceil(value);
    let nearestKey = roundedValue - (roundedValue % 5);
    const colorMap = {
      "-100": "rgb(137, 0, 0)",
      "-95": "rgb(255, 0, 0)",
      "-90": "rgb(255, 12, 12)",
      "-85": "rgb(255, 24, 24)",
      "-80": "rgb(255, 36, 36)",
      "-75": "rgb(255, 48, 48)",
      "-70": "rgb(255, 61, 61)",
      "-65": "rgb(255, 73, 73)",
      "-60": "rgb(255, 85, 85)",
      "-55": "rgb(255, 97, 97)",
      "-50": "rgb(255, 109, 109)",
      "-45": "rgb(255, 122, 122)",
      "-40": "rgb(255, 134, 134)",
      "-35": "rgb(255, 146, 146)",
      "-30": "rgb(255, 158, 158)",
      "-25": "rgb(255, 182, 182)",
      "-20": "rgb(255, 182, 182)",
      "-15": "rgb(255, 194, 194)",
      "-10": "rgb(255, 207, 207)",
      "-5": "rgb(255, 218, 218)",
      "0": value > 0 ? "rgb(229, 255, 231)" : "rgb(255, 231, 231)",
      "5": "rgb(223, 255, 218)",
      "10": "rgb(217, 255, 207)",
      "15": "rgb(211, 255, 194)",
      "20": "rgb(205, 255, 182)",
      "25": "rgb(199, 255, 170)",
      "30": "rgb(192, 255, 158)",
      "35": "rgb(186, 255, 146)",
      "40": "rgb(180, 255, 134)",
      "45": "rgb(174, 255, 122)",
      "50": "rgb(168, 255, 109)",
      "55": "rgb(162, 255, 97)",
      "60": "rgb(156, 255, 85)",
      "65": "rgb(150, 255, 73)",
      "70": "rgb(144, 255, 61)",
      "75": "rgb(138, 255, 48)",
      "80": "rgb(132, 255, 36)",
      "85": "rgb(126, 255, 24)",
      "90": "rgb(120, 255, 12)",
      "95": "rgb(117, 255, 0)",
      "100": value > 100 ? "rgb(114, 255, 0) " : "rgb(117, 255, 0)",
      "105": "rgb(107, 255, 0)",
      "110": "rgb(101, 255, 0)",
      "115": "rgb(95, 255, 0)",
      "120": "rgb(84, 255, 0)",
      "125": "rgb(77, 255, 0)",
      "130": "rgb(70, 255, 0)",
      "135": "rgb(63, 255, 0)",
      "140": "rgb(56, 255, 0)",
      "145": "rgb(49, 255, 0)",
      "150": "rgb(42, 255, 0)",
      "155": "rgb(35, 255, 0)",
      "160": "rgb(28, 255, 0)",
      "165": "rgb(21, 255, 0)",
      "170": "rgb(14, 255, 0)",
      "175": "rgb(7, 255, 0)",
      "180": "rgb(0, 255, 0)",
      "185": "rgb(0, 245, 0)",
      "190": "rgb(0, 235, 0)",
      "195": "rgb(0, 225, 0)",
      "200": "rgb(0, 225, 0)",
    };

    return colorMap[nearestKey] || "rgb(0, 225, 0)";
  }

  const fetchPercentage = (optionValue) => {
    const percentage = ((optionValue * 100 - entryCost) / Math.abs(entryCost)) * 100;
    return getBackgroundColor(percentage, +optionValue, allStrategies?.legs || []);
  };
  const percentage = (optionValue) => {
    const percentage = ((optionValue * 100 - entryCost) / Math.abs(entryCost)) * 100;
    return percentage;
  };

  return (
    <>
      {loading ? (
        <div className="loader-container">
          <Loader />
        </div>
      ) : (
        <Table responsive className={styles.TableContainer}>
          <thead className={styles.header}>
            <tr>
              {columns.map(({ dataKey, id, name, width }) => (
                <th key={id} align="left">
                  {name}
                </th>
              ))}
              {listedDated?.map((item: any) => <th key={item}>{item ? item : "Loading..."}</th>)}
            </tr>
          </thead>

          <tbody>
            {data?.map((log, index) => (
              <tr key={index}>
                {columns.map(({ id, dataKey, width }) => (
                  <td key={`${id}-${log[dataKey]}`} title={log[dataKey]}>
                    {log[dataKey]}
                  </td>
                ))}
                {tableData[index] && typeof tableData[index] === "object"
                  ? Object.keys(tableData?.[index] || {}).map((key) => (
                      <td
                        key={key}
                        style={{
                          background: fetchPercentage(spreadTableForProfitLoss?.[index]?.[key]),
                        }}
                      >
                        <span>
                          {tableData[index][key] !== undefined ? addCommasToNumber(tableData[index][key]) : ""}
                        </span>
                      </td>
                    ))
                  : null}
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default StrategiesTable;
