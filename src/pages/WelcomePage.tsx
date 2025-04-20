
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogIn, Shield, Warehouse } from 'lucide-react';

const WelcomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100 rtl">
      <div className="text-center space-y-8 p-8 max-w-4xl">
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
        
        <Button 
          onClick={() => navigate('/restaurant/login')} 
          size="lg"
          className="text-lg px-8 py-6 bg-blue-600 hover:bg-blue-700 flex items-center gap-2 mx-auto"
        >
          <LogIn className="h-5 w-5" />
          <span>الدخول إلى لوحة التحكم</span>
        </Button>
      </div>
    </div>
  );
};

export default WelcomePage;
