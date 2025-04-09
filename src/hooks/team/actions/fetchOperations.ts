
import { useToast } from '@/hooks/use-toast';
import { fetchTeamMembersApi } from '@/api/teamMembersApi';

/**
 * Hook for team member fetch operations
 */
export const useFetchOperations = (
  restaurantId: string | undefined,
  setIsLoading: (isLoading: boolean) => void,
  setTeamMembers: (members: any[]) => void
) => {
  const { toast } = useToast();

  /**
   * Fetch all team members for a restaurant
   */
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

  return { fetchTeamMembers };
};
