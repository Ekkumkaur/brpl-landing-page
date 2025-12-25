import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import UserDashboard from "./pages/dashboard/UserDashboard";
import CoachDashboard from "./pages/dashboard/CoachDashboard";
import CoachRegistrationForm from "./components/cricket/CoachRegistrationForm";
import CoachLogin from "./components/cricket/CoachLogin";
import InfluencerDashboard from "./pages/dashboard/InfluencerDashboard";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import { TrackingHandler } from "./components/TrackingHandler";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <TrackingHandler />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          {/* <Route path="/register" element={< RegistrationForm />} /> */}
          <Route path="/dashboard" element={<UserDashboard />} />

          {/* Coach & Influencer Routes */}
          <Route path="/coach/register" element={<CoachRegistrationForm />} />
          <Route path="/coach-register" element={<CoachRegistrationForm />} /> {/* Alias */}
          <Route path="/coach-login" element={<CoachLogin />} />
          <Route path="/coach/dashboard" element={<CoachDashboard />} />
          <Route path="/influencer/dashboard" element={<InfluencerDashboard />} />

          {/* Admin Routes */}
          <Route path="/admin/landing/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
