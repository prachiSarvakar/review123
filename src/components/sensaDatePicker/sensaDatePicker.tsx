"use client";
import Image from "next/image";
import styles from "@/styles/cashflow.module.scss";
import React, { useState, useRef } from "react";
import { InputGroup } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dateIcon from "../../../public/assets/images/calendar_month.svg";

const SensaDatePicker = ({setSelectedDate, selectedDate}) => {
 //   const [selectedDate, setSelectedDate] = useState(null);
 const datePickerRef = useRef(null);
 const [isDisabled, setIsDisabled] = useState(true);

 const handleTextChange = () => {
   setIsDisabled(false);
 };

 const handleDateChange = (date) => {
   setSelectedDate(date);
 };

 const openDatePicker = () => {
   if (datePickerRef.current) {
     datePickerRef.current.setOpen(true);
   }
 };


 return (
    <InputGroup className="date-picker">
      <DatePicker
        placeholderText="dd:mm:yyyy"
        selected={selectedDate}
        onChange={handleDateChange}
        dateFormat="MM/dd/yyyy"
        ref={datePickerRef}
        className="date"
        onFocus={handleTextChange}
        disabled={isDisabled ? handleTextChange : isDisabled}
      />
      <InputGroup.Text
        id="basic-addon2"
        className="calendar-icon"
        onClick={openDatePicker}
      >
       <Image src={dateIcon} height={20} width={20} alt="DateIcon" />
      </InputGroup.Text>
    </InputGroup>
  );


};
export default SensaDatePicker;
