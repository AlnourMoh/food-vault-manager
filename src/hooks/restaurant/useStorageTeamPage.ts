
import { useState, useEffect } from 'react';
import { useStorageTeam } from '@/hooks/useStorageTeam';
import { StorageTeamMember } from '@/types';
import { TeamMemberFormData } from '@/types/team';

export const useStorageTeamPage = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedMember, setSelectedMember] = useState<StorageTeamMember | null>(null);
  
  // Get restaurantId from local storage
  const restaurantId = localStorage.getItem('restaurantId');
  
  // Initialize the team hooks
  const {
    teamMembers,
    isLoading,
    fetchTeamMembers,
    addTeamMember,
    updateTeamMember,
    deleteTeamMember,
    lastAddedMember,
    copyWelcomeMessage,
    phoneError,
    emailError,
    resetErrors
  } = useStorageTeam(restaurantId || undefined);

  // Fetch team members on component mount
  useEffect(() => {
    fetchTeamMembers();
  }, []);

  // Handle adding a new team member
  const handleAddMember = async (data: TeamMemberFormData) => {
    return await addTeamMember(data);
  };
  
  // Handle editing a team member
  const handleEditMember = (member: StorageTeamMember) => {
    setSelectedMember(member);
    setShowEditDialog(true);
  };

  // Handle updating a team member
  const handleUpdateMember = async (id: string, data: TeamMemberFormData) => {
    return await updateTeamMember(id, data);
  };

  // Handle deleting a team member
  const handleDeleteMember = (member: StorageTeamMember) => {
    setSelectedMember(member);
    setShowDeleteDialog(true);
  };

  // Handle confirming deletion
  const handleConfirmDelete = (id: string) => {
    return deleteTeamMember(id);
  };

  // Handle copying welcome message for existing member
  const handleCopyWelcomeMessageForMember = (member: StorageTeamMember) => {
    // Convert StorageTeamMember to TeamMemberFormData
    const memberData: TeamMemberFormData = {
      name: member.name,
      email: member.email,
      // Translate database role to UI role
      role: member.role === 'manager' ? 'إدارة النظام' : 'إدارة المخزن',
      phoneCountryCode: member.phone?.substring(1, 3) || '',
      phoneNumber: member.phone?.substring(3) || '',
    };
    
    copyWelcomeMessage(memberData);
  };

  // Generate welcome message for any team member
  const generateWelcomeMessageForMember = (member: StorageTeamMember) => {
    if (!member) return '';
    
    // Extract country code and phone number from full phone
    const phoneCountryCode = member.phone?.substring(1, 3) || '';
    const phoneNumber = member.phone?.substring(3) || '';
    
    // Create member data object
    const memberData: TeamMemberFormData = {
      name: member.name,
      email: member.email,
      // Translate database role to UI role
      role: member.role === 'manager' ? 'إدارة النظام' : 'إدارة المخزن',
      phoneCountryCode,
      phoneNumber,
    };
    
    return generateWelcomeMessage(memberData);
  };

  return {
    // State
    showAddDialog,
    setShowAddDialog,
    showEditDialog,
    setShowEditDialog,
    showDeleteDialog,
    setShowDeleteDialog,
    selectedMember,
    teamMembers,
    isLoading,
    lastAddedMember,
    phoneError,
    emailError,
    
    // Actions
    handleAddMember,
    handleEditMember,
    handleUpdateMember,
    handleDeleteMember,
    handleConfirmDelete,
    handleCopyWelcomeMessageForMember,
    generateWelcomeMessageForMember,
    resetErrors,
    copyWelcomeMessage
  };
};
