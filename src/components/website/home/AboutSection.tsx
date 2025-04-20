
import React from 'react';
import { Shield } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const AboutSection = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center max-w-4xl mx-auto">
        <div className="flex items-center justify-center gap-4 mb-8">
          <Shield className="text-blue-600 w-12 h-12" />
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
            من نحن
          </h2>
        </div>
        
        <div className="space-y-8">
          <Card className="bg-white/50 backdrop-blur-sm border-blue-100">
            <CardContent className="p-6">
              <p className="text-xl leading-relaxed text-gray-700">
                نحن في هايجين تيك نقدم حلولاً متكاملة لإدارة المخزون في المطاعم، مع التركيز على سلامة الأغذية وكفاءة العمليات.
              </p>
            </CardContent>
          </Card>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-100">
              <CardContent className="p-6 text-center">
                <h3 className="text-2xl font-semibold text-blue-600 mb-4">رؤيتنا</h3>
                <p className="text-gray-700">
                  أن نكون الخيار الأول للمطاعم في إدارة المخزون وضمان سلامة الأغذية.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-100">
              <CardContent className="p-6 text-center">
                <h3 className="text-2xl font-semibold text-blue-600 mb-4">مهمتنا</h3>
                <p className="text-gray-700">
                  تمكين المطاعم من إدارة مخزونها بكفاءة وضمان جودة منتجاتها من خلال حلول تقنية متطورة.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
