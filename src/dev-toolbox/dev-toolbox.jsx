import {NavLink, Outlet, useLocation} from 'react-router-dom';
import React from 'react';
import "./dev-toolbox.css"

import NoTool from "./tools/no-tool";
import {toolList} from "./tool-list";


export default function DevToolBox() {
    const currentLocation = useLocation().pathname
    const noToolLoaded = currentLocation === "/" || currentLocation === "/"
    const tool = noToolLoaded ? <NoTool/> : <Outlet/>

    return <>
        <div className="main-container">
            <div className="toolbox-container">
                <aside className="tool-list">
                    <ul>
                        <li key="tool-list-title" className="tool-list-title">Available tools ({toolList.length})</li>
                        {toolList.map((tool) =>
                            <li key={tool.path}>
                                <NavLink to={`/${tool.path}`} className="tool-link">
                                    {tool.name}
                                </NavLink>
                            </li>)
                        }
                    </ul>
                </aside>
                <div className="tool-container">
                    {tool}
                </div>
            </div>
            <footer className="toolbox-footer">
                <div className="toolbox-footer-text">All tools are running locally in your browser: no data is sent to the server &nbsp;|&nbsp;
                    Made by <a href="https://valerian.dtdg.fr">Valerian de Thézan de Gaussan</a> &nbsp;|&nbsp;
                    Code is open-sourced <a href="https://github.com/vdtdg/dev-toolbox">here</a>, contributions are welcomed!
                </div>
            </footer>
        </div>
    </>;
}
