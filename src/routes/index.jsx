import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// 🧩 Layout
import Layout from '../components/layout/Layout';
import Loader from '../components/common/Loader';

// 📦 Lazy Pages
const Dashboard = lazy(() => import('../pages/dashboard/Dashboard'));
const Analytics = lazy(() => import('../pages/analytics/Analytics'));
const Product = lazy(() => import('../pages/product/Product'));
const Categories = lazy(() => import('../pages/category/Categories'));
const CMS = lazy(() => import('../pages/management/CMS'));
const Leads = lazy(() => import('../pages/management/Leads'));
const Meta = lazy(() => import('../pages/builder/Meta'));
const Users = lazy(() => import('../pages/users/Users'));
const Profile = lazy(() => import('../pages/profile/Profile'));
const Role = lazy(() => import('../pages/role/Role'));

function AppRoutes() {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="management/product" element={<Product />} />
          <Route path="management/categories" element={<Categories />} />
          <Route path="management/cms" element={<CMS />} />
          <Route path="management/leads" element={<Leads />} />
          <Route path="builder/meta" element={<Meta />} />
          <Route path="users" element={<Users />} />
          <Route path="profile" element={<Profile />} />
          <Route path="roles" element={<Role />} />
        </Route>
        <Route path="*" element={<h2 style={{ textAlign: 'center', padding: '100px 20px', fontFamily: 'Outfit, sans-serif' }}>404 - Page Not Found</h2>} />
      </Routes>
    </Suspense>
  );
}

export default AppRoutes;
