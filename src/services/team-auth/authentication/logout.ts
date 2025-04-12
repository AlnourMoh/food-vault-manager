
/**
 * Log out a team member by clearing localStorage
 */
export const logoutTeamMember = (): void => {
  // Clear all team member specific data
  localStorage.removeItem('teamMemberId');
  localStorage.removeItem('teamMemberName');
  localStorage.removeItem('teamMemberRole');
  localStorage.removeItem('teamMemberRestaurantId');
  localStorage.removeItem('teamMemberIdentifier');
  
  console.log("Team member logged out successfully");
};
