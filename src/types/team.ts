
export interface TeamMemberFormData {
  name: string;
  role: string;
  phoneCountryCode: string;
  phoneNumber: string;
  email: string;
}

export type TeamMemberRole = "إدارة النظام" | "إدارة المخزن";
