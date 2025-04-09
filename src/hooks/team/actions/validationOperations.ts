
import { checkMemberDuplicatesApi } from '@/api/teamMembersApi';
import { TeamMemberFormData } from '@/types/team';
import { resetValidationErrors } from '../utils/errorHandling';

/**
 * Hook for team member validation operations
 */
export const useValidationOperations = (
  restaurantId: string | undefined,
  setPhoneError: (error: string | null) => void,
  setEmailError: (error: string | null) => void
) => {

  /**
   * Reset validation errors
   */
  const resetErrors = () => {
    resetValidationErrors(setPhoneError, setEmailError);
  };

  /**
   * Check for duplicates before adding/updating a member
   */
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

  return { checkDuplicates, resetErrors };
};
