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

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-slate-900/95 backdrop-blur-md shadow-2xl border-b border-white/10' 
        : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center nav-content">
          
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <div className="relative">
              <span className="text-3xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                DevTinder
              </span>
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-pink-500 rounded-full animate-pulse"></div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a 
              href="#features" 
              className="text-white hover:text-pink-300 font-medium transition-colors duration-300 relative group"
            >
              Features
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-pink-400 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a 
              href="#pricing" 
              className="text-white hover:text-purple-300 font-medium transition-colors duration-300 relative group"
            >
              Pricing
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-400 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a 
              href="#testimonials" 
              className="text-white hover:text-cyan-300 font-medium transition-colors duration-300 relative group"
            >
              Stories
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-400 transition-all duration-300 group-hover:w-full"></span>
            </a>
            
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
                className="group relative px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-medium transition-all duration-300 hover:from-pink-600 hover:to-purple-700 hover:scale-105 hover:shadow-lg hover:shadow-pink-500/25"
              >
                <span className="relative z-10">Sign Up</span>
                <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-500 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
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
          <div className="md:hidden absolute top-full left-0 w-full bg-slate-900/95 backdrop-blur-md border-b border-white/10">
            <div className="container mx-auto px-6 py-6">
              <div className="flex flex-col space-y-4">
                <a 
                  href="#features" 
                  className="text-white hover:text-pink-300 font-medium transition-colors duration-300 py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Features
                </a>
                <a 
                  href="#pricing" 
                  className="text-white hover:text-purple-300 font-medium transition-colors duration-300 py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Pricing
                </a>
                <a 
                  href="#testimonials" 
                  className="text-white hover:text-cyan-300 font-medium transition-colors duration-300 py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Stories
                </a>
                
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
                      className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-medium text-center transition-all duration-300 hover:from-pink-600 hover:to-purple-700"
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