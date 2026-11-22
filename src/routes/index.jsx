import React from "react";
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { canAccessPage, useCurrentUser } from '../utils';

// 🧩 Layout
import Layout from '../components/layout/Layout';
import Loader from '../components/common/generic/Loader';

// 🛡️ Route Guard
const ProtectedRoute = React.memo(({ page, children }) => {
    const { user, role } = useCurrentUser();
    const location = useLocation();
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const isLoggedIn = Boolean(token && token !== "null" && token !== "undefined");

    // When user is not logged in, NO route except Dashboard is accessible
    if (!isLoggedIn) {
        if (page === "Dashboard") {
            return children;
        }
        return <Navigate to="/dashboard" replace />;
    }

    // Granular protection for specific campaign channels
    if (location.pathname.startsWith("/campaign/")) {
        const channelPart = location.pathname.split("/")[2]?.toLowerCase();
        if (channelPart === "sms" && !canAccessPage(user || role, "SMS Campaign", "Campaign")) {
            return <Navigate to="/campaign/whatsapp" replace />;
        }
        if (channelPart === "gmail" && !canAccessPage(user || role, "Gmail Campaign", "Campaign")) {
            return <Navigate to="/campaign/whatsapp" replace />;
        }
        if (channelPart === "whatsapp" && !canAccessPage(user || role, "Whatsapp Campaign", "Campaign")) {
            return <Navigate to="/dashboard" replace />;
        }
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
                    <Route path="category/products" element={<ProtectedRoute page="Products Category"><CategoryProducts /></ProtectedRoute>} />
                    <Route path="category/blogs" element={<ProtectedRoute page="Blogs Category"><CategoryBlogs /></ProtectedRoute>} />

                    {/* Overview Routes */}
                    <Route path="overview/products" element={<ProtectedRoute page="Products"><OverviewProducts /></ProtectedRoute>} />
                    <Route path="overview/blogs" element={<ProtectedRoute page="Blogs"><OverviewBlogs /></ProtectedRoute>} />
                    <Route path="overview/seo" element={<ProtectedRoute page="SEO"><OverviewSeo /></ProtectedRoute>} />

                    {/* Settings Routes */}
                    <Route path="settings/users" element={<ProtectedRoute page="System Users"><User /></ProtectedRoute>} />
                    <Route path="settings/roles" element={<ProtectedRoute page="Roles"><Role /></ProtectedRoute>} />
                    <Route path="settings/domain" element={<ProtectedRoute page="Domain"><Domain /></ProtectedRoute>} />
                    <Route path="domain" element={<Navigate to="/settings/domain" replace />} />
                    <Route path="users" element={<Navigate to="/settings/users" replace />} />
                    <Route path="roles" element={<Navigate to="/settings/roles" replace />} />

                    {/* Architecture Route */}
                    <Route path="architecture" element={<ProtectedRoute page="Architecture"><Architecture /></ProtectedRoute>} />

                    {/* Campaign Routes */}
                    <Route path="campaign" element={<Navigate to="/campaign/whatsapp" replace />} />
                    <Route path="campaign/whasapp" element={<Navigate to="/campaign/whatsapp" replace />} />
                    <Route path="campaign/:channel" element={<ProtectedRoute page="Campaign"><Campaign /></ProtectedRoute>} />

                    {/* Management Routes */}
                    <Route path="management" element={<Navigate to="/management/location" replace />} />
                    <Route path="management/location" element={<ProtectedRoute page="Location"><Location /></ProtectedRoute>} />
                    <Route path="management/leads" element={<ProtectedRoute page="Leads"><Leads /></ProtectedRoute>} />
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
