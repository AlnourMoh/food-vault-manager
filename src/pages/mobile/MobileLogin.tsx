
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RestaurantLayout from '@/components/layout/RestaurantLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { authenticateTeamMember, setupTeamMemberPassword } from '@/services/teamAuthService';
import { Mail, Phone, Lock, Eye, EyeOff } from 'lucide-react';

const MobileLogin = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!identifier.trim()) {
      toast({
        title: "يرجى إدخال البريد الإلكتروني أو رقم الهاتف",
        variant: "destructive"
      });
      return;
    }
    
    if (!isFirstLogin && !password.trim()) {
      toast({
        title: "يرجى إدخال كلمة المرور",
        variant: "destructive"
      });
      return;
    }
    
    if (isFirstLogin && password !== confirmPassword) {
      toast({
        title: "كلمات المرور غير متطابقة",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (!isFirstLogin) {
        // Regular login flow
        const authResult = await authenticateTeamMember(identifier, password);
        
        if (authResult.isFirstLogin) {
          // User is logging in for the first time
          setIsFirstLogin(true);
          setIsLoading(false);
          return;
        }
        
        if (authResult.teamMember) {
          // Successfully authenticated
          toast({
            title: "تم تسجيل الدخول بنجاح",
            description: `مرحباً بك ${authResult.teamMember.name}`
          });
          navigate('/restaurant/mobile');
        } else {
          // Authentication failed
          toast({
            title: "فشل تسجيل الدخول",
            description: "بيانات الاعتماد غير صحيحة",
            variant: "destructive"
          });
        }
      } else {
        // First-time login, set up password
        const teamMember = await setupTeamMemberPassword(identifier, password);
        
        toast({
          title: "تم إنشاء كلمة المرور بنجاح",
          description: `مرحباً بك ${teamMember.name}`
        });
        navigate('/restaurant/mobile');
      }
    } catch (error) {
      toast({
        title: "حدث خطأ",
        description: "يرجى المحاولة مرة أخرى",
        variant: "destructive"
      });
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <RestaurantLayout hideSidebar={true}>
      <div className="rtl min-h-screen flex items-center justify-center">
        <Card className="w-[320px]">
          <CardHeader>
            <CardTitle className="text-xl text-center">
              {isFirstLogin ? "إنشاء كلمة المرور" : "تسجيل الدخول"}
            </CardTitle>
            <CardDescription className="text-center">
              {isFirstLogin 
                ? "أنشئ كلمة مرور للدخول إلى النظام" 
                : "أدخل البريد الإلكتروني أو رقم الهاتف وكلمة المرور"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    {identifier.includes('@') ? <Mail className="h-4 w-4 text-gray-400" /> : <Phone className="h-4 w-4 text-gray-400" />}
                  </div>
                  <Input
                    placeholder="البريد الإلكتروني أو رقم الهاتف"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="pl-10"
                    disabled={isFirstLogin}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Lock className="h-4 w-4 text-gray-400" />
                  </div>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="كلمة المرور"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="text-gray-400 hover:text-gray-500 focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>
              
              {isFirstLogin && (
                <div className="space-y-2">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Lock className="h-4 w-4 text-gray-400" />
                    </div>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="تأكيد كلمة المرور"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              )}
              
              <Button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={isLoading}
              >
                {isLoading 
                  ? "جاري العملية..." 
                  : isFirstLogin 
                    ? "إنشاء كلمة المرور"
                    : "تسجيل الدخول"
                }
              </Button>
              
              {isFirstLogin && (
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={() => setIsFirstLogin(false)}
                >
                  العودة إلى تسجيل الدخول
                </Button>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </RestaurantLayout>
  );
};

export default MobileLogin;
