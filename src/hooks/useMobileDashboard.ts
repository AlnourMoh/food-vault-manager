
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { logoutTeamMember } from '@/services/teamAuthService';
import { createMockTeamMember } from '@/services/team-auth/authentication/teamMemberUtils';

export function useMobileDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [teamMemberName, setTeamMemberName] = useState<string>('فريق المخزن');
  
  useEffect(() => {
    // Get the authenticated team member's information
    const storedName = localStorage.getItem('teamMemberName');
    const identifier = localStorage.getItem('teamMemberIdentifier');
    
    // If we have a stored name, use it
    if (storedName) {
      console.log("Found stored team member name:", storedName);
      setTeamMemberName(storedName);
    } 
    // If we have an identifier but no name, try to get the name from the mock data
    else if (identifier) {
      console.log("No stored name, but found identifier:", identifier);
      const teamMember = createMockTeamMember(identifier);
      if (teamMember) {
        console.log("Created mock team member:", teamMember.name);
        setTeamMemberName(teamMember.name);
        // Store it for future use
        localStorage.setItem('teamMemberName', teamMember.name);
      }
    }
  }, []);

  const handleLogout = () => {
    logoutTeamMember();
    toast({
      title: "تم تسجيل الخروج",
      description: "تم تسجيل الخروج بنجاح"
    });
    navigate('/restaurant/mobile/login');
  };

  return {
    teamMemberName,
    handleLogout
  };
}
