import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

// Import your locale files
import enUS from '../locales/en-US.json';
import jaJP from '../locales/ja-JP.json';
import esES from '../locales/es-ES.json';

// Registry of all available locales
const LOCALES = {
  'en-US': enUS,
  'ja-JP': jaJP,
  'es-ES': esES,
};

// Available languages for UI selection
export const AVAILABLE_LANGUAGES = Object.entries(LOCALES).map(([code, data]) => ({
  code,
  name: data.meta.name,
  nativeName: data.meta.nativeName,
  direction: data.meta.direction,
}));

// Context
const LanguageContext = createContext(null);

/**
 * Get a nested value from an object using dot notation
 * e.g., getValue(obj, 'hero.title') returns obj.hero.title
 */
const getValue = (obj, path) => {
  return path.split('.').reduce((acc, part) => acc?.[part], obj);
};

/**
 * LanguageProvider
 * 
 * Wrap your app with this provider to enable the glitch translation system.
 * 
 * Props:
 * - primaryLanguage: The "source" language code (e.g., 'ja-JP')
 * - secondaryLanguage: The "target" language code (e.g., 'en-US')
 * - children: React children
 * 
 * The glitch effect shows primaryLanguage first, then transitions to secondaryLanguage.
 */
export function LanguageProvider({
  primaryLanguage = 'ja-JP',
  secondaryLanguage = 'en-US',
  children,
}) {
  const [primary, setPrimary] = useState(primaryLanguage);
  const [secondary, setSecondary] = useState(secondaryLanguage);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionProgress, setTransitionProgress] = useState(0);

  // Get translation for a key
  const getTranslation = useCallback((key, languageCode) => {
    const locale = LOCALES[languageCode];
    if (!locale) {
      console.warn(`Locale not found: ${languageCode}`);
      return key;
    }
    const value = getValue(locale, key);
    return value ?? key;
  }, []);

  // Get both primary and secondary translations
  const getTranslationPair = useCallback((key) => {
    return {
      primary: getTranslation(key, primary),
      secondary: getTranslation(key, secondary),
    };
  }, [primary, secondary, getTranslation]);

  // Trigger a global transition
  const triggerTransition = useCallback(() => {
    setIsTransitioning(true);
    setTransitionProgress(0);
  }, []);

  // Reset transition state
  const resetTransition = useCallback(() => {
    setIsTransitioning(false);
    setTransitionProgress(0);
  }, []);

  // Swap primary and secondary languages
  const swapLanguages = useCallback(() => {
    setPrimary(secondary);
    setSecondary(primary);
  }, [primary, secondary]);

  const value = useMemo(() => ({
    primary,
    secondary,
    setPrimary,
    setSecondary,
    swapLanguages,
    isTransitioning,
    transitionProgress,
    setTransitionProgress,
    triggerTransition,
    resetTransition,
    getTranslation,
    getTranslationPair,
    availableLanguages: AVAILABLE_LANGUAGES,
    locales: LOCALES,
  }), [
    primary,
    secondary,
    swapLanguages,
    isTransitioning,
    transitionProgress,
    triggerTransition,
    resetTransition,
    getTranslation,
    getTranslationPair,
  ]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

/**
 * Hook to access the language context
 */
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export default LanguageContext;
