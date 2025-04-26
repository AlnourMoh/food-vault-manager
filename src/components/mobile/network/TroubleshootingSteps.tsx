
import React from 'react';
import { ExternalLink, WifiOff, RefreshCw } from 'lucide-react';

const TroubleshootingSteps = () => {
  return (
    <div className="text-xs text-muted-foreground mt-6 mb-2">
      <p className="font-medium mb-2">خطوات استكشاف الأخطاء وإصلاحها:</p>
      <ul className="text-right list-disc list-inside space-y-2">
        <li className="flex items-start">
          <WifiOff className="w-3 h-3 mt-1 ml-1 flex-shrink-0" />
          <span>تأكد من اتصالك بالإنترنت (WiFi أو بيانات الجوال)</span>
        </li>
        <li className="flex items-start">
          <RefreshCw className="w-3 h-3 mt-1 ml-1 flex-shrink-0" />
          <span>أعد تشغيل التطبيق بالكامل</span>
        </li>
        <li>تحقق من وضع الطيران وتأكد من إيقاف تشغيله</li>
        <li>إذا كنت تستخدم شبكة WiFi، حاول الاتصال بشبكة مختلفة</li>
        <li>قم بإعادة تشغيل جهاز التوجيه (الراوتر)</li>
        <li>قم بمسح ذاكرة التخزين المؤقت للتطبيق</li>
        <li className="flex items-start">
          <ExternalLink className="w-3 h-3 mt-1 ml-1 flex-shrink-0" />
          <span>تحقق من كتابة العنوان URL بشكل صحيح إذا كنت تستخدم متصفح الويب</span>
        </li>
      </ul>

      <p className="mt-4 font-medium">إذا استمرت المشكلة:</p>
      <ul className="text-right list-disc list-inside">
        <li>اتصل بمسؤول النظام</li>
        <li>تحقق من حالة الخادم عبر لوحة التحكم</li>
      </ul>
    </div>
  );
};

export default TroubleshootingSteps;
