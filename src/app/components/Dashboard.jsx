import { jsx, jsxs } from "react/jsx-runtime";
import { useStore } from "../lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Users,
  DoorOpen,
  FileText,
  UserCheck,
  Grid3X3,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Clock,
  TrendingUp
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
const COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6"];
function Dashboard() {
  const {
    students,
    rooms,
    exams,
    faculty,
    seatingAllocations,
    invigilationAllocations,
    replacementLogs
  } = useStore();
  const scheduledExams = exams.filter((e) => e.status === "scheduled").length;
  const completedExams = exams.filter((e) => e.status === "completed").length;
  const pendingReplacements = replacementLogs.filter((r) => r.status === "pending").length;
  const totalCapacity = rooms.reduce((sum, r) => sum + r.capacity, 0);
  const availableFaculty = faculty.filter((f) => f.isAvailable).length;
  const stats = [
    { label: "Total Students", value: students.length, icon: Users, color: "text-blue-600 bg-blue-50" },
    { label: "Rooms", value: rooms.length, icon: DoorOpen, color: "text-green-600 bg-green-50" },
    { label: "Upcoming Exams", value: scheduledExams, icon: FileText, color: "text-amber-600 bg-amber-50" },
    { label: "Faculty Available", value: availableFaculty, icon: UserCheck, color: "text-purple-600 bg-purple-50" },
    { label: "Seats Allocated", value: seatingAllocations.length, icon: Grid3X3, color: "text-indigo-600 bg-indigo-50" },
    { label: "Total Capacity", value: totalCapacity, icon: TrendingUp, color: "text-teal-600 bg-teal-50" }
  ];
  const branchData = ["SOICT", "SOE", "SOVSAS", "SOM", "SOBT", "SOLJG", "SOHSS"].map((school) => ({
    branch: school,
    students: students.filter((s) => s.school === school).length
  })).filter((d) => d.students > 0);
  const examStatusData = [
    { name: "Scheduled", value: scheduledExams },
    { name: "Completed", value: completedExams },
    { name: "Ongoing", value: exams.filter((e) => e.status === "ongoing").length }
  ].filter((d) => d.value > 0);
  const upcomingExams = exams.filter((e) => e.status === "scheduled").sort((a, b) => a.date.localeCompare(b.date)).slice(0, 5);
  const recentReplacements = replacementLogs.slice(0, 3);
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("h1", { children: "Dashboard" }) }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3", children: stats.map((stat) => /* @__PURE__ */ jsx(Card, { className: "py-3", children: /* @__PURE__ */ jsxs(CardContent, { className: "px-4 py-0", children: [
      /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2 mb-2", children: /* @__PURE__ */ jsx("div", { className: `w-8 h-8 rounded-lg flex items-center justify-center ${stat.color}`, children: /* @__PURE__ */ jsx(stat.icon, { className: "w-4 h-4" }) }) }),
      /* @__PURE__ */ jsx("p", { className: "text-[1.25rem]", children: stat.value.toLocaleString() }),
      /* @__PURE__ */ jsx("p", { className: "text-[0.7rem] text-muted-foreground", children: stat.label })
    ] }) }, stat.label)) }),
    /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-2 gap-6", children: [
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsx(CardTitle, { className: "text-[0.9rem]", children: "Students by School" }) }),
        /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: 220, children: /* @__PURE__ */ jsxs(BarChart, { data: branchData, children: [
          /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "var(--border)" }),
          /* @__PURE__ */ jsx(XAxis, { dataKey: "branch", tick: { fontSize: 12 } }),
          /* @__PURE__ */ jsx(YAxis, { tick: { fontSize: 12 } }),
          /* @__PURE__ */ jsx(Tooltip, {}),
          /* @__PURE__ */ jsx(Bar, { dataKey: "students", fill: "#6366f1", radius: [4, 4, 0, 0] })
        ] }) }) })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsx(CardTitle, { className: "text-[0.9rem]", children: "Exam Status Distribution" }) }),
        /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center", children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: 220, children: /* @__PURE__ */ jsxs(PieChart, { children: [
          /* @__PURE__ */ jsx(
            Pie,
            {
              data: examStatusData,
              cx: "50%",
              cy: "50%",
              innerRadius: 55,
              outerRadius: 85,
              paddingAngle: 5,
              dataKey: "value",
              nameKey: "name",
              isAnimationActive: false,
              label: ({ name, value }) => `${name}: ${value}`,
              children: examStatusData.map((entry, i) => /* @__PURE__ */ jsx(Cell, { fill: COLORS[i % COLORS.length] }, `pie-cell-${entry.name}`))
            }
          ),
          /* @__PURE__ */ jsx(Tooltip, {})
        ] }) }) }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-2 gap-6", children: [
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxs(CardTitle, { className: "text-[0.9rem] flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Clock, { className: "w-4 h-4" }),
          " Upcoming Exams"
        ] }) }),
        /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { className: "space-y-3", children: upcomingExams.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-[0.8rem] text-muted-foreground py-4 text-center", children: "No upcoming exams" }) : upcomingExams.map((exam) => /* @__PURE__ */ jsxs(
          "div",
          {
            className: "flex items-center justify-between p-3 bg-accent/50 rounded-lg",
            children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-[0.8rem]", children: exam.subject }),
                /* @__PURE__ */ jsxs("p", { className: "text-[0.7rem] text-muted-foreground", children: [
                  exam.name,
                  " \u2022 Sem ",
                  exam.semester
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
                /* @__PURE__ */ jsx("p", { className: "text-[0.75rem]", children: new Date(exam.date).toLocaleDateString() }),
                /* @__PURE__ */ jsxs("p", { className: "text-[0.7rem] text-muted-foreground", children: [
                  exam.startTime,
                  " - ",
                  exam.endTime
                ] })
              ] })
            ]
          },
          exam.id
        )) }) })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxs(CardTitle, { className: "text-[0.9rem] flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(AlertCircle, { className: "w-4 h-4" }),
          " Alerts & Replacements"
        ] }) }),
        /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
          pendingReplacements > 0 && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 p-3 bg-amber-50 text-amber-800 rounded-lg", children: [
            /* @__PURE__ */ jsx(RefreshCw, { className: "w-4 h-4 shrink-0" }),
            /* @__PURE__ */ jsxs("p", { className: "text-[0.8rem]", children: [
              pendingReplacements,
              " pending replacement request(s)"
            ] })
          ] }),
          recentReplacements.map((rep) => {
            const origFaculty = faculty.find((f) => f.id === rep.originalFacultyId);
            return /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 p-3 bg-accent/50 rounded-lg", children: [
              /* @__PURE__ */ jsx("div", { className: "shrink-0", children: rep.status === "approved" ? /* @__PURE__ */ jsx(CheckCircle2, { className: "w-4 h-4 text-green-600" }) : rep.status === "pending" ? /* @__PURE__ */ jsx(Clock, { className: "w-4 h-4 text-amber-600" }) : /* @__PURE__ */ jsx(AlertCircle, { className: "w-4 h-4 text-red-600" }) }),
              /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxs("p", { className: "text-[0.8rem] truncate", children: [
                  origFaculty?.name,
                  " \u2014 ",
                  rep.reason
                ] }),
                /* @__PURE__ */ jsx(
                  Badge,
                  {
                    variant: rep.status === "approved" ? "default" : rep.status === "pending" ? "secondary" : "destructive",
                    className: "text-[0.65rem] mt-1",
                    children: rep.status
                  }
                )
              ] })
            ] }, rep.id);
          }),
          recentReplacements.length === 0 && pendingReplacements === 0 && /* @__PURE__ */ jsx("p", { className: "text-[0.8rem] text-muted-foreground py-4 text-center", children: "No alerts at this time" })
        ] }) })
      ] })
    ] })
  ] });
}
export {
  Dashboard
};
