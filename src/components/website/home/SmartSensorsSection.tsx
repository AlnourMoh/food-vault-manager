
import React from "react";
import { Thermometer, AlarmSmoke } from "lucide-react";
import { Card } from "@/components/ui/card";

const sensors = [
  {
    image:
      "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&auto=format&fit=crop&q=60", // يمكن استبدالها بصورة رمزية لاحقًا
    title: "حساس الحرارة",
    tags: ["تبريد ذكي", "أمان الطعام"],
    iconBg: "bg-gradient-to-br from-blue-300 via-blue-100 to-white",
  },
  {
    image:
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&auto=format&fit=crop&q=60", // صورة رمزية للدخان/الغاز
    title: "كاشف الغازات والدخان",
    tags: ["تحذير فوري", "أمان كامل"],
    iconBg: "bg-gradient-to-br from-red-200 via-orange-100 to-white",
  },
];

const SmartSensorsSection = () => {
  return (
    <section
      id="smart-sensors"
      className="relative container mx-auto px-4 py-20 min-h-[60vh] flex flex-col justify-center"
      dir="rtl"
    >
      {/* خلفية جمالية عصرية */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-8 left-10 w-56 h-56 bg-gradient-to-br from-blue-200/40 to-purple-100/50 rounded-full blur-3xl opacity-40 animate-fade-in" />
        <div className="absolute bottom-0 right-10 w-32 h-32 bg-gradient-to-tr from-orange-100/40 to-red-100/40 rounded-full blur-2xl opacity-50 animate-fade-in" />
      </div>

      {/* عنوان مختصر */}
      <div className="relative z-10 max-w-3xl mx-auto text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-2 bg-gradient-to-r from-blue-700 via-blue-400 to-blue-300 text-transparent bg-clip-text animate-fade-in">
          استشعر الأمان في كل زاوية
        </h2>
        <p className="mx-auto text-base md:text-lg text-gray-700 dark:text-gray-300 font-medium animate-fade-in">
          أحدث تقنيات حماية المنازل والمنشآت – بدون قراءة مطوّلة.
        </p>
      </div>

      {/* عرض الكروت المصورة */}
      <div className="relative z-10 grid gap-8 md:grid-cols-2 justify-center items-stretch max-w-2xl mx-auto">
        {sensors.map((sensor, idx) => (
          <Card
            key={sensor.title}
            className="group bg-white/85 dark:bg-slate-900/70 border-0 shadow-xl rounded-3xl overflow-hidden transition-transform hover:scale-105 hover:shadow-2xl backdrop-blur-lg animate-scale-in"
          >
            <div className="flex flex-col items-center justify-center py-7 px-5">
              {/* الصورة أو الرسم التوضيحي */}
              <div className="relative w-24 h-24 mb-3 rounded-full overflow-hidden flex items-center justify-center border-4 border-blue-200 shadow-md bg-white group-hover:scale-110 transition-transform duration-300">
                <img
                  src={sensor.image}
                  alt={sensor.title}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* العنوان */}
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white tracking-tight animate-fade-in">
                {sensor.title}
              </h3>
              {/* الكلمات المفتاحية المختصرة */}
              <div className="flex flex-wrap gap-2 justify-center animate-fade-in">
                {sensor.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-fvm-primary/10 text-fvm-primary px-3 py-1 rounded-xl text-xs font-medium shadow-md"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default SmartSensorsSection;

