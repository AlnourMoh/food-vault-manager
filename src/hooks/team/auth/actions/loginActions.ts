
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { authenticateTeamMember } from '@/services/teamAuthService';
import { TeamAuthState, TeamAuthSetters } from '../types';

export function useLoginActions(
  state: TeamAuthState,
  setters: TeamAuthSetters
) {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Extract state and setters for easier use
  const {
    identifierType,
    email,
    phoneNumber,
    phoneCountryCode,
    password
  } = state;
  
  const { setIsLoading } = setters;

  // Get identifier based on the selected type
  const getIdentifier = () => {
    return identifierType === 'email' ? email : `+${phoneCountryCode}${phoneNumber}`;
  };

  const handleLogin = async () => {
    const identifier = getIdentifier();

    if (!password.trim()) {
      toast({
        title: "يرجى إدخال كلمة المرور",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const authResult = await authenticateTeamMember(identifier, password);
      
      if (authResult.teamMember) {
        // Successfully authenticated
        toast({
          title: "تم تسجيل الدخول بنجاح",
          description: `مرحباً بك ${authResult.teamMember.name}`
        });
        navigate('/restaurant/mobile');
      } else {
        // Authentication failed
        toast({
          title: "فشل تسجيل الدخول",
          description: "كلمة المرور غير صحيحة",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "حدث خطأ",
        description: "يرجى المحاولة مرة أخرى",
        variant: "destructive"
      });
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleLogin
  };
}
