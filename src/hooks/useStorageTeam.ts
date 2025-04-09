
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { StorageTeamMember } from '@/types';

interface TeamMemberFormData {
  name: string;
  role: string;
  phone: string;
  email: string;
}

export const useStorageTeam = (restaurantId: string | undefined) => {
  const [isLoading, setIsLoading] = useState(false);
  const [teamMembers, setTeamMembers] = useState<StorageTeamMember[]>([]);
  const { toast } = useToast();

  const fetchTeamMembers = async () => {
    if (!restaurantId) return;
    
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('company_members')
        .select('*')
        .eq('company_id', restaurantId)
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      if (data) {
        // Convert database result to StorageTeamMember type
        const formattedMembers: StorageTeamMember[] = data.map(member => ({
          id: member.id,
          name: member.name,
          role: member.role === 'admin' ? 'manager' : 'team_member',
          phone: member.phone || '',
          email: member.email,
          restaurantId: member.company_id,
          restaurantName: '', // This would be populated if needed
          joinDate: new Date(member.created_at),
          isActive: member.is_active
        }));
        
        setTeamMembers(formattedMembers);
      }
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

  const addTeamMember = async (memberData: TeamMemberFormData) => {
    if (!restaurantId) return;
    
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('company_members')
        .insert([
          {
            company_id: restaurantId,
            name: memberData.name,
            role: memberData.role.includes('مدير') ? 'admin' : 'staff',
            phone: memberData.phone,
            email: memberData.email,
            is_active: true,
            user_id: crypto.randomUUID() // Placeholder for now
          }
        ])
        .select();
      
      if (error) {
        throw error;
      }
      
      toast({
        title: 'تمت الإضافة بنجاح',
        description: 'تم إضافة عضو الفريق بنجاح',
      });
      
      // Refresh team members
      fetchTeamMembers();
    } catch (error: any) {
      console.error('Error adding team member:', error);
      toast({
        variant: 'destructive',
        title: 'خطأ في إضافة عضو الفريق',
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
    addTeamMember
  };
};
