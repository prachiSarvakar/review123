"use client";
import styles from "@/styles/setting.module.scss";
import { useTranslation } from 'react-i18next';
import { Container, Row, Col } from "react-bootstrap";
import { balancesData, statusCheck } from "@/redux/slices/balanceSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxCommon";
import { addCommasToNumber } from "@/utils/prize";

const Others = () => {
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

        } else {
            return "$"+0;
        }
      }
    const Other = [
        {
            "id": 1,
            "title": "Pdt. Fed Call",
            "description": "(Amount that the account in deficit for trades that have accurred but not been paid for)",
            "value": formatValue(balancesObj?.balances?.pdt?.fed_call,true)
        },
        {
            "id":2,
            "title":"Pdt. Maintenance Call",
            "description": "(Amount that the account is under the minimum equity required to support the current positions)",
            "value":formatValue(balancesObj?.balances?.pdt?.maintenance_call,true) 
        },
        {
            "id":3,
            "title":"Pdt. option Buying power",
            "description": "(Amount of funds available to purchase non-marginable securities)",
            "value":formatValue(balancesObj?.balances?.pdt?.option_buying_power,true) 
        },
        {
            "id":4,
            "title":"Pdt. stock Buying power",
            "description": "(Amount of funds available to purchase fully marginable securities)",
            "value": formatValue(balancesObj?.balances?.pdt?.stock_buying_power,true) 
        },
        {
            "id":5,
            "title":"Pdt. stock short value",
            "description": "(Value of shorts stocks)",
            "value":formatValue(balancesObj?.balances?.pdt?.stock_buying_power,true)
        }
    ]

    const OtherList = Other.map((data) =>{
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
                {OtherList}
            </Row>
        </Container>
    )
}

export default Others;
