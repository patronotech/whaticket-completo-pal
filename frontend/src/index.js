import React from "react";
import ReactDOM from "react-dom";
// import CssBaseline from "@material-ui/core/CssBaseline";
import * as serviceworker from './serviceWorker'

import App from "./App";
import { ToastContainer } from "react-toastify";
import { CssBaseline } from "@mui/material";

ReactDOM.render(
	<CssBaseline>
		<App />
		<ToastContainer />
	</CssBaseline>,
	document.getElementById("root")
);

serviceworker.register()