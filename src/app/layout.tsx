"use client";
import "bootstrap/dist/css/bootstrap.css";
import { Providers } from "@/redux/provider";
import Header from "@/components/header";
import "@/styles/globals.scss";
import "bootstrap/dist/css/bootstrap.css";
import React, { useEffect, useState } from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "../commonLogic/i18";
import { useRouter } from "next/navigation";
import Loader from "@/components/loader";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [inactive, setInactive] = useState(false);
  const router = useRouter();
  // const INACTIVITY_TIMEOUT = 15 * 60 * 1000; // 15 minutes in milliseconds
  const INACTIVITY_TIMEOUT = 4 * 60 * 60 * 1000; // 4 hours in milliseconds

  useEffect(() => {
    let inactivityTimer = null;
    const resetInactivityTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        // Perform logout action and redirect to login page
        // Clear authentication tokens or sessions
        localStorage.removeItem("accessToken");
        localStorage.removeItem("tokenExpiry");
        localStorage.removeItem("accountType");
        router.push("/login");
      }, INACTIVITY_TIMEOUT);
    };

    const handleActivity = () => {
      resetInactivityTimer();
      if (inactive) {
        setInactive(false);
      }
    };

    // Initial setup
    resetInactivityTimer();

    // Attach event listeners
    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleActivity);
    window.addEventListener("click", handleActivity);
    window.addEventListener("mousedown", handleActivity);
    window.addEventListener("mouseup", handleActivity);
    window.addEventListener("keypress", handleActivity);
    window.addEventListener("keyup", handleActivity);

    return () => {
      clearTimeout(inactivityTimer);
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("click", handleActivity);
      window.removeEventListener("mousedown", handleActivity);
      window.removeEventListener("mouseup", handleActivity);
      window.removeEventListener("keypress", handleActivity);
      window.removeEventListener("keyup", handleActivity);
    };
  }, [router, inactive]);

  const [darkMode, setDarkMode] = useState(false);
  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <html lang="en" className={`app ${!darkMode ? "dark" : "light"}`}>
      <link rel="icon" href="./../favicon.svg" sizes="any" />
      <body>
        <I18nextProvider i18n={i18n}>
          <Providers>
            <Header toggleTheme={toggleTheme} />
            <main className="main-container">{children}</main>
          </Providers>
        </I18nextProvider>
      </body>
    </html>
  );
}
