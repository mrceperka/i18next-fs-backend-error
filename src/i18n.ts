import i18n, { InitOptions } from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";

const options: InitOptions = {
  // resources,
  lng: "en",
  fallbackLng: "en",
  preload: ["en", "cs"],
  ns: ["translation"],
  defaultNS: "translation",
  react: {
    useSuspense: false,
    wait: true,
  },
  interpolation: {
    formatSeparator: ",",
    format: (value, format) => {
      if (format === "uppercase") {
        return value.toUpperCase();
      }

      if (format === "lowerCase") {
        return value.toLowerCase();
      }

      return value;
    },
  },
};

if (process && !process.release) {
  i18n.use(Backend).use(initReactI18next).use(LanguageDetector);
}

// initialize if not already initialized
if (!i18n.isInitialized) {
  i18n.init(options);
}

export default i18n;
