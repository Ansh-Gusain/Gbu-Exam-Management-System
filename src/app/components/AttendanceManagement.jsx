import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useState, useMemo } from "react";
import { useStore } from "../lib/store";
import { generateAttendanceSheet } from "../lib/algorithms";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "./ui/select";
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
  XCircle,
  Minus,
  Users
} from "lucide-react";
import { toast } from "sonner";
function AttendanceManagement() {
  const {
    students,
    rooms,
    exams,
    seatingAllocations,
    attendanceRecords,
    setAttendanceRecords,
    invigilationAllocations,
    faculty
  } = useStore();
  const [selectedExamId, setSelectedExamId] = useState("");
  const [selectedRoomId, setSelectedRoomId] = useState("");
  const selectedExam = exams.find((e) => e.id === selectedExamId);
  const examRooms = useMemo(() => {
    const roomIds = [
      ...new Set(
        seatingAllocations.filter((sa) => sa.examId === selectedExamId).map((sa) => sa.roomId)
      )
    ];
    return roomIds.map((rid) => rooms.find((r) => r.id === rid)).filter(Boolean);
  }, [seatingAllocations, selectedExamId, rooms]);
  const roomAttendance = useMemo(() => {
    if (!selectedExamId || !selectedRoomId) return [];
    const existing = attendanceRecords.filter(
      (ar) => ar.examId === selectedExamId && ar.roomId === selectedRoomId
    );
    if (existing.length > 0) return existing;
    return generateAttendanceSheet(
      seatingAllocations,
      selectedExamId,
      selectedRoomId
    );
  }, [
    selectedExamId,
    selectedRoomId,
    attendanceRecords,
    seatingAllocations
  ]);
  const roomInvigilator = useMemo(() => {
    const ia = invigilationAllocations.find(
      (a) => a.examId === selectedExamId && a.roomId === selectedRoomId
    );
    if (!ia) return null;
    return faculty.find((f) => f.id === ia.facultyId);
  }, [invigilationAllocations, selectedExamId, selectedRoomId, faculty]);
  const markAttendance = (studentId, status) => {
    setAttendanceRecords((prev) => {
      const existing = prev.find(
        (ar) => ar.examId === selectedExamId && ar.roomId === selectedRoomId && ar.studentId === studentId
      );
      if (existing) {
        return prev.map(
          (ar) => ar.id === existing.id ? { ...ar, status, signature: status === "present" } : ar
        );
      }
      const record = {
        id: `att-${Date.now()}-${studentId}`,
        examId: selectedExamId,
        roomId: selectedRoomId,
        studentId,
        status,
        signature: status === "present"
      };
      return [...prev, record];
    });
  };
  const markAllPresent = () => {
    const newRecords = roomAttendance.map((ra) => ({
      ...ra,
      id: ra.id || `att-${Date.now()}-${ra.studentId}`,
      status: "present",
      signature: true
    }));
    setAttendanceRecords((prev) => {
      const withoutCurrent = prev.filter(
        (ar) => !(ar.examId === selectedExamId && ar.roomId === selectedRoomId)
      );
      return [...withoutCurrent, ...newRecords];
    });
    toast.success("All students marked present.");
  };
  const presentCount = roomAttendance.filter((r) => r.status === "present").length;
  const absentCount = roomAttendance.filter((r) => r.status === "absent").length;
  const notMarkedCount = roomAttendance.filter(
    (r) => r.status === "not-marked"
  ).length;
  return /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("h1", { children: "Attendance Management" }) }),
    /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, { className: "py-4 px-4", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsx("label", { className: "text-[0.8rem] text-muted-foreground mb-1 block", children: "Select Exam" }),
        /* @__PURE__ */ jsxs(
          Select,
          {
            value: selectedExamId,
            onValueChange: (v) => {
              setSelectedExamId(v);
              setSelectedRoomId("");
            },
            children: [
              /* @__PURE__ */ jsx(SelectTrigger, { className: "text-[0.85rem]", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Choose an exam..." }) }),
              /* @__PURE__ */ jsx(SelectContent, { children: exams.map((exam) => /* @__PURE__ */ jsxs(SelectItem, { value: exam.id, children: [
                exam.subject,
                " \u2014 ",
                exam.name,
                " (",
                exam.date,
                ")"
              ] }, exam.id)) })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsx("label", { className: "text-[0.8rem] text-muted-foreground mb-1 block", children: "Select Room" }),
        /* @__PURE__ */ jsxs(
          Select,
          {
            value: selectedRoomId,
            onValueChange: setSelectedRoomId,
            disabled: examRooms.length === 0,
            children: [
              /* @__PURE__ */ jsx(SelectTrigger, { className: "text-[0.85rem]", children: /* @__PURE__ */ jsx(
                SelectValue,
                {
                  placeholder: examRooms.length === 0 ? "Allocate seating first" : "Choose a room..."
                }
              ) }),
              /* @__PURE__ */ jsx(SelectContent, { children: examRooms.map((room) => /* @__PURE__ */ jsxs(SelectItem, { value: room.id, children: [
                "Room ",
                room.roomNumber,
                " (",
                room.building,
                ")"
              ] }, room.id)) })
            ]
          }
        )
      ] })
    ] }) }) }),
    selectedExamId && selectedRoomId && roomAttendance.length > 0 && /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsxs(CardHeader, { className: "py-3 px-4 border-b border-border", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs(CardTitle, { className: "text-[0.9rem]", children: [
              "Attendance Sheet \u2014 Room",
              " ",
              rooms.find((r) => r.id === selectedRoomId)?.roomNumber
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex gap-3 mt-1 text-[0.75rem] text-muted-foreground", children: [
              selectedExam && /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx("span", { children: selectedExam.subject }),
                /* @__PURE__ */ jsx("span", { children: "\u2022" }),
                /* @__PURE__ */ jsx("span", { children: selectedExam.date }),
                /* @__PURE__ */ jsx("span", { children: "\u2022" }),
                /* @__PURE__ */ jsxs("span", { children: [
                  selectedExam.startTime,
                  " - ",
                  selectedExam.endTime
                ] })
              ] }),
              roomInvigilator && /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx("span", { children: "\u2022" }),
                /* @__PURE__ */ jsxs("span", { children: [
                  "Invigilator: ",
                  roomInvigilator.name
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex gap-2", children: /* @__PURE__ */ jsxs(Button, { size: "sm", variant: "outline", onClick: markAllPresent, children: [
            /* @__PURE__ */ jsx(CheckCircle2, { className: "w-3.5 h-3.5 mr-1" }),
            " Mark All Present"
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-4 mt-3 text-[0.8rem]", children: [
          /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsx("div", { className: "w-2 h-2 rounded-full bg-green-500" }),
            "Present: ",
            presentCount
          ] }),
          /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsx("div", { className: "w-2 h-2 rounded-full bg-red-500" }),
            "Absent: ",
            absentCount
          ] }),
          /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsx("div", { className: "w-2 h-2 rounded-full bg-gray-300" }),
            "Not Marked: ",
            notMarkedCount
          ] }),
          /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsx(Users, { className: "w-3.5 h-3.5" }),
            "Total: ",
            roomAttendance.length
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx(CardContent, { className: "p-0", children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto max-h-[500px] overflow-y-auto", children: /* @__PURE__ */ jsxs(Table, { children: [
        /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableHead, { className: "text-[0.75rem] w-16", children: "#" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-[0.75rem]", children: "Roll Number" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-[0.75rem]", children: "Name" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-[0.75rem]", children: "Branch" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-[0.75rem]", children: "Status" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-[0.75rem]", children: "Signature" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-[0.75rem]", children: "Actions" })
        ] }) }),
        /* @__PURE__ */ jsx(TableBody, { children: roomAttendance.map((record, idx) => {
          const student = students.find(
            (s) => s.id === record.studentId
          );
          if (!student) return null;
          return /* @__PURE__ */ jsxs(TableRow, { children: [
            /* @__PURE__ */ jsx(TableCell, { className: "text-[0.8rem] font-mono", children: idx + 1 }),
            /* @__PURE__ */ jsx(TableCell, { className: "text-[0.8rem] font-mono", children: student.rollNumber }),
            /* @__PURE__ */ jsx(TableCell, { className: "text-[0.8rem]", children: student.name }),
            /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "text-[0.7rem]", children: student.branch }) }),
            /* @__PURE__ */ jsx(TableCell, { children: record.status === "present" ? /* @__PURE__ */ jsxs(Badge, { className: "bg-green-100 text-green-700 text-[0.7rem]", children: [
              /* @__PURE__ */ jsx(CheckCircle2, { className: "w-3 h-3 mr-1" }),
              " Present"
            ] }) : record.status === "absent" ? /* @__PURE__ */ jsxs(Badge, { className: "bg-red-100 text-red-700 text-[0.7rem]", children: [
              /* @__PURE__ */ jsx(XCircle, { className: "w-3 h-3 mr-1" }),
              " Absent"
            ] }) : /* @__PURE__ */ jsxs(Badge, { variant: "secondary", className: "text-[0.7rem]", children: [
              /* @__PURE__ */ jsx(Minus, { className: "w-3 h-3 mr-1" }),
              " Not Marked"
            ] }) }),
            /* @__PURE__ */ jsx(TableCell, { className: "text-[0.8rem]", children: record.signature ? /* @__PURE__ */ jsx("span", { className: "text-green-600 italic text-[0.75rem]", children: "Signed" }) : /* @__PURE__ */ jsx("span", { className: "text-muted-foreground text-[0.75rem]", children: "\u2014" }) }),
            /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs("div", { className: "flex gap-1", children: [
              /* @__PURE__ */ jsx(
                Button,
                {
                  size: "sm",
                  variant: record.status === "present" ? "default" : "outline",
                  className: "h-6 px-2 text-[0.7rem]",
                  onClick: () => markAttendance(record.studentId, "present"),
                  children: "P"
                }
              ),
              /* @__PURE__ */ jsx(
                Button,
                {
                  size: "sm",
                  variant: record.status === "absent" ? "destructive" : "outline",
                  className: "h-6 px-2 text-[0.7rem]",
                  onClick: () => markAttendance(record.studentId, "absent"),
                  children: "A"
                }
              )
            ] }) })
          ] }, record.id || record.studentId);
        }) })
      ] }) }) })
    ] }),
    selectedExamId && examRooms.length === 0 && /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(CardContent, { className: "py-12 text-center text-muted-foreground text-[0.85rem]", children: [
      /* @__PURE__ */ jsx(ClipboardList, { className: "w-10 h-10 mx-auto mb-3 opacity-30" }),
      "No seating allocations found for this exam. Please allocate seating first."
    ] }) })
  ] });
}
export {
  AttendanceManagement
};
