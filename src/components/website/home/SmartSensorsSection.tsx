
import React from "react";
import { Thermometer, AlarmSmoke } from "lucide-react";
import { Card } from "@/components/ui/card";

const sensors = [
  {
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=600&auto=format&fit=crop&q=80",
    title: "حساس الحرارة",
    tags: ["تبريد ذكي", "أمان الطعام"],
    icon: Thermometer,
    accent: "from-blue-300 via-blue-100 to-white",
  },
  {
    image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&auto=format&fit=crop&q=80",
    title: "كاشف الغازات والدخان",
    tags: ["تحذير فوري", "أمان كامل"],
    icon: AlarmSmoke,
    accent: "from-red-200 via-orange-100 to-white",
  },
];

const SmartSensorsSection = () => {
  return (
    <section
      id="smart-sensors"
      className="relative container mx-auto px-3 py-16 md:py-28 flex flex-col items-center min-h-[65vh] overflow-x-hidden"
      dir="rtl"
    >
      {/* خلفية متدرجة حديثة */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[70vw] h-[30vw] max-w-3xl bg-gradient-to-tr from-fvm-primary/40 via-fvm-primary/10 to-blue-100 blur-3xl opacity-40" />
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-gradient-to-tl from-orange-200/50 via-red-100/30 to-white rounded-full blur-2xl opacity-50" />
      </div>

      {/* عنوان إبداعي مبسط */}
      <div className="relative text-center mb-12 animate-fade-in">
        <h2 className="text-3xl md:text-5xl font-extrabold mb-3 bg-gradient-to-r from-fvm-primary to-blue-500 text-transparent bg-clip-text drop-shadow-md">
          الأمان الذكي بصريًا 
        </h2>
        <p className="mx-auto text-lg md:text-xl text-gray-700 dark:text-gray-300 font-semibold tracking-tight opacity-80">
          صور توضّح كل شيء
        </p>
      </div>

      {/* المعرض العصري للحساسات */}
      <div className="grid gap-8 md:grid-cols-2 w-full max-w-3xl px-2 animate-scale-in">
        {sensors.map((sensor, idx) => {
          const Icon = sensor.icon;
          return (
            <Card
              key={sensor.title}
              className="group relative border-0 shadow-lg bg-white/80 dark:bg-slate-900/60 rounded-3xl p-0 overflow-hidden hover:scale-105 transition-transform duration-300 backdrop-blur-2xl"
              style={{ minHeight: 380 }}
            >
              {/* صورة توضيحية كبيرة مع تأثيرات عصرية */}
              <div className={`relative w-full h-64 md:h-72`}>
                <img
                  src={sensor.image}
                  alt={sensor.title}
                  className="w-full h-full object-cover object-center rounded-t-3xl group-hover:scale-105 transition-transform duration-500 shadow-md"
                  loading="lazy"
                />
                {/* دائرة أيقونة عائمة أعلى الصورة */}
                <div className={`absolute -top-6 right-6 bg-gradient-to-br ${sensor.accent} p-3 rounded-full shadow-xl border-4 border-white dark:border-slate-900`}>
                  <Icon size={32} className="text-fvm-primary drop-shadow" />
                </div>
              </div>
              {/* تفاصيل مختصرة وجمالية */}
              <div className="flex flex-col items-center justify-center gap-2 py-6 px-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white drop-shadow-sm">
                  {sensor.title}
                </h3>
                <div className="flex gap-3 mt-1 flex-wrap justify-center">
                  {sensor.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-fvm-primary/10 text-fvm-primary px-3 py-1 rounded-xl text-xs font-semibold shadow transition"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              {/* رسم زخرفي سفلي كضوء متوهج */}
              <div className="absolute bottom-0 left-0 w-full h-3 bg-gradient-to-r from-fvm-primary/20 via-transparent to-blue-400/10 blur-xl opacity-80" />
            </Card>
          );
        })}
      </div>
    </section>
  );
};

export default SmartSensorsSection;

