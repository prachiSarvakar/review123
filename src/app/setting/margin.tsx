"use client";
import styles from "@/styles/setting.module.scss";
import { useTranslation } from 'react-i18next';
import { Container, Row, Col } from "react-bootstrap";
import { balancesData, statusCheck } from "@/redux/slices/balanceSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxCommon";
import { addCommasToNumber } from "@/utils/prize";

const Margin = () => {
    const balancesObj: any = useAppSelector(balancesData);

    const { t, i18n } = useTranslation();
    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };
    const formatValue  = (amount,addComma)=>{
        if(amount == 0){
          return "$"+amount;
        }
        else if(amount<0){
          return "-$"+Math.abs( amount ).toFixed(2)
          
        }else if (amount > 0) {
            if(addComma){
                return "$" + addCommasToNumber(Math.abs(amount).toFixed(2))
            }
            return "$" + Math.abs(amount).toFixed(2)

        }else {
            return "$"+0;
        }
      }
    const Margin = [
        {
            "id": 1,
            "title": "Margin Fed Call",
            "description": "(Amount that the account in deficit for trades that have accurred but not been paid for)",
            "value": formatValue(balancesObj?.balances?.margin?.fed_call,true) 
        },
        {
            "id":2,
            "title":"Margin Maintenance Call",
            "description": "(Amount that the account is under the minimum equity required to support the current positions)",
            "value":formatValue(balancesObj?.balances?.margin?.maintenance_call,true)
        },
        {
            "id":3,
            "title":"Margin option Buying power",
            "description": "(Amount of funds available to purchase non-marginable securities)",
            "value":formatValue(balancesObj?.balances?.margin?.option_buying_power,true) 
        },
        {
            "id":4,
            "title":"Margin stock Buying power",
            "description": "(Amount of funds available to purchase fully marginable securities)",
            "value": formatValue(balancesObj?.balances?.margin?.stock_buying_power,true)
        },
        {
            "id":5,
            "title":"Margin stock short value",
            "description": "(Value of shorts stocks)",
            "value": formatValue(balancesObj?.balances?.margin?.stock_short_value,true) 
        },
        /* {
            "id":6,
            "title":"Day Trade Buying Power",
            "value": `$${(balancesObj?.balances?.margin?.fed_call)?balancesObj?.balances?.margin?.fed_call:0}`
        }, */
        {
            "id":7,
            "title":"Margin Sweep",
            "value": formatValue(balancesObj?.balances?.margin?.sweep,true)
        }
    ]

    const MarginList = Margin.map((data) =>{
        return(
             // eslint-disable-next-line react/jsx-key
             <Col lg={4} sm={6} xs={12}>
                <label>{data.title}</label>
                {/*  className={data.description.length >= 1 ? '' : 'd-none'} */}
                <span>{data.description}</span>
                <strong className={styles.values}>{data.value}</strong>
            </Col>
        )
    })

    return(
        <Container fluid>
            <Row>
                {MarginList}
            </Row>
        </Container>
    )
}

export default Margin;
