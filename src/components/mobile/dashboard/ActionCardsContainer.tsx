
import React, { useState } from 'react';
import { ArrowDownToLine, ArrowRightLeft } from 'lucide-react';
import ActionCard from './ActionCard';
import InlineProductForm from '../InlineProductForm';

const ActionCardsContainer: React.FC = () => {
  const [activeForm, setActiveForm] = useState<'add' | 'remove' | null>(null);

  const handleCardClick = (formType: 'add' | 'remove') => {
    setActiveForm(currentForm => currentForm === formType ? null : formType);
  };

  return (
    <>
      <h2 className="text-lg font-medium mb-3">إدارة المخزون</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <ActionCard 
          icon={ArrowDownToLine} 
          title="إدخال منتج" 
          iconColor="text-green-600"
          onClick={() => handleCardClick('add')}
        />
        
        <ActionCard 
          icon={ArrowRightLeft} 
          title="إخراج منتج" 
          iconColor="text-red-600"
          onClick={() => handleCardClick('remove')}
        />
      </div>

      {activeForm && (
        <div className="mt-6">
          <InlineProductForm 
            formType={activeForm} 
            onClose={() => setActiveForm(null)} 
          />
        </div>
      )}
    </>
  );
};

export default ActionCardsContainer;
