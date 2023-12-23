import Hasher from "./hasher";
import SHA1 from "crypto-js/sha1";

export default function SHA1Hasher() {
    const hash = (input) => {
        return SHA1(input);
    }

    return (
        <Hasher
            title="SHA1"
            hashFunc={hash}
        />
    );
}


