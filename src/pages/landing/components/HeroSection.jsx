import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const HeroSection = () => {
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const ctaRef = useRef(null);
  const statsRef = useRef(null);
  const floatingElementsRef = useRef(null);
  const rotatingWordsRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.5 });
    
    // Hero animation sequence
    tl.fromTo(titleRef.current.children, 
      { y: 100, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1.2, stagger: 0.2, ease: "power4.out" })
      .fromTo(subtitleRef.current, 
        { y: 50, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1, ease: "power3.out" }, "-=0.5")
      .fromTo(ctaRef.current.children, 
        { y: 30, opacity: 0, scale: 0.9 }, 
        { y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.1, ease: "back.out(1.7)" }, "-=0.3")
      .fromTo(statsRef.current.children, 
        { y: 20, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power2.out" }, "-=0.2");

    // Floating elements animation
    gsap.to(floatingElementsRef.current.children, {
      y: -20,
      duration: 3,
      repeat: -1,
      yoyo: true,
      stagger: 0.5,
      ease: "power2.inOut"
    });

    // Parallax effect for background elements
    gsap.to(".hero-bg-element", {
      yPercent: -50,
      ease: "none",
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    });

    // Rotating words animation with GSAP
    const words = rotatingWordsRef.current.children;
    const wordsArray = Array.from(words);
    
    // Set initial state - hide all except first
    gsap.set(wordsArray.slice(1), { opacity: 0, y: 20 });
    
    // Create rotation timeline
    const rotationTl = gsap.timeline({ repeat: -1 });
    
    wordsArray.forEach((word, index) => {
      const nextIndex = (index + 1) % wordsArray.length;
      const nextWord = wordsArray[nextIndex];
      
      rotationTl
        .to(word, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" })
        .to(word, { opacity: 1, y: 0, duration: 2 }) // Stay visible for 2 seconds
        .to(word, { opacity: 0, y: -20, duration: 0.5, ease: "power2.in" })
        .set(nextWord, { y: 20 }, "<")
        .to(nextWord, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, "<0.2");
    });

  }, []);

  return (
    <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      
      {/* Floating Code Symbols */}
      <div ref={floatingElementsRef} className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 text-6xl text-pink-400/20 hero-bg-element">&lt;/&gt;</div>
        <div className="absolute top-32 right-20 text-4xl text-purple-400/25 hero-bg-element">&#123; &#125;</div>
        <div className="absolute bottom-40 left-20 text-5xl text-blue-400/20 hero-bg-element">&#91; &#93;</div>
        <div className="absolute bottom-20 right-10 text-3xl text-cyan-400/25 hero-bg-element">&#40; &#41;</div>
        <div className="absolute top-1/2 left-1/4 text-2xl text-indigo-400/20 hero-bg-element">===</div>
        <div className="absolute top-1/3 right-1/3 text-4xl text-slate-400/25 hero-bg-element">/**/</div>
        <div className="absolute bottom-1/3 left-1/2 text-3xl text-purple-400/25 hero-bg-element">=&gt;</div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-5xl mx-auto">
          
          {/* Glassmorphism Container */}
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-12 border border-white/20 shadow-2xl">
            
            {/* Main Title */}
            <div ref={titleRef} className="mb-8">
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-black mb-4">
                <span className="block bg-gradient-to-r from-pink-400 via-purple-500 to-blue-400 bg-clip-text text-transparent drop-shadow-2xl">
                  Merge
                </span>
                <span className="block bg-gradient-to-r from-purple-400 via-blue-500 to-cyan-400 bg-clip-text text-transparent -mt-4 drop-shadow-2xl">
                  Mates
                </span>
              </h1>
              
              {/* Fixed Tagline with Rotating Words */}
              <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-white/90 mb-6 flex items-center justify-center gap-3 flex-wrap">
                <span className="whitespace-nowrap">Where Developers Find</span>
                <div className="relative min-w-[180px] h-12 flex items-center justify-center">
                  <div ref={rotatingWordsRef} className="absolute inset-0 flex items-center justify-center">
                    <span className="text-pink-400 font-black absolute">Love</span>
                    <span className="text-purple-400 font-black absolute opacity-0">Partners</span>
                    <span className="text-blue-400 font-black absolute opacity-0">Soulmates</span>
                    <span className="text-cyan-400 font-black absolute opacity-0">Dreams</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Subtitle */}
            <p ref={subtitleRef} className="text-xl md:text-2xl text-gray-200 mb-12 max-w-3xl mx-auto leading-relaxed">
              The world's first AI-powered dating platform designed exclusively for developers. 
              Match based on programming languages, tech stacks, and shared coding passions. 
              <span className="block mt-2 text-purple-400 font-semibold">Because love compiles better with the right syntax. 💕</span>
            </p>

            {/* Enhanced CTA Buttons */}
            <div ref={ctaRef} className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <a 
                href="/signup"
                className="group relative px-12 py-6 bg-gradient-to-r from-pink-500 via-purple-600 to-blue-500 text-white font-bold rounded-2xl text-xl transition-all duration-300 hover:from-pink-600 hover:to-blue-600 hover:scale-110 hover:shadow-2xl hover:shadow-pink-500/50 overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-3">
                  <span>Join MergeMates</span>
                  <span className="text-2xl group-hover:animate-bounce">🚀</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-400 rounded-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
              </a>
             
              <a 
                href="#features"
                className="group px-8 py-4 border-2 border-purple-400/60 bg-purple-400/10 backdrop-blur-sm text-purple-200 font-semibold rounded-xl text-lg transition-all duration-300 hover:border-purple-300 hover:bg-purple-400/20 hover:text-purple-100"
              >
               <span className="flex items-center gap-2">
                 <span>Learn More</span>
                 <span className="group-hover:translate-x-1 transition-transform">→</span>
               </span>
             </a>
            </div>

            {/* Enhanced Hero Stats */}
            <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="text-center group hover:scale-105 transition-transform duration-300 bg-white/5 rounded-2xl p-4 border border-white/10">
                <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent mb-2 drop-shadow-lg">
                  50K+
                </div>
                <div className="text-gray-300 text-sm font-medium">Active Developers</div>
                <div className="text-xs text-pink-400/80 mt-1">💻 Coding & Dating</div>
              </div>
              
              <div className="text-center group hover:scale-105 transition-transform duration-300 bg-white/5 rounded-2xl p-4 border border-white/10">
                <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent mb-2 drop-shadow-lg">
                  2.5K+
                </div>
                <div className="text-gray-300 text-sm font-medium">Success Stories</div>
                <div className="text-xs text-purple-400/80 mt-1">💕 Happy Couples</div>
              </div>
              
              <div className="text-center group hover:scale-105 transition-transform duration-300 bg-white/5 rounded-2xl p-4 border border-white/10">
                <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent mb-2 drop-shadow-lg">
                  156
                </div>
                <div className="text-gray-300 text-sm font-medium">Tech Weddings</div>
                <div className="text-xs text-blue-400/80 mt-1">💍 Married Devs</div>
              </div>
              
              <div className="text-center group hover:scale-105 transition-transform duration-300 bg-white/5 rounded-2xl p-4 border border-white/10">
                <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent mb-2 drop-shadow-lg">
                  4.9★
                </div>
                <div className="text-gray-300 text-sm font-medium">User Rating</div>
                <div className="text-xs text-cyan-400/80 mt-1">⭐ Highly Rated</div>
              </div>
            </div>
          </div>

          {/* Tech Stack Preview */}
          <div className="mt-16 text-center">
            <p className="text-gray-400 text-sm mb-6">Trusted by developers from top companies</p>
            <div className="flex items-center justify-center gap-8 opacity-60 flex-wrap">
              <div className="text-2xl">🟦 React</div>
              <div className="text-2xl">🟨 JavaScript</div>
              <div className="text-2xl">🐍 Python</div>
              <div className="text-2xl">☕ Java</div>
              <div className="text-2xl">🦀 Rust</div>
              <div className="text-2xl">🔷 TypeScript</div>
              <div className="text-2xl">🐹 Go</div>
              <div className="text-2xl">💎 Ruby</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 