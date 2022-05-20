import React, { useEffect, useCallback, useState } from 'react';

import styles from '../../styles/Settings.module.css';
import { ButtonGroup, Button, CardGroup, Card, CardImg, CardBody, CardTitle, CardSubtitle, CardText, Spinner } from 'reactstrap';

import { getAccountInfo, getAccounts, selectAccount } from '../../utils/accounts';
import { objectEach } from 'highcharts';

export default function Accounts(props) {
    const { setTitle, checkToken, serverUri, accountId } = props;

    const [accounts, setAccounts] = useState();
    const [isReady, setIsReady] = useState();
    const [type, setType] = useState('info');
    const [inProgress, setInProgress] = useState(true);
    const [data, setData] = useState({});
    const [info, setInfo] = useState({});

    const accountsCb = useCallback(async () => {
        const { accounts } = await getAccounts(serverUri);

        if (accounts) {
            setAccounts(accounts);
        }
    }, [serverUri]);

    const chengeType = useCallback(event => {
        if (type !== event.target.value) {
            setType(event.target.value);
            setInProgress(true);
        }
    }, [type]);

    useEffect(() => {
        setTitle('Счета');
        setIsReady(true);

        if (isReady) {
            accountsCb();
        }

        const checkRequest = async () => {
            const AccountInfo = await getAccountInfo(serverUri, accountId, type);

            if (AccountInfo) {
                setData(AccountInfo);
            } else {
                setData([]);
            }
            setInProgress(false);
        };

        checkRequest();

        const timer = setInterval(() => {
            checkRequest();
        }, 5000);

        if (data) {
            for (const [key, value] of Object.entries(data)) {
                setInfo(value);
            }
        }

        return () => clearInterval(timer);
    }, [isReady, accountsCb, accountId, setTitle, setData, serverUri, type, setInfo, data]);

    /* if (data) {Object.entries(data).forEach(entry => {
        const [key, value] = entry;

        console.log(key
    })}
 */
    return (
        <>
            <div className={styles.AccountsButton}>
                <Button
                    color="primary"
                    onClick={chengeType}
                    active={type === 'server'}
                    outline
                    value="info"
                >
                Info
                </Button>
                <Button
                    color="primary"
                    onClick={chengeType}
                    active={type === 'API'}
                    outline
                    value="tarrif"
                >
                Tarrif
                </Button>
                <Button
                    color="primary"
                    onClick={chengeType}
                    active={type === 'API'}
                    outline
                    value="portfolio"
                >
                Portfolio
                </Button>
                <Button
                    color="primary"
                    onClick={chengeType}
                    active={type === 'API'}
                    outline
                    value="withdrawlimits"
                >
                WithdrawLimits
                </Button>
                <Button
                    color="primary"
                    onClick={chengeType}
                    active={type === 'API'}
                    outline
                    value="marginattr"
                >
                MarginAttr
                </Button>
            </div>
            <GroupAccounts
                accounts={accounts}
                serverUri={serverUri}
                accountId={accountId}
                checkToken={checkToken} />

            {data.length !== 0 &&
            <Card>
                <CardTitle tag="h2" className="text-center">{type}</CardTitle>
                <CardSubtitle
                    className="mb-2 text-muted"
                    tag="h6"
                >
                    {'Ваш тариф: ' + info}
                </CardSubtitle>
                {JSON.stringify(data)}
            </Card>
            }
        </>
    );
}

const GroupAccounts = props => {
    const {
        accountId, checkToken, serverUri,
    } = props;

    const chunks = [];
    const group = [];

    (props.accounts || []).forEach((a, k) => {
        const card = (
            <CardAccount
                key={k}
                name={a.name}
                id={a.id}
                type={a.type}
                status={a.status}
                accessLevel={a.accessLevel}
                serverUri={serverUri}
                accountId={accountId}
                checkToken={checkToken}
            />
        );

        chunks.push(card);

        if (chunks.length && !(chunks.length % 3)) {
            group.push(chunks);
            chunks = [];
        }
    });

    if (chunks.length) {
        group.push(chunks);
    }

    return group.map((g, k) => (
        <CardGroup key={k}>
            {g}
        </CardGroup>
    ));
};

const TYPE_INIT = ['', 'Брокерский счёт', 'ИИС', 'Инвесткопилка'];
const STATUS_INIT = ['', 'В процессе открытия', 'Открытый счёт', 'Закрытый счёт'];
const ACCESS_INIT = ['', 'Полный доступ к счёту.', 'Только чтение', 'Доступ отсутствует'];

const CardAccount = props => {
    const {
        name, id, type, status,
        accessLevel, accountId,
        checkToken, serverUri,
    } = props;

    const onSelect = useCallback(async id => {
        await selectAccount(serverUri, id);

        checkToken();
    }, [serverUri, checkToken]);

    return (
        <Card>
            <CardBody>
                <CardTitle tag="h5">
                    {name} ({id})
                </CardTitle>
                <CardSubtitle
                    className="mb-2 text-muted"
                    tag="h6"
                >
                    <span
                        style={status !== 2 ? {
                            color: '#E33',
                        } : undefined}
                    >
                        {STATUS_INIT[status]}
                    </span>
                </CardSubtitle>
                <CardSubtitle
                    className="mb-2 text-muted"
                    tag="h6"
                >
                    {TYPE_INIT[type]}
                </CardSubtitle>
                <CardSubtitle
                    className="mb-2 text-muted"
                    tag="h6"
                >
                    <span
                        style={accessLevel !== 1 ? {
                            color: '#E33',
                        } : undefined}
                    >
                        {ACCESS_INIT[accessLevel]}
                    </span>
                </CardSubtitle>
                <Button
                    color="primary"
                    outline
                    active={accountId === id}
                    onClick={onSelect.bind(this, id)}
                >
                    {String(accountId) === String(id) ? 'Выбран' : 'Выбрать'}
                </Button>
            </CardBody>
        </Card>
    );
};
