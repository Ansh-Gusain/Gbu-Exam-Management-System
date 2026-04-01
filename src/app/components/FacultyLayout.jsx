import { jsx, jsxs } from "react/jsx-runtime";
import { Badge } from "./ui/badge";
import logoImg from "@/assets/ed2ca518a3e5afbd0023769633d655019bb193a2.png";
import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router";
import { useStore } from "../lib/store";
import { toast } from "sonner";
import {
  LayoutDashboard,
  ClipboardList,
  RefreshCw,
  Menu,
  LogOut,
  CalendarDays
} from "lucide-react";
const navItems = [
  { path: "/faculty", label: "Dashboard", icon: LayoutDashboard },
  { path: "/faculty/duties", label: "My Duties", icon: CalendarDays },
  { path: "/faculty/attendance", label: "Mark Attendance", icon: ClipboardList },
  { path: "/faculty/replacements", label: "Replacements", icon: RefreshCw }
];
function FacultyLayout() {
  const { faculty, loggedInFacultyId, replacementLogs, setLoggedInFacultyId, setCurrentRole } = useStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const currentFaculty = faculty.find((f) => f.id === loggedInFacultyId);
  const pendingReplacements = replacementLogs.filter(
    (r) => r.originalFacultyId === loggedInFacultyId && r.status === "pending"
  ).length;
  const handleSignOut = () => {
    setLoggedInFacultyId(null);
    setCurrentRole("admin");
    toast.success("Signed out successfully");
    navigate("/login/faculty");
  };
  return /* @__PURE__ */ jsxs("div", { className: "flex h-screen bg-background overflow-hidden", children: [
    sidebarOpen && /* @__PURE__ */ jsx(
      "div",
      {
        className: "fixed inset-0 bg-black/50 z-40 lg:hidden",
        onClick: () => setSidebarOpen(false)
      }
    ),
    /* @__PURE__ */ jsxs(
      "aside",
      {
        className: `fixed lg:static inset-y-0 left-0 z-50 w-64 bg-card border-r border-border flex flex-col transition-transform duration-200 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`,
        children: [
          /* @__PURE__ */ jsx("div", { className: "p-4 border-b border-border", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx("img", { src: logoImg, alt: "Logo", className: "w-14 h-14 rounded-full object-contain shrink-0" }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-[2px] min-w-0", children: [
              /* @__PURE__ */ jsx("p", { className: "font-['Roboto','Noto_Sans_Devanagari',sans-serif] text-[13px] text-foreground whitespace-nowrap leading-normal", children: "\u0917\u094C\u0924\u092E \u092C\u0941\u0926\u094D\u0927 \u0935\u093F\u0936\u094D\u0935\u0935\u093F\u0926\u094D\u092F\u093E\u0932\u092F" }),
              /* @__PURE__ */ jsx("p", { className: "font-['Roboto',sans-serif] text-[11px] text-foreground whitespace-nowrap leading-normal", children: "GAUTAM BUDDHA UNIVERSITY" }),
              /* @__PURE__ */ jsx(Badge, { className: "mt-1 text-[0.6rem] bg-green-100 text-green-700 w-fit", children: "Faculty Portal" })
            ] })
          ] }) }),
          /* @__PURE__ */ jsx("nav", { className: "flex-1 p-2 overflow-y-auto", children: navItems.map((item) => /* @__PURE__ */ jsxs(
            NavLink,
            {
              to: item.path,
              onClick: () => setSidebarOpen(false),
              className: ({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg text-[0.8rem] mb-0.5 transition-colors ${isActive ? "bg-green-600 text-white" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"}`,
              end: item.path === "/faculty",
              children: [
                /* @__PURE__ */ jsx(item.icon, { className: "w-4 h-4 shrink-0" }),
                /* @__PURE__ */ jsx("span", { className: "flex-1", children: item.label }),
                item.path === "/faculty/replacements" && pendingReplacements > 0 && /* @__PURE__ */ jsx(Badge, { variant: "destructive", className: "text-[0.65rem] px-1.5 py-0", children: pendingReplacements })
              ]
            },
            item.path
          )) }),
          /* @__PURE__ */ jsxs("div", { className: "p-3 border-t border-border space-y-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "px-3 py-1.5", children: [
              /* @__PURE__ */ jsx("p", { className: "text-[0.75rem] font-medium truncate", children: currentFaculty?.name || "Faculty" }),
              /* @__PURE__ */ jsx("p", { className: "text-[0.65rem] text-muted-foreground truncate", children: currentFaculty?.email || "faculty@gbu.ac.in" })
            ] }),
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: handleSignOut,
                className: "flex items-center gap-2 w-full px-3 py-2 rounded-lg text-[0.8rem] text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors",
                children: [
                  /* @__PURE__ */ jsx(LogOut, { className: "w-4 h-4" }),
                  /* @__PURE__ */ jsx("span", { children: "Sign Out" })
                ]
              }
            )
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col min-w-0", children: [
      /* @__PURE__ */ jsxs("header", { className: "h-14 border-b border-border flex items-center px-4 gap-3 bg-card shrink-0", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setSidebarOpen(true),
            className: "lg:hidden p-1 rounded hover:bg-accent",
            children: /* @__PURE__ */ jsx(Menu, { className: "w-5 h-5" })
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "flex-1" }),
        /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-[0.7rem]", children: (/* @__PURE__ */ new Date()).toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric"
        }) })
      ] }),
      /* @__PURE__ */ jsx("main", { className: "flex-1 overflow-auto p-4 md:p-6", children: /* @__PURE__ */ jsx(Outlet, {}) })
    ] })
  ] });
}
export {
  FacultyLayout
};
