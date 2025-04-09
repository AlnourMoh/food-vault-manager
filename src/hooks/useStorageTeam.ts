
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { StorageTeamMember } from '@/types';

interface TeamMemberFormData {
  name: string;
  role: string;
  phoneCountryCode: string;
  phoneNumber: string;
  email: string;
}

export const useStorageTeam = (restaurantId: string | undefined) => {
  const [isLoading, setIsLoading] = useState(false);
  const [teamMembers, setTeamMembers] = useState<StorageTeamMember[]>([]);
  const [lastAddedMember, setLastAddedMember] = useState<TeamMemberFormData | null>(null);
  const { toast } = useToast();

  const fetchTeamMembers = async () => {
    if (!restaurantId) return;
    
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('company_members')
        .select('*')
        .eq('company_id', restaurantId)
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      if (data) {
        const formattedMembers: StorageTeamMember[] = data.map(member => ({
          id: member.id,
          name: member.name,
          role: member.role === 'admin' ? 'manager' : 'team_member',
          phone: member.phone || '',
          email: member.email,
          restaurantId: member.company_id,
          restaurantName: '',
          joinDate: new Date(member.created_at),
          isActive: member.is_active
        }));
        
        setTeamMembers(formattedMembers);
      }
    } catch (error: any) {
      console.error('Error fetching team members:', error);
      toast({
        variant: 'destructive',
        title: 'خطأ في جلب بيانات أعضاء الفريق',
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addTeamMember = async (memberData: TeamMemberFormData) => {
    if (!restaurantId) return;
    
    setIsLoading(true);
    
    try {
      const formattedPhone = `+${memberData.phoneCountryCode}${memberData.phoneNumber}`;
      
      const { data, error } = await supabase
        .from('company_members')
        .insert([
          {
            company_id: restaurantId,
            name: memberData.name,
            role: memberData.role.includes('مدير') ? 'admin' : 'staff',
            phone: formattedPhone,
            email: memberData.email,
            is_active: true,
            user_id: crypto.randomUUID()
          }
        ])
        .select();
      
      if (error) {
        throw error;
      }
      
      toast({
        title: 'تمت الإضافة بنجاح',
        description: 'تم إضافة عضو الفريق بنجاح',
      });
      
      setLastAddedMember(memberData);
      
      fetchTeamMembers();
    } catch (error: any) {
      console.error('Error adding team member:', error);
      toast({
        variant: 'destructive',
        title: 'خطأ في إضافة عضو الفريق',
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateTeamMember = async (memberId: string, memberData: TeamMemberFormData) => {
    if (!restaurantId) return;
    
    setIsLoading(true);
    
    try {
      const formattedPhone = `+${memberData.phoneCountryCode}${memberData.phoneNumber}`;
      
      const { error } = await supabase
        .from('company_members')
        .update({
          name: memberData.name,
          role: memberData.role === 'manager' ? 'admin' : 'staff',
          phone: formattedPhone,
          email: memberData.email,
        })
        .eq('id', memberId)
        .eq('company_id', restaurantId);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: 'تم التحديث بنجاح',
        description: 'تم تحديث بيانات عضو الفريق بنجاح',
      });
      
      fetchTeamMembers();
    } catch (error: any) {
      console.error('Error updating team member:', error);
      toast({
        variant: 'destructive',
        title: 'خطأ في تحديث بيانات عضو الفريق',
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateWelcomeMessage = (memberData: TeamMemberFormData | null) => {
    if (!memberData) return '';
    
    return `مرحباً ${memberData.name}،

نرحب بك في فريق إدارة المخزن. لتتمكن من الوصول إلى تطبيق إدارة المخزن، يرجى اتباع الخطوات التالية:

1. قم بتحميل تطبيق إدارة المخزن من الرابط: https://storage-app.example.com/download
2. عند فتح التطبيق، قم بإدخال البريد الإلكتروني أو رقم الهاتف الذي تم تسجيلك به: ${memberData.email || `+${memberData.phoneCountryCode}${memberData.phoneNumber}`}
3. قم بإنشاء كلمة مرور خاصة بك للدخول إلى النظام
4. بعد تسجيل الدخول، يمكنك البدء في استخدام النظام وإدارة المخزن

إذا كان لديك أي استفسار، لا تتردد في التواصل مع مدير النظام.

مع تحياتنا،
فريق إدارة المخزن`;
  };

  const copyWelcomeMessage = async (memberData: TeamMemberFormData | null) => {
    if (!memberData) return;
    
    const message = generateWelcomeMessage(memberData);
    try {
      await navigator.clipboard.writeText(message);
      toast({
        title: 'تم نسخ الرسالة',
        description: 'تم نسخ رسالة الترحيب إلى الحافظة',
      });
    } catch (error) {
      console.error('Failed to copy message:', error);
      toast({
        variant: 'destructive',
        title: 'فشل نسخ الرسالة',
        description: 'حدث خطأ أثناء محاولة نسخ الرسالة',
      });
    }
  };

  return {
    teamMembers,
    isLoading,
    fetchTeamMembers,
    addTeamMember,
    updateTeamMember,
    lastAddedMember,
    generateWelcomeMessage,
    copyWelcomeMessage
  };
};
