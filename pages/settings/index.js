import React, { useEffect } from 'react';

import styles from '../../styles/Settings.module.css';
import { Button, Form, FormGroup, Label, Input, FormFeedback, Spinner, FormText, Badge } from 'reactstrap';

import { checkServer, selectToken, getTokens, addToken, delToken } from '../../utils/serverStatus';

import { setToLS } from '../../utils/storage';

export default function Settings(props) {
    const { setTitle, checkToken, serverUri } = props;

    React.useEffect(() => {
        setTitle('Настройки');
    }, [setTitle, serverUri]);

    return (
        <>
            <AddServerForm
                checkToken={checkToken}
                defaultServerUri={serverUri}
            />
            <SettingsForm
                checkToken={checkToken}
                defaultServerUri={serverUri}
            />
        </>
    );
}

const defaultToken = 't.SDIFGUIUbidsGIDBSG-BKMXCJKjgdfgKDSRHGd-HDFHnbdddfg';

const AddServerForm = props => {
    const { checkToken, defaultServerUri } = props;

    const [serverUri, setServerUri] = React.useState();
    const [inProgress, setInprogress] = React.useState(true);

    useEffect(() => {
        setServerUri(defaultServerUri);
    }, [defaultServerUri]);

    // Имеет 3 значения (undefined, false, true). На false проверяется явно.
    const [serverInvalid, setServerInvalid] = React.useState();

    // Сохраняем в переменную значения заполняемых полей.
    const handleInputChange = React.useCallback(e => {
        setServerUri(e.target.value);
    }, []);

    // Проверяем состояние сервера при открытии страницы.
    React.useEffect(() => {
        const checkRequest = async () => {
            const serverStatus = await checkServer(serverUri);

            setServerInvalid(!serverStatus);
            setInprogress(false);
        };

        checkRequest();
    }, [serverInvalid, serverUri]);

    // Обработчик сохранения формы.
    const handleSubmit = React.useCallback(async e => {
        e.preventDefault();
        setInprogress(true);

        let checkedUri = serverUri;

        if (checkedUri.slice(-1) === '/') {
            checkedUri = checkedUri.slice(0, checkedUri.length - 1);
            setServerUri(checkedUri);
        }

        const serverStatus = await checkServer(checkedUri);

        if (!serverStatus) {
            setServerInvalid(true);
        } else {
            setServerInvalid(false);
            setToLS('serverUri', checkedUri);
        }

        setInprogress(false);
        checkToken();
    }, [serverUri, checkToken]);

    return (
        <>
            <Form className={styles.SettingsForm} onSubmit={handleSubmit}>
                <FormText color="dark"><h4>Сервер торгового робота</h4></FormText>
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
                    <Button color="primary" className={styles.Submit} >Сохранить</Button>
                }
            </Form>
        </>
    );
};

const SettingsForm = props => {
    const { checkToken, defaultServerUri } = props;

    const [token, setToken] = React.useState(defaultToken);

    const [tokenInvalid, setTokenInvalid] = React.useState(false);
    const [inProgress, setInprogress] = React.useState(false);

    // Обработчик сохранения формы.
    const handleSubmit = React.useCallback(async e => {
        e.preventDefault();
        const newToken = e.target[0].value;

        setTokenInvalid(!newToken || newToken === defaultToken);

        if (!tokenInvalid) {
            setInprogress(true);
        }

        const tokenStatus = await addToken(defaultServerUri, newToken);
        const isInvalid = !tokenStatus || tokenStatus.error;

        setTokenInvalid(isInvalid);

        if (!isInvalid) {
            setToken(newToken);
        }

        setInprogress(false);
        checkToken();
    }, [tokenInvalid, checkToken, defaultServerUri]);

    return (
        <>
            <Form className={styles.SettingsForm} onSubmit={handleSubmit}>
                <FormText color="dark"><h4>Добавить Token</h4></FormText>
                <FormGroup className={styles.label}>
                    <Label>Token <a href="https://tinkoff.github.io/investAPI/token/" target="_blank" rel="noreferrer" >(?)</a></Label>
                    <Input
                        name="token"
                        placeholder={token}
                        invalid={tokenInvalid}
                    />
                    <FormFeedback>Укажитие действующий token.</FormFeedback>
                </FormGroup>
                {inProgress ?
                    <Spinner size="sm" color="primary" /> :
                    <Button color="primary" className={styles.Submit} >Добавить</Button>
                }
            </Form>
            <TokensList
                token={token}
                checkToken={checkToken}
                defaultServerUri={defaultServerUri}
            />
        </>

    );
};

const TokensList = props => {
    const { token, checkToken, defaultServerUri } = props;

    const [tokens, setTokens] = React.useState([]);

    const tokenRequest = React.useCallback(async force => {
        // TODO: redux server uri
        const newTokens = await getTokens(defaultServerUri);

        if (force || newTokens && newTokens.length !== tokens.length) {
            setTokens(newTokens);
        }
    }, [tokens.length, defaultServerUri]);

    // Проверяем состояние сервера при открытии страницы.
    React.useEffect(() => {
        tokenRequest();
    }, [token, tokenRequest]);

    // Обработчик удаления
    const onDelClick = React.useCallback(async token => {
        await delToken(defaultServerUri, token);
        await tokenRequest();
        checkToken();
    }, [checkToken, tokenRequest, defaultServerUri]);

    // Обработчик выбора токена
    const onSelectClick = React.useCallback(async token => {
        await selectToken(defaultServerUri, token);
        await tokenRequest(true);
        checkToken();
    }, [checkToken, tokenRequest, defaultServerUri]);

    return Boolean(tokens && tokens.length) && (
        <>
            <Form className={styles.SettingsForm}>
                <FormText color="dark"><h4>Сохранённые токены</h4></FormText>

                {tokens && tokens.map((t, i) => (
                    <FormGroup key={i} className={styles.Tokens}>
                        <Label className={styles.TokenLable}>
                            {t.token.substr(0, 5)}
                        </Label>
                        {t.isSandbox && (<Badge pill color="warning" className={styles.Badge}>
                            Sandbox
                        </Badge>)}
                        <Button
                            className={styles.DeleteButton} onClick={onDelClick.bind(this, t.token)}
                        >
                            Удалить
                        </Button>
                        <Button
                            className={styles.SelectButton}
                            onClick={onSelectClick.bind(this, t.token)}
                            disabled={t.selected}
                            color="primary"
                            outline={!t.selected}
                        >
                            {t.selected ? 'Выбран\u00a0' : 'Выбрать'}
                        </Button>
                    </FormGroup>
                ))}
            </Form>
        </>
    );
};
