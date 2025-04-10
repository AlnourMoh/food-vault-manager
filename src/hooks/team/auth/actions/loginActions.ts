
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
  
  const { setIsLoading, setLoginStep, setIsFirstLogin } = setters;

  // Get identifier based on the selected type
  const getIdentifier = () => {
    // Check if we have a stored identifier from setup
    const storedIdentifier = localStorage.getItem('teamMemberIdentifier');
    
    // Use stored identifier if available, otherwise use form values
    if (storedIdentifier) {
      return storedIdentifier;
    }
    
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
      
      // Check if this is the first login and user hasn't set up password yet
      if (authResult.isFirstLogin) {
        toast({
          title: "مستخدم جديد",
          description: "يجب إنشاء كلمة مرور للمتابعة"
        });
        
        // Move to setup password step for first-time users
        setIsFirstLogin(true);
        setLoginStep('setup');
        setIsLoading(false);
        return;
      }
      
      if (authResult.teamMember) {
        // Store the team member information in localStorage
        localStorage.setItem('teamMemberId', authResult.teamMember.id);
        localStorage.setItem('teamMemberName', authResult.teamMember.name);
        localStorage.setItem('teamMemberRole', authResult.teamMember.role);
        localStorage.setItem('teamMemberRestaurantId', authResult.teamMember.restaurantId);
        
        // Log the stored name for debugging
        console.log("Login successful, storing team member name:", authResult.teamMember.name);
        
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
    getIdentifier,
    handleLogin
  };
}
