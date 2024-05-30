import { useState } from "react";
import "../tools-common.css";

export default function ChangeBaseHelper() {
  const [base2, setBase2] = useState(null);
  const [base8, setBase8] = useState(null);
  const [base10, setBase10] = useState(null);
  const [base16, setBase16] = useState(null);
  const [base36, setBase36] = useState(null);

  const changeInput = (e, base) => {
    const fieldValue = parseInt(e.target.value, base);
    if (isNaN(fieldValue)) return;

    setBase2(fieldValue.toString(2));
    setBase8(fieldValue.toString(8));
    setBase10(fieldValue.toString(10));
    setBase16(fieldValue.toString(16));
    setBase36(fieldValue.toString(36));
  };

  return (
    <>
      <h1 className="tool-title">Number Helper</h1>
      <InputField
        id="inputBase2"
        fieldLabel={"Number in base 2 (binary):"}
        onChange={(e) => changeInput(e, 2)}
        value={base2}
      />
      <InputField
        id="inputBase8"
        fieldLabel={"Number in base 8 (octal):"}
        onChange={(e) => changeInput(e, 8)}
        value={base8}
      />
      <InputField
        id="inputBase10"
        fieldLabel={"Number in base 10 (decimal):"}
        onChange={(e) => changeInput(e, 10)}
        value={base10}
      />
      <InputField
        id="inputBase16"
        fieldLabel={"Number in base 16 (hexadecimal):"}
        onChange={(e) => changeInput(e, 16)}
        value={base16}
      />
      <InputField
        id="inputBase36"
        fieldLabel={"Number in base 36:"}
        onChange={(e) => changeInput(e, 36)}
        value={base36}
      />
    </>
  );
}

function InputField(props) {
  return (
    <section className="tool-section">
      <label htmlFor={props.id} className="field-label">
        {props.fieldLabel}
      </label>
      <input
        id={props.id}
        className="field"
        value={props.value}
        onChange={props.onChange}
      ></input>
    </section>
  );
}
