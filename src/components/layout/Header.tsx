
import React from 'react';
import { useNavigate } from 'react-router-dom';
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

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
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
    <header className={cn("rtl sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-6", className)}>
      <div className="flex flex-1 items-center justify-end">
        <div className="flex items-center gap-4">
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
