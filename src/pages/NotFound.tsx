
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import NetworkErrorView from "@/components/mobile/NetworkErrorView";

const NotFound = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  
  useEffect(() => {
    // Log the 404 error
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const handleRetry = () => {
    window.location.href = "/mobile/inventory";
  };

  if (isMobile) {
    return (
      <NetworkErrorView 
        onRetry={handleRetry} 
        errorCode="HTTP 404"
        additionalInfo="الصفحة التي تحاول الوصول إليها غير موجودة"
        url={window.location.href}
      />
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-4">عذراً، الصفحة غير موجودة</p>
        <a href="/" className="text-blue-500 hover:text-blue-700 underline">
          العودة إلى الصفحة الرئيسية
        </a>
      </div>
    </div>
  );
};

export default NotFound;
