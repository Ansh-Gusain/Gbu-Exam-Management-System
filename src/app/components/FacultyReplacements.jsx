import { jsx, jsxs } from "react/jsx-runtime";
import { useMemo, useState } from "react";
import { useStore } from "../lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "./ui/table";
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
import { Input } from "./ui/input";
import {
  RefreshCw,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";
function FacultyReplacements() {
  const {
    loggedInFacultyId,
    faculty,
    exams,
    rooms,
    invigilationAllocations,
    replacementLogs,
    setReplacementLogs
  } = useStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDutyId, setSelectedDutyId] = useState("");
  const [reason, setReason] = useState("");
  const currentFaculty = faculty.find((f) => f.id === loggedInFacultyId);
  const myDuties = useMemo(() => {
    return invigilationAllocations.filter((ia) => ia.facultyId === loggedInFacultyId).map((duty) => {
      const exam = exams.find((e) => e.id === duty.examId);
      const room = rooms.find((r) => r.id === duty.roomId);
      return { ...duty, exam, room };
    }).filter((d) => d.exam && d.exam.status === "scheduled");
  }, [invigilationAllocations, loggedInFacultyId, exams, rooms]);
  const myReplacements = useMemo(() => {
    return replacementLogs.filter((r) => r.originalFacultyId === loggedInFacultyId).map((rep) => {
      const exam = exams.find((e) => e.id === rep.examId);
      const room = rooms.find((r) => r.id === rep.roomId);
      const replacement = faculty.find((f) => f.id === rep.replacementFacultyId);
      return { ...rep, exam, room, replacement };
    }).sort((a, b) => b.requestedAt.localeCompare(a.requestedAt));
  }, [replacementLogs, loggedInFacultyId, exams, rooms, faculty]);
  const handleRequestReplacement = () => {
    if (!selectedDutyId || !reason.trim()) {
      toast.error("Please select a duty and provide a reason");
      return;
    }
    const duty = myDuties.find((d) => d.id === selectedDutyId);
    if (!duty) return;
    const newRequest = {
      id: `rep-${Date.now()}`,
      examId: duty.examId,
      roomId: duty.roomId,
      originalFacultyId: loggedInFacultyId || "",
      replacementFacultyId: "",
      reason: reason.trim(),
      status: "pending",
      requestedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    setReplacementLogs((prev) => [...prev, newRequest]);
    setDialogOpen(false);
    setSelectedDutyId("");
    setReason("");
    toast.success("Replacement request submitted successfully");
  };
  const pendingCount = myReplacements.filter((r) => r.status === "pending").length;
  const approvedCount = myReplacements.filter((r) => r.status === "approved").length;
  const rejectedCount = myReplacements.filter((r) => r.status === "rejected").length;
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { children: "Replacement Requests" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-[0.85rem] mt-1", children: "Request duty replacements for your assigned invigilation" })
      ] }),
      /* @__PURE__ */ jsxs(
        Button,
        {
          size: "sm",
          onClick: () => setDialogOpen(true),
          disabled: myDuties.length === 0,
          children: [
            /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4 mr-1" }),
            " Request Replacement"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
      /* @__PURE__ */ jsx(Card, { className: "py-3", children: /* @__PURE__ */ jsxs(CardContent, { className: "px-4 py-0", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
          /* @__PURE__ */ jsx(Clock, { className: "w-4 h-4 text-amber-600" }),
          /* @__PURE__ */ jsx("p", { className: "text-[0.75rem] text-muted-foreground", children: "Pending" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-[1.25rem] font-semibold", children: pendingCount })
      ] }) }),
      /* @__PURE__ */ jsx(Card, { className: "py-3", children: /* @__PURE__ */ jsxs(CardContent, { className: "px-4 py-0", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
          /* @__PURE__ */ jsx(CheckCircle2, { className: "w-4 h-4 text-green-600" }),
          /* @__PURE__ */ jsx("p", { className: "text-[0.75rem] text-muted-foreground", children: "Approved" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-[1.25rem] font-semibold", children: approvedCount })
      ] }) }),
      /* @__PURE__ */ jsx(Card, { className: "py-3", children: /* @__PURE__ */ jsxs(CardContent, { className: "px-4 py-0", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
          /* @__PURE__ */ jsx(AlertCircle, { className: "w-4 h-4 text-red-600" }),
          /* @__PURE__ */ jsx("p", { className: "text-[0.75rem] text-muted-foreground", children: "Rejected" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-[1.25rem] font-semibold", children: rejectedCount })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsx(CardTitle, { className: "text-[0.9rem]", children: "My Replacement History" }) }),
      /* @__PURE__ */ jsx(CardContent, { children: myReplacements.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "text-center py-12", children: [
        /* @__PURE__ */ jsx(RefreshCw, { className: "w-12 h-12 text-muted-foreground/30 mx-auto mb-3" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "No replacement requests yet" }),
        /* @__PURE__ */ jsx("p", { className: "text-[0.75rem] text-muted-foreground/70 mt-1", children: myDuties.length > 0 ? "Click 'Request Replacement' to submit a new request" : "You need assigned duties before requesting replacements" })
      ] }) : /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs(Table, { children: [
        /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableHead, { className: "text-[0.75rem]", children: "Exam" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-[0.75rem]", children: "Room" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-[0.75rem]", children: "Reason" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-[0.75rem]", children: "Replacement" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-[0.75rem]", children: "Status" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-[0.75rem]", children: "Requested" })
        ] }) }),
        /* @__PURE__ */ jsx(TableBody, { children: myReplacements.map((rep) => /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsxs(TableCell, { className: "text-[0.8rem]", children: [
            /* @__PURE__ */ jsx("div", { className: "font-medium", children: rep.exam?.subject || "\u2014" }),
            /* @__PURE__ */ jsx("div", { className: "text-[0.7rem] text-muted-foreground", children: rep.exam ? new Date(rep.exam.date).toLocaleDateString() : "\u2014" })
          ] }),
          /* @__PURE__ */ jsxs(TableCell, { className: "text-[0.8rem]", children: [
            "Room ",
            rep.room?.roomNumber || "\u2014"
          ] }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-[0.8rem] max-w-[200px] truncate", children: rep.reason }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-[0.8rem]", children: rep.replacement ? rep.replacement.name : /* @__PURE__ */ jsx("span", { className: "text-muted-foreground italic", children: "Not assigned" }) }),
          /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs(
            Badge,
            {
              variant: rep.status === "approved" ? "default" : rep.status === "pending" ? "secondary" : "destructive",
              className: "text-[0.65rem]",
              children: [
                rep.status === "approved" && /* @__PURE__ */ jsx(CheckCircle2, { className: "w-3 h-3 mr-1" }),
                rep.status === "pending" && /* @__PURE__ */ jsx(Clock, { className: "w-3 h-3 mr-1" }),
                rep.status === "rejected" && /* @__PURE__ */ jsx(AlertCircle, { className: "w-3 h-3 mr-1" }),
                rep.status
              ]
            }
          ) }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-[0.75rem] text-muted-foreground", children: new Date(rep.requestedAt).toLocaleDateString() })
        ] }, rep.id)) })
      ] }) }) })
    ] }),
    /* @__PURE__ */ jsx(Dialog, { open: dialogOpen, onOpenChange: setDialogOpen, children: /* @__PURE__ */ jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsx(DialogTitle, { children: "Request Replacement" }),
        /* @__PURE__ */ jsx(DialogDescription, { children: "Submit a replacement request for one of your upcoming duties" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4 py-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { children: "Select Duty" }),
          /* @__PURE__ */ jsxs(Select, { value: selectedDutyId, onValueChange: setSelectedDutyId, children: [
            /* @__PURE__ */ jsx(SelectTrigger, { className: "text-[0.85rem]", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select a duty to be replaced..." }) }),
            /* @__PURE__ */ jsx(SelectContent, { children: myDuties.map((duty) => /* @__PURE__ */ jsxs(SelectItem, { value: duty.id, children: [
              duty.exam?.subject,
              " \u2014 Room ",
              duty.room?.roomNumber,
              " (",
              duty.exam?.date,
              ")"
            ] }, duty.id)) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { children: "Reason for Replacement" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              placeholder: "e.g., Medical leave, Family emergency...",
              value: reason,
              onChange: (e) => setReason(e.target.value),
              className: "text-[0.85rem]"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => setDialogOpen(false), children: "Cancel" }),
        /* @__PURE__ */ jsx(Button, { onClick: handleRequestReplacement, children: "Submit Request" })
      ] })
    ] }) })
  ] });
}
export {
  FacultyReplacements
};
