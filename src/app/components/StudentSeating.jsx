import { Fragment, jsx, jsxs } from "react/jsx-runtime";
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
import { Grid3X3, MapPin, Clock, BookOpen } from "lucide-react";
function StudentSeating() {
  const {
    loggedInStudentId,
    students,
    exams,
    rooms,
    seatingAllocations
  } = useStore();
  const currentStudent = students.find((s) => s.id === loggedInStudentId);
  const mySeats = useMemo(() => {
    if (!currentStudent) return [];
    return seatingAllocations.filter((sa) => sa.studentId === currentStudent.id).map((sa) => {
      const exam = exams.find((e) => e.id === sa.examId);
      const room = rooms.find((r) => r.id === sa.roomId);
      return { ...sa, exam, room };
    }).sort((a, b) => (a.exam?.date || "").localeCompare(b.exam?.date || ""));
  }, [seatingAllocations, currentStudent, exams, rooms]);
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h1", { children: "My Seat Allocations" }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-[0.85rem] mt-1", children: "View your assigned seats for each exam" })
    ] }),
    mySeats.length === 0 ? /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, { className: "py-12", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx(Grid3X3, { className: "w-12 h-12 text-muted-foreground/30 mx-auto mb-3" }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "No seat allocations found" }),
      /* @__PURE__ */ jsx("p", { className: "text-[0.75rem] text-muted-foreground/70 mt-1", children: "Seat assignments will appear here after the admin runs the seating allocation algorithm" })
    ] }) }) }) : /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-2 lg:grid-cols-3 gap-4", children: mySeats.map((seat) => /* @__PURE__ */ jsxs(Card, { className: "relative overflow-hidden", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-16 h-16 bg-blue-50 rounded-bl-[2rem] flex items-center justify-center", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsx("p", { className: "text-[0.55rem] text-blue-500 uppercase font-medium", children: "Seat" }),
          /* @__PURE__ */ jsx("p", { className: "text-[1.1rem] font-bold text-blue-700 leading-none", children: seat.seatNumber })
        ] }) }),
        /* @__PURE__ */ jsxs(CardContent, { className: "pt-4 pb-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "pr-14", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
              /* @__PURE__ */ jsx(BookOpen, { className: "w-4 h-4 text-blue-600 shrink-0" }),
              /* @__PURE__ */ jsx("p", { className: "text-[0.9rem] font-medium truncate", children: seat.exam?.subject || "\u2014" })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-[0.7rem] text-muted-foreground ml-6", children: seat.exam?.name })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2 mt-3", children: [
            /* @__PURE__ */ jsxs(Badge, { variant: "outline", className: "text-[0.6rem]", children: [
              /* @__PURE__ */ jsx(Clock, { className: "w-3 h-3 mr-1" }),
              seat.exam ? new Date(seat.exam.date).toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric"
              }) : "\u2014"
            ] }),
            /* @__PURE__ */ jsxs(Badge, { variant: "outline", className: "text-[0.6rem]", children: [
              seat.exam?.startTime,
              " - ",
              seat.exam?.endTime
            ] }),
            /* @__PURE__ */ jsxs(Badge, { variant: "outline", className: "text-[0.6rem]", children: [
              /* @__PURE__ */ jsx(MapPin, { className: "w-3 h-3 mr-1" }),
              "Room ",
              seat.room?.roomNumber
            ] })
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "text-[0.65rem] text-muted-foreground mt-2", children: [
            seat.room?.building,
            " \u2022 Floor ",
            seat.room?.floor
          ] })
        ] })
      ] }, seat.id)) }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsx(CardTitle, { className: "text-[0.9rem]", children: "Detailed View" }) }),
        /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs(Table, { children: [
          /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
            /* @__PURE__ */ jsx(TableHead, { className: "text-[0.75rem]", children: "Exam" }),
            /* @__PURE__ */ jsx(TableHead, { className: "text-[0.75rem]", children: "Subject" }),
            /* @__PURE__ */ jsx(TableHead, { className: "text-[0.75rem]", children: "Date & Time" }),
            /* @__PURE__ */ jsx(TableHead, { className: "text-[0.75rem]", children: "Room" }),
            /* @__PURE__ */ jsx(TableHead, { className: "text-[0.75rem]", children: "Building" }),
            /* @__PURE__ */ jsx(TableHead, { className: "text-[0.75rem]", children: "Seat No." })
          ] }) }),
          /* @__PURE__ */ jsx(TableBody, { children: mySeats.map((seat) => /* @__PURE__ */ jsxs(TableRow, { children: [
            /* @__PURE__ */ jsx(TableCell, { className: "text-[0.8rem]", children: seat.exam?.name || "\u2014" }),
            /* @__PURE__ */ jsx(TableCell, { className: "text-[0.8rem] font-medium", children: seat.exam?.subject || "\u2014" }),
            /* @__PURE__ */ jsxs(TableCell, { className: "text-[0.8rem]", children: [
              /* @__PURE__ */ jsx("div", { children: seat.exam ? new Date(seat.exam.date).toLocaleDateString() : "\u2014" }),
              /* @__PURE__ */ jsxs("div", { className: "text-[0.7rem] text-muted-foreground", children: [
                seat.exam?.startTime,
                " - ",
                seat.exam?.endTime
              ] })
            ] }),
            /* @__PURE__ */ jsx(TableCell, { className: "text-[0.8rem]", children: seat.room?.roomNumber || "\u2014" }),
            /* @__PURE__ */ jsx(TableCell, { className: "text-[0.8rem]", children: seat.room?.building || "\u2014" }),
            /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs(Badge, { className: "bg-blue-100 text-blue-700 text-[0.75rem]", children: [
              "#",
              seat.seatNumber
            ] }) })
          ] }, seat.id)) })
        ] }) }) })
      ] })
    ] })
  ] });
}
export {
  StudentSeating
};
