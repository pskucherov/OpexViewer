import React, { useState, useEffect } from 'react';
import { getLogs } from '../utils/serverStatus';

const Logs = () => {
    const [data, setData] = useState({});

    useEffect(function() {
        const url = 'http://localhost:8000/';

        const checkRequest = async () => {
            const Log = await getLogs(url);

            setData(Log);
        };

        checkRequest();
    }, []);

    return (
        <div>
            <h1>Logs Page</h1>
            <div>{data.toString().split('\n').map(k => <p>{k}</p>)}</div>
        </div>
    );
};

export default Logs;
