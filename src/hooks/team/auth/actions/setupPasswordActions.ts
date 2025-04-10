
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { setupTeamMemberPassword } from '@/services/teamAuthService';
import { TeamAuthState, TeamAuthSetters } from '../types';

export function useSetupPasswordActions(
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
    password,
    confirmPassword
  } = state;
  
  const { 
    setIsLoading, 
    setLoginStep,
    setPassword,
    setConfirmPassword
  } = setters;

  // Get identifier based on the selected type
  const getIdentifier = () => {
    return identifierType === 'email' ? email : `+${phoneCountryCode}${phoneNumber}`;
  };

  const handleSetupPassword = async () => {
    const identifier = getIdentifier();

    if (!password.trim()) {
      toast({
        title: "يرجى إدخال كلمة المرور",
        variant: "destructive"
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: "كلمات المرور غير متطابقة",
        variant: "destructive"
      });
      return;
    }
    
    if (password.length < 6) {
      toast({
        title: "يجب أن تتكون كلمة المرور من 6 أحرف على الأقل",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const teamMember = await setupTeamMemberPassword(identifier, password);
      
      if (!teamMember) {
        toast({
          title: "حدث خطأ",
          description: "لم يتم العثور على معلومات المستخدم",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }
      
      toast({
        title: "تم إنشاء كلمة المرور بنجاح",
        description: `مرحباً بك ${teamMember.name}`
      });
      
      // After successful password setup, log the user in automatically
      localStorage.setItem('teamMemberId', teamMember.id);
      localStorage.setItem('teamMemberName', teamMember.name);
      localStorage.setItem('teamMemberRole', teamMember.role);
      localStorage.setItem('teamMemberRestaurantId', teamMember.restaurantId);
      
      // Navigate to the dashboard directly
      navigate('/restaurant/mobile');
      
    } catch (error) {
      toast({
        title: "حدث خطأ",
        description: "يرجى المحاولة مرة أخرى",
        variant: "destructive"
      });
      console.error("Setup password error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleSetupPassword
  };
}
