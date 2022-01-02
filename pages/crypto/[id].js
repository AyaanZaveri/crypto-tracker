import React from 'react'
import { useRouter } from "next/router";
import Index from '../index.js'

const Crypto = () => {
    const router = useRouter();
    const { id } = router.query;

    return (
        <div>
            <Index cryptoName={id} />
        </div>
    )
}

export default Crypto
