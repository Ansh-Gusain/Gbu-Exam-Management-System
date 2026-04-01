import { useState } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Shield, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { GoogleSignInButton } from "./GoogleSignInButton";
import { useStore } from "../lib/store";

export function LoginAdmin() {
  const navigate = useNavigate();
  const { setCurrentRole } = useStore();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleLogin = (e) => {
    e.preventDefault();
    if (formData.email && formData.password) {
      setCurrentRole("admin");
      toast.success("Login successful!");
      navigate("/");
    } else {
      toast.error("Please enter valid credentials");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="border border-gray-700 shadow-2xl bg-gray-900 text-white">
          <CardHeader className="space-y-3 pb-6">
            <div className="flex justify-center">
              <div className="p-4 rounded-full bg-white/10">
                <Shield className="w-10 h-10 text-white" />
              </div>
            </div>
            <CardTitle className="text-center text-2xl text-white">
              Admin Login
            </CardTitle>
            <CardDescription className="text-center text-gray-400">
              Manage exams, seating, invigilation & attendance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <GoogleSignInButton />
            </div>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-700" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-gray-900 px-2 text-gray-500">OR</span>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-white focus:ring-white/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300">Password</Label>
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
                    className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-white focus:ring-white/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
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
                  <input type="checkbox" className="rounded bg-gray-800 border-gray-600" />
                  <span className="text-gray-400">Remember me</span>
                </label>
                <a href="#" className="text-gray-400 hover:text-white hover:underline">
                  Forgot password?
                </a>
              </div>

              <Button type="submit" className="w-full bg-white text-black hover:bg-gray-200" size="lg">
                Login to Dashboard
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-700 text-center">
              <p className="text-sm text-gray-500">
                Need help?{" "}
                <a href="#" className="text-gray-400 hover:text-white hover:underline">
                  Contact IT Support
                </a>
              </p>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-gray-600 mt-6">
          By logging in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}