
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RestaurantLayout from '@/components/layout/RestaurantLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { checkTeamMemberExists, authenticateTeamMember, setupTeamMemberPassword } from '@/services/teamAuthService';
import { Mail, Phone, Lock, Eye, EyeOff } from 'lucide-react';

const MobileLogin = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginStep, setLoginStep] = useState<'identifier' | 'password' | 'setup'>('identifier');
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleCheckIdentifier = async () => {
    if (!identifier.trim()) {
      toast({
        title: "يرجى إدخال البريد الإلكتروني أو رقم الهاتف",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await checkTeamMemberExists(identifier);
      
      if (!result.exists) {
        toast({
          title: "لم يتم العثور على هذا المستخدم",
          description: "يرجى التحقق من البريد الإلكتروني أو رقم الهاتف المدخل",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }
      
      // User exists, determine if they need to set up password
      if (result.isFirstLogin) {
        setIsFirstLogin(true);
        setLoginStep('setup');
      } else {
        setLoginStep('password');
      }
      
    } catch (error) {
      toast({
        title: "حدث خطأ",
        description: "يرجى المحاولة مرة أخرى",
        variant: "destructive"
      });
      console.error("Check identifier error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!password.trim()) {
      toast({
        title: "يرجى إدخال كلمة المرور",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const authResult = await authenticateTeamMember(identifier, password);
      
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
          description: "كلمة المرور غير صحيحة",
          variant: "destructive"
        });
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

  const handleSetupPassword = async () => {
    if (!password.trim()) {
      toast({
        title: "يرجى إدخال كلمة المرور",
        variant: "destructive"
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: "كلمات المرور غير متطابقة",
        variant: "destructive"
      });
      return;
    }
    
    if (password.length < 6) {
      toast({
        title: "يجب أن تتكون كلمة المرور من 6 أحرف على الأقل",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const teamMember = await setupTeamMemberPassword(identifier, password);
      
      toast({
        title: "تم إنشاء كلمة المرور بنجاح",
        description: `مرحباً بك ${teamMember.name}`
      });
      navigate('/restaurant/mobile');
    } catch (error) {
      toast({
        title: "حدث خطأ",
        description: "يرجى المحاولة مرة أخرى",
        variant: "destructive"
      });
      console.error("Setup password error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (loginStep === 'identifier') {
      handleCheckIdentifier();
    } else if (loginStep === 'password') {
      handleLogin();
    } else if (loginStep === 'setup') {
      handleSetupPassword();
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const goBackToIdentifier = () => {
    setLoginStep('identifier');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <RestaurantLayout hideSidebar={true}>
      <div className="rtl min-h-screen flex items-center justify-center">
        <Card className="w-[320px]">
          <CardHeader>
            <CardTitle className="text-xl text-center">
              {loginStep === 'identifier' 
                ? "تسجيل الدخول" 
                : loginStep === 'setup' 
                  ? "إنشاء كلمة المرور" 
                  : "إدخال كلمة المرور"}
            </CardTitle>
            <CardDescription className="text-center">
              {loginStep === 'identifier' 
                ? "أدخل البريد الإلكتروني أو رقم الهاتف" 
                : loginStep === 'setup' 
                  ? "أنشئ كلمة مرور للدخول إلى النظام" 
                  : "أدخل كلمة المرور الخاصة بك"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {loginStep === 'identifier' && (
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
                    />
                  </div>
                </div>
              )}
              
              {loginStep !== 'identifier' && (
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
              )}
              
              {loginStep === 'setup' && (
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
                  : loginStep === 'identifier'
                    ? "التالي"
                    : loginStep === 'setup'
                      ? "إنشاء كلمة المرور"
                      : "تسجيل الدخول"
                }
              </Button>
              
              {loginStep !== 'identifier' && (
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={goBackToIdentifier}
                >
                  العودة
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
