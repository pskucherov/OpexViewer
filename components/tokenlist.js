import React, { useState, useCallback, useEffect } from 'react';
import styles from '../styles/Settings.module.css';
import { Button, Form, FormGroup, Label, FormText, Badge } from 'reactstrap';
import { getTokens,selectToken, delToken } from '../utils/serverStatus';
const defaultServerUri = 'http://localhost:8000/';
export default function TokensList(props){
    const [tokens, setTokens] = useState([]);
    const tokenRequest = React.useCallback(async force => {
        // TODO: redux server uri
        const newTokens = await getTokens(defaultServerUri);

        if (force || newTokens && newTokens.length !== tokens.length) {
            setTokens(newTokens);
        }
    }, [tokens.length]);

    // Проверяем состояние сервера при открытии страницы.
    useEffect(() => {
        tokenRequest();
    }, [props.token, tokenRequest]);

    // Обработчик удаления
    const onDelClick = useCallback(async token => {
        await delToken(defaultServerUri, token);
        await tokenRequest();
    }, [tokenRequest]);

    // Обработчик выбора токена
    const onSelectClick = useCallback(async token => {
        await selectToken(defaultServerUri, token);
        await tokenRequest(true);
    }, [tokenRequest]);

    return Boolean(tokens && tokens.length) && (
        <>
            <Form className={styles.SettingsForm}>
                <FormText><h4>Сохранённые токены</h4></FormText>

                {tokens && tokens.map((t, i) => (
                    <FormGroup key={i} className={styles.Tokens}>
                        <Label className={styles.TokenLable}>
                            {t.token.substr(0, 5)}
                        </Label>
                        {t.isSandbox && (<Badge pill className={styles.Badge}>
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
                        >
                            {t.selected ? 'Выбран\u00a0' : 'Выбрать'}
                        </Button>
                    </FormGroup>
                ))}
            </Form>
        </>
    );
};