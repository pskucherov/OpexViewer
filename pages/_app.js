import 'bootstrap/dist/css/bootstrap.css';
import '../styles/globals.css';
import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import store from '../store/main';
import { settingActions } from '../store/setting-slice';
import { useRouter } from 'next/router';
import { checkServer } from '../utils/serverStatus';
function MyApp({ Component, pageProps }) {
    const router = useRouter();

    // router.push('/settings')
    useEffect(()=>{
        const check = async ()=> {
            const stored = localStorage.getItem('setting');
            if (stored) {
                const serveruri = JSON.parse(stored).serverUri;
                const serverStatus = await checkServer(serveruri);

                if (serverStatus) {
                    router.push('/settings');
                }
            }
        };

        check();
    }, []);
    useEffect(() => {
        typeof document !== undefined ? require('bootstrap/dist/js/bootstrap') : null;
    }, []);

    return <Provider store={store}><Component {...pageProps} /></Provider>;
}
export default MyApp;
