// src/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslation from '../../public/locales/en.json';
import esTranslation from '../../public/locales/es.json';

const resources = {
  en: { translation: enTranslation },
  es: { translation: esTranslation },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;