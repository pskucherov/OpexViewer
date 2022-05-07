import React from 'react';
import Head from 'next/head';
import styles from '../../styles/Home.module.css';
import {
    Badge, Nav, Navbar, NavbarBrand, NavbarToggler,
    Collapse, NavItem, NavLink, NavbarText,
} from 'reactstrap';

export default function Page(props) {
    const { isSandboxToken, serverStatus } = props;

    // 0 нужно задать, 1 sandbox, 2 production
    const whatToken = typeof isSandboxToken === 'undefined' ? 0 : isSandboxToken ? 1 : 2;

    return (
        <div className={styles.container}>
            <Head>
                <title>OpexViewer</title>
                <meta name="description" content="Торговый терминал для автоматической и полуавтоматической торговли" />
                <link rel="icon" href="/favicon.ico" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>

            <main className={styles.main}>
                <div>
                    <Navbar
                        color="light"
                        expand="md"
                        light
                    >
                        <NavbarBrand href="/">
                            OpexViewer
                        </NavbarBrand>
                        <NavbarToggler onClick={function noRefCheck() {}} />
                        <Collapse navbar>
                            <Nav
                                className="me-auto"
                                navbar
                            >
                                <NavItem>
                                    <NavLink href="/instruments">
                                        Инструменты
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink href="/settings">
                                        Настройки
                                    </NavLink>
                                </NavItem>
                            </Nav>
                            <HeadBadges
                                whatToken={whatToken}
                                serverStatus={serverStatus}
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
    } = props;

    return (<NavbarText>
        <ServerBadge
            whatToken={whatToken}
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
            style={{
                marginRight: '20px',
            }}
        >
        Сервер: {serverStatus ? 'ok' : 'недоступен'}
        </Badge>) : '';
};
