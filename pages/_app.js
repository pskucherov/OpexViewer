import 'bootstrap/dist/css/bootstrap.css';
import '../styles/globals.css';
import Page from '../components/Page/Page';

import { useRouter } from 'next/router';

import React, { useCallback, useEffect } from 'react';
import { getSelectedToken, checkServer, getFinamAuthStatus } from '../utils/serverStatus';
import { getFromLS } from '../utils/storage';
import { statusRobot } from '../utils/robots';
import { getBalance } from '../utils/accounts';
import { getPrice } from '../utils/price';
import { BROKERS } from './constants';

const defaultServerUri = 'http://localhost:8000';

/* eslint-disable sonarjs/cognitive-complexity */
function MyApp({ Component, pageProps }) {
    const router = useRouter();

    const routerPush = router.push;
    const { isReady, pathname, asPath, query } = router;

    const [ready, setReady] = React.useState(false);
    const [finamStatus, setFinamStatus] = React.useState();
    const [title, setTitle] = React.useState('');
    const [serverUri, setServerUri] = React.useState(defaultServerUri);
    const [serverStatus, setServerStatus] = React.useState();

    const [isSandboxToken, setIsSandboxToken] = React.useState();
    const [accountId, setAccountId] = React.useState();
    const [robotStartedStatus, setRobotStartedStatus] = React.useState(false);

    const [balance, setBalance] = React.useState();
    const [brokerId, setBrokerId] = React.useState();

    const checkToken = React.useCallback(async () => {
        const newUri = getFromLS('serverUri');

        if (newUri && newUri !== serverUri) {
            setServerUri(newUri);
        }

        const t = await getSelectedToken(serverUri);

        if (t && t.brokerId && brokerId !== t.brokerId) {
            setBrokerId(t.brokerId);
        }

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
                // routerPush('/accounts', undefined, { shallow: true });
            }

            if (t.brokerId === 'TINKOFF') {
                if (typeof t.isSandbox === 'boolean') {
                    setIsSandboxToken(t.isSandbox);
                }
            } else if (t.brokerId === 'FINAM') {
                const f = await getFinamAuthStatus(serverUri);

                setFinamStatus(f);
                setIsSandboxToken(false);

                if ((!f || !f.connected) && pathname !== '/settings' && pathname !== '/logs') {
                    routerPush('/settings', undefined, { shallow: true });
                } else if (!f.accountId && pathname !== '/settings' && pathname !== '/logs') {
                    // routerPush('/accounts', undefined, { shallow: true });
                }
            }
        }

        if ((!t || !t.brokerId) && pathname !== '/settings') {
            routerPush('/settings', undefined, { shallow: true });
        }
    }, [routerPush, pathname, setAccountId, accountId, serverUri, setBrokerId, setFinamStatus, brokerId]);

    const checkRobot = useCallback(async () => {
        const status = await statusRobot(serverUri);

        if (status) {
            // В режиме запущенного робота можно находиться только на страницах логов и инструмента.
            if (asPath !== '/logs' && asPath !== `/instruments/${status.figi}`) {
                routerPush(`/instruments/${status.figi}`, undefined, { shallow: true });
            }

            // ??? if (!robotStartedStatus) {
            setRobotStartedStatus(status);

            // }
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
            }, brokerId === 'FINAM' ? 10000 : 25000);

            intervalStatus = setInterval(() => {
                checkRobot();
            }, 1000);

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
        pathname === '/accounts' ||
        pathname === '/instruments' ||
        pathname === '/logs'
    ) ? (
            <Page
                title={title}
                isSandboxToken={isSandboxToken}
                serverStatus={serverStatus}
                accountId={accountId}
                pathname={pathname}
                balance={balance}
                serverUri={serverUri}
                robotStartedStatus={robotStartedStatus}
                brokerName={BROKERS[brokerId] && BROKERS[brokerId].name}
                finamStatus={finamStatus}
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
                    brokerId={brokerId}
                    setBrokerId={setBrokerId}
                    finamStatus={finamStatus}

                    checkRobot={checkRobot}
                />
            </Page>
        ) : null;
}

export default MyApp;
