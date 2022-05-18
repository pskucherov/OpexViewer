import React, { useCallback, useEffect, useState } from 'react';
import { ButtonGroup, Button } from 'reactstrap';
import { startRobot, stepRobot, stopRobot } from '../../utils/robots';

import styles from '../../styles/Backtest.module.css';

export function RobotsButtons(props) {
    const {
        interval,
        selectedRobot,
        serverUri,
        figi,
        selectedDate,
        accountId,
        robotStartedName,
        setRobotStartedName,
    } = props;

    const [play, setPlay] = useState();
    const [isAdviser, setAdviser] = useState(true);

    useEffect(() => {
        setPlay(Boolean(robotStartedName));
    }, [setPlay, robotStartedName]);

    const onPlay = useCallback(async () => {
        setPlay(true);
        setRobotStartedName(selectedRobot);
        await startRobot(serverUri, selectedRobot, figi, selectedDate, 1, 0, isAdviser, accountId);
    }, [serverUri, selectedRobot, accountId, isAdviser,
        figi, selectedDate, setRobotStartedName]);

    const onOk = useCallback(() => {

    }, []);

    const onStop = useCallback(async () => {
        await stopRobot(serverUri, selectedRobot);
        setPlay(false);
        setRobotStartedName();
    }, [serverUri, selectedRobot, setRobotStartedName]);

    return (
        <ButtonGroup className={styles.BacktestButtons}>
            <Button
                color="primary"
                onClick={onPlay}
                disabled={!selectedRobot || play}
            >
                Старт
            </Button>
            <Button
                color="primary"
                disabled={!play}
                onClick={onOk}
            >
                Ок
            </Button>
            <Button
                color="primary"
                disabled={!play}
                onClick={onStop}
            >
                Стоп
            </Button>
        </ButtonGroup>
    );
}
