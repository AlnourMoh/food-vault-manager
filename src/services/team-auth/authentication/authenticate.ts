
import { AuthenticateResult, TeamMember } from '../types';
import { normalizeIdentifier } from '../identifierUtils';
import { fetchTeamMemberByIdentifier } from './fetchTeamMember';

/**
 * Authenticate a team member by email/phone and password
 */
export const authenticateTeamMember = async (
  identifier: string, 
  password: string
): Promise<AuthenticateResult> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  console.log("Authenticating with identifier:", identifier, "and password:", password);
  
  const normalizedIdentifier = normalizeIdentifier(identifier);
  
  try {
    // Fetch the team member from the database
    const teamMember = await fetchTeamMemberByIdentifier(normalizedIdentifier);
    
    // If no team member found, authentication fails
    if (!teamMember) {
      console.log("Authentication failed: No team member found with this identifier");
      return {
        isFirstLogin: false
      };
    }
    
    // Get the stored password for this team member ID
    const storedPassword = localStorage.getItem(`userPassword:${teamMember.id}`);
    const hasSetupPassword = localStorage.getItem(`passwordSetup:${teamMember.id}`);
    
    console.log("Stored password:", !!storedPassword);
    console.log("Has setup password:", hasSetupPassword);
    
    // Fixed: For first login case, there may not be a password yet
    if (!storedPassword || hasSetupPassword !== 'true') {
      console.log("First login for this team member, need to set up password");
      return {
        isFirstLogin: true,
        teamMember: teamMember
      };
    }
    
    // If we have a stored password, verify it matches exactly
    if (storedPassword !== password) {
      console.log("Authentication failed: Password doesn't match");
      return {
        isFirstLogin: false
      };
    }
    
    // Password matches, authentication successful
    console.log("Authentication successful:", teamMember.name);
    
    // Save team member info in localStorage with all details
    localStorage.setItem('teamMemberId', teamMember.id);
    localStorage.setItem('teamMemberName', teamMember.name);
    localStorage.setItem('teamMemberRole', teamMember.role);
    localStorage.setItem('teamMemberRestaurantId', teamMember.restaurantId);
    localStorage.setItem('teamMemberIdentifier', normalizedIdentifier);
    
    // Log the name we're storing for debugging
    console.log("Storing team member name in localStorage:", teamMember.name);
    
    return {
      isFirstLogin: false,
      teamMember: teamMember
    };
  } catch (error) {
    console.error("Authentication error:", error);
    return {
      isFirstLogin: false
    };
  }
};
