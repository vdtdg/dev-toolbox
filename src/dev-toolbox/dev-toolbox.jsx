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
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 800);

  useEffect(() => {
    window.addEventListener("resize", () => {
      setIsMobile(window.innerWidth <= 800);
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
              width={ 'calc(100% - 16px)' }
              noOverlay
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
            All tools run locally in your browser 🛡️ No data is sent to the
            server&nbsp; | &nbsp;Made by&nbsp;
            <a href="https://valerian.dtdg.fr">Valérian de Thézan de Gaussan</a>
            &nbsp; | &nbsp;&nbsp;
            <a href="https://github.com/vdtdg/dev-toolbox">
              Code is open-sourced on GitHub
            </a>
            , contributions are welcomed!
          </p>
        </footer>
      </div>
    </>
  );
}
