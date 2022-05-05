import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Page from '../components/Page/Page';

export default function Home() {
    const state = useSelector(state=>state.setting);

    useEffect(()=>{
        localStorage.setItem('setting', JSON.stringify(state));
    }, [state]);

    return (
        <Page>
            <div>{state.token}</div>
            <div>{state.serverUri}</div>
            <div>3</div>
        </Page>
    );
}
