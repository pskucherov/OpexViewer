import React from 'react';
import Head from 'next/head';
import styles from '../../styles/Home.module.css';
import { Nav, Navbar, NavbarBrand, NavbarToggler, Collapse, NavItem, NavLink, NavbarText } from 'reactstrap';

export default function Page(props) {
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
                                    <NavLink href="/settings">
                                        Настройки
                                    </NavLink>
                                </NavItem>
                            </Nav>
                            <NavbarText>
                                Token: sandbox
                            </NavbarText>
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
