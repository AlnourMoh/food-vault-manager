
import React from "react";
import { Thermometer, AlarmSmoke, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/card";

const sensors = [
  {
    icon: <Thermometer className="w-10 h-10 text-blue-600 mb-3" />,
    title: "حساس قياس درجة حرارة الثلاجة",
    description: (
      <>
        يتيح هذا الحساس مراقبة درجة حرارة الثلاجة بدقة، وتنبيهك في حال حدوث أي تغير غير طبيعي،
        مما يساهم في الحفاظ على الأطعمة والمنتجات في أفضل حالة ويمنع أي خسائر محتملة.
      </>
    ),
    color: "from-blue-200 to-blue-50"
  },
  {
    icon: <AlarmSmoke className="w-10 h-10 text-red-600 mb-3" />,
    title: "حساس كشف تسرب الغازات والدخان",
    description: (
      <>
        يعمل هذا الحساس المتطور على اكتشاف تسرب أكثر من 12 نوعًا من الغازات بالإضافة إلى الدخان،
        مما يضمن تنبيهك الفوري لأي خطر محتمل، ويعزز من إجراءات السلامة في المنزل أو مكان العمل.
      </>
    ),
    color: "from-red-100 to-orange-50"
  }
];

const SmartSensorsSection = () => {
  return (
    <section id="smart-sensors" className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-800 to-blue-400 text-transparent bg-clip-text">
          أنظمة الاستشعار الذكية لحماية منزلك أو منشأتك
        </h2>
        <p className="text-lg text-muted-foreground">
          نقدم ضمن خدماتنا المتقدمة حلولًا ذكية للحفاظ على سلامة ممتلكاتك وراحتك
        </p>
      </div>
      <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
        {sensors.map((sensor, idx) => (
          <Card
            key={sensor.title}
            className={`bg-gradient-to-br ${sensor.color} shadow-lg hover:scale-105 transition-transform duration-200 border-0`}
          >
            <div className="flex flex-col items-center justify-center py-10 px-6">
              {sensor.icon}
              <h3 className="text-xl font-semibold mb-2">{sensor.title}</h3>
              <p className="text-gray-700 dark:text-gray-300 text-center leading-relaxed">
                {sensor.description}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default SmartSensorsSection;
