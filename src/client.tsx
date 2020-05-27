import React, { Suspense } from "react";
import { hydrate } from "react-dom";
import { BrowserRouter } from "react-router-dom";

import { ThemeProvider } from "@material-ui/core";
import { I18nextProvider, useSSR } from "react-i18next";
import App from "./App";

import i18n from "./i18n";
import theme from "./theme";

hydrate(
  <I18nextProvider i18n={i18n}>
    <Suspense fallback="still loading i18N">
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </Suspense>
  </I18nextProvider>,
  document.getElementById("root"),
  () => {
    // [ReHydratation](https://github.com/cssinjs/jss/blob/master/docs/ssr.md)
    const jssStyles = document.getElementById("jss-ssr");
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }
);

if (module.hot) {
  module.hot.accept();
}
