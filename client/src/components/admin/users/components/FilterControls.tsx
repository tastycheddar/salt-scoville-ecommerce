
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FilterState } from '../types';

interface FilterControlsProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

const FilterControls = ({ filters, onFiltersChange }: FilterControlsProps) => {
  const handleFilterChange = (key: keyof FilterState, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      <Select value={filters.role} onValueChange={(value) => handleFilterChange('role', value)}>
        <SelectTrigger className="bg-white/90 backdrop-blur-sm">
          <SelectValue placeholder="Role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Roles</SelectItem>
          <SelectItem value="customer">Customer</SelectItem>
          <SelectItem value="wholesale">Wholesale</SelectItem>
          <SelectItem value="admin">Admin</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filters.customerType} onValueChange={(value) => handleFilterChange('customerType', value)}>
        <SelectTrigger className="bg-white/90 backdrop-blur-sm">
          <SelectValue placeholder="Customer Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="retail">Retail</SelectItem>
          <SelectItem value="wholesale">Wholesale</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filters.wholesaleStatus} onValueChange={(value) => handleFilterChange('wholesaleStatus', value)}>
        <SelectTrigger className="bg-white/90 backdrop-blur-sm">
          <SelectValue placeholder="Wholesale Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="approved">Approved</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="not-applied">Not Applied</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filters.registrationDate} onValueChange={(value) => handleFilterChange('registrationDate', value)}>
        <SelectTrigger className="bg-white/90 backdrop-blur-sm">
          <SelectValue placeholder="Registration" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Time</SelectItem>
          <SelectItem value="today">Today</SelectItem>
          <SelectItem value="week">This Week</SelectItem>
          <SelectItem value="month">This Month</SelectItem>
          <SelectItem value="quarter">This Quarter</SelectItem>
          <SelectItem value="year">This Year</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filters.loyaltyPointsRange} onValueChange={(value) => handleFilterChange('loyaltyPointsRange', value)}>
        <SelectTrigger className="bg-white/90 backdrop-blur-sm">
          <SelectValue placeholder="Loyalty Points" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Points</SelectItem>
          <SelectItem value="0">0 Points</SelectItem>
          <SelectItem value="1-100">1-100 Points</SelectItem>
          <SelectItem value="101-500">101-500 Points</SelectItem>
          <SelectItem value="501-1000">501-1000 Points</SelectItem>
          <SelectItem value="1000+">1000+ Points</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default FilterControls;
