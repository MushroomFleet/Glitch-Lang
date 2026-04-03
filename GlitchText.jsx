import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useLanguage } from './LanguageContext';

// Glitch character sets for different visual effects
const GLITCH_CHARS = {
  default: '!@#$%^&*()_+-=[]{}|;:,.<>?/~`',
  matrix: 'ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ',
  binary: '01',
  blocks: '█▓▒░▄▀■□▪▫',
  cyber: '⟨⟩⌈⌉⌊⌋╱╲╳※†‡',
  mixed: '!@#$%^&*ﾊﾐﾋｰｳｼ01█▓▒░',
};

/**
 * GlitchText Component
 * 
 * Displays text that transitions from one language to another with a
 * character-by-character glitch effect, wiping from left to right.
 * 
 * Props:
 * - textKey: The translation key (e.g., 'hero.title')
 * - className: Additional CSS classes
 * - as: The HTML element to render (default: 'span')
 * - speed: Animation speed in ms per character (default: 50)
 * - glitchDuration: How long each character glitches in ms (default: 150)
 * - glitchIntensity: Number of glitch frames per character (default: 3)
 * - glitchCharSet: Which character set to use for glitch effect
 * - delay: Delay before animation starts in ms (default: 0)
 * - autoPlay: Start animation automatically (default: false)
 * - onComplete: Callback when animation completes
 * - showPrimary: If true, show primary language; if false, show secondary
 * - staggerChildren: For parent containers, stagger child animations
 */
export function GlitchText({
  textKey,
  className = '',
  as: Component = 'span',
  speed = 50,
  glitchDuration = 150,
  glitchIntensity = 3,
  glitchCharSet = 'mixed',
  delay = 0,
  autoPlay = false,
  onComplete,
  showPrimary = true,
  style = {},
}) {
  const { getTranslationPair, isTransitioning } = useLanguage();
  const { primary: primaryText, secondary: secondaryText } = getTranslationPair(textKey);
  
  const [displayText, setDisplayText] = useState(showPrimary ? primaryText : secondaryText);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [glitchPhase, setGlitchPhase] = useState(0);
  
  const animationRef = useRef(null);
  const glitchChars = GLITCH_CHARS[glitchCharSet] || GLITCH_CHARS.default;
  
  // Determine source and target based on current state
  const sourceText = showPrimary ? primaryText : secondaryText;
  const targetText = showPrimary ? secondaryText : primaryText;
  
  // Get a random glitch character
  const getRandomGlitchChar = useCallback(() => {
    return glitchChars[Math.floor(Math.random() * glitchChars.length)];
  }, [glitchChars]);
  
  // Build the display text with glitch effect at current position
  const buildDisplayText = useCallback((index, phase, source, target) => {
    const maxLen = Math.max(source.length, target.length);
    let result = '';
    
    for (let i = 0; i < maxLen; i++) {
      if (i < index) {
        // Already transitioned - show target character
        result += target[i] || '';
      } else if (i === index) {
        // Currently glitching
        if (phase < glitchIntensity) {
          // Show glitch character
          result += getRandomGlitchChar();
        } else {
          // Show target character
          result += target[i] || '';
        }
      } else {
        // Not yet reached - show source character
        result += source[i] || '';
      }
    }
    
    return result;
  }, [glitchIntensity, getRandomGlitchChar]);
  
  // Start the glitch animation
  const startAnimation = useCallback(() => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setCurrentIndex(0);
    setGlitchPhase(0);
  }, [isAnimating]);
  
  // Reset to initial state
  const reset = useCallback(() => {
    setIsAnimating(false);
    setCurrentIndex(-1);
    setGlitchPhase(0);
    setDisplayText(sourceText);
  }, [sourceText]);
  
  // Animation loop
  useEffect(() => {
    if (!isAnimating || currentIndex < 0) return;
    
    const maxLen = Math.max(sourceText.length, targetText.length);
    
    if (currentIndex >= maxLen) {
      // Animation complete
      setIsAnimating(false);
      setDisplayText(targetText);
      onComplete?.();
      return;
    }
    
    // Update display text
    setDisplayText(buildDisplayText(currentIndex, glitchPhase, sourceText, targetText));
    
    // Schedule next frame
    const nextDelay = glitchPhase < glitchIntensity 
      ? glitchDuration / glitchIntensity 
      : speed;
    
    animationRef.current = setTimeout(() => {
      if (glitchPhase < glitchIntensity) {
        setGlitchPhase(p => p + 1);
      } else {
        setCurrentIndex(i => i + 1);
        setGlitchPhase(0);
      }
    }, nextDelay);
    
    return () => clearTimeout(animationRef.current);
  }, [
    isAnimating,
    currentIndex,
    glitchPhase,
    sourceText,
    targetText,
    speed,
    glitchDuration,
    glitchIntensity,
    buildDisplayText,
    onComplete,
  ]);
  
  // Auto-play when global transition is triggered
  useEffect(() => {
    if (isTransitioning && autoPlay) {
      const timer = setTimeout(startAnimation, delay);
      return () => clearTimeout(timer);
    }
  }, [isTransitioning, autoPlay, delay, startAnimation]);
  
  // Update display text when translations change (without animation)
  useEffect(() => {
    if (!isAnimating) {
      setDisplayText(showPrimary ? primaryText : secondaryText);
    }
  }, [primaryText, secondaryText, showPrimary, isAnimating]);
  
  // Compute styles for glitch effect
  const glitchStyles = useMemo(() => {
    if (!isAnimating) return {};
    
    return {
      textShadow: currentIndex >= 0 
        ? `${Math.random() * 2 - 1}px 0 rgba(255,0,0,0.7), ${Math.random() * 2 - 1}px 0 rgba(0,255,255,0.7)`
        : 'none',
    };
  }, [isAnimating, currentIndex, glitchPhase]);
  
  return (
    <Component 
      className={`glitch-text ${isAnimating ? 'glitch-text--animating' : ''} ${className}`}
      style={{ ...style, ...glitchStyles }}
      data-text-key={textKey}
      data-animating={isAnimating}
    >
      {displayText}
    </Component>
  );
}

/**
 * GlitchTextTrigger
 * 
 * A wrapper component that triggers animation on its GlitchText children
 * when clicked or when a trigger prop changes.
 */
export function GlitchTextTrigger({
  children,
  trigger = false,
  staggerDelay = 100,
  className = '',
  onClick,
}) {
  const [localTrigger, setLocalTrigger] = useState(0);
  
  const handleClick = useCallback((e) => {
    setLocalTrigger(t => t + 1);
    onClick?.(e);
  }, [onClick]);
  
  // Clone children and inject trigger-related props
  const enhancedChildren = useMemo(() => {
    let childIndex = 0;
    
    const processChild = (child) => {
      if (!React.isValidElement(child)) return child;
      
      if (child.type === GlitchText) {
        const currentIndex = childIndex++;
        return React.cloneElement(child, {
          autoPlay: true,
          delay: currentIndex * staggerDelay,
          key: `glitch-${currentIndex}-${localTrigger}`,
        });
      }
      
      if (child.props?.children) {
        return React.cloneElement(child, {
          children: React.Children.map(child.props.children, processChild),
        });
      }
      
      return child;
    };
    
    return React.Children.map(children, processChild);
  }, [children, staggerDelay, localTrigger]);
  
  return (
    <div className={`glitch-text-trigger ${className}`} onClick={handleClick}>
      {enhancedChildren}
    </div>
  );
}

/**
 * useGlitchAnimation
 * 
 * Hook for programmatic control of glitch animations.
 * Returns functions to trigger animations on specific text elements.
 */
export function useGlitchAnimation() {
  const { triggerTransition, resetTransition, isTransitioning } = useLanguage();
  
  return {
    trigger: triggerTransition,
    reset: resetTransition,
    isAnimating: isTransitioning,
  };
}

export default GlitchText;
