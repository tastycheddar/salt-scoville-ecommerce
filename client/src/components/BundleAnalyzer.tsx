// Bundle Analysis Component for Performance Monitoring
import React, { useEffect, useState } from 'react';

interface BundleStats {
  totalSize: number;
  chunkCount: number;
  largestChunk: string;
  renderTime: number;
  jsHeapSize?: number;
}

export const BundleAnalyzer: React.FC = () => {
  const [stats, setStats] = useState<BundleStats | null>(null);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    const measureBundleStats = () => {
      const startTime = performance.now();
      
      // Get bundle information from performance entries
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      const jsResources = resources.filter(r => r.name.includes('.js'));
      
      const totalSize = jsResources.reduce((sum, resource) => {
        return sum + (resource.transferSize || 0);
      }, 0);

      const renderTime = performance.now() - startTime;

      // Get memory info if available
      const memoryInfo = (performance as any).memory;

      setStats({
        totalSize,
        chunkCount: jsResources.length,
        largestChunk: jsResources
          .sort((a, b) => (b.transferSize || 0) - (a.transferSize || 0))[0]?.name || 'unknown',
        renderTime,
        jsHeapSize: memoryInfo?.usedJSHeapSize
      });
    };

    // Measure after initial load
    setTimeout(measureBundleStats, 1000);
    
    // Log results to console for debugging
    const logStats = () => {
      if (stats) {
        console.group('🚀 Salt & Scoville Bundle Analysis');
        console.log(`📦 Total JS Bundle Size: ${(stats.totalSize / 1024).toFixed(2)} KB`);
        console.log(`🔢 Number of Chunks: ${stats.chunkCount}`);
        console.log(`⚡ Render Time: ${stats.renderTime.toFixed(2)}ms`);
        if (stats.jsHeapSize) {
          console.log(`🧠 JS Heap Size: ${(stats.jsHeapSize / 1024 / 1024).toFixed(2)} MB`);
        }
        console.groupEnd();
      }
    };

    if (stats) logStats();
  }, [stats]);

  // Only show in development
  if (process.env.NODE_ENV !== 'development' || !stats) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white text-xs p-3 rounded-lg font-mono z-50 max-w-xs">
      <div className="text-flame-red font-bold mb-2">Bundle Stats</div>
      <div>Size: {(stats.totalSize / 1024).toFixed(1)}KB</div>
      <div>Chunks: {stats.chunkCount}</div>
      <div>Render: {stats.renderTime.toFixed(1)}ms</div>
      {stats.jsHeapSize && (
        <div>Heap: {(stats.jsHeapSize / 1024 / 1024).toFixed(1)}MB</div>
      )}
    </div>
  );
};