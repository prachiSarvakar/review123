"use clients";
import Image from "next/image";
import { Offcanvas, Tabs, Tab, Spinner } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import styles from "@/styles/strategies.module.scss";
import Up from "@/assets/images/up.svg";
import Down from "@/assets/images/down.svg";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxCommon";
import { fetchPlaceOrder, loadingOrderData } from "@/redux/slices/placeOrderSlice";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { profileData } from "@/redux/slices/profileSlice";
import { balancesData, statusCheck } from "@/redux/slices/balanceSlice";
import { addCommasFixedTwoToNumber, addCommasToNumber } from "@/utils/prize";
import { addDollarSignCommasToNumber, customToFixed } from "@/utils/positions";

enum ActiveTabType {
  buy = "buy",
  sell = "sell",
  edit = "edit",
}

const BuySell = ({
  tradeDataMap,
  selectedStockOrder,
  handleClose,
  handleSubmit,
}: {
  tradeDataMap: any[];
  selectedStockOrder: any;
  handleClose: () => void;
  handleSubmit?: (orderData: any) => void; // Make handleSubmit optional with '?'
}) => {
  const [activeTabKey, setActiveTabKey] = useState<string>(selectedStockOrder);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const loading = useAppSelector(loadingOrderData);

  const profile: any = useAppSelector(profileData);
  const accounts = profile?.profile?.account;
  const balancesObj: any = useAppSelector(balancesData);
  const statusNum: any = useAppSelector(statusCheck);

  const optionsDataForBuy = [
    { value: "buy", label: "Buy" },
    { value: "buy_to_cover", label: "Buy To Cover" },
  ];
  const optionsDataForSell = [
    { value: "sell", label: "Sell" },
    { value: "sell_short", label: "Sell Short" },
  ];

  const optionsMarketData = [
    { value: "market", label: "Market" },
    { value: "limit", label: "Limit" },
    { value: "stop", label: "Stop" },
    { value: "stop_limit", label: "Stop Limit" },
  ];

  const optionsDurationData = [
    { value: "day", label: "Day" },
    { value: "gtc", label: "GTC" },
    { value: "pre", label: "Pre" },
    { value: "post", label: "Post" },
  ];
  const [selectedMarketLable, setSelectedMarketLable] = useState<string>(
    tradeDataMap?.[0]?.type || optionsMarketData?.[0]?.value || "market"
  );
  const [selectedDurationtLable, setSelectedDurationtLable] = useState<string>(
    activeTabKey === "edit" || tradeDataMap?.[0]?.isDashboard
      ? tradeDataMap?.[0]?.duration ?? optionsDurationData[0].value
      : optionsDurationData[0].value
  );
  const [optionsDataLableBuy, setoptionsDataLableBuy] = useState<string>(
    activeTabKey === "edit" || tradeDataMap?.[0]?.isDashboard
      ? tradeDataMap?.[0]?.side ?? optionsDataForBuy[0].value
      : optionsDataForBuy[0].value
  );
  const [optionsDataLableSell, setoptionsDataLableSell] = useState<string>(
    activeTabKey === "edit" || tradeDataMap?.[0]?.isDashboard
      ? tradeDataMap?.[0]?.side ?? optionsDataForSell[0].value
      : optionsDataForSell[0].value
  );
  const [quantity, setQuantity] = useState<any>(
    activeTabKey === "edit" || tradeDataMap?.[0]?.isDashboard ? tradeDataMap?.[0]?.quantity ?? 1 : 1
  );
  const [selectedPrice, setSelectedPrice] = useState<any>(
    activeTabKey === "edit" || tradeDataMap?.[0]?.isDashboard ? tradeDataMap?.[0]?.price ?? "" : ""
  );
  const [selectedStop, setSelectedStop] = useState<any>(
    activeTabKey === "edit" || tradeDataMap?.[0]?.isDashboard ? tradeDataMap?.[0]?.stop ?? "" : ""
  );

  const handleSelectChange = (event) => {
    setSelectedMarketLable(event.target.value);
  };

  const handleSelectDuration = (event) => {
    setSelectedDurationtLable(event.target.value);
  };

  const selectedSideBuy = optionsDataLableBuy;
  const selectedSideSell = optionsDataLableSell;
  const selectedType = selectedMarketLable;
  const selectedClass = "equity";
  const selectedSymbol = tradeDataMap[0]?.symbol ? tradeDataMap[0]?.symbol : "-";
  const selectedDuration = selectedDurationtLable;
  const selectedQuantity = quantity;

  const orderData: any = {
    type: selectedType,
    side: activeTabKey === "buy" ? selectedSideBuy : selectedSideSell,
    duration: selectedDuration,
    account_id: balancesObj.selectedAccountId,
    symbol: selectedSymbol,
    quantity: selectedQuantity,
    classType: selectedClass,
    price: selectedPrice,
    stop: selectedStop,
  };

  const handleSellBuy = () => {
    const token = typeof window !== "undefined" && localStorage.getItem("accessToken");
    if (token) {
      dispatch(fetchPlaceOrder(orderData));
      if (pathname === "/dashboard/") {
        handleClose();
      } else {
        router.push("/dashboard");
      }
    } else {
      handleClose();
      router.push("/login");
    }
  };

  const handleEdit = () => {
    orderData.id = tradeDataMap?.[0].id;
    if (handleSubmit) {
      handleSubmit(orderData);
    }
  };

  const estimatedCost = (selectedMarketLable === "limit" ? selectedPrice : tradeDataMap[0]?.last) * quantity;

  return (
    <Offcanvas.Body className="BuySellStock">
      <form>
        <ul className={styles.labelValue}>
          <li>
            <label>Account</label>
            <strong aria-label="Default select example">{balancesObj.selectedAccountId}</strong>
          </li>
          <li>
            <label>Balance</label>
            <strong> {addDollarSignCommasToNumber(balancesObj?.balances?.total_equity) || 0}</strong>
          </li>
          <li>
            <label>{balancesObj?.balances?.account_type === "cash" ? "Settled funds" : "Stock BP"}</label>
            <strong>
              {addDollarSignCommasToNumber(
                balancesObj?.balances?.account_type === "cash"
                  ? balancesObj?.balances?.cash?.cash_available - balancesObj?.balances?.cash?.unsettled_funds
                  : balancesObj?.balances?.[balancesObj?.balances?.account_type]?.stock_buying_power
              ) || 0}
            </strong>
          </li>
        </ul>

        {activeTabKey === "edit" ? (
          <Tabs activeKey={activeTabKey} id="uncontrolled-tab-example" className="">
            <Tab eventKey={ActiveTabType.edit} title="Edit">
              <div className={styles.buyStrategies}>
                <div className={styles.stockDetails}>
                  <div className={styles.info}>
                    <h3>{!tradeDataMap[0]?.symbol ? "AAPL" : tradeDataMap[0]?.symbol}</h3>
                    <span>
                      NASDAQ:
                      {!tradeDataMap[0]?.symbol ? "NASDAQ" : tradeDataMap[0]?.symbol}
                    </span>
                  </div>
                  <div className={styles.priceMain}>
                    <div>
                      <span className={styles.currency}>$</span>
                      <span className={styles.price}>
                        {tradeDataMap[0]?.last === 0 ? 0 : addCommasToNumber(tradeDataMap[0]?.last) || "-"}
                      </span>
                    </div>
                    <span className={styles.change}>
                      ${" "}
                      {tradeDataMap[0]?.change === 0
                        ? 0
                        : tradeDataMap[0]?.change > 0
                        ? "+" + addCommasFixedTwoToNumber(tradeDataMap[0]?.change)
                        : (tradeDataMap[0]?.change < 0 && "-" + addCommasFixedTwoToNumber(tradeDataMap[0]?.change)) ||
                          "-"}{" "}
                      (
                      {tradeDataMap[0]?.change_percentage === 0
                        ? 0
                        : (tradeDataMap[0]?.change_percentage !== null &&
                            addCommasFixedTwoToNumber(tradeDataMap[0]?.change_percentage) + "%") ||
                          "-"}
                      )
                      {tradeDataMap[0]?.change_percentage === 0 || tradeDataMap[0]?.change_percentage > 0 ? (
                        <Image src={Up} alt="Up" width={14} height={14} />
                      ) : (
                        <Image src={Down} alt="Down" width={14} height={14} />
                      )}
                    </span>
                  </div>
                </div>
                <div className={styles.buySellDetails}>
                  <ul className="w-100">
                    <li>
                      <strong>ASK </strong>
                      <label>@{addCommasFixedTwoToNumber(tradeDataMap[0]?.ask)}</label>
                    </li>

                    <li>
                      <strong>BID </strong>
                      <label>@{addCommasFixedTwoToNumber(tradeDataMap[0]?.bid)}</label>
                    </li>
                  </ul>
                </div>
                <Form.Select
                  aria-label="Default select example"
                  value={optionsDataLableBuy}
                  onChange={(e) => setoptionsDataLableBuy(e.target.value)}
                >
                  {optionsDataForBuy.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Form.Select>

                <Form.Select
                  aria-label="Default select example"
                  value={selectedMarketLable}
                  onChange={handleSelectChange}
                >
                  {optionsMarketData.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Form.Select>
                {selectedMarketLable === "limit" ? (
                  <Form.Control
                    type="number"
                    placeholder="Price"
                    className={styles.formControl}
                    onChange={(event) => setSelectedPrice(event.target.value)}
                  />
                ) : null}
                {selectedMarketLable === "stop" ? (
                  <Form.Control
                    type="number"
                    placeholder="Stop"
                    className={styles.formControl}
                    onChange={(event) => setSelectedStop(event.target.value)}
                  />
                ) : null}
                {selectedMarketLable === "stop_limit" ? (
                  <>
                    <Form.Control
                      type="number"
                      placeholder="Stop"
                      className={styles.formControl}
                      onChange={(event) => setSelectedStop(event.target.value)}
                    />
                    <Form.Control
                      type="number"
                      placeholder="Limit"
                      className={styles.formControl}
                      onChange={(event) => setSelectedPrice(event.target.value)}
                    />
                  </>
                ) : null}

                <Form.Select
                  aria-label="Default select example"
                  value={selectedDurationtLable}
                  onChange={handleSelectDuration}
                >
                  {optionsDurationData.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Form.Select>

                <Form.Group className="mb-5" controlId="exampleForm.ControlInput1">
                  <Form.Label>Quantity</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="1"
                    aria-describedby="cost"
                    value={quantity}
                    onChange={(event) => setQuantity(event.target.value)}
                  />
                  <Form.Text id="cost" className={styles.estimatedCost}>
                    Estimated cost: <span> {addDollarSignCommasToNumber(estimatedCost)}</span>
                  </Form.Text>
                </Form.Group>

                <div className="d-grid gap-2">
                  <Button variant="success" className={styles.Preview} onClick={handleEdit}>
                    {loading ? (
                      <div>
                        <Spinner animation="border" />
                      </div>
                    ) : (
                      <>
                        <span className="icon-buy"></span> Edit
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </Tab>
          </Tabs>
        ) : (
          <Tabs
            activeKey={activeTabKey}
            onSelect={(type: string) => {
              if (type !== activeTabKey) {
                setActiveTabKey(type);
              }
            }}
            id="uncontrolled-tab-example"
            className=""
          >
            <Tab eventKey={ActiveTabType.buy} title="Buy">
              <div className={styles.buyStrategies}>
                <div className={styles.stockDetails}>
                  <div className={styles.info}>
                    <h3>{!tradeDataMap[0]?.symbol ? "AAPL" : tradeDataMap[0]?.symbol}</h3>
                    <span>
                      NASDAQ:
                      {!tradeDataMap[0]?.symbol ? "NASDAQ" : tradeDataMap[0]?.symbol}
                    </span>
                  </div>
                  <div className={styles.priceMain}>
                    <div>
                      <span className={styles.currency}>$</span>
                      <span className={styles.price}>
                        {tradeDataMap[0]?.last === 0 ? 0 : addCommasToNumber(tradeDataMap[0]?.last) || "-"}
                      </span>
                    </div>
                    <span className={styles.change}>
                      ${" "}
                      {tradeDataMap[0]?.change === 0
                        ? 0
                        : tradeDataMap[0]?.change > 0
                        ? "+" + addCommasToNumber(tradeDataMap[0]?.change)
                        : addCommasToNumber(tradeDataMap[0]?.change < 0 && "-" + tradeDataMap[0]?.change) || "-"}{" "}
                      (
                      {tradeDataMap[0]?.change_percentage === 0
                        ? 0
                        : (tradeDataMap[0]?.change_percentage !== null && tradeDataMap[0]?.change_percentage + "%") ||
                          "-"}
                      )
                      {tradeDataMap[0]?.change_percentage === 0 || tradeDataMap[0]?.change_percentage > 0 ? (
                        <Image src={Up} alt="Up" width={14} height={14} />
                      ) : (
                        <Image src={Down} alt="Down" width={14} height={14} />
                      )}
                    </span>
                  </div>
                </div>
                <div className={styles.buySellDetails}>
                  <ul className="w-100">
                    <li>
                      <strong>BID </strong>
                      <label>@{addDollarSignCommasToNumber(tradeDataMap[0]?.bid)}</label>
                    </li>
                    <li>
                      <strong>ASK </strong>
                      <label>@{addDollarSignCommasToNumber(tradeDataMap[0]?.ask)}</label>
                    </li>
                  </ul>
                </div>
                <Form.Select
                  aria-label="Default select example"
                  value={optionsDataLableBuy}
                  onChange={(e) => setoptionsDataLableBuy(e.target.value)}
                >
                  {optionsDataForBuy.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Form.Select>

                <Form.Select
                  aria-label="Default select example"
                  value={selectedMarketLable}
                  onChange={handleSelectChange}
                >
                  {optionsMarketData.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Form.Select>
                {selectedMarketLable === "limit" ? (
                  <Form.Control
                    type="number"
                    placeholder="Price"
                    className={styles.formControl}
                    onChange={(event) => setSelectedPrice(event.target.value)}
                  />
                ) : null}
                {selectedMarketLable === "stop" ? (
                  <Form.Control
                    type="number"
                    placeholder="Stop"
                    className={styles.formControl}
                    onChange={(event) => setSelectedStop(event.target.value)}
                  />
                ) : null}
                {selectedMarketLable === "stop_limit" ? (
                  <>
                    <Form.Control
                      type="number"
                      placeholder="Stop"
                      className={styles.formControl}
                      onChange={(event) => setSelectedStop(event.target.value)}
                    />
                    <Form.Control
                      type="number"
                      placeholder="Limit"
                      className={styles.formControl}
                      onChange={(event) => setSelectedPrice(event.target.value)}
                    />
                  </>
                ) : null}

                <Form.Select
                  aria-label="Default select example"
                  value={selectedDurationtLable}
                  onChange={handleSelectDuration}
                >
                  {optionsDurationData.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Form.Select>

                <Form.Group className="mb-5" controlId="exampleForm.ControlInput1">
                  <Form.Label>Quantity</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="1"
                    aria-describedby="cost"
                    value={quantity}
                    onChange={(event) => setQuantity(event.target.value)}
                  />
                  <Form.Text id="cost" className={styles.estimatedCost}>
                    Estimated cost: <span>{addDollarSignCommasToNumber(estimatedCost)}</span>
                  </Form.Text>
                </Form.Group>

                <div className="d-grid gap-2">
                  <Button variant="success" className={styles.Preview} onClick={handleSellBuy}>
                    {loading ? (
                      <div>
                        <Spinner animation="border" />
                      </div>
                    ) : (
                      <>
                        <span className="icon-buy"></span> Buy
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </Tab>
            <Tab eventKey={ActiveTabType.sell} title="Sell">
              <div className={styles.buyStrategies}>
                <div className={styles.stockDetails}>
                  <div className={styles.info}>
                    <h3>{!tradeDataMap[0]?.symbol ? "AAPL" : tradeDataMap[0]?.symbol}</h3>
                    <span>
                      NASDAQ:
                      {!tradeDataMap[0]?.symbol ? "NASDAQ" : tradeDataMap[0]?.symbol}
                    </span>
                  </div>
                  <div className={styles.priceMain}>
                    <div>
                      <span className={styles.currency}>$</span>
                      <span className={styles.price}>
                        {tradeDataMap[0]?.last === 0 ? 0 : addCommasToNumber(tradeDataMap[0]?.last) || "-"}
                      </span>
                    </div>
                    <span className={styles.change}>
                      ${" "}
                      {tradeDataMap[0]?.change === 0
                        ? 0
                        : tradeDataMap[0]?.change > 0
                        ? "+" + addCommasToNumber(tradeDataMap[0]?.change)
                        : addCommasToNumber(tradeDataMap[0]?.change < 0 && "-" + tradeDataMap[0]?.change) || "-"}{" "}
                      (
                      {tradeDataMap[0]?.change_percentage === 0
                        ? 0
                        : (tradeDataMap[0]?.change_percentage !== null &&
                            addCommasFixedTwoToNumber(tradeDataMap[0]?.change_percentage) + "%") ||
                          "-"}
                      )
                      {tradeDataMap[0]?.change_percentage === 0 || tradeDataMap[0]?.change_percentage > 0 ? (
                        <Image src={Up} alt="Up" width={14} height={14} />
                      ) : (
                        <Image src={Down} alt="Down" width={14} height={14} />
                      )}
                    </span>
                  </div>
                </div>
                <div className={styles.buySellDetails}>
                  <ul className="w-100">
                    <li>
                      <strong>BID </strong>
                      <label>@{addDollarSignCommasToNumber(tradeDataMap[0]?.bid)}</label>
                    </li>
                    <li>
                      <strong>ASK </strong>
                      <label>@{addDollarSignCommasToNumber(tradeDataMap[0]?.ask)}</label>
                    </li>
                  </ul>
                </div>
                <Form.Select
                  aria-label="Default select example"
                  value={optionsDataLableSell}
                  onChange={(e) => setoptionsDataLableSell(e.target.value)}
                >
                  {optionsDataForSell.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Form.Select>

                <Form.Select
                  aria-label="Default select example"
                  value={selectedMarketLable}
                  onChange={handleSelectChange}
                >
                  {optionsMarketData.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Form.Select>
                {selectedMarketLable === "limit" ? (
                  <Form.Control
                    type="number"
                    placeholder="Price"
                    className={styles.formControl}
                    onChange={(event) => setSelectedPrice(event.target.value)}
                  />
                ) : null}
                {selectedMarketLable === "stop" ? (
                  <Form.Control
                    type="number"
                    placeholder="Stop"
                    className={styles.formControl}
                    onChange={(event) => setSelectedStop(event.target.value)}
                  />
                ) : null}
                {selectedMarketLable === "stop_limit" ? (
                  <>
                    <Form.Control
                      type="number"
                      placeholder="Stop"
                      className={styles.formControl}
                      onChange={(event) => setSelectedStop(event.target.value)}
                    />
                    <Form.Control
                      type="number"
                      placeholder="Limit"
                      className={styles.formControl}
                      onChange={(event) => setSelectedPrice(event.target.value)}
                    />
                  </>
                ) : null}

                <Form.Select
                  aria-label="Default select example"
                  value={selectedDurationtLable}
                  onChange={handleSelectDuration}
                >
                  {optionsDurationData.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Form.Select>

                <Form.Group className="mb-5" controlId="exampleForm.ControlInput1">
                  <Form.Label>Quantity</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="1"
                    aria-describedby="cost"
                    value={quantity}
                    onChange={(event) => setQuantity(event.target.value)}
                  />
                  <Form.Text id="cost" className={styles.estimatedCost}>
                    Estimated Proceeds: <span>{addDollarSignCommasToNumber(estimatedCost)}</span>
                  </Form.Text>
                </Form.Group>

                <div className="d-grid gap-2">
                  <Button variant="danger" className={styles.Preview} onClick={handleSellBuy}>
                    {loading ? (
                      <div>
                        <Spinner animation="border" />
                      </div>
                    ) : (
                      <>
                        <span className="icon-sell"></span>Sell
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </Tab>
          </Tabs>
        )}
      </form>
    </Offcanvas.Body>
  );
};

export default BuySell;
