
import React, { useState, useEffect } from 'react';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem } from '@/components/ui/navigation-menu';
import { Shield, Menu, X } from 'lucide-react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const WebsiteLayout = ({ children }: { children?: React.ReactNode }) => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Track scroll for header styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const scrollToSection = (sectionId: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col rtl">
      <header 
        className={`py-2 sticky top-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-md' 
            : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <motion.div 
                whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
              >
                <Shield className="h-8 w-8 text-blue-600" />
              </motion.div>
              <span className="font-bold text-xl">هايجين تيك</span>
            </Link>
            
            <div className="flex items-center gap-4">
              {/* Desktop Navigation */}
              <NavigationMenu className="hidden md:block">
                <NavigationMenuList className="flex gap-6">
                  <NavigationMenuItem>
                    <Link 
                      to="/" 
                      className={`text-gray-600 hover:text-blue-600 transition-colors relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600 after:origin-center ${location.pathname === '/' ? 'after:scale-x-100 text-blue-600 font-medium' : 'after:scale-x-0'} after:transition-transform after:duration-300 hover:after:scale-x-100`}
                    >
                      الرئيسية
                    </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <button 
                      onClick={() => scrollToSection('about')}
                      className="text-gray-600 hover:text-blue-600 transition-colors relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600 after:origin-center after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100"
                    >
                      من نحن
                    </button>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <button 
                      onClick={() => scrollToSection('services')}
                      className="text-gray-600 hover:text-blue-600 transition-colors relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600 after:origin-center after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100"
                    >
                      خدماتنا
                    </button>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <button 
                      onClick={() => scrollToSection('contact')}
                      className="text-gray-600 hover:text-blue-600 transition-colors relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600 after:origin-center after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100"
                    >
                      تواصل معنا
                    </button>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="hidden md:flex">تسجيل الدخول</Button>
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
              
              {/* Mobile Menu Toggle */}
              <button 
                className="md:hidden text-gray-600 hover:text-blue-600 transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white shadow-lg overflow-hidden"
          >
            <div className="flex flex-col px-4 py-6 space-y-6">
              <Link 
                to="/" 
                className="text-gray-800 hover:text-blue-600 font-medium text-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                الرئيسية
              </Link>
              <button 
                onClick={() => scrollToSection('about')}
                className="text-gray-800 hover:text-blue-600 font-medium text-lg text-right transition-colors"
              >
                من نحن
              </button>
              <button 
                onClick={() => scrollToSection('services')}
                className="text-gray-800 hover:text-blue-600 font-medium text-lg text-right transition-colors"
              >
                خدماتنا
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className="text-gray-800 hover:text-blue-600 font-medium text-lg text-right transition-colors"
              >
                تواصل معنا
              </button>
              <div className="pt-4 border-t border-gray-100">
                <div className="flex flex-col gap-2">
                  <Link 
                    to="/admin/login" 
                    className="text-gray-800 hover:text-blue-600 font-medium transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    دخول المسؤول
                  </Link>
                  <Link 
                    to="/restaurant/login" 
                    className="text-gray-800 hover:text-blue-600 font-medium transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    دخول المطعم
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <main className="flex-1">
        {children || <Outlet />}
      </main>
      
      <footer className="bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Shield className="h-6 w-6 text-blue-600" />
              <span className="font-bold">هايجين تيك</span>
            </div>
            <p className="text-gray-600">جميع الحقوق محفوظة © {new Date().getFullYear()} هايجين تيك</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default WebsiteLayout;
