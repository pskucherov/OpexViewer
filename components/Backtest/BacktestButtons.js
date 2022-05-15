import React, { useCallback, useEffect, useState } from 'react';
import { ButtonGroup, Button } from 'reactstrap';
import { startRobot, stepRobot, stopRobot } from '../../utils/robots';

import styles from '../../styles/Backtest.module.css';

export function BacktestButtons(props) {
    const {
        interval,
        setStep,
        step,
        maxStep,
        setBacktestData,
        setBacktestVolume,
        data,
        volume,
        selectedRobot,
        serverUri,
        figi,
        selectedDate,
        setRobotPositions,
    } = props;

    const [play, setPlay] = useState();
    const [isAuto, setIsAuto] = useState(false);
    const [isLastStep, setIsLastStep] = useState(false);

    const onPlay = useCallback(async () => {
        setPlay(true);
        setBacktestData([]);
        setBacktestVolume([]);
        setStep(-1);
        await startRobot(serverUri, selectedRobot, figi, selectedDate, interval + 1, 1, 1);
    }, [setBacktestData, setBacktestVolume, serverUri, selectedRobot,
        figi, selectedDate, interval, setStep]);

    const onStep = useCallback(async () => {
        if (!play || isLastStep) {
            return;
        }

        const nextStep = step + 1;

        if (maxStep < nextStep) {
            setIsLastStep(true);
        }

        // TODO: переделать стакан с шага на время, т.к. данные про стакан есть не все.
        const robotState = await stepRobot(serverUri, nextStep);

        setRobotPositions(robotState);

        setBacktestData(data.map((i, k) => {
            if (k > nextStep) {
                return [i[0], undefined, undefined, undefined, undefined];
            }

            return i;
        }));

        setBacktestVolume(volume.map((i, k) => {
            if (k > nextStep) {
                return [i[0], undefined];
            }

            return i;
        }));

        setStep(nextStep);
    }, [step, play, setStep, setBacktestData, isLastStep, maxStep,
        setRobotPositions, setBacktestVolume, data, volume, serverUri]);

    useEffect(() => {
        // Шаги для автоматического режима.
        if (play && isAuto) {
            onStep();
        }
    }, [step, isAuto, onStep, play]);

    const onClear = useCallback(async () => {
        await stopRobot(serverUri, selectedRobot);

        setStep();
        setIsAuto(false);
        setPlay(false);
        setIsLastStep(false);

        setBacktestData();
        setBacktestVolume();
        setRobotPositions();
    }, [setStep, setIsAuto, setRobotPositions,
        setPlay, setBacktestData,
        setBacktestVolume, selectedRobot, serverUri]);

    const onStop = useCallback(() => setIsAuto(false), [setIsAuto]);

    useEffect(() => {
        onClear();
    }, [interval, selectedDate, onClear]);

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
                disabled={!play || isAuto || isLastStep}
                onClick={onStep}
            >
                Шаг
            </Button>
            {!isAuto ? (<Button
                color="primary"
                disabled={!play || isLastStep}
                onClick={() => {
                    setIsAuto(true);
                    setIsLastStep(false);
                }}
            >
                Авто
            </Button>) : (
                <Button
                    color="primary"
                    disabled={isLastStep}
                    onClick={onStop}
                >
                Стоп
                </Button>)}
            <Button
                color="primary"
                disabled={!play}
                onClick={onClear || isAuto}
            >
                Сброс
            </Button>
        </ButtonGroup>
    );
}
