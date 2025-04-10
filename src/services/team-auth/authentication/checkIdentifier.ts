
import { CheckIdentifierResult } from '../types';
import { mockTeamMembers, mockPhoneUsers } from '../mockData';
import { 
  normalizeIdentifier, 
  isValidTestEmail, 
  isValidTestPhone, 
  isEmailIdentifier 
} from '../identifierUtils';
import { getTeamMemberIdFromIdentifier } from './teamMemberUtils';

/**
 * Check if a team member exists by email or phone
 */
export const checkTeamMemberExists = async (
  identifier: string
): Promise<CheckIdentifierResult> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  console.log("Checking identifier:", identifier);
  
  const normalizedIdentifier = normalizeIdentifier(identifier);
  
  // Get the team member ID associated with this identifier
  const teamMemberId = getTeamMemberIdFromIdentifier(normalizedIdentifier);
  
  // Check if user has previously set up a password (using team member ID for consistency)
  const hasSetupPassword = teamMemberId ? 
    localStorage.getItem(`passwordSetup:${teamMemberId}`) === 'true' : false;
  
  if (isEmailIdentifier(normalizedIdentifier)) {
    // Check email patterns
    if (isValidTestEmail(normalizedIdentifier)) {
      const isFirstLogin = normalizedIdentifier.includes('demo') || 
                          normalizedIdentifier.includes('test');
      
      return {
        exists: true,
        isFirstLogin,
        hasSetupPassword: hasSetupPassword,
        teamMemberId
      };
    }
  } else {
    // Check phone patterns
    if (isValidTestPhone(normalizedIdentifier)) {
      return {
        exists: true,
        isFirstLogin: true,
        hasSetupPassword: hasSetupPassword,
        teamMemberId
      };
    }
  }
  
  // Default response for non-matching identifiers
  return {
    exists: false,
    isFirstLogin: false,
    hasSetupPassword: false
  };
};
