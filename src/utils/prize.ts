import { boolean } from "mathjs";

export const addCommasToNumber = (num) => {
  // Check if the number is a valid number or if it's NaN or undefined
  if (isNaN(num) || num === undefined || num === "" || typeof num === "boolean" || num === null) {
    return "";
  }

  // Convert the number to a string
  const numStr = num?.toString();

  // Split the number into integer and decimal parts
  const [integerPart, decimalPart] = numStr?.split(".");

  // Format the integer part with commas
  const formattedIntegerPart = integerPart?.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  // Combine the formatted integer part and the original decimal part (if it exists)
  const formattedNumber = decimalPart ? `${formattedIntegerPart}.${decimalPart}` : formattedIntegerPart;

  return formattedNumber;
};

export const addCommasFixedTwoToNumber = (input) => {
  const value = parseFloat(input); // Convert to a number

  if (isNaN(value)) {
    return input;
  }
  const valueStr = value.toFixed(2);
  return addCommasToNumber(valueStr);
};
