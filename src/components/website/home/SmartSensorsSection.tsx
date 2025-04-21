
import React from "react";
import { Card } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";

// صور الأيقونات من رفعك
const temperatureIcon = "/lovable-uploads/ed5d2dca-23ba-4eb0-bdfc-3316aec5a67b.png";
const gasDetectorIcon = "/lovable-uploads/feb572ef-6b0a-4428-a409-e069facabb99.png";

// صور الحساسات
const sensors = [
  {
    image: "/lovable-uploads/0c68a540-df0c-4724-bd5c-70b429c55171.png",
    title: "حساس قياس درجة حرارة الثلاجة",
    tags: ["تبريد ذكي", "امان الطعام"],
    iconImage: temperatureIcon,
    accent: "from-blue-300 via-blue-100 to-white",
    description: "حساس متطور لمراقبة درجة حرارة الثلاجة للحفاظ على سلامة الطعام"
  },
  {
    image: "/lovable-uploads/27e2055d-bf26-46bf-9453-cd0ae9c09d70.png",
    title: "حساس كشف تسرب الغازات والدخان",
    tags: ["تحذير فوري", "امان كامل"],
    iconImage: gasDetectorIcon,
    accent: "from-red-200 via-orange-100 to-white",
    description: "نظام تنبيه فوري عند اكتشاف أي تسرب للغاز أو دخان لحماية منزلك"
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

      {/* كلمة منتجاتنا - تنسيق عنوان خدماتنا */}
      <div className="relative text-center mb-4 animate-fade-in">
        <h4 className="text-3xl font-bold mb-12 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
          منتجاتنا
        </h4>
      </div>

      {/* عنوان مختصر وجذاب */}
      <div className="relative text-center mb-12 animate-fade-in">
        <h2 className="text-3xl md:text-5xl font-extrabold mb-3 bg-gradient-to-r from-fvm-primary to-blue-500 text-transparent bg-clip-text drop-shadow-md">
          أنظمة الاستشعار الذكية لحماية منزلك أو منشأتك
        </h2>
        <p className="mx-auto text-lg md:text-xl text-gray-700 dark:text-gray-300 font-semibold tracking-tight opacity-80 max-w-md whitespace-pre-line">
          نقدم ضمن خدماتنا المتقدمة حلولا ذكية للحفاظ على سلامة ممتلكاتك وراحتك
        </p>
      </div>

      {/* معرض الحساسات بتصميم محسن */}
      <div className="grid gap-10 md:grid-cols-2 w-full max-w-4xl px-4 animate-scale-in">
        {sensors.map((sensor) => (
          <Card
            key={sensor.title}
            className="group relative border-0 shadow-xl bg-white/90 dark:bg-slate-900/70 rounded-3xl p-0 overflow-hidden hover:scale-102 transition-transform duration-500 backdrop-blur-3xl"
          >
            {/* صورة الحساس فقط بدون الأيقونة */}
            <div className="relative w-full">
              <AspectRatio ratio={16/9} className="bg-muted rounded-t-3xl">
                <img
                  src={sensor.image}
                  alt={sensor.title}
                  className="w-full h-full object-cover object-center rounded-t-3xl group-hover:scale-105 transition-transform duration-700 shadow-lg"
                  loading="lazy"
                  onError={e => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder.svg";
                  }}
                />
              </AspectRatio>
            </div>
            
            {/* قسم التفاصيل مع أيقونة كبيرة واضحة بدون دائرة */}
            <div className="p-6">
              {/* عنوان مع أيقونة كبيرة بشكل أوضح */}
              <div className="flex items-center gap-4 mb-3">
                <img
                  src={sensor.iconImage}
                  alt={`أيقونة ${sensor.title}`}
                  className="w-16 h-16 object-contain"
                  style={{minWidth: 64, minHeight: 64}}
                />
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                  {sensor.title}
                </h3>
              </div>
              
              {/* وصف الحساس */}
              <p className="text-gray-700 dark:text-gray-300 mb-4 mr-2">
                {sensor.description}
              </p>
              
              {/* تاغات */}
              <div className="flex gap-3 flex-wrap">
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
            <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gradient-to-r from-fvm-primary/30 via-transparent to-blue-400/20" />
          </Card>
        ))}
      </div>
    </section>
  );
};

export default SmartSensorsSection;
