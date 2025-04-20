
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const ContactPage = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission logic will be implemented later
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 rtl py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center">تواصل معنا</CardTitle>
              <CardDescription className="text-center text-lg">
                نحن هنا لمساعدتك في تحسين إدارة مطعمك
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="restaurantName">اسم المطعم</Label>
                  <Input id="restaurantName" placeholder="أدخل اسم المطعم" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="name">اسم المسؤول</Label>
                  <Input id="name" placeholder="أدخل اسمك الكامل" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <Input id="email" type="email" placeholder="أدخل بريدك الإلكتروني" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">رقم الهاتف</Label>
                  <Input id="phone" placeholder="أدخل رقم الهاتف" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">الرسالة</Label>
                  <Textarea 
                    id="message" 
                    placeholder="اكتب رسالتك هنا" 
                    className="min-h-[100px]"
                  />
                </div>
                
                <Button type="submit" className="w-full">
                  إرسال الطلب
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
