
import { useState } from 'react';
import { StorageTeamMember } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { fetchTeamMembersApi } from '@/api/teamMembersApi';

export const useTeamMembers = (restaurantId: string | undefined) => {
  const [isLoading, setIsLoading] = useState(false);
  const [teamMembers, setTeamMembers] = useState<StorageTeamMember[]>([]);
  const { toast } = useToast();

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

  return {
    teamMembers,
    isLoading,
    fetchTeamMembers,
    setTeamMembers
  };
};
