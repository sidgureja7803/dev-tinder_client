import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { gsap } from 'gsap';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Animate navigation on mount
    gsap.from('.nav-content', {
      y: -100,
      opacity: 0,
      duration: 1.2,
      ease: "power3.out",
      delay: 0.5
    });
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Smooth scroll function
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/10 backdrop-blur-md shadow-2xl border-b border-white/20' 
        : 'bg-white/5 backdrop-blur-sm'
    }`}>
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center nav-content">
          
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <div className="flex items-center">
              <svg width="40" height="40" viewBox="0 0 32 32" className="mr-3">
                <circle cx="16" cy="16" r="16" fill="#e91e63"/>
                <path d="M16 24l-6.5-6.5c-1.5-1.5-1.5-4 0-5.5s4-1.5 5.5 0l1 1 1-1c1.5-1.5 4-1.5 5.5 0s1.5 4 0 5.5L16 24z" fill="white"/>
                <path d="M8 10l-2 2 2 2M24 10l2 2-2 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-2xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                Merge Mates
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('features')}
              className="text-white hover:text-pink-300 font-medium transition-colors duration-300 relative group"
            >
              Features
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-pink-400 transition-all duration-300 group-hover:w-full"></span>
            </button>

            <button 
              onClick={() => scrollToSection('testimonials')}
              className="text-white hover:text-purple-300 font-medium transition-colors duration-300 relative group"
            >
              Stories
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-400 transition-all duration-300 group-hover:w-full"></span>
            </button>
            
            {/* Auth Buttons */}
            <div className="flex items-center space-x-4 ml-8">
              <Link 
                to="/login" 
                className="px-6 py-2 text-white hover:text-pink-300 font-medium transition-all duration-300 hover:scale-105"
              >
                Login
              </Link>
              <Link 
                to="/signup" 
                className="group relative px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-medium transition-all duration-300 hover:from-pink-600 hover:to-purple-700 hover:scale-105 hover:shadow-lg hover:shadow-pink-500/25"
              >
                <span className="relative z-10">Sign Up</span>
                <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-500 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-white hover:text-pink-300 transition-colors duration-300"
            onClick={toggleMobileMenu}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white/10 backdrop-blur-md border-b border-white/20">
            <div className="container mx-auto px-6 py-6">
              <div className="flex flex-col space-y-4">
                <button 
                  onClick={() => scrollToSection('features')}
                  className="text-white hover:text-pink-300 font-medium transition-colors duration-300 py-2 text-left"
                >
                  Features
                </button>

                <button 
                  onClick={() => scrollToSection('testimonials')}
                  className="text-white hover:text-purple-300 font-medium transition-colors duration-300 py-2 text-left"
                >
                  Stories
                </button>
                
                <div className="border-t border-white/20 pt-4 mt-4">
                  <div className="flex flex-col space-y-3">
                    <Link 
                      to="/login" 
                      className="text-white hover:text-pink-300 font-medium transition-colors duration-300 py-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link 
                      to="/signup" 
                      className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-medium text-center transition-all duration-300 hover:from-pink-600 hover:to-purple-700"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation; 