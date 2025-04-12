
import { TeamMember } from '../types';
import { normalizeIdentifier } from '../identifierUtils';
import { fetchTeamMemberByIdentifier } from './fetchTeamMember';

/**
 * Set up first-time password for a team member
 */
export const setupTeamMemberPassword = async (
  identifier: string,
  password: string
): Promise<TeamMember | null> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  console.log("Setting up password for identifier:", identifier);
  
  const normalizedIdentifier = normalizeIdentifier(identifier);
  
  try {
    // Fetch the team member from the database
    const teamMember = await fetchTeamMemberByIdentifier(normalizedIdentifier);
    
    if (!teamMember) {
      console.error("No team member found with this identifier");
      return null;
    }
    
    // Save the password for this team member
    localStorage.setItem(`userPassword:${teamMember.id}`, password);
    
    // Mark that this user has set up their password
    localStorage.setItem(`passwordSetup:${teamMember.id}`, 'true');
    
    // Save the current identifier for subsequent login
    localStorage.setItem('teamMemberIdentifier', normalizedIdentifier);
    
    // Store team member info in localStorage for immediate login
    localStorage.setItem('teamMemberId', teamMember.id);
    localStorage.setItem('teamMemberName', teamMember.name);
    localStorage.setItem('restaurantId', teamMember.restaurantId);
    localStorage.setItem('teamMemberRole', teamMember.role);
    
    console.log("Password setup complete for team member:", teamMember.name);
    
    return teamMember;
  } catch (error) {
    console.error("Error setting up password:", error);
    return null;
  }
};
