import { checkServer } from '../utils/serverStatus';
import { useDispatch, useSelector } from 'react-redux';
import { settingActions } from '../store/setting-slice';
import React, { useState, useCallback, useEffect } from 'react';
import styles from '../styles/Settings.module.css';
import { Button, Form, FormGroup, Label, Input, FormFeedback, Spinner, FormText } from 'reactstrap';

export default function AddServerForm() {
    const [inProgress, setInprogress] = useState(true);
    const dispatch = useDispatch();
    const settingState = useSelector(state=>state.setting);

    // Имеет 3 значения (undefined, false, true). На false проверяется явно.
    // Сохраняем в переменную значения заполняемых полей.
    const handleInputChange = useCallback(e => {
        dispatch(settingActions.setServerUri(e.target.value));
    }, [dispatch]);

    // Проверяем состояние сервера при открытии страницы.
    useEffect(() => {
        const checkRequest = async () => {
            const serverStatus = await checkServer(settingState.serverUri);

            dispatch(settingActions.setServerInvalid(!serverStatus));
            setInprogress(false);
        };

        checkRequest();
    }, [dispatch, settingState.serverUri]);

    // Обработчик сохранения формы.
    const handleSubmit = useCallback(async e => {
        e.preventDefault();
        setInprogress(true);
        const serverStatus = await checkServer(settingState.serverUri);

        if (!serverStatus) {
            dispatch(settingActions.setServerInvalid(true));
        } else {
            dispatch(settingActions.setServerInvalid(false));
        }

        // TODO: сохранить сервер.
        setInprogress(false);
    }, [dispatch]);

    return (
        <>
            <Form className={styles.SettingsForm} onSubmit={handleSubmit}>
                <FormText><h4>Сервер торгового робота</h4></FormText>
                <FormGroup className={styles.label}>
                    <Label>Server <a href="https://github.com/pskucherov/TinkoffTradingBot" target="_blank" rel="noreferrer" >(?)</a></Label>
                    <Input name="serveruri" placeholder={settingState.serverUri} onChange={handleInputChange} value={settingState.serverUri}
                        invalid={settingState.serverInvalid}
                        valid={settingState.serverInvalid === false}
                    />
                    <FormFeedback>Сервер недоступен.</FormFeedback>
                </FormGroup>
                {inProgress ?
                    <Spinner size="sm" color="primary" /> :
                    <Button className={styles.Submit} >Сохранить</Button>
                }
            </Form>
        </>
    );
}
