
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import NetworkErrorView from "@/components/mobile/NetworkErrorView";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  useEffect(() => {
    // Log the 404 error
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
    
    // Show error toast
    toast({
      variant: "destructive",
      title: "خطأ في الوصول",
      description: "الصفحة التي تحاول الوصول إليها غير موجودة"
    });
  }, [location.pathname]);

  const handleRetry = () => {
    if (location.pathname.includes('inventory')) {
      navigate("/inventory");
    } else if (location.pathname.includes('restaurant')) {
      navigate("/restaurant/dashboard");
    } else if (location.pathname.includes('admin')) {
      navigate("/admin/dashboard");
    } else if (isMobile) {
      navigate("/inventory");
    } else {
      navigate("/");
    }
  };
  
  const handleGoHome = () => {
    if (isMobile) {
      navigate("/inventory");
    } else {
      navigate("/");
    }
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
      <div className="text-center p-6 bg-white shadow-md rounded-lg max-w-md w-full">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-4">عذراً، الصفحة غير موجودة</p>
        <p className="text-gray-500 mb-6 text-sm">
          الصفحة التي تحاول الوصول إليها غير موجودة أو تم نقلها.
        </p>
        
        <div className="space-y-3">
          <Button 
            onClick={handleRetry}
            variant="default"
            className="w-full"
          >
            المحاولة مرة أخرى
          </Button>
          
          <Button 
            onClick={handleGoHome}
            variant="outline"
            className="w-full"
          >
            الذهاب إلى الصفحة الرئيسية
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
