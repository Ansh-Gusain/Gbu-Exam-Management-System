import { jsx, jsxs } from "react/jsx-runtime";
import { useMemo } from "react";
import { useStore } from "../lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "./ui/table";
import {
  ClipboardList,
  CheckCircle2,
  AlertTriangle,
  Clock
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip
} from "recharts";
const COLORS = ["#22c55e", "#ef4444", "#94a3b8"];
function StudentAttendance() {
  const {
    loggedInStudentId,
    students,
    exams,
    rooms,
    attendanceRecords
  } = useStore();
  const currentStudent = students.find((s) => s.id === loggedInStudentId);
  const myAttendance = useMemo(() => {
    if (!currentStudent) return [];
    return attendanceRecords.filter((ar) => ar.studentId === currentStudent.id).map((ar) => {
      const exam = exams.find((e) => e.id === ar.examId);
      const room = rooms.find((r) => r.id === ar.roomId);
      return { ...ar, exam, room };
    }).sort((a, b) => (a.exam?.date || "").localeCompare(b.exam?.date || ""));
  }, [attendanceRecords, currentStudent, exams, rooms]);
  const presentCount = myAttendance.filter((a) => a.status === "present").length;
  const absentCount = myAttendance.filter((a) => a.status === "absent").length;
  const notMarkedCount = myAttendance.filter((a) => a.status === "not-marked").length;
  const pieData = [
    { name: "Present", value: presentCount },
    { name: "Absent", value: absentCount },
    { name: "Not Marked", value: notMarkedCount }
  ].filter((d) => d.value > 0);
  const attendanceRate = myAttendance.length > 0 ? Math.round(presentCount / myAttendance.length * 100) : 0;
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h1", { children: "My Attendance" }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-[0.85rem] mt-1", children: "Track your exam attendance record" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3", children: [
      /* @__PURE__ */ jsx(Card, { className: "py-3", children: /* @__PURE__ */ jsxs(CardContent, { className: "px-4 py-0", children: [
        /* @__PURE__ */ jsx("p", { className: "text-[0.7rem] text-muted-foreground", children: "Total Exams" }),
        /* @__PURE__ */ jsx("p", { className: "text-[1.25rem] font-semibold", children: myAttendance.length })
      ] }) }),
      /* @__PURE__ */ jsx(Card, { className: "py-3", children: /* @__PURE__ */ jsxs(CardContent, { className: "px-4 py-0", children: [
        /* @__PURE__ */ jsx("p", { className: "text-[0.7rem] text-green-600", children: "Present" }),
        /* @__PURE__ */ jsx("p", { className: "text-[1.25rem] font-semibold text-green-700", children: presentCount })
      ] }) }),
      /* @__PURE__ */ jsx(Card, { className: "py-3", children: /* @__PURE__ */ jsxs(CardContent, { className: "px-4 py-0", children: [
        /* @__PURE__ */ jsx("p", { className: "text-[0.7rem] text-red-600", children: "Absent" }),
        /* @__PURE__ */ jsx("p", { className: "text-[1.25rem] font-semibold text-red-700", children: absentCount })
      ] }) }),
      /* @__PURE__ */ jsx(Card, { className: "py-3", children: /* @__PURE__ */ jsxs(CardContent, { className: "px-4 py-0", children: [
        /* @__PURE__ */ jsx("p", { className: "text-[0.7rem] text-muted-foreground", children: "Attendance Rate" }),
        /* @__PURE__ */ jsx("p", { className: "text-[1.25rem] font-semibold", children: myAttendance.length > 0 ? `${attendanceRate}%` : "\u2014" })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-2 gap-6", children: [
      pieData.length > 0 && /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsx(CardTitle, { className: "text-[0.9rem]", children: "Attendance Distribution" }) }),
        /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: 200, children: /* @__PURE__ */ jsxs(PieChart, { children: [
          /* @__PURE__ */ jsx(
            Pie,
            {
              data: pieData,
              cx: "50%",
              cy: "50%",
              innerRadius: 50,
              outerRadius: 80,
              paddingAngle: 5,
              dataKey: "value",
              label: ({ name, value }) => `${name}: ${value}`,
              children: pieData.map((_, i) => /* @__PURE__ */ jsx(Cell, { fill: COLORS[i % COLORS.length] }, i))
            }
          ),
          /* @__PURE__ */ jsx(Tooltip, {})
        ] }) }) })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsx(CardTitle, { className: "text-[0.9rem]", children: "Quick Summary" }) }),
        /* @__PURE__ */ jsx(CardContent, { children: myAttendance.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "text-center py-8", children: [
          /* @__PURE__ */ jsx(ClipboardList, { className: "w-10 h-10 text-muted-foreground/30 mx-auto mb-2" }),
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-[0.85rem]", children: "No records yet" })
        ] }) : /* @__PURE__ */ jsx("div", { className: "space-y-2", children: myAttendance.map((record) => /* @__PURE__ */ jsxs(
          "div",
          {
            className: "flex items-center gap-3 p-2.5 bg-accent/30 rounded-lg",
            children: [
              record.status === "present" ? /* @__PURE__ */ jsx(CheckCircle2, { className: "w-4 h-4 text-green-600 shrink-0" }) : record.status === "absent" ? /* @__PURE__ */ jsx(AlertTriangle, { className: "w-4 h-4 text-red-500 shrink-0" }) : /* @__PURE__ */ jsx(Clock, { className: "w-4 h-4 text-muted-foreground shrink-0" }),
              /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsx("p", { className: "text-[0.8rem] font-medium truncate", children: record.exam?.subject || "\u2014" }),
                /* @__PURE__ */ jsxs("p", { className: "text-[0.65rem] text-muted-foreground", children: [
                  "Room ",
                  record.room?.roomNumber
                ] })
              ] }),
              /* @__PURE__ */ jsx(
                Badge,
                {
                  variant: record.status === "present" ? "default" : record.status === "absent" ? "destructive" : "secondary",
                  className: "text-[0.6rem] shrink-0",
                  children: record.status
                }
              )
            ]
          },
          record.id
        )) }) })
      ] })
    ] }),
    myAttendance.length > 0 && /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsx(CardTitle, { className: "text-[0.9rem]", children: "Detailed Records" }) }),
      /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs(Table, { children: [
        /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableHead, { className: "text-[0.75rem]", children: "Exam" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-[0.75rem]", children: "Subject" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-[0.75rem]", children: "Date" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-[0.75rem]", children: "Room" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-[0.75rem]", children: "Status" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-[0.75rem]", children: "Signature" })
        ] }) }),
        /* @__PURE__ */ jsx(TableBody, { children: myAttendance.map((record) => /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableCell, { className: "text-[0.8rem]", children: record.exam?.name || "\u2014" }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-[0.8rem] font-medium", children: record.exam?.subject || "\u2014" }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-[0.8rem]", children: record.exam ? new Date(record.exam.date).toLocaleDateString() : "\u2014" }),
          /* @__PURE__ */ jsxs(TableCell, { className: "text-[0.8rem]", children: [
            "Room ",
            record.room?.roomNumber || "\u2014"
          ] }),
          /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(
            Badge,
            {
              variant: record.status === "present" ? "default" : record.status === "absent" ? "destructive" : "secondary",
              className: "text-[0.65rem]",
              children: record.status
            }
          ) }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-[0.8rem]", children: record.signature ? /* @__PURE__ */ jsx(CheckCircle2, { className: "w-4 h-4 text-green-600" }) : /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "\u2014" }) })
        ] }, record.id)) })
      ] }) }) })
    ] })
  ] });
}
export {
  StudentAttendance
};
