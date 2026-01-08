export enum UserRole {
  ADMIN = 'ADMIN',
  STAFF = 'STAFF'
}

export interface User {
  email: string;
  name: string;
  role: UserRole;
}

export interface Customer {
  id: string;
  sNo: number;
  dateOfDelivery: string;
  customerName: string;
  phoneNumber: string;
  calledBy: string; // The staff member name
  callStatus: 'Called' | 'Not Called' | 'Pending Follow-up';
  salesComment: string;
  isApproved: boolean; // Admin approval status
}

export interface AppSettings {
  companyName: string;
  logoUrl: string; // Placeholder for logo
  staffMembers: string[];
  whatsappTemplate: string;
}

export const ADMIN_EMAIL = 'preethikaeyecare@gmail.com';
export const STAFF_EMAIL = 'eyecarepreethika@gmail.com';
