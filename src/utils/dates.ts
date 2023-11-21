// logic for 1D
export const todayDate = new Date().toISOString().slice(0, 10);
const todayDateNew = new Date();
todayDateNew.setDate(todayDateNew.getDate() - 1);
export const yesterdayDate = todayDateNew.toISOString().slice(0, 10);

// logic for 1W
const curr = new Date();
export const lastday = curr.toISOString().slice(0, 10);
export const firstday = new Date(curr.getFullYear(), curr.getMonth(), curr.getDate() - 5).toISOString().slice(0, 10);

// const curr = new Date(); // get current date
// const first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
// const last = first + 6; // last day is the first day + 6
// export const firstday = new Date(curr.setDate(first)).toISOString().slice(0, 10);
// export const lastday = new Date(curr.setDate(last)).toISOString().slice(0, 10);

// logic for 1M

const dateForOneMonth = new Date();
export const LastMonthEndDate = dateForOneMonth.toISOString().slice(0, 10);
dateForOneMonth.setMonth(dateForOneMonth.getMonth() - 1);
export const LastMonthStartDate = dateForOneMonth.toISOString().slice(0, 10);

// logic for 3M
// var dateForThreeMonths = new Date();
// const endDate = dateForThreeMonths.toISOString().slice(0, 10);
// dateForThreeMonths.setMonth(dateForThreeMonths.getMonth() - 3);
// const startDate = dateForThreeMonths.toISOString().slice(0, 10);

// logic for 1Y
// const todayDateForYear = new Date().toISOString().slice(0, 10);
// const lastYearDateFromNow = new Date();
// lastYearDateFromNow.setFullYear(lastYearDateFromNow.getFullYear() - 1);
// const lastDateForYear = lastYearDateFromNow.toISOString().slice(0, 10);

export const formatDate = (dateString: any) => {
  const date = new Date(dateString);
  const finalDate = new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds()
  );
  const options: any = { month: "short", day: "numeric" };
  const formattedDate = finalDate.toLocaleDateString("en-US", options);
  return formattedDate;
};

export function roundDecimal(decimalValue: number) {
  var adjustedValue = decimalValue - 0.5;
  var roundedValue = Math.floor(adjustedValue);
  return roundedValue;
}

export const findNearestLargestValue = (currentStock: any, value: any) => {
  const filteredValues = value.filter((value: any) => value > currentStock);
  const sortedValues = filteredValues.sort((a: any, b: any) => a - b);

  if (sortedValues.length !== 0) {
    return sortedValues[0];
  }
  return null;
};

export const capitalizeFirstLetter = (str) => {
  if (typeof str !== "string" || str.length === 0) {
    return str;
  }

  return str.charAt(0).toUpperCase() + str.slice(1);
};


// this function removes the leading 0 from the date => for 01 return 0.
const dateTrim = (inputDate) => {
  const parts = inputDate.split('-');
  
  const year = parts[0];
  const month = parts[1];
  let day = parts[2];
  
  day = parseInt(day, 10).toString();
  return`${year}-${month}-${day}`;
}

// * Formats a date string to 'yyyy-mm-dd' and increments dd from '01' to '02'.
// 01 day gives month as a month less than current i.e for 2023-01-01 it gives Dec not Jan
const dayChangeFromOneToTwo = (inputDate) => {
  const parts = inputDate.split('-');
  
  const year = parts[0];
  const month = parts[1];
  let day = parts[2];
  
  if (day === '01') {
    day = (parseInt(day, 10) + 1).toString().padStart(2, '0');
  }
  
  return `${year}-${month}-${day}`;
}

// Place order popup date format

export const formattedDate = (inputDate) => {
  const dateParts = inputDate?.split("-");
  if (dateParts?.length === 3) {
    const year = dateParts[0]?.substring(2);
    let month = new Date(dateTrim(inputDate))?.toLocaleString("default", { month: "short" });
    if(month == null || month === undefined || month === "" || month === "Invalid Date") {
      month = new Date(dayChangeFromOneToTwo(inputDate))?.toLocaleString("default", { month: "short" });
    }
    const day = dateParts[2];
    return `${month} ${day} ('${year})`;
  } else {
    return "Invalid Date";
  }
};

export const convertDateFormat = (inputDate) => {
  const match = inputDate?.match(/^(\w{3}) (\d{1,2}) \('(\d{2})\)$/);

  if (match) {
    const monthAbbreviation = match[1];
    const day = match[2];
    const yearAbbreviation = match[3];
    const monthAbbreviations = {
      Jan: "01",
      Feb: "02",
      Mar: "03",
      Apr: "04",
      May: "05",
      Jun: "06",
      Jul: "07",
      Aug: "08",
      Sep: "09",
      Oct: "10",
      Nov: "11",
      Dec: "12",
    };
    const formattedMonth = monthAbbreviations[monthAbbreviation];
    const formattedYear = `20${yearAbbreviation}`;
    const formattedDate = `${formattedYear}-${formattedMonth}-${day}`;
    return formattedDate;
  } else {
    return "Invalid date format";
  }
};

export const formatedDate = (inputDate) => {
  const date = new Date(inputDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const convertDateToUTCFormat = (date) => {
  const expirationDates = new Date(date);
  const expirationDateUTC = new Date(
    expirationDates.getUTCFullYear(),
    expirationDates.getUTCMonth(),
    expirationDates.getUTCDate(),
    expirationDates.getUTCHours(),
    expirationDates.getUTCMinutes(),
    expirationDates.getUTCSeconds()
  );
  expirationDateUTC.setHours(16, 0, 0, 0);
  return expirationDateUTC;
};

export function formatDateTypeForLegs(dateString) {
  const currentDate = new Date();
  const inputDate = new Date(dateString);

  const inputYear = inputDate.getFullYear();
  const currentYear = currentDate.getFullYear();

  if (inputYear === currentYear) {
    // Same year as current year, format as "DD/MM"
    const day = inputDate.getDate();
    const month = inputDate.getMonth() + 1; // Month is zero-based
    return `${day}/${month < 10 ? "0" : ""}${month}`;
  } else {
    // Different year, format as "DD/MM/YY"
    const day = inputDate.getDate();
    const month = inputDate.getMonth() + 1; // Month is zero-based
    const shortYear = inputYear.toString().slice(-2);
    return `${day}/${month < 10 ? "0" : ""}${month}/${shortYear}`;
  }
}
