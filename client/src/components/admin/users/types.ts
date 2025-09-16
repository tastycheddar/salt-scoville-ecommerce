


export interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  customer_type: string;
  wholesale_approved: boolean;
  loyalty_points: number;
  email_notifications: boolean;
  marketing_notifications: boolean;
  address: any;
  avatar_url: string;
  created_at: string;
  updated_at: string;
  role?: Database['public']['Enums']['admin_role'] | 'customer';
  is_wholesale_only?: boolean; // Flag for wholesale customers without auth accounts
}

export interface FilterState {
  search: string;
  role: string;
  customerType: string;
  wholesaleStatus: string;
  registrationDate: string;
  loyaltyPointsRange: string;
}

export type AdminRole = Database['public']['Enums']['admin_role'] | 'customer';
