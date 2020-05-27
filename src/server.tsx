import express from "express";
import fs from "fs";
import path from "path";
import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
// @ts-ignore
import serialize from "serialize-javascript";

import { CacheProvider } from "@emotion/core";
import { ServerStyleSheets, ThemeProvider } from "@material-ui/core";
import { cache } from "emotion";
import { renderStylesToString } from "emotion-server";
import App from "./App";
import { backendApiBase } from "./config";
import theme from "./theme";

import i18nextMiddleware, { I18NextRequest } from "i18next-express-middleware";
// @ts-ignore
import Backend from "i18next-fs-backend/cjs";
import { I18nextProvider } from "react-i18next";
// tslint:disable-next-line: no-var-requires
const assets = require(process.env.RAZZLE_ASSETS_MANIFEST!);

import i18n from "./i18n";

const server = express();
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath: string) =>
  path.resolve(appDirectory, relativePath);
const appSrc = resolveApp("src");

// @ts-ignore
// Backend.prototype.read = function (language, namespace, callback) {
//   let filename = this.services.interpolator.interpolate(this.options.loadPath, {
//     lng: language,
//     ns: namespace,
//   });

//   fs.readFile(filename, (err, resources) => {
//     if (err) return callback(err, false);
//     callback(null, JSON.parse(resources.toString()));
//   });
// };

i18n
  .use(Backend)
  .use(i18nextMiddleware.LanguageDetector)
  .init(
    {
      debug: true,
      fallbackLng: "en",
      whitelist: ["en", "cs"],
      preload: ["en", "cs"],
      ns: ["translation"],
      defaultNS: "translation",
      backend: {
        loadPath: `${appSrc}/locales/{{lng}}/{{ns}}.json`,
        addPath: `${appSrc}/locales/{{lng}}/{{ns}}.missing.json`,
      },
    },
    (err) => {
      console.log("err", err);
      server
        .disable("x-powered-by")
        .use(i18nextMiddleware.handle(i18n))
        .use("/locales", express.static(`${appSrc}/locales`))
        .use(express.static(process.env.RAZZLE_PUBLIC_DIR!))
        .get("/*", (req: any, res: express.Response) => {
          const sheets = new ServerStyleSheets();
          const context = {};
          const env = {
            BACKEND_API_URL: backendApiBase,
          };
          const markup = renderStylesToString(
            renderToString(
              sheets.collect(
                <I18nextProvider i18n={req.i18n}>
                  <CacheProvider value={cache}>
                    <ThemeProvider theme={theme}>
                      <StaticRouter context={context} location={req.url}>
                        <App />
                      </StaticRouter>
                    </ThemeProvider>
                  </CacheProvider>
                </I18nextProvider>
              )
            )
          );
          const requestI18n = (req as I18NextRequest).i18n;
          const initialI18nStore = {};
          // console.log(requestI18n.services.resourceStore.data);
          requestI18n.languages.forEach((l) => {
            initialI18nStore[l] = requestI18n.services.resourceStore.data[l];
          });
          const initialLanguage = requestI18n.language;

          const css = sheets.toString();
          res.status(200).send(
            `<!doctype html>
          <html lang="">
          <head>
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <meta charSet='utf-8' />
            <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon">
            <link rel="icon" href="/favicon.ico" type="image/x-icon">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <meta name="description" content="S BattleBakers je esport pro všechny dostupnější. Turnaje o ceny ve hrách Fortnite, Valorant a League of Legends."/>
            <title>Turnaje o ceny ve hrách Fotnite, League of Legends a Valorant - BattleBakers.cz</title>
            <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;800;900&display=swap" rel="stylesheet">
            <!-- Global site tag (gtag.js) - Google Analytics -->
            <script>
              window.env = ${serialize(env)}
              window.initialI18nStore = ${serialize(initialI18nStore)});
              window.initialLanguage = ${serialize(initialLanguage)};
              </script>
            <script async src="https://www.googletagmanager.com/gtag/js?id=UA-165755971-1"></script>
            <script>
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', 'UA-165755971-1');
            </script>
            <style>
            body {
              margin: 0;
              font-family: "Poppins", sans-serif;
              -webkit-font-smoothing: antialiased;
              -moz-osx-font-smoothing: grayscale;
              background: #121314;
              color: #ffffff;
              min-height: 100vh;
            }
            
            a {
              color: inherit;
              text-decoration: none;
            }        
            </style>
            ${css ? `<style id='jss-ssr'>${css}</style>` : ""}
            ${
              assets.client.css
                ? `<link rel="stylesheet" href="${assets.client.css}">`
                : ""
            }        ${
              process.env.NODE_ENV === "production"
                ? `<script src="${assets.client.js}" defer></script>`
                : `<script src="${assets.client.js}" defer crossorigin></script>`
            }
              </head>
            <body>
            <div id="root">${markup}</div>
            </body>
        </html>`
          );
        });
    }
  );
export default server;
