
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  UserCheck,
  Utensils,
  FileText,
  Upload,
  Settings,
  BarChart3,
  Shield,
  CreditCard,
  MessageSquare,
  Activity,
  AlertTriangle,
  Mail,
  MapPin,
  Percent,
  Eye,
  ScrollText,
  Search,
  Brain,
} from 'lucide-react';

export interface AdminMenuItem {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  children?: AdminMenuItem[];
  requiredRole?: 'admin' | 'superadmin' | 'moderator';
}

export const adminMenuItems: AdminMenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    id: 'products',
    label: 'Products',
    href: '/admin/products',
    icon: Package,
  },
  {
    id: 'orders',
    label: 'Orders',
    href: '/admin/orders',
    icon: ShoppingCart,
  },
  {
    id: 'reviews',
    label: 'Product Reviews',
    href: '/admin/reviews',
    icon: MessageSquare,
  },
  {
    id: 'support',
    label: 'Support Tickets',
    href: '/admin/support',
    icon: MessageSquare,
  },
  {
    id: 'discounts',
    label: 'Discount Codes',
    href: '/admin/discounts',
    icon: Percent,
  },
  {
    id: 'users',
    label: 'User Management',
    href: '/admin/users',
    icon: UserCheck,
    requiredRole: 'superadmin',
  },
  {
    id: 'recipes',
    label: 'Recipes',
    href: '/admin/recipes',
    icon: Utensils,
  },
  {
    id: 'blog',
    label: 'Blog',
    href: '/admin/blog',
    icon: FileText,
  },
  {
    id: 'newsletter',
    label: 'Email Marketing',
    href: '/admin/newsletter',
    icon: Mail,
  },
  {
    id: 'analytics',
    label: 'Analytics & Monitoring',
    href: '/admin/analytics',
    icon: BarChart3,
  },
  {
    id: 'neural-evolution',
    label: 'Neural Evolution Dashboard',
    href: '/admin/neural-evolution',
    icon: Brain,
  },
  {
    id: 'payment-analytics',
    label: 'Payment Analytics',
    href: '/admin/payment-analytics',
    icon: CreditCard,
  },
  {
    id: 'audit-log',
    label: 'Audit Log',
    href: '/admin/audit-log',
    icon: ScrollText,
    requiredRole: 'superadmin',
  },
  {
    id: 'notifications',
    label: 'Email Notifications',
    href: '/admin/notifications',
    icon: Mail,
  },
  {
    id: 'system',
    label: 'System Health',
    href: '/admin/system',
    icon: Activity,
    requiredRole: 'superadmin',
  },
  {
    id: 'hero',
    label: 'Hero Content',
    href: '/admin/hero',
    icon: Settings,
  },
  {
    id: 'wholesale',
    label: 'Wholesale',
    href: '/admin/wholesale',
    icon: Package,
  },
  {
    id: 'stores',
    label: 'Store Locator',
    href: '/admin/stores',
    icon: MapPin,
  },
  {
    id: 'payments',
    label: 'Payment Gateways',
    href: '/admin/payments',
    icon: CreditCard,
    requiredRole: 'superadmin',
  },
  {
    id: 'seo-center',
    label: 'SEO Center',
    href: '/admin/seo-center',
    icon: Search,
    requiredRole: 'admin',
  },
  {
    id: 'google-analytics',
    label: 'Google Analytics',
    href: '/admin/google-analytics',
    icon: BarChart3,
    requiredRole: 'admin',
  },
  {
    id: 'settings',
    label: 'Site Settings',
    href: '/admin/settings',
    icon: Settings,
    requiredRole: 'admin',
  },
];
