import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Users, Activity, BarChart3 } from 'lucide-react';

const Landing = () => {
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 overflow-hidden">
      {/* HERO SECTION */}
      <section className="relative px-4 pt-12 pb-24 lg:pt-20 lg:pb-32 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-2xl"
          >
            <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-medium text-sm mb-6">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
              The Future of Community Reporting
            </motion.div>
            
            <motion.h1 variants={fadeIn} className="text-5xl lg:text-7xl font-extrabold text-slate-900 leading-tight mb-6">
              Empowering Citizens.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">
                Transforming Cities.
              </span>
            </motion.h1>
            
            <motion.p variants={fadeIn} className="text-lg text-slate-600 mb-8 leading-relaxed">
              Don't just walk past the problem. Report infrastructure issues, upvote community hazards, and hold local authorities accountable through permanent, AI-verified photographic evidence.
            </motion.p>
            
            <motion.div variants={fadeIn} className="flex flex-wrap gap-4">
              <Link to="/register" className="group flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg shadow-blue-600/30 hover:bg-blue-700 transition-all hover:-translate-y-1">
                Join the Platform
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/issues" className="flex items-center gap-2 bg-white text-slate-700 border-2 border-slate-200 px-8 py-4 rounded-xl font-semibold hover:bg-slate-50 transition-all hover:-translate-y-1">
                View Open Issues
              </Link>
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative w-full h-[500px] lg:h-[600px] flex items-center justify-center mt-10 lg:mt-0"
          >
            {/* Abstract Background Element */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-100/60 to-indigo-50/60 rounded-[3rem] transform rotate-3 scale-105 -z-10 shadow-inner"></div>
            
            {/* Central Glass Card */}
            <motion.div 
              animate={{ y: [0, -20, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="absolute z-10 w-full max-w-md bg-white/70 backdrop-blur-2xl p-6 rounded-3xl shadow-[0_20px_40px_-20px_rgba(0,0,0,0.15)] border border-white"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center shadow-inner">
                  <ShieldCheck className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-slate-800">AI Sensor Active</h3>
                  <p className="text-sm text-slate-500 font-medium">Scanning incoming territory...</p>
                </div>
              </div>
              
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-full h-16 rounded-2xl bg-white/90 p-3 flex items-center gap-4 shadow-sm border border-slate-100">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 animate-pulse"></div>
                    <div className="flex-1 space-y-2">
                      <div className="w-3/4 h-2.5 rounded-full bg-slate-200/80 animate-pulse" style={{ animationDelay: `${i * 150}ms`}}></div>
                      <div className="w-1/2 h-2 rounded-full bg-slate-100 animate-pulse" style={{ animationDelay: `${i * 200}ms`}}></div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Floating Stat Card 1 */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0, y: [0, 15, 0] }}
              transition={{ y: { repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }, opacity: { duration: 0.5, delay: 0.8 } }}
              className="absolute -right-2 lg:-right-8 top-16 z-20 bg-white p-5 rounded-3xl shadow-xl flex items-center gap-4 border border-slate-100"
            >
              <div className="bg-emerald-100 p-3.5 rounded-2xl text-emerald-600 shadow-inner">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Citizens</p>
                <p className="font-black text-2xl text-slate-800">10,000+</p>
              </div>
            </motion.div>

            {/* Floating Stat Card 2 */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0, y: [0, -15, 0] }}
              transition={{ y: { repeat: Infinity, duration: 7, ease: "easeInOut", delay: 0.5 }, opacity: { duration: 0.5, delay: 1.2 } }}
              className="absolute -left-2 lg:-left-12 bottom-20 z-20 bg-white p-5 rounded-3xl shadow-xl flex items-center gap-4 border border-slate-100"
            >
              <div className="bg-indigo-100 p-3.5 rounded-2xl text-indigo-600 shadow-inner">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Hazards Fixed</p>
                <p className="font-black text-2xl text-slate-800">94% Rate</p>
              </div>
            </motion.div>
          </motion.div>
          
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="bg-white py-24 px-4 relative relative z-10 rounded-t-[4rem] shadow-[0_-20px_40px_-20px_rgba(0,0,0,0.05)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">How Sociofy Works</h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">We built an intelligent pipeline to ensure only real, actionable community problems reach the authorities.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Activity className="w-8 h-8 text-blue-600" />, title: "Capture & Report", desc: "Snap a photo of the pothole, garbage, or hazard. Our advanced AI instantly validates the image to prevent spam." },
              { icon: <Users className="w-8 h-8 text-indigo-600" />, title: "Community Voting", desc: "Issues are entirely democratized. The most critical problems rise to the top through secure citizen voting." },
              { icon: <BarChart3 className="w-8 h-8 text-sky-600" />, title: "Track Progress", desc: "Earn gamification points for reporting and watch the live analytics dashboard hold authorities accountable." }
            ].map((feature, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -10 }}
                className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl transition-all duration-300"
              >
                <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
