import React from "react";

import "./dev-toolbox.css";
import { seoData } from "./seo-data";
import { Helmet } from "react-helmet";
import { consts } from "../consts.js";

export default function SeoWrapper({ children, name, path }) {
  console.log(name);
  const data = seoData[name];
  return (
    <>
      <>
        <Helmet>
          <meta charSet="utf-8" />
          <title>{name}</title>
          <link
            rel="canonical"
            href={consts.host + consts.basePath + "/" + path}
          />
          {data.metaTags.map((tag) => (
            <meta name={tag.name} content={tag.content} />
          ))}
          {data.ogTags.map((tag) => (
            <meta property={tag.property} content={tag.content} />
          ))}
        </Helmet>
        {children}
      </>
    </>
  );
}
