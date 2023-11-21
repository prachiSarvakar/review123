"use client";
import Icon from "@/assets/images/sigma-icon.svg";
import Tradier from "@/assets/images/tradier.svg";
import TradeStation from "@/assets/images/tradestation.svg";
import SigmaTrade from "@/assets/images/sensa.svg";
import { Card, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { loginDatas, fetchLoginApi } from "@/redux/slices/loginSlice";
import {
  fetchPaperTradingProfileDetails,
  fetchProfileDetails,
  fetchProfileNickName,
} from "@/redux/slices/profileSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxCommon";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import Loader from "@/components/loader";

const Image = dynamic(() => import("next/image"), { ssr: false });

const Login = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };
  const router = useRouter();
  const searchParams = useSearchParams();
  const search: any = searchParams.get("code");
  const [loading, setLoading] = useState(false);
  const [isNavigatingToDashboard, setIsNavigatingToDashboard] = useState(false);

  useEffect(() => {
    if (window.location.href.includes("?code=") && search) {
      setLoading(true);
      dispatch(fetchLoginApi(search))
        .then((response) => {
          if (response && response?.payload.status === 200) {
            const token = response?.payload?.data?.access_token;
            const expiresIn = response?.payload?.data?.expires_in;
            if (token && expiresIn) {
              const now = new Date();
              const expiryTime = new Date(now.getTime() + expiresIn * 1000);

              localStorage.setItem("accessToken", token);
              localStorage.setItem("accountType", "prod");
              localStorage.setItem("tokenExpiry", expiryTime.toISOString());

              setIsNavigatingToDashboard(true);
              dispatch(fetchProfileDetails());
              dispatch(fetchPaperTradingProfileDetails());
              dispatch(fetchProfileNickName());
              router.push("/dashboard");

              // Calculate the time when user should be logged out (24 hours from now)
              // const logoutTime = new Date(now.getTime() + 24 * 60 * 60 * 1000);
              const logoutTime = new Date(now.getTime() + 24 * 60 * 60 * 1000);
              // Set a timer to redirect to logout page and remove token when it's time to log out
              const timeUntilLogout = logoutTime.getTime() - now.getTime();

              setTimeout(() => {
                redirectToLogin();
              }, timeUntilLogout);
            }
          } else {
            console.error("Error occurred during login. Status Code:", response?.payload.status);
          }
        })
        .catch((error) => {
          console.error("Error occurred during login:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [search]);

  const redirectToLogin = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("tokenExpiry");
    localStorage.removeItem("accountType");
    router.push("/login");
  };

  useEffect(() => {
    const tokenExpiry = localStorage.getItem("tokenExpiry");

    if (tokenExpiry) {
      const expiryTime = new Date(tokenExpiry);
      const now = new Date();

      if (expiryTime <= now) {
        redirectToLogin();
      } else {
        const timeUntilLogout = expiryTime.getTime() - now.getTime();

        setTimeout(() => {
          redirectToLogin();
        }, timeUntilLogout);
      }
    }
  }, []);

  const loginRedirect = () => {
    //LOCALHOST:
    const clientId = "BMMoBWGH2E8gbAybHACm9A1afejxuUHG";
    const redirectUri = "http://localhost:3000/login";

    //STAGING:
    // const clientId = "6k9OkkvNtAevqi9hmurJ2q51JgFvyhqh";
    // const redirectUri = "http://opcion-staging-1.s3-website-us-east-1.amazonaws.com/login"; // Replace with your Redirect URI

    //CF:
    // const clientId = "xIs4FSYlIOr2dcmBv4K41L746THhe0Do";
    // const redirectUri = "https://dzu71etxa4a49.cloudfront.net/login"; // Replace with your Redirect URI

    //PROD:
    // const clientId = "PCgOoRYACYADO5aOeffgIeIo6XKkt90p";
    // const redirectUri = "https://d13u0xh0qh0e71.cloudfront.net/login";

    //UAT:
    // const clientId = "EVBms3RFcW26ha9rUvuIFDoM6dCgK93n";
    // const redirectUri = "https://www.sensamarket.com/login"; // Replace with your Redirect URI

    window.location.href = `https://api.tradier.com/v1/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=market,read,stream,trade,write&state=uniquemyme`;
  };

  const registerRedirect = () => {
    window.location.assign("https://onboarding.tradier.com/signup");
  };

  return (
    <section className="container">
      {loading || isNavigatingToDashboard ? (
        <Loader />
      ) : (
        <>
          <div className="row">
            <Card className="col-12 col-sm-6 col-md-5 col-lg-4 loginCard mx-auto mt-5">
              <Card.Body>
                {/* <Image src={Icon} alt="Picture of the author" width={40} height={40} /> */}
                <Image src={SigmaTrade} alt="Picture of the author" fill={false} />
                <Button variant="outline-primary" onClick={loginRedirect}>
                  <Image src={Tradier} alt="Picture of the author" />
                </Button>
                <Button variant="outline-primary tradeStation" disabled>
                  <Image src={TradeStation} alt="Picture of the author" /> is coming soon..
                </Button>
                <Button variant="primary" onClick={registerRedirect}>
                  <span className="icon-person"></span> {t("Login.Open")}
                </Button>
              </Card.Body>
            </Card>
          </div>
          <p className="mb-1">
            <strong>{t("Login.Risk")}</strong>
          </p>
          <p className="mb-5">{t("Login.RiskDesc")}</p>
          <p className="mb-1">
            <strong>{t("Login.Disclosures")}</strong>
          </p>
          <p>{t("Login.DisclosuresDesc")}</p>
        </>
      )}
    </section>
  );
};
export default Login;
