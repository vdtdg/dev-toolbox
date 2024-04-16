import {NavLink} from "react-router-dom";
import React, {useState} from "react";

import "./dev-toolbox.css";
import {toolList} from "./tool-list";

export default function AsideToolList(props) {
  const categories = [...new Set(toolList.map((tool) => tool.category))];
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTools = toolList.filter((tool) =>
    tool.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <aside className="box tool-list">
        <span key="tool-list-title" className="tool-list-title">
          Available tools ({filteredTools.length})
        </span>
        <input
          className="field search-bar"
          type="search"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <hr />
        {categories.map((category) => (
          <details key={category}>
            <summary className="category-title">{category} ({filteredTools.filter(tool => tool.category === category).length})</summary>
            <ul>
              {filteredTools
                .filter((tool) => tool.category === category)
                .map((tool) => (
                  <li key={tool.path} onClick={props.closeMenu}>
                    <NavLink to={`/${tool.path}`} className="tool-link">
                      {tool.name}
                    </NavLink>
                  </li>
                ))}
            </ul>
          </details>
        ))}
      </aside>
    </>
  );
}
