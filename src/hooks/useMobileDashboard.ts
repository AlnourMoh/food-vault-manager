
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { logoutTeamMember } from '@/services/teamAuthService';
import { fetchTeamMemberByIdentifier } from '@/services/team-auth/authentication/fetchTeamMember';

export function useMobileDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [teamMemberName, setTeamMemberName] = useState<string>('');
  
  useEffect(() => {
    const fetchMemberData = async () => {
      // Get the authenticated team member's information
      const storedName = localStorage.getItem('teamMemberName');
      const identifier = localStorage.getItem('teamMemberIdentifier');
      
      // If we have a stored name, use it
      if (storedName) {
        console.log("Found stored team member name:", storedName);
        setTeamMemberName(storedName);
        return;
      } 
      
      // If we have an identifier but no name, try to fetch from database
      if (identifier) {
        console.log("No stored name, but found identifier:", identifier);
        try {
          const teamMember = await fetchTeamMemberByIdentifier(identifier);
          if (teamMember) {
            console.log("Fetched team member from database:", teamMember.name);
            setTeamMemberName(teamMember.name);
            // Store it for future use
            localStorage.setItem('teamMemberName', teamMember.name);
          } else {
            // Fallback to default name if member not found
            setTeamMemberName('فريق المخزن');
          }
        } catch (error) {
          console.error("Error fetching team member:", error);
          setTeamMemberName('فريق المخزن');
        }
      } else {
        // Default name if no identifier is found
        setTeamMemberName('فريق المخزن');
      }
    };
    
    fetchMemberData();
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
