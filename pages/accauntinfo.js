import React, { useState, useEffect } from 'react';
import { getAccountTarrif, getAccountInfo, getBalance, getWithdrawLimits, getMarginAttr } from '../utils/accounts';
import { Spinner } from 'reactstrap';

export default function AccauntInfo(props) {
    const [info, setInfo] = useState({});
    const [tarrif, setTarrif] = useState({});
    const [portfolio, setPortfolio] = useState({});
    const [withdrawLimits, setWithdrawLimits] = useState({});
    const [marginAttr, setMarginAttr] = useState({});

    const [inProgress, setInProgress] = useState(true);
    const accountId = props.accountId;

    const { serverUri } = props;

    useEffect(function() {
        const checkRequest = async () => {
            const infoRequest = await getAccountInfo(serverUri);
            const tarrifRequest = await getAccountTarrif(serverUri);
            const portfolioRequest = await getBalance(serverUri, accountId);
            const withdrawLimitsRequest = await getWithdrawLimits(serverUri, accountId);
            const marginAttrRequest = await getMarginAttr(serverUri, accountId);

            if (infoRequest) {
                setInfo(infoRequest);
            }

            if (tarrifRequest) {
                setTarrif(tarrifRequest);
            }

            if (portfolioRequest) {
                setPortfolio(portfolioRequest);
            }

            if (withdrawLimitsRequest) {
                setWithdrawLimits(withdrawLimitsRequest);
            }

            if (marginAttrRequest) {
                setMarginAttr(marginAttrRequest);
            }

            setInProgress(false);
        };

        checkRequest();

        const timer = setInterval(() => {
            checkRequest();
        }, 7000);

        return () => clearInterval(timer);
    }, [serverUri, accountId, setInfo, setTarrif, setPortfolio, setWithdrawLimits, setMarginAttr]);

    return (
        inProgress ?
            (
                <center>
                    <Spinner color="primary">
                        Loading...
                    </Spinner>
                </center>
            ) : (
                <div>
                    <h2>info</h2>
                    <div>
                        <pre>{JSON.stringify(info)}</pre>
                    </div>
                    <h2>tarrif</h2>
                    <div>
                        <pre>{JSON.stringify(tarrif)}</pre>
                    </div>
                    <h2>portfolio</h2>
                    <div>
                        <pre>{JSON.stringify(portfolio)}</pre>
                    </div>
                    <h2>withdrawLimits</h2>
                    <div>
                        <pre>{JSON.stringify(withdrawLimits)}</pre>
                    </div>
                    <h2>marginAttr</h2>
                    <div>
                        <pre>{JSON.stringify(marginAttr)}</pre>
                    </div>
                </div>
            )
    );
}
