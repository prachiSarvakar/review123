"use client";
import styles from "@/styles/strategies.module.scss";
import { Card } from "react-bootstrap";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { RECENT_SEARCHED } from "@/constants/common";
import { todayDate, yesterdayDate } from "@/utils/dates";
import Cookies from "js-cookie";

const Stratergies = () => {
  const { t, i18n } = useTranslation();
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
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

  const getHref = (strategy) => {
    return `/trade?q=${firstSearchedValue}&start=${yesterdayDate}&end=${todayDate}&activeTab=option-strategies&strategy=${strategy}`;
  };

  return (
    <Card className={styles.strategiesPage}>
      <Card.Header>
        <h2>{t("optionsstrategiestitle")}</h2>
        <p>{t("optionDescription")}</p>
      </Card.Header>
      <Card.Body className={styles.strategiesContainer}>
        <ul className={styles.strategiesList}>
          <li>
            <h5>{t("strategies.Starter.title")}</h5>
          </li>
          <li>
            <Link href={getHref(1)}>
              {t("strategies.Starter.Long Call")} <span className="icon-bull"></span>
            </Link>
          </li>
          <li>
            <Link href={getHref(2)}>
              {t("strategies.Starter.Short Call")} <span className="icon-bear"></span>
            </Link>
          </li>
          <li>
            <Link href={getHref(3)}>
              {t("strategies.Starter.Long Put")} <span className="icon-bear"></span>
            </Link>
          </li>
          <li>
            <Link href={getHref(4)}>
              {t("strategies.Starter.Short Put")}
              <span className="icon-bull"></span>
            </Link>
          </li>
        </ul>
        <ul className={styles.strategiesList}>
          <li>
            <h5>{t("strategies.Proficient.title")}</h5>
          </li>
          <li>
            <Link href={getHref(5)}>
              {t("strategies.Proficient.Covered Call")} <span className="icon-bull"></span>{" "}
              <span className="icon-natural"></span>
            </Link>
          </li>
          <li>
            <Link href={getHref(6)}>
              {t("strategies.Proficient.CashSecuredPut")} <span className="icon-bull"></span>
            </Link>
          </li>
        </ul>

        {/* debit spreads - end */}
        <ul className={styles.strategiesList}>
          <li>
            <h5>{t("strategies.DebitSpreads.title")}</h5>
          </li>
          <li>
            <Link href={getHref(7)}>
              {t("strategies.Spreads.Bull Call Spread")} <span className="icon-bull"></span>
            </Link>
          </li>
          <li>
            <Link href={getHref(8)}>
              {t("strategies.Spreads.Bear Put Spread")} <span className="icon-bear"></span>
            </Link>
          </li>
        </ul>
        {/* debit spreads - end */}

        {/* Credit Spreads */}
        <ul className={styles.strategiesList}>
          <li>
            <h5>{t("strategies.CreditSpreads.title")}</h5>
          </li>
          <li>
            <Link href={getHref(9)}>
              {t("strategies.Spreads.Bear Call Spread")} <span className="icon-bear"></span>{" "}
              <span className="icon-natural"></span>
            </Link>
          </li>
          <li>
            <Link href={getHref(10)}>
              {t("strategies.Spreads.Bull Put Spread")} <span className="icon-bull"></span>{" "}
              <span className="icon-natural"></span>
            </Link>
          </li>

          <li>
            <Link href={getHref(11)}>
              {t("strategies.Spreads.Call Vertical Spread")} <span className="icon-bull"></span>{" "}
              <span className="icon-directional"></span>
            </Link>
          </li>
          <li>
            <Link href={getHref(12)}>
              {t("strategies.Spreads.Put Vertical Spread")} <span className="icon-bear"></span>{" "}
              <span className="icon-directional"></span>
            </Link>
          </li>
        </ul>
        {/* credit spreads - end */}

        <ul className={styles.strategiesList}>
          <li>
            <h5>{t("strategies.Condors.title")}</h5>
          </li>
          <li>
            <Link href={getHref(13)}>
              {t("strategies.Condors.Long Call Condor")} <span className="icon-natural"></span>
            </Link>
          </li>
          <li>
            <Link href={getHref(14)}>
              {t("strategies.Condors.Long Put Condor")} <span className="icon-natural"></span>
            </Link>
          </li>
          <li>
            <Link href={getHref(15)}>
              {t("strategies.Condors.Iron Condor")} <span className="icon-natural"></span>
            </Link>
          </li>
          <li>
            <Link href={getHref(16)}>
              {t("strategies.Condors.Short Call Condor")} <span className="icon-directional"></span>
            </Link>
          </li>
          <li>
            <Link href={getHref(17)}>
              {t("strategies.Condors.Short Put Condor")} <span className="icon-directional"></span>
            </Link>
          </li>
          <li>
            <Link href={getHref(18)}>
              {t("strategies.Condors.Reverse Iron Condor")} <span className="icon-directional"></span>
            </Link>
          </li>
        </ul>

        <ul className={styles.strategiesList}>
          <li>
            <h5>{t("strategies.Straddles.title")}</h5>
          </li>
          <li>
            <Link href={getHref(19)}>
              {t("strategies.Straddles.Long Straddle")} <span className="icon-directional"></span>
            </Link>
          </li>
          <li>
            <Link href={getHref(20)}>
              {t("strategies.Straddles.Short Straddle")} <span className="icon-natural"></span>
            </Link>
          </li>
          <li>
            <Link href={getHref(21)}>
              {t("strategies.Straddles.Covered Short Straddle")}
              <span className="icon-bull"></span>
            </Link>
          </li>
        </ul>

        <ul className={styles.strategiesList}>
          <li>
            <h5>{t("strategies.Strangles.title")}</h5>
          </li>
          <li>
            <Link href={getHref(22)}>
              {t("strategies.Strangles.Long Strangle")} <span className="icon-directional"></span>
            </Link>
          </li>
          <li>
            <Link href={getHref(23)}>
              {t("strategies.Strangles.Short Strangle")} <span className="icon-natural"></span>
            </Link>
          </li>
          <li>
            <Link href={getHref(24)}>
              {t("strategies.Strangles.Covered Short Strangle")} <span className="icon-bull"></span>
            </Link>
          </li>
        </ul>

        <ul className={styles.strategiesList}>
          <li>
            <h5>{t("strategies.Butterfly.title")}</h5>
          </li>
          <li>
            <Link href={getHref(25)}>
              {t("strategies.Butterfly.Long Call Butterfly")} <span className="icon-natural"></span>
            </Link>
          </li>
          <li>
            <Link href={getHref(26)}>
              {t("strategies.Butterfly.Long Put Butterfly")} <span className="icon-natural"></span>
            </Link>
          </li>
          <li>
            <Link href={getHref(27)}>
              {t("strategies.Butterfly.Iron Butterfly")} <span className="icon-natural"></span>
            </Link>
          </li>
          <li>
            <Link href={getHref(28)}>
              {t("strategies.Butterfly.Short Call Butterfly")} <span className="icon-directional"></span>
            </Link>
          </li>
          <li>
            <Link href={getHref(29)}>
              {t("strategies.Butterfly.Short Put Butterfly")} <span className="icon-directional"></span>
            </Link>
          </li>
          <li>
            <Link href={getHref(30)}>
              {t("strategies.Butterfly.Reverse Iron Butterfly")} <span className="icon-directional"></span>
            </Link>
          </li>
        </ul>

        <ul className={styles.strategiesList}>
          <li>
            <h5>{t("strategies.Ladder.title")}</h5>
          </li>
          <li>
            <Link href={getHref(31)}>
              {t("strategies.Ladder.Bull Call Ladder")} <span className="icon-natural"></span>{" "}
              <span className="icon-bull"></span>
            </Link>
          </li>
          <li>
            <Link href={getHref(32)}>
              {t("strategies.Ladder.Bull Put Ladder")} <span className="icon-directional"></span>
            </Link>
          </li>
          <li>
            <Link href={getHref(33)}>
              {t("strategies.Ladder.Bear Call Ladder")} <span className="icon-directional"></span>
            </Link>
          </li>
          <li>
            <Link href={getHref(34)}>
              {t("strategies.Ladder.Bear Put Ladder")} <span className="icon-natural"></span>
            </Link>
          </li>
        </ul>

        <ul className={styles.strategiesList}>
          <li>
            <h5>{t("strategies.Synthetic.title")}</h5>
          </li>
          <li>
            <Link href={getHref(35)}>
              {t("strategies.Synthetic.Synthetic Call")} <span className="icon-bull"></span>
            </Link>
          </li>
          <li>
            <Link href={getHref(36)}>
              {t("strategies.Synthetic.Synthetic Put")} <span className="icon-bear"></span>
            </Link>
          </li>
          <li>
            <Link href={getHref(37)}>
              {t("strategies.Synthetic.Synthetic Long Stock")} <span className="icon-bull"></span>
            </Link>
          </li>
          <li>
            <Link href={getHref(38)}>
              {t("strategies.Synthetic.Synthetic Short Stock")} <span className="icon-bear"></span>
            </Link>
          </li>
          <li>
            <Link href={getHref(39)}>
              {t("strategies.Synthetic.Synthetic Long Straddle Calls")} <span className="icon-directional"></span>
            </Link>
          </li>
          <li>
            <Link href={getHref(40)}>
              {t("strategies.Synthetic.Synthetic Long Straddle Puts")} <span className="icon-directional"></span>
            </Link>
          </li>
          <li>
            <Link href={getHref(41)}>
              {t("strategies.Synthetic.Synthetic Short Straddle Calls")} <span className="icon-natural"></span>
            </Link>
          </li>
          <li>
            <Link href={getHref(42)}>
              {t("strategies.Synthetic.Synthetic Short Straddle Puts")} <span className="icon-natural"></span>
            </Link>
          </li>
        </ul>

        <ul className={styles.strategiesList}>
          <li>
            <h5>{t("strategies.More.title")}</h5>
          </li>
          <li>
            <Link href={getHref(43)}>
              {t("strategies.More.Strip")} <span className="icon-bear"></span>{" "}
              <span className="icon-directional"></span>{" "}
            </Link>
          </li>
          <li>
            <Link href={getHref(44)}>
              {t("strategies.More.Strap")} <span className="icon-bull"></span>{" "}
              <span className="icon-directional"></span>{" "}
            </Link>
          </li>
          <li>
            <Link href={getHref(45)}>
              {t("strategies.More.Long Guts")} <span className="icon-directional"></span>
            </Link>
          </li>
          <li>
            <Link href={getHref(46)}>
              {t("strategies.More.Short Guts")} <span className="icon-natural"></span>
            </Link>
          </li>
          <li>
            <Link href={getHref(47)}>
              {t("strategies.More.Collar")} <span className="icon-bull"></span>
            </Link>
          </li>
          <li>
            <Link href={getHref(48)}>
              {t("strategies.More.Long Combo")} <span className="icon-natural"></span>{" "}
              <span className="icon-bull"></span>{" "}
            </Link>
          </li>
          <li>
            <Link href={getHref(49)}>
              {t("strategies.More.Short Combo")} <span className="icon-bear"></span>{" "}
              <span className="icon-natural"></span>
            </Link>
          </li>
          <li>
            <Link href={getHref(50)}>
              {t("strategies.More.Long Box")} <span className="icon-bear"></span>
            </Link>
          </li>
          <li>
            <Link href={getHref(51)}>
              {t("strategies.More.Call Vertical Backspread")} <span className="icon-bull"></span>{" "}
              <span className="icon-directional"></span>
            </Link>
          </li>
          <li>
            <Link href={getHref(52)}>
              {t("strategies.More.Put Vertical Backspread")} <span className="icon-bear"></span>{" "}
              <span className="icon-directional"></span>
            </Link>
          </li>
          <li>
            <Link href={getHref(53)}>
              {t("strategies.Proficient.Protective Put")} <span className="icon-bull"></span>
            </Link>
          </li>
        </ul>
      </Card.Body>
    </Card>
  );
};
export default Stratergies;
