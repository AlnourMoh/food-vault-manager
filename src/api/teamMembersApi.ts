import { supabase } from '@/integrations/supabase/client';
import { StorageTeamMember } from '@/types';

export const fetchTeamMembersApi = async (restaurantId: string) => {
  const { data, error } = await supabase
    .from('company_members')
    .select('*')
    .eq('company_id', restaurantId)
    .order('created_at', { ascending: false });
  
  if (error) {
    throw error;
  }
  
  return data.map(member => ({
    id: member.id,
    name: member.name,
    role: member.role === 'admin' ? 'manager' : 'team_member' as 'manager' | 'team_member',
    phone: member.phone || '',
    email: member.email,
    restaurantId: member.company_id,
    restaurantName: '',
    joinDate: new Date(member.created_at),
    isActive: member.is_active
  }));
};

export const addTeamMemberApi = async (restaurantId: string, memberData: {
  name: string;
  role: string;
  phoneCountryCode: string;
  phoneNumber: string;
  email: string;
}) => {
  const formattedPhone = `+${memberData.phoneCountryCode}${memberData.phoneNumber}`;
  
  // Map frontend role to database role (admin or staff)
  const dbRole = memberData.role === 'إدارة النظام' ? 'admin' : 'staff';
  
  const { data, error } = await supabase
    .from('company_members')
    .insert([
      {
        company_id: restaurantId,
        name: memberData.name,
        role: dbRole,
        phone: formattedPhone,
        email: memberData.email,
        is_active: true,
        user_id: crypto.randomUUID()
      }
    ])
    .select();
  
  if (error) {
    throw error;
  }
  
  return data;
};

export const updateTeamMemberApi = async (
  restaurantId: string,
  memberId: string,
  memberData: {
    name: string;
    role: string;
    phoneCountryCode: string;
    phoneNumber: string;
    email: string;
  }
) => {
  const formattedPhone = `+${memberData.phoneCountryCode}${memberData.phoneNumber}`;
  
  // Map frontend role to database role (admin or staff)
  const dbRole = memberData.role === 'إدارة النظام' ? 'admin' : 'staff';
  
  const { error } = await supabase
    .from('company_members')
    .update({
      name: memberData.name,
      role: dbRole,
      phone: formattedPhone,
      email: memberData.email,
    })
    .eq('id', memberId)
    .eq('company_id', restaurantId);
  
  if (error) {
    throw error;
  }
};

export const deleteTeamMemberApi = async (restaurantId: string, memberId: string) => {
  const { error } = await supabase
    .from('company_members')
    .delete()
    .eq('id', memberId)
    .eq('company_id', restaurantId);
  
  if (error) {
    throw error;
  }
};
