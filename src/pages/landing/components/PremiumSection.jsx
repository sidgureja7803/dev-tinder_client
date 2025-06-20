import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const PremiumSection = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const cardsRef = useRef(null);
  const floatingRef = useRef(null);
  const statsRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Epic title animation
      gsap.fromTo(titleRef.current.children, 
        { y: 100, opacity: 0, scale: 0.8, rotationX: 45 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          rotationX: 0,
          duration: 1.5,
          stagger: 0.2,
          ease: "power4.out",
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 80%",
          }
        }
      );

      // Epic cards entrance with 3D effect
      gsap.fromTo(cardsRef.current.children, 
        { 
          y: 150, 
          opacity: 0, 
          scale: 0.7, 
          rotationY: 25,
          z: -200
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          rotationY: 0,
          z: 0,
          duration: 1.2,
          stagger: 0.2,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: cardsRef.current,
            start: "top 85%",
          }
        }
      );

      // Stats animation
      gsap.fromTo(statsRef.current.children, 
        { y: 60, opacity: 0, scale: 0.3 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "elastic.out(1, 0.8)",
          scrollTrigger: {
            trigger: statsRef.current,
            start: "top 85%",
          }
        }
      );

      // Floating money elements
      gsap.to(floatingRef.current.children, {
        y: -25,
        rotation: 15,
        duration: 4,
        repeat: -1,
        yoyo: true,
        stagger: 0.5,
        ease: "power2.inOut"
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const plans = [
    {
      name: "Free",
      price: "₹0",
      period: "Forever",
      originalPrice: null,
      description: "Perfect for exploring DevTinder",
      gradient: "from-gray-600 via-slate-600 to-gray-700",
      bgGradient: "from-gray-800/50 via-slate-800/50 to-gray-900/50",
      borderGradient: "from-gray-500/50 to-slate-500/50",
      popular: false,
      savings: null,
      features: [
        "20 swipes per day",
        "Basic matching algorithm", 
        "Profile creation & photos",
        "Real-time chat",
        "Location-based matching",
        "Basic filters"
      ],
      limitations: [
        "Limited swipes",
        "No premium features",
        "Can't see who likes you"
      ],
      cta: "Get Started Free",
      icon: "🆓"
    },
    {
      name: "Gold",
      price: "₹499",
      period: "3 months",
      originalPrice: "₹999",
      description: "Supercharge your dating game",
      gradient: "from-yellow-400 via-orange-500 to-red-500",
      bgGradient: "from-yellow-500/20 via-orange-500/20 to-red-500/20",
      borderGradient: "from-yellow-400/60 to-orange-500/60",
      popular: true,
      savings: "50%",
      features: [
        "Unlimited swipes",
        "See who likes you",
        "Undo last swipe",
        "Profile boost (2x/week)",
        "Advanced matching algorithm",
        "Priority support",
        "No ads experience",
        "Super likes (3/day)"
      ],
      cta: "Upgrade to Gold",
      icon: "👑"
    },
    {
      name: "Platinum",
      price: "₹799",
      period: "6 months", 
      originalPrice: "₹1599",
      description: "Ultimate dating experience",
      gradient: "from-purple-500 via-pink-500 to-cyan-500",
      bgGradient: "from-purple-500/20 via-pink-500/20 to-cyan-500/20",
      borderGradient: "from-purple-400/60 to-pink-500/60",
      popular: false,
      savings: "50%",
      features: [
        "Everything in Gold",
        "AI-powered suggestions",
        "Profile boost (4x/week)", 
        "Super likes (5/day)",
        "Priority in all feeds",
        "Exclusive events access",
        "Advanced analytics dashboard",
        "Platinum badge & status"
      ],
      cta: "Go Platinum",
      icon: "💎"
    }
  ];

  return (
    <section ref={sectionRef} className="relative py-32 bg-gradient-to-b from-purple-900 via-black to-indigo-900 overflow-hidden">
      
      {/* Epic Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Money Elements */}
        <div ref={floatingRef} className="absolute inset-0">
          <div className="absolute top-20 left-10 text-6xl opacity-10">💰</div>
          <div className="absolute top-40 right-20 text-5xl opacity-15">💎</div>
          <div className="absolute bottom-40 left-20 text-7xl opacity-10">👑</div>
          <div className="absolute bottom-20 right-10 text-4xl opacity-20">🚀</div>
          <div className="absolute top-1/2 left-1/4 text-3xl opacity-15">⭐</div>
          <div className="absolute top-1/3 right-1/3 text-5xl opacity-10">💸</div>
        </div>

        {/* Massive Gradient Orbs */}
        <div className="absolute -top-60 -left-60 w-[700px] h-[700px] bg-gradient-to-r from-yellow-500/20 to-orange-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-60 -right-60 w-[800px] h-[800px] bg-gradient-to-r from-purple-500/15 to-pink-600/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-cyan-500/20 to-blue-600/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDEwMCAwIEwgMCAwIDAgMTAwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wNSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Epic Section Header */}
        <div ref={titleRef} className="text-center mb-24">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-lg rounded-full px-8 py-4 mb-8 border border-yellow-400/30">
            <span className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></span>
            <span className="text-yellow-300 font-black text-sm uppercase tracking-widest">🔥 Limited Time Offer</span>
            <span className="w-3 h-3 bg-orange-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></span>
          </div>
          
          <h2 className="text-6xl md:text-8xl lg:text-9xl font-black text-white mb-8 leading-tight">
            <span className="block bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
              Find Love
            </span>
            <span className="block bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent -mt-4">
              10x Faster
            </span>
          </h2>
          
          <p className="text-2xl md:text-3xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-6">
            Upgrade to premium and unlock the full power of AI-driven matching.
          </p>
          <p className="text-xl text-yellow-400 font-bold max-w-3xl mx-auto">
            Join thousands of premium developers finding love at lightning speed! ⚡
          </p>
        </div>

        {/* Success Stats */}
        <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto mb-20">
          <div className="text-center group hover:scale-110 transition-all duration-300">
            <div className="text-5xl md:text-6xl font-black bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-2">
              10x
            </div>
            <div className="text-gray-400 text-sm font-semibold">More Matches</div>
            <div className="text-xs text-yellow-400 mt-1">⚡ Premium Speed</div>
          </div>
          
          <div className="text-center group hover:scale-110 transition-all duration-300">
            <div className="text-5xl md:text-6xl font-black bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-2">
              98%
            </div>
            <div className="text-gray-400 text-sm font-semibold">Success Rate</div>
            <div className="text-xs text-purple-400 mt-1">💕 Premium Users</div>
          </div>
          
          <div className="text-center group hover:scale-110 transition-all duration-300">
            <div className="text-5xl md:text-6xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
              50%
            </div>
            <div className="text-gray-400 text-sm font-semibold">Limited Savings</div>
            <div className="text-xs text-cyan-400 mt-1">💰 Special Offer</div>
          </div>
          
          <div className="text-center group hover:scale-110 transition-all duration-300">
            <div className="text-5xl md:text-6xl font-black bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent mb-2">
              24h
            </div>
            <div className="text-gray-400 text-sm font-semibold">Average Match</div>
            <div className="text-xs text-green-400 mt-1">🚀 Lightning Fast</div>
          </div>
        </div>

        {/* Epic Pricing Cards */}
        <div ref={cardsRef} className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-20">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`group relative overflow-hidden rounded-3xl backdrop-blur-lg border-2 transition-all duration-700 hover:scale-105 ${
                plan.popular 
                  ? `border-yellow-400/60 bg-gradient-to-br ${plan.bgGradient} shadow-2xl shadow-yellow-500/30 hover:shadow-yellow-500/50 transform hover:-translate-y-4` 
                  : `border-white/20 bg-gradient-to-br ${plan.bgGradient} hover:border-white/40 hover:shadow-xl`
              }`}
              style={{
                transform: plan.popular ? 'scale(1.05)' : 'scale(1)',
                zIndex: plan.popular ? 10 : 1
              }}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-20">
                  <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-black px-8 py-3 rounded-full text-sm font-black flex items-center gap-2 shadow-2xl animate-pulse">
                    <span className="text-xl animate-bounce">🔥</span>
                    <span>MOST POPULAR</span>
                    <span className="text-xl animate-bounce">🔥</span>
                  </div>
                </div>
              )}

              {/* Savings Badge */}
              {plan.savings && (
                <div className="absolute -top-3 -right-3 z-20">
                  <div className="bg-gradient-to-r from-green-400 to-emerald-500 text-black px-4 py-2 rounded-full text-xs font-black flex items-center gap-1 shadow-lg">
                    <span>💰</span>
                    <span>SAVE {plan.savings}</span>
                  </div>
                </div>
              )}

              {/* Main Content */}
              <div className="relative z-10 p-8">
                {/* Plan Header */}
                <div className="text-center mb-8">
                  {/* Plan Icon */}
                  <div className="text-6xl mb-4 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500">
                    {plan.icon}
                  </div>
                  
                  {/* Plan Name */}
                  <h3 className={`text-3xl font-black mb-4 ${
                    plan.popular ? 'text-yellow-300' : 'text-white'
                  }`}>
                    {plan.name}
                  </h3>
                  
                  {/* Pricing */}
                  <div className="mb-6">
                    <div className="flex items-center justify-center gap-3 mb-2">
                      <span className={`text-5xl md:text-6xl font-black ${
                        plan.popular ? 'text-yellow-300' : 'text-white'
                      }`}>
                        {plan.price}
                      </span>
                      <div className="text-left">
                        {plan.originalPrice && (
                          <div className="text-lg text-gray-400 line-through font-semibold">
                            {plan.originalPrice}
                          </div>
                        )}
                        <div className="text-sm text-gray-400 font-medium">
                          {plan.period}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Description */}
                  <p className="text-gray-300 text-lg font-medium">
                    {plan.description}
                  </p>
                </div>

                {/* Features List */}
                <div className="mb-8">
                  <ul className="space-y-4">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-black ${
                          plan.name === 'Free' 
                            ? 'bg-gray-600 text-white' 
                            : `bg-gradient-to-r ${plan.gradient} text-black shadow-lg`
                        }`}>
                          ✓
                        </div>
                        <span className={`font-medium ${
                          plan.popular ? 'text-gray-200' : 'text-gray-300'
                        }`}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Limitations for Free plan */}
                  {plan.limitations && (
                    <div className="mt-8 pt-6 border-t border-gray-700">
                      <p className="text-gray-400 text-sm mb-4 font-semibold">Limitations:</p>
                      <ul className="space-y-3">
                        {plan.limitations.map((limitation, limitIndex) => (
                          <li key={limitIndex} className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center text-sm text-red-400 font-black">
                              ✗
                            </div>
                            <span className="text-gray-400 text-sm">
                              {limitation}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* CTA Button */}
                <a 
                  href="/signup"
                  className={`block w-full py-5 text-center font-black rounded-2xl text-lg transition-all duration-500 hover:scale-105 hover:shadow-2xl ${
                    plan.name === 'Free'
                      ? 'bg-gray-600 hover:bg-gray-500 text-white'
                      : `bg-gradient-to-r ${plan.gradient} text-black hover:shadow-lg shadow-lg`
                  }`}
                >
                  <span className="flex items-center justify-center gap-2">
                    <span>{plan.cta}</span>
                    <span className="text-xl">🚀</span>
                  </span>
                </a>

                {/* Savings indicator */}
                {plan.originalPrice && (
                  <div className="text-center mt-6">
                    <span className="inline-flex items-center gap-2 text-green-400 text-lg font-bold bg-green-400/20 px-4 py-2 rounded-full border border-green-400/30">
                      <span className="animate-pulse">💰</span>
                      <span>Save ₹{parseInt(plan.originalPrice.replace('₹', '')) - parseInt(plan.price.replace('₹', ''))}</span>
                    </span>
                  </div>
                )}
              </div>

              {/* Background Glow Effect */}
              <div className={`absolute inset-0 bg-gradient-to-r ${plan.gradient} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-700`}></div>
            </div>
          ))}
        </div>

        {/* Epic Bottom Section */}
        <div className="text-center mb-20">
          <div className="max-w-4xl mx-auto mb-12">
            <h3 className="text-4xl md:text-5xl font-black text-white mb-6">
              Why Premium Developers
              <span className="block bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Choose DevTinder Pro
              </span>
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
            <div className="group text-center hover:scale-105 transition-all duration-300">
              <div className="text-6xl mb-6 group-hover:animate-bounce">🛡️</div>
              <h4 className="text-2xl font-bold text-white mb-4">30-Day Guarantee</h4>
              <p className="text-gray-400 text-lg leading-relaxed">Not satisfied? Get a full refund within 30 days. No questions asked, no hassle.</p>
            </div>
            
            <div className="group text-center hover:scale-105 transition-all duration-300">
              <div className="text-6xl mb-6 group-hover:animate-bounce">⚡</div>
              <h4 className="text-2xl font-bold text-white mb-4">Instant Activation</h4>
              <p className="text-gray-400 text-lg leading-relaxed">Premium features activate immediately after payment. Start matching like a pro instantly.</p>
            </div>
            
            <div className="group text-center hover:scale-105 transition-all duration-300">
              <div className="text-6xl mb-6 group-hover:animate-bounce">💳</div>
              <h4 className="text-2xl font-bold text-white mb-4">Secure Payment</h4>
              <p className="text-gray-400 text-lg leading-relaxed">Your payment is processed securely via Razorpay with bank-level encryption.</p>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center">
          <div className="inline-flex flex-col sm:flex-row gap-8 items-center">
            <a 
              href="/signup"
              className="group relative px-16 py-6 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-black font-black rounded-2xl text-2xl transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:shadow-yellow-500/50 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-3">
                <span>Start Premium Journey</span>
                <span className="text-3xl group-hover:animate-bounce">👑</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-yellow-400 opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
            </a>
            
            <div className="text-center">
              <div className="text-sm text-gray-400 mb-2">50% OFF ends soon!</div>
              <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <span className="text-green-400 text-lg">✓</span>
                  <span className="font-semibold">Instant Access</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="text-green-400 text-lg">✓</span>
                  <span className="font-semibold">30-Day Guarantee</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="text-green-400 text-lg">✓</span>
                  <span className="font-semibold">Cancel Anytime</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PremiumSection; 