import React, { useCallback, useEffect } from 'react';
import Image from 'next/image';

import styles from '../../styles/Settings.module.css';
import { Button, Form, FormGroup, Label, Input, FormFeedback, Spinner, FormText, Badge } from 'reactstrap';

import { checkServer, selectToken, getTokens, addToken, delToken, changePassword } from '../../utils/serverStatus';

import { setToLS } from '../../utils/storage';

import { QRCode } from 'react-qrcode-logo';
import { BROKERS } from '../constants';

const isWin32 = process && process.platform === 'win32' || navigator?.platform === 'Win32' || navigator?.userAgentData?.platform === 'Windows';

export default function Settings(props) {
    const {
        setTitle,
        checkToken,
        serverUri,
        brokerId,
        setBrokerId,
        finamStatus,
    } = props;
    const [qrcode, setQrcode] = React.useState(false);

    React.useEffect(() => {
        setTitle('Настройки');

        setQrcode(!['localhost', '127.0.0.1'].includes(location.hostname));
    }, [setTitle, serverUri, setQrcode]);

    return (
        <>
            <AddServerForm
                checkToken={checkToken}
                defaultServerUri={serverUri}
            />
            <SelectBroker
                brokerId={brokerId}
                setBrokerId={setBrokerId}
            />
            {brokerId === 'TINKOFF' && <SettingsFormTinkoff
                checkToken={checkToken}
                defaultServerUri={serverUri}
                brokerId={brokerId}
            />}
            {brokerId === 'FINAM' && <SettingsFormFinam
                checkToken={checkToken}
                defaultServerUri={serverUri}
                brokerId={brokerId}
                finamStatus={finamStatus}
            />}
            {brokerId === 'BINANCE' && <SettingsFormBinance
                defaultServerUri={serverUri}
                brokerId={brokerId}
            />}
            {qrcode &&
            <div className={styles.qrcode}>
                <FormText color="dark"><h4>Открыть интерфейс на телефоне</h4></FormText>
                <QRCode value={window.location.href + `?serveruri=${serverUri}`}/>
            </div>}
        </>
    );
}

const defaultToken = 't.SDIFGUIUbidsGIDBSG-BKMXCJKjgdfgKDSRHGd-HDFHnbdddfg';
const defaultFinamLogin = 'FZTC123456';

const SelectBroker = props => {
    const {
        brokerId,
        setBrokerId,
    } = props;

    const onBrokerClick = useCallback(async b => {
        setBrokerId(b);
    }, [setBrokerId]);

    return (
        <div className={styles.SettingsForm}>
            <h4>Выберите брокера</h4>
            {
                Object.keys(BROKERS).map(b => {
                    const bObj = BROKERS[b];

                    return (
                        <div
                            className={
                                b !== brokerId ?
                                    styles.BrokerSelect :
                                    styles.BrokerSelected
                            }
                            onClick={onBrokerClick.bind(this, b)}
                            key={b}
                        >
                            <Image src={bObj.logo} width={bObj.w} height={bObj.h} alt={bObj.name} /><br/>
                        </div>
                    );
                })
            }
        </div>
    );
};

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

const SettingsFormFinam = props => { // eslint-disable-line sonarjs/cognitive-complexity
    const { checkToken, defaultServerUri, brokerId, finamStatus } = props;

    const [token, setToken] = React.useState(defaultFinamLogin);

    const [tokenInvalid, setTokenInvalid] = React.useState(false);
    const [passwordInvalid, setPasswordInvalid] = React.useState(false);
    const [inProgress, setInprogress] = React.useState(false);

    // Обработчик сохранения формы.
    const handleSubmit = React.useCallback(async e => {
        e.preventDefault();
        const newToken = e.target[0].value;
        const newPassword = e.target[1].value;

        setTokenInvalid(!newToken || newToken === defaultToken);
        setPasswordInvalid(!newPassword);

        if (!tokenInvalid && !passwordInvalid) {
            setInprogress(true);
        }

        const tokenStatus = await addToken(defaultServerUri, newToken, brokerId, newPassword);
        const isInvalid = !tokenStatus || tokenStatus.error;

        setTokenInvalid(isInvalid);

        if (!isInvalid) {
            setToken(newToken);
        }

        setInprogress(false);
        checkToken();
    }, [tokenInvalid, checkToken, defaultServerUri, brokerId, passwordInvalid]);

    return (
        <>
            {!isWin32 ?
                <Form className={styles.SettingsForm} ><FormText color="dark"><h4>Finam доступен только на Windows.</h4></FormText></Form> :
                <>
                    <Form className={styles.SettingsForm} onSubmit={handleSubmit}>
                        <FormText color="dark"><h4>Добавить пользователя</h4></FormText>
                        <FormGroup className={styles.label}>
                            <Label>
                                    Логин
                                <a href="https://articles.opexflow.com/broker" target="_blank" rel="noreferrer" >(?)</a>
                            </Label>
                            <Input
                                name="token"
                                placeholder={token}
                                invalid={tokenInvalid}
                            />
                            <FormFeedback>Не удалось авторизоваться. Проверьте логин.</FormFeedback>
                        </FormGroup>
                        <FormGroup className={styles.label}>
                            <Label>
                                    Пароль
                            </Label>
                            <Input
                                name="password"
                                type="password"
                                invalid={passwordInvalid}
                            />
                            <FormFeedback>Не удалось авторизоваться. Проверьте пароль.</FormFeedback>
                        </FormGroup>

                        {inProgress ?
                            <Spinner size="sm" color="primary" /> :
                            <Button color="primary" className={styles.Submit} >Добавить</Button>
                        }
                    </Form>

                    <center>
                        <h4>
                            {finamStatus ? (finamStatus.connected ? (
                                <>
                                    <br/><br/>Соединение установлено<br/><br/>
                                    {!finamStatus.isFinalInited &&
                                        <b>
                                            <Spinner size="sm"color="success" type="grow" style={{ marginRight: 15, position: 'relative', top: -3 }} />
                                            Подготавливаем данные, наберитесь терпения...
                                        </b>
                                    }
                                    {
                                        finamStatus.isFinalInited ?
                                            (JSON.stringify(finamStatus.messages).indexOf('Password expired') !== -1 ?
                                                <FinamChangePassword
                                                    checkToken={checkToken}
                                                    defaultServerUri={defaultServerUri}
                                                    finamStatus={finamStatus}
                                                    brokerId={brokerId}
                                                /> :
                                                <b style={{ color: '#3A3' }}>Всё готово, можно пользоваться</b>) : ''
                                    }
                                </>
                            ) : (!finamStatus.errorMessage) ?
                                <Spinner size="l" color="primary" /> : (<><br/><br/>{finamStatus.errorMessage}<br/><br/></>
                                )) : null
                            }
                        </h4>
                    </center>

                    <TokensList
                        token={token}
                        brokerId={brokerId}
                        checkToken={checkToken}
                        defaultServerUri={defaultServerUri}
                    />
                </>
            }
        </>
    );
};

const FinamChangePassword = props => { // eslint-disable-line sonarjs/cognitive-complexity
    const { checkToken, defaultServerUri, finamStatus, brokerId } = props;

    const [passwordInvalid, setPasswordInvalid] = React.useState(false);
    const [inProgress, setInprogress] = React.useState(false);

    // Обработчик сохранения формы.
    const handleSubmit = React.useCallback(async e => {
        e.preventDefault();
        const newToken = e.target[0].value;
        const oldPassword = e.target[1].value;
        const newPassword = e.target[2].value;
        const confirmPassword = e.target[3].value;

        setPasswordInvalid(newPassword !== confirmPassword);

        if (!passwordInvalid) {
            setInprogress(true);
        }

        const passwordStatus = await changePassword(defaultServerUri, newToken, brokerId, oldPassword, newPassword);

        if (!passwordStatus || passwordStatus.error) {
            setPasswordInvalid(true);
        }

        setInprogress(false);
        checkToken();
    }, [checkToken, defaultServerUri, brokerId, passwordInvalid]);

    return (
        <>
            <b style={{ color: '#A33' }}>Password expired. Change password.</b>
            <Form className={styles.SettingsForm} onSubmit={handleSubmit}>
                <FormGroup className={styles.label}>
                    <Label>
                            Логин
                    </Label>
                    <Input
                        name="token"
                        disabled
                        value={finamStatus.token}
                    />
                </FormGroup>
                <FormGroup className={styles.label}>
                    <Label>
                            Старый пароль
                    </Label>
                    <Input
                        name="oldpassword"
                        type="password"
                        minlength="6"
                        maxLength="19"
                    />
                </FormGroup>
                <FormGroup className={styles.label}>
                    <Label>
                            Новый пароль
                    </Label>
                    <Input
                        name="newpassword"
                        type="password"
                        minlength="6"
                        maxLength="19"
                    />
                </FormGroup>
                <FormGroup className={styles.label}>
                    <Label>
                            Повторите пароль
                    </Label>
                    <Input
                        name="confirmnewpassword"
                        type="password"
                        minlength="6"
                        maxLength="19"
                        invalid={passwordInvalid}
                    />
                    <FormFeedback>Не удалось изменить пароль.</FormFeedback>
                </FormGroup>
                {passwordInvalid}
                {inProgress ?
                    <Spinner size="sm" color="primary" /> :
                    <Button color="primary" className={styles.Submit} >Отправить</Button>
                }
            </Form>
        </>
    );
};

const SettingsFormBinance = props => {
    const { defaultServerUri } = props;

    // Обработчик сохранения формы.
    // const handleSubmit = React.useCallback(async e => {
    //     e.preventDefault();
    // });

    return (
        <>
            <Form
                className={styles.SettingsForm}

                // onSubmit={handleSubmit}
            >
                <FormText color="dark"><h4>Binance в процессе подключения.</h4></FormText>
            </Form>
        </>
    );
};

const SettingsFormTinkoff = props => {
    const { checkToken, defaultServerUri, brokerId } = props;

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

        const tokenStatus = await addToken(defaultServerUri, newToken, brokerId);
        const isInvalid = !tokenStatus || tokenStatus.error;

        setTokenInvalid(isInvalid);

        if (!isInvalid) {
            setToken(newToken);
        }

        setInprogress(false);
        checkToken();
    }, [tokenInvalid, checkToken, defaultServerUri, brokerId]);

    return (
        <>
            <Form className={styles.SettingsForm} onSubmit={handleSubmit}>
                <FormText color="dark"><h4>Добавить Token</h4></FormText>
                <FormGroup className={styles.label}>
                    <Label>Token <a href="https://articles.opexflow.com/t" target="_blank" rel="noreferrer" >(?)</a></Label>
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
                brokerId={brokerId}
                checkToken={checkToken}
                defaultServerUri={defaultServerUri}
            />
        </>

    );
};

const TokensList = props => {
    const { token, checkToken, defaultServerUri, brokerId } = props;

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

                {tokens && tokens.filter(t => t.brokerId === brokerId).map((t, i) => (
                    <FormGroup key={i} className={styles.Tokens}>
                        <Label className={styles.TokenLable}>
                            {brokerId === 'FINAM' ? t.token : t.token.substr(0, 5)}
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
