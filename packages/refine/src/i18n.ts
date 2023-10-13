import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import EN from 'src/locales/en-US';
import ZH from 'src/locales/zh-CN';

export const resources = {
  'en-US': EN,
  'zh-CN': ZH,
};

i18n.use(initReactI18next).init({
  supportedLngs: ['en-US', 'zh-CN'],
  resources,
  ns: Object.keys(resources['zh-CN']),
  defaultNS: 'dovetail',
  fallbackLng: ['en-US', 'zh-CN'],
  lng: 'zh-CN',
  nsSeparator: '.',
});

export default i18n;
