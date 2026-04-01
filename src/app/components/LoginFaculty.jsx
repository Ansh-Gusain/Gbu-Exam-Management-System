import { jsx, jsxs } from "react/jsx-runtime";
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
function LoginFaculty() {
  const navigate = useNavigate();
  const { faculty, setCurrentRole, setLoggedInFacultyId } = useStore();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    facultyId: "",
    password: ""
  });
  const handleLogin = (e) => {
    e.preventDefault();
    if (formData.facultyId && formData.password) {
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
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gradient-to-br from-green-50 via-slate-50 to-green-100 flex items-center justify-center p-4", children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-md", children: [
    /* @__PURE__ */ jsxs(Card, { className: "border-2 shadow-xl", children: [
      /* @__PURE__ */ jsxs(CardHeader, { className: "space-y-3 pb-6", children: [
        /* @__PURE__ */ jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsx("div", { className: "p-4 rounded-full bg-green-100", children: /* @__PURE__ */ jsx(BookOpen, { className: "w-10 h-10 text-green-600" }) }) }),
        /* @__PURE__ */ jsx(CardTitle, { className: "text-center text-2xl", children: "Faculty Login" }),
        /* @__PURE__ */ jsx(CardDescription, { className: "text-center", children: "View invigilation duties & mark attendance" })
      ] }),
      /* @__PURE__ */ jsxs(CardContent, { children: [
        /* @__PURE__ */ jsx("div", { className: "mb-6", children: /* @__PURE__ */ jsx(GoogleSignInButton, {}) }),
        /* @__PURE__ */ jsxs("div", { className: "relative mb-6", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center", children: /* @__PURE__ */ jsx("span", { className: "w-full border-t" }) }),
          /* @__PURE__ */ jsx("div", { className: "relative flex justify-center text-xs uppercase", children: /* @__PURE__ */ jsx("span", { className: "bg-card px-2 text-muted-foreground", children: "OR" }) })
        ] }),
        /* @__PURE__ */ jsxs("form", { onSubmit: handleLogin, className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "facultyId", children: "Faculty / Employee ID" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "facultyId",
                type: "text",
                placeholder: "e.g., EMP0001",
                value: formData.facultyId,
                onChange: (e) => setFormData({ ...formData, facultyId: e.target.value }),
                required: true
              }
            ),
            /* @__PURE__ */ jsx("p", { className: "text-[0.65rem] text-muted-foreground", children: "Demo: Enter any Employee ID (EMP0001\u2013EMP0030) with any password" })
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
            /* @__PURE__ */ jsx("a", { href: "#", className: "text-green-600 hover:underline", children: "Forgot password?" })
          ] }),
          /* @__PURE__ */ jsx(Button, { type: "submit", className: "w-full bg-green-600 hover:bg-green-700", size: "lg", children: "Login to Portal" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mt-6 pt-6 border-t text-center", children: /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground", children: [
          "Need help?",
          " ",
          /* @__PURE__ */ jsx("a", { href: "#", className: "text-green-600 hover:underline", children: "Contact Department Office" })
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsx("p", { className: "text-center text-xs text-muted-foreground mt-6", children: "By logging in, you agree to our Terms of Service and Privacy Policy" })
  ] }) });
}
export {
  LoginFaculty
};
