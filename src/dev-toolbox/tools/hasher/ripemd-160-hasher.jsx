import Hasher from "./hasher";
import Ripemd160 from "crypto-js/ripemd160";

export default function RIPEMD160Hasher() {
    const hash = (input) => {
        return Ripemd160(input);
    }

    return (
        <Hasher
            title="RIPEMD-160"
            hashFunc={hash}
        />
    );
}


