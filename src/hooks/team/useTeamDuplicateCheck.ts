
import { checkMemberDuplicatesApi } from '@/api/teamMembersApi';
import { TeamMemberFormData } from '@/types/team';

export const useTeamDuplicateCheck = (restaurantId: string | undefined) => {
  const checkDuplicates = async (memberData: TeamMemberFormData): Promise<boolean> => {
    if (!restaurantId) return false;
    
    const formattedPhone = `+${memberData.phoneCountryCode}${memberData.phoneNumber}`;
    
    try {
      const { isPhoneDuplicate, isEmailDuplicate } = await checkMemberDuplicatesApi(
        restaurantId,
        formattedPhone,
        memberData.email
      );
      
      return isPhoneDuplicate || isEmailDuplicate;
    } catch (error) {
      console.error('Error checking duplicates:', error);
      return false;
    }
  };

  return { checkDuplicates };
};
