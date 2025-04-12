
import { useNavigate } from 'react-router-dom'; 
import { useToast } from '@/hooks/use-toast';
import { checkTeamMemberExists } from '@/services/teamAuthService';
import { TeamAuthState, TeamAuthSetters } from '../types';

export function useCheckIdentifierActions(
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
    phoneCountryCode
  } = state;
  
  const {
    setIsLoading,
    setLoginStep,
    setIsFirstLogin
  } = setters;

  // Get identifier based on the selected type
  const getIdentifier = () => {
    return identifierType === 'email' ? email : `+${phoneCountryCode}${phoneNumber}`;
  };

  const handleCheckIdentifier = async () => {
    const identifier = getIdentifier();
    
    if (identifierType === 'email' && !email.trim()) {
      toast({
        title: "يرجى إدخال البريد الإلكتروني",
        variant: "destructive"
      });
      return;
    }
    
    if (identifierType === 'phone' && !phoneNumber.trim()) {
      toast({
        title: "يرجى إدخال رقم الهاتف",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      console.log(`Checking identifier: ${identifier}, Type: ${identifierType}`);
      const result = await checkTeamMemberExists(identifier);
      console.log("Check result:", result);
      
      if (!result.exists) {
        toast({
          title: "لم يتم العثور على هذا المستخدم",
          description: "يرجى التحقق من البريد الإلكتروني أو رقم الهاتف المدخل",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }
      
      // Store the identifier for future use
      localStorage.setItem('teamMemberIdentifier', identifier);
      
      // User exists, determine if they need to set up password
      if (result.isFirstLogin && !result.hasSetupPassword) {
        toast({
          title: "مستخدم جديد",
          description: "يجب إنشاء كلمة مرور للمتابعة"
        });
        setIsFirstLogin(true);
        setLoginStep('setup');
      } else {
        toast({
          title: "مستخدم موجود",
          description: "يرجى إدخال كلمة المرور للمتابعة"
        });
        setLoginStep('password');
      }
      
    } catch (error) {
      console.error("Check identifier error:", error);
      toast({
        title: "حدث خطأ",
        description: "يرجى المحاولة مرة أخرى",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    getIdentifier,
    handleCheckIdentifier
  };
}
