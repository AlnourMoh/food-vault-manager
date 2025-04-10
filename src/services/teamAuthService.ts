
// This file provides mock authentication services for team members
// In a real app, these would connect to your backend API

export interface TeamMember {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role: string;
  restaurantId: string;
}

/**
 * Login a team member using PIN
 * @deprecated Use authenticateTeamMember instead
 */
export const loginTeamMember = async (pin: string): Promise<boolean> => {
  // This is a mock implementation
  // In a real app, this would validate the PIN against your backend
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // For this demo, any pin with at least 4 characters works
  const success = pin.length >= 4;
  
  if (success) {
    // Store team member info in localStorage
    localStorage.setItem('teamMemberId', '123456');
    localStorage.setItem('teamMemberName', 'فريق المخزن');
  }
  
  return success;
};

/**
 * Check if a team member exists by email or phone
 */
export const checkTeamMemberExists = async (
  identifier: string
): Promise<{ exists: boolean; isFirstLogin: boolean }> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  console.log("Checking identifier:", identifier);
  
  // تطبيع المُعرف (تحويل إلى حروف صغيرة وإزالة المسافات)
  const normalizedIdentifier = identifier.replace(/\s+/g, '').toLowerCase();
  
  // في الوضع التجريبي، سنجعل التطبيق أكثر مرونة للاختبار
  
  // أي بريد إلكتروني يحتوي على "test" أو "demo" أو "admin"
  if (
    normalizedIdentifier.includes('test') || 
    normalizedIdentifier.includes('demo') || 
    normalizedIdentifier.includes('admin') ||
    normalizedIdentifier === "jhjh@gmail.com" ||
    normalizedIdentifier === "zxc@gmail.com"
  ) {
    return {
      exists: true,
      isFirstLogin: normalizedIdentifier.includes('demo') || normalizedIdentifier.includes('test')
    };
  }
  
  // أي رقم هاتف يبدأ بـ "+974" أو "974" أو ينتهي بـ "1111111"
  if (
    normalizedIdentifier.startsWith('+974') || 
    normalizedIdentifier.startsWith('974') ||
    normalizedIdentifier.endsWith('1111111') ||
    normalizedIdentifier.includes('123') ||
    normalizedIdentifier.includes('456')
  ) {
    return {
      exists: true,
      isFirstLogin: true
    };
  }
  
  // المعرفات الخاصة بالمستخدمين الموجودين بالفعل
  if (
    normalizedIdentifier === "demo@example.com" || 
    normalizedIdentifier.includes("0501234567") ||
    normalizedIdentifier.includes("501234567") ||
    normalizedIdentifier.endsWith("1234567")
  ) {
    return {
      exists: true,
      isFirstLogin: true
    };
  }
  
  // المستخدمين الذين قاموا بتسجيل الدخول من قبل
  if (
    normalizedIdentifier === "admin@example.com" || 
    normalizedIdentifier.includes("0509876543") ||
    normalizedIdentifier.includes("509876543") ||
    normalizedIdentifier.endsWith("9876543")
  ) {
    return {
      exists: true,
      isFirstLogin: false
    };
  }
  
  // For demo, any other identifier doesn't exist
  return {
    exists: false,
    isFirstLogin: false
  };
};

/**
 * Authenticate a team member by email/phone and password
 */
export const authenticateTeamMember = async (
  identifier: string, 
  password: string
): Promise<{ isFirstLogin: boolean; teamMember?: TeamMember }> => {
  // This is a mock implementation
  // In a real app, this would call your backend API
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const normalizedIdentifier = identifier.replace(/\s+/g, '').toLowerCase();
  
  // للتطبيق التجريبي، سنقبل أي معرف تم اكتشافه كموجود في الخطوة السابقة
  const checkResult = await checkTeamMemberExists(identifier);
  
  if (checkResult.exists && !checkResult.isFirstLogin) {
    if (password.length < 6) {
      return {
        isFirstLogin: false,
      };
    }
    
    const mockTeamMember: TeamMember = {
      id: "12345",
      name: "أحمد محمد",
      email: normalizedIdentifier.includes('@') ? normalizedIdentifier : undefined,
      phone: !normalizedIdentifier.includes('@') ? normalizedIdentifier : undefined,
      role: "inventory_manager",
      restaurantId: localStorage.getItem('restaurantId') || "1"
    };
    
    // حفظ معلومات عضو الفريق في localStorage
    localStorage.setItem('teamMemberId', mockTeamMember.id);
    localStorage.setItem('teamMemberName', mockTeamMember.name);
    
    return {
      isFirstLogin: false,
      teamMember: mockTeamMember
    };
  }
  
  return {
    isFirstLogin: false,
  };
};

/**
 * Set up first-time password for a team member
 */
export const setupTeamMemberPassword = async (
  identifier: string,
  password: string
): Promise<TeamMember> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const normalizedIdentifier = identifier.replace(/\s+/g, '').toLowerCase();
  
  // Return mock team member
  const mockTeamMember: TeamMember = {
    id: "12345",
    name: "أحمد محمد",
    email: normalizedIdentifier.includes('@') ? normalizedIdentifier : undefined,
    phone: !normalizedIdentifier.includes('@') ? normalizedIdentifier : undefined,
    role: "inventory_manager",
    restaurantId: localStorage.getItem('restaurantId') || "1"
  };
  
  // Save team member info in localStorage
  localStorage.setItem('teamMemberId', mockTeamMember.id);
  localStorage.setItem('teamMemberName', mockTeamMember.name);
  
  return mockTeamMember;
};

/**
 * Log out the current team member
 */
export const logoutTeamMember = (): void => {
  localStorage.removeItem('teamMemberId');
  localStorage.removeItem('teamMemberName');
};
