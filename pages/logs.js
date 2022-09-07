import React, { useState, useEffect, useCallback } from 'react';
import { getLogs } from '../utils/serverStatus';
import { Button, Spinner } from 'reactstrap';
import styles from '../styles/Settings.module.css';

export default function Logs(props) {
    const [data, setData] = useState([]);
    const [type, setType] = useState('server');
    const [inProgress, setInProgress] = useState(true);

    const { serverUri, brokerId, finamStatus } = props;

    const chengeType = useCallback(event => {
        if (type !== event.target.value) {
            setType(event.target.value);
            setData([]);
            setInProgress(true);
        }
    }, [type]);

    useEffect(function() {
        const checkRequest = async () => {
            const logs = type === 'tconnector' ? JSON.stringify(
                [finamStatus?.errorMessage || '', ...(finamStatus?.messages || [])].filter(f => Boolean(f)), null, 4,
            ) : await getLogs(serverUri, type);

            if (logs) {
                setData(logs);
            }
            setInProgress(false);
        };

        checkRequest();

        const timer = setInterval(() => {
            checkRequest();
        }, 5000);

        return () => clearInterval(timer);
    }, [type, serverUri, data, finamStatus?.errorMessage, finamStatus?.messages]);

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
                    <div className={styles.LogsButton}>
                        {Boolean(brokerId === 'FINAM' && finamStatus && finamStatus.messages) &&
                            <Button
                                key={0}
                                color="primary"
                                onClick={chengeType}
                                active={type === 'tconnector'}
                                outline
                                value="tconnector"
                            >
                                TConnector
                            </Button>
                        }
                        <Button
                            key={1}
                            color="primary"
                            onClick={chengeType}
                            active={type === 'server'}
                            outline
                            value="server"
                        >
                            Server
                        </Button>

                        <Button
                            key={2}
                            color="primary"
                            onClick={chengeType}
                            active={type === 'API'}
                            outline
                            value="API"
                        >
                            API
                        </Button>

                        {
                            brokerId === 'FINAM' && ['dsp', 'ts', 'xdf'].map((name, k) => (
                                <Button
                                    key={k + 3}
                                    color="primary"
                                    onClick={chengeType}
                                    active={type === name}
                                    outline
                                    value={name}
                                >
                                    {name.toUpperCase()}
                                </Button>
                            ))
                        }
                    </div>
                    <div>
                        <pre>{data}</pre>
                    </div>
                </div>
            )

    );
}
