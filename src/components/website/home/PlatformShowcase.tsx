
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
      ],
      screenshots: [
        '/screenshots/web/dashboard.png',
        '/screenshots/web/inventory.png',
        '/screenshots/web/products.png'
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
      ],
      screenshots: [
        '/screenshots/mobile/home.png',
        '/screenshots/mobile/scan.png',
        '/screenshots/mobile/inventory.png'
      ]
    }
  ];

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

  const screenshotVariants = {
    hidden: { 
      opacity: 0, 
      x: 50 
    },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        type: "spring",
        stiffness: 50,
        damping: 20
      }
    }
  };

  const deviceFrameVariants = {
    hover: {
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
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
                  variants={deviceFrameVariants}
                  whileHover="hover"
                  className="w-full md:w-1/2 relative"
                >
                  <Carousel 
                    className="w-full"
                    opts={{
                      align: "start",
                      loop: true
                    }}
                  >
                    <CarouselContent>
                      {platform.screenshots.map((screenshot, idx) => (
                        <CarouselItem key={idx} className="basis-full">
                          <motion.div
                            variants={screenshotVariants}
                            initial="hidden"
                            animate="visible"
                            custom={idx}
                            className="relative aspect-[16/9] overflow-hidden rounded-xl border shadow-xl"
                          >
                            <img 
                              src={screenshot} 
                              alt={`${platform.title} screenshot ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </motion.div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2" />
                    <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2" />
                  </Carousel>
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
