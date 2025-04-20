
import React from 'react';
import { Card } from '@/components/ui/card';
import { Package, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MobileSectionHeader from '@/components/mobile/common/MobileSectionHeader';
import MobileCategoryTabs from '@/components/mobile/common/MobileCategoryTabs';

const InventoryPage = () => {
  const categories = ['ألبان', 'لحوم', 'خضروات', 'معلبات'];
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);

  return (
    <div className="w-full h-full bg-white p-4 overflow-hidden">
      <MobileSectionHeader
        icon={Package}
        title="المخزون"
        description="عرض وإدارة المخزون"
      />
      
      <div className="mb-4">
        <div className="relative flex-1">
          <input className="w-full px-3 py-2 pr-8 rounded-lg border" placeholder="بحث..." />
          <div className="absolute left-2 top-1/2 -translate-y-1/2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
        </div>
      </div>

      <MobileCategoryTabs
        categories={categories}
        selectedCategory={selectedCategory}
        onSelect={setSelectedCategory}
      />
      
      <div className="space-y-3 mt-4">
        {[1, 2, 3, 4, 5].map((item) => (
          <Card key={item} className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                <div>
                  <h4 className="font-semibold">منتج {item}</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">الكمية: {50 - item * 5}</span>
                    {item % 3 === 0 && (
                      <span className="px-1.5 py-0.5 bg-red-100 text-red-700 text-xs rounded-full">
                        منخفض
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button className="text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default InventoryPage;
