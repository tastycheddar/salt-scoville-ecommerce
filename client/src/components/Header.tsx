
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/hooks/useCart';
import CartDrawer from '@/components/CartDrawer';
import MobileMenu from '@/components/header/MobileMenu';
import HeaderActions from '@/components/header/HeaderActions';
import SearchOverlay from '@/components/navigation/SearchOverlay';
import { useTheme } from '@/components/PremiumLayout';
import { cn } from '@/lib/utils';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();

  const handleNavClick = (sectionId: string) => {
    if (window.location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMenuOpen(false);
  };

  // Consistent glassmorphic header styling for all themes
  const getHeaderStyles = () => {
    return "bg-white/5 backdrop-blur-xl border-white/10 supports-[backdrop-filter]:bg-white/5";
  };



  return (
    <>
      <header className={cn(
        "fixed top-0 w-full z-50 border-b transition-all duration-300",
        getHeaderStyles()
      )}>
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center">
                <img 
                  src="/logo-white.png" 
                  alt="Salt & Scoville Logo" 
                  className={cn(
                    "h-10 sm:h-12 lg:h-16 w-auto filter drop-shadow-md transition-all duration-300"
                  )}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/logo.png';
                    target.onerror = null;
                  }}
                  loading="eager"
                />
              </Link>
            </div>

            {/* Right Icons */}
            <div className="flex-shrink-0">
              <HeaderActions 
                isMenuOpen={isMenuOpen}
                onMenuToggle={() => setIsMenuOpen(!isMenuOpen)}
                onCartOpen={() => setIsCartOpen(true)}
                onSearchOpen={() => setIsSearchOpen(true)}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onCartOpen={() => setIsCartOpen(true)}
        onNavClick={handleNavClick}
      />

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      
      <SearchOverlay 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />
    </>
  );
};

export default Header;
