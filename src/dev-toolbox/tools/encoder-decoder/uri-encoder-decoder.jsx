import EncoderDecoder from "./encoder-decoder";

export default function UriEncoderDecoder() {
    const encode = (input) => {
        return encodeURIComponent(input);
    }

    const decode = (input) => {
        return decodeURIComponent(input);
    }

    return (
        <EncoderDecoder
            title="URI"
            encodeFunc={encode}
            decodeFunc={decode}
        />
    );
}


