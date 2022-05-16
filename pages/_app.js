import 'bootstrap/dist/css/bootstrap.css';
import '../styles/globals.css';
import Page from '../components/Page/Page';

import { useRouter } from 'next/router';

import React, { useEffect } from 'react';
import { getSelectedToken, checkServer } from '../utils/serverStatus';
import { getFromLS } from '../utils/storage';

const defaultServerUri = 'http://localhost:8000';

/* eslint-disable sonarjs/cognitive-complexity */
function MyApp({ Component, pageProps }) {
    const router = useRouter();

    const routerPush = router.push;
    const { isReady, pathname } = router;

    const [ready, setReady] = React.useState(false);
    const [title, setTitle] = React.useState('');
    const [serverUri, setServerUri] = React.useState(defaultServerUri);
    const [serverStatus, setServerStatus] = React.useState();

    const [isSandboxToken, setIsSandboxToken] = React.useState();
    const [accountId, setAccountId] = React.useState();

    const checkToken = React.useCallback(async () => {
        const newUri = getFromLS('serverUri');

        if (newUri !== serverUri) {
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

    useEffect(() => {
        typeof document !== undefined ? require('bootstrap/dist/js/bootstrap') : null;

        let interval;

        if (isReady && ready) {
            interval = setInterval(checkToken, 15000);
            checkToken();
        }

        setReady(true);

        const newUri = getFromLS('serverUri');

        if (newUri !== serverUri) {
            setServerUri(newUri);
        }

        return () => {
            interval && clearInterval(interval);
        };

    // checkToken в deps специально не добавлен, чтобы не было лишних запросов.
    }, [ready, isReady, setServerUri]); // eslint-disable-line react-hooks/exhaustive-deps

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
                serverUri={serverUri}
            >
                <Component
                    {...pageProps}
                    isSandboxToken={isSandboxToken}
                    serverUri={serverUri}
                    setTitle={setTitle}
                    checkToken={checkToken}
                    accountId={accountId}
                />
            </Page>
        ) : null;
}

export default MyApp;
