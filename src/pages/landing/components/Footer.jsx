import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const footerRef = useRef(null);

  useEffect(() => {
    gsap.from(footerRef.current.children, {
      scrollTrigger: {
        trigger: footerRef.current,
        start: "top 90%",
      },
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: "power3.out"
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const socialLinks = [
    {
      name: 'GitHub',
      icon: '📂',
      url: '#',
      color: 'hover:text-gray-300'
    },
    {
      name: 'LinkedIn',
      icon: '💼',
      url: '#',
      color: 'hover:text-blue-400'
    },
    {
      name: 'Twitter',
      icon: '🐦',
      url: '#',
      color: 'hover:text-blue-400'
    },
    {
      name: 'Instagram',
      icon: '📷',
      url: '#',
      color: 'hover:text-pink-400'
    },
    {
      name: 'Discord',
      icon: '💬',
      url: '#',
      color: 'hover:text-purple-400'
    }
  ];

  const footerLinks = {
    Company: [
      { name: 'About Us', url: '#' },
      { name: 'Careers', url: '#' },
      { name: 'Press', url: '#' },
      { name: 'Blog', url: '#' },
      { name: 'Contact', url: '#' }
    ],
    Product: [
      { name: 'Features', url: '#features' },
      { name: 'Premium', url: '#pricing' },
      { name: 'Success Stories', url: '#testimonials' },
      { name: 'Download App', url: '#' },
      { name: 'API Docs', url: '#' }
    ],
    Support: [
      { name: 'Help Center', url: '#' },
      { name: 'Safety Tips', url: '#' },
      { name: 'Community', url: '#' },
      { name: 'Report Bug', url: '#' },
      { name: 'Feature Request', url: '#' }
    ],
    Legal: [
      { name: 'Privacy Policy', url: '#' },
      { name: 'Terms of Service', url: '#' },
      { name: 'Cookie Policy', url: '#' },
      { name: 'GDPR', url: '#' },
      { name: 'Refund Policy', url: '#' }
    ]
  };

  return (
    <footer className="bg-gradient-to-b from-slate-900 to-black border-t border-white/10">
      <div className="container mx-auto px-6 py-16">
        <div ref={footerRef} className="space-y-12">
          
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
            
            {/* Brand Section */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center">
                <span className="text-3xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  DevTinder
                </span>
                <div className="ml-2 w-2 h-2 bg-pink-500 rounded-full animate-pulse"></div>
              </div>
              
              <p className="text-gray-400 leading-relaxed max-w-md">
                The world's first dating platform designed exclusively for developers. 
                Where code meets love, and algorithms find your perfect match.
              </p>

              {/* Social Links */}
              <div className="space-y-4">
                <p className="text-white font-semibold">Follow Us</p>
                <div className="flex space-x-4">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      className={`w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center transition-all duration-300 hover:bg-white/10 hover:scale-110 ${social.color}`}
                      title={social.name}
                    >
                      <span className="text-lg">{social.icon}</span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Newsletter */}
              <div className="space-y-3">
                <p className="text-white font-semibold">Stay Updated</p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="flex-1 px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                  />
                  <button className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-300 hover:scale-105">
                    📧
                  </button>
                </div>
              </div>
            </div>

            {/* Footer Links */}
            {Object.entries(footerLinks).map(([category, links], categoryIndex) => (
              <div key={categoryIndex} className="space-y-4">
                <h3 className="text-white font-semibold">{category}</h3>
                <ul className="space-y-3">
                  {links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a 
                        href={link.url}
                        className="text-gray-400 hover:text-white transition-colors duration-300 text-sm"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* App Download Section */}
          <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm rounded-2xl border border-purple-500/30 p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Get the Mobile App
                </h3>
                <p className="text-gray-300">
                  Take DevTinder with you. Available on iOS and Android.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="flex items-center gap-3 px-6 py-3 bg-black rounded-xl hover:bg-gray-900 transition-colors duration-300">
                  <div className="text-2xl">📱</div>
                  <div>
                    <div className="text-xs text-gray-400">Download on the</div>
                    <div className="text-white font-semibold">App Store</div>
                  </div>
                </button>
                <button className="flex items-center gap-3 px-6 py-3 bg-black rounded-xl hover:bg-gray-900 transition-colors duration-300">
                  <div className="text-2xl">🤖</div>
                  <div>
                    <div className="text-xs text-gray-400">Get it on</div>
                    <div className="text-white font-semibold">Google Play</div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center items-center gap-8 py-8 border-y border-white/10">
            <div className="flex items-center gap-2 text-gray-400">
              <span className="text-green-400">🔒</span>
              <span className="text-sm">SSL Secured</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <span className="text-blue-400">🛡️</span>
              <span className="text-sm">Privacy Protected</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <span className="text-purple-400">✅</span>
              <span className="text-sm">Verified Profiles</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <span className="text-pink-400">💳</span>
              <span className="text-sm">Secure Payments</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <span className="text-yellow-400">⭐</span>
              <span className="text-sm">4.9/5 Rating</span>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8">
            <div className="text-gray-400 text-sm">
              © 2025 DevTinder. All rights reserved. Made with ❤️ for developers.
            </div>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span>All systems operational</span>
              </div>
              
              <div className="flex items-center gap-4 text-gray-400 text-sm">
                <a href="#" className="hover:text-white transition-colors">Status</a>
                <a href="#" className="hover:text-white transition-colors">Changelog</a>
                <a href="#" className="hover:text-white transition-colors">Security</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 