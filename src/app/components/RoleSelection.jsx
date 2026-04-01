import { jsx, jsxs } from "react/jsx-runtime";
import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { Shield, BookOpen, GraduationCap } from "lucide-react";
import { GoogleSignInButton } from "./GoogleSignInButton";
function RoleSelection() {
  const navigate = useNavigate();
  const roles = [
    {
      title: "Admin",
      description: "Manage exams, seating, invigilation & attendance",
      icon: Shield,
      path: "/login/admin",
      color: "bg-blue-100",
      iconColor: "text-blue-600",
      hoverColor: "hover:border-blue-300"
    },
    {
      title: "Faculty",
      description: "View invigilation duties & mark attendance",
      icon: BookOpen,
      path: "/login/faculty",
      color: "bg-green-100",
      iconColor: "text-green-600",
      hoverColor: "hover:border-green-300"
    },
    {
      title: "Student",
      description: "View your exam schedule and seat allocation",
      icon: GraduationCap,
      path: "/login/student",
      color: "bg-purple-100",
      iconColor: "text-purple-600",
      hoverColor: "hover:border-purple-300"
    }
  ];
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center p-4", children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-lg", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center mb-8", children: [
      /* @__PURE__ */ jsx("div", { className: "flex justify-center mb-4", children: /* @__PURE__ */ jsx("div", { className: "p-4 rounded-full bg-primary/10", children: /* @__PURE__ */ jsx(GraduationCap, { className: "w-12 h-12 text-primary" }) }) }),
      /* @__PURE__ */ jsx("h1", { className: "text-3xl tracking-tight mb-2", children: "ExamManager" }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Automated Examination Seating, Invigilation & Attendance Management" })
    ] }),
    /* @__PURE__ */ jsxs(Card, { className: "border-2 shadow-xl", children: [
      /* @__PURE__ */ jsxs(CardHeader, { className: "pb-4", children: [
        /* @__PURE__ */ jsx(CardTitle, { className: "text-center text-xl", children: "Sign In" }),
        /* @__PURE__ */ jsx(CardDescription, { className: "text-center", children: "Use your college Gmail or select a role to continue" })
      ] }),
      /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(GoogleSignInButton, {}),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-center text-muted-foreground mt-2", children: "Sign in with your college Gmail account" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center", children: /* @__PURE__ */ jsx("span", { className: "w-full border-t" }) }),
          /* @__PURE__ */ jsx("div", { className: "relative flex justify-center text-xs uppercase", children: /* @__PURE__ */ jsx("span", { className: "bg-card px-2 text-muted-foreground", children: "Or sign in with credentials" }) })
        ] }),
        roles.map((role) => /* @__PURE__ */ jsxs(
          Button,
          {
            variant: "outline",
            className: `w-full h-auto py-4 px-4 justify-start gap-4 ${role.hoverColor} transition-colors`,
            onClick: () => navigate(role.path),
            children: [
              /* @__PURE__ */ jsx("div", { className: `p-3 rounded-full ${role.color}`, children: /* @__PURE__ */ jsx(role.icon, { className: `w-6 h-6 ${role.iconColor}` }) }),
              /* @__PURE__ */ jsxs("div", { className: "text-left", children: [
                /* @__PURE__ */ jsx("div", { className: "text-[0.9rem]", children: role.title }),
                /* @__PURE__ */ jsx("div", { className: "text-[0.75rem] text-muted-foreground", children: role.description })
              ] })
            ]
          },
          role.title
        ))
      ] })
    ] }),
    /* @__PURE__ */ jsx("p", { className: "text-center text-xs text-muted-foreground mt-6", children: "By logging in, you agree to our Terms of Service and Privacy Policy" })
  ] }) });
}
export {
  RoleSelection
};
