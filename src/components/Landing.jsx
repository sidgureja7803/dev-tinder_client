import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Landing = () => {
  const heroRef = useRef(null);
  const featuresRef = useRef(null);

  useEffect(() => {
  const tl = gsap.timeline({
    defaults: { ease: "power3.out" }
  });

  // Animate navigation
  tl.from('.nav-content', {
    y: -50,
    opacity: 0,
    duration: 1.2,
  })
  // Hero title
  .from('.hero-title span', {
    y: 120,
    opacity: 0,
    duration: 1,
    stagger: 0.25,
  }, "-=0.8")
  // Hero description
  .from('.hero-description', {
    y: 40,
    opacity: 0,
    duration: 0.8,
  }, "-=0.6")
  // Hero buttons
  .from('.hero-buttons button', {
    scale: 0.5,
    opacity: 0,
    duration: 0.6,
    stagger: 0.2,
    ease: "back.out(1.7)"
  }, "-=0.5");

  // Parallax background floating effect (decorative circles)
  gsap.to(".absolute div", {
    y: 30,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
    duration: 5
  });

  // Features card animation with rotation
  gsap.from('.feature-card', {
    scrollTrigger: {
      trigger: '.features-section',
      start: 'top center+=100',
      toggleActions: 'play none none reverse'
    },
    y: 100,
    opacity: 0,
    rotateX: 15,
    rotateY: 5,
    duration: 1,
    stagger: 0.3,
    ease: "power3.out"
  });

  // Footer links animation
  gsap.from('footer a', {
    scrollTrigger: {
      trigger: 'footer',
      start: 'top bottom',
    },
    y: 20,
    opacity: 0,
    duration: 0.6,
    stagger: 0.2,
    ease: "power2.out"
  });

  // Clean up
  return () => {
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  };
}, []);
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-pink-800 overflow-hidden">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-white/10 backdrop-blur-md">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center nav-content">
            <div className="flex items-center">
              <span className="text-3xl font-bold text-white">DevTinder</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                to="/login" 
                className="px-6 py-2 text-white hover:text-purple-200 font-medium transition-colors"
              >
                Login
              </Link>
              <Link 
                to="/signup" 
                className="px-6 py-2 bg-white text-purple-900 rounded-lg font-medium hover:bg-purple-50 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="hero-section relative min-h-screen flex items-center pt-20">
        <div className="container mx-auto px-6">
          <div className="hero-content max-w-4xl mx-auto text-center">
            <h1 className="hero-title text-5xl md:text-7xl font-bold text-white mb-8 leading-tight overflow-hidden">
              <span className="block">Find Your Perfect</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                Code Partner
              </span>
            </h1>
            <p className="hero-description text-xl text-purple-100 mb-12 max-w-2xl mx-auto leading-relaxed">
              Connect with developers who share your passion for coding. Build amazing projects together and grow your skills.
            </p>
            <div className="hero-buttons flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                to="/signup" 
                className="w-full sm:w-auto px-8 py-4 bg-white text-purple-900 rounded-lg font-medium hover:bg-purple-50 transition-all transform hover:scale-105"
              >
                Get Started
              </Link>
              <a 
                href="#features" 
                className="w-full sm:w-auto px-8 py-4 bg-purple-800/30 text-white rounded-lg font-medium border border-purple-700 hover:bg-purple-800/50 transition-all transform hover:scale-105"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-purple-500 rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute -bottom-1/4 -left-1/4 w-96 h-96 bg-pink-500 rounded-full opacity-10 blur-3xl"></div>
        </div>
      </div>

      {/* Features */}
      <div id="features" className="features-section py-32">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="feature-card backdrop-blur-lg bg-white/10 p-8 rounded-2xl border border-purple-700/30 hover:border-purple-700/50 transition-all transform hover:scale-105">
              <div className="text-4xl mb-6">👩‍💻</div>
              <h3 className="text-xl font-bold text-white mb-4">Match by Skills</h3>
              <p className="text-purple-200">Find developers who match your tech stack and coding interests. Connect with like-minded programmers.</p>
            </div>

            <div className="feature-card backdrop-blur-lg bg-white/10 p-8 rounded-2xl border border-purple-700/30 hover:border-purple-700/50 transition-all transform hover:scale-105">
              <div className="text-4xl mb-6">🤝</div>
              <h3 className="text-xl font-bold text-white mb-4">Collaborate</h3>
              <p className="text-purple-200">Work together on exciting projects, share knowledge, and learn from experienced developers.</p>
            </div>

            <div className="feature-card backdrop-blur-lg bg-white/10 p-8 rounded-2xl border border-purple-700/30 hover:border-purple-700/50 transition-all transform hover:scale-105">
              <div className="text-4xl mb-6">🚀</div>
              <h3 className="text-xl font-bold text-white mb-4">Grow Together</h3>
              <p className="text-purple-200">Build meaningful connections in the developer community and accelerate your career growth.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-purple-700/30">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-purple-200 mb-4 md:mb-0">© 2025 DevTinder. All rights reserved.</p>
            <div className="flex space-x-6">
              <a href="#" className="text-purple-200 hover:text-white transition-colors">Terms</a>
              <a href="#" className="text-purple-200 hover:text-white transition-colors">Privacy</a>
              <a href="#" className="text-purple-200 hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing; 
