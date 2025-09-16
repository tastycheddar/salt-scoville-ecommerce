import React, { Suspense } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { CartProvider } from "@/hooks/useCart";
import { DaveSessionProvider } from "@/context/DaveSessionContext";
import { FloatingDaveAssistant } from "@/components/FloatingDaveAssistant";
import ScrollToTop from "@/components/ScrollToTop";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";
import { queryClient } from "@/lib/queryClient";
import SEORedirectManager from "@/components/seo/SEORedirectManager";
import { preloadCriticalResources } from "@/utils/criticalResourceHints";
import { initGA } from "@/lib/googleAnalytics";
import { useAnalytics } from "@/hooks/useAnalytics";
import { initDaveDebug } from "@/utils/daveDebug";
import ErrorBoundary from "@/components/ErrorBoundary";
import LazyLoadSpinner from "@/components/LazyLoadSpinner";
import DeploymentOptimizer from "@/components/DeploymentOptimizer";
// import { executeEmergencyPerformanceFixes } from "@/utils/emergencyPerformanceFixes"; // Disabled for performance

// Critical pages loaded immediately for initial render
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ServerError from "./pages/500";

// Public pages - lazy loaded for better performance
const Products = React.lazy(() => import("./pages/Products"));
const ProductDetail = React.lazy(() => import("./pages/ProductDetail"));
const About = React.lazy(() => import("./pages/About"));
const Contact = React.lazy(() => import("./pages/Contact"));
const Recipes = React.lazy(() => import("./pages/Recipes"));
const RecipeDetail = React.lazy(() => import("./pages/RecipeDetail"));
const RecipeSubmission = React.lazy(() => import("./pages/RecipeSubmission"));
const Blog = React.lazy(() => import("./pages/Blog"));
const BlogPost = React.lazy(() => import("./pages/BlogPost"));
const ArticlePage = React.lazy(() => import("./pages/ArticlePage"));
const StoreLocator = React.lazy(() => import("./pages/StoreLocator"));
const HeatGuide = React.lazy(() => import("./pages/HeatGuide"));
const Wholesale = React.lazy(() => import("./pages/Wholesale"));

// User-specific pages - lazy loaded
const Cart = React.lazy(() => import("./pages/Cart"));
const Checkout = React.lazy(() => import("./pages/Checkout"));
const OrderSuccess = React.lazy(() => import("./pages/OrderSuccess"));
const Orders = React.lazy(() => import("./pages/Orders"));
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const Wishlist = React.lazy(() => import("./pages/Wishlist"));
const Profile = React.lazy(() => import("./pages/Profile"));
const Account = React.lazy(() => import("./pages/Account"));
const Auth = React.lazy(() => import("./pages/Auth"));
const HeatProfilePage = React.lazy(() => import("./pages/HeatProfilePage"));
const FlavaDave = React.lazy(() => import("./pages/FlavaDave"));

// Auth pages - lazy loaded
const Login = React.lazy(() => import("./pages/Login"));
const Signup = React.lazy(() => import("./pages/Signup"));
const PasswordReset = React.lazy(() => import("./pages/PasswordReset"));

// Special pages - lazy loaded
const RecipeWizard = React.lazy(() => import("./pages/RecipeWizard"));
const NeuralEvolution = React.lazy(() => import("./pages/neural-evolution"));
const NeuralAnalyticsDemo = React.lazy(() => import("./pages/NeuralAnalyticsDemo"));
const PublicNeuralHeatMap = React.lazy(() => import("./components/public/PublicNeuralHeatMap"));

// Admin imports - lazy loaded for better performance
const AdminDashboard = React.lazy(() => import("./pages/admin/Dashboard"));
const AdminProducts = React.lazy(() => import("./pages/admin/Products"));
const AdminOrders = React.lazy(() => import("./pages/admin/Orders"));
const AdminUsers = React.lazy(() => import("./pages/admin/Users"));
const AdminRecipes = React.lazy(() => import("./pages/admin/Recipes"));
const AdminBlog = React.lazy(() => import("./pages/admin/Blog"));
const AdminSettings = React.lazy(() => import("./pages/admin/Settings"));
const AdminWholesale = React.lazy(() => import("./pages/admin/Wholesale"));
const AdminStores = React.lazy(() => import("./pages/admin/Stores"));
const AdminNewsletter = React.lazy(() => import("./pages/admin/Newsletter"));
const AdminHero = React.lazy(() => import("./pages/admin/Hero"));
const AdminPayments = React.lazy(() => import("./pages/admin/Payments"));
const AdminReviews = React.lazy(() => import("./pages/admin/Reviews"));
const AdminAnalytics = React.lazy(() => import("./pages/admin/Analytics"));
const AdminNotifications = React.lazy(() => import("./pages/admin/Notifications"));
const AdminSystem = React.lazy(() => import("./pages/admin/System"));
const AdminSEOCenter = React.lazy(() => import("./pages/admin/SEOCenter"));
const AdminGoogleAnalytics = React.lazy(() => import("./pages/admin/GoogleAnalytics"));
const AdminSupport = React.lazy(() => import("./pages/admin/Support"));
const AdminDiscounts = React.lazy(() => import("./pages/admin/Discounts"));

const AdminPaymentAnalytics = React.lazy(() => import("./pages/admin/PaymentAnalytics"));
const AdminAuditLog = React.lazy(() => import("./pages/admin/AuditLog"));
const AdminSiteSettings = React.lazy(() => import("./pages/admin/SiteSettings"));
const AdminNeuralEvolution = React.lazy(() => import("./pages/admin/NeuralEvolution"));
import AdminGuard from "./components/AdminGuard";
import AdminLayout from "./components/AdminLayout";

import EmailVerification from "./components/EmailVerification";
import VerifyEmail from "./pages/auth/VerifyEmail";
import ResetPassword from "./pages/auth/ResetPassword";
// Removed GlobalFlavaDave - using unified FloatingDaveAssistant only



function Router() {
  // Track page views when routes change
  useAnalytics();
  
  return (
    <Routes>
      {/* Critical routes - loaded immediately */}
      <Route path="/" element={<Index />} />
      
      {/* Public routes - lazy loaded with suspense */}
      <Route path="/products" element={<Suspense fallback={<LazyLoadSpinner />}><Products /></Suspense>} />
      <Route path="/products/:slug" element={<Suspense fallback={<LazyLoadSpinner />}><ProductDetail /></Suspense>} />
      <Route path="/about" element={<Suspense fallback={<LazyLoadSpinner />}><About /></Suspense>} />
      <Route path="/contact" element={<Suspense fallback={<LazyLoadSpinner />}><Contact /></Suspense>} />
      <Route path="/recipes" element={<Suspense fallback={<LazyLoadSpinner />}><Recipes /></Suspense>} />
      <Route path="/recipes/:id" element={<Suspense fallback={<LazyLoadSpinner />}><RecipeDetail /></Suspense>} />
      <Route path="/recipe-submission" element={<Suspense fallback={<LazyLoadSpinner />}><RecipeSubmission /></Suspense>} />
      <Route path="/blog" element={<Suspense fallback={<LazyLoadSpinner />}><Blog /></Suspense>} />
      <Route path="/blog/:slug" element={<Suspense fallback={<LazyLoadSpinner />}><BlogPost /></Suspense>} />
      <Route path="/articles/:slug" element={<Suspense fallback={<LazyLoadSpinner />}><ArticlePage /></Suspense>} />
      <Route path="/store-locator" element={<Suspense fallback={<LazyLoadSpinner />}><StoreLocator /></Suspense>} />
      <Route path="/heat-guide" element={<Suspense fallback={<LazyLoadSpinner />}><HeatGuide /></Suspense>} />
      <Route path="/heat-profile" element={<Suspense fallback={<LazyLoadSpinner />}><HeatProfilePage /></Suspense>} />
      <Route path="/flava-dave" element={<Suspense fallback={<LazyLoadSpinner />}><FlavaDave /></Suspense>} />

      <Route path="/neural-evolution" element={<Suspense fallback={<LazyLoadSpinner />}><PublicNeuralHeatMap /></Suspense>} />
      <Route path="/neural-analytics-demo" element={<Suspense fallback={<LazyLoadSpinner />}><NeuralAnalyticsDemo /></Suspense>} />

      <Route path="/recipe-wizard" element={<Suspense fallback={<LazyLoadSpinner />}><RecipeWizard /></Suspense>} />

      <Route path="/wholesale" element={<Suspense fallback={<LazyLoadSpinner />}><Wholesale /></Suspense>} />
      
      {/* Cart and checkout - lazy loaded */}
      <Route path="/cart" element={<Suspense fallback={<LazyLoadSpinner />}><Cart /></Suspense>} />
      <Route path="/checkout" element={<Suspense fallback={<LazyLoadSpinner />}><Checkout /></Suspense>} />
      <Route path="/order-success" element={<Suspense fallback={<LazyLoadSpinner />}><OrderSuccess /></Suspense>} />
      
      {/* User account routes - lazy loaded */}
      <Route path="/dashboard" element={<Suspense fallback={<LazyLoadSpinner />}><Dashboard /></Suspense>} />
      <Route path="/orders" element={<Suspense fallback={<LazyLoadSpinner />}><Orders /></Suspense>} />
      <Route path="/wishlist" element={<Suspense fallback={<LazyLoadSpinner />}><Wishlist /></Suspense>} />
      <Route path="/profile" element={<Suspense fallback={<LazyLoadSpinner />}><Profile /></Suspense>} />
      <Route path="/account" element={<Suspense fallback={<LazyLoadSpinner />}><Account /></Suspense>} />
      
      {/* Auth routes - lazy loaded */}
      <Route path="/auth" element={<Suspense fallback={<LazyLoadSpinner />}><Auth /></Suspense>} />
      <Route path="/login" element={<Suspense fallback={<LazyLoadSpinner />}><Login /></Suspense>} />
      <Route path="/signup" element={<Suspense fallback={<LazyLoadSpinner />}><Signup /></Suspense>} />
      <Route path="/password-reset" element={<Suspense fallback={<LazyLoadSpinner />}><PasswordReset /></Suspense>} />
      <Route path="/verify-email" element={<EmailVerification />} />
      <Route path="/auth/verify-email" element={<VerifyEmail />} />
      <Route path="/auth/reset-password" element={<ResetPassword />} />
      
      {/* Admin routes - flattened for better performance */}
      <Route path="/admin" element={<AdminGuard><AdminLayout><AdminDashboard /></AdminLayout></AdminGuard>} />
      <Route path="/admin/dashboard" element={<AdminGuard><AdminLayout><Suspense fallback={<div className="p-4">Loading...</div>}><AdminDashboard /></Suspense></AdminLayout></AdminGuard>} />
      <Route path="/admin/products" element={<AdminGuard><AdminLayout><Suspense fallback={<div className="p-4">Loading...</div>}><AdminProducts /></Suspense></AdminLayout></AdminGuard>} />
      <Route path="/admin/orders" element={<AdminGuard><AdminLayout><Suspense fallback={<div className="p-4">Loading...</div>}><AdminOrders /></Suspense></AdminLayout></AdminGuard>} />
      <Route path="/admin/users" element={<AdminGuard><AdminLayout><Suspense fallback={<div className="p-4">Loading...</div>}><AdminUsers /></Suspense></AdminLayout></AdminGuard>} />
      <Route path="/admin/recipes" element={<AdminGuard><AdminLayout><Suspense fallback={<div className="p-4">Loading...</div>}><AdminRecipes /></Suspense></AdminLayout></AdminGuard>} />
      <Route path="/admin/blog" element={<AdminGuard><AdminLayout><Suspense fallback={<div className="p-4">Loading...</div>}><AdminBlog /></Suspense></AdminLayout></AdminGuard>} />
      <Route path="/admin/newsletter" element={<AdminGuard><AdminLayout><Suspense fallback={<div className="p-4">Loading...</div>}><AdminNewsletter /></Suspense></AdminLayout></AdminGuard>} />
      <Route path="/admin/analytics" element={<AdminGuard><AdminLayout><Suspense fallback={<div className="p-4">Loading...</div>}><AdminAnalytics /></Suspense></AdminLayout></AdminGuard>} />
      <Route path="/admin/notifications" element={<AdminGuard><AdminLayout><Suspense fallback={<div className="p-4">Loading...</div>}><AdminNotifications /></Suspense></AdminLayout></AdminGuard>} />
      <Route path="/admin/system" element={<AdminGuard><AdminLayout><Suspense fallback={<div className="p-4">Loading...</div>}><AdminSystem /></Suspense></AdminLayout></AdminGuard>} />
      <Route path="/admin/settings" element={<AdminGuard><AdminLayout><Suspense fallback={<div className="p-4">Loading...</div>}><AdminSettings /></Suspense></AdminLayout></AdminGuard>} />
      <Route path="/admin/wholesale" element={<AdminGuard><AdminLayout><Suspense fallback={<div className="p-4">Loading...</div>}><AdminWholesale /></Suspense></AdminLayout></AdminGuard>} />
      <Route path="/admin/stores" element={<AdminGuard><AdminLayout><Suspense fallback={<div className="p-4">Loading...</div>}><AdminStores /></Suspense></AdminLayout></AdminGuard>} />
      <Route path="/admin/hero" element={<AdminGuard><AdminLayout><Suspense fallback={<div className="p-4">Loading...</div>}><AdminHero /></Suspense></AdminLayout></AdminGuard>} />
      <Route path="/admin/reviews" element={<AdminGuard><AdminLayout><Suspense fallback={<div className="p-4">Loading...</div>}><AdminReviews /></Suspense></AdminLayout></AdminGuard>} />
      <Route path="/admin/support" element={<AdminGuard><AdminLayout><Suspense fallback={<div className="p-4">Loading...</div>}><AdminSupport /></Suspense></AdminLayout></AdminGuard>} />
      <Route path="/admin/discounts" element={<AdminGuard><AdminLayout><Suspense fallback={<div className="p-4">Loading...</div>}><AdminDiscounts /></Suspense></AdminLayout></AdminGuard>} />
      
      <Route path="/admin/payment-analytics" element={<AdminGuard><AdminLayout><Suspense fallback={<div className="p-4">Loading...</div>}><AdminPaymentAnalytics /></Suspense></AdminLayout></AdminGuard>} />
      <Route path="/admin/audit-log" element={<AdminGuard><AdminLayout><Suspense fallback={<div className="p-4">Loading...</div>}><AdminAuditLog /></Suspense></AdminLayout></AdminGuard>} />
      <Route path="/admin/payments" element={<AdminGuard><AdminLayout><Suspense fallback={<div className="p-4">Loading...</div>}><AdminPayments /></Suspense></AdminLayout></AdminGuard>} />
      <Route path="/admin/seo-center" element={<AdminGuard><AdminLayout><Suspense fallback={<div className="p-4">Loading...</div>}><AdminSEOCenter /></Suspense></AdminLayout></AdminGuard>} />
      <Route path="/admin/seo" element={<AdminGuard><AdminLayout><Suspense fallback={<div className="p-4">Loading...</div>}><AdminSEOCenter /></Suspense></AdminLayout></AdminGuard>} />
      <Route path="/admin/google-analytics" element={<AdminGuard><AdminLayout><Suspense fallback={<div className="p-4">Loading...</div>}><AdminGoogleAnalytics /></Suspense></AdminLayout></AdminGuard>} />
      <Route path="/admin/site-settings" element={<AdminGuard><AdminLayout><Suspense fallback={<div className="p-4">Loading...</div>}><AdminSiteSettings /></Suspense></AdminLayout></AdminGuard>} />
      <Route path="/admin/neural-evolution" element={<AdminGuard><AdminLayout><Suspense fallback={<div className="p-4">Loading...</div>}><AdminNeuralEvolution /></Suspense></AdminLayout></AdminGuard>} />
      
      {/* Error routes */}
      <Route path="/500" element={<ServerError />} />
      
      {/* 404 route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

// Wrapper component to conditionally render FloatingDaveAssistant
function ConditionalFloatingDave() {
  const location = useLocation();
  
  // Never show floating Dave on the FlavaDave page to prevent dual conversations
  if (location.pathname === '/flava-dave') {
    return null;
  }
  
  return <FloatingDaveAssistant />;
}

function App() {
  // Optimize startup by deferring non-critical initialization
  React.useEffect(() => {
    // Defer non-critical resource preloading
    const timer = setTimeout(() => {
      preloadCriticalResources();
      
      // Initialize Google Analytics - Production Ready
      if (import.meta.env.PROD || import.meta.env.VITE_GA_ENABLE_DEV) {
        initGA(); // Initialize Google Analytics in production or when explicitly enabled
      }
    }, 100); // Delay by 100ms to improve startup time
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthProvider>
            <CartProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <DaveSessionProvider>
                  <ScrollToTop />
                  <DeploymentOptimizer />
                  <Router />
                  <ConditionalFloatingDave />
                  <PWAInstallPrompt />
                  {/* Unified FlavaDave system - no duplicate instances */}
                </DaveSessionProvider>
              </BrowserRouter>
            </CartProvider>
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;