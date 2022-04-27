import React from 'react';

import styles from '../styles/Settings.module.css';
import { Button, Form, FormGroup, Label, Input, FormFeedback, Spinner, FormText, Badge } from 'reactstrap';

import { checkServer, getTokens, delToken } from '../utils/serverStatus';

import Page from '../components/Page/Page';

export default function Settings() {
    return (
        <Page
            title="Настройки"
        >
            <AddServerForm />
            <SettingsForm />
            <TokensList />
        </Page>
    );
}

const defaultToken = 't.SDIFGUIUbidsGIDBSG-BKMXCJKjgdfgKDSRHGd-HDFHnbdddfg';
const defaultServerUri = 'http://localhost:8000/';

const AddServerForm = () => {
    const [serverUri, setServerUri] = React.useState(defaultServerUri);
    const [inProgress, setInprogress] = React.useState(true);

    // Имеет 3 значения (undefined, false, true). На false проверяется явно.
    const [serverInvalid, setServerInvalid] = React.useState();

    // Сохраняем в переменную значения заполняемых полей.
    const handleInputChange = React.useCallback(e => {
        setServerUri(e.target.value);
    }, []);

    const checkRequest = async () => {
        const serverStatus = await checkServer(serverUri);

        setServerInvalid(!serverStatus);
        setInprogress(false);
    };

    // Проверяем состояние сервера при открытии страницы.
    React.useEffect(() => {
        checkRequest();
    }, [serverInvalid]);

    // Обработчик сохранения формы.
    const handleSubmit = React.useCallback(async e => {
        e.preventDefault();
        setInprogress(true);

        const serverStatus = await checkServer(serverUri);

        if (!serverStatus) {
            setServerInvalid(true);
        } else {
            setServerInvalid(false);
        }

        // TODO: сохранить сервер.
        setInprogress(false);
    }, [serverUri]);

    return (
        <>
            <Form className={styles.SettingsForm} onSubmit={handleSubmit}>
                <FormText><h4>Сервер торгового робота</h4></FormText>
                <FormGroup className={styles.label}>
                    <Label>Server <a href="https://github.com/pskucherov/TinkoffTradingBot" target="_blank" rel="noreferrer" >(?)</a></Label>
                    <Input name="serveruri" placeholder={serverUri} onChange={handleInputChange} value={serverUri}
                        invalid={serverInvalid}
                        valid={serverInvalid === false}
                    />
                    <FormFeedback>Сервер недоступен.</FormFeedback>
                </FormGroup>
                {inProgress ?
                    <Spinner size="sm" color="primary" /> :
                    <Button className={styles.Submit} >Сохранить</Button>
                }
            </Form>
        </>
    );
};

const SettingsForm = () => {
    const [token, setToken] = React.useState(defaultToken);

    const [tokenInvalid, setTokenInvalid] = React.useState(false);
    const [inProgress, setInprogress] = React.useState(false);

    // Сохраняем в переменную значения заполняемых полей.
    const handleInputChange = React.useCallback(e => {
        setToken(e.target.value);
    }, []);

    // Обработчик сохранения формы.
    const handleSubmit = React.useCallback(async e => {
        e.preventDefault();

        setTokenInvalid(!token || token === defaultToken);

        if (!tokenInvalid) {
            setInprogress(true);
        }

        // TODO: отправка токена
    }, [token, tokenInvalid]);

    return (
        <>
            <Form className={styles.SettingsForm} onSubmit={handleSubmit}>
                <FormText><h4>Добавить Token</h4></FormText>
                <FormGroup className={styles.label}>
                    <Label>Token <a href="https://tinkoff.github.io/investAPI/token/" target="_blank" rel="noreferrer" >(?)</a></Label>
                    <Input name="token" placeholder={token} onChange={handleInputChange}
                        invalid={tokenInvalid}
                    />
                    <FormFeedback>Укажитие token для робота.</FormFeedback>
                </FormGroup>
                {inProgress ?
                    <Spinner size="sm" color="primary" /> :
                    <Button className={styles.Submit} >Добавить</Button>
                }
            </Form>
        </>

    );
};

const TokensList = () => {
    const [tokens, setTokens] = React.useState();

    const tokenRequest = async () => {
        // TODO: redux server uri
        const tokens = await getTokens(defaultServerUri);

        setTokens(tokens);
    };

    // Проверяем состояние сервера при открытии страницы.
    React.useEffect(() => {
        tokenRequest();
    }, [tokens]);

    // Обработчик удаления
    const onDelClick = React.useCallback(async token => {
        await delToken(defaultServerUri, token);
    }, []);

    // Обработчик выбора токена
    const onSelectClick = React.useCallback(async () => {
        // TODO: select token.
    }, []);

    return Boolean(tokens && tokens.length) && (
        <>
            <Form className={styles.SettingsForm}>
                <FormText><h4>Сохранённые токены</h4></FormText>

                {tokens && tokens.map((t, i) => (
                    <FormGroup key={i} className={styles.Tokens}>
                        <Label className={styles.TokenLable}>
                            {t.token.substr(0, 5)}
                        </Label>
                        {t.isSandbox && (<Badge pill className={styles.Badge}>
                            Sandbox
                        </Badge>)}
                        <Button
                            className={styles.DeleteButton} onClick={onDelClick.bind(this, t.token)}
                        >
                            Удалить
                        </Button>
                        <Button
                            className={styles.SelectButton} onClick={onSelectClick.bind(this, t.token)}
                        >
                            Выбрать
                        </Button>
                    </FormGroup>
                ))}
            </Form>
        </>
    );
};
