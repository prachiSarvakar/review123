"use client";
import styles from "@/styles/setting.module.scss";
import { useTranslation } from 'react-i18next';
import { Container, Row, Col } from "react-bootstrap";
import { balancesData, statusCheck } from "@/redux/slices/balanceSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxCommon";
import { addCommasToNumber } from "@/utils/prize";

const PandL = () => {
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


    const requierment = [
        {
            "id": 1,
            "title": "Close PAL",
            "description": "(Gain /Loss od current session closed positions)",
            "value": formatValue(balancesObj?.balances?.close_pl,true) 
        },
        {
            "id":2,
            "title":"Current Requirement",
            "description": "(Gain /Loss od current session closed positions)",
            "value":formatValue(balancesObj?.balances?.current_requirement,true) 
        },
        {
            "id":3,
            "title":"Equity value",
            "value": formatValue(balancesObj?.balances?.equity,true)
        },
        {
            "id":4,
            "title":"Long Market value",
            "value": formatValue(balancesObj?.balances?.long_market_value,true)
        },
        {
            "id":5,
            "title":"Market value",
            "value":formatValue(balancesObj?.balances?.market_value,true)  
        },
        {
            "id":6,
            "title":"Open P & L",
            "description": "(Total Gain /Loss od current account positions)",
            "value": formatValue(balancesObj.balances.open_pl,true) 
        },
        {
            "id":7,
            "title":"Option Long value",
            "description": "(Value of long options positions)",
            "value":formatValue(balancesObj.balances.option_long_value,true)
        },
        {
            "id":8,
            "title":"Option Requirement",
            "value":formatValue(balancesObj.balances.option_requirement,true)
        },
        {
            "id":9,
            "title":"Count of all Pending/ Open Orders",
            "value":formatValue(balancesObj.balances.pending_orders_count,true)
        },
        {
            "id":10,
            "title":"Short Market Value",
            "value":formatValue(balancesObj.balances.short_market_value,true) 
        },
        {
            "id":11,
            "title":"Value of Long equity Positions",
            "value":formatValue(balancesObj.balances.stock_long_value,true) 
        }
    ]

    const PanLList = requierment.map((data) =>{
        return(
             // eslint-disable-next-line react/jsx-key
             <Col lg={3} sm={6} xs={12}>
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
                {PanLList}
            </Row>
        </Container>
    )
}

export default PandL;
