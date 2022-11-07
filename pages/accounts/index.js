import React, { useEffect, useCallback, useState } from 'react';

import { Button, CardGroup, Card, CardBody, CardTitle, CardSubtitle, Spinner } from 'reactstrap';

import { getAccountInfo, getAccounts, selectAccount } from '../../utils/accounts';
import { getPrice } from '../../utils/price';

export default function Accounts(props) {
    const { setTitle, checkToken, serverUri, accountId, brokerId } = props;

    const [accounts, setAccounts] = useState();
    const [isReady, setIsReady] = useState();
    const [inProgress, setInProgress] = useState(!accountId);
    const [info, setInfo] = useState();
    const [tarrif, setTarrif] = useState();
    const [portfolio, setPortfolio] = useState();
    const [withdrawLimits, setWithdrawLimits] = useState();
    const [marginAttr, setMarginAttr] = useState();
    const [currency, setCurrency] = useState();

    const accountsCb = useCallback(async () => {
        const { accounts } = await getAccounts(serverUri);

        if (accounts) {
            setAccounts(accounts);
        }
    }, [serverUri]);

    const accountInfoCb = useCallback(async () => {
        if (!accountId) {
            return;
        }

        const answer = await getAccountInfo(serverUri);

        if (!answer) {
            return;
        }

        const {
            info,
            tarrif,
            portfolio,
            withdrawlimits,
            marginattr,
        } = answer;

        setInfo(info);
        setTarrif(tarrif);
        setPortfolio(portfolio);
        setWithdrawLimits(withdrawlimits);
        setMarginAttr(marginattr);

        if (portfolio && portfolio.totalAmountShares?.currency === 'rub') {
            setCurrency(' ₽');
        }
    }, [setCurrency, accountId, serverUri]);

    useEffect(() => {
        setTitle('Счета');
        setIsReady(true);

        if (isReady) {
            accountsCb();
            accountInfoCb();
        }

        const i = setInterval(() => {
            if (!accounts || !accounts.length) {
                accountsCb();
                accountInfoCb();
            } else {
                clearInterval(i);
            }
        }, 5000);

        return () => {
            i && clearInterval(i);
        };
    }, [isReady, accountsCb, accountId, setTitle, serverUri, accountInfoCb, brokerId]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <>
            {accounts && accounts.length ?
                <GroupAccounts
                    accounts={accounts}
                    serverUri={serverUri}
                    accountId={accountId}
                    checkToken={checkToken}
                    brokerId={brokerId}
                /> : <center><br/><br/><Spinner size="l" color="primary" /><br/><br/></center>}

            <Card
                body
                color="info"
                outline
            >
                {info && info.tariff && <>
                    <CardSubtitle
                        className="mb-2 text-muted"
                        tag="h6"
                    >
                        {'Ваш тариф: ' + info.tariff} <br/>
                        {'Премиум : '}{info.premStatus ? 'да' : 'нет'}
                    </CardSubtitle>
                </>}

                {Boolean(portfolio &&
                    (typeof portfolio.totalAmountCurrencies !== 'undefined' ||
                    brokerId === 'FINAM' && Object.keys(portfolio).length)) &&
                <>
                    <CardTitle tag="h6" className="text-start">Портфель</CardTitle>
                    <CardSubtitle
                        className="mb-2 text-muted"
                        tag="h6"
                    >
                        {brokerId === 'FINAM' ? (
                            <pre>{JSON.stringify(portfolio, null, 4)}</pre>
                        ) : (
                            <>
                                {'Общая стоимость акций: ' + getPrice(portfolio.totalAmountShares) + currency} <br/>
                                {'Общая стоимость валют: ' + getPrice(portfolio.totalAmountCurrencies) + currency} <br/>
                                {'Общая стоимость облигаций: ' + getPrice(portfolio.totalAmountBonds) + currency} <br/>
                                {'Общая стоимость фьючерсов: ' + getPrice(portfolio.totalAmountFutures) + currency} <br/>
                                {'Общая стоимость фондов: ' + getPrice(portfolio.totalAmountEtf) + currency} <br/>
                                {portfolio.expectedYield && 'Текущая доходность портфеля: ' + getPrice(portfolio.expectedYield) + '%'}
                            </>
                        )
                        }

                    </CardSubtitle>
                </>
                }
                {marginAttr && typeof marginAttr.liquidPortfolio !== 'undefined' &&
            <>
                <CardTitle tag="h6" className="text-start">Маржинальные показатели по счёту</CardTitle>
                <CardSubtitle
                    className="mb-2 text-muted"
                    tag="h6"
                >
                    {'Ликвидная стоимость портфеля: ' + getPrice(marginAttr.liquidPortfolio) + currency} <br/>
                    {'Начальная маржа: ' + getPrice(marginAttr.startingMargin) + currency} <br/>
                    {'Минимальная маржа: ' + getPrice(marginAttr.minimalMargin) + currency} <br/>
                    {'Уровень достаточности средств: ' + getPrice(marginAttr.fundsSufficiencyLevel).toFixed(2) + currency} <br/>
                    {'Объем недостающих средств: ' + getPrice(marginAttr.amountOfMissingFunds) + currency}
                </CardSubtitle>
            </>
                }

                {withdrawLimits && withdrawLimits.money && Boolean(withdrawLimits.money.length) &&
                <CardSubtitle
                    className="mb-2 text-muted"
                    tag="h6"
                >
                    {'Доступные для вывода средства: ' + getPrice(withdrawLimits.money[0]) + currency} <br/>
                </CardSubtitle>
                }
            </Card>
        </>
    );
}

const GroupAccounts = props => {
    const {
        accountId, checkToken, serverUri, accounts, brokerId,
    } = props;

    const chunks = [];
    const group = [];

    (accounts || []).forEach((a, k) => {
        const card = (
            <CardAccount
                key={k}
                name={a.name || a.union}
                id={a.id}
                type={a.type}
                status={a.status}
                accessLevel={a.accessLevel}
                serverUri={serverUri}
                accountId={accountId}
                checkToken={checkToken}
                other={brokerId === 'FINAM' ? JSON.stringify(a) : undefined}
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
        checkToken, serverUri, other,
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

                {other && <CardSubtitle
                    className="mb-2 text-muted"
                    tag="h6"
                >
                    {other}
                </CardSubtitle>}

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
