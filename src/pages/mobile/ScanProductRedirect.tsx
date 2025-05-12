
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const ScanProductRedirect: React.FC = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect immediately to the scan page
    console.log('ScanProductRedirect: Redirecting to /scan immediately');
    navigate('/scan', { replace: true });
  }, [navigate]);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">جاري التحويل...</h1>
        <p className="text-gray-500">جاري تحويلك إلى صفحة مسح المنتجات</p>
      </div>
    </div>
  );
};

export default ScanProductRedirect;
