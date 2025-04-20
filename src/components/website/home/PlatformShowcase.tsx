
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarcodeIcon, Search, Shield, Smartphone, Users, Warehouse } from 'lucide-react';

const PlatformShowcase = () => {
  return (
    <div className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5"></div>
      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
          منصات متعددة لتجربة مثالية
        </h2>
        
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <WebPlatformPreview />
          <MobilePlatformPreview />
        </div>

        <div className="mt-20 grid md:grid-cols-2 gap-12">
          <PlatformFeatureCard
            title="لوحة تحكم الويب"
            description="إدارة شاملة لمخزون مطعمك"
            features={[
              { icon: Search, text: "بحث متقدم عن المنتجات" },
              { icon: Users, text: "إدارة صلاحيات الفريق" },
              { icon: Warehouse, text: "تقارير تفصيلية للمخزون" }
            ]}
          />
          <PlatformFeatureCard
            title="تطبيق الجوال"
            description="إدارة المخزون من أي مكان"
            features={[
              { icon: BarcodeIcon, text: "مسح الباركود للمنتجات" },
              { icon: Shield, text: "تتبع تواريخ الصلاحية" },
              { icon: Search, text: "جرد سريع للمخزون" }
            ]}
          />
        </div>
      </div>
    </div>
  );
};

const WebPlatformPreview = () => (
  <div className="relative group">
    <div className="relative mx-auto border-gray-800 dark:border-gray-800 bg-gray-800 border-[8px] rounded-t-xl h-[172px] max-w-[301px] md:h-[294px] md:max-w-[512px] group-hover:transform group-hover:scale-105 transition-all duration-300">
      <div className="rounded-lg overflow-hidden h-[156px] md:h-[278px] bg-gradient-to-r from-blue-500 to-purple-500">
        <img
          src="/dashboard-preview.png"
          className="dark:hidden h-[156px] md:h-[278px] w-full rounded-lg object-cover"
          alt="لوحة تحكم المطعم"
        />
      </div>
    </div>
    <div className="relative mx-auto bg-gray-900 dark:bg-gray-700 rounded-b-xl rounded-t-sm h-[17px] max-w-[351px] md:h-[21px] md:max-w-[597px]">
      <div className="absolute left-1/2 top-0 -translate-x-1/2 rounded-b-xl w-[56px] h-[5px] md:w-[96px] md:h-[8px] bg-gray-800"></div>
    </div>
  </div>
);

const MobilePlatformPreview = () => (
  <div className="relative mx-auto border-gray-800 dark:border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[600px] w-[300px] shadow-xl group hover:transform hover:scale-105 transition-all duration-300">
    <div className="h-[32px] w-[3px] bg-gray-800 dark:bg-gray-800 absolute -right-[17px] top-[72px] rounded-r-lg"></div>
    <div className="h-[46px] w-[3px] bg-gray-800 dark:bg-gray-800 absolute -right-[17px] top-[124px] rounded-r-lg"></div>
    <div className="h-[46px] w-[3px] bg-gray-800 dark:bg-gray-800 absolute -right-[17px] top-[178px] rounded-r-lg"></div>
    <div className="h-[64px] w-[3px] bg-gray-800 dark:bg-gray-800 absolute -left-[17px] top-[142px] rounded-l-lg"></div>
    <div className="rounded-[2rem] overflow-hidden w-[272px] h-[572px] bg-gradient-to-b from-blue-500 to-purple-500">
      <img
        src="/mobile-preview.png"
        className="dark:hidden w-[272px] h-[572px] object-cover"
        alt="تطبيق الجوال"
      />
    </div>
  </div>
);

interface PlatformFeatureCardProps {
  title: string;
  description: string;
  features: {
    icon: React.ElementType;
    text: string;
  }[];
}

const PlatformFeatureCard = ({ title, description, features }: PlatformFeatureCardProps) => (
  <Card className="bg-gradient-to-br from-blue-500/5 to-purple-500/5 border-2 border-blue-100 shadow-lg backdrop-blur-sm transform hover:scale-105 transition-transform">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Smartphone className="w-6 h-6 text-blue-600" />
        <span>{title}</span>
      </CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      {features.map((feature, index) => (
        <div key={index} className="flex items-center gap-3 text-gray-700">
          <feature.icon className="w-5 h-5 text-blue-600" />
          <span>{feature.text}</span>
        </div>
      ))}
    </CardContent>
  </Card>
);

export default PlatformShowcase;
