/**
 * Network Status Indicator - Mobile-First UI Component
 * Shows connection status and quality to users
 */

import React from 'react';
import { Wifi, WifiOff, Signal, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { useOfflineSync } from '@/hooks/useOfflineSync';
import { cn } from '@/lib/utils';

interface NetworkStatusIndicatorProps {
  className?: string;
  showDetails?: boolean;
}

/**
 * Smart Network Status Indicator
 * Adapts appearance based on connection quality and sync status
 */
export const NetworkStatusIndicator: React.FC<NetworkStatusIndicatorProps> = ({
  className,
  showDetails = false,
}) => {
  const { isOnline, effectiveType, isSlowConnection, saveData } = useNetworkStatus();
  const { pendingActions } = useOfflineSync();

  const getStatusColor = () => {
    if (!isOnline) return 'text-red-500';
    if (isSlowConnection) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getStatusIcon = () => {
    if (!isOnline) return <WifiOff className="h-4 w-4" />;
    if (isSlowConnection) return <Signal className="h-4 w-4" />;
    return <Wifi className="h-4 w-4" />;
  };

  const getStatusText = () => {
    if (!isOnline) return 'Offline';
    if (isSlowConnection) return 'Slow Connection';
    if (effectiveType) return effectiveType.toUpperCase();
    return 'Online';
  };

  if (!showDetails && isOnline && !pendingActions) {
    return null; // Hide when everything is working normally
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={cn(
          'flex items-center gap-2 text-sm font-medium',
          getStatusColor(),
          className
        )}
      >
        {pendingActions > 0 ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <Loader2 className="h-4 w-4" />
          </motion.div>
        ) : (
          getStatusIcon()
        )}
        
        <span className="hidden sm:inline">
          {pendingActions > 0 ? `Syncing (${pendingActions})` : getStatusText()}
        </span>

        {showDetails && (
          <div className="text-xs text-muted-foreground ml-2">
            {saveData && <span className="bg-orange-100 text-orange-800 px-1 rounded">Data Saver</span>}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default NetworkStatusIndicator;