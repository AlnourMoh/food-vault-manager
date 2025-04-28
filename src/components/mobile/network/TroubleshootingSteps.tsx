
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const TroubleshootingSteps: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-muted/50 rounded-lg p-4 text-right">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between text-primary font-medium"
      >
        <span>{isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</span>
        <span>خطوات استكشاف الأخطاء وإصلاحها</span>
      </button>
      
      {isExpanded && (
        <ol className="mt-3 space-y-2 text-sm list-decimal pr-5">
          <li>تأكد من أن جهازك متصل بالإنترنت عبر WiFi أو البيانات الخلوية.</li>
          <li>قم بإيقاف تشغيل وإعادة تشغيل WiFi أو البيانات الخلوية.</li>
          <li>إذا كنت تستخدم WiFi، حاول التبديل إلى البيانات الخلوية والعكس.</li>
          <li>أغلق التطبيق وأعد فتحه.</li>
          <li>تحقق من وجود تحديثات للتطبيق وقم بتحديثه إن وجدت.</li>
          <li>أعد تشغيل الجهاز.</li>
          <li>إذا استمرت المشكلة، حاول مسح ذاكرة التخزين المؤقت للتطبيق.</li>
        </ol>
      )}
    </div>
  );
};

export default TroubleshootingSteps;
