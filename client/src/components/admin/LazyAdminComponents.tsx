import { lazy } from 'react';

// Lazy load heavy admin components for better performance
export const LazyAdminProducts = lazy(() => import('@/pages/admin/Products'));
export const LazyAdminOrders = lazy(() => import('@/pages/admin/Orders'));
export const LazyAdminUsers = lazy(() => import('@/pages/admin/Users'));
export const LazyAdminBlog = lazy(() => import('@/pages/admin/Blog'));
export const LazyAdminHero = lazy(() => import('@/pages/admin/Hero'));
export const LazyAdminSettings = lazy(() => import('@/pages/admin/Settings'));
export const LazyAdminWholesale = lazy(() => import('@/pages/admin/Wholesale'));
export const LazyAdminRecipes = lazy(() => import('@/pages/admin/Recipes'));
export const LazyAdminPayments = lazy(() => import('@/pages/admin/Payments'));

// Lazy load complex admin forms
export const LazyCreateProductDialog = lazy(() => import('@/components/admin/products/CreateProductDialog'));
export const LazyEditProductDialog = lazy(() => import('@/components/admin/products/EditProductDialog'));

// Lazy load data-heavy components
export const LazyRevenueChart = lazy(() => import('@/components/admin/RevenueChart'));
export const LazyInventoryManager = lazy(() => import('@/components/admin/InventoryManager'));
export const LazyAdminProductsTable = lazy(() => import('@/components/admin/products/AdminProductsTable'));