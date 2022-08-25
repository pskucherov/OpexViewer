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
        robotStartedStatus,
        setRobotStartedStatus,
        brokerId,
    } = props;

    const [play, setPlay] = useState();
    const [isAdviser, setAdviser] = useState(true);

    useEffect(() => {
        setPlay(Boolean(robotStartedStatus));
    }, [setPlay, robotStartedStatus]);

    const onPlay = useCallback(async () => {
        setPlay(true);
        setRobotStartedStatus({
            name: selectedRobot,
        });
        await startRobot(serverUri, selectedRobot, figi, selectedDate, 1, 0, isAdviser, accountId);
    }, [serverUri, selectedRobot, accountId, isAdviser,
        figi, selectedDate, setRobotStartedStatus]);

    const onStop = useCallback(async () => {
        await stopRobot(serverUri, selectedRobot);
        setPlay(false);
        setRobotStartedStatus();
    }, [serverUri, selectedRobot, setRobotStartedStatus]);

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
                onClick={onStop}
            >
                Стоп
            </Button>
        </ButtonGroup>
    );
}
