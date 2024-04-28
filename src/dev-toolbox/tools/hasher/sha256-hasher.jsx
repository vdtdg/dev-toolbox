import Hasher from "./hasher";
import SHA256 from "crypto-js/sha256";

export default function SHA256Hasher() {
  const hash = (input) => {
    return SHA256(input);
  };

  return <Hasher title="SHA256" hashFunc={hash} />;
}


