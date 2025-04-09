
import { supabase } from '@/integrations/supabase/client';
import { StorageTeamMember } from '@/types';

export const fetchTeamMembersApi = async (restaurantId: string) => {
  const { data, error } = await supabase
    .from('company_members')
    .select('*')
    .eq('company_id', restaurantId)
    .order('created_at', { ascending: false });
  
  if (error) {
    throw error;
  }
  
  return data.map(member => ({
    id: member.id,
    name: member.name,
    role: member.role === 'admin' ? 'manager' : 'team_member' as 'manager' | 'team_member',
    phone: member.phone || '',
    email: member.email,
    restaurantId: member.company_id,
    restaurantName: '',
    joinDate: new Date(member.created_at),
    isActive: member.is_active
  }));
};

export const checkMemberDuplicatesApi = async (restaurantId: string, phone: string, email: string) => {
  // التحقق من وجود رقم هاتف مكرر في نفس المطعم
  const { data: phoneData, error: phoneError } = await supabase
    .from('company_members')
    .select('id, phone')
    .eq('company_id', restaurantId)
    .eq('phone', phone);
  
  if (phoneError) {
    throw phoneError;
  }
  
  // التحقق من وجود بريد إلكتروني مكرر في نفس المطعم
  const { data: emailData, error: emailError } = await supabase
    .from('company_members')
    .select('id, email')
    .eq('company_id', restaurantId)
    .eq('email', email);
  
  if (emailError) {
    throw emailError;
  }
  
  return {
    isPhoneDuplicate: phoneData && phoneData.length > 0,
    isEmailDuplicate: emailData && emailData.length > 0
  };
};

export const addTeamMemberApi = async (restaurantId: string, memberData: {
  name: string;
  role: string;
  phoneCountryCode: string;
  phoneNumber: string;
  email: string;
}) => {
  const formattedPhone = `+${memberData.phoneCountryCode}${memberData.phoneNumber}`;
  
  // تحقق من التكرار قبل محاولة الإضافة
  const duplicates = await checkMemberDuplicatesApi(restaurantId, formattedPhone, memberData.email);
  
  if (duplicates.isPhoneDuplicate) {
    throw new Error('رقم الهاتف مستخدم بالفعل لعضو آخر في نفس المطعم');
  }
  
  if (duplicates.isEmailDuplicate) {
    throw new Error('البريد الإلكتروني مستخدم بالفعل لعضو آخر في نفس المطعم');
  }
  
  // Map frontend role to database role (admin or staff)
  const dbRole = memberData.role === 'إدارة النظام' ? 'admin' : 'staff';
  
  const { data, error } = await supabase
    .from('company_members')
    .insert([
      {
        company_id: restaurantId,
        name: memberData.name,
        role: dbRole,
        phone: formattedPhone,
        email: memberData.email,
        is_active: true,
        user_id: crypto.randomUUID()
      }
    ])
    .select();
  
  if (error) {
    // إذا كان هناك خطأ متعلق بالقيود الفريدة في قاعدة البيانات
    if (error.code === '23505') {
      if (error.message.includes('phone')) {
        throw new Error('رقم الهاتف مستخدم بالفعل لعضو آخر');
      } else if (error.message.includes('email')) {
        throw new Error('البريد الإلكتروني مستخدم بالفعل لعضو آخر');
      }
    }
    throw error;
  }
  
  return data;
};

export const updateTeamMemberApi = async (
  restaurantId: string,
  memberId: string,
  memberData: {
    name: string;
    role: string;
    phoneCountryCode: string;
    phoneNumber: string;
    email: string;
  }
) => {
  const formattedPhone = `+${memberData.phoneCountryCode}${memberData.phoneNumber}`;
  
  // تحقق من عدم وجود تكرار في رقم الهاتف أو البريد الإلكتروني باستثناء العضو الحالي
  const { data: phoneData, error: phoneError } = await supabase
    .from('company_members')
    .select('id, phone')
    .eq('company_id', restaurantId)
    .eq('phone', formattedPhone)
    .neq('id', memberId);
  
  if (phoneError) {
    throw phoneError;
  }
  
  if (phoneData && phoneData.length > 0) {
    throw new Error('رقم الهاتف مستخدم بالفعل لعضو آخر في نفس المطعم');
  }
  
  const { data: emailData, error: emailError } = await supabase
    .from('company_members')
    .select('id, email')
    .eq('company_id', restaurantId)
    .eq('email', memberData.email)
    .neq('id', memberId);
  
  if (emailError) {
    throw emailError;
  }
  
  if (emailData && emailData.length > 0) {
    throw new Error('البريد الإلكتروني مستخدم بالفعل لعضو آخر في نفس المطعم');
  }
  
  // Map frontend role to database role (admin or staff)
  const dbRole = memberData.role === 'إدارة النظام' ? 'admin' : 'staff';
  
  const { error } = await supabase
    .from('company_members')
    .update({
      name: memberData.name,
      role: dbRole,
      phone: formattedPhone,
      email: memberData.email,
    })
    .eq('id', memberId)
    .eq('company_id', restaurantId);
  
  if (error) {
    // إذا كان هناك خطأ متعلق بالقيود الفريدة في قاعدة البيانات
    if (error.code === '23505') {
      if (error.message.includes('phone')) {
        throw new Error('رقم الهاتف مستخدم بالفعل لعضو آخر');
      } else if (error.message.includes('email')) {
        throw new Error('البريد الإلكتروني مستخدم بالفعل لعضو آخر');
      }
    }
    throw error;
  }
};

export const deleteTeamMemberApi = async (restaurantId: string, memberId: string) => {
  const { error } = await supabase
    .from('company_members')
    .delete()
    .eq('id', memberId)
    .eq('company_id', restaurantId);
  
  if (error) {
    throw error;
  }
};
