/**
 * Unified Floating Dave Assistant - NO DUPLICATES
 * Single popup chat interface - never redirects to pages
 */

import React, { useState } from 'react';
// Removed Flame import - using emoji instead
import { useDaveSession } from '@/context/DaveSessionContext';
import { motion } from 'framer-motion';
import FlavaDaveChat from '@/components/ai/FlavaDaveChat';

export const FloatingDaveAssistant: React.FC = () => {
  const {
    conversationState,
    minimizeChat,
    expandChat,
    shouldShowFloatingBubble
  } = useDaveSession();

  const [isChatOpen, setIsChatOpen] = useState(false);

  if (!shouldShowFloatingBubble()) {
    return null;
  }

  const handleToggleChat = () => {
    if (isChatOpen) {
      setIsChatOpen(false);
      minimizeChat();
    } else {
      setIsChatOpen(true);
      expandChat();
    }
  };

  // Get heat profile from localStorage
  const heatProfile = localStorage.getItem('heatProfile') 
    ? JSON.parse(localStorage.getItem('heatProfile')!) 
    : null;

  return (
    <>
      {/* Unified system: Show popup chat OR floating button - never both */}
      {isChatOpen ? (
        <FlavaDaveChat
          heatProfile={heatProfile}
          isOpen={isChatOpen}
          onToggle={handleToggleChat}
        />
      ) : (
        <div className="fixed bottom-6 right-6 z-[10000]">
          <motion.button
            onClick={handleToggleChat}
            className="text-7xl cursor-pointer"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            animate={{ 
              scale: [1, 1.05, 1],
              rotate: [0, 2, -2, 0]
            }}
            transition={{
              scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 3, repeat: Infinity, ease: "easeInOut" }
            }}
            title={`Chat with FlavaDave ${conversationState.conversationHistory.length > 0 ? '- Active Conversation' : ''}`}
          >
            🔥
          </motion.button>
          
          {conversationState.conversationHistory.length > 0 && 
           conversationState.isActive && (
            <div className="absolute -top-1 -right-1 h-6 w-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center shadow-md z-[10001]">
              <span className="text-xs font-bold text-white">
                {conversationState.conversationHistory.length}
              </span>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default FloatingDaveAssistant;