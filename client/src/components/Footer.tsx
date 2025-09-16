
import { Instagram, Facebook, Twitter, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '@/components/PremiumLayout';
import { cn } from '@/lib/utils';

const Footer = () => {
  const theme = useTheme();
  const isGlassTheme = theme === 'glass';
  const isDarkTheme = theme === 'dark';

  const getFooterBackground = () => {
    if (isGlassTheme) {
      return "bg-white/5 backdrop-blur-xl border-t border-white/10";
    }
    if (isDarkTheme) {
      return "bg-gradient-to-br from-char-black via-charcoal to-char-black";
    }
    return "bg-char-black";
  };

  const getSocialIconStyles = () => {
    return cn(
      "p-3 transition-all duration-300 group hover:scale-105"
    );
  };

  const getSocialIconColor = () => {
    return cn(
      "h-5 w-5 transition-all duration-300 group-hover:scale-110",
      "text-white/70 group-hover:text-flame-red"
    );
  };

  return (
    <footer className={cn(
      "relative overflow-hidden group",
      getFooterBackground()
    )}>
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={cn(
          "absolute top-1/2 left-1/4 w-32 h-32 rounded-full blur-2xl",
          isGlassTheme ? "bg-blue-500/10" : "bg-flame-red/5"
        )}></div>
        <div className={cn(
          "absolute bottom-1/2 right-1/4 w-24 h-24 rounded-full blur-xl",
          isGlassTheme ? "bg-purple-500/10" : "bg-burnt-orange/5"
        )}></div>
      </div>

      {/* Main Footer Content */}
      <div className={cn(
        "relative z-10",
        !isGlassTheme && "backdrop-blur-sm bg-white/5 border-t border-matte-white/10"
      )}>
        <div className="container mx-auto px-1 sm:px-2 lg:px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            
            {/* Brand Section - Now Centered */}
            <div className="text-center flex-shrink-0">
              <Link to="/" className="inline-block">
                <img 
                  src="/logo-white.png" 
                  alt="Salt & Scoville Logo" 
                  className="h-12 w-auto filter drop-shadow-md hover:scale-105 transition-transform duration-300 mx-auto"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/logo.png';
                    target.onerror = null;
                  }}
                  loading="lazy"
                />
              </Link>
            </div>

            {/* Navigation Links */}
            <div className="flex-1 text-center">
              <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
                <Link 
                  to="/products" 
                  className="text-white/80 hover:text-flame-red text-sm font-montserrat transition-colors duration-300"
                >
                  Products
                </Link>
                <button
                  onClick={() => {
                    const element = document.getElementById('heat-guide');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="text-white/80 hover:text-flame-red text-sm font-montserrat transition-colors duration-300"
                >
                  Heat Guide
                </button>
                <Link 
                  to="/about" 
                  className="text-white/80 hover:text-flame-red text-sm font-montserrat transition-colors duration-300"
                >
                  About
                </Link>
                <Link 
                  to="/contact" 
                  className="text-white/80 hover:text-flame-red text-sm font-montserrat transition-colors duration-300"
                >
                  Contact
                </Link>
                <Link 
                  to="/wholesale" 
                  className="text-white/80 hover:text-flame-red text-sm font-montserrat transition-colors duration-300"
                >
                  Wholesale
                </Link>
              </div>
            </div>

            {/* Social Icons - Now consistent across all devices */}
            <div className="flex-shrink-0">
              <div className="flex space-x-3">
                {[
                  { Icon: Instagram, href: 'https://instagram.com/saltandscoville', label: 'Instagram' },
                  { Icon: Facebook, href: 'https://facebook.com/saltandscoville', label: 'Facebook' },
                  { Icon: Twitter, href: 'https://x.com/saltandscoville', label: 'Twitter' },
                  { Icon: Mail, href: 'mailto:info@saltandscoville.com', label: 'Email' }
                ].map(({ Icon, href, label }) => (
                  <a
                    key={`social-${label}`}
                    href={href}
                    aria-label={label}
                    className={getSocialIconStyles()}
                    target={href.startsWith('http') ? '_blank' : undefined}
                    rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  >
                    <Icon className={getSocialIconColor()} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Copyright Section */}
          <div className="mt-6 pt-4 border-t border-white/10">
            <div className="text-center">
              <p className="text-white/60 text-sm font-montserrat">
                © 2025 Salt & Scoville
                {' '}| Powered by{' '}
                <a 
                  href="https://www.tastycheddar.com" 
                  target="_blank" 
                  rel="dofollow"
                  className="text-white/80 hover:text-flame-red font-bold italic transition-colors duration-300"
                >
                  Tasty Cheddar
                </a>
                {' '}<span className="text-xl inline-block group-hover:animate-bounce transition-all duration-300 cursor-pointer">🧀</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
