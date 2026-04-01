import { useMemo, useState } from "react";
import { useStore } from "../lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "./ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "./ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "./ui/select";
import { Input } from "./ui/input";
import {
  RefreshCw, Plus, Clock, CheckCircle2, AlertCircle
} from "lucide-react";
import { toast } from "sonner";

export function FacultyReplacements() {
  const {
    loggedInFacultyId, faculty, exams, rooms,
    invigilationAllocations, replacementLogs, setReplacementLogs
  } = useStore();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDutyId, setSelectedDutyId] = useState("");
  const [reason, setReason] = useState("");

  const currentFaculty = faculty.find((f) => f.id === loggedInFacultyId);

  const myDuties = useMemo(() => {
    return invigilationAllocations
      .filter((ia) => ia.facultyId === loggedInFacultyId)
      .map((duty) => {
        const exam = exams.find((e) => e.id === duty.examId);
        const room = rooms.find((r) => r.id === duty.roomId);
        return { ...duty, exam, room };
      })
      .filter((d) => d.exam && d.exam.status === "scheduled");
  }, [invigilationAllocations, loggedInFacultyId, exams, rooms]);

  const myReplacements = useMemo(() => {
    return replacementLogs
      .filter((r) => r.originalFacultyId === loggedInFacultyId)
      .map((rep) => {
        const exam = exams.find((e) => e.id === rep.examId);
        const room = rooms.find((r) => r.id === rep.roomId);
        const replacement = faculty.find((f) => f.id === rep.replacementFacultyId);
        return { ...rep, exam, room, replacement };
      })
      .sort((a, b) => b.requestedAt.localeCompare(a.requestedAt));
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
      requestedAt: new Date().toISOString(),
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1>Replacement Requests</h1>
          <p className="text-muted-foreground text-[0.85rem] mt-1">
            Request duty replacements for your assigned invigilation
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => setDialogOpen(true)}
          disabled={myDuties.length === 0}
        >
          <Plus className="w-4 h-4 mr-1" /> Request Replacement
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="py-3">
          <CardContent className="px-4 py-0">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-amber-600" />
              <p className="text-[0.75rem] text-muted-foreground">Pending</p>
            </div>
            <p className="text-[1.25rem] font-semibold">{pendingCount}</p>
          </CardContent>
        </Card>
        <Card className="py-3">
          <CardContent className="px-4 py-0">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <p className="text-[0.75rem] text-muted-foreground">Approved</p>
            </div>
            <p className="text-[1.25rem] font-semibold">{approvedCount}</p>
          </CardContent>
        </Card>
        <Card className="py-3">
          <CardContent className="px-4 py-0">
            <div className="flex items-center gap-2 mb-1">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <p className="text-[0.75rem] text-muted-foreground">Rejected</p>
            </div>
            <p className="text-[1.25rem] font-semibold">{rejectedCount}</p>
          </CardContent>
        </Card>
      </div>

      {/* Requests table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-[0.9rem]">My Replacement History</CardTitle>
        </CardHeader>
        <CardContent>
          {myReplacements.length === 0 ? (
            <div className="text-center py-12">
              <RefreshCw className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground">No replacement requests yet</p>
              <p className="text-[0.75rem] text-muted-foreground/70 mt-1">
                {myDuties.length > 0
                  ? "Click 'Request Replacement' to submit a new request"
                  : "You need assigned duties before requesting replacements"
                }
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-[0.75rem]">Exam</TableHead>
                    <TableHead className="text-[0.75rem]">Room</TableHead>
                    <TableHead className="text-[0.75rem]">Reason</TableHead>
                    <TableHead className="text-[0.75rem]">Replacement</TableHead>
                    <TableHead className="text-[0.75rem]">Status</TableHead>
                    <TableHead className="text-[0.75rem]">Requested</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myReplacements.map((rep) => (
                    <TableRow key={rep.id}>
                      <TableCell className="text-[0.8rem]">
                        <div className="font-medium">{rep.exam?.subject || "—"}</div>
                        <div className="text-[0.7rem] text-muted-foreground">
                          {rep.exam ? new Date(rep.exam.date).toLocaleDateString() : "—"}
                        </div>
                      </TableCell>
                      <TableCell className="text-[0.8rem]">
                        Room {rep.room?.roomNumber || "—"}
                      </TableCell>
                      <TableCell className="text-[0.8rem] max-w-[200px] truncate">
                        {rep.reason}
                      </TableCell>
                      <TableCell className="text-[0.8rem]">
                        {rep.replacement ? rep.replacement.name : (
                          <span className="text-muted-foreground italic">Not assigned</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            rep.status === "approved" ? "default" :
                            rep.status === "pending" ? "secondary" : "destructive"
                          }
                          className="text-[0.65rem]"
                        >
                          {rep.status === "approved" && <CheckCircle2 className="w-3 h-3 mr-1" />}
                          {rep.status === "pending" && <Clock className="w-3 h-3 mr-1" />}
                          {rep.status === "rejected" && <AlertCircle className="w-3 h-3 mr-1" />}
                          {rep.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-[0.75rem] text-muted-foreground">
                        {new Date(rep.requestedAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Request dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Replacement</DialogTitle>
            <DialogDescription>
              Submit a replacement request for one of your upcoming duties
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Select Duty</Label>
              <Select value={selectedDutyId} onValueChange={setSelectedDutyId}>
                <SelectTrigger className="text-[0.85rem]">
                  <SelectValue placeholder="Select a duty to be replaced..." />
                </SelectTrigger>
                <SelectContent>
                  {myDuties.map((duty) => (
                    <SelectItem key={duty.id} value={duty.id}>
                      {duty.exam?.subject} — Room {duty.room?.roomNumber} ({duty.exam?.date})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Reason for Replacement</Label>
              <Input
                placeholder="e.g., Medical leave, Family emergency..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="text-[0.85rem]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRequestReplacement}>
              Submit Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}