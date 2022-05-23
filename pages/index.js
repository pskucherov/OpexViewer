import React from 'react';
import Page from '../components/Page/Page';
import { useRouter } from 'next/router';

export default function Home(props) {
    const { setTitle } = props;
    const router = useRouter();

    React.useEffect(() => {
        setTitle('');
        router.push('/instruments', undefined, { shallow: true });
    }, [setTitle, router]);
}
