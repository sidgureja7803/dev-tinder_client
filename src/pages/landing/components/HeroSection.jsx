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
    <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      
      {/* Enhanced Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Code Symbols */}
        <div ref={floatingElementsRef} className="absolute inset-0">
          <div className="absolute top-20 left-10 text-6xl text-blue-400/30 hero-bg-element">&lt;/&gt;</div>
          <div className="absolute top-32 right-20 text-4xl text-cyan-400/25 hero-bg-element">&#123; &#125;</div>
          <div className="absolute bottom-40 left-20 text-5xl text-teal-400/30 hero-bg-element">&#91; &#93;</div>
          <div className="absolute bottom-20 right-10 text-3xl text-indigo-400/25 hero-bg-element">&#40; &#41;</div>
          <div className="absolute top-1/2 left-1/4 text-2xl text-sky-400/20 hero-bg-element">===</div>
          <div className="absolute top-1/3 right-1/3 text-4xl text-slate-400/25 hero-bg-element">/**/</div>
          <div className="absolute bottom-1/3 left-1/2 text-3xl text-blue-400/25 hero-bg-element">=&gt;</div>
        </div>

        {/* Enhanced Gradient Orbs */}
        <div className="absolute top-10 -left-32 w-80 h-80 bg-gradient-to-r from-blue-500/40 to-cyan-600/40 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 -right-32 w-96 h-96 bg-gradient-to-r from-cyan-400/30 to-blue-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-indigo-400/35 to-teal-400/35 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-sky-400/25 to-cyan-400/25 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }}></div>
        <div className="absolute bottom-1/4 left-1/4 w-56 h-56 bg-gradient-to-r from-teal-400/20 to-blue-400/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Enhanced Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDYwIDAgTCAwIDAgMCA2MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDgpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-5xl mx-auto">
          
          {/* Main Title */}
          <div ref={titleRef} className="mb-8">
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black mb-4">
              <span className="block bg-gradient-to-r from-blue-400 via-cyan-500 to-teal-400 bg-clip-text text-transparent drop-shadow-2xl">
                Merge
              </span>
              <span className="block bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-400 bg-clip-text text-transparent -mt-4 drop-shadow-2xl">
                Mates
              </span>
            </h1>
            
            {/* Fixed Tagline with Rotating Words */}
            <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-white/90 mb-6 flex items-center justify-center gap-3 flex-wrap">
              <span className="whitespace-nowrap">Where Developers Find</span>
                             <div className="relative min-w-[180px] h-12 flex items-center justify-center">
                 <div ref={rotatingWordsRef} className="absolute inset-0 flex items-center justify-center">
                   <span className="text-blue-400 font-black absolute">Love</span>
                   <span className="text-cyan-400 font-black absolute opacity-0">Partners</span>
                   <span className="text-teal-400 font-black absolute opacity-0">Soulmates</span>
                   <span className="text-indigo-400 font-black absolute opacity-0">Connections</span>
                   <span className="text-sky-400 font-black absolute opacity-0">Dreams</span>
                 </div>
               </div>
            </div>
          </div>

          {/* Enhanced Subtitle */}
                     <p ref={subtitleRef} className="text-xl md:text-2xl text-gray-200 mb-12 max-w-3xl mx-auto leading-relaxed">
             The world's first AI-powered dating platform designed exclusively for developers. 
             Match based on programming languages, tech stacks, and shared coding passions. 
             <span className="block mt-2 text-cyan-400 font-semibold">Because love compiles better with the right syntax. 💕</span>
           </p>

          {/* Enhanced CTA Buttons */}
                     <div ref={ctaRef} className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
             <a 
               href="/signup"
               className="group relative px-12 py-6 bg-gradient-to-r from-blue-500 via-cyan-600 to-teal-500 text-white font-bold rounded-2xl text-xl transition-all duration-300 hover:from-blue-600 hover:to-teal-600 hover:scale-110 hover:shadow-2xl hover:shadow-blue-500/50 overflow-hidden"
             >
               <span className="relative z-10 flex items-center gap-3">
                 <span>Join MergeMates</span>
                 <span className="text-2xl group-hover:animate-bounce">🚀</span>
               </span>
               <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
             </a>
            
                         <a 
               href="#features"
               className="group px-8 py-4 border-2 border-cyan-400/60 bg-cyan-400/10 backdrop-blur-sm text-cyan-200 font-semibold rounded-xl text-lg transition-all duration-300 hover:border-cyan-300 hover:bg-cyan-400/20 hover:text-cyan-100"
             >
              <span className="flex items-center gap-2">
                <span>Learn More</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </span>
            </a>
          </div>

          {/* Enhanced Hero Stats */}
          <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mb-16">
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent mb-2 drop-shadow-lg">
                50K+
              </div>
              <div className="text-gray-300 text-sm font-medium">Active Developers</div>
              <div className="text-xs text-blue-400/80 mt-1">💻 Coding & Dating</div>
            </div>
            
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-cyan-400 to-teal-500 bg-clip-text text-transparent mb-2 drop-shadow-lg">
                2.5K+
              </div>
              <div className="text-gray-300 text-sm font-medium">Success Stories</div>
              <div className="text-xs text-cyan-400/80 mt-1">💕 Happy Couples</div>
            </div>
            
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent mb-2 drop-shadow-lg">
                156
              </div>
              <div className="text-gray-300 text-sm font-medium">Tech Weddings</div>
              <div className="text-xs text-teal-400/80 mt-1">💍 Married Devs</div>
            </div>
            
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-indigo-400 to-cyan-500 bg-clip-text text-transparent mb-2 drop-shadow-lg">
                4.9★
              </div>
              <div className="text-gray-300 text-sm font-medium">User Rating</div>
              <div className="text-xs text-indigo-400/80 mt-1">⭐ Highly Rated</div>
            </div>
          </div>

          {/* Enhanced Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-70">
            <div className="flex items-center gap-2 text-gray-300 text-sm bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full">
              <span className="text-green-400">✓</span>
              <span>100% Free to Start</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300 text-sm bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full">
              <span className="text-green-400">✓</span>
              <span>Privacy Protected</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300 text-sm bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full">
              <span className="text-green-400">✓</span>
              <span>AI-Powered Matching</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300 text-sm bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full">
              <span className="text-green-400">✓</span>
              <span>No Fake Profiles</span>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            <div className="flex flex-col items-center animate-bounce">
              <span className="text-gray-400 text-sm mb-2">Scroll to explore</span>
              <div className="w-1 h-8 bg-gradient-to-b from-cyan-400 to-transparent rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Floating Action Elements */}
      <div className="absolute bottom-20 right-20 hidden lg:block">
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center text-2xl animate-pulse shadow-2xl">
            💕
          </div>
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full flex items-center justify-center text-xs font-bold text-black shadow-lg">
            +
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 