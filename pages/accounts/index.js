import React, { useEffect, useCallback, useState } from 'react';

import styles from '../../styles/Settings.module.css';
import { ButtonGroup, Button, CardGroup, Card, CardImg, CardBody, CardTitle, CardSubtitle, CardText, Spinner } from 'reactstrap';

import { getAccountInfo, getAccounts, selectAccount } from '../../utils/accounts';
import { objectEach } from 'highcharts';
import { getPrice } from '../../utils/price';

export default function Accounts(props) {
    const { setTitle, checkToken, serverUri, accountId } = props;

    const [accounts, setAccounts] = useState();
    const [isReady, setIsReady] = useState();
    const [type, setType] = useState('info');
    const [inProgress, setInProgress] = useState(true);
    const [data, setData] = useState({});
    const [info, setInfo] = useState({});
    const [tarrif, setTarrif] = useState({});
    const [portfolio, setPortfolio] = useState({});
    const [withdrawLimits, setWithdrawLimits] = useState({});
    const [marginAttr, setMarginAttr] = useState({});
    const [currency, setCurrency] = useState();

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
            if (!accountId) {
                return;
            }

            const answer = await getAccountInfo(serverUri, accountId);

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

            if (portfolio && portfolio.totalAmountShares.currency === 'rub') {
                setCurrency(' ₽');
            }
        };

        checkRequest();

        const timer = setInterval(() => {
            checkRequest();
        }, 15000);

        return () => clearInterval(timer);
    }, [isReady, accountsCb, accountId, setTitle, setData, serverUri, type, setInfo, data, setCurrency]);

    return (
        <>
            <GroupAccounts
                accounts={accounts}
                serverUri={serverUri}
                accountId={accountId}
                checkToken={checkToken} />
            <Card
                body
                color="info"
                outline>
                <CardTitle tag="h2" className="text-center" style={{ margin: '20px 0px 20px 0px' }}>Информация аккаунта</CardTitle>
                <CardSubtitle
                    className="mb-2 text-muted"
                    tag="h6"
                >
                    {'Ваш тариф: ' + info.tariff} <br/>
                    {'Премиум : '}{info.premStatus ? 'да' : 'нет'}
                </CardSubtitle>
                <CardTitle tag="h6" className="text-start">Портфель аккаунта</CardTitle>
                {portfolio.totalAmountShares &&
                    <CardSubtitle
                        className="mb-2 text-muted"
                        tag="h6"
                    >
                        {'Общая стоимость акций: ' + getPrice(portfolio.totalAmountShares) + currency} <br/>
                        {'Общая стоимость валют: ' + getPrice(portfolio.totalAmountCurrencies) + currency} <br/>
                        {'Общая стоимость облигаций: ' + getPrice(portfolio.totalAmountBonds) + currency} <br/>
                        {'Общая стоимость фьючерсов: ' + getPrice(portfolio.totalAmountFutures) + currency} <br/>
                        {'Общая стоимость фондов: ' + getPrice(portfolio.totalAmountEtf) + currency} <br/>
                        {'Текущая доходность портфеля: ' + getPrice(portfolio.expectedYield) + '%'}
                    </CardSubtitle>}
                <CardTitle tag="h6" className="text-start">Маржинальные показатели по счёту</CardTitle>
                {marginAttr.liquidPortfolio &&
                <CardSubtitle
                    className="mb-2 text-muted"
                    tag="h6"
                >
                    {'Ликвидная стоимость портфеля: ' + getPrice(marginAttr.liquidPortfolio) + currency} <br/>
                    {'Начальная маржа: ' + getPrice(marginAttr.startingMargin) + currency} <br/>
                    {'Минимальная маржа: ' + getPrice(marginAttr.minimalMargin) + currency} <br/>
                    {'Уровень достаточности средств: ' + getPrice(marginAttr.fundsSufficiencyLevel).toFixed(2) + currency} <br/>
                    {'Объем недостающих средств: ' + getPrice(marginAttr.amountOfMissingFunds) + currency}
                </CardSubtitle>}

                {withdrawLimits.money &&
                <CardSubtitle
                    className="mb-2 text-muted"
                    tag="h6"
                >
                    {'Доступные для вывода средства: ' + getPrice(withdrawLimits.money[0]) + currency} <br/>
                </CardSubtitle>}
            </Card>
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
