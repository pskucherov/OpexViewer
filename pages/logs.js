import React, { useState, useEffect } from 'react';
import { getLogs } from '../utils/serverStatus';
import { Button } from 'reactstrap';
import styles from '../styles/Settings.module.css';

const Logs = () => {
    const [data, setData] = useState({});
    const [type, setType] = useState('server');

    function chengeType() {
        if (type !== event.target.value) {
            setType(event.target.value);
            console.log('Новый' + event.target.value);
        }
        console.log(type);
    }

    useEffect(function() {
        const url = 'http://localhost:8000/';

        const checkRequest = async () => {
            const Log = await getLogs(url, type);


            if (data !== Log) {
                setData(Log);
            }
        };
        const timer = setInterval(() => {
            checkRequest();
        }, 10000);
    }, [type]);

    return (
        <div>
            <h1>Logs Page</h1>
            <h2>{type}</h2>
            <div>
                <Button
                    className={styles.SelectButton}
                    onClick={() => chengeType()}
                    value="API">
        API Logs
                </Button>
                <Button
                    className={styles.SelectButton}
                    onClick={() => chengeType()}
                    value="server">
        Server Logs
                </Button>
            </div>
            {data !== false &&
            <div>{data.toString().split('\n').map((str, index) => <p key={index}>{str}</p>)} </div> || <div>Нет данных</div> }
        </div>
    );
};

export default Logs;
