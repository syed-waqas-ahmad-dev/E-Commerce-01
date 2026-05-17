import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import LoginPage from './pages/LoginPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import WishlistPage from './pages/WishlistPage';
import TrackOrderPage from './pages/TrackOrderPage';
import AccountPage from './pages/AccountPage';
import BlogPage from './pages/BlogPage';
import ContactPage from './pages/ContactPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import NotFound from './pages/NotFound';
import type { ReactNode } from 'react';

export interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
  /** Accessible without login. Routes without this flag require authentication. Has no effect when RouteGuard is not in use. */
  public?: boolean;
}

export const routes: RouteConfig[] = [
  {
    name: 'Home',
    path: '/',
    element: <HomePage />,
    public: true,
  },
  {
    name: 'Products',
    path: '/products',
    element: <ProductsPage />,
    public: true,
  },
  {
    name: 'Product Detail',
    path: '/products/:id',
    element: <ProductDetailPage />,
    public: true,
  },
  {
    name: 'Cart',
    path: '/cart',
    element: <CartPage />,
    public: true,
  },
  {
    name: 'Checkout',
    path: '/checkout',
    element: <CheckoutPage />,
    public: false,
  },
  {
    name: 'Payment Success',
    path: '/payment-success',
    element: <PaymentSuccessPage />,
    public: true,
  },
  {
    name: 'Login',
    path: '/login',
    element: <LoginPage />,
    public: true,
  },
  {
    name: 'Account',
    path: '/account',
    element: <AccountPage />,
    public: false,
  },
  {
    name: 'Order History',
    path: '/account/orders',
    element: <OrderHistoryPage />,
    public: false,
  },
  {
    name: 'Wishlist',
    path: '/wishlist',
    element: <WishlistPage />,
    public: false,
  },
  {
    name: 'Track Order',
    path: '/track-order',
    element: <TrackOrderPage />,
    public: true,
  },
  {
    name: 'Blog',
    path: '/blog',
    element: <BlogPage />,
    public: true,
  },
  {
    name: 'Contact',
    path: '/contact',
    element: <ContactPage />,
    public: true,
  },
  {
    name: 'Admin Dashboard',
    path: '/admin',
    element: <AdminDashboardPage />,
    public: false,
  },
  {
    name: 'Admin Products',
    path: '/admin/products',
    element: <AdminProductsPage />,
    public: false,
  },
  {
    name: 'Admin Orders',
    path: '/admin/orders',
    element: <AdminOrdersPage />,
    public: false,
  },
  {
    name: 'Admin Users',
    path: '/admin/users',
    element: <AdminUsersPage />,
    public: false,
  },
  {
    name: 'Not Found',
    path: '*',
    element: <NotFound />,
    public: true,
  },
];

