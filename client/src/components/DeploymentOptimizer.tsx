import { useEffect } from 'react';
import { preloadCriticalResources, removeUnusedModules } from '@/utils/criticalResourceHints';

/**
 * DeploymentOptimizer - Handles startup optimization for production deployments
 * Defers non-critical operations to improve cold start performance
 */
export const DeploymentOptimizer = () => {
  useEffect(() => {
    // Only run optimization in production
    if (process.env.NODE_ENV !== 'production') return;

    // Remove unused console methods to reduce bundle size
    removeUnusedModules();

    // Defer resource preloading to avoid blocking initial render
    const optimizationTimer = setTimeout(() => {
      preloadCriticalResources();
    }, 500);

    return () => clearTimeout(optimizationTimer);
  }, []);

  // This component doesn't render anything
  return null;
};

export default DeploymentOptimizer;