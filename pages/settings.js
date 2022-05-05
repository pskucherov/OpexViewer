import Page from '../components/Page/Page';
import { useEffect } from 'react';
import AddServerForm from '../components/addserver';
import SettingsForm from '../components/settingform';
import { useDispatch, useSelector } from 'react-redux';

export default function Settings() {
    const state = useSelector(state=>state.setting);

    useEffect(()=>{
        localStorage.setItem('setting', JSON.stringify(state));
    }, [state]);

    return (
        <Page
            title="Настройки"
        >
            <AddServerForm />
            <SettingsForm />
        </Page>
    );
}
