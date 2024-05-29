import "./app.css";
import React from "react";
import ReactDOM from "react-dom/client";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import DevToolBox from "./dev-toolbox/dev-toolbox";
import { toolList } from "./dev-toolbox/tool-list";
import ErrorPage from "./error-page";
import { PomodoroProvider } from "./dev-toolbox/tools/pomodoro/pomodoroContext";
import { Helmet } from "react-helmet";

// TODO add those to a .env. Need webpack?
const host = "https://valerian.dtdg.fr";
const basePath = "/dev-toolbox";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: (
        <>
          <Helmet>
            <title>Dev Toolbox</title>
            <meta charSet="utf-8" />
            <meta
              content="width=device-width, initial-scale=1"
              name="viewport"
            />
            <meta content="#101010" name="theme-color" />
            <meta
              name="description"
              content="Welcome to Dev Toolbox, a developer's companion for all your coding needs. Lightweight, without ads, free, fully client-side, open-sourced."
            />
            <link rel="canonical" href={host + basePath} />
            <link
              href={basePath + "/apple-touch-icon.png"}
              rel="apple-touch-icon"
              sizes="180x180"
            />
            <link
              href={basePath + "/favicon-32x32.png"}
              rel="icon"
              sizes="32x32"
              type="image/png"
            />
            <link
              href={basePath + "/favicon-16x16.png"}
              rel="icon"
              sizes="16x16"
              type="image/png"
            />
            <link href={basePath + "/site.webmanifest"} rel="manifest" />
          </Helmet>
          <DevToolBox />
        </>
      ),
      errorElement: <ErrorPage />,
      children: toolList,
    },
  ],
  {
    basename: basePath,
  },
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <PomodoroProvider>
      <RouterProvider router={router} />
    </PomodoroProvider>
  </React.StrictMode>,
);
