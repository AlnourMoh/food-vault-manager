
import { supabase } from '@/integrations/supabase/client';
import { TeamMember } from '../types';

/**
 * Fetch team member data from Supabase by phone or email
 */
export const fetchTeamMemberByIdentifier = async (
  identifier: string
): Promise<TeamMember | null> => {
  console.log("Fetching team member with identifier:", identifier);
  
  // Check if identifier is an email or phone
  const isEmail = identifier.includes('@');
  const fieldToMatch = isEmail ? 'email' : 'phone';
  
  try {
    // Query the company_members table to find the matching member
    const { data, error } = await supabase
      .from('company_members')
      .select('id, name, email, phone, role, company_id')
      .eq(fieldToMatch, identifier)
      .single();
    
    if (error) {
      console.error("Error fetching team member:", error);
      return null;
    }
    
    if (!data) {
      console.log("No team member found with this identifier");
      return null;
    }
    
    console.log("Team member found:", data.name);
    
    // Map the database record to our TeamMember type
    const teamMember: TeamMember = {
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: data.role,
      restaurantId: data.company_id
    };
    
    return teamMember;
  } catch (error) {
    console.error("Unexpected error fetching team member:", error);
    return null;
  }
};
