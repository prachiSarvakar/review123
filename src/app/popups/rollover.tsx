"use client";
import React, { useState } from 'react';
import { Form } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "@/styles/popup.module.scss";


const Rollover = () => {
    const [startDate, setStartDate] = useState(new Date());
    return(
        <>
             <ul className={styles.cashAvailable}>
                <li>
                    <label>Cash Available</label>
                    <strong>$504.00</strong>
                </li>
                <li>
                    <label>Expiration Date</label>
                    <strong>29/05/2023</strong>
                </li>
            </ul>
            <Form className="px-4">
                <ul className={styles.leglist}>
                    <li>
                        <strong className={styles.name}>Name</strong>
                        <strong className={styles.legPrice}>Leg Price ($)</strong>
                    </li>
                    <li>
                        <Form.Control type="text" value="Leg 01" disabled className={styles.name} />
                        <div className={styles.legPrice}>
                            <Form.Control type="number" value="150" />
                            <span className="icon-arrow up"></span>
                            <span className="icon-arrow down"></span>
                        </div>
                    </li>
                    <li>
                        <Form.Control type="text" value="Leg 02" disabled className={styles.name} />
                        <div className={styles.legPrice}>
                            <Form.Control type="number" value="150" />
                            <span className="icon-arrow up"></span>
                            <span className="icon-arrow down"></span>
                        </div>
                    </li>
                </ul>
                <div className={styles.Totalprice}>
                    <label>Estimated cost:</label>
                    <strong>$345.00</strong>
                </div>
            </Form>
        </>
    )
}
export default Rollover;