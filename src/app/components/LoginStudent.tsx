import { useState } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { GraduationCap, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { GoogleSignInButton } from "./GoogleSignInButton";
import { useStore } from "../lib/store";

export function LoginStudent() {
  const navigate = useNavigate();
  const { students, setCurrentRole, setLoggedInStudentId } = useStore();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    rollNumber: "",
    password: "",
  });

  const handleLogin = (e) => {
    e.preventDefault();
    if (formData.rollNumber && formData.password) {
      // Match by roll number or pick first student as fallback
      const matched = students.find(
        (s) => s.rollNumber.toLowerCase() === formData.rollNumber.toLowerCase()
      );
      const selectedStudent = matched || students[0];
      setCurrentRole("student");
      setLoggedInStudentId(selectedStudent.id);
      toast.success(`Welcome, ${selectedStudent.name}!`);
      navigate("/student");
    } else {
      toast.error("Please enter valid credentials");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="border-2 shadow-xl">
          <CardHeader className="space-y-3 pb-6">
            <div className="flex justify-center">
              <div className="p-4 rounded-full bg-blue-100">
                <GraduationCap className="w-10 h-10 text-blue-600" />
              </div>
            </div>
            <CardTitle className="text-center text-2xl">
              Student Login
            </CardTitle>
            <CardDescription className="text-center">
              View your exam schedule and seat allocation
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
                <Label htmlFor="rollNumber">Roll Number</Label>
                <Input
                  id="rollNumber"
                  type="text"
                  placeholder="e.g., CS3001"
                  value={formData.rollNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, rollNumber: e.target.value })
                  }
                  required
                />
                <p className="text-[0.65rem] text-muted-foreground">
                  Demo: Enter any roll number (e.g., CS3001, EC3021) with any password
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
                <a href="#" className="text-blue-600 hover:underline">
                  Forgot password?
                </a>
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
                Login to Portal
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t text-center">
              <p className="text-sm text-muted-foreground">
                Need help?{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Contact Student Affairs
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