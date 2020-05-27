import * as Localization from 'expo-localization';
import i18n from 'i18n-js';
// When a value is missing from a language it'll fallback to another language with the key present.
i18n.fallbacks = true;


i18n.translations = {
    en: { welcome: 'Hello' },
    ar: { welcome: 'こんにちは' },
  };
  


const ar = {
    "last_time_update":"تم التحديث في",

}


export default { ar };