# Glitch i18n — Multi-Language Text Transition System

A React component library for creating immersive, character-by-character glitch text transitions between languages. Perfect for creating cyberpunk-themed multilingual interfaces.

## Features

- **Character-by-character animation** — Text transitions wipe from left to right
- **Glitch effect** — Randomized characters with chromatic aberration during transition
- **Multi-language support** — JSON-based locale files for unlimited language pairs
- **Customizable timing** — Control speed, glitch intensity, and delay
- **React Context integration** — Global state management for language switching
- **Staggered animations** — Orchestrate multiple text elements with delays

## Installation

Copy the following files into your React project:

```
src/
├── components/
│   ├── LanguageContext.jsx
│   └── GlitchText.jsx
├── hooks/
│   └── useGlitchTranslation.js
├── locales/
│   ├── en-US.json
│   ├── ja-JP.json
│   └── es-ES.json
└── index.js
```

## Quick Start

### 1. Wrap Your App with LanguageProvider

```jsx
import { LanguageProvider } from './index';

function App() {
  return (
    <LanguageProvider 
      primaryLanguage="ja-JP" 
      secondaryLanguage="en-US"
    >
      <YourApp />
    </LanguageProvider>
  );
}
```

### 2. Use GlitchText Component

```jsx
import { GlitchText } from './index';

function Hero() {
  return (
    <h1>
      <GlitchText 
        textKey="hero.title"
        speed={50}
        glitchIntensity={4}
        delay={0}
      />
    </h1>
  );
}
```

### 3. Trigger Transitions

```jsx
import { useGlitchAnimation } from './index';

function Controls() {
  const { trigger, reset, isAnimating } = useGlitchAnimation();
  
  return (
    <button onClick={trigger} disabled={isAnimating}>
      Trigger Glitch
    </button>
  );
}
```

## API Reference

### `<LanguageProvider>`

Props:
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `primaryLanguage` | string | `'ja-JP'` | Source language code |
| `secondaryLanguage` | string | `'en-US'` | Target language code |
| `children` | ReactNode | — | Child components |

### `<GlitchText>`

Props:
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `textKey` | string | — | Translation key (e.g., `'hero.title'`) |
| `as` | string | `'span'` | HTML element to render |
| `speed` | number | `50` | Ms per character after glitch |
| `glitchDuration` | number | `150` | Total ms for glitch phase |
| `glitchIntensity` | number | `3` | Number of glitch frames |
| `glitchCharSet` | string | `'mixed'` | Character set for glitch |
| `delay` | number | `0` | Delay before animation starts |
| `autoPlay` | boolean | `false` | Auto-trigger on global event |
| `onComplete` | function | — | Callback when animation ends |
| `className` | string | — | Additional CSS classes |
| `style` | object | — | Inline styles |

### `useGlitchTranslation()`

Returns:
```js
{
  t,              // Get secondary language translation
  tPrimary,       // Get primary language translation
  tPair,          // Get both translations
  tLang,          // Get translation for specific language
  primary,        // Current primary language code
  secondary,      // Current secondary language code
  setPrimary,     // Set primary language
  setSecondary,   // Set secondary language
  swapLanguages,  // Swap primary and secondary
  isTransitioning, // Animation state
  triggerTransition, // Trigger global animation
  resetTransition,   // Reset animation state
  availableLanguages, // Array of available languages
}
```

### Glitch Character Sets

| Set | Characters |
|-----|------------|
| `default` | `!@#$%^&*()_+-=[]{}` |
| `matrix` | Japanese katakana |
| `binary` | `01` |
| `blocks` | `█▓▒░▄▀■□▪▫` |
| `cyber` | `⟨⟩⌈⌉⌊⌋╱╲╳※†‡` |
| `mixed` | Combination of all |

## Locale File Structure

Each locale file should follow this structure:

```json
{
  "meta": {
    "code": "en-US",
    "name": "English (US)",
    "nativeName": "English",
    "direction": "ltr"
  },
  "navigation": {
    "home": "Home",
    "about": "About"
  },
  "hero": {
    "title": "Welcome",
    "subtitle": "Your subtitle here"
  }
}
```

## Adding New Languages

1. Create a new JSON file (e.g., `de-DE.json`)
2. Import and register in `LanguageContext.jsx`:

```jsx
import deDE from '../locales/de-DE.json';

const LOCALES = {
  'en-US': enUS,
  'ja-JP': jaJP,
  'de-DE': deDE, // Add new locale
};
```

## Styling the Glitch Effect

The component applies the following classes and data attributes:

```css
.glitch-text { /* Base styles */ }
.glitch-text--animating { /* During animation */ }
[data-animating="true"] { /* Alternative selector */ }
```

The component also applies inline styles for chromatic aberration:

```css
text-shadow: Xpx 0 rgba(255,0,0,0.7), -Xpx 0 rgba(0,255,255,0.7);
```

## Example: Staggered Animation

```jsx
import { GlitchTextTrigger, GlitchText } from './index';

function StaggeredContent() {
  return (
    <GlitchTextTrigger staggerDelay={100}>
      <h1><GlitchText textKey="hero.title" /></h1>
      <p><GlitchText textKey="hero.subtitle" /></p>
      <button><GlitchText textKey="hero.cta" /></button>
    </GlitchTextTrigger>
  );
}
```

## Performance Tips

- Use `delay` to stagger many simultaneous animations
- Lower `glitchIntensity` for faster transitions
- Consider `useMemo` for static text configurations
- The component uses `requestAnimationFrame`-friendly timeouts

## License

MIT
