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
import { CalendarDays, MapPin, Award, Clock, CheckCircle2 } from "lucide-react";
function FacultyDuties() {
  const {
    loggedInFacultyId,
    faculty,
    exams,
    rooms,
    invigilationAllocations
  } = useStore();
  const currentFaculty = faculty.find((f) => f.id === loggedInFacultyId);
  const allDuties = useMemo(() => {
    return invigilationAllocations.filter((ia) => ia.facultyId === loggedInFacultyId).map((duty) => {
      const exam = exams.find((e) => e.id === duty.examId);
      const room = rooms.find((r) => r.id === duty.roomId);
      return { ...duty, exam, room };
    }).sort((a, b) => {
      if (!a.exam || !b.exam) return 0;
      return a.exam.date.localeCompare(b.exam.date);
    });
  }, [invigilationAllocations, loggedInFacultyId, exams, rooms]);
  const upcomingDuties = allDuties.filter((d) => d.exam?.status === "scheduled");
  const completedDuties = allDuties.filter((d) => d.exam?.status === "completed");
  const ongoingDuties = allDuties.filter((d) => d.exam?.status === "ongoing");
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h1", { children: "My Invigilation Duties" }),
      /* @__PURE__ */ jsxs("p", { className: "text-muted-foreground text-[0.85rem] mt-1", children: [
        currentFaculty?.name,
        " \u2022 Total assignments: ",
        allDuties.length
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
      /* @__PURE__ */ jsx(Card, { className: "py-3", children: /* @__PURE__ */ jsxs(CardContent, { className: "px-4 py-0", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
          /* @__PURE__ */ jsx(Clock, { className: "w-4 h-4 text-amber-600" }),
          /* @__PURE__ */ jsx("p", { className: "text-[0.75rem] text-muted-foreground", children: "Upcoming" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-[1.25rem] font-semibold", children: upcomingDuties.length })
      ] }) }),
      /* @__PURE__ */ jsx(Card, { className: "py-3", children: /* @__PURE__ */ jsxs(CardContent, { className: "px-4 py-0", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
          /* @__PURE__ */ jsx(CalendarDays, { className: "w-4 h-4 text-blue-600" }),
          /* @__PURE__ */ jsx("p", { className: "text-[0.75rem] text-muted-foreground", children: "Ongoing" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-[1.25rem] font-semibold", children: ongoingDuties.length })
      ] }) }),
      /* @__PURE__ */ jsx(Card, { className: "py-3", children: /* @__PURE__ */ jsxs(CardContent, { className: "px-4 py-0", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
          /* @__PURE__ */ jsx(CheckCircle2, { className: "w-4 h-4 text-green-600" }),
          /* @__PURE__ */ jsx("p", { className: "text-[0.75rem] text-muted-foreground", children: "Completed" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-[1.25rem] font-semibold", children: completedDuties.length })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsx(CardTitle, { className: "text-[0.9rem]", children: "All Assigned Duties" }) }),
      /* @__PURE__ */ jsx(CardContent, { children: allDuties.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "text-center py-12", children: [
        /* @__PURE__ */ jsx(CalendarDays, { className: "w-12 h-12 text-muted-foreground/30 mx-auto mb-3" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "No duties assigned yet" }),
        /* @__PURE__ */ jsx("p", { className: "text-[0.75rem] text-muted-foreground/70 mt-1", children: "Duties will appear here once the admin runs invigilator allocation" })
      ] }) : /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs(Table, { children: [
        /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableHead, { className: "text-[0.75rem]", children: "Exam" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-[0.75rem]", children: "Subject" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-[0.75rem]", children: "Date & Time" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-[0.75rem]", children: "Room" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-[0.75rem]", children: "Role" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-[0.75rem]", children: "Status" })
        ] }) }),
        /* @__PURE__ */ jsx(TableBody, { children: allDuties.map((duty) => /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableCell, { className: "text-[0.8rem]", children: duty.exam?.name || "\u2014" }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-[0.8rem] font-medium", children: duty.exam?.subject || "\u2014" }),
          /* @__PURE__ */ jsxs(TableCell, { className: "text-[0.8rem]", children: [
            /* @__PURE__ */ jsx("div", { children: duty.exam ? new Date(duty.exam.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric"
            }) : "\u2014" }),
            /* @__PURE__ */ jsxs("div", { className: "text-[0.7rem] text-muted-foreground", children: [
              duty.exam?.startTime,
              " - ",
              duty.exam?.endTime
            ] })
          ] }),
          /* @__PURE__ */ jsxs(TableCell, { className: "text-[0.8rem]", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsx(MapPin, { className: "w-3 h-3 text-muted-foreground" }),
              duty.room?.roomNumber || "\u2014"
            ] }),
            /* @__PURE__ */ jsx("div", { className: "text-[0.7rem] text-muted-foreground", children: duty.room?.building })
          ] }),
          /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs(
            Badge,
            {
              className: `text-[0.65rem] ${duty.role === "chief" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"}`,
              children: [
                /* @__PURE__ */ jsx(Award, { className: "w-3 h-3 mr-1" }),
                duty.role === "chief" ? "Chief" : "Assistant"
              ]
            }
          ) }),
          /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(
            Badge,
            {
              variant: duty.exam?.status === "completed" ? "default" : duty.exam?.status === "ongoing" ? "secondary" : "outline",
              className: "text-[0.65rem]",
              children: duty.exam?.status || "unknown"
            }
          ) })
        ] }, duty.id)) })
      ] }) }) })
    ] })
  ] });
}
export {
  FacultyDuties
};
