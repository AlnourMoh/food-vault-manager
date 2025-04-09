
import { useToast } from '@/hooks/use-toast';
import { addTeamMemberApi, updateTeamMemberApi, deleteTeamMemberApi } from '@/api/teamMembersApi';
import { TeamMemberFormData } from '@/types/team';
import { handleTeamMemberErrors } from '../utils/errorHandling';
import { useFetchOperations } from './fetchOperations';
import { useValidationOperations } from './validationOperations';

/**
 * Hook for team member CRUD operations
 */
export const useCrudOperations = (
  restaurantId: string | undefined,
  setIsLoading: (isLoading: boolean) => void,
  setTeamMembers: (members: any[]) => void,
  setLastAddedMember: (member: TeamMemberFormData | null) => void,
  setPhoneError: (error: string | null) => void,
  setEmailError: (error: string | null) => void
) => {
  const { toast } = useToast();
  const { fetchTeamMembers } = useFetchOperations(restaurantId, setIsLoading, setTeamMembers);
  const { checkDuplicates, resetErrors } = useValidationOperations(restaurantId, setPhoneError, setEmailError);

  /**
   * Add a new team member
   */
  const addTeamMember = async (memberData: TeamMemberFormData) => {
    if (!restaurantId) return false;
    
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
      handleTeamMemberErrors(error, setPhoneError, setEmailError);
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Update an existing team member
   */
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
      
      fetchTeamMembers();
      return true;
    } catch (error: any) {
      console.error('Error updating team member:', error);
      
      // التعامل مع أخطاء التكرار
      handleTeamMemberErrors(error, setPhoneError, setEmailError);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Delete a team member
   */
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

  return { addTeamMember, updateTeamMember, deleteTeamMember };
};
