
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import MainSidebar from './MainSidebar';
import Header from './Header';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // تحسين ظهور العناصر الرئيسية بإضافة فئة app-header و app-footer
  useEffect(() => {
    const isAdminRoute = location.pathname.includes('/admin/');
    // إضافة فئة خاصة لصفحات الإدارة
    if (isAdminRoute) {
      document.body.classList.add('admin-dashboard-page');
    }
    
    // تعريف العناصر الرئيسية عند التحميل
    const header = document.querySelector('header');
    if (header) {
      header.classList.add('app-header');
      header.style.background = 'white';
      header.style.backgroundColor = 'white';
      header.style.opacity = '1';
      header.style.visibility = 'visible';
    }
    
    const footer = document.querySelector('footer');
    if (footer) {
      footer.classList.add('app-footer');
      footer.style.background = 'white';
      footer.style.backgroundColor = 'white';
      footer.style.opacity = '1';
      footer.style.visibility = 'visible';
    }
    
    // تنظيف عند الخروج
    return () => {
      if (isAdminRoute) {
        document.body.classList.remove('admin-dashboard-page');
      }
    };
  }, [location.pathname]);
  
  const handleBack = () => {
    navigate(-1);
  };
  
  // تحقق مما إذا كنا في الصفحة الرئيسية أم لا
  const isHomePage = location.pathname === '/';
  
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-fvm-secondary/30">
      <div className="app-header">
        <MainSidebar />
      </div>
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="app-header bg-white border-b shadow-sm">
          <Header />
        </div>
        <main className="flex-1 overflow-auto p-6 content-container">
          {!isHomePage && (
            <div className="mb-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleBack}
                className="flex items-center gap-2 rtl:flex-row-reverse"
              >
                <ArrowRight className="h-4 w-4" />
                <span>رجوع</span>
              </Button>
            </div>
          )}
          {children}
        </main>
        <div className="app-footer bg-white border-t shadow-sm">
          {/* تضمين أي محتوى فوتر إذا كان موجودًا */}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
