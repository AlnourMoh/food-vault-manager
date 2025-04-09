
import { StorageTeamMember } from '@/types';

export const formatMemberInfoForCopy = (member: StorageTeamMember): string => {
  return `الاسم: ${member.name}
الدور: ${member.role === 'manager' ? 'إدارة النظام' : 'إدارة المخزن'}
رقم الهاتف: ${member.phone}
البريد الإلكتروني: ${member.email}`;
};
