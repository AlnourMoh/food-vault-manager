
import React from 'react';
import { Shield } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 rtl py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-4 mb-8">
            <Shield className="text-blue-600 w-16 h-16" />
            <h1 className="text-4xl font-bold text-gray-900">من نحن</h1>
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <p className="text-xl leading-relaxed text-gray-700 mb-6">
              نحن في هايجين تيك نقدم حلولاً متكاملة لإدارة المخزون في المطاعم، مع التركيز على سلامة الأغذية وكفاءة العمليات.
            </p>
            
            <p className="text-xl leading-relaxed text-gray-700 mb-6">
              تأسست شركتنا بهدف مساعدة المطاعم في تحسين عملياتها وضمان جودة منتجاتها من خلال نظام ذكي وسهل الاستخدام.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 mt-12">
              <div className="text-center">
                <h3 className="text-2xl font-semibold text-blue-600 mb-4">رؤيتنا</h3>
                <p className="text-gray-600">
                  أن نكون الخيار الأول للمطاعم في إدارة المخزون وضمان سلامة الأغذية.
                </p>
              </div>
              
              <div className="text-center">
                <h3 className="text-2xl font-semibold text-blue-600 mb-4">مهمتنا</h3>
                <p className="text-gray-600">
                  تمكين المطاعم من إدارة مخزونها بكفاءة وضمان جودة منتجاتها من خلال حلول تقنية متطورة.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
