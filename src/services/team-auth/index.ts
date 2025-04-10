
export {
  checkTeamMemberExists,
  authenticateTeamMember,
  setupTeamMemberPassword,
  logoutTeamMember,
  loginTeamMember
} from './authService';

export type { TeamMember, CheckIdentifierResult, AuthenticateResult } from './types';

// Export utility functions for convenience
export {
  normalizeIdentifier,
  isEmailIdentifier,
  isValidTestEmail,
  isValidTestPhone
} from './identifierUtils';

// Export mock data for testing and development
export { mockTeamMembers, mockPhoneUsers, validEmailPatterns, validPhonePatterns } from './mockData';
