import React from "react";
import { ReactComponent as Sun } from "./Sun.svg";
import { ReactComponent as Moon } from "./Moon.svg";
import "./dark-light-toggle.css";

const DarkLightToggle = () => {
  const setDarkMode = () => {
    document.querySelector("body").setAttribute("theme", "dark");
    localStorage.setItem("selectedTheme", "dark");

    const event = new CustomEvent("themeChange");
    document.dispatchEvent(event);
  };

  const setLightMode = () => {
    document.querySelector("body").setAttribute("theme", "light");
    localStorage.setItem("selectedTheme", "light");

    const event = new CustomEvent("themeChange");
    document.dispatchEvent(event);
  };

  const selectedTheme = localStorage.getItem("selectedTheme");
  if (selectedTheme === "dark") {
    setDarkMode();
  }

  const changeTheme = (e) => {
    if (e.target.checked) {
      setDarkMode();
    } else {
      setLightMode();
    }
  };

  return (
    <div className="dark-mode">
      <input
        className="dark-mode-input"
        type="checkbox"
        id="darkmode-toggle"
        onChange={changeTheme}
        defaultChecked={selectedTheme === "dark"}
      />
      <label className="dark-mode-label" htmlFor="darkmode-toggle">
        <Moon />
        <Sun />
      </label>
    </div>
  );
};

export default DarkLightToggle;
