
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Smartphone, 
  Shield, 
  Warehouse, 
  LayoutDashboard,
  Users,
  Search,
  BarcodeIcon
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const WelcomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-20">
      {/* Hero Section with Enhanced Design */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-purple-600 py-24">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/10"></div>
        <div className="text-center space-y-8 p-8 max-w-4xl mx-auto relative z-10">
          <div className="flex justify-center items-center gap-4 mb-6 animate-fade-in">
            <Shield className="text-white w-16 h-16" />
            <h1 className="text-5xl font-bold text-white">
              هايجين تيك
            </h1>
          </div>
          
          <p className="text-2xl text-white/90 mb-8 animate-fade-in">
            نظام متكامل لإدارة المخزون في المطاعم بذكاء وفعالية
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-6 rounded-xl hover:transform hover:scale-105 transition-all duration-300">
              <Warehouse className="w-12 h-12 text-white mx-auto mb-4" />
              <h3 className="font-semibold text-xl mb-2 text-white">إدارة المخزون</h3>
              <p className="text-white/80">تتبع دقيق للمنتجات وتاريخ الصلاحية</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-6 rounded-xl hover:transform hover:scale-105 transition-all duration-300">
              <Shield className="w-12 h-12 text-white mx-auto mb-4" />
              <h3 className="font-semibold text-xl mb-2 text-white">الأمان الغذائي</h3>
              <p className="text-white/80">نظام يضمن سلامة وجودة المخزون</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-6 rounded-xl hover:transform hover:scale-105 transition-all duration-300">
              <Users className="w-12 h-12 text-white mx-auto mb-4" />
              <h3 className="font-semibold text-xl mb-2 text-white">إدارة الفريق</h3>
              <p className="text-white/80">تنظيم صلاحيات ومهام فريق العمل</p>
            </div>
          </div>
        </div>
      </div>

      {/* Platform Showcase Section with Enhanced Device Frames */}
      <div className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
            منصات متعددة لتجربة مثالية
          </h2>
          
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Web Platform with Enhanced Laptop Frame */}
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

            {/* Mobile App with Enhanced Phone Frame */}
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
          </div>

          <div className="mt-20 grid md:grid-cols-2 gap-12">
            {/* Web Features Card */}
            <Card className="bg-gradient-to-br from-blue-500/5 to-purple-500/5 border-2 border-blue-100 shadow-lg backdrop-blur-sm transform hover:scale-105 transition-transform">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LayoutDashboard className="w-6 h-6 text-blue-600" />
                  <span>لوحة تحكم الويب</span>
                </CardTitle>
                <CardDescription>إدارة شاملة لمخزون مطعمك</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 text-gray-700">
                  <Search className="w-5 h-5 text-blue-600" />
                  <span>بحث متقدم عن المنتجات</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span>إدارة صلاحيات الفريق</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Warehouse className="w-5 h-5 text-blue-600" />
                  <span>تقارير تفصيلية للمخزون</span>
                </div>
              </CardContent>
            </Card>

            {/* Mobile Features Card */}
            <Card className="bg-gradient-to-br from-purple-500/5 to-blue-500/5 border-2 border-blue-100 shadow-lg backdrop-blur-sm transform hover:scale-105 transition-transform">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="w-6 h-6 text-blue-600" />
                  <span>تطبيق الجوال</span>
                </CardTitle>
                <CardDescription>إدارة المخزون من أي مكان</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 text-gray-700">
                  <BarcodeIcon className="w-5 h-5 text-blue-600" />
                  <span>مسح الباركود للمنتجات</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <span>تتبع تواريخ الصلاحية</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Search className="w-5 h-5 text-blue-600" />
                  <span>جرد سريع للمخزون</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section with Enhanced Design */}
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

      {/* Contact Section with Enhanced Design */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
            تواصل معنا
          </h2>
          <div className="space-y-4 text-gray-700">
            <p className="text-lg">هاتف: +966 500000000</p>
            <p className="text-lg">البريد الإلكتروني: info@hygiene-tech.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
