import React, { useEffect, useCallback, useState } from 'react';

import styles from '../../styles/Settings.module.css';
import { ButtonGroup, Button, CardGroup, Card, CardImg, CardBody, CardTitle, CardSubtitle, CardText, Spinner } from 'reactstrap';

import { getAccounts, selectAccount } from '../../utils/accounts';

export default function Accounts(props) {
    const { setTitle, checkToken, serverUri, accountId } = props;

    const [accounts, setAccounts] = useState();
    const [isReady, setIsReady] = useState();

    const accountsCb = useCallback(async () => {
        const { accounts } = await getAccounts(serverUri);

        if (accounts) {
            setAccounts(accounts);
        }
    }, [serverUri]);

    useEffect(() => {
        setTitle('Счета');
        setIsReady(true);

        if (isReady) {
            accountsCb();
        }
    }, [isReady, accountsCb, accountId, setTitle]);

    return (
        <GroupAccounts
            accounts={accounts}
            serverUri={serverUri}
            accountId={accountId}
            checkToken={checkToken}
        />
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
                    {STATUS_INIT[status]}
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
                    {ACCESS_INIT[accessLevel]}
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
