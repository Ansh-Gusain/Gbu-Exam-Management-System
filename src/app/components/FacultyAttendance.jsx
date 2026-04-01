import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useMemo, useState } from "react";
import { useStore } from "../lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "./ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "./ui/select";
import { ClipboardList, Check, X, UserCheck, Users } from "lucide-react";
import { toast } from "sonner";
function FacultyAttendance() {
  const {
    loggedInFacultyId,
    exams,
    rooms,
    students,
    invigilationAllocations,
    seatingAllocations,
    attendanceRecords,
    setAttendanceRecords
  } = useStore();
  const [selectedDutyId, setSelectedDutyId] = useState("none");
  const myDuties = useMemo(() => {
    return invigilationAllocations.filter((ia) => ia.facultyId === loggedInFacultyId).map((duty) => {
      const exam = exams.find((e) => e.id === duty.examId);
      const room = rooms.find((r) => r.id === duty.roomId);
      return { ...duty, exam, room };
    }).filter((d) => d.exam && (d.exam.status === "scheduled" || d.exam.status === "ongoing"));
  }, [invigilationAllocations, loggedInFacultyId, exams, rooms]);
  const selectedDuty = myDuties.find((d) => d.id === selectedDutyId);
  const studentsInRoom = useMemo(() => {
    if (!selectedDuty) return [];
    return seatingAllocations.filter((sa) => sa.examId === selectedDuty.examId && sa.roomId === selectedDuty.roomId).map((sa) => {
      const student = students.find((s) => s.id === sa.studentId);
      const attendance = attendanceRecords.find(
        (ar) => ar.examId === sa.examId && ar.roomId === sa.roomId && ar.studentId === sa.studentId
      );
      return { ...sa, student, attendance };
    }).sort((a, b) => (a.student?.rollNumber || "").localeCompare(b.student?.rollNumber || ""));
  }, [selectedDuty, seatingAllocations, students, attendanceRecords]);
  const handleMarkAttendance = (studentId, status) => {
    if (!selectedDuty) return;
    setAttendanceRecords((prev) => {
      const existing = prev.findIndex(
        (ar) => ar.examId === selectedDuty.examId && ar.roomId === selectedDuty.roomId && ar.studentId === studentId
      );
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = { ...updated[existing], status, signature: status === "present" };
        return updated;
      }
      return [
        ...prev,
        {
          id: `att-${Date.now()}-${studentId}`,
          examId: selectedDuty.examId,
          roomId: selectedDuty.roomId,
          studentId,
          status,
          signature: status === "present"
        }
      ];
    });
  };
  const handleMarkAllPresent = () => {
    if (!selectedDuty) return;
    studentsInRoom.forEach((s) => {
      if (s.student) handleMarkAttendance(s.student.id, "present");
    });
    toast.success("All students marked present");
  };
  const presentCount = studentsInRoom.filter((s) => s.attendance?.status === "present").length;
  const absentCount = studentsInRoom.filter((s) => s.attendance?.status === "absent").length;
  const unmarkedCount = studentsInRoom.length - presentCount - absentCount;
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h1", { children: "Mark Attendance" }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-[0.85rem] mt-1", children: "Mark student attendance for your assigned rooms" })
    ] }),
    /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, { className: "py-4 px-4", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-3 items-start sm:items-center", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsx("label", { className: "text-[0.8rem] font-medium mb-1.5 block", children: "Select Duty" }),
        /* @__PURE__ */ jsxs(Select, { value: selectedDutyId, onValueChange: setSelectedDutyId, children: [
          /* @__PURE__ */ jsx(SelectTrigger, { className: "w-full text-[0.85rem]", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select an assigned duty..." }) }),
          /* @__PURE__ */ jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsx(SelectItem, { value: "none", children: "Select a duty..." }),
            myDuties.map((duty) => /* @__PURE__ */ jsxs(SelectItem, { value: duty.id, children: [
              duty.exam?.subject,
              " \u2014 Room ",
              duty.room?.roomNumber,
              " (",
              duty.exam?.date,
              ")"
            ] }, duty.id))
          ] })
        ] })
      ] }),
      selectedDuty && studentsInRoom.length > 0 && /* @__PURE__ */ jsxs(
        Button,
        {
          size: "sm",
          variant: "outline",
          className: "mt-auto",
          onClick: handleMarkAllPresent,
          children: [
            /* @__PURE__ */ jsx(UserCheck, { className: "w-4 h-4 mr-1" }),
            " Mark All Present"
          ]
        }
      )
    ] }) }) }),
    myDuties.length === 0 && /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, { className: "py-12", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx(ClipboardList, { className: "w-12 h-12 text-muted-foreground/30 mx-auto mb-3" }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "No active duties to mark attendance" }),
      /* @__PURE__ */ jsx("p", { className: "text-[0.75rem] text-muted-foreground/70 mt-1", children: "You need to have assigned invigilation duties with seating allocations" })
    ] }) }) }),
    selectedDuty && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-3", children: [
        /* @__PURE__ */ jsx(Card, { className: "py-3", children: /* @__PURE__ */ jsxs(CardContent, { className: "px-4 py-0", children: [
          /* @__PURE__ */ jsx("p", { className: "text-[0.7rem] text-muted-foreground", children: "Total Students" }),
          /* @__PURE__ */ jsx("p", { className: "text-[1.1rem] font-semibold", children: studentsInRoom.length })
        ] }) }),
        /* @__PURE__ */ jsx(Card, { className: "py-3", children: /* @__PURE__ */ jsxs(CardContent, { className: "px-4 py-0", children: [
          /* @__PURE__ */ jsx("p", { className: "text-[0.7rem] text-green-600", children: "Present" }),
          /* @__PURE__ */ jsx("p", { className: "text-[1.1rem] font-semibold text-green-700", children: presentCount })
        ] }) }),
        /* @__PURE__ */ jsx(Card, { className: "py-3", children: /* @__PURE__ */ jsxs(CardContent, { className: "px-4 py-0", children: [
          /* @__PURE__ */ jsx("p", { className: "text-[0.7rem] text-red-600", children: "Absent" }),
          /* @__PURE__ */ jsx("p", { className: "text-[1.1rem] font-semibold text-red-700", children: absentCount })
        ] }) }),
        /* @__PURE__ */ jsx(Card, { className: "py-3", children: /* @__PURE__ */ jsxs(CardContent, { className: "px-4 py-0", children: [
          /* @__PURE__ */ jsx("p", { className: "text-[0.7rem] text-amber-600", children: "Unmarked" }),
          /* @__PURE__ */ jsx("p", { className: "text-[1.1rem] font-semibold text-amber-700", children: unmarkedCount })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxs(CardTitle, { className: "text-[0.9rem] flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Users, { className: "w-4 h-4" }),
          "Students in Room ",
          selectedDuty.room?.roomNumber,
          /* @__PURE__ */ jsxs("span", { className: "text-muted-foreground font-normal", children: [
            "(",
            studentsInRoom.length,
            " students)"
          ] })
        ] }) }),
        /* @__PURE__ */ jsx(CardContent, { children: studentsInRoom.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "text-center py-8", children: [
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-[0.85rem]", children: "No students allocated to this room for this exam" }),
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground/70 text-[0.75rem] mt-1", children: "Run seating allocation from the admin panel first" })
        ] }) : /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs(Table, { children: [
          /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
            /* @__PURE__ */ jsx(TableHead, { className: "text-[0.75rem]", children: "Seat #" }),
            /* @__PURE__ */ jsx(TableHead, { className: "text-[0.75rem]", children: "Roll No." }),
            /* @__PURE__ */ jsx(TableHead, { className: "text-[0.75rem]", children: "Name" }),
            /* @__PURE__ */ jsx(TableHead, { className: "text-[0.75rem]", children: "Branch" }),
            /* @__PURE__ */ jsx(TableHead, { className: "text-[0.75rem]", children: "Status" }),
            /* @__PURE__ */ jsx(TableHead, { className: "text-[0.75rem] text-right", children: "Action" })
          ] }) }),
          /* @__PURE__ */ jsx(TableBody, { children: studentsInRoom.map((entry) => /* @__PURE__ */ jsxs(TableRow, { children: [
            /* @__PURE__ */ jsx(TableCell, { className: "text-[0.8rem] font-mono", children: entry.seatNumber }),
            /* @__PURE__ */ jsx(TableCell, { className: "text-[0.8rem] font-mono", children: entry.student?.rollNumber }),
            /* @__PURE__ */ jsx(TableCell, { className: "text-[0.8rem]", children: entry.student?.name }),
            /* @__PURE__ */ jsx(TableCell, { className: "text-[0.8rem]", children: /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-[0.65rem]", children: entry.student?.branch }) }),
            /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(
              Badge,
              {
                variant: entry.attendance?.status === "present" ? "default" : entry.attendance?.status === "absent" ? "destructive" : "secondary",
                className: "text-[0.65rem]",
                children: entry.attendance?.status || "not-marked"
              }
            ) }),
            /* @__PURE__ */ jsx(TableCell, { className: "text-right", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-1 justify-end", children: [
              /* @__PURE__ */ jsx(
                Button,
                {
                  size: "sm",
                  variant: entry.attendance?.status === "present" ? "default" : "outline",
                  className: "h-7 w-7 p-0",
                  onClick: () => entry.student && handleMarkAttendance(entry.student.id, "present"),
                  children: /* @__PURE__ */ jsx(Check, { className: "w-3.5 h-3.5" })
                }
              ),
              /* @__PURE__ */ jsx(
                Button,
                {
                  size: "sm",
                  variant: entry.attendance?.status === "absent" ? "destructive" : "outline",
                  className: "h-7 w-7 p-0",
                  onClick: () => entry.student && handleMarkAttendance(entry.student.id, "absent"),
                  children: /* @__PURE__ */ jsx(X, { className: "w-3.5 h-3.5" })
                }
              )
            ] }) })
          ] }, entry.id)) })
        ] }) }) })
      ] })
    ] })
  ] });
}
export {
  FacultyAttendance
};
