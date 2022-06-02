import React, { useState, useEffect, useCallback } from 'react';
import { getBrokerReport } from '../utils/accounts';
import { Button, Spinner, Card, CardTitle, CardSubtitle } from 'reactstrap';
import styles from '../styles/Settings.module.css';

export default function Brokerinfo(props) {
    const [data, setData] = useState([]);
    const [time, setTime] = useState('month');
    const [inProgress, setInProgress] = useState(true);

    const { serverUri } = props;

    const chengeType = useCallback(event => {
        if (time !== event.target.value) {
            setTime(event.target.value);
            setInProgress(true);
        }
    }, [time]);

    useEffect(function() {
        const checkRequest = async () => {
            const brokerinfo = await getBrokerReport(serverUri, time);

            if (brokerinfo) {
                setData(brokerinfo);
            } else {
                setData([]);
            }
            setInProgress(false);
        };

        checkRequest();

        const timer = setInterval(() => {
            checkRequest();
        }, 15000);

        return () => clearInterval(timer);
    }, [time, serverUri, data]);

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
                    <div className={styles.BrokerButton}>
                        <Button
                            color="primary"
                            onClick={chengeType}
                            active={time === 'week'}
                            outline
                            value="week"
                        >
                            Неделя
                        </Button>

                        <Button
                            color="primary"
                            onClick={chengeType}
                            active={time === 'month'}
                            outline
                            value="month"
                        >
                            Месяц
                        </Button>
                        <Button
                            color="primary"
                            onClick={chengeType}
                            active={time === 'year'}
                            outline
                            value="year"
                        >
                            Год
                        </Button>
                    </div>
                    <Card
                        body
                        color="info"
                        outline
                    >
                        <CardTitle tag="h6" className="text-center">Данные</CardTitle>
                        <div>
                            <pre>{JSON.stringify(data)}</pre>
                        </div>
                    </Card>
                </div>
            )
    );
}
