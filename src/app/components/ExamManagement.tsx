import { useState } from "react";
import { useStore } from "../lib/store";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "./ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "./ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { Plus, Pencil, Trash2, Calendar, Clock } from "lucide-react";

const branches = [
  "BCS", "CSE-AI", "CSE-ML", "CSE-DS",
  "B.Tech ECE", "ECE-VLSI",
  "B.Tech IT", "IT-Cloud",
  "B.Tech ME", "B.Tech CE", "B.Tech EE",
  "B.Sc Physics", "B.Sc Chemistry", "B.Sc Mathematics",
  "BBA", "B.Tech Biotech", "BA LLB",
];

export function ExamManagement() {
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
    status: "scheduled",
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
      status: "scheduled",
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
      status: exam.status,
    });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.subject || !formData.date || formData.branches.length === 0) return;
    if (editingExam) {
      setExams((prev) =>
        prev.map((e) =>
          e.id === editingExam.id ? { ...e, ...formData } : e
        )
      );
    } else {
      const newExam = {
        id: `e-${Date.now()}`,
        ...formData,
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
      branches: prev.branches.includes(branch)
        ? prev.branches.filter((b) => b !== branch)
        : [...prev.branches, branch],
    }));
  };

  const statusColor = (status) => {
    switch (status) {
      case "scheduled": return "bg-blue-100 text-blue-700";
      case "ongoing": return "bg-amber-100 text-amber-700";
      case "completed": return "bg-green-100 text-green-700";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1>Exam Management</h1>
        </div>
        <Button size="sm" onClick={openAdd}>
          <Plus className="w-4 h-4 mr-1" /> Schedule Exam
        </Button>
      </div>

      {/* Exam Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {exams
          .sort((a, b) => a.date.localeCompare(b.date))
          .map((exam) => (
          <Card key={exam.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-[0.9rem]">{exam.subject}</h3>
                  <p className="text-[0.75rem] text-muted-foreground">{exam.name}</p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(exam)} className="p-1 rounded hover:bg-accent">
                    <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                  <button onClick={() => handleDelete(exam.id)} className="p-1 rounded hover:bg-accent">
                    <Trash2 className="w-3.5 h-3.5 text-destructive" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-[0.8rem]">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>{new Date(exam.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>{exam.startTime} - {exam.endTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Semester:</span>
                  <span>{exam.semester}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-border">
                {exam.branches.map((b) => (
                  <Badge key={b} variant="secondary" className="text-[0.65rem]">{b}</Badge>
                ))}
                <div className="flex-1" />
                <Badge className={`text-[0.65rem] ${statusColor(exam.status)}`}>
                  {exam.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingExam ? "Edit Exam" : "Schedule New Exam"}</DialogTitle>
            <DialogDescription>
              {editingExam ? "Make changes to the exam details." : "Enter the exam details."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-[0.8rem]">Exam Name</Label>
              <Select value={formData.name} onValueChange={(v) => setFormData({ ...formData, name: v })}>
                <SelectTrigger className="text-[0.85rem]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mid-Semester Examination">Mid-Semester Examination</SelectItem>
                  <SelectItem value="End-Semester Examination">End-Semester Examination</SelectItem>
                  <SelectItem value="Supplementary Examination">Supplementary Examination</SelectItem>
                  <SelectItem value="Re-examination">Re-examination</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-[0.8rem]">Subject</Label>
              <Input
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="e.g., Data Structures"
                className="text-[0.85rem]"
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-1">
                <Label className="text-[0.8rem]">Date</Label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="text-[0.85rem]"
                />
              </div>
              <div>
                <Label className="text-[0.8rem]">Start</Label>
                <Input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  className="text-[0.85rem]"
                />
              </div>
              <div>
                <Label className="text-[0.8rem]">End</Label>
                <Input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  className="text-[0.85rem]"
                />
              </div>
            </div>
            <div>
              <Label className="text-[0.8rem]">Semester</Label>
              <Select value={String(formData.semester)} onValueChange={(v) => setFormData({ ...formData, semester: Number(v) })}>
                <SelectTrigger className="text-[0.85rem]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {[1,2,3,4,5,6,7,8].map((s) => (
                    <SelectItem key={s} value={String(s)}>Semester {s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-[0.8rem] mb-2 block">Branches</Label>
              <div className="flex flex-wrap gap-3">
                {branches.map((branch) => (
                  <label key={branch} className="flex items-center gap-2 text-[0.8rem] cursor-pointer">
                    <Checkbox
                      checked={formData.branches.includes(branch)}
                      onCheckedChange={() => toggleBranch(branch)}
                    />
                    {branch}
                  </label>
                ))}
              </div>
            </div>
            {editingExam && (
              <div>
                <Label className="text-[0.8rem]">Status</Label>
                <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                  <SelectTrigger className="text-[0.85rem]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="ongoing">Ongoing</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editingExam ? "Update" : "Schedule"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}