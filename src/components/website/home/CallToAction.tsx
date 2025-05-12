
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

const CallToAction = () => {
  const navigate = useNavigate();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  return (
    <div className="relative py-24 bg-gradient-to-br from-blue-700 to-purple-700 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-20"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/10"></div>
      
      {/* Animated orbs */}
      <div className="absolute top-20 right-1/4 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 left-1/4 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '7s' }}></div>
      
      <motion.div 
        className="container mx-auto px-4 relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="text-center max-w-3xl mx-auto">
          <motion.h2 
            className="text-4xl md:text-5xl font-bold mb-6 text-white"
            variants={itemVariants}
          >
            ابدأ رحلتك مع هايجين تيك
          </motion.h2>
          
          <motion.p 
            className="text-xl text-white/90 mb-8 leading-relaxed"
            variants={itemVariants}
          >
            انضم إلى المطاعم التي تدير مخزونها بذكاء وفعالية وحافظ على جودة منتجاتك
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            variants={itemVariants}
          >
            <Button 
              onClick={() => navigate('/contact')} 
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 bg-white/10 backdrop-blur-lg border-white/20 text-white hover:bg-white/20 hover:scale-105 transition-all group"
            >
              اشترك مجاناً
              <ArrowLeft className="mr-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>

            <Button 
              onClick={() => navigate('/restaurant/login')} 
              size="lg"
              className="text-lg px-8 py-6 bg-white text-blue-600 hover:bg-white/90 hover:scale-105 transition-all"
            >
              تسجيل الدخول للنظام
            </Button>
          </motion.div>
          
          <motion.div
            className="mt-12 text-white/70"
            variants={itemVariants}
          >
            <p className="text-sm">لا تحتاج بطاقة ائتمانية للتسجيل • دعم فني على مدار الساعة • إعداد سريع</p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default CallToAction;
