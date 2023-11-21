"use client";
import { todayDate, yesterdayDate } from "@/utils/dates";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function Home() {
  const { t, i18n } = useTranslation();
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    router.push(`/trade?q=SPY&start=${yesterdayDate}&end=${todayDate}`);
  }, []);
}
