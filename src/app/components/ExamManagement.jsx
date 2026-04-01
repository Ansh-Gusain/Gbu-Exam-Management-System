import { jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useStore } from "../lib/store";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { Plus, Pencil, Trash2, Calendar, Clock } from "lucide-react";
const branches = [
  "BCS",
  "CSE-AI",
  "CSE-ML",
  "CSE-DS",
  "B.Tech ECE",
  "ECE-VLSI",
  "B.Tech IT",
  "IT-Cloud",
  "B.Tech ME",
  "B.Tech CE",
  "B.Tech EE",
  "B.Sc Physics",
  "B.Sc Chemistry",
  "B.Sc Mathematics",
  "BBA",
  "B.Tech Biotech",
  "BA LLB"
];
function ExamManagement() {
  const { exams, setExams } = useStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingExam, setEditingExam] = useState(null);
  const [formData, setFormData] = useState({
    name: "Mid-Semester Examination",
    subject: "",
    date: "",
    startTime: "09:00",
    endTime: "12:00",
    branches: [],
    semester: 3,
    status: "scheduled"
  });
  const openAdd = () => {
    setEditingExam(null);
    setFormData({
      name: "Mid-Semester Examination",
      subject: "",
      date: "",
      startTime: "09:00",
      endTime: "12:00",
      branches: [],
      semester: 3,
      status: "scheduled"
    });
    setDialogOpen(true);
  };
  const openEdit = (exam) => {
    setEditingExam(exam);
    setFormData({
      name: exam.name,
      subject: exam.subject,
      date: exam.date,
      startTime: exam.startTime,
      endTime: exam.endTime,
      branches: [...exam.branches],
      semester: exam.semester,
      status: exam.status
    });
    setDialogOpen(true);
  };
  const handleSave = () => {
    if (!formData.subject || !formData.date || formData.branches.length === 0) return;
    if (editingExam) {
      setExams(
        (prev) => prev.map(
          (e) => e.id === editingExam.id ? { ...e, ...formData } : e
        )
      );
    } else {
      const newExam = {
        id: `e-${Date.now()}`,
        ...formData
      };
      setExams((prev) => [...prev, newExam]);
    }
    setDialogOpen(false);
  };
  const handleDelete = (id) => {
    setExams((prev) => prev.filter((e) => e.id !== id));
  };
  const toggleBranch = (branch) => {
    setFormData((prev) => ({
      ...prev,
      branches: prev.branches.includes(branch) ? prev.branches.filter((b) => b !== branch) : [...prev.branches, branch]
    }));
  };
  const statusColor = (status) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-700";
      case "ongoing":
        return "bg-amber-100 text-amber-700";
      case "completed":
        return "bg-green-100 text-green-700";
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("h1", { children: "Exam Management" }) }),
      /* @__PURE__ */ jsxs(Button, { size: "sm", onClick: openAdd, children: [
        /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4 mr-1" }),
        " Schedule Exam"
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-2 lg:grid-cols-3 gap-4", children: exams.sort((a, b) => a.date.localeCompare(b.date)).map((exam) => /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(CardContent, { className: "p-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between mb-2", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "text-[0.9rem]", children: exam.subject }),
          /* @__PURE__ */ jsx("p", { className: "text-[0.75rem] text-muted-foreground", children: exam.name })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-1", children: [
          /* @__PURE__ */ jsx("button", { onClick: () => openEdit(exam), className: "p-1 rounded hover:bg-accent", children: /* @__PURE__ */ jsx(Pencil, { className: "w-3.5 h-3.5 text-muted-foreground" }) }),
          /* @__PURE__ */ jsx("button", { onClick: () => handleDelete(exam.id), className: "p-1 rounded hover:bg-accent", children: /* @__PURE__ */ jsx(Trash2, { className: "w-3.5 h-3.5 text-destructive" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2 text-[0.8rem]", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Calendar, { className: "w-3.5 h-3.5 text-muted-foreground" }),
          /* @__PURE__ */ jsx("span", { children: new Date(exam.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Clock, { className: "w-3.5 h-3.5 text-muted-foreground" }),
          /* @__PURE__ */ jsxs("span", { children: [
            exam.startTime,
            " - ",
            exam.endTime
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Semester:" }),
          /* @__PURE__ */ jsx("span", { children: exam.semester })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-1 mt-3 pt-3 border-t border-border", children: [
        exam.branches.map((b) => /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "text-[0.65rem]", children: b }, b)),
        /* @__PURE__ */ jsx("div", { className: "flex-1" }),
        /* @__PURE__ */ jsx(Badge, { className: `text-[0.65rem] ${statusColor(exam.status)}`, children: exam.status })
      ] })
    ] }) }, exam.id)) }),
    /* @__PURE__ */ jsx(Dialog, { open: dialogOpen, onOpenChange: setDialogOpen, children: /* @__PURE__ */ jsxs(DialogContent, { className: "max-w-md", children: [
      /* @__PURE__ */ jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsx(DialogTitle, { children: editingExam ? "Edit Exam" : "Schedule New Exam" }),
        /* @__PURE__ */ jsx(DialogDescription, { children: editingExam ? "Make changes to the exam details." : "Enter the exam details." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Label, { className: "text-[0.8rem]", children: "Exam Name" }),
          /* @__PURE__ */ jsxs(Select, { value: formData.name, onValueChange: (v) => setFormData({ ...formData, name: v }), children: [
            /* @__PURE__ */ jsx(SelectTrigger, { className: "text-[0.85rem]", children: /* @__PURE__ */ jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsx(SelectItem, { value: "Mid-Semester Examination", children: "Mid-Semester Examination" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "End-Semester Examination", children: "End-Semester Examination" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "Supplementary Examination", children: "Supplementary Examination" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "Re-examination", children: "Re-examination" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Label, { className: "text-[0.8rem]", children: "Subject" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              value: formData.subject,
              onChange: (e) => setFormData({ ...formData, subject: e.target.value }),
              placeholder: "e.g., Data Structures",
              className: "text-[0.85rem]"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "col-span-1", children: [
            /* @__PURE__ */ jsx(Label, { className: "text-[0.8rem]", children: "Date" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                type: "date",
                value: formData.date,
                onChange: (e) => setFormData({ ...formData, date: e.target.value }),
                className: "text-[0.85rem]"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { className: "text-[0.8rem]", children: "Start" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                type: "time",
                value: formData.startTime,
                onChange: (e) => setFormData({ ...formData, startTime: e.target.value }),
                className: "text-[0.85rem]"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { className: "text-[0.8rem]", children: "End" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                type: "time",
                value: formData.endTime,
                onChange: (e) => setFormData({ ...formData, endTime: e.target.value }),
                className: "text-[0.85rem]"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Label, { className: "text-[0.8rem]", children: "Semester" }),
          /* @__PURE__ */ jsxs(Select, { value: String(formData.semester), onValueChange: (v) => setFormData({ ...formData, semester: Number(v) }), children: [
            /* @__PURE__ */ jsx(SelectTrigger, { className: "text-[0.85rem]", children: /* @__PURE__ */ jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsx(SelectContent, { children: [1, 2, 3, 4, 5, 6, 7, 8].map((s) => /* @__PURE__ */ jsxs(SelectItem, { value: String(s), children: [
              "Semester ",
              s
            ] }, s)) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Label, { className: "text-[0.8rem] mb-2 block", children: "Branches" }),
          /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-3", children: branches.map((branch) => /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2 text-[0.8rem] cursor-pointer", children: [
            /* @__PURE__ */ jsx(
              Checkbox,
              {
                checked: formData.branches.includes(branch),
                onCheckedChange: () => toggleBranch(branch)
              }
            ),
            branch
          ] }, branch)) })
        ] }),
        editingExam && /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Label, { className: "text-[0.8rem]", children: "Status" }),
          /* @__PURE__ */ jsxs(Select, { value: formData.status, onValueChange: (v) => setFormData({ ...formData, status: v }), children: [
            /* @__PURE__ */ jsx(SelectTrigger, { className: "text-[0.85rem]", children: /* @__PURE__ */ jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsx(SelectItem, { value: "scheduled", children: "Scheduled" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "ongoing", children: "Ongoing" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "completed", children: "Completed" })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => setDialogOpen(false), children: "Cancel" }),
        /* @__PURE__ */ jsx(Button, { onClick: handleSave, children: editingExam ? "Update" : "Schedule" })
      ] })
    ] }) })
  ] });
}
export {
  ExamManagement
};
