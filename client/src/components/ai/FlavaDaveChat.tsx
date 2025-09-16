import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, X, Sparkles, ShoppingCart, Minimize2, Maximize2, Settings } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { motion, AnimatePresence } from 'framer-motion';
import { useDaveSession } from '@/context/DaveSessionContext';
import { useNavigate } from 'react-router-dom';
import { StarRating } from '@/components/ai/StarRating';
import { PersonalityControls } from '@/components/PersonalityControls';
import { MarkdownLinkParser } from './MarkdownLinkParser';

interface Message {
  id: string;
  type: 'user' | 'ai' | 'system';
  content: string;
  timestamp: Date;
  starRating?: number;
  suggestions?: string[];
  productRecommendations?: Array<{
    id: string;
    slug: string;
    name: string;
    price: string;
    heatLevel: number;
    reason?: string;
  }>;
}

interface FlavaDaveChatProps {
  heatProfile?: any;
  isOpen: boolean;
  onToggle: () => void;
  onProductClick?: (productId: string) => void;
  onRecipeClick?: (recipeId: string) => void;
  isFullPage?: boolean; // New prop to indicate if this is used on Dave's Lab page
}

export default function FlavaDaveChat({ 
  heatProfile, 
  isOpen, 
  onToggle, 
  onProductClick,
  onRecipeClick,
  isFullPage = false
}: FlavaDaveChatProps) {
  const navigate = useNavigate();
  const { 
    conversationState, 
    startConversation, 
    addMessage,
    trackJourneyEvent 
  } = useDaveSession();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [lastUserMessage, setLastUserMessage] = useState<string>('');
  const [showPersonalityControls, setShowPersonalityControls] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastDaveMessageRef = useRef<HTMLDivElement>(null);

  // Check admin status on mount
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const user = await response.json();
          setIsAdmin(user.role === 'admin' || user.role === 'superadmin');
        }
      } catch (error) {
        setIsAdmin(false);
      }
    };
    checkAdminStatus();
  }, []);
  
  // Handle neural rating submission
  const handleRating = async (messageId: string, rating: number) => {
    try {
      const ratingResult = await apiRequest('/api/neural/rate-message', {
        method: 'POST',
        body: JSON.stringify({
          messageId,
          rating,
          sessionId: conversationState.sessionId
        })
      });

      // Update the message with the rating
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, starRating: rating } : msg
      ));

      // Track neural contribution
      await apiRequest('/api/neural/track-contribution', {
        method: 'POST',
        body: JSON.stringify({
          sessionId: conversationState.sessionId,
          contributionType: 'rating',
          contributionValue: rating.toString(),
          teachingMomentDescription: `User provided ${rating}/10 star rating for Dave's AI response quality`
        })
      });

      return ratingResult;
    } catch (error) {
      // Neural contribution tracking failed silently
    }
  };

  // Initialize messages from conversation history
  useEffect(() => {
    if (conversationState.conversationHistory.length > 0) {
      const historyMessages: Message[] = [];
      conversationState.conversationHistory.forEach((entry: any) => {
        if (entry.userMessage) {
          historyMessages.push({
            id: `user-${entry.timestamp}`,
            type: 'user',
            content: entry.userMessage,
            timestamp: new Date(entry.timestamp)
          });
        }
        if (entry.aiResponse) {
          historyMessages.push({
            id: `ai-${entry.timestamp}`,
            type: 'ai',
            content: entry.aiResponse,
            timestamp: new Date(entry.timestamp),
            starRating: entry.starRating,
            productRecommendations: entry.productRecommendations
          });
        }
      });
      
      setMessages(historyMessages);
    } else {
      // Show welcome message if no conversation history
      setMessages([{
        id: 'welcome',
        type: 'system',
        content: "Hey there! I'm FlavaDave, your personal pepper genius. I can help you find the perfect heat level, recommend products, or even create custom recipes. What brings you to the spicy side today?",
        timestamp: new Date()
      }]);
    }
  }, [conversationState.conversationHistory]);

  // Auto-scroll to Dave's latest reply when new AI messages arrive
  useEffect(() => {
    // Check if the latest message is from Dave (AI)
    const latestMessage = messages[messages.length - 1];
    if (latestMessage && (latestMessage.type === 'ai' && latestMessage.content !== '...')) {
      // Small delay to ensure DOM is updated
      setTimeout(() => {
        if (lastDaveMessageRef.current) {
          // Scroll Dave's message to the top of the visible area
          lastDaveMessageRef.current.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start' // Position at top of viewport
          });
        }
      }, 100);
    }
  }, [messages]);

  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      // Create session before first message if doesn't exist
      if (!conversationState.sessionId) {
        const sessionId = `dave-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        startConversation(sessionId);
      }

      const response = await apiRequest('/api/flava-dave', {
        method: 'POST',
        body: JSON.stringify({
          message,
          heatProfile,
          conversationHistory: conversationState.conversationHistory,
          sessionId: conversationState.sessionId
        })
      });
      return response;
    },
    onSuccess: (data) => {
      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        type: 'ai',
        content: data.response,
        timestamp: new Date(),
        suggestions: data.suggestions || [],
        productRecommendations: data.productRecommendations || []
      };

      setMessages(prev => [...prev, aiMessage]);
      
      // Add to conversation context using stored user message
      addMessage({
        userMessage: lastUserMessage,
        aiResponse: data.response,
        timestamp: Date.now(),
        productRecommendations: data.productRecommendations
      });
    }
  });

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const messageToSend = input.trim();
    setLastUserMessage(messageToSend); // Store for conversation context
    setInput('');

    // Add typing indicator
    const typingMessage: Message = {
      id: `typing-${Date.now()}`,
      type: 'ai',
      content: '...',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, typingMessage]);

    try {
      await chatMutation.mutateAsync(messageToSend);
      // Remove typing indicator after response
      setMessages(prev => prev.filter(msg => msg.id !== typingMessage.id));
    } catch (error) {
      // Remove typing indicator on error
      setMessages(prev => prev.filter(msg => msg.id !== typingMessage.id));
      throw error;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleProductClick = (productId: string, slug: string) => {
    if (onProductClick) {
      onProductClick(productId);
    }
    // Navigate to product and minimize chat
    navigate(`/products/${slug}`);
    setIsMinimized(true);
    trackJourneyEvent('product_click', { productId, source: 'dave_recommendation' });
  };

  return (
    <>
      {/* Floating Button - Only show when not in full page mode */}
      <AnimatePresence>
        {!isOpen && !isFullPage && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 right-6 z-[9998]"
          >
            <motion.button
              onClick={onToggle}
              className="relative p-4 bg-gradient-to-r from-flame-red to-burnt-orange rounded-full shadow-2xl hover:shadow-flame-red/30 transition-all duration-300 group"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              🔥
              
              {/* Pulsing background effect */}
              <motion.div
                className="absolute inset-0 rounded-full"
                animate={{
                  scale: [1, 1.4, 1.2, 1],
                  opacity: [0.3, 0.8, 0.5, 0.3]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity, 
                  ease: "easeInOut",
                  repeatDelay: 1
                }}
                style={{
                  background: 'radial-gradient(circle, rgba(239, 68, 68, 0.4) 0%, rgba(234, 88, 12, 0.3) 50%, transparent 70%)',
                  filter: 'blur(10px)',
                }}
              />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Interface - Conditional Layout */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3 }}
            className={isFullPage 
              ? 'w-full sm:w-[69%] max-w-4xl mx-auto' 
              : `fixed right-6 z-[9999] ${
                  isMinimized ? 'bottom-6 w-80 h-16' : 'bottom-6 w-96 max-h-[500px]'
                }`
            }
          >
            <Card className={`${
              isFullPage 
                ? 'h-[80vh] shadow-2xl border-flame-red/20 bg-gray-900/95 backdrop-blur-lg flex flex-col' 
                : 'h-full shadow-2xl border-flame-red/20 bg-gray-900 flex flex-col'
            }`}>
              {/* Header */}
              <CardHeader className={`${
                isMinimized 
                  ? 'bg-gray-800 border-b border-gray-600' 
                  : 'bg-gradient-to-r from-flame-red to-burnt-orange'
              } text-white p-3 rounded-t-lg flex-shrink-0`}>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🔥</span>
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-base">FlavaDave</h3>
                    <p className="text-xs opacity-90">Ask Me Anything</p>
                  </div>
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30 mr-2">
                    LIVE
                  </Badge>
                  {isAdmin && (
                    <button
                      onClick={() => setShowPersonalityControls(true)}
                      className="p-1 hover:bg-white/20 rounded-full transition-colors mr-1"
                      title="Personality Settings (Admin Only)"
                    >
                      <Settings className="h-4 w-4" />
                    </button>
                  )}
                  {!isFullPage && (
                    <>
                      <button
                        onClick={() => setIsMinimized(!isMinimized)}
                        className="p-1 hover:bg-white/20 rounded-full transition-colors mr-1"
                      >
                        {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={onToggle}
                        className="p-1 hover:bg-white/20 rounded-full transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </div>
              </CardHeader>

              {!isMinimized && (
                <>
                  {/* Chat Messages */}
                  <CardContent className="flex-1 p-0 bg-gray-900 text-white overflow-hidden">
                    <ScrollArea className={`${isFullPage ? 'h-[calc(80vh-160px)]' : 'h-80'} p-4`}>
                      <div className="space-y-4">
                        {messages.map((message, index) => (
                          <div 
                            key={message.id} 
                            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                            ref={message.type === 'ai' && index === messages.length - 1 && message.content !== '...' ? lastDaveMessageRef : undefined}
                          >
                            <div className={`${message.type === 'user' ? 'max-w-[85%]' : 'w-full'} rounded-lg p-3 ${
                              message.type === 'user' 
                                ? 'bg-flame-red text-white' 
                                : 'bg-gray-800 text-white border border-gray-700'
                            }`}>
                              {message.content === '...' ? (
                                <div className="flex items-center gap-1">
                                  <span className="text-sm">FlavaDave is typing</span>
                                  <div className="flex gap-1 ml-2">
                                    <motion.div
                                      animate={{ opacity: [0.4, 1, 0.4] }}
                                      transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
                                      className="w-1 h-1 bg-flame-red rounded-full"
                                    />
                                    <motion.div
                                      animate={{ opacity: [0.4, 1, 0.4] }}
                                      transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                                      className="w-1 h-1 bg-flame-red rounded-full"
                                    />
                                    <motion.div
                                      animate={{ opacity: [0.4, 1, 0.4] }}
                                      transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                                      className="w-1 h-1 bg-flame-red rounded-full"
                                    />
                                  </div>
                                </div>
                              ) : (
                                <MarkdownLinkParser 
                                  content={message.content} 
                                  onProductClick={onProductClick}
                                />
                              )}
                              
                              {/* Product Recommendations */}
                              {message.productRecommendations && message.productRecommendations.length > 0 && (
                                <div className="mt-3 space-y-2">
                                  <p className="text-xs font-semibold text-flame-red">🌶️ Recommended:</p>
                                  {message.productRecommendations.map((product) => (
                                    <div key={product.id} className="bg-gray-700 rounded p-2 text-xs">
                                      <div className="flex items-center justify-between">
                                        <span className="font-semibold">{product.name}</span>
                                        <span className="text-green-400">{product.price}</span>
                                      </div>
                                      <div className="flex items-center gap-2 mt-1">
                                        <span className="text-flame-red">Heat: {product.heatLevel}/5</span>
                                        <Button
                                          size="sm"
                                          className="h-6 px-2 bg-flame-red hover:bg-flame-red/80"
                                          onClick={() => handleProductClick(product.id, product.slug)}
                                        >
                                          <ShoppingCart className="h-3 w-3 mr-1" />
                                          View
                                        </Button>
                                      </div>
                                      {product.reason && (
                                        <p className="text-gray-300 mt-1 italic">{product.reason}</p>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* Star Rating for AI messages - ONLY after Dave completes response */}
                              {message.type === 'ai' && message.content !== '...' && (
                                <div className="mt-3 pt-2 border-t border-gray-700">
                                  <StarRating
                                    messageId={message.id}
                                    currentRating={message.starRating}
                                    onRate={handleRating}
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                        <div ref={messagesEndRef} />
                      </div>
                    </ScrollArea>
                  </CardContent>

                  {/* Input Area */}
                  <div className="p-4 bg-gray-900 border-t border-gray-700 flex-shrink-0">
                    <div className="flex gap-2">
                      <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask me anything about spices..."
                        className="flex-1 bg-black border-gray-700 text-white placeholder-gray-400"
                        disabled={chatMutation.isPending}
                      />
                      <Button
                        onClick={handleSend}
                        disabled={!input.trim() || chatMutation.isPending}
                        className="bg-flame-red hover:bg-flame-red/80"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* V4.0 PERSONALITY CONTROLS */}
      <PersonalityControls
        sessionId={conversationState.sessionId}
        isVisible={showPersonalityControls}
        onClose={() => setShowPersonalityControls(false)}
      />
    </>
  );
}