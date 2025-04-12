
import React, { useState, useEffect } from 'react';
import { ArrowDownToLine, ArrowRightLeft, Plus } from 'lucide-react';
import ActionCard from './ActionCard';
import InlineProductForm from '../InlineProductForm';

const ActionCardsContainer: React.FC = () => {
  const [activeForm, setActiveForm] = useState<'add' | 'remove' | 'register' | null>(null);
  const [userRole, setUserRole] = useState<string>('');

  useEffect(() => {
    // Get the user role from localStorage
    const role = localStorage.getItem('teamMemberRole') || '';
    setUserRole(role);
  }, []);

  const handleCardClick = (formType: 'add' | 'remove' | 'register') => {
    setActiveForm(currentForm => currentForm === formType ? null : formType);
  };

  const isSystemAdmin = userRole === 'إدارة النظام';

  return (
    <>
      <h2 className="text-lg font-medium mb-3">إدارة المخزون</h2>
      
      <div className="grid grid-cols-2 gap-4">
        {isSystemAdmin && (
          <ActionCard 
            icon={Plus} 
            title="تسجيل منتج جديد" 
            iconColor="text-blue-600"
            onClick={() => handleCardClick('register')}
          />
        )}
        
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
