import './app.css';
import React from 'react';
import ReactDOM from 'react-dom/client';

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import DevToolBox from "./dev-toolbox/dev-toolbox";
import { toolList } from "./dev-toolbox/tool-list";
import ErrorPage from "./error-page";
import { PomodoroProvider } from "./dev-toolbox/tools/pomodoro/pomodoroContext";

const router = createBrowserRouter(
	[
		{
			path: "/",
			element: <DevToolBox />,
			errorElement: <ErrorPage />,
			children: toolList,
		},
	],
	{
		basename: "/dev-toolbox",
	}
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<React.StrictMode>
		<PomodoroProvider>
			<RouterProvider router={router} />
		</PomodoroProvider>
	</React.StrictMode>
);
