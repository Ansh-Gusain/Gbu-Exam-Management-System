import { jsx, jsxs } from "react/jsx-runtime";
import { useMemo } from "react";
import { useStore } from "../lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  FileText,
  Grid3X3,
  ClipboardList,
  CheckCircle2,
  Clock,
  MapPin,
  Calendar,
  AlertTriangle
} from "lucide-react";
function StudentDashboard() {
  const {
    loggedInStudentId,
    students,
    exams,
    rooms,
    seatingAllocations,
    attendanceRecords
  } = useStore();
  const currentStudent = students.find((s) => s.id === loggedInStudentId);
  const myExams = useMemo(() => {
    if (!currentStudent) return [];
    return exams.filter(
      (e) => e.branches.includes(currentStudent.branch) && e.semester === currentStudent.semester
    ).sort((a, b) => a.date.localeCompare(b.date));
  }, [exams, currentStudent]);
  const upcomingExams = myExams.filter((e) => e.status === "scheduled");
  const completedExams = myExams.filter((e) => e.status === "completed");
  const mySeats = useMemo(() => {
    if (!currentStudent) return [];
    return seatingAllocations.filter((sa) => sa.studentId === currentStudent.id).map((sa) => {
      const exam = exams.find((e) => e.id === sa.examId);
      const room = rooms.find((r) => r.id === sa.roomId);
      return { ...sa, exam, room };
    });
  }, [seatingAllocations, currentStudent, exams, rooms]);
  const myAttendance = useMemo(() => {
    if (!currentStudent) return [];
    return attendanceRecords.filter((ar) => ar.studentId === currentStudent.id).map((ar) => {
      const exam = exams.find((e) => e.id === ar.examId);
      const room = rooms.find((r) => r.id === ar.roomId);
      return { ...ar, exam, room };
    });
  }, [attendanceRecords, currentStudent, exams, rooms]);
  const presentCount = myAttendance.filter((a) => a.status === "present").length;
  const absentCount = myAttendance.filter((a) => a.status === "absent").length;
  const attendanceRate = myAttendance.length > 0 ? Math.round(presentCount / myAttendance.length * 100) : 0;
  const stats = [
    {
      label: "Upcoming Exams",
      value: upcomingExams.length,
      icon: FileText,
      color: "text-blue-600 bg-blue-50"
    },
    {
      label: "Seats Allocated",
      value: mySeats.length,
      icon: Grid3X3,
      color: "text-blue-600 bg-blue-50"
    },
    {
      label: "Exams Attended",
      value: presentCount,
      icon: ClipboardList,
      color: "text-green-600 bg-green-50"
    },
    {
      label: "Attendance Rate",
      value: myAttendance.length > 0 ? `${attendanceRate}%` : "\u2014",
      icon: CheckCircle2,
      color: "text-teal-600 bg-teal-50"
    }
  ];
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsxs("h1", { className: "text-[1.5rem]", children: [
        "Welcome, ",
        currentStudent?.name || "Student"
      ] }),
      /* @__PURE__ */ jsxs("p", { className: "text-muted-foreground text-[0.85rem] mt-1", children: [
        currentStudent?.rollNumber,
        " \u2022 ",
        currentStudent?.branch,
        " \u2022 Semester ",
        currentStudent?.semester,
        " \u2022 Section ",
        currentStudent?.section
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3", children: stats.map((stat) => /* @__PURE__ */ jsx(Card, { className: "py-3", children: /* @__PURE__ */ jsxs(CardContent, { className: "px-4 py-0", children: [
      /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2 mb-2", children: /* @__PURE__ */ jsx("div", { className: `w-8 h-8 rounded-lg flex items-center justify-center ${stat.color}`, children: /* @__PURE__ */ jsx(stat.icon, { className: "w-4 h-4" }) }) }),
      /* @__PURE__ */ jsx("p", { className: "text-[1.25rem] font-semibold", children: stat.value }),
      /* @__PURE__ */ jsx("p", { className: "text-[0.7rem] text-muted-foreground", children: stat.label })
    ] }) }, stat.label)) }),
    /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-2 gap-6", children: [
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxs(CardTitle, { className: "text-[0.9rem] flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Calendar, { className: "w-4 h-4 text-blue-600" }),
          "Upcoming Exam Schedule"
        ] }) }),
        /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { className: "space-y-3", children: upcomingExams.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "text-center py-8", children: [
          /* @__PURE__ */ jsx(Calendar, { className: "w-10 h-10 text-muted-foreground/30 mx-auto mb-2" }),
          /* @__PURE__ */ jsx("p", { className: "text-[0.85rem] text-muted-foreground", children: "No upcoming exams" })
        ] }) : upcomingExams.map((exam) => {
          const seat = mySeats.find((s) => s.examId === exam.id);
          return /* @__PURE__ */ jsxs(
            "div",
            {
              className: "p-3 bg-accent/50 rounded-lg border border-border/50",
              children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between", children: [
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("p", { className: "text-[0.85rem] font-medium", children: exam.subject }),
                    /* @__PURE__ */ jsx("p", { className: "text-[0.7rem] text-muted-foreground", children: exam.name })
                  ] }),
                  /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-[0.65rem] shrink-0", children: exam.branches.join(", ") })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2 mt-2", children: [
                  /* @__PURE__ */ jsxs(Badge, { variant: "outline", className: "text-[0.65rem]", children: [
                    /* @__PURE__ */ jsx(Clock, { className: "w-3 h-3 mr-1" }),
                    new Date(exam.date).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric"
                    })
                  ] }),
                  /* @__PURE__ */ jsxs(Badge, { variant: "outline", className: "text-[0.65rem]", children: [
                    exam.startTime,
                    " - ",
                    exam.endTime
                  ] }),
                  seat ? /* @__PURE__ */ jsxs(Badge, { className: "text-[0.65rem] bg-blue-100 text-blue-700", children: [
                    /* @__PURE__ */ jsx(MapPin, { className: "w-3 h-3 mr-1" }),
                    "Room ",
                    seat.room?.roomNumber,
                    " \u2022 Seat ",
                    seat.seatNumber
                  ] }) : /* @__PURE__ */ jsxs(Badge, { variant: "secondary", className: "text-[0.65rem]", children: [
                    /* @__PURE__ */ jsx(AlertTriangle, { className: "w-3 h-3 mr-1" }),
                    "Seat not yet allocated"
                  ] })
                ] })
              ]
            },
            exam.id
          );
        }) }) })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxs(CardTitle, { className: "text-[0.9rem] flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Grid3X3, { className: "w-4 h-4 text-blue-600" }),
          "My Seat Allocations"
        ] }) }),
        /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { className: "space-y-3", children: mySeats.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "text-center py-8", children: [
          /* @__PURE__ */ jsx(Grid3X3, { className: "w-10 h-10 text-muted-foreground/30 mx-auto mb-2" }),
          /* @__PURE__ */ jsx("p", { className: "text-[0.85rem] text-muted-foreground", children: "No seats allocated yet" }),
          /* @__PURE__ */ jsx("p", { className: "text-[0.75rem] text-muted-foreground/70 mt-1", children: "Seats will appear here after the admin runs seating allocation" })
        ] }) : mySeats.map((seat) => /* @__PURE__ */ jsxs(
          "div",
          {
            className: "flex items-center gap-3 p-3 bg-accent/50 rounded-lg border border-border/50",
            children: [
              /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
                /* @__PURE__ */ jsx("p", { className: "text-[0.6rem] uppercase", children: "Seat" }),
                /* @__PURE__ */ jsx("p", { className: "text-[1rem] font-bold leading-none", children: seat.seatNumber })
              ] }) }),
              /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsx("p", { className: "text-[0.85rem] font-medium", children: seat.exam?.subject || "\u2014" }),
                /* @__PURE__ */ jsx("p", { className: "text-[0.7rem] text-muted-foreground", children: seat.exam?.name }),
                /* @__PURE__ */ jsxs("div", { className: "flex gap-2 mt-1", children: [
                  /* @__PURE__ */ jsxs(Badge, { variant: "outline", className: "text-[0.6rem]", children: [
                    /* @__PURE__ */ jsx(MapPin, { className: "w-3 h-3 mr-1" }),
                    "Room ",
                    seat.room?.roomNumber,
                    " \u2022 ",
                    seat.room?.building
                  ] }),
                  /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-[0.6rem]", children: seat.exam ? new Date(seat.exam.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric"
                  }) : "\u2014" })
                ] })
              ] })
            ]
          },
          seat.id
        )) }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxs(CardTitle, { className: "text-[0.9rem] flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(ClipboardList, { className: "w-4 h-4 text-green-600" }),
        "Attendance Record"
      ] }) }),
      /* @__PURE__ */ jsx(CardContent, { children: myAttendance.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "text-center py-8", children: [
        /* @__PURE__ */ jsx(ClipboardList, { className: "w-10 h-10 text-muted-foreground/30 mx-auto mb-2" }),
        /* @__PURE__ */ jsx("p", { className: "text-[0.85rem] text-muted-foreground", children: "No attendance records yet" }),
        /* @__PURE__ */ jsx("p", { className: "text-[0.75rem] text-muted-foreground/70 mt-1", children: "Attendance will appear here after exams are conducted" })
      ] }) : /* @__PURE__ */ jsx("div", { className: "space-y-2", children: myAttendance.map((record) => /* @__PURE__ */ jsxs(
        "div",
        {
          className: "flex items-center justify-between p-3 bg-accent/30 rounded-lg",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsx("div", { className: "shrink-0", children: record.status === "present" ? /* @__PURE__ */ jsx(CheckCircle2, { className: "w-5 h-5 text-green-600" }) : record.status === "absent" ? /* @__PURE__ */ jsx(AlertTriangle, { className: "w-5 h-5 text-red-500" }) : /* @__PURE__ */ jsx(Clock, { className: "w-5 h-5 text-muted-foreground" }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-[0.85rem] font-medium", children: record.exam?.subject || "\u2014" }),
                /* @__PURE__ */ jsxs("p", { className: "text-[0.7rem] text-muted-foreground", children: [
                  record.exam?.name,
                  " \u2022 Room ",
                  record.room?.roomNumber
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
              /* @__PURE__ */ jsx(
                Badge,
                {
                  variant: record.status === "present" ? "default" : record.status === "absent" ? "destructive" : "secondary",
                  className: "text-[0.65rem]",
                  children: record.status
                }
              ),
              /* @__PURE__ */ jsx("p", { className: "text-[0.65rem] text-muted-foreground mt-1", children: record.exam ? new Date(record.exam.date).toLocaleDateString() : "\u2014" })
            ] })
          ]
        },
        record.id
      )) }) })
    ] })
  ] });
}
export {
  StudentDashboard
};
