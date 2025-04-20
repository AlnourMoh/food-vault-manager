import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
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
      </div>
    </div>
  );
};

const WebPlatformPreview = () => (
  <div className="relative group">
    <div className="relative mx-auto border-gray-800 dark:border-gray-800 bg-gray-800 border-[8px] rounded-t-xl h-[172px] max-w-[301px] md:h-[394px] md:max-w-[512px]">
      <div className="rounded-lg overflow-hidden h-[156px] md:h-[378px] bg-white">
        {/* Dashboard UI */}
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="bg-white border-b p-4 flex justify-between items-center">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <div className="w-3 h-3 bg-blue-500 rounded-full" />
              <span className="text-sm font-medium">لوحة التحكم</span>
            </div>
          </div>
          
          {/* Content */}
          <div className="flex-1 p-4 bg-gray-50">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <DashboardCard
                title="المخزون النشط"
                value="1,234"
                icon={<Warehouse className="w-5 h-5 text-blue-500" />}
              />
              <DashboardCard
                title="المنتجات"
                value="89"
                icon={<BarcodeIcon className="w-5 h-5 text-purple-500" />}
              />
            </div>
            
            {/* Activity Graph */}
            <div className="bg-white rounded-lg p-4 h-32 relative overflow-hidden">
              <div className="absolute bottom-0 inset-x-0 h-24">
                <div className="h-full w-full" style={{
                  background: "linear-gradient(180deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.01) 100%)"
                }}>
                  <svg className="w-full h-full" preserveAspectRatio="none">
                    <path
                      d="M0 50 Q 75 20, 150 35, 225 25, 300 40 T 400 30 V 100 H 0 Z"
                      fill="none"
                      stroke="rgb(59, 130, 246)"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
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
    <div className="rounded-[2rem] overflow-hidden w-[272px] h-[572px] bg-white">
      <div className="h-full flex flex-col">
        <div className="bg-gray-800 text-white px-4 py-2 flex justify-between items-center text-xs">
          <span>9:41</span>
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2z" />
            </svg>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16" />
            </svg>
          </div>
        </div>
        
        <div className="flex-1 bg-gray-50">
          <div className="p-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">المخزون</h2>
              <BarcodeIcon className="w-6 h-6 text-blue-500" />
            </div>
            
            <div className="space-y-4">
              <ProductCard
                name="منتج طازج"
                quantity="50 كغ"
                expiry="2024/06/15"
              />
              <ProductCard
                name="منتج منتهي"
                quantity="30 كغ"
                expiry="2024/03/15"
              />
              <ProductCard
                name="منتج يقارب الانتهاء"
                quantity="25 كغ"
                expiry="2024/04/25"
              />
            </div>
          </div>
        </div>
        
        <div className="bg-white border-t py-2 px-6 flex justify-around">
          <div className="flex flex-col items-center">
            <Warehouse className="w-6 h-6 text-blue-500" />
            <span className="text-xs mt-1">المخزون</span>
          </div>
          <div className="flex flex-col items-center">
            <BarcodeIcon className="w-6 h-6 text-gray-400" />
            <span className="text-xs mt-1">المسح</span>
          </div>
          <div className="flex flex-col items-center">
            <Users className="w-6 h-6 text-gray-400" />
            <span className="text-xs mt-1">الفريق</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

interface DashboardCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
}

const DashboardCard = ({ title, value, icon }: DashboardCardProps) => (
  <Card className="bg-white">
    <CardContent className="p-4 flex justify-between items-center">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-xl font-semibold">{value}</p>
      </div>
      {icon}
    </CardContent>
  </Card>
);

interface ProductCardProps {
  name: string;
  quantity: string;
  expiry: string;
}

const ProductCard = ({ name, quantity, expiry }: ProductCardProps) => {
  const today = new Date();
  const expiryDate = new Date(expiry);
  const diffTime = expiryDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  const isExpired = diffDays < 0;
  const isExpiring = diffDays > 0 && diffDays <= 30;
  
  return (
    <div 
      className={`bg-white rounded-lg p-4 shadow-sm border-l-4 ${
        isExpired 
          ? 'border-red-500 bg-red-50' 
          : isExpiring 
            ? 'border-orange-400 bg-orange-50' 
            : 'border-blue-500'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <h3 className="font-medium">{name}</h3>
            <BarcodeIcon className="h-4 w-4 text-gray-500" />
          </div>
          <p className="text-sm text-gray-500 mt-1">{quantity}</p>
          <div className="flex items-center mt-2">
            <span className={`text-xs px-2 py-1 rounded-full ${
              isExpired 
                ? 'bg-red-100 text-red-700' 
                : isExpiring 
                  ? 'bg-orange-100 text-orange-700' 
                  : 'text-gray-400'
            }`}>
              {isExpired 
                ? 'منتهي الصلاحية' 
                : isExpiring 
                  ? `ينتهي خلال ${diffDays} يوم` 
                  : expiry}
            </span>
          </div>
        </div>
        <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=100" 
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default PlatformShowcase;
