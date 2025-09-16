
import { useMemo } from 'react';
import { UserProfile, FilterState } from '../types';

export const useUserFilters = (users: UserProfile[], filters: FilterState) => {
  return useMemo(() => {
    return users.filter(user => {
      const matchesSearch = 
        user.email.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.first_name?.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.last_name?.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.phone?.includes(filters.search);
      
      const matchesRole = filters.role === 'all' || user.role === filters.role;
      const matchesCustomerType = filters.customerType === 'all' || user.customer_type === filters.customerType;
      
      const matchesWholesaleStatus = (() => {
        if (filters.wholesaleStatus === 'all') return true;
        if (filters.wholesaleStatus === 'approved') return user.wholesale_approved;
        if (filters.wholesaleStatus === 'pending') return user.customer_type === 'wholesale' && !user.wholesale_approved;
        if (filters.wholesaleStatus === 'not-applied') return user.customer_type !== 'wholesale';
        return true;
      })();

      const matchesLoyaltyPoints = (() => {
        if (filters.loyaltyPointsRange === 'all') return true;
        const points = user.loyalty_points || 0;
        switch (filters.loyaltyPointsRange) {
          case '0': return points === 0;
          case '1-100': return points >= 1 && points <= 100;
          case '101-500': return points >= 101 && points <= 500;
          case '501-1000': return points >= 501 && points <= 1000;
          case '1000+': return points > 1000;
          default: return true;
        }
      })();
      
      return matchesSearch && matchesRole && matchesCustomerType && matchesWholesaleStatus && matchesLoyaltyPoints;
    });
  }, [users, filters]);
};
