
import React from "react";
import { Thermometer, AlarmSmoke, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/card";

const sensors = [
  {
    icon: (
      <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-300 via-blue-100 to-white shadow-lg mb-3 animate-fade-in">
        <Thermometer className="w-8 h-8 text-blue-700" />
      </span>
    ),
    title: "حساس قياس درجة حرارة الثلاجة",
    description:
      "يتيح هذا الحساس مراقبة درجة حرارة الثلاجة بدقة، وتنبيهك في حال حدوث أي تغير غير طبيعي، مما يساهم في الحفاظ على الأطعمة والمنتجات في أفضل حالة ويمنع أي خسائر محتملة.",
    bg: "bg-white/60 dark:bg-slate-900/60 backdrop-blur-md"
  },
  {
    icon: (
      <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-red-200 via-orange-100 to-white shadow-lg mb-3 animate-fade-in">
        <AlarmSmoke className="w-8 h-8 text-red-500" />
      </span>
    ),
    title: "حساس كشف تسرب الغازات والدخان",
    description:
      "يعمل هذا الحساس المتطور على اكتشاف تسرب أكثر من 12 نوعًا من الغازات بالإضافة إلى الدخان، مما يضمن تنبيهك الفوري لأي خطر محتمل، ويعزز من إجراءات السلامة في المنزل أو مكان العمل.",
    bg: "bg-white/60 dark:bg-slate-900/60 backdrop-blur-md"
  }
];

const SmartSensorsSection = () => {
  return (
    <section
      id="smart-sensors"
      className="relative container mx-auto px-4 py-20 min-h-[60vh] flex flex-col justify-center"
      dir="rtl"
    >
      {/* خلفية متدرجة وزجاجية مع دوائر زخرفية */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-8 left-10 w-48 h-48 bg-gradient-to-br from-blue-200/50 to-purple-100/50 rounded-full blur-3xl opacity-50 animate-fade-in" />
        <div className="absolute bottom-0 right-4 w-32 h-32 bg-gradient-to-tr from-orange-100/50 to-red-100/40 rounded-full blur-2xl opacity-50 animate-fade-in" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto text-center mb-14">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-5 bg-gradient-to-r from-blue-700 via-blue-400 to-blue-300 text-transparent bg-clip-text animate-fade-in">
          أنظمة الاستشعار الذكية لحماية منزلك أو منشأتك
        </h2>
        <p className="mx-auto text-lg md:text-xl text-gray-800 dark:text-gray-200 font-medium leading-relaxed max-w-2xl animate-fade-in">
          نقدم ضمن خدماتنا المتقدمة حلولًا ذكية للحفاظ على سلامة ممتلكاتك وراحتك.
        </p>
      </div>

      <div className="relative z-10 grid gap-8 md:grid-cols-2 justify-center items-stretch max-w-4xl mx-auto">
        {sensors.map((sensor, idx) => (
          <Card
            key={sensor.title}
            className={`overflow-hidden ${sensor.bg} shadow-xl border-0 rounded-3xl transition-transform duration-300 hover:scale-105 hover:shadow-2xl group animate-scale-in`}
          >
            <div className="flex flex-col items-center justify-center py-12 px-8">
              {/* أيقونة محاطة بدائرة متدرجة */}
              {sensor.icon}
              {/* عنوان الحساس */}
              <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white animate-fade-in">
                {sensor.title}
              </h3>
              {/* وصف الحساس */}
              <p className="text-gray-700 dark:text-gray-300 text-center text-base md:text-lg leading-relaxed animate-fade-in">
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
