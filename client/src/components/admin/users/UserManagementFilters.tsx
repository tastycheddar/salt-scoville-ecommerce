
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Search, Filter, X, Calendar as CalendarIcon, Download } from 'lucide-react';
import type { DateRange } from 'react-day-picker';
import { FilterState } from './types';
import FilterControls from './components/FilterControls';

interface UserManagementFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onExport: () => void;
  totalUsers: number;
  filteredUsers: number;
}

const UserManagementFilters = ({ 
  filters, 
  onFiltersChange, 
  onExport, 
  totalUsers, 
  filteredUsers 
}: UserManagementFiltersProps) => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      role: 'all',
      customerType: 'all',
      wholesaleStatus: 'all',
      registrationDate: 'all',
      loyaltyPointsRange: 'all',
    });
    setDateRange(undefined);
  };

  const getActiveFiltersCount = () => {
    return Object.entries(filters).filter(([key, value]) => 
      value !== '' && value !== 'all'
    ).length;
  };

  const handleDateRangeSelect = (range: DateRange | undefined) => {
    setDateRange(range);
  };

  return (
    <div className="space-y-4">
      {/* Search and Quick Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search users by name, email, or phone..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="pl-10 bg-white/90 backdrop-blur-sm"
          />
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onExport}
            className="bg-white/90 backdrop-blur-sm"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          
          {getActiveFiltersCount() > 0 && (
            <Button
              variant="outline"
              onClick={clearFilters}
              className="bg-white/90 backdrop-blur-sm"
            >
              <X className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {/* Advanced Filters */}
      <FilterControls 
        filters={filters}
        onFiltersChange={onFiltersChange}
      />

      {/* Active Filters and Stats */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {getActiveFiltersCount() > 0 && (
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">Active filters:</span>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {getActiveFiltersCount()} applied
              </Badge>
            </div>
          )}
        </div>
        
        <div className="text-sm text-gray-600">
          Showing {filteredUsers} of {totalUsers} users
        </div>
      </div>
    </div>
  );
};

export default UserManagementFilters;
