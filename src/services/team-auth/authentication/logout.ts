
/**
 * Log out the current team member
 */
export const logoutTeamMember = (): void => {
  localStorage.removeItem('teamMemberId');
  localStorage.removeItem('teamMemberName');
  localStorage.removeItem('teamMemberIdentifier');
  // Do NOT remove the passwordSetup flag or user password, as we need to remember this between sessions
};
