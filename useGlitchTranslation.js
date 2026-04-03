import { useCallback, useMemo } from 'react';
import { useLanguage } from './LanguageContext';

/**
 * useGlitchTranslation Hook
 * 
 * A convenient hook for accessing translations in components.
 * 
 * Usage:
 * const { t, tPair, primary, secondary } = useGlitchTranslation();
 * 
 * // Get secondary (display) language translation
 * const title = t('hero.title');
 * 
 * // Get both translations for custom handling
 * const { primary, secondary } = tPair('hero.title');
 */
export function useGlitchTranslation() {
  const {
    primary,
    secondary,
    getTranslation,
    getTranslationPair,
    isTransitioning,
    triggerTransition,
    resetTransition,
    setPrimary,
    setSecondary,
    swapLanguages,
    availableLanguages,
  } = useLanguage();
  
  // Get translation for current secondary (display) language
  const t = useCallback((key) => {
    return getTranslation(key, secondary);
  }, [getTranslation, secondary]);
  
  // Get translation for primary (source) language
  const tPrimary = useCallback((key) => {
    return getTranslation(key, primary);
  }, [getTranslation, primary]);
  
  // Get both translations
  const tPair = useCallback((key) => {
    return getTranslationPair(key);
  }, [getTranslationPair]);
  
  // Get translation for a specific language code
  const tLang = useCallback((key, langCode) => {
    return getTranslation(key, langCode);
  }, [getTranslation]);
  
  return useMemo(() => ({
    // Translation functions
    t,
    tPrimary,
    tPair,
    tLang,
    
    // Language state
    primary,
    secondary,
    
    // Language setters
    setPrimary,
    setSecondary,
    swapLanguages,
    
    // Animation state
    isTransitioning,
    triggerTransition,
    resetTransition,
    
    // Available languages
    availableLanguages,
  }), [
    t,
    tPrimary,
    tPair,
    tLang,
    primary,
    secondary,
    setPrimary,
    setSecondary,
    swapLanguages,
    isTransitioning,
    triggerTransition,
    resetTransition,
    availableLanguages,
  ]);
}

export default useGlitchTranslation;
