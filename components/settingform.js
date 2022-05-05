import { useState, useCallback, useEffect } from 'react';
import styles from '../styles/Settings.module.css';
import { Button, Form, FormGroup, Label, Input, FormFeedback, Spinner, FormText } from 'reactstrap';
import { addToken } from '../utils/serverStatus';
import { useDispatch, useSelector } from 'react-redux';
import { settingActions } from '../store/setting-slice';
import TokensList from './tokenlist';

const defaultToken = 't.SDIFGUIUbidsGIDBSG-BKMXCJKjgdfgKDSRHGd-HDFHnbdddfg';
const defaultServerUri = 'http://localhost:8000';

export default function SettingsForm() {
    const [inProgress, setInprogress] = useState(false);
    const dispatch = useDispatch();
    const settingState = useSelector(state=>state.setting);

    // Обработчик сохранения формы.
    const handleSubmit = useCallback(async e => {
        e.preventDefault();
        const newToken = e.target[0].value;

        dispatch(settingActions.setTokenInvalid(!newToken || newToken === defaultToken));
        if (!settingState.tokenInvalid) {
            setInprogress(true);
        }
        const tokenStatus = await addToken(defaultServerUri, newToken);
        const isInvalid = !tokenStatus || tokenStatus.error;

        dispatch(settingActions.setTokenInvalid(isInvalid));
        if (!isInvalid) {
            dispatch(settingActions.setToken(newToken));
        }
        setInprogress(false);
    }, [settingState.tokenInvalid, dispatch]);

    return (
        <>
            <Form className={styles.SettingsForm} onSubmit={handleSubmit}>
                <FormText><h4>Добавить Token</h4></FormText>
                <FormGroup className={styles.label}>
                    <Label>Token <a href="https://tinkoff.github.io/investAPI/token/" target="_blank" rel="noreferrer" >(?)</a></Label>
                    <Input
                        name="token"
                        placeholder={settingState.token}
                        invalid={settingState.tokenInvalid}
                    />
                    <FormFeedback>Укажитие действующий token.</FormFeedback>
                </FormGroup>
                {inProgress ?
                    <Spinner size="sm" color="primary" /> :
                    <Button className={styles.Submit} >Добавить</Button>
                }
            </Form>
            <TokensList token={settingState.token} />
        </>

    );
}
