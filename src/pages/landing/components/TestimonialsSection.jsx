import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TestimonialsSection = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const testimonialsRef = useRef(null);
  const statsRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo(titleRef.current, 
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 80%",
          }
        }
      );

      // Testimonials animation
      gsap.fromTo(testimonialsRef.current.children, 
        { y: 60, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: testimonialsRef.current,
            start: "top 85%",
          }
        }
      );

      // Stats animation
      gsap.fromTo(statsRef.current.children, 
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: statsRef.current,
            start: "top 85%",
          }
        }
      );

      // Floating hearts animation
      gsap.to(".floating-heart", {
        y: -20,
        duration: 3,
        repeat: -1,
        yoyo: true,
        stagger: 0.5,
        ease: "power2.inOut"
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Full Stack Developer",
      company: "Netflix",
      image: "👩‍💻",
      content: "I met my coding soulmate on MergeMates! We bonded over our shared love for React and now we're building an amazing life together. Our first date was debugging code at a coffee shop! 😄",
      techStack: ["React", "Node.js", "MongoDB"],
      rating: 5,
      gradient: "from-pink-500 to-purple-500"
    },
    {
      name: "Alex Rodriguez",
      role: "DevOps Engineer",
      company: "Spotify",
      image: "👨‍💻",
      content: "MergeMates helped me find someone who understands my passion for automation and clean architecture. We've been together for 2 years and just launched our first startup together!",
      techStack: ["Docker", "Kubernetes", "AWS"],
      rating: 5,
      gradient: "from-cyan-500 to-blue-500"
    },
    {
      name: "Emily Johnson",
      role: "Frontend Developer",
      company: "Stripe",
      image: "👩‍🎨",
      content: "After years of failed dates where I had to explain what I do, MergeMates was a breath of fresh air. My partner and I code together, travel together, and dream together. Perfect match!",
      techStack: ["Vue.js", "TypeScript", "Figma"],
      rating: 5,
      gradient: "from-green-500 to-teal-500"
    },
    {
      name: "Marcus Thompson",
      role: "Data Scientist",
      company: "Airbnb",
      image: "👨‍🔬",
      content: "Finding someone who appreciates both late-night coding sessions and data visualizations seemed impossible. MergeMates made it happen! We're getting married next month! 💍",
      techStack: ["Python", "TensorFlow", "Jupyter"],
      rating: 5,
      gradient: "from-yellow-500 to-orange-500"
    },
    {
      name: "Priya Patel",
      role: "Mobile Developer",
      company: "Uber",
      image: "👩‍💼",
      content: "MergeMates' matching algorithm is genius! It paired me with someone who shares my mobile development passion. We've shipped 3 apps together and countless memories! 🚀",
      techStack: ["React Native", "Swift", "Kotlin"],
      rating: 5,
      gradient: "from-purple-500 to-pink-500"
    },
    {
      name: "James Wilson",
      role: "Backend Engineer",
      company: "GitHub",
      image: "👨‍💻",
      content: "I was skeptical about dating apps, but MergeMates gets developers. Met my girlfriend here 18 months ago - she's a frontend dev and we're the perfect full-stack couple! 😍",
      techStack: ["Go", "PostgreSQL", "Redis"],
      rating: 5,
      gradient: "from-indigo-500 to-purple-500"
    }
  ];

  return (
    <section ref={sectionRef} className="py-24 bg-gradient-to-b from-purple-900 via-slate-900 to-black relative overflow-hidden">
      
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Hearts */}
        <div className="floating-heart absolute top-20 left-10 text-4xl opacity-20">💕</div>
        <div className="floating-heart absolute top-40 right-20 text-3xl opacity-15">💖</div>
        <div className="floating-heart absolute bottom-40 left-1/4 text-5xl opacity-10">💗</div>
        <div className="floating-heart absolute bottom-20 right-1/3 text-3xl opacity-20">💝</div>
        
        {/* Gradient Orbs */}
        <div className="absolute top-32 -right-20 w-64 h-64 bg-gradient-to-r from-pink-500/20 to-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-32 -left-20 w-80 h-80 bg-gradient-to-r from-cyan-500/15 to-blue-600/15 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div ref={titleRef} className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500/20 to-purple-500/20 backdrop-blur-sm rounded-full px-6 py-3 mb-6">
            <span className="text-2xl animate-pulse">💕</span>
            <span className="text-pink-300 font-semibold text-sm uppercase tracking-wider">Success Stories</span>
          </div>
          
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-8">
            <span className="block">Love Stories</span>
            <span className="block bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Compiled with Care
            </span>
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Real developers, real connections, real love. See how MergeMates has helped 
            <span className="block mt-2 text-pink-400 font-semibold">
              thousands of developers find their perfect match! 💕
            </span>
          </p>
        </div>

        {/* Success Stats */}
        <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mb-20">
          <div className="text-center group hover:scale-105 transition-transform duration-300">
            <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent mb-2">
              2.5K+
            </div>
            <div className="text-gray-400 text-sm font-medium">Happy Couples</div>
            <div className="text-xs text-gray-500 mt-1">💕 Together & Coding</div>
          </div>
          
          <div className="text-center group hover:scale-105 transition-transform duration-300">
            <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-purple-400 to-cyan-500 bg-clip-text text-transparent mb-2">
              156
            </div>
            <div className="text-gray-400 text-sm font-medium">Tech Weddings</div>
            <div className="text-xs text-gray-500 mt-1">💍 Married Devs</div>
          </div>
          
          <div className="text-center group hover:scale-105 transition-transform duration-300">
            <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-cyan-400 to-green-500 bg-clip-text text-transparent mb-2">
              42
            </div>
            <div className="text-gray-400 text-sm font-medium">Dev Babies</div>
            <div className="text-xs text-gray-500 mt-1">👶 Next Gen Coders</div>
          </div>
          
          <div className="text-center group hover:scale-105 transition-transform duration-300">
            <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-green-400 to-yellow-500 bg-clip-text text-transparent mb-2">
              98%
            </div>
            <div className="text-gray-400 text-sm font-medium">Success Rate</div>
            <div className="text-xs text-gray-500 mt-1">⭐ Highly Effective</div>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div ref={testimonialsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className={`group relative p-8 rounded-3xl backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-500 hover:scale-105 hover:shadow-2xl bg-gradient-to-br ${testimonial.gradient.replace('from-', 'from-').replace('to-', 'to-')}/5 hover:bg-opacity-20`}
            >
              {/* Background Glow */}
              <div className={`absolute inset-0 bg-gradient-to-r ${testimonial.gradient} opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity duration-500`}></div>
              
              {/* Content */}
              <div className="relative z-10">
                {/* Header */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="text-4xl">{testimonial.image}</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-1">{testimonial.name}</h3>
                    <p className="text-purple-300 text-sm font-medium mb-1">{testimonial.role}</p>
                    <p className="text-gray-400 text-xs">{testimonial.company}</p>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-sm">⭐</span>
                    ))}
                  </div>
                </div>

                {/* Testimonial Content */}
                <blockquote className="text-gray-300 leading-relaxed mb-6 group-hover:text-gray-200 transition-colors duration-300">
                  "{testimonial.content}"
                </blockquote>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2">
                  {testimonial.techStack.map((tech, techIndex) => (
                    <span 
                      key={techIndex}
                      className="px-3 py-1 bg-white/10 rounded-full text-xs text-purple-300 font-medium border border-white/20"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Quote Icon */}
              <div className="absolute top-6 right-6 text-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-300">
                💬
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-20">
          <div className="max-w-3xl mx-auto mb-8">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Write Your Own Love Story?
            </h3>
            <p className="text-lg text-gray-300">
              Join thousands of developers who found their perfect match. Your soulmate is just a swipe away!
            </p>
          </div>
          
          <div className="inline-flex flex-col sm:flex-row gap-6 items-center">
            <a 
              href="/signup"
              className="group px-10 py-5 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-2xl text-xl transition-all duration-300 hover:from-pink-600 hover:to-purple-700 hover:scale-110 hover:shadow-2xl hover:shadow-pink-500/50"
            >
              <span className="flex items-center gap-3">
                <span>Find Your Developer Soulmate</span>
                <span className="text-2xl group-hover:animate-bounce">💕</span>
              </span>
            </a>
            
            <div className="text-center">
              <div className="text-sm text-gray-400 mb-1">Join 50,000+ developers already in love</div>
              <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <span className="text-green-400">✓</span>
                  2.5K+ Success Stories
                </span>
                <span className="flex items-center gap-1">
                  <span className="text-green-400">✓</span>
                  98% Match Success
                </span>
                <span className="flex items-center gap-1">
                  <span className="text-green-400">✓</span>
                  100% Free to Start
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection; 