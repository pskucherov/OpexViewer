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
    } = props;

    const [play, setPlay] = useState();
    const [isAuto, setIsAuto] = useState(false);
    const [isLastStep, setIsLastStep] = useState(false);

    const onPlay = useCallback(async () => {
        setPlay(true);
        setBacktestData([]);
        setBacktestVolume([]);
        setStep(-1);
        await startRobot(serverUri, selectedRobot, figi, selectedDate, interval + 1);
    }, [setBacktestData, setBacktestVolume, serverUri, selectedRobot,
        figi, selectedDate, interval, setStep]);

    const onStep = useCallback(async prevStep => {
        const nextStep = (typeof prevStep === 'number' ? prevStep : step) + 1;

        await stepRobot(serverUri, nextStep);

        setStep(nextStep);
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
    }, [step, setStep, setBacktestData, setBacktestVolume, data, volume, serverUri]);

    const onClear = useCallback(async () => {
        await stopRobot(serverUri, selectedRobot);

        setStep();
        setIsAuto(false);
        setPlay(false);
        setIsLastStep(false);

        setBacktestData();
        setBacktestVolume();
    }, [setStep, setIsAuto, setPlay, setBacktestData, setBacktestVolume, selectedRobot, serverUri]);

    const recursiveStep = useCallback(async (prevStep = 0) => {
        if (maxStep > prevStep) {
            await onStep(prevStep);
            recursiveStep(prevStep + 1);
        } else {
            setIsLastStep(true);
        }
    }, [maxStep, step, onStep, onClear, setBacktestData, setBacktestVolume, isLastStep]); // eslint-disable-line react-hooks/exhaustive-deps

    const onAuto = useCallback(() => {
        setIsAuto(true);
        recursiveStep();
    }, [setIsAuto, recursiveStep, step, setStep, maxStep]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        onClear();
    }, [interval, onClear]);

    return (
        <ButtonGroup className={styles.BacktestButtons}>
            <Button
                color="primary"
                onClick={onPlay}
                disabled={!selectedRobot || play}
            >
                Пуск
            </Button>
            <Button
                color="primary"
                disabled={!play || isAuto}
                onClick={onStep}
            >
                Шаг
            </Button>
            <Button
                color="primary"
                disabled={!play || isAuto}
                onClick={onAuto}
            >
                Авто
            </Button>
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
