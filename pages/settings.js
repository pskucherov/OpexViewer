import Page from '../components/Page/Page';
import { useEffect } from 'react';
import AddServerForm from '../components/addserver';
import SettingsForm from '../components/settingform';

export default function Settings() {
    return (
        <Page
            title="Настройки"
        >
            <AddServerForm />
            <SettingsForm />
        </Page>
    );
}
