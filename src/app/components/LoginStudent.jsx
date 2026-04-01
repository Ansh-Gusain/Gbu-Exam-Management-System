import { jsx, jsxs } from "react/jsx-runtime";
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
function LoginStudent() {
  const navigate = useNavigate();
  const { students, setCurrentRole, setLoggedInStudentId } = useStore();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    rollNumber: "",
    password: ""
  });
  const handleLogin = (e) => {
    e.preventDefault();
    if (formData.rollNumber && formData.password) {
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
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100 flex items-center justify-center p-4", children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-md", children: [
    /* @__PURE__ */ jsxs(Card, { className: "border-2 shadow-xl", children: [
      /* @__PURE__ */ jsxs(CardHeader, { className: "space-y-3 pb-6", children: [
        /* @__PURE__ */ jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsx("div", { className: "p-4 rounded-full bg-blue-100", children: /* @__PURE__ */ jsx(GraduationCap, { className: "w-10 h-10 text-blue-600" }) }) }),
        /* @__PURE__ */ jsx(CardTitle, { className: "text-center text-2xl", children: "Student Login" }),
        /* @__PURE__ */ jsx(CardDescription, { className: "text-center", children: "View your exam schedule and seat allocation" })
      ] }),
      /* @__PURE__ */ jsxs(CardContent, { children: [
        /* @__PURE__ */ jsx("div", { className: "mb-6", children: /* @__PURE__ */ jsx(GoogleSignInButton, {}) }),
        /* @__PURE__ */ jsxs("div", { className: "relative mb-6", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center", children: /* @__PURE__ */ jsx("span", { className: "w-full border-t" }) }),
          /* @__PURE__ */ jsx("div", { className: "relative flex justify-center text-xs uppercase", children: /* @__PURE__ */ jsx("span", { className: "bg-card px-2 text-muted-foreground", children: "OR" }) })
        ] }),
        /* @__PURE__ */ jsxs("form", { onSubmit: handleLogin, className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "rollNumber", children: "Roll Number" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "rollNumber",
                type: "text",
                placeholder: "e.g., CS3001",
                value: formData.rollNumber,
                onChange: (e) => setFormData({ ...formData, rollNumber: e.target.value }),
                required: true
              }
            ),
            /* @__PURE__ */ jsx("p", { className: "text-[0.65rem] text-muted-foreground", children: "Demo: Enter any roll number (e.g., CS3001, EC3021) with any password" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "password", children: "Password" }),
            /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsx(
                Input,
                {
                  id: "password",
                  type: showPassword ? "text" : "password",
                  placeholder: "Enter your password",
                  value: formData.password,
                  onChange: (e) => setFormData({ ...formData, password: e.target.value }),
                  required: true
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setShowPassword(!showPassword),
                  className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground",
                  children: showPassword ? /* @__PURE__ */ jsx(EyeOff, { className: "w-4 h-4" }) : /* @__PURE__ */ jsx(Eye, { className: "w-4 h-4" })
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-sm", children: [
            /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [
              /* @__PURE__ */ jsx("input", { type: "checkbox", className: "rounded" }),
              /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Remember me" })
            ] }),
            /* @__PURE__ */ jsx("a", { href: "#", className: "text-blue-600 hover:underline", children: "Forgot password?" })
          ] }),
          /* @__PURE__ */ jsx(Button, { type: "submit", className: "w-full bg-blue-600 hover:bg-blue-700", size: "lg", children: "Login to Portal" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mt-6 pt-6 border-t text-center", children: /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground", children: [
          "Need help?",
          " ",
          /* @__PURE__ */ jsx("a", { href: "#", className: "text-blue-600 hover:underline", children: "Contact Student Affairs" })
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsx("p", { className: "text-center text-xs text-muted-foreground mt-6", children: "By logging in, you agree to our Terms of Service and Privacy Policy" })
  ] }) });
}
export {
  LoginStudent
};
