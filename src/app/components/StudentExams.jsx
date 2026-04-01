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
import { FileText, Clock, CheckCircle2, Play } from "lucide-react";
function StudentExams() {
  const { loggedInStudentId, students, exams } = useStore();
  const currentStudent = students.find((s) => s.id === loggedInStudentId);
  const myExams = useMemo(() => {
    if (!currentStudent) return [];
    return exams.filter(
      (e) => e.branches.includes(currentStudent.branch) && e.semester === currentStudent.semester
    ).sort((a, b) => a.date.localeCompare(b.date));
  }, [exams, currentStudent]);
  const scheduled = myExams.filter((e) => e.status === "scheduled");
  const completed = myExams.filter((e) => e.status === "completed");
  const ongoing = myExams.filter((e) => e.status === "ongoing");
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h1", { children: "Exam Schedule" }),
      /* @__PURE__ */ jsxs("p", { className: "text-muted-foreground text-[0.85rem] mt-1", children: [
        "View your exam schedule for ",
        currentStudent?.branch,
        " \u2014 Semester ",
        currentStudent?.semester
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
      /* @__PURE__ */ jsx(Card, { className: "py-3", children: /* @__PURE__ */ jsxs(CardContent, { className: "px-4 py-0", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
          /* @__PURE__ */ jsx(Clock, { className: "w-4 h-4 text-amber-600" }),
          /* @__PURE__ */ jsx("p", { className: "text-[0.75rem] text-muted-foreground", children: "Scheduled" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-[1.25rem] font-semibold", children: scheduled.length })
      ] }) }),
      /* @__PURE__ */ jsx(Card, { className: "py-3", children: /* @__PURE__ */ jsxs(CardContent, { className: "px-4 py-0", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
          /* @__PURE__ */ jsx(Play, { className: "w-4 h-4 text-blue-600" }),
          /* @__PURE__ */ jsx("p", { className: "text-[0.75rem] text-muted-foreground", children: "Ongoing" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-[1.25rem] font-semibold", children: ongoing.length })
      ] }) }),
      /* @__PURE__ */ jsx(Card, { className: "py-3", children: /* @__PURE__ */ jsxs(CardContent, { className: "px-4 py-0", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
          /* @__PURE__ */ jsx(CheckCircle2, { className: "w-4 h-4 text-green-600" }),
          /* @__PURE__ */ jsx("p", { className: "text-[0.75rem] text-muted-foreground", children: "Completed" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-[1.25rem] font-semibold", children: completed.length })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsx(CardTitle, { className: "text-[0.9rem]", children: "All Exams" }) }),
      /* @__PURE__ */ jsx(CardContent, { children: myExams.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "text-center py-12", children: [
        /* @__PURE__ */ jsx(FileText, { className: "w-12 h-12 text-muted-foreground/30 mx-auto mb-3" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "No exams found for your branch and semester" })
      ] }) : /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs(Table, { children: [
        /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableHead, { className: "text-[0.75rem]", children: "Exam" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-[0.75rem]", children: "Subject" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-[0.75rem]", children: "Date" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-[0.75rem]", children: "Time" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-[0.75rem]", children: "Branches" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-[0.75rem]", children: "Status" })
        ] }) }),
        /* @__PURE__ */ jsx(TableBody, { children: myExams.map((exam) => /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableCell, { className: "text-[0.8rem]", children: exam.name }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-[0.8rem] font-medium", children: exam.subject }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-[0.8rem]", children: new Date(exam.date).toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            year: "numeric"
          }) }),
          /* @__PURE__ */ jsxs(TableCell, { className: "text-[0.8rem]", children: [
            exam.startTime,
            " - ",
            exam.endTime
          ] }),
          /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx("div", { className: "flex gap-1 flex-wrap", children: exam.branches.map((b) => /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-[0.6rem]", children: b }, b)) }) }),
          /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(
            Badge,
            {
              variant: exam.status === "completed" ? "default" : exam.status === "ongoing" ? "secondary" : "outline",
              className: "text-[0.65rem]",
              children: exam.status
            }
          ) })
        ] }, exam.id)) })
      ] }) }) })
    ] })
  ] });
}
export {
  StudentExams
};
