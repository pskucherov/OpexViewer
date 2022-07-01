import React, { useState, useEffect } from 'react';
import { getBrokerReport } from '../utils/accounts';
import { Spinner, Card, CardTitle } from 'reactstrap';
import styles from '../styles/Settings.module.css';
import { getPrice } from '../utils/price';

export default function BrokerReport(props) {
    const [data, setData] = useState([]);
    const [inProgress, setInProgress] = useState(true);
    const { setTitle } = props;

    const { serverUri } = props;

    useEffect(function() {
        const checkRequest = async () => {
            const brokerReport = await getBrokerReport(serverUri);

            if (brokerReport !== data && brokerReport) {
                setData(brokerReport.getBrokerReportResponse.brokerReport);
            }
            setInProgress(false);
        };

        checkRequest();

        setTitle('Отчет Брокера');
    }, [serverUri, data, setTitle]);

    return (
        inProgress ?
            (
                <center>
                    <Spinner color="primary">
                        Loading...
                    </Spinner>
                </center>
            ) : (
                <div>
                    {data &&
                            data.map(i => (
                                <Card
                                    body
                                    color="info"
                                    outline
                                    key={i.toString}
                                >
                                    <CardTitle tag="h6" className="text-center">Название акции: {i.name}</CardTitle>
                                    <div>
                                        <pre>Вариант сделки: {i.direction}</pre>
                                        <pre>Фиги: {i.figi}</pre>
                                        <pre>Цена за акцию: {getPrice(i.price) + ' ' + i.price.currency}</pre>
                                        <pre>Сумма заказа: {getPrice(i.orderAmount) + ' ' + i.orderAmount.currency}</pre>
                                        <pre>Общая сумма заказа: {getPrice(i.totalOrderAmount) + ' ' + i.totalOrderAmount.currency}</pre>
                                        <pre>Комиссия брокера: {getPrice(i.brokerCommission) + ' ' + i.brokerCommission.currency}</pre>
                                        <pre>TraidId: {i.tradeId}</pre>
                                        <pre>Дата операции: {new Date(i.tradeDatetime).toGMTString()}</pre>
                                    </div>
                                </Card>
                            ))
                    }
                    { data.length <= 0 &&
                        <Card>
                            <CardTitle tag="h3" className="text-center">Нет данных брокера. <br/> Пожалуйста, попробуйте позже </CardTitle>
                        </Card>
                    }
                </div>
            )
    );
}
