// Universal App Router v1.2.0 — eager page imports (no React.lazy)
// Lazy-loading removed: lazy pages threw React #426 on click-navigation
// (suspend during synchronous input). Eager imports = no suspension, ever.
// Locked UNIVERSAL template — works for ANY gig type.
// Provides: Login, Register, Dashboard, NotFound + protected layout.
// Gig-specific routes are added by gig-specific App.tsx overrides.
// If no gig override exists, this generic router handles everything.

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Home from '@/pages/Home';
import NotFound from '@/pages/NotFound';
import Dashboard from '@/pages/Dashboard';
import OperatorPage from '@/pages/OperatorPage';
import MarketingTemplatePage from '@/pages/MarketingTemplatePage';
import AnalyticsPage from '@/pages/AnalyticsPage';
import UserPage from '@/pages/UserPage';
import LocationPage from '@/pages/LocationPage';
import ProductPage from '@/pages/ProductPage';
import RoutePage from '@/pages/RoutePage';
import LeadPage from '@/pages/LeadPage';
import EmailSequencePage from '@/pages/EmailSequencePage';
import OperatorWebsitePage from '@/pages/OperatorWebsitePage';
import MachinePage from '@/pages/MachinePage';
import ProposalPage from '@/pages/ProposalPage';
import EmailSendLogPage from '@/pages/EmailSendLogPage';
import InventoryPage from '@/pages/InventoryPage';
import TransactionPage from '@/pages/TransactionPage';
import AlertPage from '@/pages/AlertPage';
import ServiceVisitPage from '@/pages/ServiceVisitPage';
import AlertsPage from '@/pages/AlertsPage';
import DailyReportsPage from '@/pages/DailyReportsPage';
import EmailSendLogsPage from '@/pages/EmailSendLogsPage';
import EmailSequencesPage from '@/pages/EmailSequencesPage';
import InventoriesPage from '@/pages/InventoriesPage';
import LeadsPage from '@/pages/LeadsPage';
import LocationsPage from '@/pages/LocationsPage';
import MachinesPage from '@/pages/MachinesPage';
import MarketingTemplatesPage from '@/pages/MarketingTemplatesPage';
import OperatorWebsitesPage from '@/pages/OperatorWebsitesPage';
import OperatorsPage from '@/pages/OperatorsPage';
import ProductsPage from '@/pages/ProductsPage';
import ProposalsPage from '@/pages/ProposalsPage';
import RoutesPage from '@/pages/RoutesPage';
import ServiceVisitsPage from '@/pages/ServiceVisitsPage';
import TransactionsPage from '@/pages/TransactionsPage';
import UsersPage from '@/pages/UsersPage';
import MachineList from '@/pages/MachineList';
import MachineDetail from '@/pages/MachineDetail';
import LocationList from '@/pages/LocationList';
import ProductCatalog from '@/pages/ProductCatalog';
import InventoryManagement from '@/pages/InventoryManagement';
import TransactionHistory from '@/pages/TransactionHistory';
import AlertList from '@/pages/AlertList';
import RouteBuilder from '@/pages/RouteBuilder';
import ServiceVisitLog from '@/pages/ServiceVisitLog';
import RevenueReport from '@/pages/RevenueReport';
import UserManagement from '@/pages/UserManagement';
import Settings from '@/pages/Settings';
import OperatorDashboard from '@/pages/OperatorDashboard';
import MachineMap from '@/pages/MachineMap';
import InventoryRestock from '@/pages/InventoryRestock';
import AnalyticsDashboard from '@/pages/AnalyticsDashboard';
import LeadPipeline from '@/pages/LeadPipeline';
import ProposalBuilder from '@/pages/ProposalBuilder';
import RoutePlanner from '@/pages/RoutePlanner';
import WebsiteBuilder from '@/pages/WebsiteBuilder';
import EmailCampaigns from '@/pages/EmailCampaigns';

function App() {
  return (
    <Routes>
      {/* Public — no auth required */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected (active account required) */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
                  <Route path="operator" element={<OperatorPage />} />
            <Route path="marketing-template" element={<MarketingTemplatePage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="user" element={<UserPage />} />
            <Route path="location" element={<LocationPage />} />
            <Route path="product" element={<ProductPage />} />
            <Route path="route" element={<RoutePage />} />
            <Route path="lead" element={<LeadPage />} />
            <Route path="email-sequence" element={<EmailSequencePage />} />
            <Route path="operator-website" element={<OperatorWebsitePage />} />
            <Route path="machine" element={<MachinePage />} />
            <Route path="proposal" element={<ProposalPage />} />
            <Route path="email-send-log" element={<EmailSendLogPage />} />
            <Route path="inventory" element={<InventoryPage />} />
            <Route path="transaction" element={<TransactionPage />} />
            <Route path="alert" element={<AlertPage />} />
            <Route path="service-visit" element={<ServiceVisitPage />} />
            <Route path="alerts" element={<AlertsPage />} />
            <Route path="daily-reports" element={<DailyReportsPage />} />
            <Route path="email-send-logs" element={<EmailSendLogsPage />} />
            <Route path="email-sequences" element={<EmailSequencesPage />} />
            <Route path="inventories" element={<InventoriesPage />} />
            <Route path="leads" element={<LeadsPage />} />
            <Route path="locations" element={<LocationsPage />} />
            <Route path="machines" element={<MachinesPage />} />
            <Route path="marketing-templates" element={<MarketingTemplatesPage />} />
            <Route path="operator-websites" element={<OperatorWebsitesPage />} />
            <Route path="operators" element={<OperatorsPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="proposals" element={<ProposalsPage />} />
            <Route path="routes" element={<RoutesPage />} />
            <Route path="service-visits" element={<ServiceVisitsPage />} />
            <Route path="transactions" element={<TransactionsPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="machine-list" element={<MachineList />} />
            <Route path="machine-detail" element={<MachineDetail />} />
            <Route path="location-list" element={<LocationList />} />
            <Route path="product-catalog" element={<ProductCatalog />} />
            <Route path="inventory-management" element={<InventoryManagement />} />
            <Route path="transaction-history" element={<TransactionHistory />} />
            <Route path="alert-list" element={<AlertList />} />
            <Route path="route-builder" element={<RouteBuilder />} />
            <Route path="service-visit-log" element={<ServiceVisitLog />} />
            <Route path="revenue-report" element={<RevenueReport />} />
            <Route path="user-management" element={<UserManagement />} />
            <Route path="settings" element={<Settings />} />
            <Route path="operator-dashboard" element={<OperatorDashboard />} />
            <Route path="machine-map" element={<MachineMap />} />
            <Route path="inventory-restock" element={<InventoryRestock />} />
            <Route path="analytics-dashboard" element={<AnalyticsDashboard />} />
            <Route path="lead-pipeline" element={<LeadPipeline />} />
            <Route path="proposal-builder" element={<ProposalBuilder />} />
            <Route path="route-planner" element={<RoutePlanner />} />
            <Route path="website-builder" element={<WebsiteBuilder />} />
            <Route path="email-campaigns" element={<EmailCampaigns />} />
</Route>

      {/* Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
