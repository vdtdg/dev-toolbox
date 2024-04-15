import { NavLink, Outlet, useLocation } from "react-router-dom";
import React from "react";
import "./dev-toolbox.css";

import NoTool from "./tools/no-tool";
import { toolList } from "./tool-list";
import { slide as Menu } from "react-burger-menu";
import { useState, useEffect } from "react";

export default function DevToolBox() {
  const currentLocation = useLocation().pathname;
  const noToolLoaded = currentLocation === "/" || currentLocation === "/";
  const tool = noToolLoaded ? <NoTool /> : <Outlet />;
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);
  const categories = [...new Set(toolList.map((tool) => tool.category))];
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTools = toolList.filter((tool) =>
    tool.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 600);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <div className="main-container">
        <div className="toolbox-container">
          {isMobile ? (
            <Menu
              isOpen={isOpen}
              onStateChange={({ isOpen }) => setIsOpen(isOpen)}
            >
              <aside className="tool-list">
                <li key="tool-list-title" className="tool-list-title">
                  Available tools ({filteredTools.length})
                </li>
                <div className="searchContain">
                  <input
                    className="search-bar"
                    type="search"
                    placeholder="Search ..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                {categories.map((category) => (
                  <details key={category}>
                    <summary className="category-title">{category}</summary>
                    <ul className="links-ul">
                      {filteredTools
                        .filter((tool) => tool.category === category)
                        .map((tool) => (
                          <li key={tool.path}>
                            <NavLink to={`/${tool.path}`} className="tool-link">
                              {tool.name}
                            </NavLink>
                          </li>
                        ))}
                    </ul>
                  </details>
                ))}
              </aside>
            </Menu>
          ) : (
            <aside className="tool-list">
              <li key="tool-list-title" className="tool-list-title">
                Available tools{" "}
                <span className="tools-length">({filteredTools.length})</span>
              </li>
              <div className="searchContain">
                <input
                  className="search-bar"
                  type="search"
                  placeholder="Search tools..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              {categories.map((category) => (
                <details key={category} className="category-section">
                  <summary className="category-title">{category}</summary>
                  <ul className="links-ul">
                    {filteredTools
                      .filter((tool) => tool.category === category)
                      .map((tool) => (
                        <li key={tool.path}>
                          <NavLink to={`/${tool.path}`} className="tool-link">
                            {tool.name}
                          </NavLink>
                        </li>
                      ))}
                  </ul>
                  <br />
                </details>
              ))}
            </aside>
          )}
          <div className="tool-container">{tool}</div>
        </div>
        <footer className="toolbox-footer">
          <div className="toolbox-footer-text">
            All tools are running locally in your browser: no data is sent to
            the server &nbsp;|&nbsp; Made by{" "}
            <a href="https://valerian.dtdg.fr">Valerian de Thézan de Gaussan</a>{" "}
            &nbsp;|&nbsp; Code is open-sourced{" "}
            <a href="https://github.com/vdtdg/dev-toolbox">here</a>,
            contributions are welcomed!
          </div>
        </footer>
      </div>
    </>
  );
}
