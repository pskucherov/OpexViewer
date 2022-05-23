import 'bootstrap/dist/css/bootstrap.css';
import '../styles/globals.css';
import Page from '../components/Page/Page';

import { useRouter } from 'next/router';

import React, { useCallback, useEffect } from 'react';
import { getSelectedToken, checkServer } from '../utils/serverStatus';
import { getFromLS } from '../utils/storage';
import { statusRobot } from '../utils/robots';
import { getBalance } from '../utils/accounts';
import { getPrice } from '../utils/price';

const defaultServerUri = 'http://localhost:8000';

/* eslint-disable sonarjs/cognitive-complexity */
function MyApp({ Component, pageProps }) {
    const router = useRouter();

    const routerPush = router.push;
    const { isReady, pathname, asPath, query } = router;

    const [ready, setReady] = React.useState(false);
    const [title, setTitle] = React.useState('');
    const [serverUri, setServerUri] = React.useState(defaultServerUri);
    const [serverStatus, setServerStatus] = React.useState();

    const [isSandboxToken, setIsSandboxToken] = React.useState();
    const [accountId, setAccountId] = React.useState();
    const [robotStartedStatus, setRobotStartedStatus] = React.useState(false);

    const [balance, setBalance] = React.useState();

    const checkToken = React.useCallback(async () => {
        const newUri = getFromLS('serverUri');

        if (newUri && newUri !== serverUri) {
            setServerUri(newUri);
        }

        const t = await getSelectedToken(serverUri);

        if (!t) {
            setIsSandboxToken();

            if (await checkServer(serverUri)) {
                setServerStatus(true);
            } else {
                setServerStatus(false);
            }
        } else {
            setServerStatus(true);

            if (t.accountId && t.accountId !== accountId) {
                setAccountId(t.accountId);
            } else if (!t.accountId && pathname !== '/settings') {
                routerPush('/accounts');
            }
        }

        if (t && typeof t.isSandbox === 'boolean') {
            setIsSandboxToken(t.isSandbox);
        } else if (pathname !== '/settings') {
            routerPush('/settings');
        }
    }, [routerPush, pathname, accountId, serverUri]);

    const checkRobot = useCallback(async () => {
        const status = await statusRobot(serverUri);

        if (status) {
            // В режиме запущенного робота можно находиться только на страницах логов и инструмента.
            if (asPath !== '/logs' && asPath !== `/instruments/${status.figi}`) {
                routerPush(`/instruments/${status.figi}`);
            }

            if (!robotStartedStatus) {
                setRobotStartedStatus(status);
            }
        } else if (robotStartedStatus && !status) {
            setRobotStartedStatus();
        }
    }, [routerPush, serverUri, asPath, robotStartedStatus, setRobotStartedStatus]);

    /**
     * Ходит за балансом для отрисовки на странице.
     */
    const getBalanceRequest = useCallback(async () => {
        if (!accountId) {
            return;
        }

        const f = await getBalance(serverUri, accountId);
        let balanceValue = 0;

        if (f) {
            const arr = ['expectedYield', 'positions'];
            let currency = '';

            if (f.totalAmountShares.currency === 'rub') {
                currency = ' ₽';
            }

            for (const [key, value] of Object.entries(f)) {
                if (key !== arr[0] && key !== arr[1]) {
                    balanceValue += getPrice(value);
                }
            }

            setBalance(parseFloat(balanceValue).toFixed(2) + currency);
        }
    }, [setBalance, accountId, serverUri]);

    useEffect(() => {
        typeof document !== undefined ? require('bootstrap/dist/js/bootstrap') : null;

        let interval;
        let intervalStatus;

        if (isReady && ready) {
            interval = setInterval(() => {
                checkToken();
                getBalanceRequest();
            }, 25000);

            intervalStatus = setInterval(() => {
                checkRobot();
            }, 5000);

            checkToken();
            checkRobot();
            getBalanceRequest();
        }

        setReady(true);

        const newUri = getFromLS('serverUri');
        const serverUriFromParam = query && query.serveruri;

        if (newUri && newUri !== serverUri) {
            setServerUri(newUri);
        } else if (serverUriFromParam && serverUriFromParam !== serverUri) {
            setServerUri(serverUriFromParam);
        }

        return () => {
            interval && clearInterval(interval);
            intervalStatus && clearInterval(intervalStatus);
        };

    // checkToken в deps специально не добавлен, чтобы не было лишних запросов.
    }, [ready, isReady, setServerUri, getBalanceRequest]); // eslint-disable-line react-hooks/exhaustive-deps

    return ((typeof isSandboxToken !== 'undefined' && typeof accountId !== 'undefined') ||
        pathname === '/settings' ||
        pathname === '/accounts'
    ) ? (
            <Page
                title={title}
                isSandboxToken={isSandboxToken}
                serverStatus={serverStatus}
                accountId={accountId}
                pathname={pathname}
                balance={balance}
            >
                <Component
                    {...pageProps}
                    isSandboxToken={isSandboxToken}
                    serverUri={serverUri}
                    setTitle={setTitle}
                    checkToken={checkToken}
                    accountId={accountId}
                    robotStartedStatus={robotStartedStatus}
                    setRobotStartedStatus={setRobotStartedStatus}
                />
            </Page>
        ) : null;
}

export default MyApp;
