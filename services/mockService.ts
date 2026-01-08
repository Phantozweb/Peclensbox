import { AppSettings, Customer } from '../types.ts';

export const INITIAL_SETTINGS: AppSettings = {
  companyName: "LensBox",
  logoUrl: "", 
  staffMembers: ["Dr. Preethika", "Staff"], // Basic defaults
  whatsappTemplate: "Hello {name}, this is from LensBox. We hope you are enjoying your new lenses! Delivered on {date}. Please let us know if you have any issues."
};

export const INITIAL_CUSTOMERS: Customer[] = [];