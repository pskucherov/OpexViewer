import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Page from '../components/Page/Page';
import { settingActions } from '../store/setting-slice';
export default function Home() {
    let state = useSelector(state=>state.setting);
    const dispatch = useDispatch();

    useEffect(()=>{
        state = localStorage.getItem('setting');
        if (state) {
            state = JSON.parse(state);
            const serverUri = state.serverUri;
            const token = state.token;

            dispatch(settingActions.setServerUri(serverUri));
            dispatch(settingActions.setToken(token));
        }
    }, []);

    return (
        <Page>
            <div>{state.token}</div>
            <div>{state.serverUri}</div>
            <div>3</div>
        </Page>
    );
}
