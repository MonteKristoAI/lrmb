import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/lib/auth";
import { I18nProvider } from "@/lib/i18n";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { InstallPrompt } from "@/components/pwa/InstallPrompt";
import { UpdatePrompt } from "@/components/pwa/UpdatePrompt";
import { OfflineBanner } from "@/components/pwa/OfflineBanner";
import { lazy, Suspense } from "react";

const Login = lazy(() => import("./pages/Login"));
const MyTasks = lazy(() => import("./pages/MyTasks"));
const CompletedTasks = lazy(() => import("./pages/CompletedTasks"));
const TaskDetail = lazy(() => import("./pages/TaskDetail"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const CreateTask = lazy(() => import("./pages/CreateTask"));
const OpenTasksQueue = lazy(() => import("./pages/OpenTasksQueue"));
const OverdueQueue = lazy(() => import("./pages/OverdueQueue"));
const BlockedQueue = lazy(() => import("./pages/BlockedQueue"));
const HousekeepingQueue = lazy(() => import("./pages/HousekeepingQueue"));
const InspectionQueue = lazy(() => import("./pages/InspectionQueue"));
const InspectionChecklist = lazy(() => import("./pages/InspectionChecklist"));
const SupervisorDashboard = lazy(() => import("./pages/SupervisorDashboard"));
const VerificationQueue = lazy(() => import("./pages/VerificationQueue"));
const KPIOverview = lazy(() => import("./pages/KPIOverview"));
const PropertyTasks = lazy(() => import("./pages/PropertyTasks"));
const StaffTasks = lazy(() => import("./pages/StaffTasks"));
const StaffWorkload = lazy(() => import("./pages/StaffWorkload"));
const TrendCharts = lazy(() => import("./pages/TrendCharts"));
const VendorManagement = lazy(() => import("./pages/VendorManagement"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2, // 2 minutes - reduces refetches for 79 properties
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const Loading = () => (
  <div className="flex min-h-screen items-center justify-center bg-background">
    <div className="text-primary text-lg animate-pulse">Loading…</div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <I18nProvider>
          <AuthProvider>
          <InstallPrompt />
          <UpdatePrompt />
          <OfflineBanner />
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Navigate to="/tasks" replace />} />
              <Route path="/tasks" element={<ProtectedRoute><MyTasks /></ProtectedRoute>} />
              <Route path="/tasks/completed" element={<ProtectedRoute><CompletedTasks /></ProtectedRoute>} />
              <Route path="/tasks/:id" element={<ProtectedRoute><TaskDetail /></ProtectedRoute>} />
              <Route path="/admin" element={<ProtectedRoute requireAdminAccess><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/tasks/create" element={<ProtectedRoute requireAdminAccess><CreateTask /></ProtectedRoute>} />
              <Route path="/admin/tasks/open" element={<ProtectedRoute requireAdminAccess><OpenTasksQueue /></ProtectedRoute>} />
              <Route path="/admin/tasks/overdue" element={<ProtectedRoute requireAdminAccess><OverdueQueue /></ProtectedRoute>} />
              <Route path="/admin/tasks/blocked" element={<ProtectedRoute requireAdminAccess><BlockedQueue /></ProtectedRoute>} />
              <Route path="/admin/tasks/property/:id" element={<ProtectedRoute requireAdminAccess><PropertyTasks /></ProtectedRoute>} />
              <Route path="/admin/tasks/staff/:id" element={<ProtectedRoute requireAdminAccess><StaffTasks /></ProtectedRoute>} />
              <Route path="/admin/housekeeping" element={<ProtectedRoute requireAdminAccess><HousekeepingQueue /></ProtectedRoute>} />
              <Route path="/admin/inspections" element={<ProtectedRoute requireAdminAccess><InspectionQueue /></ProtectedRoute>} />
              <Route path="/admin/vendors" element={<ProtectedRoute requireAdminAccess><VendorManagement /></ProtectedRoute>} />
              <Route path="/inspections/:id" element={<ProtectedRoute><InspectionChecklist /></ProtectedRoute>} />
              <Route path="/supervisor" element={<ProtectedRoute requireSupervisorAccess><SupervisorDashboard /></ProtectedRoute>} />
              <Route path="/supervisor/verify" element={<ProtectedRoute requireSupervisorAccess><VerificationQueue /></ProtectedRoute>} />
              <Route path="/supervisor/kpi" element={<ProtectedRoute requireSupervisorAccess><KPIOverview /></ProtectedRoute>} />
              <Route path="/supervisor/staff" element={<ProtectedRoute requireSupervisorAccess><StaffWorkload /></ProtectedRoute>} />
              <Route path="/supervisor/trends" element={<ProtectedRoute requireSupervisorAccess><TrendCharts /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          </AuthProvider>
        </I18nProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
