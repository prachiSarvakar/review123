"use client";
import styles from "@/styles/setting.module.scss";
import { useTranslation } from 'react-i18next';
import { Container, Row, Col } from "react-bootstrap";
import { balancesData, statusCheck } from "@/redux/slices/balanceSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxCommon";
import { addCommasToNumber } from "@/utils/prize";

const Cash = () => {
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

    const Cash = [
        {
            "id": 1,
            "title": "Total Cash in the Account",
            "description": "(Account balance before fees)",
            "value":formatValue(balancesObj.balances.total_cash,true),
        },
        {
            "id":2,
            "title":"Uncleared fees",
            "description": "(Cash unavailable for trading account)",
            "value": formatValue(balancesObj.balances?.uncleared_fees,true)
        },
        {
            "id":3,
            "title":"Pending cash",
            "value":formatValue(balancesObj.balances.pending_cash,true)
        },
        {
            "id":4,
            "title":"Cash Available",
            "value":formatValue(balancesObj.balances?.cash?.cash_available,true)
        },
        {
            "id":5,
            "title":"Cash sweep",
            "value":formatValue(balancesObj.balances?.cash?.sweep,true)
        },
        {
            "id":6,
            "title":"Cash unsettled funds",
            "description": "(Cash that is in the account from recent stock option sales, but has not yet settled; cash from stock sales occurring the last 3 trading days or fro option sales occurring during the previous trading day )",
            "value":formatValue(balancesObj.balances?.cash?.unsettled_funds,true)
        }
    ]

    const CashList = Cash.map((data) =>{
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
                {CashList}
            </Row>
        </Container>
    )
}

export default Cash;
