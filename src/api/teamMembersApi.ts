
import { supabase } from '@/integrations/supabase/client';
import { StorageTeamMember } from '@/types';

export const fetchTeamMembersApi = async (restaurantId: string) => {
  console.log('Fetching team members for restaurant ID:', restaurantId);
  
  const { data, error } = await supabase
    .from('company_members')
    .select('*')
    .eq('company_id', restaurantId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Supabase error fetching team members:', error);
    throw error;
  }
  
  console.log('Raw team members data from Supabase:', data);
  
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
  console.log('Checking for duplicates:', { restaurantId, phone, email });
  
  // التحقق من وجود رقم هاتف مكرر في نفس المطعم
  const { data: phoneData, error: phoneError } = await supabase
    .from('company_members')
    .select('id, phone')
    .eq('company_id', restaurantId)
    .eq('phone', phone);
  
  if (phoneError) {
    console.error('Supabase error checking phone duplicates:', phoneError);
    throw phoneError;
  }
  
  // التحقق من وجود بريد إلكتروني مكرر في نفس المطعم
  const { data: emailData, error: emailError } = await supabase
    .from('company_members')
    .select('id, email')
    .eq('company_id', restaurantId)
    .eq('email', email);
  
  if (emailError) {
    console.error('Supabase error checking email duplicates:', emailError);
    throw emailError;
  }
  
  const result = {
    isPhoneDuplicate: phoneData && phoneData.length > 0,
    isEmailDuplicate: emailData && emailData.length > 0
  };
  
  console.log('Duplicate check result:', result);
  
  return result;
};

export const addTeamMemberApi = async (restaurantId: string, memberData: {
  name: string;
  role: string;
  phoneCountryCode: string;
  phoneNumber: string;
  email: string;
}) => {
  const formattedPhone = `+${memberData.phoneCountryCode}${memberData.phoneNumber}`;
  console.log('Adding team member:', { restaurantId, memberData, formattedPhone });
  
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
  
  const memberToInsert = {
    company_id: restaurantId,
    name: memberData.name,
    role: dbRole as 'admin' | 'staff',  // Fix: Type assertion to match the expected enum type
    phone: formattedPhone,
    email: memberData.email,
    is_active: true,
    user_id: crypto.randomUUID()
  };
  
  console.log('Inserting member into database:', memberToInsert);
  
  const { data, error } = await supabase
    .from('company_members')
    .insert([memberToInsert])
    .select();
  
  if (error) {
    console.error('Supabase error adding team member:', error);
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
  
  console.log('Successfully added team member:', data);
  
  // إضافة بيانات العضو إلى جدول company_profiles لتمكين تسجيل الدخول
  await storeUserProfileApi(restaurantId, memberData.email);
  
  return data;
};

export const storeUserProfileApi = async (restaurantId: string, email: string) => {
  try {
    // التحقق مما إذا كان البريد الإلكتروني موجود بالفعل في جدول restaurant_access
    const { data: existingAccess, error: checkError } = await supabase
      .from('restaurant_access')
      .select('*')
      .eq('email', email)
      .maybeSingle();
    
    if (checkError) {
      console.error('Error checking restaurant_access table:', checkError);
      return;
    }
    
    // إذا كان البريد غير موجود، قم بإضافته إلى جدول restaurant_access
    if (!existingAccess) {
      const { error: insertError } = await supabase
        .from('restaurant_access')
        .insert({
          restaurant_id: restaurantId,
          email: email,
          password_hash: 'temporary_password' // سيتم تحديثه عندما يعين المستخدم كلمة المرور
        });
        
      if (insertError) {
        console.error('Error storing user profile in restaurant_access:', insertError);
      } else {
        console.log('Successfully stored user profile in restaurant_access');
      }
    }
  } catch (error) {
    console.error('Error in storeUserProfileApi:', error);
  }
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
  console.log('Updating team member:', { restaurantId, memberId, memberData, formattedPhone });
  
  // تحقق من عدم وجود تكرار في رقم الهاتف أو البريد الإلكتروني باستثناء العضو الحالي
  const { data: phoneData, error: phoneError } = await supabase
    .from('company_members')
    .select('id, phone')
    .eq('company_id', restaurantId)
    .eq('phone', formattedPhone)
    .neq('id', memberId);
  
  if (phoneError) {
    console.error('Supabase error checking phone conflicts during update:', phoneError);
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
    console.error('Supabase error checking email conflicts during update:', emailError);
    throw emailError;
  }
  
  if (emailData && emailData.length > 0) {
    throw new Error('البريد الإلكتروني مستخدم بالفعل لعضو آخر في نفس المطعم');
  }
  
  // Map frontend role to database role (admin or staff)
  const dbRole = memberData.role === 'إدارة النظام' ? 'admin' : 'staff';
  
  const memberToUpdate = {
    name: memberData.name,
    role: dbRole as 'admin' | 'staff',  // Fix: Type assertion to match the expected enum type
    phone: formattedPhone,
    email: memberData.email,
  };
  
  console.log('Updating member in database:', memberToUpdate);
  
  const { error } = await supabase
    .from('company_members')
    .update(memberToUpdate)
    .eq('id', memberId)
    .eq('company_id', restaurantId);
  
  if (error) {
    console.error('Supabase error updating team member:', error);
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
  
  console.log('Successfully updated team member');
  
  // تحديث بيانات المستخدم في جدول restaurant_access
  await updateUserProfileApi(restaurantId, memberData.email);
};

export const updateUserProfileApi = async (restaurantId: string, email: string) => {
  try {
    // التحقق مما إذا كان البريد الإلكتروني موجود بالفعل في جدول restaurant_access
    const { data: existingAccess, error: checkError } = await supabase
      .from('restaurant_access')
      .select('*')
      .eq('email', email)
      .maybeSingle();
    
    if (checkError) {
      console.error('Error checking restaurant_access table:', checkError);
      return;
    }
    
    // إذا كان البريد غير موجود، قم بإضافته إلى جدول restaurant_access
    if (!existingAccess) {
      const { error: insertError } = await supabase
        .from('restaurant_access')
        .insert([{
          restaurant_id: restaurantId,
          email: email,
          password_hash: 'temporary_password' // سيتم تحديثه عندما يعين المستخدم كلمة المرور
        }]);
        
      if (insertError) {
        console.error('Error storing user profile in restaurant_access:', insertError);
      } else {
        console.log('Successfully stored user profile in restaurant_access');
      }
    }
  } catch (error) {
    console.error('Error in updateUserProfileApi:', error);
  }
};

export const deleteTeamMemberApi = async (restaurantId: string, memberId: string) => {
  console.log('Deleting team member:', { restaurantId, memberId });
  
  // أولاً نحصل على بيانات العضو لمعرفة البريد الإلكتروني
  const { data: memberData, error: fetchError } = await supabase
    .from('company_members')
    .select('email')
    .eq('id', memberId)
    .eq('company_id', restaurantId)
    .single();
  
  if (fetchError) {
    console.error('Error fetching member data for deletion:', fetchError);
    throw fetchError;
  }
  
  // حذف العضو من جدول company_members
  const { error: deleteError } = await supabase
    .from('company_members')
    .delete()
    .eq('id', memberId)
    .eq('company_id', restaurantId);
  
  if (deleteError) {
    console.error('Error deleting team member:', deleteError);
    throw deleteError;
  }
  
  console.log('Successfully deleted team member');
  
  // حذف سجل الوصول من جدول restaurant_access إذا كان البريد الإلكتروني متوفرًا
  if (memberData && memberData.email) {
    try {
      const { error: accessDeleteError } = await supabase
        .from('restaurant_access')
        .delete()
        .eq('email', memberData.email);
      
      if (accessDeleteError) {
        console.error('Error removing access record:', accessDeleteError);
      } else {
        console.log('Successfully removed access record');
      }
    } catch (error) {
      console.error('Error in access removal process:', error);
    }
  }
};
