
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

export const ForgotPasswordDialog = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const { toast } = useToast();

  const handleForgotPassword = async () => {
    if (!email) {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: "يرجى إدخال البريد الإلكتروني",
      });
      return;
    }

    setIsLoading(true);
    try {
      // أولاً: التحقق من وجود البريد الإلكتروني في قاعدة البيانات
      const { data: checkData, error: checkError } = await supabase
        .from('restaurant_access')
        .select('email')
        .eq('email', email)
        .maybeSingle();

      if (checkError) {
        throw new Error("حدث خطأ أثناء التحقق من البريد الإلكتروني");
      }

      // إذا لم يتم العثور على البريد الإلكتروني
      if (!checkData) {
        toast({
          variant: "destructive",
          title: "البريد الإلكتروني غير موجود",
          description: "لم يتم العثور على حساب مرتبط بهذا البريد الإلكتروني",
        });
        setIsLoading(false);
        return;
      }

      // إذا تم العثور على البريد الإلكتروني، نرسل طلب استعادة كلمة المرور
      const { error } = await supabase.rpc('request_password_reset', {
        p_email: email
      });

      if (error) throw error;

      toast({
        title: "تم إرسال الطلب",
        description: "تم إرسال طلب استعادة كلمة المرور إلى إدارة المطعم",
      });
      setShowDialog(false);
      setEmail('');
    } catch (error: any) {
      console.error("Error in password reset:", error);
      toast({
        variant: "destructive",
        title: "خطأ في إرسال الطلب",
        description: error.message || "حدث خطأ أثناء محاولة إرسال طلب استعادة كلمة المرور",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          className="text-sm text-primary hover:text-primary/80"
        >
          نسيت كلمة المرور؟
        </Button>
      </DialogTrigger>
      <DialogContent className="rtl">
        <DialogHeader>
          <DialogTitle>استعادة كلمة المرور</DialogTitle>
          <DialogDescription>
            أدخل بريدك الإلكتروني وسيتم إرسال طلب استعادة كلمة المرور إلى إدارة المطعم
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="reset-email" className="text-sm font-medium">البريد الإلكتروني</label>
            <Input
              id="reset-email"
              type="email"
              placeholder="أدخل بريدك الإلكتروني"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={handleForgotPassword}
            disabled={isLoading || !email}
            className="w-full"
          >
            {isLoading ? "جاري الإرسال..." : "إرسال طلب استعادة كلمة المرور"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
