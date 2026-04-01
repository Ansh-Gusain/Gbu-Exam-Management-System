import { Navigate, Outlet } from "react-router";
import { useAuth } from "../lib/auth-context";
import { Loader2 } from "lucide-react";

export function AuthGuard() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login/admin" replace />;
  }

  return <Outlet />;
}
