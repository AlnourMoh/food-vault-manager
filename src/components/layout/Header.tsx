
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { ThemeToggle } from '@/components/ui/theme-toggle';

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // تحسين ظهور الهيدر ضمن واجهة المستخدم
  useEffect(() => {
    // تطبيق فئات واضحة على العنصر الحالي
    const headerElement = document.querySelector('header');
    if (headerElement) {
      headerElement.classList.add('app-header');
      
      // إضافة فئات خاصة حسب المسار
      if (location.pathname.includes('/admin/')) {
        headerElement.classList.add('admin-header');
        headerElement.setAttribute('style', `
          background: white !important;
          background-color: white !important;
          opacity: 1 !important;
          visibility: visible !important;
          z-index: 1010 !important;
          position: relative !important;
          display: flex !important;
        `);
      }
    }
    
    return () => {
      // إزالة الفئات الخاصة بالمسار عند الخروج
      if (headerElement) {
        headerElement.classList.remove('admin-header');
      }
    };
  }, [location.pathname]);
  
  const handleLogout = () => {
    console.log('تنفيذ تسجيل الخروج...');
    localStorage.removeItem('isAdminLogin');
    
    toast({
      title: "تم تسجيل الخروج بنجاح",
      description: "نتمنى لك يوماً سعيداً!",
    });
    
    navigate('/');
  };
  
  return (
    <header className={cn("rtl sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-6 app-header", className)}>
      <div className="flex flex-1 items-center justify-end">
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" alt="المستخدم" />
                  <AvatarFallback className="bg-primary text-primary-foreground">م د</AvatarFallback>
                </Avatar>
                <div className="text-sm font-medium text-right">
                  <div>مدير النظام</div>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>حسابي</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>الملف الشخصي</DropdownMenuItem>
              <DropdownMenuItem>الإعدادات</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>تسجيل الخروج</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
