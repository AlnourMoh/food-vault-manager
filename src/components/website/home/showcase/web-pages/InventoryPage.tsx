
import React from 'react';
import { Button } from '@/components/ui/button';
import { Package } from 'lucide-react';

const InventoryPage = () => {
  return (
    <div className="w-full h-full bg-white p-4 overflow-hidden">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Package className="h-6 w-6 text-primary" />
          <h3 className="text-lg font-semibold">تتبع المخزون</h3>
        </div>
        <div className="flex justify-between mb-4">
          <div className="space-x-2 flex">
            <Button variant="outline" size="sm" className="ml-2">الكل</Button>
            <Button variant="outline" size="sm" className="ml-2">منخفض المخزون</Button>
            <Button variant="outline" size="sm">منتهي الصلاحية</Button>
          </div>
        </div>
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-3 text-right">اسم المنتج</th>
                <th className="p-3 text-right">الكمية</th>
                <th className="p-3 text-right">تاريخ الصلاحية</th>
                <th className="p-3 text-right">الحالة</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map((item) => (
                <tr key={item} className="border-t">
                  <td className="p-3">منتج {item}</td>
                  <td className="p-3">{30 - item * 5} قطعة</td>
                  <td className="p-3">20/06/2025</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${item % 3 === 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                      {item % 3 === 0 ? 'منخفض' : 'متوفر'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InventoryPage;
