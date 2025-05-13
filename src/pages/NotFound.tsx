
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
    if (location.pathname.includes('restaurant')) {
      navigate("/restaurant/dashboard");
    } else if (location.pathname.includes('admin')) {
      navigate("/admin/restaurants");
    } else {
      navigate("/");
    }
  };
  
  const handleGoToRestaurants = () => {
    navigate("/admin/restaurants");
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
          {location.pathname.includes('restaurants') ? 
            'يبدو أنك تحاول الوصول إلى صفحة مطعم. قد تحتاج إلى تسجيل الدخول أولاً أو التأكد من الرابط الصحيح.' : 
            'الصفحة التي تحاول الوصول إليها غير موجودة أو تم نقلها.'}
        </p>
        
        <div className="space-y-3">
          {location.pathname.includes('restaurants') && (
            <Button 
              onClick={handleGoToRestaurants}
              variant="default"
              className="w-full"
            >
              الذهاب إلى قائمة المطاعم
            </Button>
          )}
          
          <Button 
            onClick={handleRetry}
            variant="outline"
            className="w-full"
          >
            {location.pathname.includes('restaurant') ? 'الذهاب إلى لوحة تحكم المطعم' : 
             location.pathname.includes('admin') ? 'الذهاب إلى لوحة تحكم الإدارة' : 
             'العودة إلى الصفحة الرئيسية'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
