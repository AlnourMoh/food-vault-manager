
import { useTeamState } from './team/useTeamState';
import { useTeamActions } from './team/useTeamActions';
import { generateWelcomeMessage } from '@/utils/welcomeMessageUtils';
import { TeamMemberFormData } from '@/types/team';
import { StorageTeamMember } from '@/types';

export const useStorageTeam = (restaurantId: string | undefined) => {
  const {
    isLoading,
    teamMembers,
    lastAddedMember,
    phoneError,
    emailError,
    setIsLoading,
    setTeamMembers,
    setLastAddedMember,
    setPhoneError,
    setEmailError,
  } = useTeamState();

  const {
    fetchTeamMembers,
    addTeamMember,
    updateTeamMember,
    deleteTeamMember,
    copyWelcomeMessage,
    resetErrors,
  } = useTeamActions({
    restaurantId,
    setIsLoading,
    setTeamMembers,
    setLastAddedMember,
    setPhoneError,
    setEmailError,
  });

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
