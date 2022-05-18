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
        isRobotStarted,
        setIsRobotStarted,
    } = props;

    const [play, setPlay] = useState();
    const [isAdviser, setAdviser] = useState(true);

    useEffect(() => {
        if (isRobotStarted) {
            setPlay(true);
        }
    }, [setPlay, isRobotStarted]);

    const onPlay = useCallback(async () => {
        setPlay(true);
        setIsRobotStarted(true);
        await startRobot(serverUri, selectedRobot, figi, selectedDate, 1, 0, isAdviser, accountId);
    }, [serverUri, selectedRobot, accountId, isAdviser,
        figi, selectedDate, setIsRobotStarted]);

    const onOk = useCallback(() => {

    }, []);

    const onStop = useCallback(async () => {
        await stopRobot(serverUri, selectedRobot);
        setPlay(false);
        setIsRobotStarted(false);
    }, [serverUri, selectedRobot, setIsRobotStarted]);

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
