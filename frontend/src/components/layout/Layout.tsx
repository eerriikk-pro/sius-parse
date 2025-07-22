import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { TopBar } from "./TopBar";
import { Sidebar } from "./Sidebar";
import { getCurrentUser } from "@/lib/api";

interface User {
  username: string;
  email: string;
  full_name: string;
  athlete_id?: number;
  disabled?: boolean;
  is_admin?: boolean;
}

export const Layout = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // On mount, check for token and fetch user info
  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      getCurrentUser(token)
        .then(setUser)
        .catch(() => {
          setUser(null);
          localStorage.removeItem("token");
          sessionStorage.removeItem("token");
          if (location.pathname !== "/login" && location.pathname !== "/") {
            navigate("/login");
          }
        })
        .finally(() => setLoading(false));
    } else {
      setUser(null);
      setLoading(false);
      if (location.pathname !== "/login" && location.pathname !== "/") {
        navigate("/login");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <TopBar user={user || undefined} onLogout={handleLogout} />
      <div className="flex h-[calc(100vh-64px)]">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};