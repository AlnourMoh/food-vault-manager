
import React from 'react';
import { Shield, Warehouse, Users, ArrowDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
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
    <div className="relative min-h-[80vh] overflow-hidden bg-gradient-to-br from-blue-700 to-purple-700 py-24 flex items-center">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-20"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/10"></div>
      
      {/* Animated orbs */}
      <div className="absolute top-20 right-20 w-40 h-40 bg-blue-400/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 left-20 w-56 h-56 bg-purple-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '7s' }}></div>
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container mx-auto px-4 relative z-10"
      >
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          <motion.div variants={itemVariants} className="flex justify-center items-center gap-4 mb-6">
            <Shield className="text-white w-16 h-16" />
            <h1 className="text-5xl md:text-7xl font-bold text-white">
              هايجين تيك
            </h1>
          </motion.div>
          
          <motion.p variants={itemVariants} className="text-2xl text-white/90 mb-8">
            نظام متكامل لإدارة المخزون في المطاعم بذكاء وفعالية
          </motion.p>
          
          <motion.div variants={containerVariants} className="grid md:grid-cols-3 gap-6 mb-12">
            <FeatureCard
              icon={<Warehouse className="w-12 h-12 text-white mx-auto mb-4" />}
              title="إدارة المخزون"
              description="تتبع دقيق للمنتجات وتاريخ الصلاحية"
            />
            <FeatureCard
              icon={<Shield className="w-12 h-12 text-white mx-auto mb-4" />}
              title="الأمان الغذائي"
              description="نظام يضمن سلامة وجودة المخزون"
            />
            <FeatureCard
              icon={<Users className="w-12 h-12 text-white mx-auto mb-4" />}
              title="إدارة الفريق"
              description="تنظيم صلاحيات ومهام فريق العمل"
            />
          </motion.div>
          
          <motion.div 
            variants={itemVariants}
            className="flex flex-col md:flex-row justify-center gap-4"
          >
            <Button 
              asChild
              size="lg"
              className="bg-white text-blue-700 hover:bg-white/90 hover:scale-105 transition-all text-lg px-8"
            >
              <Link to="/contact">ابدأ الآن مجانًا</Link>
            </Button>
            <Button 
              asChild
              variant="outline"
              size="lg"
              className="bg-transparent border-white text-white hover:bg-white/10 hover:scale-105 transition-all text-lg px-8"
            >
              <Link to="/restaurant/login">تسجيل الدخول</Link>
            </Button>
          </motion.div>
          
          <motion.div 
            variants={itemVariants}
            className="mt-20 flex justify-center"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 1, repeat: Infinity, repeatType: "reverse" }}
          >
            <a 
              href="#about" 
              className="flex flex-col items-center text-white/70 hover:text-white transition-colors"
            >
              <span className="mb-2">اكتشف المزيد</span>
              <ArrowDown className="h-6 w-6 animate-bounce" />
            </a>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => (
  <motion.div 
    whileHover={{ scale: 1.05, y: -5 }}
    className="bg-white/10 backdrop-blur-lg border border-white/20 p-6 rounded-xl transition-all duration-300"
  >
    {icon}
    <h3 className="font-semibold text-xl mb-2 text-white">{title}</h3>
    <p className="text-white/80">{description}</p>
  </motion.div>
);

export default HeroSection;
