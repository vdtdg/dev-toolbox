import EncoderDecoder from "./encoder-decoder";

export default function HtmlEncoderDecoder() {
    const encode = (input) => {
        return input
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    const decode = (input) => {
        let str = input;
        let textarea = document.createElement("textarea");
        textarea.innerHTML = str;
        return textarea.value;
    }

    return (
        <EncoderDecoder
            title="HTML"
            encodeFunc={encode}
            decodeFunc={decode}
        />
    );
}


