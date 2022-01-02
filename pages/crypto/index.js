import React from 'react'
import { useRouter } from "next/router";

const Crypto = () => {
    const router = useRouter();
    const id = "Tether";

    return (
        <div>
            Crypto: {id}
        </div>
    )
}

export default Crypto
