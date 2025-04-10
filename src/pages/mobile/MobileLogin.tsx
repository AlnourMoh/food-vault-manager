
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import logo from '/public/placeholder.svg'; // Replace with your app logo
import { authenticateTeamMember, setupTeamMemberPassword } from '@/services/teamAuthService';

const MobileLogin = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if user is already logged in
  useEffect(() => {
    const teamMemberId = localStorage.getItem('teamMemberId');
    if (teamMemberId) {
      navigate('/restaurant/mobile');
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!identifier) {
      toast({
        variant: "destructive",
        title: "خطأ في تسجيل الدخول",
        description: "الرجاء إدخال رقم الهاتف أو البريد الإلكتروني",
      });
      return;
    }

    if (!password) {
      toast({
        variant: "destructive",
        title: "خطأ في تسجيل الدخول",
        description: "الرجاء إدخال كلمة المرور",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      if (isFirstLogin) {
        if (password !== confirmPassword) {
          toast({
            variant: "destructive",
            title: "كلمات المرور غير متطابقة",
            description: "الرجاء التأكد من تطابق كلمات المرور",
          });
          setIsLoading(false);
          return;
        }

        // Setup password for first-time login
        const teamMember = await setupTeamMemberPassword(identifier, password);
        
        // Save user info to local storage
        localStorage.setItem('teamMemberId', teamMember.id);
        localStorage.setItem('teamMemberName', teamMember.name);
        
        toast({
          title: "تم تعيين كلمة المرور بنجاح",
          description: "تم تسجيل الدخول بنجاح",
        });
        
        // Redirect to mobile inventory page
        navigate('/restaurant/mobile');
      } else {
        // Regular login flow
        const authResult = await authenticateTeamMember(identifier, password);
        
        if (authResult.isFirstLogin) {
          setIsFirstLogin(true);
          toast({
            title: "أول تسجيل دخول",
            description: "الرجاء تعيين كلمة المرور الخاصة بك",
          });
        } else if (authResult.teamMember) {
          // Save user info to local storage
          localStorage.setItem('teamMemberId', authResult.teamMember.id);
          localStorage.setItem('teamMemberName', authResult.teamMember.name);
          
          toast({
            title: "تم تسجيل الدخول بنجاح",
            description: "مرحباً بعودتك",
          });
          
          // Redirect to mobile inventory page
          navigate('/restaurant/mobile');
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        variant: "destructive",
        title: "خطأ في تسجيل الدخول",
        description: "حدث خطأ أثناء محاولة تسجيل الدخول. الرجاء المحاولة مرة أخرى.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rtl min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-20 h-20 mx-auto mb-4">
            <img src={logo} alt="Logo" className="w-full h-full" />
          </div>
          <CardTitle className="text-2xl font-bold">إدارة المخزون</CardTitle>
          <CardDescription>
            {isFirstLogin ? 'قم بإنشاء كلمة مرور جديدة' : 'تسجيل الدخول إلى حساب فريق المخزن'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="identifier">رقم الهاتف أو البريد الإلكتروني</Label>
              <Input
                id="identifier"
                placeholder="أدخل رقم الهاتف أو البريد الإلكتروني"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                disabled={isFirstLogin}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">كلمة المرور</Label>
              <Input
                id="password"
                type="password"
                placeholder="أدخل كلمة المرور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            {isFirstLogin && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="أعد إدخال كلمة المرور"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            )}
            
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  جاري التحميل...
                </>
              ) : isFirstLogin ? 'تعيين كلمة المرور وتسجيل الدخول' : 'تسجيل الدخول'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-500">
            فريق إدارة المخزن فقط
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default MobileLogin;
