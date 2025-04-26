
import React from 'react';

const TroubleshootingSteps = () => {
  return (
    <div className="text-xs text-muted-foreground mt-4">
      <p>إذا استمرت المشكلة:</p>
      <ul className="text-right mt-2 list-disc list-inside">
        <li>تحقق من وضع الطيران وتأكد من إيقاف تشغيله</li>
        <li>تحقق من اتصال WiFi أو بيانات الجوال</li>
        <li>قم بإعادة تشغيل جهاز التوجيه (الراوتر)</li>
        <li>تأكد من كتابة البريد الالكتروني وكلمة المرور بشكل صحيح (البريد بحروف صغيرة)</li>
        <li>أعد تشغيل التطبيق</li>
      </ul>
    </div>
  );
};

export default TroubleshootingSteps;
