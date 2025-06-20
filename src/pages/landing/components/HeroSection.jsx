import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const HeroSection = () => {
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const ctaRef = useRef(null);
  const statsRef = useRef(null);
  const floatingElementsRef = useRef(null);

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

  }, []);

  return (
    <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-purple-900 via-slate-900 to-black">
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
                  {/* Floating Code Symbols */}
          <div ref={floatingElementsRef} className="absolute inset-0">
            <div className="absolute top-20 left-10 text-6xl text-pink-500/20 hero-bg-element">&lt;/&gt;</div>
            <div className="absolute top-32 right-20 text-4xl text-purple-500/20 hero-bg-element">&#123; &#125;</div>
            <div className="absolute bottom-40 left-20 text-5xl text-cyan-500/20 hero-bg-element">&#91; &#93;</div>
            <div className="absolute bottom-20 right-10 text-3xl text-green-500/20 hero-bg-element">&#40; &#41;</div>
            <div className="absolute top-1/2 left-1/4 text-2xl text-yellow-500/20 hero-bg-element">===</div>
            <div className="absolute top-1/3 right-1/3 text-4xl text-red-500/20 hero-bg-element">/**/</div>
            <div className="absolute bottom-1/3 left-1/2 text-3xl text-blue-500/20 hero-bg-element">=&gt;</div>
          </div>

        {/* Gradient Orbs */}
        <div className="absolute top-20 -left-20 w-72 h-72 bg-gradient-to-r from-pink-500/30 to-purple-600/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 -right-20 w-96 h-96 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-purple-500/25 to-pink-500/25 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDYwIDAgTCAwIDAgMCA2MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-5xl mx-auto">
          
          {/* Main Title */}
          <div ref={titleRef} className="mb-8">
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black mb-4">
              <span className="block bg-gradient-to-r from-pink-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
                Dev
              </span>
              <span className="block bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-400 bg-clip-text text-transparent -mt-4">
                Tinder
              </span>
            </h1>
            
            {/* Tagline with Rotating Words */}
            <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-white/90 mb-6 flex items-center justify-center gap-3">
              <span>Where Developers Find</span>
              <div className="relative h-12 w-32 overflow-hidden">
                <div className="absolute inset-0 animate-slideUp">
                  <div className="h-12 flex items-center justify-start text-pink-400">Love</div>
                  <div className="h-12 flex items-center justify-start text-purple-400">Partners</div>
                  <div className="h-12 flex items-center justify-start text-cyan-400">Soulmates</div>
                  <div className="h-12 flex items-center justify-start text-green-400">Connections</div>
                </div>
              </div>
            </div>
          </div>

          {/* Subtitle */}
          <p ref={subtitleRef} className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            The world's first dating platform designed exclusively for developers. 
            Match based on programming languages, tech stacks, and shared coding passions. 
            <span className="block mt-2 text-pink-400 font-semibold">Because love compiles better with the right syntax. 💕</span>
          </p>

          {/* CTA Buttons */}
          <div ref={ctaRef} className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <a 
              href="/signup"
              className="group relative px-10 py-5 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-2xl text-xl transition-all duration-300 hover:from-pink-600 hover:to-purple-700 hover:scale-110 hover:shadow-2xl hover:shadow-pink-500/50"
            >
              <span className="relative z-10 flex items-center gap-3">
                <span>Join DevTinder</span>
                <span className="text-2xl group-hover:animate-bounce">🚀</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-500 rounded-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
            </a>
            
            <a 
              href="#features"
              className="group px-8 py-4 border-2 border-purple-400/50 text-purple-300 font-semibold rounded-xl text-lg transition-all duration-300 hover:border-purple-400 hover:bg-purple-400/10 hover:text-purple-200"
            >
              <span className="flex items-center gap-2">
                <span>Learn More</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </span>
            </a>
          </div>

          {/* Hero Stats */}
          <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mb-16">
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent mb-2">
                50K+
              </div>
              <div className="text-gray-400 text-sm font-medium">Active Developers</div>
              <div className="text-xs text-gray-500 mt-1">💻 Coding & Dating</div>
            </div>
            
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-cyan-500 bg-clip-text text-transparent mb-2">
                2.5K+
              </div>
              <div className="text-gray-400 text-sm font-medium">Success Stories</div>
              <div className="text-xs text-gray-500 mt-1">💕 Happy Couples</div>
            </div>
            
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-green-500 bg-clip-text text-transparent mb-2">
                156
              </div>
              <div className="text-gray-400 text-sm font-medium">Tech Weddings</div>
              <div className="text-xs text-gray-500 mt-1">💍 Married Devs</div>
            </div>
            
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent mb-2">
                4.9★
              </div>
              <div className="text-gray-400 text-sm font-medium">User Rating</div>
              <div className="text-xs text-gray-500 mt-1">⭐ Highly Rated</div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <span className="text-green-400">✓</span>
              <span>100% Free to Start</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <span className="text-green-400">✓</span>
              <span>Privacy Protected</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <span className="text-green-400">✓</span>
              <span>Developer Verified</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <span className="text-green-400">✓</span>
              <span>No Fake Profiles</span>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            <div className="flex flex-col items-center animate-bounce">
              <span className="text-gray-400 text-sm mb-2">Scroll to explore</span>
              <div className="w-1 h-8 bg-gradient-to-b from-purple-500 to-transparent rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Elements */}
      <div className="absolute bottom-20 right-20 hidden lg:block">
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-2xl animate-pulse">
            💕
          </div>
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-cyan-400 rounded-full flex items-center justify-center text-xs font-bold text-black">
            +
          </div>
        </div>
      </div>

      {/* CSS for rotating words animation */}
      <style jsx>{`
        @keyframes slideUp {
          0% { transform: translateY(0); }
          25% { transform: translateY(-100%); }
          50% { transform: translateY(-200%); }
          75% { transform: translateY(-300%); }
          100% { transform: translateY(-400%); }
        }
        .animate-slideUp {
          animation: slideUp 8s infinite;
        }
      `}</style>
    </section>
  );
};

export default HeroSection; 