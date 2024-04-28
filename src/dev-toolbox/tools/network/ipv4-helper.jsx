import { useState } from "react";
import "../tools-common.css";

import { Netmask } from "netmask";

export default function Ipv4Helper() {
  const [input, setInput] = useState("");
  const [baseIpv4, setBaseIpv4] = useState("");
  const [decimalNetworkMask, setDecimalNetworkMask] = useState("");
  const [decimalHostMask, setDecimalHostMask] = useState("");
  const [hostAmount, setHostAmount] = useState("");
  const [firstHost, setFirstHost] = useState("");
  const [lastHost, setLastHost] = useState("");
  const [broadcast, setBroadcast] = useState("");

  const onInputChange = (newValue) => {
    setInput(newValue);
    try {
      const netmask = new Netmask(newValue);
      setBaseIpv4(netmask.base);
      setDecimalNetworkMask(netmask.mask);
      setDecimalHostMask(netmask.hostmask);
      setHostAmount(Math.max(0, parseInt(netmask.size) - 2).toString());
      setFirstHost(netmask.first);
      setLastHost(netmask.last);
      setBroadcast(netmask.broadcast);
    } catch {
      setBaseIpv4("");
      setDecimalNetworkMask("");
      setDecimalHostMask("");
      setHostAmount("");
      setFirstHost("");
      setLastHost("");
      setBroadcast("");
    }
  };

  return (
    <section className="tool-section">
      <h3 className="tool-title">Network IPv4 Helper</h3>
      <label htmlFor="input" className="field-label">
        IPv4 / netmask:
      </label>
      <input
        id="input"
        className="field"
        value={input}
        onChange={(e) => onInputChange(e.target.value)}
        placeholder={"127.0.0.1/24"}
      ></input>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          height: "100%",
          justifyContent: "space-between",
          gap: "5%",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100%",
            justifyContent: "start",
            gap: "5px",
          }}
        >
          <label htmlFor="baseIpv4" className="field-label">
            Base network IPv4 address:
          </label>
          <input
            id="baseIpv4"
            className="field"
            value={baseIpv4}
            readOnly
          ></input>
          <label htmlFor="firstHost" className="field-label">
            First host of this network:
          </label>
          <input
            id="firstHost"
            className="field"
            value={firstHost}
            readOnly
          ></input>
          <label htmlFor="lastHost" className="field-label">
            Last host of this network:
          </label>
          <input
            id="lastHost"
            className="field"
            value={lastHost}
            readOnly
          ></input>
          <label htmlFor="broadcast" className="field-label">
            Broadcast address:
          </label>
          <input
            id="broadcast"
            className="field"
            value={broadcast}
            readOnly
          ></input>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100%",
            justifyContent: "start",
            gap: "5px",
          }}
        >
          <label htmlFor="decimalNetworkMask" className="field-label">
            Network mask in decimal notation:
          </label>
          <input
            id="decimalNetworkMask"
            className="field"
            value={decimalNetworkMask}
            readOnly
          ></input>
          <label htmlFor="decimalHostMask" className="field-label">
            Host mask in decimal notation:
          </label>
          <input
            id="decimalHostMask"
            className="field"
            value={decimalHostMask}
            readOnly
          ></input>
          <label htmlFor="hostAmount" className="field-label">
            Number of host available in this network:
          </label>
          <input
            id="hostAmount"
            className="field"
            value={hostAmount}
            readOnly
          ></input>
        </div>
      </div>
    </section>
  );
}
