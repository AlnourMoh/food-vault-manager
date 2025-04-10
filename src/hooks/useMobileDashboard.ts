
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { logoutTeamMember } from '@/services/teamAuthService';

export function useMobileDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Get the authenticated team member's name from localStorage
  // This was set during authentication in authenticateTeamMember function
  const teamMemberName = localStorage.getItem('teamMemberName') || 'فريق المخزن';

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
