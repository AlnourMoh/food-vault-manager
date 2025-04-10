
// Types for team authentication service
export interface TeamMember {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role: string;
  restaurantId: string;
}

export interface CheckIdentifierResult {
  exists: boolean;
  isFirstLogin: boolean;
  hasSetupPassword?: boolean;
  teamMemberId?: string;
}

export interface AuthenticateResult {
  success: boolean;
  message: string;
  isFirstLogin?: boolean;
  needsPasswordSetup?: boolean;
  teamMemberId?: string;
  teamMember?: TeamMember;
}
