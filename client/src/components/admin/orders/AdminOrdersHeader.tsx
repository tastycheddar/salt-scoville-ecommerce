
import React from 'react';
import CreateOrderDialog from './CreateOrderDialog';

interface AdminOrdersHeaderProps {
  onOrderCreated: () => void;
}

export const AdminOrdersHeader = ({ onOrderCreated }: AdminOrdersHeaderProps) => {
  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-4 sm:px-6 lg:px-8 py-4 sm:py-6 text-white shadow-xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Order Management</h1>
          <p className="text-white/80 text-sm sm:text-base">Manage customer orders and fulfillment</p>
        </div>
        <CreateOrderDialog onOrderCreated={onOrderCreated} />
      </div>
    </div>
  );
};
