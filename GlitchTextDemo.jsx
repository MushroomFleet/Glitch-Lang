import React, { useState, useEffect, useCallback, useMemo, createContext, useContext, useRef } from 'react';

// ============================================
// LOCALE DATA (normally imported from JSON files)
// ============================================

const LOCALES = {
  'en-US': {
    meta: { code: 'en-US', name: 'English (US)', nativeName: 'English', direction: 'ltr' },
    hero: {
      title: 'Transform Your Reality',
      subtitle: 'Immersive multilingual interfaces with stunning transitions',
      cta: 'Begin Experience',
    },
    nav: { home: 'Home', about: 'About', work: 'Work', contact: 'Contact' },
    features: {
      speed: { title: 'Lightning Fast', desc: 'Optimized character-by-character animations' },
      multi: { title: 'Multi-Language', desc: 'Unlimited language pair support' },
      custom: { title: 'Customizable', desc: 'Full control over timing and effects' },
    },
    demo: { 
      title: 'Interactive Demo',
      select: 'Select Languages',
      from: 'From',
      to: 'To', 
      trigger: 'Trigger Glitch',
      reset: 'Reset',
    },
  },
  'ja-JP': {
    meta: { code: 'ja-JP', name: 'Japanese', nativeName: '日本語', direction: 'ltr' },
    hero: {
      title: '現実を変革せよ',
      subtitle: '見事なトランジションを備えた没入型多言語インターフェース',
      cta: '体験を始める',
    },
    nav: { home: 'ホーム', about: '概要', work: '作品', contact: '連絡' },
    features: {
      speed: { title: '超高速', desc: '最適化された文字単位アニメーション' },
      multi: { title: '多言語対応', desc: '無制限の言語ペアサポート' },
      custom: { title: 'カスタマイズ可能', desc: 'タイミングと効果を完全制御' },
    },
    demo: { 
      title: 'インタラクティブデモ',
      select: '言語を選択',
      from: '元',
      to: '先', 
      trigger: 'グリッチ実行',
      reset: 'リセット',
    },
  },
  'ko-KR': {
    meta: { code: 'ko-KR', name: 'Korean', nativeName: '한국어', direction: 'ltr' },
    hero: {
      title: '현실을 변혁하다',
      subtitle: '놀라운 전환 효과를 갖춘 몰입형 다국어 인터페이스',
      cta: '경험 시작하기',
    },
    nav: { home: '홈', about: '소개', work: '작업', contact: '연락처' },
    features: {
      speed: { title: '초고속', desc: '최적화된 문자별 애니메이션' },
      multi: { title: '다국어 지원', desc: '무제한 언어 쌍 지원' },
      custom: { title: '커스터마이징', desc: '타이밍과 효과 완전 제어' },
    },
    demo: { 
      title: '인터랙티브 데모',
      select: '언어 선택',
      from: '원본',
      to: '대상', 
      trigger: '글리치 실행',
      reset: '리셋',
    },
  },
  'zh-CN': {
    meta: { code: 'zh-CN', name: 'Chinese (Simplified)', nativeName: '简体中文', direction: 'ltr' },
    hero: {
      title: '变革你的现实',
      subtitle: '具有惊艳过渡效果的沉浸式多语言界面',
      cta: '开始体验',
    },
    nav: { home: '首页', about: '关于', work: '作品', contact: '联系' },
    features: {
      speed: { title: '极速', desc: '优化的逐字符动画' },
      multi: { title: '多语言', desc: '支持无限语言对' },
      custom: { title: '可定制', desc: '完全控制时间和效果' },
    },
    demo: { 
      title: '交互演示',
      select: '选择语言',
      from: '从',
      to: '至', 
      trigger: '触发故障效果',
      reset: '重置',
    },
  },
};

const GLITCH_CHARS = {
  mixed: '!@#$%^&*ﾊﾐﾋｰｳｼ01█▓▒░⟨⟩※',
  matrix: 'ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ',
  cyber: '⟨⟩⌈⌉⌊⌋╱╲╳※†‡◊◆◇○●□■',
};

// ============================================
// LANGUAGE CONTEXT
// ============================================

const LanguageContext = createContext(null);

const getValue = (obj, path) => path.split('.').reduce((acc, part) => acc?.[part], obj);

function LanguageProvider({ children, defaultPrimary = 'ja-JP', defaultSecondary = 'en-US' }) {
  const [primary, setPrimary] = useState(defaultPrimary);
  const [secondary, setSecondary] = useState(defaultSecondary);
  const [globalTrigger, setGlobalTrigger] = useState(0);

  const getTranslation = useCallback((key, lang) => getValue(LOCALES[lang], key) ?? key, []);
  
  const triggerAll = useCallback(() => setGlobalTrigger(t => t + 1), []);
  
  const swapLanguages = useCallback(() => {
    setPrimary(secondary);
    setSecondary(primary);
  }, [primary, secondary]);

  const value = useMemo(() => ({
    primary, secondary, setPrimary, setSecondary, swapLanguages,
    getTranslation, globalTrigger, triggerAll,
    languages: Object.entries(LOCALES).map(([code, data]) => ({
      code, name: data.meta.name, nativeName: data.meta.nativeName,
    })),
  }), [primary, secondary, swapLanguages, getTranslation, globalTrigger, triggerAll]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

const useLanguage = () => useContext(LanguageContext);

// ============================================
// GLITCH TEXT COMPONENT
// ============================================

function GlitchText({
  textKey,
  className = '',
  as: Component = 'span',
  speed = 40,
  glitchDuration = 120,
  glitchIntensity = 4,
  glitchCharSet = 'mixed',
  delay = 0,
  style = {},
}) {
  const { primary, secondary, getTranslation, globalTrigger } = useLanguage();
  
  const primaryText = getTranslation(textKey, primary);
  const secondaryText = getTranslation(textKey, secondary);
  
  const [displayText, setDisplayText] = useState(primaryText);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showingSecondary, setShowingSecondary] = useState(false);
  const [glitchOffset, setGlitchOffset] = useState({ x: 0, y: 0 });
  
  const animationRef = useRef(null);
  const glitchChars = GLITCH_CHARS[glitchCharSet] || GLITCH_CHARS.mixed;
  
  const getRandomChar = useCallback(() => 
    glitchChars[Math.floor(Math.random() * glitchChars.length)], [glitchChars]);

  const animate = useCallback(() => {
    const source = showingSecondary ? secondaryText : primaryText;
    const target = showingSecondary ? primaryText : secondaryText;
    const maxLen = Math.max(source.length, target.length);
    
    let currentIndex = 0;
    let glitchPhase = 0;
    
    setIsAnimating(true);
    
    const step = () => {
      if (currentIndex >= maxLen) {
        setDisplayText(target);
        setIsAnimating(false);
        setShowingSecondary(!showingSecondary);
        return;
      }
      
      // Build display text
      let result = '';
      for (let i = 0; i < maxLen; i++) {
        if (i < currentIndex) {
          result += target[i] || '';
        } else if (i === currentIndex) {
          result += glitchPhase < glitchIntensity ? getRandomChar() : (target[i] || '');
        } else {
          result += source[i] || '';
        }
      }
      
      setDisplayText(result);
      setGlitchOffset({
        x: (Math.random() - 0.5) * 3,
        y: (Math.random() - 0.5) * 2,
      });
      
      const nextDelay = glitchPhase < glitchIntensity 
        ? glitchDuration / glitchIntensity 
        : speed;
      
      animationRef.current = setTimeout(() => {
        if (glitchPhase < glitchIntensity) {
          glitchPhase++;
        } else {
          currentIndex++;
          glitchPhase = 0;
        }
        step();
      }, nextDelay);
    };
    
    step();
  }, [primaryText, secondaryText, showingSecondary, speed, glitchDuration, glitchIntensity, getRandomChar]);

  // Trigger on global trigger change
  useEffect(() => {
    if (globalTrigger > 0) {
      const timer = setTimeout(() => {
        if (animationRef.current) clearTimeout(animationRef.current);
        animate();
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [globalTrigger, delay, animate]);

  // Update text when languages change
  useEffect(() => {
    if (!isAnimating) {
      setDisplayText(showingSecondary ? secondaryText : primaryText);
    }
  }, [primaryText, secondaryText, showingSecondary, isAnimating]);

  const glitchStyle = isAnimating ? {
    transform: `translate(${glitchOffset.x}px, ${glitchOffset.y}px)`,
    textShadow: `${-glitchOffset.x}px 0 #ff0040, ${glitchOffset.x}px 0 #00ffff`,
  } : {};

  return (
    <Component 
      className={`${className} ${isAnimating ? 'glitching' : ''}`}
      style={{ ...style, ...glitchStyle, display: 'inline-block' }}
    >
      {displayText}
    </Component>
  );
}

// ============================================
// DEMO APPLICATION
// ============================================

function LanguageSelector({ value, onChange, label }) {
  const { languages } = useLanguage();
  
  return (
    <div className="selector">
      <label>{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)}>
        {languages.map(lang => (
          <option key={lang.code} value={lang.code}>
            {lang.nativeName} ({lang.name})
          </option>
        ))}
      </select>
    </div>
  );
}

function ControlPanel() {
  const { primary, secondary, setPrimary, setSecondary, triggerAll, swapLanguages } = useLanguage();
  
  return (
    <div className="control-panel">
      <div className="selectors">
        <LanguageSelector value={primary} onChange={setPrimary} label="Primary" />
        <button className="swap-btn" onClick={swapLanguages} title="Swap languages">⇄</button>
        <LanguageSelector value={secondary} onChange={setSecondary} label="Target" />
      </div>
      <button className="trigger-btn" onClick={triggerAll}>
        ⚡ Trigger Glitch Transition
      </button>
    </div>
  );
}

function FeatureCard({ titleKey, descKey, icon, delay }) {
  return (
    <div className="feature-card">
      <div className="feature-icon">{icon}</div>
      <h3><GlitchText textKey={titleKey} delay={delay} /></h3>
      <p><GlitchText textKey={descKey} delay={delay + 100} speed={30} /></p>
    </div>
  );
}

function Demo() {
  return (
    <div className="demo-container">
      {/* Navigation */}
      <nav className="nav">
        <div className="nav-brand">
          <GlitchText textKey="hero.cta" className="brand" delay={0} />
        </div>
        <div className="nav-links">
          <GlitchText textKey="nav.home" as="a" delay={50} />
          <GlitchText textKey="nav.about" as="a" delay={100} />
          <GlitchText textKey="nav.work" as="a" delay={150} />
          <GlitchText textKey="nav.contact" as="a" delay={200} />
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>
            <GlitchText 
              textKey="hero.title" 
              delay={0}
              speed={60}
              glitchIntensity={5}
            />
          </h1>
          <p className="hero-subtitle">
            <GlitchText 
              textKey="hero.subtitle" 
              delay={200}
              speed={25}
              glitchIntensity={3}
            />
          </p>
          <button className="hero-cta">
            <GlitchText textKey="hero.cta" delay={400} />
          </button>
        </div>
        <div className="hero-decoration">
          <div className="cyber-grid" />
        </div>
      </section>

      {/* Features */}
      <section className="features">
        <FeatureCard 
          titleKey="features.speed.title" 
          descKey="features.speed.desc" 
          icon="⚡" 
          delay={100}
        />
        <FeatureCard 
          titleKey="features.multi.title" 
          descKey="features.multi.desc" 
          icon="🌐" 
          delay={200}
        />
        <FeatureCard 
          titleKey="features.custom.title" 
          descKey="features.custom.desc" 
          icon="⚙️" 
          delay={300}
        />
      </section>

      {/* Control Panel */}
      <section className="controls">
        <h2>
          <GlitchText textKey="demo.title" delay={0} />
        </h2>
        <ControlPanel />
      </section>
    </div>
  );
}

// ============================================
// MAIN APP WITH STYLES
// ============================================

export default function App() {
  return (
    <LanguageProvider>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;400;500;600;700&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        .demo-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #0f0f1a 100%);
          color: #e0e0e0;
          font-family: 'Rajdhani', sans-serif;
          overflow-x: hidden;
        }
        
        /* Glitch animation states */
        .glitching {
          animation: glitch-shake 0.1s infinite;
        }
        
        @keyframes glitch-shake {
          0%, 100% { transform: translate(0); }
          25% { transform: translate(-1px, 1px); }
          50% { transform: translate(1px, -1px); }
          75% { transform: translate(-1px, -1px); }
        }
        
        /* Navigation */
        .nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 3rem;
          border-bottom: 1px solid rgba(255, 0, 64, 0.2);
          background: rgba(10, 10, 15, 0.8);
          backdrop-filter: blur(10px);
          position: sticky;
          top: 0;
          z-index: 100;
        }
        
        .nav-brand .brand {
          font-family: 'Orbitron', monospace;
          font-size: 1.2rem;
          font-weight: 700;
          color: #ff0040;
          text-transform: uppercase;
          letter-spacing: 2px;
        }
        
        .nav-links {
          display: flex;
          gap: 2.5rem;
        }
        
        .nav-links a {
          color: #8888aa;
          text-decoration: none;
          font-size: 0.95rem;
          font-weight: 500;
          letter-spacing: 1px;
          text-transform: uppercase;
          transition: color 0.3s, text-shadow 0.3s;
          cursor: pointer;
        }
        
        .nav-links a:hover {
          color: #00ffff;
          text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
        }
        
        /* Hero Section */
        .hero {
          min-height: 70vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4rem 3rem;
          position: relative;
          overflow: hidden;
        }
        
        .hero-content {
          text-align: center;
          z-index: 2;
          max-width: 900px;
        }
        
        .hero h1 {
          font-family: 'Orbitron', monospace;
          font-size: clamp(2.5rem, 6vw, 4.5rem);
          font-weight: 900;
          line-height: 1.1;
          margin-bottom: 1.5rem;
          background: linear-gradient(135deg, #ffffff 0%, #ff0040 50%, #00ffff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-transform: uppercase;
          letter-spacing: 4px;
        }
        
        .hero-subtitle {
          font-size: 1.3rem;
          color: #8888aa;
          margin-bottom: 2.5rem;
          letter-spacing: 1px;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }
        
        .hero-cta {
          font-family: 'Orbitron', monospace;
          font-size: 1rem;
          font-weight: 600;
          padding: 1rem 2.5rem;
          background: transparent;
          border: 2px solid #ff0040;
          color: #ff0040;
          text-transform: uppercase;
          letter-spacing: 2px;
          cursor: pointer;
          transition: all 0.3s;
          position: relative;
          overflow: hidden;
        }
        
        .hero-cta::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 0, 64, 0.3), transparent);
          transition: left 0.5s;
        }
        
        .hero-cta:hover {
          background: #ff0040;
          color: #0a0a0f;
          box-shadow: 0 0 30px rgba(255, 0, 64, 0.5);
        }
        
        .hero-cta:hover::before {
          left: 100%;
        }
        
        .hero-decoration {
          position: absolute;
          inset: 0;
          z-index: 1;
          opacity: 0.15;
        }
        
        .cyber-grid {
          width: 100%;
          height: 100%;
          background-image: 
            linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px);
          background-size: 50px 50px;
          animation: grid-move 20s linear infinite;
        }
        
        @keyframes grid-move {
          0% { transform: perspective(500px) rotateX(60deg) translateY(0); }
          100% { transform: perspective(500px) rotateX(60deg) translateY(50px); }
        }
        
        /* Features */
        .features {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
          padding: 4rem 3rem;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .feature-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 0, 64, 0.2);
          padding: 2rem;
          text-align: center;
          transition: all 0.3s;
          position: relative;
          overflow: hidden;
        }
        
        .feature-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, transparent, #ff0040, #00ffff, transparent);
          transform: translateX(-100%);
          transition: transform 0.5s;
        }
        
        .feature-card:hover {
          border-color: rgba(0, 255, 255, 0.4);
          transform: translateY(-5px);
          box-shadow: 0 10px 40px rgba(0, 255, 255, 0.1);
        }
        
        .feature-card:hover::before {
          transform: translateX(0);
        }
        
        .feature-icon {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }
        
        .feature-card h3 {
          font-family: 'Orbitron', monospace;
          font-size: 1.2rem;
          font-weight: 700;
          margin-bottom: 0.75rem;
          color: #00ffff;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        
        .feature-card p {
          color: #8888aa;
          font-size: 0.95rem;
          line-height: 1.6;
        }
        
        /* Controls */
        .controls {
          padding: 4rem 3rem;
          text-align: center;
          border-top: 1px solid rgba(255, 0, 64, 0.2);
          background: rgba(0, 0, 0, 0.3);
        }
        
        .controls h2 {
          font-family: 'Orbitron', monospace;
          font-size: 1.8rem;
          font-weight: 700;
          margin-bottom: 2rem;
          color: #ffffff;
          text-transform: uppercase;
          letter-spacing: 3px;
        }
        
        .control-panel {
          max-width: 700px;
          margin: 0 auto;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 0, 64, 0.3);
          padding: 2rem;
        }
        
        .selectors {
          display: flex;
          align-items: flex-end;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }
        
        .selector {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .selector label {
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #8888aa;
        }
        
        .selector select {
          font-family: 'Rajdhani', sans-serif;
          font-size: 1rem;
          padding: 0.75rem 1rem;
          background: rgba(0, 0, 0, 0.5);
          border: 1px solid rgba(255, 0, 64, 0.3);
          color: #e0e0e0;
          cursor: pointer;
          min-width: 200px;
          transition: all 0.3s;
        }
        
        .selector select:hover,
        .selector select:focus {
          border-color: #00ffff;
          outline: none;
          box-shadow: 0 0 10px rgba(0, 255, 255, 0.2);
        }
        
        .swap-btn {
          font-size: 1.5rem;
          padding: 0.5rem 1rem;
          background: transparent;
          border: 1px solid rgba(255, 0, 64, 0.3);
          color: #ff0040;
          cursor: pointer;
          transition: all 0.3s;
          margin-bottom: 0;
        }
        
        .swap-btn:hover {
          background: rgba(255, 0, 64, 0.1);
          transform: scale(1.1);
        }
        
        .trigger-btn {
          font-family: 'Orbitron', monospace;
          font-size: 1.1rem;
          font-weight: 600;
          padding: 1rem 3rem;
          background: linear-gradient(135deg, #ff0040, #ff4080);
          border: none;
          color: white;
          text-transform: uppercase;
          letter-spacing: 2px;
          cursor: pointer;
          transition: all 0.3s;
          position: relative;
          overflow: hidden;
        }
        
        .trigger-btn::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          transition: width 0.6s, height 0.6s;
        }
        
        .trigger-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 0 40px rgba(255, 0, 64, 0.6);
        }
        
        .trigger-btn:hover::after {
          width: 300px;
          height: 300px;
        }
        
        .trigger-btn:active {
          transform: scale(0.98);
        }
        
        /* Responsive */
        @media (max-width: 768px) {
          .nav {
            padding: 1rem 1.5rem;
            flex-direction: column;
            gap: 1rem;
          }
          
          .nav-links {
            gap: 1.5rem;
          }
          
          .hero {
            padding: 3rem 1.5rem;
          }
          
          .features {
            padding: 2rem 1.5rem;
          }
          
          .controls {
            padding: 2rem 1.5rem;
          }
          
          .selectors {
            flex-direction: column;
            align-items: center;
          }
          
          .swap-btn {
            transform: rotate(90deg);
          }
        }
      `}</style>
      <Demo />
    </LanguageProvider>
  );
}
