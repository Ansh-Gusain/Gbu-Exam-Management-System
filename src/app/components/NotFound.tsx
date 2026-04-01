import { Link } from "react-router";
import { Button } from "./ui/button";
import { AlertCircle } from "lucide-react";

export function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <AlertCircle className="w-16 h-16 text-muted-foreground mb-4" />
      <h1 className="mb-2">Page Not Found</h1>
      <p className="text-muted-foreground text-[0.9rem] mb-6">
        The page you're looking for doesn't exist.
      </p>
      <Link to="/">
        <Button>Back to Dashboard</Button>
      </Link>
    </div>
  );
}
