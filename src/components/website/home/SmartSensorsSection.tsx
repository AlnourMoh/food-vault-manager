
import React from "react";
import { Thermometer, AlarmSmoke } from "lucide-react";
import { Card } from "@/components/ui/card";

const sensors = [
  {
    image: "/lovable-uploads/0c68a540-df0c-4724-bd5c-70b429c55171.png",
    title: "حساس الحرارة",
    tags: ["تبريد ذكي", "أمان الطعام"],
    icon: Thermometer,
    accent: "from-blue-300 via-blue-100 to-white",
  },
  {
    image: "/lovable-uploads/2a9c706a-93de-4941-b46a-79067c57f712.png",
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

      {/* عنوان مختصر وجذاب */}
      <div className="relative text-center mb-12 animate-fade-in">
        <h2 className="text-3xl md:text-5xl font-extrabold mb-3 bg-gradient-to-r from-fvm-primary to-blue-500 text-transparent bg-clip-text drop-shadow-md">
          أنظمة الاستشعار الذكية لحماية منزلك أو منشأتك:
        </h2>
        <p className="mx-auto text-lg md:text-xl text-gray-700 dark:text-gray-300 font-semibold tracking-tight opacity-80 max-w-md whitespace-pre-line">
          نقدم ضمن خدماتنا المتقدمة حلولًا ذكية للحفاظ على سلامة ممتلكاتك وراحتك، من خلال:
        </p>
      </div>

      {/* معرض الحساسات بشكل أكبر وتركيز على الصور */}
      <div className="grid gap-10 md:grid-cols-2 w-full max-w-4xl px-4 animate-scale-in">
        {sensors.map((sensor) => {
          const Icon = sensor.icon;
          return (
            <Card
              key={sensor.title}
              className="group relative border-0 shadow-xl bg-white/90 dark:bg-slate-900/70 rounded-3xl p-0 overflow-hidden hover:scale-110 transition-transform duration-500 backdrop-blur-3xl"
              style={{ minHeight: 420 }}
            >
              {/* صورة كبيرة مع إضاءة ظل ناعم وأيقونة مميزة */}
              <div className="relative w-full h-72 md:h-80">
                <img
                  src={sensor.image}
                  alt={sensor.title}
                  className="w-full h-full object-cover object-center rounded-t-3xl group-hover:scale-110 transition-transform duration-700 shadow-lg"
                  loading="lazy"
                />
                <div
                  className={`absolute -top-8 right-8 bg-gradient-to-br ${sensor.accent} p-4 rounded-full shadow-2xl border-4 border-white dark:border-slate-900`}
                >
                  <Icon size={40} className="text-fvm-primary drop-shadow-lg" />
                </div>
              </div>
              {/* تفاصيل مختصرة جداً مع تاغات واضحة */}
              <div className="flex flex-col items-center justify-center gap-4 py-6 px-6">
                <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white drop-shadow-md">
                  {sensor.title}
                </h3>
                <div className="flex gap-4 flex-wrap justify-center">
                  {sensor.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-fvm-primary/20 text-fvm-primary px-4 py-1 rounded-3xl text-base font-semibold shadow-inner"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              {/* شريط توهج زخرفي سفلي */}
              <div className="absolute bottom-0 left-0 w-full h-4 bg-gradient-to-r from-fvm-primary/30 via-transparent to-blue-400/20 blur-2xl opacity-90" />
            </Card>
          );
        })}
      </div>
    </section>
  );
};

export default SmartSensorsSection;

