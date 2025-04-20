
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Film, Timer, AlertTriangle, Utensils } from 'lucide-react';

const VideoTutorials = () => {
  return (
    <div className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5"></div>
      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
          فيديوهات تعليمية
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <VideoCard
            icon={<Utensils className="w-10 h-10 text-blue-500" />}
            title="الحفاظ على جودة الطعام"
            description="تعرف على أفضل الممارسات للحفاظ على جودة وسلامة الأطعمة في مطعمك"
            duration="4:30"
          />
          
          <VideoCard
            icon={<Timer className="w-10 h-10 text-purple-500" />}
            title="إدارة تواريخ الصلاحية"
            description="كيفية مراقبة وإدارة تواريخ صلاحية المنتجات بفعالية"
            duration="5:15"
          />
          
          <VideoCard
            icon={<AlertTriangle className="w-10 h-10 text-red-500" />}
            title="مخاطر انتهاء الصلاحية"
            description="تعرف على المخاطر الصحية للأطعمة منتهية الصلاحية وكيفية تجنبها"
            duration="3:45"
          />
        </div>
      </div>
    </div>
  );
};

interface VideoCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  duration: string;
}

const VideoCard = ({ icon, title, description, duration }: VideoCardProps) => (
  <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
    <CardContent className="p-6">
      <div className="relative mb-6 bg-gray-100 rounded-lg p-8 flex justify-center items-center group-hover:bg-gray-200 transition-colors">
        {icon}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <Film className="w-12 h-12 text-blue-600" />
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">{title}</h3>
          <span className="text-sm text-gray-500">{duration}</span>
        </div>
        <p className="text-gray-600">{description}</p>
      </div>
    </CardContent>
  </Card>
);

export default VideoTutorials;
