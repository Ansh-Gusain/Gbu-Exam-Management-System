import { useState } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { BookOpen, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { GoogleSignInButton } from "./GoogleSignInButton";
import { useStore } from "../lib/store";

export function LoginFaculty() {
  const navigate = useNavigate();
  const { faculty, setCurrentRole, setLoggedInFacultyId } = useStore();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    facultyId: "",
    password: "",
  });

  const handleLogin = (e) => {
    e.preventDefault();
    if (formData.facultyId && formData.password) {
      // Match by employeeId or pick first faculty as fallback
      const matched = faculty.find(
        (f) => f.employeeId.toLowerCase() === formData.facultyId.toLowerCase()
      );
      const selectedFaculty = matched || faculty[0];
      setCurrentRole("faculty");
      setLoggedInFacultyId(selectedFaculty.id);
      toast.success(`Welcome, ${selectedFaculty.name}!`);
      navigate("/faculty");
    } else {
      toast.error("Please enter valid credentials");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-slate-50 to-green-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="border-2 shadow-xl">
          <CardHeader className="space-y-3 pb-6">
            <div className="flex justify-center">
              <div className="p-4 rounded-full bg-green-100">
                <BookOpen className="w-10 h-10 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-center text-2xl">
              Faculty Login
            </CardTitle>
            <CardDescription className="text-center">
              View invigilation duties & mark attendance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <GoogleSignInButton />
            </div>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">OR</span>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="facultyId">Faculty / Employee ID</Label>
                <Input
                  id="facultyId"
                  type="text"
                  placeholder="e.g., EMP0001"
                  value={formData.facultyId}
                  onChange={(e) =>
                    setFormData({ ...formData, facultyId: e.target.value })
                  }
                  required
                />
                <p className="text-[0.65rem] text-muted-foreground">
                  Demo: Enter any Employee ID (EMP0001–EMP0030) with any password
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded" />
                  <span className="text-muted-foreground">Remember me</span>
                </label>
                <a href="#" className="text-green-600 hover:underline">
                  Forgot password?
                </a>
              </div>

              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" size="lg">
                Login to Portal
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t text-center">
              <p className="text-sm text-muted-foreground">
                Need help?{" "}
                <a href="#" className="text-green-600 hover:underline">
                  Contact Department Office
                </a>
              </p>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          By logging in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}