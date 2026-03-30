'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import viTranslations from '@/locales/vi.json';
import enTranslations from '@/locales/en.json';

type Locale = 'vi' | 'en';
type Translations = typeof viTranslations;

interface I18nContextType {
  locale: Locale;
  t: Translations;
  toggleLocale: () => void;
}

const translations: Record<Locale, Translations> = {
  vi: viTranslations,
  en: enTranslations,
};

const I18nContext = createContext<I18nContextType>({
  locale: 'vi',
  t: viTranslations,
  toggleLocale: () => {},
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('vi');

  const toggleLocale = useCallback(() => {
    setLocale((prev) => (prev === 'vi' ? 'en' : 'vi'));
  }, []);

  return (
    <I18nContext.Provider value={{ locale, t: translations[locale], toggleLocale }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
