import {NavLink, useRouteError} from "react-router-dom";
import React from "react";

export default function ErrorPage() {
    const error = useRouteError();
    console.error(error);

    return <>
        <div>
            <h2>
                Sorry, an error happened: {error.statusText}
            </h2>
            <p className="error-text">
                {error.message}
                <br/>
                <br/>
                <NavLink to={`/`}>
                    Go back to the Dev Toolbox!
                </NavLink>
            </p>
        </div>
    </>
}