
import { StorageTeamMember } from '@/types';
import { TeamMemberFormData } from '@/types/team';

export interface StorageTeamState {
  teamMembers: StorageTeamMember[];
  isLoading: boolean;
  lastAddedMember: TeamMemberFormData | null;
  phoneError: string | null;
  emailError: string | null;
  setIsLoading: (isLoading: boolean) => void;
  setTeamMembers: (members: StorageTeamMember[]) => void;
  setLastAddedMember: (member: TeamMemberFormData | null) => void;
  setPhoneError: (error: string | null) => void;
  setEmailError: (error: string | null) => void;
}

export interface StorageTeamActions {
  fetchTeamMembers: () => Promise<void>;
  addTeamMember: (memberData: TeamMemberFormData) => Promise<boolean>;
  updateTeamMember: (memberId: string, memberData: TeamMemberFormData) => Promise<boolean>;
  deleteTeamMember: (memberId: string) => Promise<void>;
  copyWelcomeMessage: (memberData: TeamMemberFormData | null) => Promise<void>;
  resetErrors: () => void;
}
