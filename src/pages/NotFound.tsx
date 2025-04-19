
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import NetworkErrorView from "@/components/mobile/NetworkErrorView";

const NotFound = () => {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const MOBILE_BREAKPOINT = 768;
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    
    // Set initial value
    checkIfMobile();
    
    // Add event listener
    window.addEventListener('resize', checkIfMobile);
    
    // Log the 404 error
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
    
    // Clean up
    return () => window.removeEventListener('resize', checkIfMobile);
  }, [location.pathname]);

  const handleRetry = () => {
    window.location.reload();
  };

  if (isMobile) {
    return <NetworkErrorView onRetry={handleRetry} />;
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
