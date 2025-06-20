import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Import landing page components
import Navigation from './components/Navigation';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import PremiumSection from './components/PremiumSection';
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
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-slate-900 to-black">
      
      {/* Loading Screen */}
      <div className="loading-screen fixed inset-0 bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 z-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-8">
                          <span className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
                MergeMates
              </span>
            <div className="absolute -top-2 -right-2 w-3 h-3 bg-cyan-500 rounded-full animate-pulse"></div>
          </div>
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <section id="features">
        <FeaturesSection />
      </section>

      {/* Premium/Pricing Section */}
      <section id="pricing">
        <PremiumSection />
      </section>

      {/* Testimonials Section */}
      <section id="testimonials">
        <TestimonialsSection />
      </section>

      {/* Final Call to Action */}
      <section className="py-24 bg-gradient-to-r from-blue-600/20 via-indigo-600/20 to-cyan-600/20">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-8">
              Your Perfect Match is 
              <span className="block bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
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
                className="group relative px-12 py-5 bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-bold rounded-2xl text-xl transition-all duration-300 hover:from-blue-600 hover:to-cyan-700 hover:scale-110 hover:shadow-2xl hover:shadow-blue-500/25"
              >
                <span className="relative z-10 flex items-center gap-3">
                  <span>Start For Free</span>
                  <span className="text-2xl">🚀</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
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
                <div className="text-3xl font-bold text-blue-400 mb-2">50K+</div>
                <div className="text-gray-400 text-sm">Active Developers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-400 mb-2">2.5K+</div>
                <div className="text-gray-400 text-sm">Success Stories</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-teal-400 mb-2">156</div>
                <div className="text-gray-400 text-sm">Tech Weddings</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-400 mb-2">4.9★</div>
                <div className="text-gray-400 text-sm">User Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />



      {/* Back to Top Button */}
      <button
        onClick={() => {
          gsap.to(window, {
            scrollTo: { y: 0 },
            duration: 1.5,
            ease: "power3.out"
          });
        }}
        className="fixed bottom-8 left-8 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 hover:scale-110 opacity-0 invisible"
        id="backToTop"
        title="Back to Top"
      >
        <span className="text-lg">↑</span>
      </button>

      <style jsx>{`
        @media (max-width: 768px) {
          .loading-screen span {
            font-size: 3rem;
          }
        }
        
        /* Show back to top button on scroll */
        @media (min-width: 768px) {
          #backToTop {
            opacity: 1;
            visibility: visible;
          }
        }
      `}</style>
    </div>
  );
};

export default Landing; 