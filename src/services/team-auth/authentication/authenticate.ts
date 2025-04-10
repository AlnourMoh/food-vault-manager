
import { TeamMember, AuthenticateResult } from '../types';
import { normalizeIdentifier } from '../identifierUtils';
import { fetchTeamMemberByIdentifier } from './fetchTeamMember';

/**
 * Authenticate a team member with a password
 */
export const authenticateTeamMember = async (
  identifier: string,
  password: string
): Promise<AuthenticateResult> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  console.log("Authenticating with identifier:", identifier);
  
  const normalizedIdentifier = normalizeIdentifier(identifier);
  
  try {
    // Fetch the team member from the database
    const teamMember = await fetchTeamMemberByIdentifier(normalizedIdentifier);
    
    if (!teamMember) {
      console.error("No team member found with this identifier");
      return { success: false, message: "بيانات تسجيل الدخول غير صحيحة" };
    }
    
    // Check if password is set up for this user
    const passwordSetup = localStorage.getItem(`passwordSetup:${teamMember.id}`);
    if (passwordSetup !== 'true') {
      console.error("Password not set up for this user");
      return { 
        success: false, 
        message: "لم يتم تعيين كلمة مرور لهذا المستخدم، يرجى إعداد كلمة المرور",
        needsPasswordSetup: true,
        teamMemberId: teamMember.id 
      };
    }
    
    // Get the stored password for this user
    const storedPassword = localStorage.getItem(`userPassword:${teamMember.id}`);
    
    if (password !== storedPassword) {
      console.error("Password mismatch");
      return { success: false, message: "كلمة المرور غير صحيحة" };
    }
    
    // Store team member info in localStorage
    localStorage.setItem('teamMemberId', teamMember.id);
    localStorage.setItem('teamMemberName', teamMember.name);
    localStorage.setItem('teamMemberIdentifier', normalizedIdentifier);
    localStorage.setItem('restaurantId', teamMember.restaurantId);
    localStorage.setItem('teamMemberRole', teamMember.role);
    
    console.log("Authentication successful for:", teamMember.name);
    
    return { 
      success: true, 
      message: "تم تسجيل الدخول بنجاح",
      teamMember 
    };
  } catch (error) {
    console.error("Error during authentication:", error);
    return { success: false, message: "حدث خطأ أثناء تسجيل الدخول" };
  }
};
