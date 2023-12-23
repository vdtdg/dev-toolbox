import "../tools-common.css"
import {ASCII_REF} from "./ascii-ref";


export default function AsciiReferenceTable() {
    return <>
        <h3>ASCII Reference Table</h3>
        <table>
            <thead>
            <tr>
                <td>Decimal</td>
                <td>Octal</td>
                <td>Hex</td>
                <td>Binary</td>
                <td>Value</td>
                <td>Description</td>
            </tr>
            </thead>
            <tbody>
            {ASCII_REF.map(ref =>
                <tr>
                    <td>{ref.decimal}</td>
                    <td>{ref.octal}</td>
                    <td>{ref.hex}</td>
                    <td>{ref.binary}</td>
                    <td>{ref.value}</td>
                    <td>{ref.description}</td>
                </tr>
            )}
            </tbody>
        </table>
    </>
}


