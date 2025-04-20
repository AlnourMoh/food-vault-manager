
import React from 'react';
import { motion } from 'framer-motion';
import LaptopFrame from './devices/LaptopFrame';
import PhoneFrame from './devices/PhoneFrame';
import PlatformFeatures from './PlatformFeatures';
import { containerVariants, deviceFrameVariants } from './animations';
import { LayoutDashboard, Package } from 'lucide-react';

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
    }
  ];

  return (
    <div className="relative py-16 bg-gradient-to-b from-background via-background/95 to-background">
      <motion.h2 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl font-bold text-center mb-12"
      >
        منصة متكاملة لإدارة المخزون
      </motion.h2>
      
      <div className="container mx-auto space-y-24">
        {platforms.map((platform, index) => (
          <motion.div
            key={index}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col md:flex-row items-center gap-8 rounded-xl"
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
                <LaptopFrame />
              ) : (
                <PhoneFrame />
              )}
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PlatformShowcase;
