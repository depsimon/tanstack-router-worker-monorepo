import { setupI18n } from "@lingui/core";
import { RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { dynamicActivate } from "~/integrations/lingui";
import { createRouter } from "~/router";
import "~/styles/app.css";

const i18n = setupI18n();
await dynamicActivate(i18n, "en");

const router = createRouter({ i18n });

// Render the app
const rootElement = document.getElementById("app")!;
const root = ReactDOM.createRoot(rootElement);
root.render(
	<StrictMode>
		<RouterProvider router={router} />
	</StrictMode>,
);
