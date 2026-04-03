// Main exports for glitch-i18n system
export { 
  LanguageProvider, 
  useLanguage, 
  AVAILABLE_LANGUAGES 
} from './components/LanguageContext';

export { 
  GlitchText, 
  GlitchTextTrigger, 
  useGlitchAnimation 
} from './components/GlitchText';

export { 
  useGlitchTranslation 
} from './hooks/useGlitchTranslation';

// Default export for convenience
export { GlitchText as default } from './components/GlitchText';
