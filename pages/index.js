import React from 'react';
import Page from '../components/Page/Page';

export default function Home() {
    // const requestOptions = {
    //     cache: 'no-cache',
    //     'Content-Type': 'application/json',
    // };

    // async function* readStream(stream) {
    //     const reader = stream.getReader();

    //     for (;;) {
    //         const { value, done } = await reader.read();

    //         if (value) {
    //             yield Buffer(value).toString('utf8');

    //             // console.log(Buffer(value).toString('utf8'), done);
    //             // console.log(done);
    //             // debugger;
    //         }
    //         if (done) {
    //             break;
    //         }
    //     }
    // }

    // /**
    //  * Проверка сервера, что доступен по ссылке.
    //  *
    //  * @param {String} url
    //  * @returns
    //  */
    // const checkServer = async url => {
    //     let response;
    //     const q = Buffer;

    //     try {
    //         response = await window.fetch('http://localhost:8000', {
    //             cache: 'no-cache',
    //         })
    //             .then(response => response.body);

    //         //.then(readStream)

    //         for await (const line of readStream(response)) {
    //             // console.log(line);
    //         }

    //         //.then(response => responseToReadable(response));
    //     } catch (e) {
    //         // console.log(e);

    //         return false;
    //     }

    //     // debugger;

    //     // if (response && response.ok) {
    //     //     const json = await response.json();

    //     //     return Boolean(json && json.status);
    //     // }

    //     return false;
    // };

    // React.useEffect(() => {
    //     checkServer();
    // }, [checkServer]);

    return (
        <Page>
            <div>1</div>
            <div>2</div>
            <div>3</div>
        </Page>
    );
}
