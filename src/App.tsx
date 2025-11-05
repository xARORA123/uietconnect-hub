import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

import Index from "./pages/Index";
import Classrooms from "./pages/Classrooms";
import LostFound from "./pages/LostFound";
import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";
import CreateProject from "./pages/CreateProject";
import TeacherApplications from "./pages/TeacherApplications";
import Login from "./pages/auth/Login";
import SignupUser from "./pages/auth/SignupUser";
import SignupAdmin from "./pages/auth/SignupAdmin";
import Profile from "./pages/Profile";
import Forbidden from "./pages/Forbidden";
import Unauthorized from "./pages/Unauthorized";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserDashboard from "./pages/user/UserDashboard";
import ViewFeedback from "./pages/admin/ViewFeedback";
import ReportIssue from "./pages/ReportIssue";
import NotFound from "./pages/NotFound";

//  Floating Chatbot Widget Import
import ChatBot from "@/components/chatbot/chatbot";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>

            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup/user" element={<SignupUser />} />
            <Route path="/signup/admin" element={<SignupAdmin />} />
            <Route path="/forbidden" element={<Forbidden />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/access-denied" element={<Forbidden />} />

            {/* Protected Routes */}
            <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            <Route path="/classrooms" element={<ProtectedRoute><Classrooms /></ProtectedRoute>} />
            <Route path="/lost-found" element={<ProtectedRoute><LostFound /></ProtectedRoute>} />
            <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
            <Route path="/projects/:id" element={<ProtectedRoute><ProjectDetails /></ProtectedRoute>} />
            <Route path="/projects/create" element={<ProtectedRoute><CreateProject /></ProtectedRoute>} />
            <Route path="/teacher/applications" element={<ProtectedRoute><TeacherApplications /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/report-issue" element={<ProtectedRoute><ReportIssue /></ProtectedRoute>} />

            {/* Role-Based Routes */}
            <Route path="/admin/dashboard" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/feedback" element={<ProtectedRoute requiredRole="admin"><ViewFeedback /></ProtectedRoute>} />
            <Route path="/user/dashboard" element={<ProtectedRoute requiredRole="student"><UserDashboard /></ProtectedRoute>} />

            {/* Not Found */}
            <Route path="*" element={<NotFound />} />

          </Routes>

          {/*  Floating ChatBot Widget (Always Visible) */}
          <ChatBot />

        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
