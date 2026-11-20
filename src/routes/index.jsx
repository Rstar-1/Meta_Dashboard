import React from "react";
import { Routes, Route, Navigate } from 'react-router-dom';
import { canAccessPage, useCurrentUser } from '../utils';

// 🧩 Layout
import Layout from '../components/layout/Layout';
import Loader from '../components/common/generic/Loader';

// 🛡️ Route Guard
const ProtectedRoute = React.memo(({ page, children }) => {
    const { user, role } = useCurrentUser();
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const isLoggedIn = Boolean(token && token !== "null" && token !== "undefined");

    // When user is not logged in, NO route except Dashboard is accessible
    if (!isLoggedIn) {
        if (page === "Dashboard") {
            return children;
        }
        return <Navigate to="/dashboard" replace />;
    }

    if (!canAccessPage(user || role, page)) {
        return <Navigate to="/dashboard" replace />;
    }
    return children;
});
ProtectedRoute.displayName = "ProtectedRoute";

// 📦 Lazy Pages
const Dashboard = React.lazy(() => import('../pages/dashboard/Dashboard'));

// Settings Pages
const User = React.lazy(() => import('../pages/settings/User'));
const Role = React.lazy(() => import('../pages/settings/Role'));
const Profile = React.lazy(() => import('../pages/settings/Profile'));
const Domain = React.lazy(() => import('../pages/settings/Domain'));

// Architecture Page
const Architecture = React.lazy(() => import('../pages/architecture/Architecture'));

// Campaign Page
const Campaign = React.lazy(() => import('../pages/campaign/Campaign'));

// Management Pages
const Location = React.lazy(() => import('../pages/management/Location'));
const Leads = React.lazy(() => import('../pages/management/Leads'));

// Category Pages
const CategoryProducts = React.lazy(() => import('../pages/category/Products'));
const CategoryBlogs = React.lazy(() => import('../pages/category/Blogs'));

// Overview Pages
const OverviewProducts = React.lazy(() => import('../pages/overview/Products'));
const OverviewBlogs = React.lazy(() => import('../pages/overview/Blogs'));
const OverviewSeo = React.lazy(() => import('../pages/overview/Seo'));

function AppRoutes() {
    return (
        <React.Suspense fallback={<Loader />}>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Navigate to="/dashboard" replace />} />
                    <Route path="profile" element={<ProtectedRoute page="Profile"><Profile /></ProtectedRoute>} />
                    <Route path="settings/profile" element={<ProtectedRoute page="Profile"><Profile /></ProtectedRoute>} />
                    <Route path="dashboard" element={<ProtectedRoute page="Dashboard"><Dashboard /></ProtectedRoute>} />

                    {/* Category Routes */}
                    <Route path="category/products" element={<CategoryProducts />} />
                    <Route path="category/blogs" element={<CategoryBlogs />} />

                    {/* Overview Routes */}
                    <Route path="overview/products" element={<OverviewProducts />} />
                    <Route path="overview/blogs" element={<OverviewBlogs />} />
                    <Route path="overview/seo" element={<OverviewSeo />} />

                    {/* Settings Routes */}
                    <Route path="settings/users" element={<User />} />
                    <Route path="settings/roles" element={<Role />} />
                    <Route path="settings/domain" element={<Domain />} />
                    <Route path="domain" element={<Navigate to="/settings/domain" replace />} />
                    <Route path="users" element={<Navigate to="/settings/users" replace />} />
                    <Route path="roles" element={<Navigate to="/settings/roles" replace />} />

                    {/* Architecture Route */}
                    <Route path="architecture" element={<Architecture />} />

                    {/* Campaign Routes */}
                    <Route path="campaign" element={<Navigate to="/campaign/whatsapp" replace />} />
                    <Route path="campaign/whasapp" element={<Navigate to="/campaign/whatsapp" replace />} />
                    <Route path="campaign/:channel" element={<Campaign />} />

                    {/* Management Routes */}
                    <Route path="management" element={<Navigate to="/management/location" replace />} />
                    <Route path="management/location" element={<Location />} />
                    <Route path="management/leads" element={<Leads />} />
                    <Route path="management/whatsapp" element={<Navigate to="/management/location" replace />} />
                    <Route path="management/gmail" element={<Navigate to="/management/leads" replace />} />
                    <Route path="location" element={<Navigate to="/management/location" replace />} />
                    <Route path="leads" element={<Navigate to="/management/leads" replace />} />
                </Route>
                <Route path="*" element={<h2 style={{ textAlign: 'center', padding: '100px 20px' }}>404 - Page Not Found</h2>} />
            </Routes>
        </React.Suspense>
    );
}

export default AppRoutes;
