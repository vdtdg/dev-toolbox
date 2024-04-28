import { Outlet, useLocation } from "react-router-dom";
import { slide as Menu } from "react-burger-menu";
import React, { useEffect, useState } from "react";

import "./dev-toolbox.css";
import NoTool from "./tools/no-tool";
import AsideToolList from "./aside-tool-list";

export default function DevToolBox() {
  const currentLocation = useLocation().pathname;
  const noToolLoaded = currentLocation === "/";
  const tool = noToolLoaded ? <NoTool /> : <Outlet />;
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);

  useEffect(() => {
    window.addEventListener("resize", () => {
      setIsMobile(window.innerWidth <= 600);
    });
  }, []);

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <>
      <div className="main-container">
        <div className="core-container">
          {isMobile ? (
            <Menu
              isOpen={isOpen}
              onStateChange={({ isOpen }) => setIsOpen(isOpen)}
            >
              <AsideToolList closeMenu={closeMenu} />
            </Menu>
          ) : (
            <AsideToolList closeMenu={() => {}} />
          )}
          <div className="box tool-container">{tool}</div>
        </div>
        <footer className="box toolbox-footer">
          <p className="toolbox-footer-text">
            All tools are running locally in your browser: no data is sent to
            the server &nbsp;|&nbsp; Made by{" "}
            <a href="https://valerian.dtdg.fr">Valérian de Thézan de Gaussan</a>{" "}
            &nbsp;|&nbsp; Code is open-sourced{" "}
            <a href="https://github.com/vdtdg/dev-toolbox">here</a>,
            contributions are welcomed!
          </p>
        </footer>
      </div>
    </>
  );
}
