"use client";
import styles from "@/styles/chains.module.scss";
import Table from "react-bootstrap/Table";
import Dropdown from "react-bootstrap/Dropdown";
import { useEffect, useState, useRef, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useAppDispatch } from "@/hooks/reduxCommon";
import { buyOrSellSelected, addToBuyToOpenCloseClear, fetchChainDetails } from "@/redux/slices/chainsDetailsSlice";
import { useSelector } from "react-redux";
import Alert from "react-bootstrap/Alert";
import { addCommasToNumber, addCommasFixedTwoToNumber } from "@/utils/prize";

const ChainTable = ({ stockValue, filteredRows, widthofStrike }) => {
  // const data = useSelector((state: any) => state.chainsDetails.data);
  const data = filteredRows;
  const selectedOptions = useSelector((state: any) => state.chainsDetails.selectedOptions);

  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const search: string | null = searchParams.get("q");
  const expiration: string | null = searchParams.get("expiration");
  const [selectOptionCount, setselectOptionCount] = useState(0);
  const [show, setShow] = useState(false);
  const callListRef = useRef(null);
  const putListRef = useRef(null);
  const [hasScrolled, setHasScrolled] = useState(false); // Add a state variable

  useEffect(() => {
    const fetchChainData = () => {
      dispatch(fetchChainDetails({ search, expiration }));
      filterData();
    };
    fetchChainData();
    const intervalId = setInterval(fetchChainData, 2000);

    return () => {
      clearInterval(intervalId);
    };
  }, [dispatch, expiration, search]);

  useEffect(() => {
    setHasScrolled(false);
  }, [expiration, widthofStrike]);

  const filterData = () => {
    const put = data
      ?.filter((el: any) => el?.option_type == "put")
      ?.map((el: any) => {
        return el;
      });
  };

  const triggerSelected = (item: object, key: string, customid: number, value: string) => {
    if (selectedOptions.length < 4) {
      dispatch(buyOrSellSelected({ item, key, customid, value }));
    }
  };

  const handleClearAll = (key: string, item: object) => {
    dispatch(addToBuyToOpenCloseClear({ data, key, item }));
  };

  const closestStrike = useMemo(() => {
    const strikeValues = data?.filter((el) => el.option_type === "call")?.map((el) => parseFloat(el.strike));

    return strikeValues?.reduce(
      (closestStrike, strike) =>
        Math.abs(strike - stockValue) < Math.abs(closestStrike - stockValue) ? strike : closestStrike,
      strikeValues[0]
    );
  }, [data, stockValue]);

  // Function to scroll to a specific strike value
  const scrollToStrike = (stockValue, ref) => {
    if (!ref.current || !data?.length || hasScrolled) return; // Check the flag

    // Scroll to the nearest strike value
    const strikeElements = ref.current.getElementsByTagName("td");
    for (let i = 0; i < strikeElements?.length; i++) {
      const td = strikeElements[i];
      const strike = parseFloat(td.textContent || "0.00");
      if (strike === closestStrike) {
        const nearestRow = td.closest("tr");
        if (nearestRow) {
          nearestRow.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "center",
          });
          break; // Stop searching once the nearest strike is found
        }
      }
    }
    // Set the flag to prevent further scrolling
    setHasScrolled(true);
  };

  useEffect(() => {
    if (data?.length > 0) {
      const desiredStrikeValue = stockValue;
      scrollToStrike(desiredStrikeValue, callListRef);
    }
  }, [data, stockValue]);

  const selectedOptionObj = useMemo(() => {
    type AnyObject = {
      [key: string]: any;
    };
    let selectedObj: AnyObject = {};
    selectedOptions?.map((s) => {
      selectedObj[s.symbol] = {};
      selectedObj[s.symbol] = {
        ["put_buy"]: s.put_buy,
        ["put_sell"]: s.put_sell,
        ["call_buy"]: s.call_buy,
        ["call_sell"]: s.call_sell,
      };
    });
    return selectedObj;
  }, [selectedOptions]);

  return (
    <section className={styles.ChainTable}>
      {selectOptionCount == 4 && (
        <Alert key="success" variant="success" className={styles.sucessmsg} onClose={() => setShow(false)} dismissible>
          You can not select more then 4
        </Alert>
      )}
      <div className={styles.tableheader}>
        <div>Calls</div>
        <div>Puts</div>
      </div>

      <div style={{ display: "flex" }}>
        <Table ref={callListRef} className={styles.callsTable}>
          <thead>
            <tr>
              <th className={styles.primary}>Change</th>
              <th className={styles.primary}>Delta</th>
              <th className={styles.primary}>IV</th>
              <th className={styles.primary}>Vol</th>
              <th className={styles.primary}>
                Open <br /> Interest
              </th>

              <th className={styles.primary}>Mid</th>
              <th className={styles.primary}>Bid</th>
              <th className={styles.primary}>Ask</th>

              <th className={styles.dark}>Buy</th>
              <th className={styles.dark}>Sell</th>
              <th className={styles.grey}>
                <span>Strike</span>
              </th>
            </tr>
          </thead>
          {data
            ?.filter((el: any, index: any) => el?.option_type == "call")
            .map((el: any, index: any) => (
              <tbody className="chainTable" key={el?.symbol}>
                <tr className={el.strike <= closestStrike ? styles.chainStrikeTr : ""}>
                  <td>{addCommasFixedTwoToNumber(el?.change) || "0.00"}</td>
                  <td>{addCommasToNumber(el?.greeks?.delta.toFixed(3)) || "0.000"}</td>
                  {/* <td>{el.last_volume.toFixed(3) || '0.000'}</td> */}
                  <td>{addCommasToNumber(el?.greeks?.smv_vol.toFixed(3)) || "0.000"}</td>
                  <td>
                    {el?.volume
                      ? el.volume < 1000
                        ? addCommasToNumber(el.volume)
                        : `${addCommasToNumber(Math.round(el.volume / 1000))}k`
                      : 0}
                  </td>
                  <td>{addCommasToNumber(el?.open_interest) || 0}</td>
                  <td>{addCommasFixedTwoToNumber((el?.bid + el?.ask) / 2) || "0.00"}</td>
                  <td>{addCommasFixedTwoToNumber(el?.bid) || "0.00"}</td>
                  <td>{addCommasFixedTwoToNumber(el?.ask) || "0.00"}</td>
                  <td>
                    <Dropdown>
                      <Dropdown.Toggle
                        variant={
                          selectedOptionObj[el.symbol]?.call_buy == "call-buyToOpen"
                            ? "primary"
                            : selectedOptionObj[el.symbol]?.call_buy == "call-buyToClose"
                            ? "danger"
                            : "outline-primary"
                        }
                        id="dropdown-basic"
                      >
                        B
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        <Dropdown.Item
                          href="#/action-1"
                          onClick={() => triggerSelected(el, "call_buy", el?.customid, "call-buyToOpen")}
                        >
                          Buy to open{" "}
                        </Dropdown.Item>
                        <Dropdown.Item
                          href="#/action-2"
                          onClick={() => triggerSelected(el, "call_buy", el?.customid, "call-buyToClose")}
                        >
                          Buy to close
                        </Dropdown.Item>
                        <Dropdown.Item href="#/action-3" onClick={() => handleClearAll("call_buy", el)}>
                          Clear
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>
                  <td>
                    <Dropdown>
                      <Dropdown.Toggle
                        variant={
                          selectedOptionObj[el.symbol]?.call_sell == "call-sellToOpen"
                            ? "primary"
                            : selectedOptionObj[el.symbol]?.call_sell == "call-sellToClose"
                            ? "danger"
                            : "outline-primary"
                        }
                        id="dropdown-basic"
                      >
                        S
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        <Dropdown.Item
                          href="#/action-1"
                          onClick={() => triggerSelected(el, "call_sell", el?.customid, "call-sellToOpen")}
                        >
                          Sell to open
                        </Dropdown.Item>
                        <Dropdown.Item
                          href="#/action-2"
                          onClick={() => triggerSelected(el, "call_sell", el?.customid, "call-sellToClose")}
                        >
                          Sell to close
                        </Dropdown.Item>
                        <Dropdown.Item href="#/action-3" onClick={() => handleClearAll("call_sell", el)}>
                          Clear
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>
                  <td className={styles.chainStrikeValueTr}>{el?.strike || 0}</td>
                </tr>
              </tbody>
            ))}
        </Table>

        <Table ref={putListRef} className={styles.putsTable}>
          <thead>
            <tr>
              <th className={styles.dark}>Sell</th>
              <th className={styles.dark}>Buy</th>
              <th className={styles.primary}>Ask</th>
              <th className={styles.primary}>Bid</th>

              <th className={styles.primary}>Mid</th>
              <th className={styles.primary}>
                Open <br /> Interest
              </th>
              <th className={styles.primary}>Vol</th>
              <th className={styles.primary}>IV</th>
              <th className={styles.primary}>Delta</th>

              <th className={styles.primary}>Change</th>
            </tr>
          </thead>
          {data
            ?.filter((el: any, index: any) => el.option_type == "put")
            .map((el: any, index: any) => (
              <tbody className="chainTable" key={el?.symbol}>
                <tr className={el.strike > closestStrike ? styles.chainStrikeTr : ""}>
                  <td>
                    <Dropdown>
                      <Dropdown.Toggle
                        variant={
                          selectedOptionObj[el.symbol]?.put_sell == "put-sellToOpen"
                            ? "primary"
                            : selectedOptionObj[el.symbol]?.put_sell == "put-sellToClose"
                            ? "danger"
                            : "outline-primary"
                        }
                        id="dropdown-basic"
                      >
                        S
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        <Dropdown.Item
                          href="#/action-1"
                          onClick={() => triggerSelected(el, "put_sell", el?.customid, "put-sellToOpen")}
                        >
                          Sell to open{" "}
                        </Dropdown.Item>
                        <Dropdown.Item
                          href="#/action-2"
                          onClick={() => triggerSelected(el, "put_sell", el?.customid, "put-sellToClose")}
                        >
                          Sell to close
                        </Dropdown.Item>
                        <Dropdown.Item href="#/action-3" onClick={() => handleClearAll("put_sell", el)}>
                          Clear
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>
                  <td>
                    <Dropdown>
                      <Dropdown.Toggle
                        variant={
                          selectedOptionObj[el.symbol]?.put_buy == "put-buyToOpen"
                            ? "primary"
                            : selectedOptionObj[el.symbol]?.put_buy == "put-buyToClose"
                            ? "danger"
                            : "outline-primary"
                        }
                        id="dropdown-basic"
                      >
                        B
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        <Dropdown.Item
                          href="#/action-1"
                          onClick={() => triggerSelected(el, "put_buy", el?.customid, "put-buyToOpen")}
                        >
                          Buy to open
                        </Dropdown.Item>
                        <Dropdown.Item
                          href="#/action-2"
                          onClick={() => triggerSelected(el, "put_buy", el?.customid, "put-buyToClose")}
                        >
                          Buy to close
                        </Dropdown.Item>
                        <Dropdown.Item href="#/action-3" onClick={() => handleClearAll("put_buy", el)}>
                          Clear
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>
                  <td>{addCommasFixedTwoToNumber(el?.ask) || "0.00"}</td>
                  <td>{addCommasFixedTwoToNumber(el?.bid) || "0.00"}</td>

                  <td>{addCommasFixedTwoToNumber((el?.bid + el?.ask) / 2) || "0.00"}</td>

                  <td>{addCommasToNumber(el.open_interest) || 0}</td>
                  <td>
                    {el?.volume
                      ? el.volume < 1000
                        ? addCommasToNumber(el.volume)
                        : `${addCommasToNumber(Math.round(el.volume / 1000))}k`
                      : 0}
                  </td>
                  {/* <td>{el.last_volume.toFixed(3) || '0.000'}</td> */}
                  <td>{addCommasToNumber(el.greeks?.smv_vol.toFixed(3)) || "0.000"}</td>
                  <td>{addCommasToNumber(el.greeks?.delta.toFixed(3)) || "0.000"}</td>
                  <td>{addCommasFixedTwoToNumber(el?.change) || "0.00"}</td>
                </tr>
              </tbody>
            ))}
        </Table>
      </div>
    </section>
  );
};

export default ChainTable;
