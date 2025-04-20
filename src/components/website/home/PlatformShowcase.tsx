
import React from 'react';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from '@/components/ui/carousel';
import { Smartphone, Laptop } from 'lucide-react';
import { motion } from 'framer-motion';
import LaptopFrame from './devices/LaptopFrame';
import PhoneFrame from './devices/PhoneFrame';
import PlatformFeatures from './PlatformFeatures';
import { containerVariants, deviceFrameVariants } from './animations';

const PlatformShowcase = () => {
  const platforms = [
    {
      title: 'واجهة الويب',
      description: 'نظام متكامل لإدارة المخزون عبر واجهة ويب سهلة الاستخدام',
      icon: <Laptop className="h-12 w-12 text-primary" />,
      mockup: '/mockups/web-dashboard.png',
      deviceImage: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=800',
      features: [
        'لوحة تحكم شاملة',
        'إدارة المنتجات بسهولة',
        'تتبع المخزون في الوقت الفعلي',
        'تقارير وإحصائيات متقدمة',
        'إدارة المستخدمين والصلاحيات'
      ],
      screenshots: [
        '/screenshots/web/dashboard.png',
        '/screenshots/web/inventory.png',
        '/screenshots/web/products.png',
        '/screenshots/web/reports.png',
        '/screenshots/web/settings.png'
      ]
    },
    {
      title: 'تطبيق الجوال',
      description: 'تطبيق محمول يتيح لك إدارة مخزونك من أي مكان',
      icon: <Smartphone className="h-12 w-12 text-primary" />,
      mockup: '/mockups/mobile-dashboard.png',
      deviceImage: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600',
      features: [
        'مسح المنتجات بالباركود',
        'تحديث المخزون فورياً',
        'عرض سريع للمنتجات',
        'إشعارات فورية للتنبيهات',
        'وضع عدم الاتصال'
      ],
      screenshots: [
        '/screenshots/mobile/home.png',
        '/screenshots/mobile/scan.png',
        '/screenshots/mobile/inventory.png',
        '/screenshots/mobile/notifications.png',
        '/screenshots/mobile/offline.png'
      ]
    }
  ];

  return (
    <div className="container mx-auto py-16 px-4">
      <motion.h2 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text"
      >
        منصة هايجين تيك للإدارة
      </motion.h2>
      
      <Carousel className="w-full max-w-4xl mx-auto">
        <CarouselContent>
          {platforms.map((platform, index) => (
            <CarouselItem key={index}>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-col md:flex-row items-center gap-8 bg-background p-8 rounded-xl shadow-lg"
              >
                <PlatformFeatures
                  icon={platform.icon}
                  title={platform.title}
                  description={platform.description}
                  features={platform.features}
                />
                
                <motion.div 
                  variants={deviceFrameVariants}
                  whileHover="hover"
                  className="w-full md:w-1/2 relative"
                >
                  {platform.title === 'واجهة الويب' ? (
                    <LaptopFrame 
                      screenshots={platform.screenshots}
                      deviceImage={platform.deviceImage}
                    />
                  ) : (
                    <PhoneFrame 
                      screenshots={platform.screenshots}
                      deviceImage={platform.deviceImage}
                    />
                  )}
                </motion.div>
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
