
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { 
  checkTeamMemberExists, 
  authenticateTeamMember, 
  setupTeamMemberPassword 
} from '@/services/teamAuthService';
import { TeamAuthState, TeamAuthSetters, TeamAuthActions } from './types';

export function useTeamAuthActions(
  state: TeamAuthState,
  setters: TeamAuthSetters
): TeamAuthActions {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Extract state and setters for easier use
  const {
    identifierType,
    email,
    phoneNumber,
    phoneCountryCode,
    password,
    confirmPassword,
    isFirstLogin
  } = state;
  
  const {
    setIsLoading,
    setLoginStep,
    setIsFirstLogin
  } = setters;

  // الحصول على المعرف بناءً على النوع المحدد
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
      
      // User exists, determine if they need to set up password
      if (result.isFirstLogin) {
        setIsFirstLogin(true);
        setLoginStep('setup');
      } else {
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
      
      toast({
        title: "تم إنشاء كلمة المرور بنجاح",
        description: `مرحباً بك ${teamMember.name}`
      });
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

  const togglePasswordVisibility = () => {
    setters.setShowPassword(!state.showPassword);
  };

  const goBackToIdentifier = () => {
    setLoginStep('identifier');
    setters.setPassword('');
    setters.setConfirmPassword('');
  };

  return {
    getIdentifier,
    handleCheckIdentifier,
    handleLogin,
    handleSetupPassword,
    togglePasswordVisibility,
    goBackToIdentifier
  };
}
