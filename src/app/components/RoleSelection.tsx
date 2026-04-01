import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { Shield, BookOpen, GraduationCap } from "lucide-react";
import { GoogleSignInButton } from "./GoogleSignInButton";

export function RoleSelection() {
  const navigate = useNavigate();

  const roles = [
    {
      title: "Admin",
      description: "Manage exams, seating, invigilation & attendance",
      icon: Shield,
      path: "/login/admin",
      color: "bg-blue-100",
      iconColor: "text-blue-600",
      hoverColor: "hover:border-blue-300",
    },
    {
      title: "Faculty",
      description: "View invigilation duties & mark attendance",
      icon: BookOpen,
      path: "/login/faculty",
      color: "bg-green-100",
      iconColor: "text-green-600",
      hoverColor: "hover:border-green-300",
    },
    {
      title: "Student",
      description: "View your exam schedule and seat allocation",
      icon: GraduationCap,
      path: "/login/student",
      color: "bg-purple-100",
      iconColor: "text-purple-600",
      hoverColor: "hover:border-purple-300",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full bg-primary/10">
              <GraduationCap className="w-12 h-12 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl tracking-tight mb-2">ExamManager</h1>
          <p className="text-muted-foreground">
            Automated Examination Seating, Invigilation & Attendance Management
          </p>
        </div>

        <Card className="border-2 shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-center text-xl">
              Sign In
            </CardTitle>
            <CardDescription className="text-center">
              Use your college Gmail or select a role to continue
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Google Sign-In - Primary option */}
            <div>
              <GoogleSignInButton />
              <p className="text-xs text-center text-muted-foreground mt-2">
                Sign in with your college Gmail account
              </p>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Or sign in with credentials
                </span>
              </div>
            </div>

            {roles.map((role) => (
              <Button
                key={role.title}
                variant="outline"
                className={`w-full h-auto py-4 px-4 justify-start gap-4 ${role.hoverColor} transition-colors`}
                onClick={() => navigate(role.path)}
              >
                <div className={`p-3 rounded-full ${role.color}`}>
                  <role.icon className={`w-6 h-6 ${role.iconColor}`} />
                </div>
                <div className="text-left">
                  <div className="text-[0.9rem]">{role.title}</div>
                  <div className="text-[0.75rem] text-muted-foreground">
                    {role.description}
                  </div>
                </div>
              </Button>
            ))}
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          By logging in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
