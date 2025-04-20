
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogIn, Shield, Warehouse, Phone, Mail } from 'lucide-react';

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
          حلول متكاملة لإدارة مخزون المطاعم بذكاء وسهولة
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
            <LogIn className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="font-semibold text-xl mb-2">سهولة الاستخدام</h3>
            <p>واجهة بديهية وسريعة للتشغيل</p>
          </div>
        </div>
        
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
            <LogIn className="h-5 w-5 ml-2" />
            <span>تسجيل الدخول</span>
          </Button>
        </div>
      </div>

      {/* Contact Info */}
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">تواصل معنا</h2>
            <div className="flex justify-center gap-8">
              <div className="flex items-center gap-2">
                <Phone className="text-blue-600" />
                <span>+966 500000000</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="text-blue-600" />
                <span>info@hygiene-tech.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
