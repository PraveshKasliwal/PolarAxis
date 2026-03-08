import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import AppShell from './components/layout/AppShell';
import LandingPage from './pages/landing/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ClientDashboard from './pages/client/ClientDashboard';
import OpsDashboard from './pages/ops/OpsDashboard';
import ShipmentTracking from './pages/shared/ShipmentTracking';
import AlertCenter from './pages/shared/AlertCenter';
import Settings from './pages/shared/Settings';
import Placeholder from './pages/shared/Placeholder';
import ProcurementMarketplace from './pages/procurement/ProcurementMarketplace';
import NewLogisticsOrder from './pages/orders/NewLogisticsOrder';
import ComplianceDocuments from './pages/compliance/ComplianceDocuments';
import ColdStorageMap from './pages/storage/ColdStorageMap';
import MyShipments from './pages/shared/MyShipments';
import ShipmentsByMode from './pages/shared/ShipmentsByMode';
import InventoryDashboard from './pages/ops/InventoryDashboard';
import TenantManagement from './pages/ops/TenantManagement';
import AnalyticsDashboard from './pages/ops/AnalyticsDashboard';
import SustainabilityDashboard from './pages/ops/SustainabilityDashboard';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

function AppRoutes() {
  const { currentUser } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route
        path="/client/dashboard"
        element={
          <PrivateRoute>
            <AppShell>
              <ClientDashboard />
            </AppShell>
          </PrivateRoute>
        }
      />

      <Route
        path="/client/shipments"
        element={
          <PrivateRoute>
            <AppShell>
              <MyShipments />
            </AppShell>
          </PrivateRoute>
        }
      />

      <Route
        path="/my-shipments"
        element={
          <PrivateRoute>
            <AppShell>
              <MyShipments />
            </AppShell>
          </PrivateRoute>
        }
      />

      <Route
        path="/ops/dashboard"
        element={
          <PrivateRoute>
            <AppShell>
              <OpsDashboard />
            </AppShell>
          </PrivateRoute>
        }
      />

      <Route
        path="/ops/shipments"
        element={
          <PrivateRoute>
            <AppShell>
              <MyShipments />
            </AppShell>
          </PrivateRoute>
        }
      />

      <Route
        path="/ops/shipments/:mode"
        element={
          <PrivateRoute>
            <AppShell>
              <ShipmentsByMode />
            </AppShell>
          </PrivateRoute>
        }
      />

      <Route
        path="/shipments"
        element={
          <PrivateRoute>
            <AppShell>
              <MyShipments />
            </AppShell>
          </PrivateRoute>
        }
      />

      <Route
        path="/shipments/track/:id"
        element={
          <PrivateRoute>
            <AppShell>
              <ShipmentTracking />
            </AppShell>
          </PrivateRoute>
        }
      />

      <Route
        path="/shipments/:mode"
        element={
          <PrivateRoute>
            <AppShell>
              <ShipmentsByMode />
            </AppShell>
          </PrivateRoute>
        }
      />

      <Route
        path="/procurement"
        element={
          <PrivateRoute>
            <AppShell>
              <ProcurementMarketplace />
            </AppShell>
          </PrivateRoute>
        }
      />

      <Route
        path="/orders/new"
        element={
          <PrivateRoute>
            <AppShell>
              <NewLogisticsOrder />
            </AppShell>
          </PrivateRoute>
        }
      />

      <Route
        path="/compliance"
        element={
          <PrivateRoute>
            <AppShell>
              <ComplianceDocuments />
            </AppShell>
          </PrivateRoute>
        }
      />

      <Route
        path="/alerts"
        element={
          <PrivateRoute>
            <AppShell>
              <AlertCenter />
            </AppShell>
          </PrivateRoute>
        }
      />

      <Route
        path="/cold-storage"
        element={
          <PrivateRoute>
            <AppShell>
              <ColdStorageMap />
            </AppShell>
          </PrivateRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <PrivateRoute>
            <AppShell>
              <Settings />
            </AppShell>
          </PrivateRoute>
        }
      />

      <Route
        path="/admin/tenants"
        element={
          <PrivateRoute>
            <AppShell>
              <TenantManagement />
            </AppShell>
          </PrivateRoute>
        }
      />

      <Route
        path="/inventory"
        element={
          <PrivateRoute>
            <AppShell>
              <InventoryDashboard />
            </AppShell>
          </PrivateRoute>
        }
      />

      <Route
        path="/sustainability"
        element={
          <PrivateRoute>
            <AppShell>
              <SustainabilityDashboard />
            </AppShell>
          </PrivateRoute>
        }
      />

      <Route
        path="/ops/analytics"
        element={
          <PrivateRoute>
            <AppShell>
              <AnalyticsDashboard />
            </AppShell>
          </PrivateRoute>
        }
      />

      <Route
        path="*"
        element={
          currentUser ? (
            <Navigate to={currentUser.role.includes('operations') ? '/ops/dashboard' : '/client/dashboard'} />
          ) : (
            <Navigate to="/" />
          )
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
            <AppRoutes />
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
