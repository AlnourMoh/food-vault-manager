
import { useState } from 'react';
import { StorageTeamMember } from '@/types';
import { TeamMemberFormData } from '@/types/team';
import { StorageTeamState } from './types';

export const useTeamState = (): StorageTeamState => {
  const [isLoading, setIsLoading] = useState(false);
  const [teamMembers, setTeamMembers] = useState<StorageTeamMember[]>([]);
  const [lastAddedMember, setLastAddedMember] = useState<TeamMemberFormData | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  return {
    isLoading,
    teamMembers,
    lastAddedMember,
    phoneError,
    emailError,
    setIsLoading,
    setTeamMembers,
    setLastAddedMember,
    setPhoneError,
    setEmailError,
  };
};
