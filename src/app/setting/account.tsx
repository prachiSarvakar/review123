"use client";
import styles from "@/styles/setting.module.scss";
import { useTranslation } from 'react-i18next';
import { Container, Row, Col } from "react-bootstrap";
import { balancesData, statusCheck } from "@/redux/slices/balanceSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxCommon";
import { addCommasToNumber } from "@/utils/prize";


const Account = () => {
    const balancesObj: any = useAppSelector(balancesData);

    const { t, i18n } = useTranslation();
    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };
    
    const formatValue = (amount,addComma) => {
        if (amount == 0) {
            return "$" + amount;
        }
        else if (amount < 0) {
            return "-$" + Math.abs(amount).toFixed(2)

        } else if (amount > 0) {
            if(addComma){
                return "$" + addCommasToNumber(Math.abs(amount).toFixed(2))
            }
            return "$" + Math.abs(amount).toFixed(2)

        } else {
            return "$" + 0;
        }
    }    

    const account = [
        {
            "id": 1,
            "title": t('Setting.Value of short option positions'),
            "value": formatValue(balancesObj.balances.option_short_value,true),
        },
        {
            "id": 2,
            "title": t('Setting.Total account value'),
            "value": formatValue(balancesObj.balances.total_equity,true),
        },
        {
            "id": 3,
            "title": t('Setting.Account number'),
            "value": balancesObj.balances.account_number,
        },
        {
            "id": 4,
            "title": t('Setting.Type of account'),
            "value": balancesObj.balances.account_type
        }
    ]
    const AccountInfo = account.map((data) =>{
        return(
            // eslint-disable-next-line react/jsx-key
            <Col lg={3} sm={6} xs={12}>
                <label>{data.title}</label>
                <strong className={styles.values}>{data.value}</strong>
            </Col>
        )
    }

    )
    return(
        <Container fluid>
            <Row>
                {AccountInfo}
            </Row>
        </Container>
    )
}

export default Account;
