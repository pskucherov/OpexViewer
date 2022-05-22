import React, { useCallback, useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import styles from '../../styles/Page.module.css';
import {
    Badge, Nav, Navbar, NavbarBrand, NavbarToggler,
    Collapse, NavItem, NavLink, NavbarText,
} from 'reactstrap';

export default function Page(props) {
    const { isSandboxToken, serverStatus, accountId, pathname, balance } = props;
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = useCallback(() => {
        setIsMenuOpen(!isMenuOpen);
    }, [isMenuOpen]);

    // 0 нужно задать, 1 sandbox, 2 production
    const whatToken = typeof isSandboxToken === 'undefined' ? 0 : isSandboxToken ? 1 : 2;

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
    const balance = props.balance;

    return balance ? (
        <Badge
            color="info"
            href="/accounts"
            className={styles.PageBadge}
        >
            {balance}
        </Badge>) : '';
};
