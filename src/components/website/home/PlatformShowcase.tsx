
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
      deviceImage: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=800',
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
      deviceImage: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600',
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
                  {platform.title === 'واجهة الويب' ? (
                    // Laptop device frame
                    <div className="relative w-full aspect-[16/10]">
                      <motion.div 
                        className="absolute inset-0 rounded-lg overflow-hidden shadow-2xl bg-gray-800"
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                      >
                        {/* Laptop frame */}
                        <div className="relative w-full h-full">
                          {/* Laptop top bezel */}
                          <div className="absolute top-0 left-0 right-0 h-4 bg-gray-900 z-10 flex justify-center items-center">
                            <div className="w-2 h-2 rounded-full bg-gray-700"></div>
                          </div>
                          
                          {/* Screen content */}
                          <div className="absolute top-4 left-0 right-0 bottom-0 bg-white overflow-hidden">
                            <Carousel 
                              className="w-full h-full"
                              opts={{
                                align: "start",
                                loop: true
                              }}
                            >
                              <CarouselContent className="h-full">
                                {platform.screenshots.map((screenshot, idx) => (
                                  <CarouselItem key={idx} className="basis-full h-full">
                                    <motion.div
                                      variants={screenshotVariants}
                                      initial="hidden"
                                      animate="visible"
                                      custom={idx}
                                      className="w-full h-full"
                                    >
                                      <img 
                                        src={screenshot} 
                                        alt={`${platform.title} screenshot ${idx + 1}`}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                          e.currentTarget.src = platform.deviceImage;
                                        }}
                                      />
                                    </motion.div>
                                  </CarouselItem>
                                ))}
                              </CarouselContent>
                              <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-20" />
                              <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-20" />
                            </Carousel>
                          </div>
                        </div>
                      </motion.div>
                      
                      {/* Laptop keyboard/base */}
                      <motion.div 
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[90%] h-2 bg-gray-700 rounded-b-lg"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      ></motion.div>
                    </div>
                  ) : (
                    // Smartphone device frame
                    <div className="relative w-full max-w-[300px] mx-auto aspect-[9/16]">
                      <motion.div 
                        className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl border-8 border-gray-900 bg-gray-800"
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                      >
                        {/* Phone notch */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/4 h-5 bg-gray-900 rounded-b-lg z-10 flex justify-center items-end pb-1">
                          <div className="w-2 h-2 rounded-full bg-gray-700"></div>
                        </div>
                        
                        {/* Screen content */}
                        <div className="absolute inset-0 bg-white overflow-hidden">
                          <Carousel 
                            className="w-full h-full"
                            opts={{
                              align: "start",
                              loop: true
                            }}
                          >
                            <CarouselContent className="h-full">
                              {platform.screenshots.map((screenshot, idx) => (
                                <CarouselItem key={idx} className="basis-full h-full">
                                  <motion.div
                                    variants={screenshotVariants}
                                    initial="hidden"
                                    animate="visible"
                                    custom={idx}
                                    className="w-full h-full"
                                  >
                                    <img 
                                      src={screenshot} 
                                      alt={`${platform.title} screenshot ${idx + 1}`}
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        e.currentTarget.src = platform.deviceImage;
                                      }}
                                    />
                                  </motion.div>
                                </CarouselItem>
                              ))}
                            </CarouselContent>
                            <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-20" />
                            <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-20" />
                          </Carousel>
                        </div>
                      </motion.div>
                      
                      {/* Phone home button */}
                      <motion.div 
                        className="absolute bottom-4 left-1/2 -translate-x-1/2 w-10 h-1 bg-gray-700 rounded-full"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      ></motion.div>
                    </div>
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
