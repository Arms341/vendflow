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
import NotFound from '@/pages/NotFound';
import Dashboard from '@/pages/Dashboard';

// NOTE: declared as `function App` with the default export at the bottom so
// FSB ROUTE-COVERAGE-INJECT (which splices lazy consts in just before
// `function App`) can never split an `export default function` statement.
const AlertsDetailPage = React.lazy(() => import('@/pages/AlertsDetailPage'));
const AnalyticsDetailPage = React.lazy(() => import('@/pages/AnalyticsDetailPage'));
const DailyReportsDetailPage = React.lazy(() => import('@/pages/DailyReportsDetailPage'));
const EmailSendLogsDetailPage = React.lazy(() => import('@/pages/EmailSendLogsDetailPage'));
const EmailSequencesDetailPage = React.lazy(() => import('@/pages/EmailSequencesDetailPage'));
const InventoriesDetailPage = React.lazy(() => import('@/pages/InventoriesDetailPage'));
const LandownerPayoutsDetailPage = React.lazy(() => import('@/pages/LandownerPayoutsDetailPage'));
const LandownersDetailPage = React.lazy(() => import('@/pages/LandownersDetailPage'));
const LeadsDetailPage = React.lazy(() => import('@/pages/LeadsDetailPage'));
const LocationsDetailPage = React.lazy(() => import('@/pages/LocationsDetailPage'));
const MachinesDetailPage = React.lazy(() => import('@/pages/MachinesDetailPage'));
const MarketingTemplatesDetailPage = React.lazy(() => import('@/pages/MarketingTemplatesDetailPage'));
const OperatorWebsitesDetailPage = React.lazy(() => import('@/pages/OperatorWebsitesDetailPage'));
const OperatorsDetailPage = React.lazy(() => import('@/pages/OperatorsDetailPage'));
const ProductsDetailPage = React.lazy(() => import('@/pages/ProductsDetailPage'));
const ProposalsDetailPage = React.lazy(() => import('@/pages/ProposalsDetailPage'));
const RevenueShareAgreementsDetailPage = React.lazy(() => import('@/pages/RevenueShareAgreementsDetailPage'));
const RoutesDetailPage = React.lazy(() => import('@/pages/RoutesDetailPage'));
const ServiceVisitsDetailPage = React.lazy(() => import('@/pages/ServiceVisitsDetailPage'));
const StandingOrdersDetailPage = React.lazy(() => import('@/pages/StandingOrdersDetailPage'));
const TransactionsDetailPage = React.lazy(() => import('@/pages/TransactionsDetailPage'));
const UsersDetailPage = React.lazy(() => import('@/pages/UsersDetailPage'));
const WholesaleAccountsDetailPage = React.lazy(() => import('@/pages/WholesaleAccountsDetailPage'));
const WholesaleOrdersDetailPage = React.lazy(() => import('@/pages/WholesaleOrdersDetailPage'));

const AlertsFormPage = React.lazy(() => import('@/pages/AlertsFormPage'));
const AnalyticsFormPage = React.lazy(() => import('@/pages/AnalyticsFormPage'));
const DailyReportsFormPage = React.lazy(() => import('@/pages/DailyReportsFormPage'));
const EmailSendLogsFormPage = React.lazy(() => import('@/pages/EmailSendLogsFormPage'));
const EmailSequencesFormPage = React.lazy(() => import('@/pages/EmailSequencesFormPage'));
const InventoriesFormPage = React.lazy(() => import('@/pages/InventoriesFormPage'));
const LandownerPayoutsFormPage = React.lazy(() => import('@/pages/LandownerPayoutsFormPage'));
const LandownersFormPage = React.lazy(() => import('@/pages/LandownersFormPage'));
const LeadsFormPage = React.lazy(() => import('@/pages/LeadsFormPage'));
const LocationsFormPage = React.lazy(() => import('@/pages/LocationsFormPage'));
const MachinesFormPage = React.lazy(() => import('@/pages/MachinesFormPage'));
const MarketingTemplatesFormPage = React.lazy(() => import('@/pages/MarketingTemplatesFormPage'));
const OperatorWebsitesFormPage = React.lazy(() => import('@/pages/OperatorWebsitesFormPage'));
const OperatorsFormPage = React.lazy(() => import('@/pages/OperatorsFormPage'));
const ProductsFormPage = React.lazy(() => import('@/pages/ProductsFormPage'));
const ProposalsFormPage = React.lazy(() => import('@/pages/ProposalsFormPage'));
const RevenueShareAgreementsFormPage = React.lazy(() => import('@/pages/RevenueShareAgreementsFormPage'));
const RoutesFormPage = React.lazy(() => import('@/pages/RoutesFormPage'));
const ServiceVisitsFormPage = React.lazy(() => import('@/pages/ServiceVisitsFormPage'));
const StandingOrdersFormPage = React.lazy(() => import('@/pages/StandingOrdersFormPage'));
const TransactionsFormPage = React.lazy(() => import('@/pages/TransactionsFormPage'));
const WholesaleAccountsFormPage = React.lazy(() => import('@/pages/WholesaleAccountsFormPage'));
const WholesaleOrdersFormPage = React.lazy(() => import('@/pages/WholesaleOrdersFormPage'));

const AlertsPage = React.lazy(() => import('@/pages/AlertsPage'));
const AnalyticsPage = React.lazy(() => import('@/pages/AnalyticsPage'));
const DailyReportsPage = React.lazy(() => import('@/pages/DailyReportsPage'));
const EmailSendLogsPage = React.lazy(() => import('@/pages/EmailSendLogsPage'));
const EmailSequencesPage = React.lazy(() => import('@/pages/EmailSequencesPage'));
const InventoriesPage = React.lazy(() => import('@/pages/InventoriesPage'));
const LandownerPayoutsPage = React.lazy(() => import('@/pages/LandownerPayoutsPage'));
const LandownersPage = React.lazy(() => import('@/pages/LandownersPage'));
const LeadsPage = React.lazy(() => import('@/pages/LeadsPage'));
const LocationsPage = React.lazy(() => import('@/pages/LocationsPage'));
const MachinesPage = React.lazy(() => import('@/pages/MachinesPage'));
const MarketingTemplatesPage = React.lazy(() => import('@/pages/MarketingTemplatesPage'));
const OperatorWebsitesPage = React.lazy(() => import('@/pages/OperatorWebsitesPage'));
const OperatorsPage = React.lazy(() => import('@/pages/OperatorsPage'));
const ProductsPage = React.lazy(() => import('@/pages/ProductsPage'));
const ProposalsPage = React.lazy(() => import('@/pages/ProposalsPage'));
const RevenueShareAgreementsPage = React.lazy(() => import('@/pages/RevenueShareAgreementsPage'));
const RoutesPage = React.lazy(() => import('@/pages/RoutesPage'));
const ServiceVisitsPage = React.lazy(() => import('@/pages/ServiceVisitsPage'));
const StandingOrdersPage = React.lazy(() => import('@/pages/StandingOrdersPage'));
const TransactionsPage = React.lazy(() => import('@/pages/TransactionsPage'));
const UsersPage = React.lazy(() => import('@/pages/UsersPage'));
const WholesaleAccountsPage = React.lazy(() => import('@/pages/WholesaleAccountsPage'));
const WholesaleOrdersPage = React.lazy(() => import('@/pages/WholesaleOrdersPage'));

const MarketingDashboard = React.lazy(() => import('@/pages/MarketingDashboard'));


const OperatorDashboard = React.lazy(() => import('@/pages/OperatorDashboard'));
const MachineMap = React.lazy(() => import('@/pages/MachineMap'));
const MachineDetail = React.lazy(() => import('@/pages/MachineDetail'));
const InventoryRestock = React.lazy(() => import('@/pages/InventoryRestock'));
const AnalyticsDashboard = React.lazy(() => import('@/pages/AnalyticsDashboard'));
const LeadPipeline = React.lazy(() => import('@/pages/LeadPipeline'));
const ProposalBuilder = React.lazy(() => import('@/pages/ProposalBuilder'));
const RoutePlanner = React.lazy(() => import('@/pages/RoutePlanner'));
const WebsiteBuilder = React.lazy(() => import('@/pages/WebsiteBuilder'));
const EmailCampaigns = React.lazy(() => import('@/pages/EmailCampaigns'));
const Pricing = React.lazy(() => import('@/pages/Pricing'));

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
                  <Route path="alerts/:id" element={<AlertsDetailPage />} />
            <Route path="analytics/:id" element={<AnalyticsDetailPage />} />
            <Route path="daily-reports/:id" element={<DailyReportsDetailPage />} />
            <Route path="email-send-logs/:id" element={<EmailSendLogsDetailPage />} />
            <Route path="email-sequences/:id" element={<EmailSequencesDetailPage />} />
            <Route path="inventories/:id" element={<InventoriesDetailPage />} />
            <Route path="landowner-payouts/:id" element={<LandownerPayoutsDetailPage />} />
            <Route path="landowners/:id" element={<LandownersDetailPage />} />
            <Route path="leads/:id" element={<LeadsDetailPage />} />
            <Route path="locations/:id" element={<LocationsDetailPage />} />
            <Route path="machines/:id" element={<MachinesDetailPage />} />
            <Route path="marketing-templates/:id" element={<MarketingTemplatesDetailPage />} />
            <Route path="operator-websites/:id" element={<OperatorWebsitesDetailPage />} />
            <Route path="operators/:id" element={<OperatorsDetailPage />} />
            <Route path="products/:id" element={<ProductsDetailPage />} />
            <Route path="proposals/:id" element={<ProposalsDetailPage />} />
            <Route path="revenue-share-agreements/:id" element={<RevenueShareAgreementsDetailPage />} />
            <Route path="routes/:id" element={<RoutesDetailPage />} />
            <Route path="service-visits/:id" element={<ServiceVisitsDetailPage />} />
            <Route path="standing-orders/:id" element={<StandingOrdersDetailPage />} />
            <Route path="transactions/:id" element={<TransactionsDetailPage />} />
            <Route path="users/:id" element={<UsersDetailPage />} />
            <Route path="wholesale-accounts/:id" element={<WholesaleAccountsDetailPage />} />
            <Route path="wholesale-orders/:id" element={<WholesaleOrdersDetailPage />} />
            <Route path="alerts/new" element={<AlertsFormPage />} />
            <Route path="alerts/:id/edit" element={<AlertsFormPage />} />
            <Route path="analytics/new" element={<AnalyticsFormPage />} />
            <Route path="analytics/:id/edit" element={<AnalyticsFormPage />} />
            <Route path="daily-reports/new" element={<DailyReportsFormPage />} />
            <Route path="daily-reports/:id/edit" element={<DailyReportsFormPage />} />
            <Route path="email-send-logs/new" element={<EmailSendLogsFormPage />} />
            <Route path="email-send-logs/:id/edit" element={<EmailSendLogsFormPage />} />
            <Route path="email-sequences/new" element={<EmailSequencesFormPage />} />
            <Route path="email-sequences/:id/edit" element={<EmailSequencesFormPage />} />
            <Route path="inventories/new" element={<InventoriesFormPage />} />
            <Route path="inventories/:id/edit" element={<InventoriesFormPage />} />
            <Route path="landowner-payouts/new" element={<LandownerPayoutsFormPage />} />
            <Route path="landowner-payouts/:id/edit" element={<LandownerPayoutsFormPage />} />
            <Route path="landowners/new" element={<LandownersFormPage />} />
            <Route path="landowners/:id/edit" element={<LandownersFormPage />} />
            <Route path="leads/new" element={<LeadsFormPage />} />
            <Route path="leads/:id/edit" element={<LeadsFormPage />} />
            <Route path="locations/new" element={<LocationsFormPage />} />
            <Route path="locations/:id/edit" element={<LocationsFormPage />} />
            <Route path="machines/new" element={<MachinesFormPage />} />
            <Route path="machines/:id/edit" element={<MachinesFormPage />} />
            <Route path="marketing-templates/new" element={<MarketingTemplatesFormPage />} />
            <Route path="marketing-templates/:id/edit" element={<MarketingTemplatesFormPage />} />
            <Route path="operator-websites/new" element={<OperatorWebsitesFormPage />} />
            <Route path="operator-websites/:id/edit" element={<OperatorWebsitesFormPage />} />
            <Route path="operators/new" element={<OperatorsFormPage />} />
            <Route path="operators/:id/edit" element={<OperatorsFormPage />} />
            <Route path="products/new" element={<ProductsFormPage />} />
            <Route path="products/:id/edit" element={<ProductsFormPage />} />
            <Route path="proposals/new" element={<ProposalsFormPage />} />
            <Route path="proposals/:id/edit" element={<ProposalsFormPage />} />
            <Route path="revenue-share-agreements/new" element={<RevenueShareAgreementsFormPage />} />
            <Route path="revenue-share-agreements/:id/edit" element={<RevenueShareAgreementsFormPage />} />
            <Route path="routes/new" element={<RoutesFormPage />} />
            <Route path="routes/:id/edit" element={<RoutesFormPage />} />
            <Route path="service-visits/new" element={<ServiceVisitsFormPage />} />
            <Route path="service-visits/:id/edit" element={<ServiceVisitsFormPage />} />
            <Route path="standing-orders/new" element={<StandingOrdersFormPage />} />
            <Route path="standing-orders/:id/edit" element={<StandingOrdersFormPage />} />
            <Route path="transactions/new" element={<TransactionsFormPage />} />
            <Route path="transactions/:id/edit" element={<TransactionsFormPage />} />
            <Route path="wholesale-accounts/new" element={<WholesaleAccountsFormPage />} />
            <Route path="wholesale-accounts/:id/edit" element={<WholesaleAccountsFormPage />} />
            <Route path="wholesale-orders/new" element={<WholesaleOrdersFormPage />} />
            <Route path="wholesale-orders/:id/edit" element={<WholesaleOrdersFormPage />} />
            <Route path="alerts" element={<AlertsPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="daily-reports" element={<DailyReportsPage />} />
            <Route path="email-send-logs" element={<EmailSendLogsPage />} />
            <Route path="email-sequences" element={<EmailSequencesPage />} />
            <Route path="inventories" element={<InventoriesPage />} />
            <Route path="landowner-payouts" element={<LandownerPayoutsPage />} />
            <Route path="landowners" element={<LandownersPage />} />
            <Route path="leads" element={<LeadsPage />} />
            <Route path="locations" element={<LocationsPage />} />
            <Route path="machines" element={<MachinesPage />} />
            <Route path="marketing-templates" element={<MarketingTemplatesPage />} />
            <Route path="operator-websites" element={<OperatorWebsitesPage />} />
            <Route path="operators" element={<OperatorsPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="proposals" element={<ProposalsPage />} />
            <Route path="revenue-share-agreements" element={<RevenueShareAgreementsPage />} />
            <Route path="routes" element={<RoutesPage />} />
            <Route path="service-visits" element={<ServiceVisitsPage />} />
            <Route path="standing-orders" element={<StandingOrdersPage />} />
            <Route path="transactions" element={<TransactionsPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="wholesale-accounts" element={<WholesaleAccountsPage />} />
            <Route path="wholesale-orders" element={<WholesaleOrdersPage />} />
            <Route path="marketing" element={<MarketingDashboard />} />
            <Route path="operator-dashboard" element={<OperatorDashboard />} />
            <Route path="machine-map" element={<MachineMap />} />
            <Route path="machine-detail" element={<MachineDetail />} />
            <Route path="inventory-restock" element={<InventoryRestock />} />
            <Route path="analytics-dashboard" element={<AnalyticsDashboard />} />
            <Route path="lead-pipeline" element={<LeadPipeline />} />
            <Route path="proposal-builder" element={<ProposalBuilder />} />
            <Route path="route-planner" element={<RoutePlanner />} />
            <Route path="website-builder" element={<WebsiteBuilder />} />
            <Route path="email-campaigns" element={<EmailCampaigns />} />
            <Route path="pricing" element={<Pricing />} />
</Route>

      {/* Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
