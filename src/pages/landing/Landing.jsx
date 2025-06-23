import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Import landing page components
import Navigation from './components/Navigation';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import TestimonialsSection from './components/TestimonialsSection';
import Footer from './components/Footer';

gsap.registerPlugin(ScrollTrigger);

const Landing = () => {
  useEffect(() => {
    // Smooth scrolling for anchor links
    const handleAnchorClick = (e) => {
      const href = e.target.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          gsap.to(window, {
            scrollTo: {
              y: targetElement,
              offsetY: 80
            },
            duration: 1.5,
            ease: "power3.out"
          });
        }
      }
    };

    // Add event listeners to all anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
      link.addEventListener('click', handleAnchorClick);
    });

    // Set up page load animations
    gsap.set('body', { overflow: 'hidden' });
    
    const loadingTimeline = gsap.timeline({
      onComplete: () => {
        gsap.set('body', { overflow: 'auto' });
      }
    });

    loadingTimeline
      .to('.loading-screen', {
        opacity: 0,
        duration: 0.5,
        ease: "power2.out"
      })
      .set('.loading-screen', { display: 'none' });

    // Cleanup
    return () => {
      anchorLinks.forEach(link => {
        link.removeEventListener('click', handleAnchorClick);
      });
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div className="min-h-screen relative">
      {/* Auth-style Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900 via-slate-900 to-black"></div>
        
        {/* Animated Shapes - Same as Auth pages */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute w-96 h-96 -top-48 -right-48 bg-gradient-radial from-pink-500/30 via-purple-500/20 to-transparent rounded-full animate-pulse"></div>
          <div className="absolute w-80 h-80 -bottom-40 -left-40 bg-gradient-radial from-blue-500/30 via-cyan-500/20 to-transparent rounded-full animate-pulse" style={{animationDelay: '3s'}}></div>
          <div className="absolute w-72 h-72 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-radial from-indigo-500/25 via-purple-500/15 to-transparent rounded-full animate-pulse" style={{animationDelay: '1.5s'}}></div>
        </div>

        {/* Code Pattern Overlay */}
        <div className="absolute inset-0 opacity-10 bg-repeat"
             style={{
               backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
               backgroundSize: '60px 60px'
             }}>
        </div>
      </div>
      
      {/* Loading Screen with Auth-style design */}
      <div className="loading-screen fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-slate-900 to-black"></div>
        <div className="relative z-10 text-center">
          <div className="flex items-center justify-center mb-8">
            <svg width="60" height="60" viewBox="0 0 32 32" className="mr-4">
              <circle cx="16" cy="16" r="16" fill="#e91e63"/>
              <path d="M16 24l-6.5-6.5c-1.5-1.5-1.5-4 0-5.5s4-1.5 5.5 0l1 1 1-1c1.5-1.5 4-1.5 5.5 0s1.5 4 0 5.5L16 24z" fill="white"/>
              <path d="M8 10l-2 2 2 2M24 10l2 2-2 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-5xl font-bold text-white">Merge Mates</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>

      {/* Content with relative positioning */}
      <div className="relative z-10">
        {/* Navigation */}
        <Navigation />

        {/* Hero Section */}
        <HeroSection />

        {/* Features Section */}
        <section id="features">
          <FeaturesSection />
        </section>

        {/* Testimonials Section */}
        <section id="testimonials">
          <TestimonialsSection />
        </section>

        {/* Final Call to Action with glassmorphism */}
        <section className="py-24 relative">
          <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>
          <div className="container mx-auto px-6 text-center relative z-10">
            <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-md rounded-3xl p-12 border border-white/20">
              <h2 className="text-5xl md:text-6xl font-bold text-white mb-8">
                Your Perfect Match is 
                <span className="block bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                  One Swipe Away
                </span>
              </h2>
              
              <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
                Join over 50,000 developers who have already found meaningful connections. 
                Start your journey to love today.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
                <a 
                  href="/signup"
                  className="group relative px-12 py-5 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-2xl text-xl transition-all duration-300 hover:from-pink-600 hover:to-purple-700 hover:scale-110 hover:shadow-2xl hover:shadow-pink-500/25"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    <span>Start For Free</span>
                    <span className="text-2xl">🚀</span>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-500 rounded-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                </a>
                
                <div className="text-center">
                  <div className="text-sm text-gray-400 mb-2">No credit card required</div>
                  <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <span className="text-green-400">✓</span>
                      Free forever plan
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="text-green-400">✓</span>
                      Instant activation
                    </span>
                  </div>
                </div>
              </div>

              {/* Final Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
                <div className="text-center">
                  <div className="text-3xl font-bold text-pink-400 mb-2">50K+</div>
                  <div className="text-gray-400 text-sm">Active Developers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-2">2.5K+</div>
                  <div className="text-gray-400 text-sm">Success Stories</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-2">156</div>
                  <div className="text-gray-400 text-sm">Tech Weddings</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-cyan-400 mb-2">4.9★</div>
                  <div className="text-gray-400 text-sm">User Rating</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <Footer />
      </div>

      {/* Back to Top Button with glassmorphism */}
      <button
        onClick={() => {
          gsap.to(window, {
            scrollTo: { y: 0 },
            duration: 1.5,
            ease: "power3.out"
          });
        }}
        className="fixed bottom-8 right-8 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 hover:scale-110 opacity-0 invisible border border-white/20"
        id="backToTop"
        title="Back to Top"
      >
        <span className="text-lg">↑</span>
      </button>

      <style jsx>{`
        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-stops));
        }
        
        @media (max-width: 768px) {
          .loading-screen span {
            font-size: 3rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Landing; 