import React, { useState, useEffect, useCallback } from 'react';
import { getLogs } from '../utils/serverStatus';
import { Button } from 'reactstrap';
import styles from '../styles/Settings.module.css';

export default function Logs(props) {
    const [data, setData] = useState([]);
    const [type, setType] = useState('server');
    const [counter, setCounter] = useState(0);

    const { setTitle } = props;

    const chengeType = useCallback(event => {
        if (type !== event.target.value) {
            setType(event.target.value);
        }
    }, [type]);

    useEffect(function() {
        const checkRequest = async () => {
            const Log = await getLogs(props.serverUri, type);

            if (Log) {
                setTitle(type + ' logs');
                setData(Log.split('\r\n'));
                setCounter(data.length);
            } else {
                setCounter(data.length);
            }
        };
        const timer = setInterval(() => {
            checkRequest();
        }, 1000);

        return () => clearInterval(timer);
    }, [type, setTitle, props.serverUri, data]);

    return (
        <div>
            <h1>Всего ошибок: {counter}</h1>
            <div>
                <Button
                    className={styles.SelectButton}
                    onClick={chengeType}
                    value="API">
        API Logs
                </Button>
                <Button
                    className={styles.SelectButton}
                    onClick={chengeType}
                    value="server">
        Server Logs
                </Button>
            </div>
            <div>
                {
                    data.map((str, index) =>
                        <p key={index}>{str}</p>)
                }
            </div>
        </div>
    );
}
