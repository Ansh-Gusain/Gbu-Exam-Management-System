import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useMemo } from "react";
import { useStore } from "../lib/store";
import { allocateInvigilators } from "../lib/algorithms";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  UserCheck,
  Play,
  AlertCircle,
  CheckCircle2,
  BarChart3
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { toast } from "sonner";
function InvigilatorAllocation() {
  const {
    rooms,
    exams,
    faculty,
    invigilationAllocations,
    setInvigilationAllocations,
    setFaculty
  } = useStore();
  const [selectedExamId, setSelectedExamId] = useState("");
  const [allocating, setAllocating] = useState(false);
  const scheduledExams = exams.filter((e) => e.status === "scheduled" || e.status === "ongoing");
  const selectedExam = exams.find((e) => e.id === selectedExamId);
  const examAllocations = useMemo(
    () => invigilationAllocations.filter((ia) => ia.examId === selectedExamId),
    [invigilationAllocations, selectedExamId]
  );
  const dutyDistribution = useMemo(() => {
    const counts = {};
    for (const ia of invigilationAllocations) {
      counts[ia.facultyId] = (counts[ia.facultyId] || 0) + 1;
    }
    return faculty.filter((f) => f.isAvailable).map((f) => ({
      name: f.name.split(" ").slice(-1)[0],
      duties: f.totalDuties + (counts[f.id] || 0)
    })).sort((a, b) => b.duties - a.duties).slice(0, 15);
  }, [faculty, invigilationAllocations]);
  const handleAllocate = () => {
    if (!selectedExam) return;
    setAllocating(true);
    setTimeout(() => {
      const result = allocateInvigilators(
        faculty,
        rooms,
        selectedExam,
        invigilationAllocations
      );
      if (result.error) {
        toast.error(result.error);
      } else {
        setInvigilationAllocations((prev) => [
          ...prev.filter((ia) => ia.examId !== selectedExamId),
          ...result.allocations
        ]);
        setFaculty(
          (prev) => prev.map((f) => {
            const newDuties = result.allocations.filter(
              (a) => a.facultyId === f.id
            ).length;
            return newDuties > 0 ? { ...f, totalDuties: f.totalDuties + newDuties } : f;
          })
        );
        toast.success(
          `Assigned ${result.allocations.length} invigilators to rooms.`
        );
      }
      setAllocating(false);
    }, 500);
  };
  const handleClear = () => {
    setInvigilationAllocations(
      (prev) => prev.filter((ia) => ia.examId !== selectedExamId)
    );
    toast.success("Invigilation allocations cleared.");
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("h1", { children: "Invigilator Allocation" }) }),
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
                allocating ? "Allocating..." : "Auto Assign"
              ]
            }
          ),
          examAllocations.length > 0 && /* @__PURE__ */ jsx(Button, { size: "sm", variant: "outline", onClick: handleClear, children: "Clear" })
        ] })
      ] }),
      selectedExam && /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-4 mt-3 pt-3 border-t border-border text-[0.8rem]", children: [
        /* @__PURE__ */ jsxs("span", { children: [
          "Available Faculty: ",
          /* @__PURE__ */ jsx("strong", { children: faculty.filter((f) => f.isAvailable).length })
        ] }),
        /* @__PURE__ */ jsxs("span", { children: [
          "Assigned: ",
          /* @__PURE__ */ jsx("strong", { children: examAllocations.length })
        ] }),
        /* @__PURE__ */ jsx("span", { children: examAllocations.length > 0 ? /* @__PURE__ */ jsxs(Badge, { className: "bg-green-100 text-green-700 text-[0.7rem]", children: [
          /* @__PURE__ */ jsx(CheckCircle2, { className: "w-3 h-3 mr-1" }),
          " Assigned"
        ] }) : /* @__PURE__ */ jsxs(Badge, { variant: "secondary", className: "text-[0.7rem]", children: [
          /* @__PURE__ */ jsx(AlertCircle, { className: "w-3 h-3 mr-1" }),
          " Not Assigned"
        ] }) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs(Tabs, { defaultValue: "allocations", children: [
      /* @__PURE__ */ jsxs(TabsList, { children: [
        /* @__PURE__ */ jsx(TabsTrigger, { value: "allocations", className: "text-[0.8rem]", children: "Duty Chart" }),
        /* @__PURE__ */ jsx(TabsTrigger, { value: "distribution", className: "text-[0.8rem]", children: "Workload Distribution" }),
        /* @__PURE__ */ jsx(TabsTrigger, { value: "faculty", className: "text-[0.8rem]", children: "Faculty Overview" })
      ] }),
      /* @__PURE__ */ jsx(TabsContent, { value: "allocations", children: examAllocations.length > 0 ? /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, { className: "p-0", children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs(Table, { children: [
        /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableHead, { className: "text-[0.75rem]", children: "Room" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-[0.75rem]", children: "Building" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-[0.75rem]", children: "Invigilator" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-[0.75rem]", children: "Department" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-[0.75rem]", children: "Role" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-[0.75rem]", children: "Total Duties" })
        ] }) }),
        /* @__PURE__ */ jsx(TableBody, { children: examAllocations.map((ia) => {
          const room = rooms.find((r) => r.id === ia.roomId);
          const fac = faculty.find((f) => f.id === ia.facultyId);
          if (!room || !fac) return null;
          return /* @__PURE__ */ jsxs(TableRow, { children: [
            /* @__PURE__ */ jsxs(TableCell, { className: "text-[0.8rem]", children: [
              "Room ",
              room.roomNumber
            ] }),
            /* @__PURE__ */ jsx(TableCell, { className: "text-[0.8rem]", children: room.building }),
            /* @__PURE__ */ jsx(TableCell, { className: "text-[0.8rem]", children: fac.name }),
            /* @__PURE__ */ jsx(TableCell, { className: "text-[0.8rem]", children: fac.department }),
            /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(
              Badge,
              {
                variant: ia.role === "chief" ? "default" : "secondary",
                className: "text-[0.7rem]",
                children: ia.role
              }
            ) }),
            /* @__PURE__ */ jsx(TableCell, { className: "text-[0.8rem] font-mono", children: fac.totalDuties })
          ] }, ia.id);
        }) })
      ] }) }) }) }) : /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(CardContent, { className: "py-12 text-center text-muted-foreground text-[0.85rem]", children: [
        /* @__PURE__ */ jsx(UserCheck, { className: "w-10 h-10 mx-auto mb-3 opacity-30" }),
        'Select an exam and click "Auto Assign" to allocate invigilators.'
      ] }) }) }),
      /* @__PURE__ */ jsx(TabsContent, { value: "distribution", children: /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxs(CardTitle, { className: "text-[0.9rem] flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(BarChart3, { className: "w-4 h-4" }),
          " Faculty Duty Distribution"
        ] }) }),
        /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: 300, children: /* @__PURE__ */ jsxs(BarChart, { data: dutyDistribution, layout: "vertical", children: [
          /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "var(--border)" }),
          /* @__PURE__ */ jsx(XAxis, { type: "number", tick: { fontSize: 12 } }),
          /* @__PURE__ */ jsx(
            YAxis,
            {
              type: "category",
              dataKey: "name",
              tick: { fontSize: 11 },
              width: 100
            }
          ),
          /* @__PURE__ */ jsx(Tooltip, {}),
          /* @__PURE__ */ jsx(Bar, { dataKey: "duties", fill: "#6366f1", radius: [0, 4, 4, 0] })
        ] }) }) })
      ] }) }),
      /* @__PURE__ */ jsx(TabsContent, { value: "faculty", children: /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, { className: "p-0", children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs(Table, { children: [
        /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableHead, { className: "text-[0.75rem]", children: "Employee ID" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-[0.75rem]", children: "Name" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-[0.75rem]", children: "Department" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-[0.75rem]", children: "Designation" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-[0.75rem]", children: "Total Duties" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-[0.75rem]", children: "Status" })
        ] }) }),
        /* @__PURE__ */ jsx(TableBody, { children: faculty.sort((a, b) => a.totalDuties - b.totalDuties).map((f) => /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableCell, { className: "text-[0.8rem] font-mono", children: f.employeeId }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-[0.8rem]", children: f.name }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-[0.8rem]", children: f.department }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-[0.8rem]", children: f.designation }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-[0.8rem] font-mono", children: f.totalDuties }),
          /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(
            Badge,
            {
              variant: f.isAvailable ? "default" : "secondary",
              className: `text-[0.7rem] ${f.isAvailable ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`,
              children: f.isAvailable ? "Available" : "Unavailable"
            }
          ) })
        ] }, f.id)) })
      ] }) }) }) }) })
    ] })
  ] });
}
export {
  InvigilatorAllocation
};
