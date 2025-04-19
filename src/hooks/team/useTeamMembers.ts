
import { useState, useCallback } from 'react';
import { StorageTeamMember } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { fetchTeamMembersApi } from '@/api/teamMembersApi';

export const useTeamMembers = (restaurantId: string | undefined) => {
  const [isLoading, setIsLoading] = useState(false);
  const [teamMembers, setTeamMembers] = useState<StorageTeamMember[]>([]);
  const { toast } = useToast();

  const fetchTeamMembers = useCallback(async () => {
    if (!restaurantId) {
      console.warn('Cannot fetch team members - no restaurantId provided');
      return;
    }
    
    console.log('Fetching team members from API for restaurant:', restaurantId);
    setIsLoading(true);
    
    try {
      const formattedMembers = await fetchTeamMembersApi(restaurantId);
      console.log('Team members fetched successfully:', formattedMembers);
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
  }, [restaurantId, toast]);

  return {
    teamMembers,
    isLoading,
    fetchTeamMembers,
    setTeamMembers
  };
};
