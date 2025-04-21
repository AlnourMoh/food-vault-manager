
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ResetPasswordAlertProps {
  email: string;
  onClose: () => void;
}

export const ResetPasswordAlert: React.FC<ResetPasswordAlertProps> = ({
  email,
  onClose
}) => {
  const [newPassword, setNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleResetPassword = async () => {
    if (!newPassword) {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: "يرجى إدخال كلمة المرور الجديدة",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('restaurant_access')
        .update({ password_hash: newPassword })
        .eq('email', email);

      if (error) throw error;

      toast({
        title: "تم تحديث كلمة المرور",
        description: "تم تحديث كلمة المرور بنجاح",
      });
      
      onClose();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "خطأ في تحديث كلمة المرور",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Alert className="my-4">
      <AlertTitle className="mb-4">طلب إعادة تعيين كلمة المرور</AlertTitle>
      <AlertDescription>
        <div className="space-y-4">
          <p>المستخدم {email} طلب إعادة تعيين كلمة المرور.</p>
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="أدخل كلمة المرور الجديدة"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <div className="space-x-2 rtl:space-x-reverse">
              <Button 
                onClick={handleResetPassword}
                disabled={isLoading}
              >
                {isLoading ? "جاري التحديث..." : "تعيين كلمة المرور"}
              </Button>
              <Button 
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                إلغاء
              </Button>
            </div>
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
};
