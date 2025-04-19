
import { useState, useEffect } from 'react';
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
import { generateWelcomeMessage } from '@/utils/welcomeMessageUtils';

export const useTeamManagement = (restaurantId: string | undefined) => {
  const [teamMembers, setTeamMembers] = useState<StorageTeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMember, setSelectedMember] = useState<StorageTeamMember | null>(null);
  const [lastAddedMember, setLastAddedMember] = useState<TeamMemberFormData | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const { toast } = useToast();

  const resetErrors = () => {
    setPhoneError(null);
    setEmailError(null);
  };

  // Fetch team members
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

  useEffect(() => {
    fetchTeamMembers();
  }, [restaurantId]);

  // Add team member
  const addTeamMember = async (memberData: TeamMemberFormData) => {
    if (!restaurantId) return false;
    
    setIsLoading(true);
    resetErrors();
    
    try {
      await addTeamMemberApi(restaurantId, memberData);
      
      toast({
        title: 'تمت الإضافة بنجاح',
        description: 'تم إضافة عضو الفريق بنجاح',
      });
      
      setLastAddedMember(memberData);
      await fetchTeamMembers();
      return true;
    } catch (error: any) {
      console.error('Error adding team member:', error);
      toast({
        variant: 'destructive',
        title: 'خطأ في إضافة عضو الفريق',
        description: error.message,
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Update team member
  const updateTeamMember = async (memberId: string, memberData: TeamMemberFormData) => {
    if (!restaurantId) return false;
    
    setIsLoading(true);
    resetErrors();
    
    try {
      await updateTeamMemberApi(restaurantId, memberId, memberData);
      
      toast({
        title: 'تم التحديث بنجاح',
        description: 'تم تحديث بيانات عضو الفريق بنجاح',
      });
      
      await fetchTeamMembers();
      return true;
    } catch (error: any) {
      console.error('Error updating team member:', error);
      toast({
        variant: 'destructive',
        title: 'خطأ في تحديث بيانات عضو الفريق',
        description: error.message,
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete team member
  const deleteTeamMember = async (memberId: string) => {
    if (!restaurantId) return;
    
    setIsLoading(true);
    
    try {
      await deleteTeamMemberApi(restaurantId, memberId);
      
      toast({
        title: 'تم الحذف بنجاح',
        description: 'تم حذف عضو الفريق بنجاح',
      });
      
      await fetchTeamMembers();
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

  return {
    teamMembers,
    isLoading,
    selectedMember,
    setSelectedMember,
    lastAddedMember,
    addTeamMember,
    updateTeamMember,
    deleteTeamMember,
    phoneError,
    emailError,
    resetErrors,
  };
};

