import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import DayView from "./pages/DayView";
import SetView from "./pages/SetView";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Admin from "./pages/Admin";
import Users from "./pages/Users";
import Calendar from "./pages/Calendar";
import Scores from "./pages/Scores";
import Progress from "./pages/Progress";
import { Layout } from "./components/layout/Layout";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Layout />}>
            <Route index element={<Dashboard />} />
          </Route>
          <Route path="/calendar" element={<Layout />}>
            <Route index element={<Calendar />} />
          </Route>
          <Route path="/scores" element={<Layout />}>
            <Route index element={<Scores />} />
          </Route>
          <Route path="/progress" element={<Layout />}>
            <Route index element={<Progress />} />
          </Route>
          <Route path="/profile" element={<Layout />}>
            <Route index element={<Profile />} />
          </Route>
          <Route path="/settings" element={<Layout />}>
            <Route index element={<Settings />} />
          </Route>
          <Route path="/admin" element={<Layout />}>
            <Route index element={<Admin />} />
          </Route>
          <Route path="/users" element={<Layout />}>
            <Route index element={<Users />} />
          </Route>
          <Route path="/day/:date" element={<Layout />}>
            <Route index element={<DayView />} />
          </Route>
          <Route path="/set/:date/:setId" element={<Layout />}>
            <Route index element={<SetView />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
