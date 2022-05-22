import React, { useCallback, useState } from 'react';
import { Col, Form, FormGroup, Input, Label, Button, UncontrolledCollapse } from 'reactstrap';
import { getRobots, getSettings, setSettings } from '../../utils/robots';

import styles from '../../styles/Robots.module.css';

export function Robots(props) {
    const {
        setRobotName,
        serverUri,
        disabled,
        setSelectedRobot,
        selectedRobot,
    } = props;

    const [robots, setRobots] = useState([]);
    const [isFormChanged, setIsFormChanged] = useState(false);
    const [robotSetting, setRobotSetting] = useState({});
    const [activeSave, setActiveSave] = useState(false);

    const onChange = useCallback(async e => {
        setSelectedRobot(e.target.value);
    }, [setSelectedRobot]);

    React.useEffect(() => {
        (async () => {
            const robots = await getRobots(serverUri);

            if (robots && robots.length) {
                setRobots(robots);
            }
        })();
    }, [setRobotName, serverUri]);

    const onShowSettings = useCallback(async () => {
        const settings = await getSettings(serverUri, selectedRobot);

        if (settings) {
            setRobotSetting({
                ...settings,
                takeProfit: settings.takeProfit * 100,
                stopLoss: settings.stopLoss * 100,
            });
        }
    }, [selectedRobot, serverUri, setRobotSetting]);

    // Обработчик сохранения формы.
    const handleSubmit = React.useCallback(async e => {
        e.preventDefault();

        await setSettings(serverUri, selectedRobot, {
            ...robotSetting,
            isAdviser: Number(robotSetting.isAdviser),
            takeProfit: parseFloat(robotSetting.takeProfit) / 100,
            stopLoss: parseFloat(robotSetting.stopLoss) / 100,
        });
        onShowSettings();
        setActiveSave(false);
    }, [serverUri, setActiveSave, selectedRobot, onShowSettings, robotSetting]);

    const handleSize = useCallback(e => {
        const lotsSize = Math.abs(parseInt(e.target.value, 10)) || robotSetting.lotsSize;

        setRobotSetting({
            ...robotSetting,
            lotsSize,
        });
        setActiveSave(true);
    }, [setRobotSetting, robotSetting, setActiveSave]);

    const handleProfit = useCallback(e => {
        const takeProfit = parseFloat(e.target.value);

        setRobotSetting({
            ...robotSetting,
            takeProfit,
        });
        setActiveSave(true);
    }, [setRobotSetting, robotSetting, setActiveSave]);

    const handleLoss = useCallback(e => {
        const stopLoss = parseFloat(e.target.value);

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
