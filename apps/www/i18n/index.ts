import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import i18n from "i18next";

i18n
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    resources: {
      en: {
        translation: en
      }
    },
    fallbackLng: "en",
    debug: false
  });

export default i18n;
