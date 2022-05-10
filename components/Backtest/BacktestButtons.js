import React, { useCallback, useEffect, useState } from 'react';
import { ButtonGroup, Button } from 'reactstrap';

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
    } = props;

    const [play, setPlay] = useState();
    const [isAuto, setIsAuto] = useState(false);

    const onPlay = useCallback(async () => {
        setPlay(true);
        setBacktestData([]);
        setBacktestVolume([]);
    }, [setBacktestData, setBacktestVolume]);

    const onStep = useCallback(prevStep => {
        const nextStep = (typeof prevStep === 'number' ? prevStep : step) + 1;

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
    }, [step, setStep, setBacktestData, setBacktestVolume, data, volume]);

    const onClear = useCallback(() => {
        setStep(0);
        setIsAuto(false);
        setPlay(false);
        setBacktestData();
        setBacktestVolume();
    }, [setStep, setIsAuto, setPlay, setBacktestData, setBacktestVolume]);

    const recursiveStep = useCallback((prevStep = 0) => {
        if (maxStep > prevStep) {
            onStep(prevStep);
            recursiveStep(prevStep + 1);
        } else {
            onClear();
        }
    }, [maxStep, step, onStep, onClear, setBacktestData, setBacktestVolume]); // eslint-disable-line react-hooks/exhaustive-deps

    const onAuto = useCallback(() => {
        setIsAuto(true);
        recursiveStep();
    }, [setIsAuto, recursiveStep, step, setStep, maxStep]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        onClear();
    }, [interval, onClear]);

    return (
        <ButtonGroup className="BacktestButtons">
            <Button
                color="primary"
                onClick={onPlay}
                disabled={play}
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
