import Vue from 'vue'
import VueI18n from 'vue-i18n'

import { RUSSIAN_TRANSLATIONS } from './langs/ru.js'
import { ENGLISH_TRANSLATIONS } from './langs/en.js'

Vue.use(VueI18n)

const TRANSLATIONS = {
    ru: RUSSIAN_TRANSLATIONS,
    en: ENGLISH_TRANSLATIONS
}

export const i18n = new VueI18n({
    locale: 'ru',
    fallbackLocale: 'en',
    messages: TRANSLATIONS
})
