import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const FeaturesSection = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const featuresRef = useRef(null);
  const statsRef = useRef(null);
  const floatingElementsRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation with staggered reveals
      gsap.fromTo(titleRef.current.children, 
        { y: 80, opacity: 0, scale: 0.9 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1.2,
          stagger: 0.2,
          ease: "power4.out",
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 80%",
          }
        }
      );

      // Features cards with impressive entrance
      gsap.fromTo(featuresRef.current.children, 
        { y: 120, opacity: 0, scale: 0.8, rotationY: 15 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          rotationY: 0,
          duration: 1,
          stagger: 0.15,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: featuresRef.current,
            start: "top 85%",
          }
        }
      );

      // Stats animation
      gsap.fromTo(statsRef.current.children, 
        { y: 50, opacity: 0, scale: 0.5 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "elastic.out(1, 0.75)",
          scrollTrigger: {
            trigger: statsRef.current,
            start: "top 85%",
          }
        }
      );

      // Floating elements
      gsap.to(floatingElementsRef.current.children, {
        y: -30,
        rotation: 360,
        duration: 6,
        repeat: -1,
        yoyo: true,
        stagger: 1,
        ease: "power2.inOut"
      });

      // Parallax background elements
      gsap.to(".feature-bg-element", {
        yPercent: -50,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const features = [
    {
      icon: "🤖",
      title: "AI-Powered Matching",
      description: "Revolutionary algorithm that analyzes 50+ compatibility factors including coding style, tech preferences, career goals, and personality traits.",
      gradient: "from-purple-500 via-blue-500 to-cyan-500",
      bgGradient: "from-purple-500/20 via-blue-500/20 to-cyan-500/20",
      accentColor: "purple-400",
      isPremium: false,
      stats: "97% accuracy"
    },
    {
      icon: "💕",
      title: "See Who Likes You",
      description: "Skip the guesswork and see exactly who's interested. Get instant confidence knowing your matches are mutual before you swipe.",
      gradient: "from-pink-500 via-rose-500 to-red-500",
      bgGradient: "from-pink-500/20 via-rose-500/20 to-red-500/20",
      accentColor: "pink-400",
      isPremium: true,
      stats: "10x faster matches"
    },
    {
      icon: "∞",
      title: "Unlimited Swipes",
      description: "Never miss a connection. Swipe through endless profiles of talented developers without daily limits or restrictions.",
      gradient: "from-emerald-500 via-teal-500 to-cyan-500",
      bgGradient: "from-emerald-500/20 via-teal-500/20 to-cyan-500/20",
      accentColor: "emerald-400",
      isPremium: true,
      stats: "5x more connections"
    },
    {
      icon: "↶",
      title: "Undo Last Swipe",
      description: "Accidentally swiped left on your dream developer? Premium users can undo their last action and get a second chance at love.",
      gradient: "from-orange-500 via-amber-500 to-yellow-500",
      bgGradient: "from-orange-500/20 via-amber-500/20 to-yellow-500/20",
      accentColor: "orange-400",
      isPremium: true,
      stats: "Second chances"
    },
    {
      icon: "🚀",
      title: "Profile Boost",
      description: "Rocket your profile to the top of the stack. Get 10x more visibility and be seen by premium developers in your area.",
      gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
      bgGradient: "from-violet-500/20 via-purple-500/20 to-fuchsia-500/20",
      accentColor: "violet-400",
      isPremium: true,
      stats: "10x visibility"
    },
    {
      icon: "⚡",
      title: "Super Likes",
      description: "Stand out from the crowd with super likes that instantly notify your crush and put you at the front of their queue.",
      gradient: "from-blue-500 via-indigo-500 to-purple-500",
      bgGradient: "from-blue-500/20 via-indigo-500/20 to-purple-500/20",
      accentColor: "blue-400",
      isPremium: true,
      stats: "3x response rate"
    }
  ];

  return (
    <section ref={sectionRef} className="relative py-32 bg-gradient-to-b from-black via-slate-900 to-purple-900 overflow-hidden">
      
      {/* Epic Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Tech Elements */}
        <div ref={floatingElementsRef} className="absolute inset-0">
          <div className="feature-bg-element absolute top-20 left-10 text-8xl text-purple-500/10">⚛️</div>
          <div className="feature-bg-element absolute top-40 right-20 text-6xl text-cyan-500/10">🐍</div>
          <div className="feature-bg-element absolute bottom-40 left-20 text-7xl text-green-500/10">📱</div>
          <div className="feature-bg-element absolute bottom-20 right-10 text-5xl text-blue-500/10">🔧</div>
          <div className="feature-bg-element absolute top-1/2 left-1/4 text-4xl text-yellow-500/10">⚡</div>
          <div className="feature-bg-element absolute top-1/3 right-1/3 text-6xl text-red-500/10">🔥</div>
        </div>

        {/* Massive Gradient Orbs */}
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-gradient-to-r from-purple-500/30 to-pink-600/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-gradient-to-r from-cyan-500/20 to-blue-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-r from-emerald-500/25 to-teal-500/25 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDEwMCAwIEwgMCAwIDAgMTAwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wMykiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-40"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Epic Section Header */}
        <div ref={titleRef} className="text-center mb-24">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 backdrop-blur-lg rounded-full px-8 py-4 mb-8 border border-white/10">
            <span className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></span>
            <span className="text-purple-300 font-bold text-sm uppercase tracking-widest">Revolutionary Features</span>
            <span className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></span>
          </div>
          
          <h2 className="text-6xl md:text-8xl lg:text-9xl font-black text-white mb-8 leading-tight">
            <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Built for
            </span>
            <span className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent -mt-4">
              Developers
            </span>
          </h2>
          
          <p className="text-2xl md:text-3xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-6">
            Every feature meticulously crafted with the developer mindset in mind.
          </p>
          <p className="text-xl text-purple-400 font-semibold max-w-3xl mx-auto">
            From tech stack matching to GitHub integration - experience dating designed for your world.
          </p>
        </div>

        {/* Enhanced Feature Stats */}
        <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto mb-20">
          <div className="text-center group hover:scale-110 transition-all duration-300">
            <div className="text-5xl md:text-6xl font-black bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-2">
              50+
            </div>
            <div className="text-gray-400 text-sm font-semibold">Compatibility Factors</div>
            <div className="text-xs text-purple-400 mt-1">🧠 AI Powered</div>
          </div>
          
          <div className="text-center group hover:scale-110 transition-all duration-300">
            <div className="text-5xl md:text-6xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
              97%
            </div>
            <div className="text-gray-400 text-sm font-semibold">Match Accuracy</div>
            <div className="text-xs text-cyan-400 mt-1">📊 Precision Matching</div>
          </div>
          
          <div className="text-center group hover:scale-110 transition-all duration-300">
            <div className="text-5xl md:text-6xl font-black bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent mb-2">
              10x
            </div>
            <div className="text-gray-400 text-sm font-semibold">Faster Matches</div>
            <div className="text-xs text-emerald-400 mt-1">⚡ Premium Speed</div>
          </div>
          
          <div className="text-center group hover:scale-110 transition-all duration-300">
            <div className="text-5xl md:text-6xl font-black bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent mb-2">
              24/7
            </div>
            <div className="text-gray-400 text-sm font-semibold">Smart Matching</div>
            <div className="text-xs text-orange-400 mt-1">🤖 Always Learning</div>
          </div>
        </div>

        {/* Epic Features Grid */}
        <div ref={featuresRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto mb-20">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className={`group relative overflow-hidden rounded-3xl backdrop-blur-lg border border-white/20 hover:border-white/40 transition-all duration-700 hover:scale-105 hover:rotate-1 bg-gradient-to-br ${feature.bgGradient} hover:shadow-2xl hover:shadow-${feature.accentColor}/50`}
            >
              {/* Premium Badge */}
              {feature.isPremium && (
                <div className="absolute -top-3 -right-3 z-20">
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-4 py-2 rounded-full text-xs font-black flex items-center gap-2 shadow-lg">
                    <span className="animate-bounce">👑</span>
                    <span>PREMIUM</span>
                  </div>
                </div>
              )}

              {/* Main Content */}
              <div className="relative z-10 p-8">
                {/* Feature Icon with Glow */}
                <div className="mb-8 relative">
                  <div className={`w-20 h-20 bg-gradient-to-r ${feature.gradient} rounded-3xl flex items-center justify-center text-3xl mb-4 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 shadow-lg`}>
                    {feature.icon}
                  </div>
                  <div className={`absolute inset-0 w-20 h-20 bg-gradient-to-r ${feature.gradient} rounded-3xl opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500`}></div>
                  <div className={`w-16 h-2 bg-gradient-to-r ${feature.gradient} rounded-full opacity-60 mt-2`}></div>
                </div>

                {/* Title */}
                <h3 className={`text-2xl font-black text-white mb-4 group-hover:text-${feature.accentColor} transition-colors duration-300`}>
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-gray-300 leading-relaxed text-lg mb-6 group-hover:text-gray-200 transition-colors duration-300">
                  {feature.description}
                </p>

                {/* Stats Badge */}
                <div className={`inline-flex items-center gap-2 bg-${feature.accentColor}/20 text-${feature.accentColor} px-4 py-2 rounded-full text-sm font-bold border border-${feature.accentColor}/30`}>
                  <span className="animate-pulse">📈</span>
                  <span>{feature.stats}</span>
                </div>

                {/* Hover Arrow */}
                <div className="mt-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <div className={`flex items-center gap-2 text-${feature.accentColor} font-bold text-lg`}>
                    <span>Explore Feature</span>
                    <span className="group-hover:translate-x-2 transition-transform text-2xl">→</span>
                  </div>
                </div>
              </div>

              {/* Background Glow Effect */}
              <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity duration-700`}></div>
              
              {/* Corner Accent */}
              <div className={`absolute top-6 right-6 w-4 h-4 bg-gradient-to-r ${feature.gradient} rounded-full opacity-60 group-hover:opacity-100 group-hover:scale-150 transition-all duration-300`}></div>
            </div>
          ))}
        </div>

        {/* Epic Bottom CTA Section */}
        <div className="text-center">
          <div className="max-w-4xl mx-auto mb-12">
            <h3 className="text-4xl md:text-5xl font-black text-white mb-6">
              Ready to Experience the
              <span className="block bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Future of Developer Dating?
              </span>
            </h3>
            <p className="text-xl text-gray-300 mb-8">
              Join 50,000+ developers who've discovered love through technology. Your perfect coding partner is waiting.
            </p>
          </div>
          
          <div className="inline-flex flex-col sm:flex-row gap-8 items-center">
            <a 
              href="/signup"
              className="group relative px-12 py-6 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 text-white font-black rounded-2xl text-xl transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:shadow-purple-500/50 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-3">
                <span>Start Your Journey</span>
                <span className="text-3xl group-hover:animate-bounce">🚀</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-400 opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
            </a>
            
            <div className="text-center">
              <div className="text-sm text-gray-400 mb-2">Join the revolution</div>
              <div className="flex items-center justify-center gap-6 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <span className="text-green-400 text-lg">✓</span>
                  <span className="font-semibold">Free Forever</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="text-green-400 text-lg">✓</span>
                  <span className="font-semibold">Instant Access</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="text-green-400 text-lg">✓</span>
                  <span className="font-semibold">Premium Available</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tech Stack Showcase */}
        <div className="mt-32 text-center">
          <h3 className="text-3xl font-black text-white mb-12">
            Popular Among Developers Using
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 max-w-6xl mx-auto">
            {[
              { name: 'React', color: 'text-cyan-400', bg: 'bg-cyan-400/20', border: 'border-cyan-400/50' },
              { name: 'Node.js', color: 'text-green-400', bg: 'bg-green-400/20', border: 'border-green-400/50' },
              { name: 'Python', color: 'text-yellow-400', bg: 'bg-yellow-400/20', border: 'border-yellow-400/50' },
              { name: 'TypeScript', color: 'text-blue-400', bg: 'bg-blue-400/20', border: 'border-blue-400/50' },
              { name: 'Vue.js', color: 'text-emerald-400', bg: 'bg-emerald-400/20', border: 'border-emerald-400/50' },
              { name: 'Angular', color: 'text-red-400', bg: 'bg-red-400/20', border: 'border-red-400/50' },
              { name: 'Flutter', color: 'text-cyan-500', bg: 'bg-cyan-500/20', border: 'border-cyan-500/50' },
              { name: 'Go', color: 'text-blue-500', bg: 'bg-blue-500/20', border: 'border-blue-500/50' },
              { name: 'Rust', color: 'text-orange-400', bg: 'bg-orange-400/20', border: 'border-orange-400/50' },
              { name: 'Swift', color: 'text-orange-500', bg: 'bg-orange-500/20', border: 'border-orange-500/50' },
            ].map((tech, index) => (
              <div 
                key={index}
                className={`group px-6 py-4 ${tech.bg} border ${tech.border} rounded-2xl ${tech.color} font-bold text-lg hover:scale-110 transition-all duration-300 cursor-pointer hover:shadow-lg backdrop-blur-sm`}
              >
                <div className="group-hover:animate-pulse">{tech.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection; 