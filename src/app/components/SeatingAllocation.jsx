import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useMemo } from "react";
import { useStore } from "../lib/store";
import { allocateSeating } from "../lib/algorithms";
import { Card, CardContent, CardHeader } from "./ui/card";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Grid3X3,
  Play,
  AlertCircle,
  CheckCircle2,
  Users,
  DoorOpen
} from "lucide-react";
import { toast } from "sonner";
function SeatingAllocation() {
  const {
    students,
    rooms,
    exams,
    seatingAllocations,
    setSeatingAllocations
  } = useStore();
  const [selectedExamId, setSelectedExamId] = useState("");
  const [selectedRoomId, setSelectedRoomId] = useState("all");
  const [allocating, setAllocating] = useState(false);
  const scheduledExams = exams.filter((e) => e.status === "scheduled" || e.status === "ongoing");
  const selectedExam = exams.find((e) => e.id === selectedExamId);
  const examAllocations = useMemo(
    () => seatingAllocations.filter((sa) => sa.examId === selectedExamId),
    [seatingAllocations, selectedExamId]
  );
  const roomAllocations = useMemo(() => {
    if (selectedRoomId === "all") return examAllocations;
    return examAllocations.filter((sa) => sa.roomId === selectedRoomId);
  }, [examAllocations, selectedRoomId]);
  const allocatedRooms = useMemo(() => {
    const roomIds = [...new Set(examAllocations.map((sa) => sa.roomId))];
    return roomIds.map((rid) => {
      const room = rooms.find((r) => r.id === rid);
      const count = examAllocations.filter((sa) => sa.roomId === rid).length;
      return { room, studentCount: count };
    });
  }, [examAllocations, rooms]);
  const handleAllocate = () => {
    if (!selectedExam) return;
    setAllocating(true);
    setTimeout(() => {
      const result = allocateSeating(students, rooms, selectedExam);
      if (result.error) {
        toast.error(result.error);
      } else {
        setSeatingAllocations((prev) => [
          ...prev.filter((sa) => sa.examId !== selectedExamId),
          ...result.allocations
        ]);
        toast.success(`Successfully allocated ${result.allocations.length} students across ${new Set(result.allocations.map((a) => a.roomId)).size} rooms.`);
      }
      setAllocating(false);
    }, 500);
  };
  const handleClear = () => {
    setSeatingAllocations((prev) => prev.filter((sa) => sa.examId !== selectedExamId));
    toast.success("Seating allocations cleared.");
  };
  const eligibleCount = selectedExam ? students.filter(
    (s) => selectedExam.branches.includes(s.branch) && s.semester === selectedExam.semester
  ).length : 0;
  return /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("h1", { children: "Seating Allocation" }) }),
    /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(CardContent, { className: "py-4 px-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-3 items-end", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsx("label", { className: "text-[0.8rem] text-muted-foreground mb-1 block", children: "Select Exam" }),
          /* @__PURE__ */ jsxs(Select, { value: selectedExamId, onValueChange: setSelectedExamId, children: [
            /* @__PURE__ */ jsx(SelectTrigger, { className: "text-[0.85rem]", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Choose an exam..." }) }),
            /* @__PURE__ */ jsx(SelectContent, { children: scheduledExams.map((exam) => /* @__PURE__ */ jsxs(SelectItem, { value: exam.id, children: [
              exam.subject,
              " \u2014 ",
              exam.name,
              " (",
              exam.date,
              ")"
            ] }, exam.id)) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxs(
            Button,
            {
              size: "sm",
              onClick: handleAllocate,
              disabled: !selectedExamId || allocating,
              children: [
                /* @__PURE__ */ jsx(Play, { className: "w-4 h-4 mr-1" }),
                allocating ? "Allocating..." : "Auto Allocate"
              ]
            }
          ),
          examAllocations.length > 0 && /* @__PURE__ */ jsx(Button, { size: "sm", variant: "outline", onClick: handleClear, children: "Clear" })
        ] })
      ] }),
      selectedExam && /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-4 mt-3 pt-3 border-t border-border text-[0.8rem]", children: [
        /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsx(Users, { className: "w-3.5 h-3.5 text-muted-foreground" }),
          "Eligible: ",
          /* @__PURE__ */ jsx("strong", { children: eligibleCount })
        ] }),
        /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsx(Grid3X3, { className: "w-3.5 h-3.5 text-muted-foreground" }),
          "Allocated: ",
          /* @__PURE__ */ jsx("strong", { children: examAllocations.length })
        ] }),
        /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsx(DoorOpen, { className: "w-3.5 h-3.5 text-muted-foreground" }),
          "Rooms Used: ",
          /* @__PURE__ */ jsx("strong", { children: allocatedRooms.length })
        ] }),
        /* @__PURE__ */ jsx("span", { children: examAllocations.length > 0 ? /* @__PURE__ */ jsxs(Badge, { className: "bg-green-100 text-green-700 text-[0.7rem]", children: [
          /* @__PURE__ */ jsx(CheckCircle2, { className: "w-3 h-3 mr-1" }),
          " Allocated"
        ] }) : /* @__PURE__ */ jsxs(Badge, { variant: "secondary", className: "text-[0.7rem]", children: [
          /* @__PURE__ */ jsx(AlertCircle, { className: "w-3 h-3 mr-1" }),
          " Not Allocated"
        ] }) })
      ] })
    ] }) }),
    examAllocations.length > 0 && /* @__PURE__ */ jsxs(Tabs, { defaultValue: "rooms", children: [
      /* @__PURE__ */ jsxs(TabsList, { children: [
        /* @__PURE__ */ jsx(TabsTrigger, { value: "rooms", className: "text-[0.8rem]", children: "Room Summary" }),
        /* @__PURE__ */ jsx(TabsTrigger, { value: "students", className: "text-[0.8rem]", children: "Student List" })
      ] }),
      /* @__PURE__ */ jsx(TabsContent, { value: "rooms", children: /* @__PURE__ */ jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-3", children: allocatedRooms.map(({ room, studentCount }) => /* @__PURE__ */ jsx(
        Card,
        {
          className: "cursor-pointer hover:border-primary/50 transition-colors",
          onClick: () => setSelectedRoomId(room.id),
          children: /* @__PURE__ */ jsxs(CardContent, { className: "p-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
              /* @__PURE__ */ jsxs("h3", { className: "text-[0.9rem]", children: [
                "Room ",
                room.roomNumber
              ] }),
              /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "text-[0.7rem]", children: room.building })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-[0.8rem]", children: [
              /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Students" }),
              /* @__PURE__ */ jsxs("span", { children: [
                studentCount,
                " / ",
                room.capacity
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "mt-2 w-full bg-accent rounded-full h-2", children: /* @__PURE__ */ jsx(
              "div",
              {
                className: "bg-primary rounded-full h-2 transition-all",
                style: { width: `${Math.min(studentCount / room.capacity * 100, 100)}%` }
              }
            ) }),
            /* @__PURE__ */ jsxs("p", { className: "text-[0.7rem] text-muted-foreground mt-1 text-right", children: [
              Math.round(studentCount / room.capacity * 100),
              "% utilized"
            ] })
          ] })
        },
        room.id
      )) }) }),
      /* @__PURE__ */ jsx(TabsContent, { value: "students", children: /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsx(CardHeader, { className: "py-3 px-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx("label", { className: "text-[0.8rem] text-muted-foreground", children: "Filter by Room:" }),
          /* @__PURE__ */ jsxs(Select, { value: selectedRoomId, onValueChange: setSelectedRoomId, children: [
            /* @__PURE__ */ jsx(SelectTrigger, { className: "w-[200px] h-8 text-[0.8rem]", children: /* @__PURE__ */ jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsx(SelectItem, { value: "all", children: "All Rooms" }),
              allocatedRooms.map(({ room }) => /* @__PURE__ */ jsxs(SelectItem, { value: room.id, children: [
                "Room ",
                room.roomNumber,
                " (",
                room.building,
                ")"
              ] }, room.id))
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsx(CardContent, { className: "p-0", children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto max-h-[500px] overflow-y-auto", children: /* @__PURE__ */ jsxs(Table, { children: [
          /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
            /* @__PURE__ */ jsx(TableHead, { className: "text-[0.75rem]", children: "Seat #" }),
            /* @__PURE__ */ jsx(TableHead, { className: "text-[0.75rem]", children: "Roll Number" }),
            /* @__PURE__ */ jsx(TableHead, { className: "text-[0.75rem]", children: "Name" }),
            /* @__PURE__ */ jsx(TableHead, { className: "text-[0.75rem]", children: "Branch" }),
            /* @__PURE__ */ jsx(TableHead, { className: "text-[0.75rem]", children: "Room" })
          ] }) }),
          /* @__PURE__ */ jsx(TableBody, { children: roomAllocations.map((sa) => {
            const student = students.find((s) => s.id === sa.studentId);
            const room = rooms.find((r) => r.id === sa.roomId);
            if (!student || !room) return null;
            return /* @__PURE__ */ jsxs(TableRow, { children: [
              /* @__PURE__ */ jsx(TableCell, { className: "text-[0.8rem] font-mono", children: sa.seatNumber }),
              /* @__PURE__ */ jsx(TableCell, { className: "text-[0.8rem] font-mono", children: student.rollNumber }),
              /* @__PURE__ */ jsx(TableCell, { className: "text-[0.8rem]", children: student.name }),
              /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "text-[0.7rem]", children: student.branch }) }),
              /* @__PURE__ */ jsx(TableCell, { className: "text-[0.8rem]", children: room.roomNumber })
            ] }, sa.id);
          }) })
        ] }) }) })
      ] }) })
    ] })
  ] });
}
export {
  SeatingAllocation
};
