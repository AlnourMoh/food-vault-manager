
import React from 'react';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu';
import { Shield } from 'lucide-react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const WebsiteLayout = ({ children }: { children?: React.ReactNode }) => {
  const location = useLocation();
  
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col rtl">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <Shield className="h-8 w-8 text-blue-600" />
              <span className="font-bold text-xl">هايجين تيك</span>
            </Link>
            
            <div className="flex items-center gap-4">
              <NavigationMenu>
                <NavigationMenuList className="hidden md:flex gap-6">
                  <NavigationMenuItem>
                    <Link 
                      to="/" 
                      className={`text-gray-600 hover:text-blue-600 ${location.pathname === '/' ? 'text-blue-600' : ''}`}
                    >
                      الرئيسية
                    </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <button 
                      onClick={() => scrollToSection('about')}
                      className="text-gray-600 hover:text-blue-600"
                    >
                      من نحن
                    </button>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <button 
                      onClick={() => scrollToSection('services')}
                      className="text-gray-600 hover:text-blue-600"
                    >
                      خدماتنا
                    </button>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <button 
                      onClick={() => scrollToSection('contact')}
                      className="text-gray-600 hover:text-blue-600"
                    >
                      تواصل معنا
                    </button>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">تسجيل الدخول</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link to="/admin/login" className="w-full text-right">
                      دخول المسؤول
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/restaurant/login" className="w-full text-right">
                      دخول المطعم
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-1">
        {children || <Outlet />}
      </main>
      
      <footer className="bg-gray-50 py-8 text-center text-gray-600">
        <div className="container mx-auto px-4">
          <p>جميع الحقوق محفوظة © {new Date().getFullYear()} هايجين تيك</p>
        </div>
      </footer>
    </div>
  );
};

export default WebsiteLayout;
