
import { ReactNode, createContext, useContext } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { cn } from '@/lib/utils';

interface PremiumLayoutProps {
  children: ReactNode;
  className?: string;
  showHeader?: boolean;
  showFooter?: boolean;
  variant?: 'dark' | 'light' | 'glass';
}

// Create theme context
const ThemeContext = createContext<'dark' | 'light' | 'glass'>('light');

export const useTheme = () => useContext(ThemeContext);

const PremiumLayout = ({ 
  children, 
  className, 
  showHeader = true, 
  showFooter = true,
  variant = 'light' 
}: PremiumLayoutProps) => {
  const getBackgroundClass = () => {
    switch (variant) {
      case 'dark':
        return 'bg-char-black';
      case 'glass':
        return 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden';
      default:
        return 'bg-matte-white';
    }
  };

  const getMainPadding = () => {
    return showHeader ? "pt-16 lg:pt-20 pb-8" : "py-8";
  };

  return (
    <ThemeContext.Provider value={variant}>
      <div className={cn(
        "min-h-screen",
        getBackgroundClass(),
        variant === 'dark' && "dark",
        className
      )}>
        {variant === 'glass' && (
          <>
            {/* Enhanced glassmorphism background elements with better performance */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-emerald-500/10"></div>
            <div className="absolute top-1/4 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-blue-500/20 rounded-full blur-3xl opacity-40 animate-pulse will-change-transform"></div>
            <div className="absolute bottom-1/4 right-1/4 w-48 h-48 sm:w-80 sm:h-80 bg-purple-500/20 rounded-full blur-3xl opacity-30 animate-pulse will-change-transform" style={{animationDelay: '1s'}}></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 sm:w-64 sm:h-64 bg-emerald-500/15 rounded-full blur-2xl opacity-25"></div>
          </>
        )}
        
        {showHeader && <Header />}
        <main className={cn(
          "w-full relative z-10",
          getMainPadding(),
          variant === 'glass' && "backdrop-blur-sm"
        )}>
          {children}
        </main>
        {showFooter && <Footer />}
      </div>
    </ThemeContext.Provider>
  );
};

export default PremiumLayout;
