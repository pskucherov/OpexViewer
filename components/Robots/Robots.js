import React, { useCallback, useState } from 'react';
import { FormGroup, Input } from 'reactstrap';
import { getRobots } from '../../utils/robots';

import styles from '../../styles/Robots.module.css';

export function Robots(props) {
    const {
        setRobotName,
        serverUri,
        disabled,
        setSelectedRobots,
    } = props;

    const [robots, setRobots] = useState([]);

    const onChange = useCallback(e => {
        setSelectedRobots(e.target.value);
    }, [setSelectedRobots]);

    React.useEffect(() => {
        (async () => {
            const robots = await getRobots(serverUri);

            if (robots && robots.length) {
                setRobots(robots);
            }
        })();
    }, [setRobotName, serverUri]);

    return (
        <FormGroup
            className={styles.RobotsSelect}
        >
            <Input
                id="select"
                name="select"
                type="select"
                disabled={disabled}
                onChange={onChange}
            >
                <option value="">
                    Выберите робота
                </option>
                {
                    robots.map((r, k) => (
                        <option key={k} value={r}>
                            {r}
                        </option>
                    ))
                }
            </Input>
        </FormGroup>
    );
}
