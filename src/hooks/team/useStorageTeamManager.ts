
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { TeamMemberFormData } from '@/types/team';
import { addTeamMemberApi, updateTeamMemberApi, deleteTeamMemberApi } from '@/api/teamMembersApi';
import { useTeamMembers } from './useTeamMembers';
import { useTeamErrors } from './useTeamErrors';
import { useTeamDuplicateCheck } from './useTeamDuplicateCheck';

export const useStorageTeamManager = (restaurantId: string | undefined) => {
  const [lastAddedMember, setLastAddedMember] = useState<TeamMemberFormData | null>(null);
  const { toast } = useToast();
  const { teamMembers, isLoading, fetchTeamMembers, setTeamMembers } = useTeamMembers(restaurantId);
  const { phoneError, emailError, resetErrors, setErrors } = useTeamErrors();
  const { checkDuplicates } = useTeamDuplicateCheck(restaurantId);

  // Make fetchTeamMembers available with useCallback to avoid constant recreation
  const refreshTeamMembers = useCallback(() => {
    console.log('Manual refresh of team members requested for restaurant:', restaurantId);
    if (restaurantId) {
      fetchTeamMembers();
    }
  }, [restaurantId, fetchTeamMembers]);

  const addTeamMember = async (memberData: TeamMemberFormData) => {
    if (!restaurantId) return false;
    resetErrors();
    
    try {
      const hasDuplicates = await checkDuplicates(memberData);
      if (hasDuplicates) {
        return false;
      }
      
      await addTeamMemberApi(restaurantId, memberData);
      
      toast({
        title: 'تمت الإضافة بنجاح',
        description: 'تم إضافة عضو الفريق بنجاح',
      });
      
      setLastAddedMember(memberData);
      refreshTeamMembers();
      return true;
    } catch (error: any) {
      console.error('Error adding team member:', error);
      setErrors(error);
      return false;
    }
  };

  const updateTeamMember = async (memberId: string, memberData: TeamMemberFormData) => {
    if (!restaurantId) return false;
    resetErrors();
    
    try {
      await updateTeamMemberApi(restaurantId, memberId, memberData);
      
      toast({
        title: 'تم التحديث بنجاح',
        description: 'تم تحديث بيانات عضو الفريق بنجاح',
      });
      
      refreshTeamMembers();
      return true;
    } catch (error: any) {
      console.error('Error updating team member:', error);
      setErrors(error);
      return false;
    }
  };

  const deleteTeamMember = async (memberId: string) => {
    if (!restaurantId) return;
    
    try {
      await deleteTeamMemberApi(restaurantId, memberId);
      
      toast({
        title: 'تم الحذف بنجاح',
        description: 'تم حذف عضو الفريق بنجاح',
      });
      
      refreshTeamMembers();
    } catch (error: any) {
      console.error('Error deleting team member:', error);
      toast({
        variant: 'destructive',
        title: 'خطأ في حذف عضو الفريق',
        description: error.message,
      });
    }
  };

  return {
    teamMembers,
    isLoading,
    addTeamMember,
    updateTeamMember,
    deleteTeamMember,
    lastAddedMember,
    phoneError,
    emailError,
    resetErrors,
    fetchTeamMembers: refreshTeamMembers
  };
};
