
import React from 'react';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from '@/components/ui/carousel';
import { Smartphone, Laptop } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';

const PlatformShowcase = () => {
  const platforms = [
    {
      title: 'واجهة الويب',
      description: 'نظام متكامل لإدارة المخزون عبر واجهة ويب سهلة الاستخدام',
      icon: <Laptop className="h-12 w-12 text-primary" />,
      mockup: '/mockups/web-dashboard.png',
      features: [
        'لوحة تحكم شاملة',
        'إدارة المنتجات بسهولة',
        'تتبع المخزون في الوقت الفعلي'
      ]
    },
    {
      title: 'تطبيق الجوال',
      description: 'تطبيق محمول يتيح لك إدارة مخزونك من أي مكان',
      icon: <Smartphone className="h-12 w-12 text-primary" />,
      mockup: '/mockups/mobile-dashboard.png',
      features: [
        'مسح المنتجات بالباركود',
        'تحديث المخزون فورياً',
        'عرض سريع للمنتجات'
      ]
    }
  ];

  return (
    <div className="container mx-auto py-16 px-4">
      <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
        منصة هايجين تيك للإدارة
      </h2>
      
      <Carousel className="w-full max-w-4xl mx-auto">
        <CarouselContent>
          {platforms.map((platform, index) => (
            <CarouselItem key={index}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col md:flex-row items-center gap-8 bg-background p-8 rounded-xl shadow-lg"
              >
                <div className="w-full md:w-1/2">
                  <div className="flex items-center gap-4 mb-4">
                    {platform.icon}
                    <h3 className="text-2xl font-semibold">{platform.title}</h3>
                  </div>
                  <p className="text-muted-foreground mb-6">{platform.description}</p>
                  <ul className="space-y-3 mb-6">
                    {platform.features.map((feature, idx) => (
                      <li 
                        key={idx} 
                        className="flex items-center gap-2 text-foreground"
                      >
                        <div className="w-2 h-2 bg-primary rounded-full" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="w-full md:w-1/2">
                  <img 
                    src={platform.mockup} 
                    alt={platform.title} 
                    className="w-full h-auto rounded-xl shadow-2xl border"
                  />
                </div>
              </motion.div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default PlatformShowcase;
