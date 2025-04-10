
import React from 'react';
import { ArrowDownToLine, ArrowRightLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ActionCard from './ActionCard';

const ActionCardsContainer: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <h2 className="text-lg font-medium mb-3">إدارة المخزون</h2>
      
      <div className="grid grid-cols-1 gap-4">
        <ActionCard 
          icon={ArrowDownToLine} 
          title="إدخال منتج" 
          iconColor="text-green-600"
          onClick={() => navigate('/restaurant/mobile/add')}
        />
        
        <ActionCard 
          icon={ArrowRightLeft} 
          title="إخراج منتج" 
          iconColor="text-red-600"
          onClick={() => navigate('/restaurant/mobile/remove')}
        />
      </div>
    </>
  );
};

export default ActionCardsContainer;
