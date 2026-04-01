import { jsx, jsxs } from "react/jsx-runtime";
import { useMemo } from "react";
import { useStore } from "../lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  CalendarDays,
  RefreshCw,
  CheckCircle2,
  Clock,
  AlertCircle,
  MapPin,
  BookOpen,
  Award
} from "lucide-react";
function FacultyDashboard() {
  const {
    loggedInFacultyId,
    faculty,
    exams,
    rooms,
    invigilationAllocations,
    replacementLogs,
    attendanceRecords,
    seatingAllocations
  } = useStore();
  const currentFaculty = faculty.find((f) => f.id === loggedInFacultyId);
  const myDuties = useMemo(() => {
    return invigilationAllocations.filter((ia) => ia.facultyId === loggedInFacultyId);
  }, [invigilationAllocations, loggedInFacultyId]);
  const upcomingDuties = useMemo(() => {
    return myDuties.map((duty) => {
      const exam = exams.find((e) => e.id === duty.examId);
      const room = rooms.find((r) => r.id === duty.roomId);
      return { ...duty, exam, room };
    }).filter((d) => d.exam && d.exam.status === "scheduled").sort((a, b) => a.exam.date.localeCompare(b.exam.date));
  }, [myDuties, exams, rooms]);
  const completedDuties = useMemo(() => {
    return myDuties.map((duty) => {
      const exam = exams.find((e) => e.id === duty.examId);
      const room = rooms.find((r) => r.id === duty.roomId);
      return { ...duty, exam, room };
    }).filter((d) => d.exam && d.exam.status === "completed");
  }, [myDuties, exams, rooms]);
  const myReplacements = useMemo(() => {
    return replacementLogs.filter((r) => r.originalFacultyId === loggedInFacultyId);
  }, [replacementLogs, loggedInFacultyId]);
  const pendingReplacements = myReplacements.filter((r) => r.status === "pending").length;
  const approvedReplacements = myReplacements.filter((r) => r.status === "approved").length;
  const stats = [
    {
      label: "Total Duties",
      value: currentFaculty?.totalDuties || myDuties.length,
      icon: CalendarDays,
      color: "text-blue-600 bg-blue-50"
    },
    {
      label: "Upcoming",
      value: upcomingDuties.length,
      icon: Clock,
      color: "text-amber-600 bg-amber-50"
    },
    {
      label: "Completed",
      value: completedDuties.length,
      icon: CheckCircle2,
      color: "text-green-600 bg-green-50"
    },
    {
      label: "Pending Requests",
      value: pendingReplacements,
      icon: RefreshCw,
      color: "text-orange-600 bg-orange-50"
    }
  ];
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsxs("h1", { className: "text-[1.5rem]", children: [
        "Welcome, ",
        currentFaculty?.name || "Faculty"
      ] }),
      /* @__PURE__ */ jsxs("p", { className: "text-muted-foreground text-[0.85rem] mt-1", children: [
        currentFaculty?.department,
        " \u2022 ",
        currentFaculty?.designation,
        " \u2022 ",
        currentFaculty?.employeeId
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
          /* @__PURE__ */ jsx(CalendarDays, { className: "w-4 h-4 text-green-600" }),
          "Upcoming Invigilation Duties"
        ] }) }),
        /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { className: "space-y-3", children: upcomingDuties.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "text-center py-8", children: [
          /* @__PURE__ */ jsx(CheckCircle2, { className: "w-10 h-10 text-muted-foreground/30 mx-auto mb-2" }),
          /* @__PURE__ */ jsx("p", { className: "text-[0.85rem] text-muted-foreground", children: "No upcoming duties assigned" }),
          /* @__PURE__ */ jsx("p", { className: "text-[0.75rem] text-muted-foreground/70 mt-1", children: "Duties will appear here once the admin allocates invigilators" })
        ] }) : upcomingDuties.map((duty) => /* @__PURE__ */ jsxs(
          "div",
          {
            className: "flex items-start gap-3 p-3 bg-accent/50 rounded-lg border border-border/50",
            children: [
              /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-lg bg-green-50 text-green-700 flex items-center justify-center shrink-0 mt-0.5", children: /* @__PURE__ */ jsx(BookOpen, { className: "w-4 h-4" }) }),
              /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsx("p", { className: "text-[0.85rem] font-medium", children: duty.exam.subject }),
                /* @__PURE__ */ jsx("p", { className: "text-[0.7rem] text-muted-foreground", children: duty.exam.name }),
                /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2 mt-2", children: [
                  /* @__PURE__ */ jsxs(Badge, { variant: "outline", className: "text-[0.65rem]", children: [
                    /* @__PURE__ */ jsx(Clock, { className: "w-3 h-3 mr-1" }),
                    new Date(duty.exam.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
                    " ",
                    duty.exam.startTime,
                    " - ",
                    duty.exam.endTime
                  ] }),
                  /* @__PURE__ */ jsxs(Badge, { variant: "outline", className: "text-[0.65rem]", children: [
                    /* @__PURE__ */ jsx(MapPin, { className: "w-3 h-3 mr-1" }),
                    "Room ",
                    duty.room?.roomNumber,
                    " \u2022 ",
                    duty.room?.building
                  ] }),
                  /* @__PURE__ */ jsxs(
                    Badge,
                    {
                      className: `text-[0.65rem] ${duty.role === "chief" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"}`,
                      children: [
                        /* @__PURE__ */ jsx(Award, { className: "w-3 h-3 mr-1" }),
                        duty.role === "chief" ? "Chief Invigilator" : "Assistant"
                      ]
                    }
                  )
                ] })
              ] })
            ]
          },
          duty.id
        )) }) })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxs(CardTitle, { className: "text-[0.9rem] flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(RefreshCw, { className: "w-4 h-4 text-orange-600" }),
          "My Replacement Requests"
        ] }) }),
        /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { className: "space-y-3", children: myReplacements.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "text-center py-8", children: [
          /* @__PURE__ */ jsx(RefreshCw, { className: "w-10 h-10 text-muted-foreground/30 mx-auto mb-2" }),
          /* @__PURE__ */ jsx("p", { className: "text-[0.85rem] text-muted-foreground", children: "No replacement requests" }),
          /* @__PURE__ */ jsx("p", { className: "text-[0.75rem] text-muted-foreground/70 mt-1", children: "You can request replacements from the Replacements page" })
        ] }) : myReplacements.map((rep) => {
          const exam = exams.find((e) => e.id === rep.examId);
          const room = rooms.find((r) => r.id === rep.roomId);
          const replacementFac = faculty.find((f) => f.id === rep.replacementFacultyId);
          return /* @__PURE__ */ jsxs(
            "div",
            {
              className: "flex items-start gap-3 p-3 bg-accent/50 rounded-lg border border-border/50",
              children: [
                /* @__PURE__ */ jsx("div", { className: "shrink-0 mt-0.5", children: rep.status === "approved" ? /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-full bg-green-50 flex items-center justify-center", children: /* @__PURE__ */ jsx(CheckCircle2, { className: "w-4 h-4 text-green-600" }) }) : rep.status === "pending" ? /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center", children: /* @__PURE__ */ jsx(Clock, { className: "w-4 h-4 text-amber-600" }) }) : /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-full bg-red-50 flex items-center justify-center", children: /* @__PURE__ */ jsx(AlertCircle, { className: "w-4 h-4 text-red-600" }) }) }),
                /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsx("p", { className: "text-[0.85rem] font-medium truncate", children: exam?.subject || "Exam" }),
                    /* @__PURE__ */ jsx(
                      Badge,
                      {
                        variant: rep.status === "approved" ? "default" : rep.status === "pending" ? "secondary" : "destructive",
                        className: "text-[0.6rem] shrink-0",
                        children: rep.status
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxs("p", { className: "text-[0.7rem] text-muted-foreground mt-0.5", children: [
                    "Room ",
                    room?.roomNumber,
                    " \u2022 Reason: ",
                    rep.reason
                  ] }),
                  replacementFac && /* @__PURE__ */ jsxs("p", { className: "text-[0.7rem] text-muted-foreground", children: [
                    "Replacement: ",
                    replacementFac.name
                  ] }),
                  /* @__PURE__ */ jsxs("p", { className: "text-[0.65rem] text-muted-foreground/70 mt-1", children: [
                    "Requested: ",
                    new Date(rep.requestedAt).toLocaleString()
                  ] })
                ] })
              ]
            },
            rep.id
          );
        }) }) })
      ] })
    ] }),
    completedDuties.length > 0 && /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxs(CardTitle, { className: "text-[0.9rem] flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(CheckCircle2, { className: "w-4 h-4 text-green-600" }),
        "Completed Duties"
      ] }) }),
      /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { className: "space-y-2", children: completedDuties.map((duty) => /* @__PURE__ */ jsxs(
        "div",
        {
          className: "flex items-center justify-between p-3 bg-accent/30 rounded-lg",
          children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-[0.85rem]", children: duty.exam.subject }),
              /* @__PURE__ */ jsxs("p", { className: "text-[0.7rem] text-muted-foreground", children: [
                "Room ",
                duty.room?.roomNumber,
                " \u2022 ",
                duty.role === "chief" ? "Chief Invigilator" : "Assistant"
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
              /* @__PURE__ */ jsx("p", { className: "text-[0.75rem]", children: new Date(duty.exam.date).toLocaleDateString() }),
              /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-[0.6rem] text-green-600 border-green-200", children: "Completed" })
            ] })
          ]
        },
        duty.id
      )) }) })
    ] })
  ] });
}
export {
  FacultyDashboard
};
