
import React from 'react';
import { Warehouse, Shield, Settings, BarChart, Clock, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const services = [
  {
    icon: <Warehouse className="w-12 h-12 text-blue-600" />,
    title: "إدارة المخزون",
    description: "تتبع دقيق للمنتجات وتواريخ الصلاحية مع تنبيهات آلية"
  },
  {
    icon: <Shield className="w-12 h-12 text-blue-600" />,
    title: "الأمان الغذائي",
    description: "ضمان سلامة المنتجات وجودتها وفقاً للمعايير العالمية"
  },
  {
    icon: <Settings className="w-12 h-12 text-blue-600" />,
    title: "سهولة الاستخدام",
    description: "واجهة بديهية وسهلة الاستخدام لجميع أفراد الفريق"
  },
  {
    icon: <BarChart className="w-12 h-12 text-blue-600" />,
    title: "تقارير وتحليلات",
    description: "تقارير تفصيلية عن حركة المخزون واستهلاك المنتجات"
  },
  {
    icon: <Clock className="w-12 h-12 text-blue-600" />,
    title: "متابعة مستمرة",
    description: "مراقبة المخزون في الوقت الفعلي مع تحديثات فورية"
  },
  {
    icon: <Users className="w-12 h-12 text-blue-600" />,
    title: "إدارة الفريق",
    description: "تنظيم صلاحيات الفريق ومتابعة أدائهم"
  }
];

const ServicesSection = () => {
  return (
    <div className="container mx-auto px-4 py-16 bg-gradient-to-b from-white to-blue-50">
      <div className="text-center max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-12 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
          خدماتنا
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card 
              key={index} 
              className="bg-white/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 border-blue-100"
            >
              <CardContent className="p-6">
                <div className="flex justify-center mb-4">
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServicesSection;
