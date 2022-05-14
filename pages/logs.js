import React, { useState, useEffect, useCallback } from 'react';
import { getLogs } from '../utils/serverStatus';
import { Button, Spinner } from 'reactstrap';
import styles from '../styles/Settings.module.css';

export default function Logs(props) {
    const [data, setData] = useState([]);
    const [type, setType] = useState('server');
    const [inProgress, setInProgress] = useState(true);

    const { serverUri } = props;

    const chengeType = useCallback(event => {
        if (type !== event.target.value) {
            setType(event.target.value);
            setInProgress(true);
        }
    }, [type]);

    useEffect(function() {
        const checkRequest = async () => {
            const logs = await getLogs(serverUri, type);

            if (logs) {
                setData(logs);
            } else {
                setData([]);
            }
            setInProgress(false);
        };

        checkRequest();

        const timer = setInterval(() => {
            checkRequest();
        }, 5000);

        return () => clearInterval(timer);
    }, [type, serverUri, data]);

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
                        <Button
                            color="primary"
                            onClick={chengeType}
                            active={type === 'server'}
                            outline
                            value="server"
                        >
                            Server
                        </Button>

                        <Button
                            color="primary"
                            onClick={chengeType}
                            active={type === 'API'}
                            outline
                            value="API"
                        >
                            API
                        </Button>
                    </div>
                    <div>
                        <pre>{data}</pre>
                    </div>
                </div>
            )

    );
}
