
import { StorageTeamActions } from './types';
import { useFetchOperations } from './actions/fetchOperations';
import { useCrudOperations } from './actions/crudOperations';
import { useWelcomeMessageOperations } from './actions/welcomeMessageOperations';
import { useValidationOperations } from './actions/validationOperations';
import { TeamMemberFormData } from '@/types/team';

interface UseTeamActionsProps {
  restaurantId: string | undefined;
  setIsLoading: (isLoading: boolean) => void;
  setTeamMembers: (members: any[]) => void;
  setLastAddedMember: (member: TeamMemberFormData | null) => void;
  setPhoneError: (error: string | null) => void;
  setEmailError: (error: string | null) => void;
}

export const useTeamActions = ({
  restaurantId,
  setIsLoading,
  setTeamMembers,
  setLastAddedMember,
  setPhoneError,
  setEmailError,
}: UseTeamActionsProps): StorageTeamActions => {
  
  // Fetch operations
  const { fetchTeamMembers } = useFetchOperations(restaurantId, setIsLoading, setTeamMembers);
  
  // CRUD operations
  const { addTeamMember, updateTeamMember, deleteTeamMember } = useCrudOperations(
    restaurantId,
    setIsLoading,
    setTeamMembers,
    setLastAddedMember,
    setPhoneError,
    setEmailError
  );
  
  // Welcome message operations
  const { copyWelcomeMessage } = useWelcomeMessageOperations();
  
  // Validation operations
  const { resetErrors } = useValidationOperations(restaurantId, setPhoneError, setEmailError);

  return {
    fetchTeamMembers,
    addTeamMember,
    updateTeamMember,
    deleteTeamMember,
    copyWelcomeMessage,
    resetErrors
  };
};
