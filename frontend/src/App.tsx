// Universal App Router v1.1.0
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

// NOTE: declared as `function App` with the default export at the bottom so
// FSB ROUTE-COVERAGE-INJECT (which splices lazy consts in just before
// `function App`) can never split an `export default function` statement.
const OperatorPage = React.lazy(() => import('@/pages/OperatorPage'));
const MarketingTemplatePage = React.lazy(() => import('@/pages/MarketingTemplatePage'));
const AnalyticsPage = React.lazy(() => import('@/pages/AnalyticsPage'));
const UserPage = React.lazy(() => import('@/pages/UserPage'));
const LocationPage = React.lazy(() => import('@/pages/LocationPage'));
const ProductPage = React.lazy(() => import('@/pages/ProductPage'));
const RoutePage = React.lazy(() => import('@/pages/RoutePage'));
const LeadPage = React.lazy(() => import('@/pages/LeadPage'));
const EmailSequencePage = React.lazy(() => import('@/pages/EmailSequencePage'));
const OperatorWebsitePage = React.lazy(() => import('@/pages/OperatorWebsitePage'));
const MachinePage = React.lazy(() => import('@/pages/MachinePage'));
const ProposalPage = React.lazy(() => import('@/pages/ProposalPage'));
const EmailSendLogPage = React.lazy(() => import('@/pages/EmailSendLogPage'));
const InventoryPage = React.lazy(() => import('@/pages/InventoryPage'));
const TransactionPage = React.lazy(() => import('@/pages/TransactionPage'));
const AlertPage = React.lazy(() => import('@/pages/AlertPage'));
const ServiceVisitPage = React.lazy(() => import('@/pages/ServiceVisitPage'));
const AlertsPage = React.lazy(() => import('@/pages/AlertsPage'));
const DailyReportsPage = React.lazy(() => import('@/pages/DailyReportsPage'));
const EmailSendLogsPage = React.lazy(() => import('@/pages/EmailSendLogsPage'));
const EmailSequencesPage = React.lazy(() => import('@/pages/EmailSequencesPage'));
const InventoriesPage = React.lazy(() => import('@/pages/InventoriesPage'));
const LeadsPage = React.lazy(() => import('@/pages/LeadsPage'));
const LocationsPage = React.lazy(() => import('@/pages/LocationsPage'));
const MachinesPage = React.lazy(() => import('@/pages/MachinesPage'));
const MarketingTemplatesPage = React.lazy(() => import('@/pages/MarketingTemplatesPage'));
const OperatorWebsitesPage = React.lazy(() => import('@/pages/OperatorWebsitesPage'));
const OperatorsPage = React.lazy(() => import('@/pages/OperatorsPage'));
const ProductsPage = React.lazy(() => import('@/pages/ProductsPage'));
const ProposalsPage = React.lazy(() => import('@/pages/ProposalsPage'));
const RoutesPage = React.lazy(() => import('@/pages/RoutesPage'));
const ServiceVisitsPage = React.lazy(() => import('@/pages/ServiceVisitsPage'));
const TransactionsPage = React.lazy(() => import('@/pages/TransactionsPage'));
const UsersPage = React.lazy(() => import('@/pages/UsersPage'));

const MachineList = React.lazy(() => import('@/pages/MachineList'));
const MachineDetail = React.lazy(() => import('@/pages/MachineDetail'));
const LocationList = React.lazy(() => import('@/pages/LocationList'));
const ProductCatalog = React.lazy(() => import('@/pages/ProductCatalog'));
const InventoryManagement = React.lazy(() => import('@/pages/InventoryManagement'));
const TransactionHistory = React.lazy(() => import('@/pages/TransactionHistory'));
const AlertList = React.lazy(() => import('@/pages/AlertList'));
const RouteBuilder = React.lazy(() => import('@/pages/RouteBuilder'));
const ServiceVisitLog = React.lazy(() => import('@/pages/ServiceVisitLog'));
const RevenueReport = React.lazy(() => import('@/pages/RevenueReport'));
const UserManagement = React.lazy(() => import('@/pages/UserManagement'));
const Settings = React.lazy(() => import('@/pages/Settings'));
const OperatorDashboard = React.lazy(() => import('@/pages/OperatorDashboard'));
const MachineMap = React.lazy(() => import('@/pages/MachineMap'));
const InventoryRestock = React.lazy(() => import('@/pages/InventoryRestock'));
const AnalyticsDashboard = React.lazy(() => import('@/pages/AnalyticsDashboard'));
const LeadPipeline = React.lazy(() => import('@/pages/LeadPipeline'));
const ProposalBuilder = React.lazy(() => import('@/pages/ProposalBuilder'));
const RoutePlanner = React.lazy(() => import('@/pages/RoutePlanner'));
const WebsiteBuilder = React.lazy(() => import('@/pages/WebsiteBuilder'));
const EmailCampaigns = React.lazy(() => import('@/pages/EmailCampaigns'));

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
