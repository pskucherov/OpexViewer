import React, { useCallback, useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import styles from '../../styles/Page.module.css';
import {
    Badge, Nav, Navbar, NavbarBrand, NavbarToggler,
    Collapse, NavItem, NavLink, NavbarText,
} from 'reactstrap';
import { getBalance } from '../../utils/accounts';

export default function Page(props) {
    const { isSandboxToken, serverStatus, accountId, pathname, setBalance, serverUri, balance } = props;
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = useCallback(() => {
        setIsMenuOpen(!isMenuOpen);
    }, [isMenuOpen]);

    // 0 нужно задать, 1 sandbox, 2 production
    const whatToken = typeof isSandboxToken === 'undefined' ? 0 : isSandboxToken ? 1 : 2;

    useEffect(() => {
        const checkRequest = async () => {
            const f = await getBalance(serverUri, accountId);

            if (f) {
                let allUnits = 0;
                let allNano = 0;
                let currency = '';

                //Функция получения баланса
                for (const key in f) {
                    for (const key1 in f[key]) {
                        if (key1 === 'units' && key !== 'expectedYield' && key !== 'positions') {allUnits += f[key][key1]}
                    }
                    for (const key2 in f[key]) {
                        if (key2 === 'nano' && key !== 'expectedYield' && key !== 'positions') {allNano += f[key][key2]}
                    }
                }

                if (f.totalAmountShares.currency === 'rub') {
                    currency = ' ₽';
                }

                //Очень страшная функция конвертации nano в units
                if (allNano >= 1000000000) {
                    setBalance(parseFloat((allUnits + Number(allNano.toString()[0])) + '.0' + (allNano - Number(allNano.toString()[0] + '000000000'))).toFixed(2) + `${currency}`);
                } else if (allNano < 1000000000) {
                    setBalance(parseFloat(allUnits + '.' + allNano).toFixed(2) + `${currency}`);
                }
            }
        };
        const timer = setInterval(() => {
            checkRequest();
        }, 3000);

        return () => clearInterval(timer);
    }, [serverUri, accountId, setBalance]);

    return (
        <div className={styles.container} >
            <Head>
                <title>OpexViewer</title>
                <meta name="description" content="Торговый терминал для автоматической и полуавтоматической торговли" />
                <link rel="icon" href="/favicon.ico" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>

            <main className={styles.main} >
                <div>
                    <Navbar
                        color="light"
                        expand="md"
                        light
                        animation="false"
                    >
                        <NavbarBrand href="/">
                            OpexViewer
                        </NavbarBrand>
                        <NavbarToggler animation="false" onClick={toggleMenu} />
                        <Collapse animation="false" isOpen={isMenuOpen} navbar>
                            <Nav
                                className="me-auto"
                                navbar

                            >
                                {[
                                    {
                                        url: '/accounts',
                                        name: 'Счета',
                                    },
                                    {
                                        url: '/instruments',
                                        name: 'Инструменты',
                                    },
                                    {
                                        url: '/settings',
                                        name: 'Настройки',
                                    },
                                    {
                                        url: '/logs',
                                        name: 'Логи',
                                    },
                                ].map((n, k) => (
                                    <NavItem key={k}>
                                        <NavLink
                                            active={n.url === pathname}
                                            href={n.url}
                                        >
                                            {n.name}
                                        </NavLink>
                                    </NavItem>
                                ))}
                            </Nav>
                            <HeadBadges
                                whatToken={whatToken}
                                serverStatus={serverStatus}
                                accountId={accountId}
                                balance={balance}
                            />
                        </Collapse>
                    </Navbar>
                </div>
                {props.title && (<h1 className={styles.title}>
                    {props.title}
                </h1>)}

                {props.children}

            </main>

            <footer className={styles.footer}>
                <a
                    href="https://t.me/pskucherov"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    pskucherov
                </a>
            </footer>
        </div>
    );
}

const HeadBadges = props => {
    const {
        whatToken,
        serverStatus,
        accountId,
        balance,
    } = props;

    return (<NavbarText>
        <BalanceBadge
            balance={balance}
        />
        <ServerBadge
            whatToken={whatToken}
            serverStatus={serverStatus}
        />
        <AccountBadge
            whatToken={whatToken}
            accountId={accountId}
            serverStatus={serverStatus}
        />
        {serverStatus ? (<Badge
            color={whatToken === 2 ? 'success' : whatToken ? 'warning' : 'danger'}
            href="/settings"
        >
        Токен: {whatToken === 2 ? 'боевой' : whatToken ? 'песочница' : 'не задан'}
        </Badge>) : ''}

    </NavbarText>);
};

const ServerBadge = props => {
    const {
        whatToken,
        serverStatus,
    } = props;

    return !whatToken ? (
        <Badge
            color={serverStatus ? 'success' : 'danger'}
            href="/settings"
            className={styles.PageBadge}
        >
        Сервер: {serverStatus ? 'ok' : 'недоступен'}
        </Badge>) : '';
};

const AccountBadge = props => {
    const {
        whatToken,
        accountId,
        serverStatus,
    } = props;

    return whatToken && serverStatus ? (
        <Badge
            color="primary"
            href="/accounts"
            className={styles.PageBadge}
        >
            {!accountId ? 'Выберите счёт' : String(accountId).substring(0, 13)}
        </Badge>) : '';
};

const BalanceBadge = props => {
    const balance = props;

    return (
        <Badge
            color="info"
            href="#"
            className={styles.PageBadge}
            balance={balance}
        >
            {!balance.balance ? 'Ваш баланс' : `Ваш баланс:  ${balance.balance}`}
        </Badge>) || '';
};
