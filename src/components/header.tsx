"use client";
import Image from "next/image";
import styles from "@/styles/header.module.scss";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import ArrowUpward from "@/assets/images/arrow-outward.svg";
import Logo from "@/assets/images/sensa.svg";
import Search from "@/assets/images/search.svg";
import Login from "@/assets/images/login.svg";
import English from "@/assets/images/english.svg";
import { Button, Dropdown, Form, InputGroup, SSRProvider, ButtonGroup, Collapse, Modal } from "react-bootstrap";
import Spanish from "@/assets/images/spanish.svg";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Cookies from "js-cookie";
import { RECENT_SEARCHED, SERACHED_STOCK_DATA } from "@/constants/common";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxCommon";
import { fetchSearchApi, searchData } from "@/redux/slices/recentSearchSlice";
import { usePathname, useRouter, useSearchParams, useSelectedLayoutSegment } from "next/navigation";
import { todayDate, yesterdayDate } from "@/utils/dates";
import { debounce } from "lodash";
import { DebounceInput } from "react-debounce-input";
import { useTranslation } from "react-i18next";
import User from "@/assets/images/user.svg";
import { loginDatas, clear } from "@/redux/slices/loginSlice";
import {
  fetchPaperTradingProfileDetails,
  fetchProfileDetails,
  fetchProfileNickName,
  profileData,
} from "@/redux/slices/profileSlice";
import { balancesData, fetchBalanceDetails, statusCheck } from "@/redux/slices/balanceSlice";
import { addCommasToNumber } from "@/utils/prize";
import { fetchAccountHistory } from "@/redux/slices/accountHistorySlice";
import { fetchAccountGainLoss } from "@/redux/slices/accountGainLossSlice";
import { fetchQuotesData, quotesData } from "@/redux/slices/quoteSlice";

import { fetchPositionList, positionList, positionListStatusNum } from "@/redux/slices/positionListSlice";
import { fetchOrderList, orderList, orderStatusNumber } from "@/redux/slices/orderListSlice";
import { apiWithToken } from "@/utils/apiConfig";
import { addDollarSignCommasToNumber, customToFixed } from "@/utils/positions";

const Header = (props) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [open, setOpen] = useState(false);
  const dataFromLogin: any = useAppSelector(loginDatas);
  const search = useSearchParams();
  const [storeRecentValue, setStoreRecentValue] = useState<string>(search.get("q") || "");
  const [recentList, setRecentList] = useState([]);
  const valuesFromArray: any[] = useAppSelector(searchData);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const segment = useSelectedLayoutSegment();
  const balancesObj: any = useAppSelector(balancesData);
  const symbolData: any = useAppSelector(quotesData);
  const profile: any = useAppSelector(profileData);
  const positions: any = useAppSelector(positionList);
  const accounts = profile?.profile?.account;
  const paperTradingAccount = profile?.paperTradingProfile;
  const profileLabels = profile?.tradingProfileSetting?.accountLabels;
  const [loading, setLoading] = useState(true);
  const userName = profile?.profile?.name;
  const [selectedAccount, setSelectedAccount] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const accountType = typeof window !== "undefined" && localStorage.getItem("accountType");
  const [toggleMenu, setToggleMenu] = useState(false);
  useEffect(() => {
    apiWithToken.defaults.baseURL =
      accountType === "paperTrading" ? process.env.PAPERTRADING_API_BASEURL : process.env.API_BASEURL;
  }, [accountType, profile]);

  useEffect(() => {
    let accountId = null;
    localStorage.setItem("accountType", "prod");
    if (balancesObj.selectedAccountId) {
      accountId = balancesObj?.selectedAccountId;
    } else if (accounts?.account_number) {
      accountId = accounts?.account_number;
    } else {
      accountId = accounts?.[0]?.account_number;
    }
    if (accountId) {
      setSelectedAccount(accountId);
      dispatch(fetchBalanceDetails(accountId));
      dispatch(fetchAccountHistory({ accountId: accountId }));
      dispatch(fetchAccountGainLoss({ accountId: accountId }));
      dispatch(fetchPositionList(accountId));
      dispatch(fetchOrderList(accountId));
    }
  }, [profile]);

  const changeAccount = (e, accountNumber) => {
    const selectedOption = e.target.options[e.target.selectedIndex];
    const accountType = selectedOption.getAttribute("data-account-type");
    const paperTradingAccountToken = selectedOption.getAttribute("data-access-token");
    if (paperTradingAccountToken) {
      localStorage.setItem("paper_trading_accessToken", paperTradingAccountToken);
    }
    localStorage.setItem("accountType", accountType);
    apiWithToken.defaults.baseURL =
      accountType === "paperTrading" ? process.env.PAPERTRADING_API_BASEURL : process.env.API_BASEURL;

    setSelectedAccount(accountNumber);
    const accountId = accountNumber; // Use selected account number here
    if (accountId) {
      dispatch(fetchBalanceDetails(accountId));
      dispatch(fetchAccountHistory({ accountId: accountId }));
      dispatch(fetchAccountGainLoss({ accountId: accountId }));
      dispatch(fetchPositionList(accountId));
    }
  };

  const closeMenu = (event: any) => {
    if (!event.target.closest("#closeMenu")) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    dispatch(fetchProfileDetails());
    dispatch(fetchPaperTradingProfileDetails());
    dispatch(fetchProfileNickName());
    document.addEventListener("click", closeMenu);

    return () => {
      document.removeEventListener("click", closeMenu);
    };
  }, []);

  const valueToPreSet = (value: any) => {
    setStoreRecentValue(value);
    const firstValue = value.split("(")[0].trim();
    router.push(`/trade?q=${firstValue}&start=${yesterdayDate}&end=${todayDate}`);
  };

  const filteredData = Array.from(new Set(valuesFromArray));

  useEffect(() => {
    let res: any = Cookies.get(RECENT_SEARCHED);
    if (res != undefined) {
      res = JSON.parse(res);
    } else {
      res = [];
    }
    setRecentList(res);
  }, []);

  const storeInCookie = (value: any) => {
    let res: any = Cookies.get(RECENT_SEARCHED);
    if (res != undefined) {
      res = JSON.parse(res);
    }
    let arr: any = [];
    if (res == undefined) {
      arr = [];
    } else {
      arr = [...res];
    }

    if (!arr.some((item: any) => item === value.toUpperCase())) {
      arr.unshift(value.toUpperCase());
    } else {
      arr.splice(arr.indexOf(value.toUpperCase()), 1);
      arr.unshift(value.toUpperCase());
    }

    setRecentList(arr);
    Cookies.set(RECENT_SEARCHED, JSON.stringify(arr.slice(0, 9)));
    setStoreRecentValue("");
  };

  const defaultSearchValue = "SPY";
  const lastSearchedValue = Cookies.get(RECENT_SEARCHED);

  let searchedValuesArray = [];
  if (lastSearchedValue) {
    try {
      searchedValuesArray = JSON.parse(lastSearchedValue) || [];
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }
  }

  const firstSearchedValue = searchedValuesArray.length > 0 ? searchedValuesArray[0].split("(")[0] : defaultSearchValue;

  const href = `/trade?q=${firstSearchedValue}&start=${yesterdayDate}&end=${todayDate}`;

  const clearSearh = () => {
    setRecentList([]);
    setStoreRecentValue("");
    Cookies.remove(RECENT_SEARCHED);
    Cookies.remove(SERACHED_STOCK_DATA);
  };

  const handleSubmit = (e: any, item: any) => {
    e.preventDefault();
    storeInCookie(storeRecentValue);
    valueToPreSet(item.symbol);
    setStoreRecentValue("");
    // const searchInput = document.getElementById("searchInput");
    // if (searchInput) {
    //   searchInput.focus();
    // }
  };

  const selectItem = (item: string) => {
    valueToPreSet(item);
    setShowDropdown(false);
    setStoreRecentValue("");
  };

  const handler = (e: any, item: any) => {
    const value: any = filteredData[0]?.symbol;
    selectItem(e.target?.value.toUpperCase());
    const firstValue = value?.split("(")[0].trim();
    router.push(`/trade?q=${firstValue}&start=${yesterdayDate}&end=${todayDate}`);
    storeInCookie(filteredData[0]?.symbol + "(" + filteredData[0]?.description + ")");
    setStoreRecentValue("");
  };

  const { t, i18n } = useTranslation();
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const [isActive1, setIsActive1] = useState(true);
  const [isActive2, setIsActive2] = useState(false);
  const handleClick1 = () => {
    setIsActive1(true);
    setIsActive2(false);
  };
  const handleClick2 = () => {
    setIsActive1(false);
    setIsActive2(true);
  };

  const [isLogin, setIsLogin] = useState(false);
  const LoginClick = () => {
    setIsLogin(true);
  };

  const token = typeof window !== "undefined" && localStorage.getItem("accessToken");
  useEffect(() => {
    if (token) {
      setIsAuthenticated(true);
    } else if (token === null) {
      setIsAuthenticated(false);
    }
  }, [token]);
  const Logout = () => {
    setIsLogin(false);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("tokenExpiry");
    localStorage.removeItem("accountType");
    router.push("/login");
    dispatch(clear());
    setConfirmLogout(false);
  };

  //TODO: Input focus function
  // const inputRef = useRef<HTMLInputElement | null>(null);
  // useEffect(() => {
  //   if (inputRef.current) {
  //     dispatch(setSearchInputRef(inputRef)); // Pass the inputRef to the Redux action
  //   }
  // }, [dispatch]);

  let menuState;
  const toggleHam = () => {
    setToggleMenu(!toggleMenu);
    menuState = JSON.stringify(toggleMenu);
    localStorage.setItem("toggle", menuState);
    document.body.className = localStorage.getItem("toggle") + "-menu";
  };

  return (
    <header>
      <SSRProvider>
        <Navbar expand="lg" className={`d-flex flex-column ${styles.header}`}>
          <Container fluid>
            <Navbar.Brand href="/dashboard">
              <Image src={Logo} alt="Picture of the author" width={120} height={53} />
            </Navbar.Brand>

            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="navigation">
                <Link href="/cashflow" className={segment == "cashflow" ? "active" : ""}>
                  {t("header.cashflow")}
                </Link>
                <Link
                  href={isAuthenticated ? "/dashboard" : "/login"}
                  className={segment == "dashboard" ? "active" : ""}
                >
                  {t("header.dashboard")}
                </Link>
                <Link href={href} className={segment == "trade" ? "active" : ""}>
                  {t("header.trade")}
                </Link>
                <Link href="/strategies" className={segment == "strategies" ? "active" : ""}>
                  {t("header.optionstrategies")}
                </Link>
              </Nav>
            </Navbar.Collapse>
            {isAuthenticated ? (
              <>
                <Form
                  onSubmit={() => {
                    handleSubmit;
                  }}
                  className="d-flex align-items-center gap-lg-2"
                >
                  <Button
                    onClick={() => setOpen(!open)}
                    aria-controls="example-collapse-text"
                    aria-expanded={open}
                    className="searchIconMobile"
                  >
                    <Image src={Search} alt="login" width={15} height={15} className={styles.searchIcon} />
                  </Button>
                  <Collapse in={open}>
                    <InputGroup className={styles.search}>
                      <InputGroup.Text id="basic-addon1" className={styles.label}>
                        Symbol
                      </InputGroup.Text>
                      <DebounceInput
                        // id="searchInput"
                        // ref={ref}
                        placeholder={t("header.placeholder")}
                        debounceTimeout={500}
                        className="form-control"
                        onFocus={() => {
                          // setSearchFocused(true);
                          document.removeEventListener("click", closeMenu);
                          setTimeout(() => {
                            setShowDropdown(true);
                            document.addEventListener("click", closeMenu);
                          }, 500);
                        }}
                        onKeyPress={(e: any, item: any) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handler(e, item);
                            e.target.blur();
                          }
                        }}
                        onChange={(event: any) => {
                          setStoreRecentValue(event.target.value);
                          dispatch(fetchSearchApi(event.target.value));
                        }}
                        value={storeRecentValue}
                        // ref={inputRef}
                      />
                      {showDropdown && (
                        <div className={styles.searchDropdown} id="closeMenu">
                          {!storeRecentValue && (
                            <div className={styles.dropdownHeader}>
                              <div className={styles.dropdownHeading}>{t("header.recentsearches")}</div>
                              <span className={styles.clear} onClick={clearSearh}>
                                {t("header.clearall")}
                              </span>
                            </div>
                          )}
                          {!storeRecentValue
                            ? recentList?.map((item: any, index) => {
                                return (
                                  <Dropdown.Item
                                    className={styles.searchItem}
                                    key={item + index.toString()}
                                    onClick={() => {
                                      selectItem(item);
                                      storeInCookie(item);
                                    }}
                                  >
                                    <span className={styles.name}>{item}</span>
                                    <span className={styles.arrow}>
                                      <Image src={ArrowUpward} alt="select" width={10} height={10} />
                                    </span>
                                  </Dropdown.Item>
                                );
                              })
                            : filteredData?.map((item: any, index: any) => {
                                return (
                                  <Dropdown.Item
                                    className={styles.searchItem}
                                    key={item + index.toString()}
                                    onClick={() => {
                                      selectItem(item.symbol);
                                      storeInCookie(item.symbol + "(" + item.description + ")");
                                    }}
                                  >
                                    <span className={styles.name}>{item.symbol + " (" + item.description + ")"}</span>
                                    <span className={styles.arrow}>
                                      <Image src={ArrowUpward} alt="select" width={10} height={10} />
                                    </span>
                                  </Dropdown.Item>
                                );
                              })}
                        </div>
                      )}
                      <Image src={Search} alt="login" width={15} height={15} className={styles.searchIcon} />
                    </InputGroup>
                  </Collapse>
                  {isAuthenticated ? (
                    <>
                      <Dropdown className={styles.AccountDropdown}>
                        <Dropdown.Toggle variant="transparent" id="dropdown-basic" className={styles.loggedIn}>
                          <Image src={User} width={40} height={40} alt="User Info" />
                          <div className={styles.accountInfo}>
                            <strong>{userName}</strong>
                            <span>{selectedAccount}</span>
                          </div>
                          <span className={styles.value}>
                            <strong>Value</strong>
                            <span>{addDollarSignCommasToNumber(balancesObj?.balances?.total_equity || 0)}</span>
                          </span>
                        </Dropdown.Toggle>

                        <Dropdown.Menu className={styles.UserDetails}>
                          <div className={styles.account}>
                            <div className={styles.userInfo}>
                              <Image src={User} width={40} height={40} alt="User Info" />
                              <strong>{userName}</strong>
                            </div>
                            <div>
                              <Form.Select
                                aria-label="select account"
                                className={styles.accountDrop}
                                value={selectedAccount}
                                onChange={(e) => changeAccount(e, e.target.value)}
                              >
                                <optgroup label="Prod Account">
                                  {Array.isArray(accounts) ? (
                                    accounts.map((account) => (
                                      <option
                                        key={account?.account_number + profileLabels}
                                        value={account?.account_number}
                                        data-account-type="prod"
                                      >
                                        {account?.account_number} {"- "}
                                        {profileLabels?.[account?.account_number]}
                                      </option>
                                    ))
                                  ) : (
                                    <option
                                      key={accounts?.account_number + profileLabels}
                                      value={accounts?.account_number}
                                      data-account-type="prod"
                                    >
                                      {accounts?.account_number} {"-"} {profileLabels?.[accounts?.account_number]}
                                    </option>
                                  )}
                                </optgroup>
                                <optgroup label="Paper Trade Account">
                                  {Array.isArray(paperTradingAccount) ? (
                                    paperTradingAccount.map((account) => (
                                      <option
                                        key={account?.accountNumber}
                                        value={account?.accountNumber}
                                        data-account-type="paperTrading"
                                        data-access-token={account?.token}
                                      >
                                        {account?.accountNumber}
                                      </option>
                                    ))
                                  ) : (
                                    <option
                                      key={paperTradingAccount?.accountNumber}
                                      value={paperTradingAccount?.accountNumber}
                                      data-account-type="paperTrading"
                                      data-access-token={paperTradingAccount?.token}
                                    >
                                      {paperTradingAccount?.accountNumber}
                                    </option>
                                  )}
                                </optgroup>
                              </Form.Select>
                            </div>
                          </div>
                          <ul className={styles.values}>
                            <li>
                              <label>Total Value </label>
                              <strong>
                                {addDollarSignCommasToNumber(balancesObj?.balances?.total_equity || "$ 0.00")}
                              </strong>
                            </li>
                            <li>
                              <label>
                                {balancesObj?.balances?.account_type === "cash" ? "Funds available" : "Option BP"}{" "}
                              </label>
                              <strong>
                                {addDollarSignCommasToNumber(
                                  balancesObj?.balances?.account_type === "cash"
                                    ? balancesObj?.balances?.cash?.cash_available
                                    : balancesObj?.balances?.[balancesObj?.balances?.account_type]?.option_buying_power
                                ) || "$ 0.00"}
                              </strong>
                            </li>
                            <li>
                              <label>
                                {balancesObj?.balances?.account_type === "cash" ? "Settled funds" : "Stock BP"}{" "}
                              </label>
                              <strong>
                                {addDollarSignCommasToNumber(
                                  balancesObj?.balances?.account_type === "cash"
                                    ? balancesObj?.balances?.cash?.cash_available -
                                        balancesObj?.balances?.cash?.unsettled_funds
                                    : balancesObj?.balances?.[balancesObj?.balances?.account_type]?.stock_buying_power
                                ) || "$ 0.00"}
                              </strong>
                            </li>
                          </ul>
                          <div className={styles.btns}>
                            <Button variant="outline-primary">Fund</Button>
                            <Button variant="primary">Trade</Button>
                          </div>
                          <Link href="/setting">Setting</Link>
                          {
                            <span className={styles.logout} onClick={() => setConfirmLogout(true)}>
                              Logout
                            </span>
                          }
                        </Dropdown.Menu>
                      </Dropdown>
                      <Dropdown as={ButtonGroup} align="end">
                        <Dropdown.Toggle
                          id="dropdown-custom-1"
                          className="bg-transparent border-0 text-secondary langDropdown"
                        >
                          {isActive2 ? (
                            <div>
                              <Image src={Spanish} alt="Spanish" width={20} height={20} /> ES
                            </div>
                          ) : (
                            <div>
                              <Image src={English} alt="English" width={20} height={20} /> EN
                            </div>
                          )}
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="">
                          <Dropdown.Item
                            eventKey="1"
                            onClick={() => {
                              changeLanguage("en"), handleClick1();
                            }}
                            className={`element ${isActive1 ? "active" : ""}`}
                          >
                            <Image src={English} alt="login" width={20} height={20} /> English
                          </Dropdown.Item>
                          <Dropdown.Item
                            eventKey="2"
                            onClick={() => {
                              changeLanguage("es"), handleClick2();
                            }}
                            className={`element ${isActive2 ? "active" : ""}`}
                          >
                            <Image src={Spanish} alt="login" width={20} height={20} /> Spanish
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                      <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={toggleHam} />
                    </>
                  ) : (
                    <>
                      <Link className={styles.btnPrimary} href="/login" onClick={LoginClick}>
                        <Image src={Login} alt="login" width={12} height={12} />
                        {t("header.login")}
                      </Link>
                      <Dropdown as={ButtonGroup} align="end">
                        <Dropdown.Toggle
                          id="dropdown-custom-1"
                          className="bg-transparent border-0 text-secondary langDropdown"
                        >
                          {isActive2 ? (
                            <div>
                              <Image src={Spanish} alt="Spanish" width={20} height={20} /> ES
                            </div>
                          ) : (
                            <div>
                              <Image src={English} alt="English" width={20} height={20} /> EN
                            </div>
                          )}
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="">
                          <Dropdown.Item
                            eventKey="1"
                            onClick={() => {
                              changeLanguage("en"), handleClick1();
                            }}
                            className={`element ${isActive1 ? "active" : ""}`}
                          >
                            <Image src={English} alt="login" width={20} height={20} /> English
                          </Dropdown.Item>
                          <Dropdown.Item
                            eventKey="2"
                            onClick={() => {
                              changeLanguage("es"), handleClick2();
                            }}
                            className={`element ${isActive2 ? "active" : ""}`}
                          >
                            <Image src={Spanish} alt="login" width={20} height={20} /> Spanish
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </>
                  )}
                </Form>

                {/* Uncomment below code for Darkmode  */}
                {/* <Form.Check // prettier-ignore
                  type="switch"
                  id="custom-switch"
                  label="Dark"
                  onClick={() => props.toggleTheme(true)}
                /> */}
              </>
            ) : (
              <div>
                <Dropdown as={ButtonGroup} align="end">
                  <Dropdown.Toggle
                    id="dropdown-custom-1"
                    className="bg-transparent border-0 text-secondary langDropdown"
                  >
                    {isActive2 ? (
                      <div>
                        <Image src={Spanish} alt="Spanish" width={20} height={20} /> ES
                      </div>
                    ) : (
                      <div>
                        <Image src={English} alt="English" width={20} height={20} /> EN
                      </div>
                    )}
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="">
                    <Dropdown.Item
                      eventKey="1"
                      onClick={() => {
                        changeLanguage("en"), handleClick1();
                      }}
                      className={`element ${isActive1 ? "active" : ""}`}
                    >
                      <Image src={English} alt="login" width={20} height={20} /> English
                    </Dropdown.Item>
                    <Dropdown.Item
                      eventKey="2"
                      onClick={() => {
                        changeLanguage("es"), handleClick2();
                      }}
                      className={`element ${isActive2 ? "active" : ""}`}
                    >
                      <Image src={Spanish} alt="login" width={20} height={20} /> Spanish
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                {/* <Form.Check // prettier-ignore
                  type="switch"
                  id="custom-switch"
                  label="Dark"
                  onClick={() => props.toggleTheme(true)}
                /> */}
              </div>
            )}
          </Container>
        </Navbar>
        <>
          <Modal
            show={confirmLogout}
            onHide={() => setConfirmLogout(false)}
            container={this}
            aria-labelledby="contained-modal-title"
          >
            <Modal.Body>Are you sure you want to logout?</Modal.Body>
            <Modal.Footer>
              <Button onClick={() => setConfirmLogout(false)}>No</Button>
              <Button onClick={Logout}>Yes</Button>
            </Modal.Footer>
          </Modal>
        </>
      </SSRProvider>
    </header>
  );
};

export default Header;
