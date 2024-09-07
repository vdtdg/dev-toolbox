import React from "react";

import "./dev-toolbox.css";
import seoData from "./seo-data";
import { Helmet } from "react-helmet";
import { consts } from "../consts.js";

export default function SeoWrapper({ children, name, path }) {
  const data = seoData[name];
  return (
    <>
      <>
        <Helmet>
          <meta charSet="utf-8" />
          <title>{name} - Access Top Developer Tools Online 100% Free</title>
          <link
            rel="canonical"
            href={consts.host + consts.basePath + "/" + path}
          />
          {data.metaTags.map((tag) => (
            <meta key={tag.name} name={tag.name} content={tag.content} />
          ))}
          {data.ogTags.map((tag) => (
            <meta key={tag.property} property={tag.property} content={tag.content} />
          ))}
        </Helmet>
        {children}
      </>
    </>
  );
}
