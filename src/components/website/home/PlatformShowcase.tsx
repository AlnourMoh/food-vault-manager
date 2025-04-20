
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

  // Animation variants for better organization and reuse
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const contentVariants = {
    hidden: { 
      opacity: 0, 
      y: 20 
    },
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

  const imageVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8 
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
        delay: 0.2
      }
    }
  };

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
                <motion.div 
                  variants={contentVariants}
                  className="w-full md:w-1/2"
                >
                  <motion.div 
                    variants={contentVariants}
                    className="flex items-center gap-4 mb-4"
                  >
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      {platform.icon}
                    </motion.div>
                    <h3 className="text-2xl font-semibold">{platform.title}</h3>
                  </motion.div>
                  <motion.p 
                    variants={contentVariants}
                    className="text-muted-foreground mb-6"
                  >
                    {platform.description}
                  </motion.p>
                  <motion.ul 
                    variants={containerVariants}
                    className="space-y-3 mb-6"
                  >
                    {platform.features.map((feature, idx) => (
                      <motion.li 
                        key={idx}
                        variants={contentVariants}
                        className="flex items-center gap-2 text-foreground"
                      >
                        <motion.div 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: idx * 0.1 }}
                          className="w-2 h-2 bg-primary rounded-full" 
                        />
                        {feature}
                      </motion.li>
                    ))}
                  </motion.ul>
                </motion.div>
                <motion.div 
                  variants={imageVariants}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  className="w-full md:w-1/2"
                >
                  <img 
                    src={platform.mockup} 
                    alt={platform.title} 
                    className="w-full h-auto rounded-xl shadow-2xl border"
                  />
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
