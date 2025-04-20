
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
    <div className="space-y-20 py-12">
      {/* Hero Section */}
      <div className="text-center space-y-8 p-8 max-w-4xl mx-auto">
        <div className="flex justify-center items-center gap-4 mb-6">
          <Shield className="text-blue-600 w-16 h-16" />
          <h1 className="text-5xl font-bold text-gray-900">هايجين تيك</h1>
        </div>
        
        <p className="text-2xl text-gray-700 mb-8">
          نظام متكامل لإدارة المخزون في المطاعم بذكاء وفعالية
        </p>
        
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all">
            <Warehouse className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="font-semibold text-xl mb-2">إدارة المخزون</h3>
            <p>تتبع دقيق للمنتجات وتاريخ الصلاحية</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all">
            <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="font-semibold text-xl mb-2">الأمان الغذائي</h3>
            <p>نظام يضمن سلامة وجودة المخزون</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all">
            <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="font-semibold text-xl mb-2">إدارة الفريق</h3>
            <p>تنظيم صلاحيات ومهام فريق العمل</p>
          </div>
        </div>
      </div>

      {/* Platforms Section */}
      <div className="bg-gradient-to-b from-blue-50 to-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">منصات متعددة لتجربة مثالية</h2>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Web Platform */}
            <Card className="border-2 border-blue-100 shadow-lg">
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

            {/* Mobile App */}
            <Card className="border-2 border-blue-100 shadow-lg">
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

      {/* CTA Section */}
      <div className="text-center py-16 bg-blue-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6">ابدأ رحلتك مع هايجين تيك</h2>
          <p className="text-xl text-gray-700 mb-8">
            انضم إلى المطاعم التي تدير مخزونها بذكاء وفعالية
          </p>
          <div className="flex gap-4 justify-center">
            <Button 
              onClick={() => navigate('/contact')} 
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6"
            >
              اشترك مجاناً
            </Button>

            <Button 
              onClick={() => navigate('/restaurant/login')} 
              size="lg"
              className="text-lg px-8 py-6 bg-blue-600 hover:bg-blue-700"
            >
              تسجيل الدخول للنظام
            </Button>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">تواصل معنا</h2>
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
