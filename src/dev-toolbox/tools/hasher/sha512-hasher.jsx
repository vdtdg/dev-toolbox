import Hasher from "./hasher";
import SHA512 from "crypto-js/sha512";

export default function SHA512Hasher() {
  const hash = (input) => {
    return SHA512(input);
  };

  return <Hasher title="SHA512" hashFunc={hash} />;
}


