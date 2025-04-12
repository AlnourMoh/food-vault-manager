
export { checkTeamMemberExists } from './checkIdentifier';
export { authenticateTeamMember } from './authenticate';
export { setupTeamMemberPassword } from './setupPassword';
export { logoutTeamMember } from './logout';
export { loginTeamMember } from './legacyLogin';

// Also export the team member utilities for potential reuse
export { getTeamMemberIdFromIdentifier, createMockTeamMember } from './teamMemberUtils';
