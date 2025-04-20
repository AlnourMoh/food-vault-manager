
import React from 'react';
import { Warehouse, Shield, Settings, BarChart, Clock, Users } from 'lucide-react';

const ServicesPage = () => {
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 rtl py-20">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-12">خدماتنا</h1>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {services.map((service, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all">
              <div className="flex justify-center mb-4">
                {service.icon}
              </div>
              <h3 className="text-xl font-semibold text-center mb-3">{service.title}</h3>
              <p className="text-gray-600 text-center">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
