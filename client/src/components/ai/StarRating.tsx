import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  messageId: string;
  currentRating?: number;
  onRate: (messageId: string, rating: number) => void;
  disabled?: boolean;
  compact?: boolean;
}

export function StarRating({ messageId, currentRating, onRate, disabled = false, compact = false }: StarRatingProps) {
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [submittedRating, setSubmittedRating] = useState<number | null>(currentRating || null);

  const handleStarClick = (rating: number) => {
    if (disabled || submittedRating) return;
    
    setSubmittedRating(rating);
    onRate(messageId, rating);
  };

  const handleStarHover = (rating: number | null) => {
    if (disabled || submittedRating) return;
    setHoveredStar(rating);
  };

  // V3.1: 0-9 emotional rating system with authentic color coding
  const getStarColor = (starIndex: number) => {
    const effectiveRating = hoveredStar || submittedRating || 0;
    
    if (starIndex <= effectiveRating) {
      if (effectiveRating <= 2) return 'text-red-500'; // 0-2: Negative Experience
      if (effectiveRating <= 5) return 'text-yellow-500'; // 3-5: Learning Zone
      if (effectiveRating <= 7) return 'text-green-500'; // 6-7: Satisfied
      return 'text-blue-500'; // 8-9: Exceptional/AGI Target
    }
    
    return 'text-gray-400';
  };

  const getRatingLabel = (rating: number) => {
    if (rating <= 2) return "Negative Experience";
    if (rating <= 5) return "Learning Zone";
    if (rating <= 7) return "Satisfied";
    return "Exceptional";
  };

  if (submittedRating) {
    return (
      <div className={cn("flex items-center gap-2", compact && "gap-1")}>
        <div className="flex items-center gap-1">
          {Array.from({ length: 9 }, (_, i) => (
            <Star
              key={i}
              size={compact ? 12 : 16}
              className={cn(
                getStarColor(i),
                i < submittedRating ? 'fill-current' : ''
              )}
            />
          ))}
        </div>
        <span className={cn("text-sm text-gray-400", compact && "text-xs")}>
          {submittedRating}/9 ⭐ - {getRatingLabel(submittedRating)}
        </span>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-2 p-3 rounded-lg bg-slate-800/80 border border-slate-600", compact && "p-2")}>
      <span className={cn("text-sm text-slate-300", compact && "text-xs")}>
        How'd Dave Do?
      </span>
      <div 
        className="flex items-center gap-1"
        onMouseLeave={() => handleStarHover(null)}
      >
        {Array.from({ length: 9 }, (_, i) => (
          <button
            key={i}
            onMouseEnter={() => handleStarHover(i + 1)}
            onClick={() => handleStarClick(i + 1)}
            disabled={disabled}
            className="transition-all duration-150 hover:scale-110 disabled:cursor-not-allowed"
          >
            <Star
              size={compact ? 16 : 20}
              className={cn(
                getStarColor(i + 1),
                'transition-colors duration-150',
                (i + 1) <= (hoveredStar || 0) ? 'fill-current' : '',
                !disabled && 'hover:drop-shadow-sm'
              )}
            />
          </button>
        ))}
      </div>
      {hoveredStar !== null && (
        <span className={cn("text-xs text-slate-400", compact && "text-xs")}>
          {hoveredStar}/9 - {getRatingLabel(hoveredStar)}
        </span>
      )}
    </div>
  );
}