
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const CallToAction = () => {
  const navigate = useNavigate();

  return (
    <div className="relative py-20 bg-gradient-to-br from-blue-600 to-purple-600 overflow-hidden">
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-20"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/10"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold mb-6 text-white">
            ابدأ رحلتك مع هايجين تيك
          </h2>
          <p className="text-xl text-white/90 mb-8">
            انضم إلى المطاعم التي تدير مخزونها بذكاء وفعالية
          </p>
          <div className="flex gap-4 justify-center">
            <Button 
              onClick={() => navigate('/contact')} 
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 bg-white/10 backdrop-blur-lg border-white/20 text-white hover:bg-white/20 hover:scale-105 transition-all"
            >
              اشترك مجاناً
            </Button>

            <Button 
              onClick={() => navigate('/restaurant/login')} 
              size="lg"
              className="text-lg px-8 py-6 bg-white text-blue-600 hover:bg-white/90 hover:scale-105 transition-all"
            >
              تسجيل الدخول للنظام
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallToAction;
