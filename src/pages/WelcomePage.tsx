
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';

const WelcomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100">
      <div className="text-center space-y-8 p-8">
        <h1 className="text-4xl font-bold text-gray-900">نظام إدارة المطاعم</h1>
        <p className="text-xl text-gray-600 max-w-xl">
          مرحباً بكم في نظام إدارة المطاعم، حيث يمكنكم إدارة المخزون وفريق العمل بكل سهولة
        </p>
        <Button 
          onClick={() => navigate('/restaurant/login')} 
          size="lg"
          className="text-lg px-8 py-6 bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
        >
          <LogIn className="h-5 w-5" />
          <span>الدخول إلى لوحة التحكم</span>
        </Button>
      </div>
    </div>
  );
};

export default WelcomePage;
