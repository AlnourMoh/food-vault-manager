
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { StorageTeamMember } from '@/types';
import { TeamMemberFormData } from '@/types/team';
import { 
  fetchTeamMembersApi, 
  addTeamMemberApi, 
  updateTeamMemberApi,
  deleteTeamMemberApi,
  checkMemberDuplicatesApi
} from '@/api/teamMembersApi';
import { 
  generateWelcomeMessage,
  copyToClipboard
} from '@/utils/welcomeMessageUtils';

export const useStorageTeam = (restaurantId: string | undefined) => {
  const [isLoading, setIsLoading] = useState(false);
  const [teamMembers, setTeamMembers] = useState<StorageTeamMember[]>([]);
  const [lastAddedMember, setLastAddedMember] = useState<TeamMemberFormData | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const { toast } = useToast();

  const resetErrors = () => {
    setPhoneError(null);
    setEmailError(null);
  };

  const fetchTeamMembers = async () => {
    if (!restaurantId) return;
    
    setIsLoading(true);
    
    try {
      const formattedMembers = await fetchTeamMembersApi(restaurantId);
      setTeamMembers(formattedMembers);
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

  const checkDuplicates = async (memberData: TeamMemberFormData): Promise<boolean> => {
    if (!restaurantId) return false;
    
    resetErrors();
    
    const formattedPhone = `+${memberData.phoneCountryCode}${memberData.phoneNumber}`;
    
    try {
      const { isPhoneDuplicate, isEmailDuplicate } = await checkMemberDuplicatesApi(
        restaurantId,
        formattedPhone,
        memberData.email
      );
      
      if (isPhoneDuplicate) {
        setPhoneError('رقم الهاتف مستخدم بالفعل لعضو آخر');
        return true;
      }
      
      if (isEmailDuplicate) {
        setEmailError('البريد الإلكتروني مستخدم بالفعل لعضو آخر');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error checking duplicates:', error);
      return false;
    }
  };

  const addTeamMember = async (memberData: TeamMemberFormData) => {
    if (!restaurantId) return;
    
    setIsLoading(true);
    resetErrors();
    
    try {
      // التحقق من التكرار قبل الإضافة
      const hasDuplicates = await checkDuplicates(memberData);
      if (hasDuplicates) {
        setIsLoading(false);
        return false;
      }
      
      await addTeamMemberApi(restaurantId, memberData);
      
      toast({
        title: 'تمت الإضافة بنجاح',
        description: 'تم إضافة عضو الفريق بنجاح',
      });
      
      setLastAddedMember(memberData);
      
      fetchTeamMembers();
      return true;
    } catch (error: any) {
      console.error('Error adding team member:', error);
      
      // التعامل مع أخطاء التكرار
      if (error.message.includes('رقم الهاتف')) {
        setPhoneError(error.message);
      } else if (error.message.includes('البريد الإلكتروني')) {
        setEmailError(error.message);
      } else {
        toast({
          variant: 'destructive',
          title: 'خطأ في إضافة عضو الفريق',
          description: error.message,
        });
      }
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateTeamMember = async (memberId: string, memberData: TeamMemberFormData) => {
    if (!restaurantId) return;
    
    setIsLoading(true);
    resetErrors();
    
    try {
      await updateTeamMemberApi(restaurantId, memberId, memberData);
      
      toast({
        title: 'تم التحديث بنجاح',
        description: 'تم تحديث بيانات عضو الفريق بنجاح',
      });
      
      fetchTeamMembers();
      return true;
    } catch (error: any) {
      console.error('Error updating team member:', error);
      
      // التعامل مع أخطاء التكرار
      if (error.message.includes('رقم الهاتف')) {
        setPhoneError(error.message);
        return false;
      } else if (error.message.includes('البريد الإلكتروني')) {
        setEmailError(error.message);
        return false;
      } else {
        toast({
          variant: 'destructive',
          title: 'خطأ في تحديث بيانات عضو الفريق',
          description: error.message,
        });
      }
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTeamMember = async (memberId: string) => {
    if (!restaurantId) return;
    
    setIsLoading(true);
    
    try {
      await deleteTeamMemberApi(restaurantId, memberId);
      
      toast({
        title: 'تم الحذف بنجاح',
        description: 'تم حذف عضو الفريق بنجاح',
      });
      
      fetchTeamMembers();
    } catch (error: any) {
      console.error('Error deleting team member:', error);
      toast({
        variant: 'destructive',
        title: 'خطأ في حذف عضو الفريق',
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyWelcomeMessage = async (memberData: TeamMemberFormData | null) => {
    if (!memberData) return;
    
    const message = generateWelcomeMessage(memberData);
    const success = await copyToClipboard(message);
    
    if (success) {
      toast({
        title: 'تم نسخ الرسالة',
        description: 'تم نسخ رسالة الترحيب إلى الحافظة',
      });
    } else {
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
    deleteTeamMember,
    lastAddedMember,
    generateWelcomeMessage,
    copyWelcomeMessage,
    phoneError,
    emailError,
    resetErrors
  };
};
