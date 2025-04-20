
import React from 'react';
import { Card } from '@/components/ui/card';
import { BarcodeIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MobileSectionHeader from '@/components/mobile/common/MobileSectionHeader';

const ScanPage = () => {
  return (
    <div className="w-full h-full bg-white p-4 overflow-hidden">
      <div className="mb-6">
        <MobileSectionHeader
          icon={BarcodeIcon}
          title="مسح الباركود"
          description="قم بمسح باركود المنتج لعرض التفاصيل"
        />
        
        <div className="rounded-lg overflow-hidden mb-4">
          <div className="w-full aspect-video bg-gray-100 relative flex flex-col items-center justify-center border-2 border-dashed border-gray-300">
            <BarcodeIcon className="h-10 w-10 text-gray-400 mb-2" />
            <p className="text-gray-500 text-sm">قم بتوجيه الكاميرا نحو الباركود</p>
            
            <div className="absolute inset-0 flex">
              <div className="absolute top-0 h-px w-full bg-red-500 animate-pulse" style={{ top: '50%' }}></div>
            </div>
          </div>
        </div>
        
        <Card className="p-4 mb-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
            <div>
              <h4 className="font-semibold">حليب طازج</h4>
              <p className="text-sm text-gray-500">متوفر: 12 قطعة</p>
            </div>
          </div>
          <div className="flex gap-2 w-full mt-2">
            <Button className="flex-1" size="sm">تحديث المخزون</Button>
            <Button variant="outline" size="sm">التفاصيل</Button>
          </div>
        </Card>
        
        <div className="flex justify-center">
          <Button className="w-full" variant="secondary">إدخال الرمز يدوياً</Button>
        </div>
      </div>
    </div>
  );
};

export default ScanPage;
