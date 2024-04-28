import EncoderDecoder from "./encoder-decoder";

export default function Base64EncoderDecoder() {
  const encode = (input) => {
    return btoa(input);
  };

  const decode = (input) => {
    return atob(input);
  };

  return (
    <EncoderDecoder title="Base64" encodeFunc={encode} decodeFunc={decode} />
  );
}


