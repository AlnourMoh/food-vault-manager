
import React from 'react';
import { Shield } from 'lucide-react';

const HeroSection = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-purple-600 py-24">
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-20"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/10"></div>
      <div className="text-center space-y-8 p-8 max-w-4xl mx-auto relative z-10">
        <div className="flex justify-center items-center gap-4 mb-6 animate-fade-in">
          <Shield className="text-white w-16 h-16" />
          <h1 className="text-5xl font-bold text-white">
            هايجين تيك
          </h1>
        </div>
        
        <p className="text-2xl text-white/90 mb-8 animate-fade-in">
          نظام متكامل لإدارة المخزون في المطاعم بذكاء وفعالية
        </p>
        
        <div className="grid md:grid-cols-3 gap-6 mb-12">
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
        </div>
      </div>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => (
  <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-6 rounded-xl hover:transform hover:scale-105 transition-all duration-300">
    {icon}
    <h3 className="font-semibold text-xl mb-2 text-white">{title}</h3>
    <p className="text-white/80">{description}</p>
  </div>
);

export default HeroSection;
