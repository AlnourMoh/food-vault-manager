
import React from 'react';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from '@/components/ui/carousel';
import { LayoutDashboard, Package, Database, ChartBar, Users } from 'lucide-react';
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
      icon: <LayoutDashboard className="h-12 w-12 text-primary" />,
      features: [
        'لوحة تحكم شاملة لعرض الإحصائيات',
        'إدارة المنتجات والمخزون بكفاءة',
        'تتبع الصلاحية والكميات',
        'تقارير وإحصائيات متقدمة',
        'إدارة المستخدمين والصلاحيات'
      ],
      screenshots: [
        '/screenshots/web/dashboard.png',
        '/screenshots/web/products.png',
        '/screenshots/web/inventory.png',
        '/screenshots/web/reports.png',
        '/screenshots/web/users.png'
      ]
    },
    {
      title: 'تطبيق الجوال',
      description: 'تطبيق محمول يتيح لك إدارة مخزونك من أي مكان',
      icon: <Package className="h-12 w-12 text-primary" />,
      features: [
        'مسح المنتجات بالباركود',
        'تحديث المخزون فورياً',
        'عرض تنبيهات انتهاء الصلاحية',
        'إضافة وتعديل المنتجات',
        'عرض تقارير سريعة'
      ],
      screenshots: [
        '/screenshots/mobile/scan.png',
        '/screenshots/mobile/inventory.png',
        '/screenshots/mobile/alerts.png',
        '/screenshots/mobile/add-product.png',
        '/screenshots/mobile/quick-stats.png'
      ]
    }
  ];

  return (
    <div className="container mx-auto py-16 px-4">
      <motion.h2 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl font-bold text-center mb-12"
      >
        منصة متكاملة لإدارة المخزون
      </motion.h2>
      
      <Carousel className="w-full max-w-5xl mx-auto">
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
                      deviceImage="/images/app-screenshots/dashboard.png"
                    />
                  ) : (
                    <PhoneFrame 
                      screenshots={platform.screenshots}
                      deviceImage="/images/app-screenshots/mobile-home.png"
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
