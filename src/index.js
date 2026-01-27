import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import 'react-quill/dist/quill.snow.css';
import "jsvectormap/dist/css/jsvectormap.css";
import 'react-toastify/dist/ReactToastify.css';
import 'react-modal-video/css/modal-video.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/dist/js/bootstrap.bundle.min';
// import 'bootstrap/dist/css/bootstrap.min.css';

import store from "./redux/store";  // Import Redux store
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import './index.css';
import { AlertProvider } from "./context/AlertContext";
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Provider store={store}>
   <MantineProvider withGlobalStyles withNormalizeCSS>
      <AlertProvider>
        <App />
      </AlertProvider>
    </MantineProvider>
  </Provider>
);

reportWebVitals();
