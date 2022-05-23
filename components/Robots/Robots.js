import React, { useCallback, useState } from 'react';
import { Col, Form, FormGroup, Input, Label, Button, UncontrolledCollapse } from 'reactstrap';
import { getRobots, getSettings, setSettings } from '../../utils/robots';

import styles from '../../styles/Robots.module.css';

export function Robots(props) {
    const {
        serverUri,
        disabled,
        setSelectedRobot,
        selectedRobot,
        figi,
        accountId,

        robotSetting,
        setRobotSetting,
    } = props;

    const [robots, setRobots] = useState([]);
    const [activeSave, setActiveSave] = useState(false);

    const onShowSettings = useCallback(async name => {
        const settings = await getSettings(serverUri, typeof name === 'string' ? name : selectedRobot, accountId, figi);

        if (settings) {
            setRobotSetting({
                ...settings,
                takeProfit: settings.takeProfit * 100,
                stopLoss: settings.stopLoss * 100,
            });
        }
    }, [selectedRobot, serverUri, setRobotSetting, accountId, figi]);

    const onChange = useCallback(async e => {
        const name = e.target.value;

        setSelectedRobot(name);
        onShowSettings(name);
    }, [setSelectedRobot, onShowSettings]);

    React.useEffect(() => {
        (async () => {
            const robots = await getRobots(serverUri);

            if (robots && robots.length) {
                setRobots(robots);
            }
        })();
    }, [serverUri, onShowSettings]);

    // Обработчик сохранения формы.
    const handleSubmit = React.useCallback(async e => {
        e.preventDefault();

        await setSettings(serverUri, selectedRobot, {
            ...robotSetting,
            isAdviser: Number(robotSetting.isAdviser),
            takeProfit: parseFloat(robotSetting.takeProfit) / 100,
            stopLoss: parseFloat(robotSetting.stopLoss) / 100,

            su: robotSetting.su || robotSetting.support.units,
            sn: robotSetting.sn || robotSetting.support.nano,
            ru: robotSetting.ru || robotSetting.resistance.units,
            rn: robotSetting.rn || robotSetting.resistance.nano,
        }, accountId, figi);

        // Делаем запрос повторно, т.к. значения могли быть отфильтрованы.
        onShowSettings();
        setActiveSave(false);
    }, [serverUri, setActiveSave, selectedRobot, onShowSettings, robotSetting, accountId, figi]);

    const handleSize = useCallback(e => {
        const lotsSize = Math.abs(parseInt(e.target.value, 10)) || robotSetting.lotsSize;

        setRobotSetting({
            ...robotSetting,
            lotsSize,
        });
        setActiveSave(true);
    }, [setRobotSetting, robotSetting, setActiveSave]);

    const handleProfit = useCallback(e => {
        const takeProfit = e.target.value;

        setRobotSetting({
            ...robotSetting,
            takeProfit,
        });
        setActiveSave(true);
    }, [setRobotSetting, robotSetting, setActiveSave]);

    const handleLoss = useCallback(e => {
        const stopLoss = e.target.value;

        setRobotSetting({
            ...robotSetting,
            stopLoss,
        });
        setActiveSave(true);
    }, [setRobotSetting, robotSetting, setActiveSave]);

    const handleAdviser = useCallback(e => {
        setRobotSetting({
            ...robotSetting,
            isAdviser: !robotSetting.isAdviser,
        });
        setActiveSave(true);
    }, [setRobotSetting, robotSetting, setActiveSave]);

    const sr = useCallback((name, e) => {
        const s = {
            ...robotSetting,
        };

        s[name] = parseInt(e.target.value, 10);

        setRobotSetting(s);
        setActiveSave(true);
    }, [setRobotSetting, robotSetting, setActiveSave]);

    const supportResistance = ['su', 'sn', 'ru', 'rn'].map(name => sr.bind(this, name));

    return (<>
        <Form
            className={styles.RobotsForm}
        >
            <FormGroup>
                <Input
                    id="select"
                    name="select"
                    type="select"
                    disabled={disabled}
                    onChange={onChange}
                    value={selectedRobot}
                >
                    <option value="">
                        Выберите робота
                    </option>
                    {
                        robots.map((r, k) => (
                            <option
                                key={k}
                                value={r}
                            >
                                {r}
                            </option>
                        ))
                    }
                </Input>
            </FormGroup>
        </Form>

        {selectedRobot && (<>
            <Button
                color="primary"
                id="toggler"
                className={styles.SettingsButton}
                onClick={onShowSettings}
            >
                Настройки
            </Button>
            <UncontrolledCollapse toggler="#toggler">
                <Form
                    onSubmit={handleSubmit}
                    className={styles.RobotsForm}
                >
                    {/* <FormGroup
                        check
                        inline
                        className={styles.Adviser}
                    >
                        <Input
                            id="Adviser"
                            type="checkbox"
                            onChange={handleAdviser}
                            checked={robotSetting.isAdviser}
                            value="1"
                        />
                        <Label
                            for="Adviser"
                            check
                        >
                            Советник
                        </Label>
                    </FormGroup> */}

                    <FormGroup
                        row
                        className={styles.Lots}
                    >
                        <Label
                            sm={4}
                            className={styles.LotsBlock}
                        >
                            Лоты
                        </Label>
                        <Col
                            sm={4}
                            className={styles.LotsBlock}
                        >
                            <Input
                                name="lots"
                                placeholder="1"
                                onChange={handleSize}
                                value={robotSetting.lotsSize || undefined}
                            />
                        </Col>
                    </FormGroup>

                    <FormGroup
                        row
                        className={styles.TakeProfit}
                    >
                        <Label
                            sm={4}
                            className={styles.TakeProfitBlock}
                        >
                            TakeProfit
                        </Label>
                        <Col
                            sm={4}
                            className={styles.TakeProfitBlock}
                        >
                            <Input
                                name="takeprofit"
                                placeholder="0.5"
                                onChange={handleProfit}
                                value={robotSetting.takeProfit || undefined}
                            />
                        </Col>
                        %
                    </FormGroup>
                    <FormGroup
                        row
                        className={styles.StopLoss}
                    >
                        <Label
                            sm={4}
                            className={styles.StopLossBlock}
                        >
                            StopLoss
                        </Label>
                        <Col
                            sm={4}
                            className={styles.StopLossBlock}
                        >
                            <Input
                                name="stoploss"
                                placeholder="0.25"
                                onChange={handleLoss}
                                value={robotSetting.stopLoss || undefined}
                            />
                        </Col>
                        %
                    </FormGroup>

                    <FormGroup
                        row
                        className={styles.Support}
                    >
                        <Label
                            sm={2}
                            className={styles.SupportBlock}
                        >
                            Поддержка
                        </Label>
                        <Col
                            sm={2}
                            className={styles.SupportBlock}
                        >
                            <Input
                                name="su"
                                placeholder="units"
                                onChange={supportResistance[0]}
                                value={robotSetting.su || robotSetting.support.units || undefined}
                                maxLength="9"
                            />
                        </Col>
                        <Col
                            sm={2}
                            className={styles.SupportBlock}
                        >
                            <Input
                                name="sn"
                                placeholder="nano"
                                onChange={supportResistance[1]}
                                value={robotSetting.sn || robotSetting.support.nano || undefined}
                                maxLength="9"
                            />
                        </Col>
                    </FormGroup>

                    <FormGroup
                        row
                        className={styles.Resistance}
                    >
                        <Label
                            sm={2}
                            className={styles.ResistanceBlock}
                        >
                            Сопротивление
                        </Label>
                        <Col
                            sm={2}
                            className={styles.ResistanceBlock}
                        >
                            <Input
                                name="ru"
                                placeholder="units"
                                onChange={supportResistance[2]}
                                value={robotSetting.ru || robotSetting.resistance.units || undefined}
                                maxLength="9"
                            />
                        </Col>
                        <Col
                            sm={2}
                            className={styles.ResistanceBlock}
                        >
                            <Input
                                name="rn"
                                placeholder="nano"
                                onChange={supportResistance[3]}
                                value={robotSetting.rn || robotSetting.resistance.nano || undefined}
                                maxLength="9"
                            />
                        </Col>
                    </FormGroup>

                    <Button
                        color="primary"
                        disabled={!activeSave}
                    >
                        Сохранить
                    </Button>
                </Form>
            </UncontrolledCollapse>
        </>)}
    </>);
}
