import Hasher from "./hasher";
import MD5 from "crypto-js/md5";

export default function MD5Hasher() {
  const hash = (input) => {
    return MD5(input);
  };

  return <Hasher title="MD5" hashFunc={hash} />;
}
