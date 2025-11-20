'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { messages } from '@/lib/i18n/messages';

type Language = 'en' | 'es';
type Messages = typeof messages.en;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Messages;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    // Get language from localStorage or browser
    const savedLang = localStorage.getItem('preferred-language') as Language;
    if (savedLang && (savedLang === 'en' || savedLang === 'es')) {
      setLanguageState(savedLang);
    } else {
      // Detect browser language
      const browserLang = navigator.language.split('-')[0];
      if (browserLang === 'es') {
        setLanguageState('es');
      }
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('preferred-language', lang);
  };

  const value = {
    language,
    setLanguage,
    t: messages[language],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
