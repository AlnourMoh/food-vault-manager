
// Re-export the team auth service from the new structure
// This file is kept for backward compatibility
export {
  checkTeamMemberExists,
  authenticateTeamMember,
  setupTeamMemberPassword,
  logoutTeamMember,
  loginTeamMember,
  type TeamMember
} from './team-auth';
