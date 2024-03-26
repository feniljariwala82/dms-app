import { ThemeProvider } from "@emotion/react";
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { store } from "./app/store";
import "./index.css";
import router from "./router";
import theme from "./theme";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <RouterProvider router={router} />
        <ToastContainer position="bottom-right" autoClose={false} />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);
