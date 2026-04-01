import { useState } from "react";
import { useStore } from "../lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "./ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "./ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "./ui/dialog";
import {
  RefreshCw, Plus, CheckCircle2, XCircle, Clock,
  ArrowRight, User,
} from "lucide-react";
import { toast } from "sonner";

export function ReplacementManagement() {
  const {
    exams, rooms, faculty,
    invigilationAllocations,
    replacementLogs, setReplacementLogs,
    setInvigilationAllocations,
  } = useStore();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    examId: "",
    roomId: "",
    originalFacultyId: "",
    reason: "",
  });
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = replacementLogs.filter(
    (r) => statusFilter === "all" || r.status === statusFilter
  );

  const pendingCount = replacementLogs.filter((r) => r.status === "pending").length;

  const openRequest = () => {
    setFormData({ examId: "", roomId: "", originalFacultyId: "", reason: "" });
    setDialogOpen(true);
  };

  const handleRequest = () => {
    if (!formData.examId || !formData.originalFacultyId || !formData.reason) return;
    const newLog = {
      id: `rep-${Date.now()}`,
      examId: formData.examId,
      roomId: formData.roomId,
      originalFacultyId: formData.originalFacultyId,
      replacementFacultyId: "",
      reason: formData.reason,
      status: "pending",
      requestedAt: new Date().toISOString(),
    };
    setReplacementLogs((prev) => [...prev, newLog]);
    setDialogOpen(false);
    toast.success("Replacement request submitted.");
  };

  const handleApprove = (logId) => {
    const log = replacementLogs.find((r) => r.id === logId);
    if (!log) return;

    const availableFaculty = faculty.filter(
      (f) =>
        f.isAvailable &&
        f.id !== log.originalFacultyId &&
        !invigilationAllocations.some(
          (ia) => ia.examId === log.examId && ia.facultyId === f.id
        )
    );

    if (availableFaculty.length === 0) {
      toast.error("No available faculty for replacement.");
      return;
    }

    const replacement = availableFaculty.sort(
      (a, b) => a.totalDuties - b.totalDuties
    )[0];

    setReplacementLogs((prev) =>
      prev.map((r) =>
        r.id === logId
          ? {
              ...r,
              status: "approved",
              replacementFacultyId: replacement.id,
              approvedAt: new Date().toISOString(),
            }
          : r
      )
    );

    setInvigilationAllocations((prev) =>
      prev.map((ia) =>
        ia.examId === log.examId &&
        ia.roomId === log.roomId &&
        ia.facultyId === log.originalFacultyId
          ? { ...ia, facultyId: replacement.id }
          : ia
      )
    );

    toast.success(`Approved. ${replacement.name} assigned as replacement.`);
  };

  const handleReject = (logId) => {
    setReplacementLogs((prev) =>
      prev.map((r) => (r.id === logId ? { ...r, status: "rejected" } : r))
    );
    toast.success("Replacement request rejected.");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1>Replacement Management</h1>
        </div>
        <Button size="sm" onClick={openRequest}>
          <Plus className="w-4 h-4 mr-1" /> New Request
        </Button>
      </div>

      {/* Filter */}
      <Card>
        <CardContent className="py-3 px-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px] h-9 text-[0.85rem]">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Replacement Log Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[0.75rem]">Exam</TableHead>
                  <TableHead className="text-[0.75rem]">Original Faculty</TableHead>
                  <TableHead className="text-[0.75rem]">Replacement</TableHead>
                  <TableHead className="text-[0.75rem]">Reason</TableHead>
                  <TableHead className="text-[0.75rem]">Requested</TableHead>
                  <TableHead className="text-[0.75rem]">Status</TableHead>
                  <TableHead className="text-[0.75rem]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground text-[0.85rem] py-8">
                      No replacement requests found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((log) => {
                    const exam = exams.find((e) => e.id === log.examId);
                    const origFac = faculty.find(
                      (f) => f.id === log.originalFacultyId
                    );
                    const repFac = faculty.find(
                      (f) => f.id === log.replacementFacultyId
                    );
                    return (
                      <TableRow key={log.id}>
                        <TableCell className="text-[0.8rem]">
                          {exam?.subject || "—"}
                          <span className="block text-[0.7rem] text-muted-foreground">
                            {exam?.date}
                          </span>
                        </TableCell>
                        <TableCell className="text-[0.8rem]">
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3 text-muted-foreground" />
                            {origFac?.name || "—"}
                          </div>
                        </TableCell>
                        <TableCell className="text-[0.8rem]">
                          {repFac ? (
                            <div className="flex items-center gap-1">
                              <ArrowRight className="w-3 h-3 text-green-600" />
                              {repFac.name}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-[0.8rem] max-w-[200px] truncate">
                          {log.reason}
                        </TableCell>
                        <TableCell className="text-[0.75rem] text-muted-foreground">
                          {new Date(log.requestedAt).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`text-[0.7rem] ${
                              log.status === "approved"
                                ? "bg-green-100 text-green-700"
                                : log.status === "pending"
                                ? "bg-amber-100 text-amber-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {log.status === "approved" && (
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                            )}
                            {log.status === "pending" && (
                              <Clock className="w-3 h-3 mr-1" />
                            )}
                            {log.status === "rejected" && (
                              <XCircle className="w-3 h-3 mr-1" />
                            )}
                            {log.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {log.status === "pending" && (
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                className="h-6 px-2 text-[0.7rem]"
                                onClick={() => handleApprove(log.id)}
                              >
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-6 px-2 text-[0.7rem]"
                                onClick={() => handleReject(log.id)}
                              >
                                Reject
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* New Request Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Invigilator Replacement</DialogTitle>
            <DialogDescription>
              Please provide the details for the replacement request.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-[0.8rem]">Exam</Label>
              <Select
                value={formData.examId}
                onValueChange={(v) => setFormData({ ...formData, examId: v })}
              >
                <SelectTrigger className="text-[0.85rem]">
                  <SelectValue placeholder="Select exam" />
                </SelectTrigger>
                <SelectContent>
                  {exams
                    .filter((e) => e.status === "scheduled")
                    .map((exam) => (
                      <SelectItem key={exam.id} value={exam.id}>
                        {exam.subject} — {exam.date}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-[0.8rem]">Faculty to Replace</Label>
              <Select
                value={formData.originalFacultyId}
                onValueChange={(v) =>
                  setFormData({ ...formData, originalFacultyId: v })
                }
              >
                <SelectTrigger className="text-[0.85rem]">
                  <SelectValue placeholder="Select faculty" />
                </SelectTrigger>
                <SelectContent>
                  {faculty.map((f) => (
                    <SelectItem key={f.id} value={f.id}>
                      {f.name} ({f.department})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-[0.8rem]">Reason</Label>
              <Textarea
                value={formData.reason}
                onChange={(e) =>
                  setFormData({ ...formData, reason: e.target.value })
                }
                placeholder="Reason for replacement..."
                className="text-[0.85rem]"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRequest}>Submit Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
