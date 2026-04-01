import { useMemo, useState } from "react";
import { useStore } from "../lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "./ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "./ui/select";
import { ClipboardList, Check, X, UserCheck, Users } from "lucide-react";
import { toast } from "sonner";

export function FacultyAttendance() {
  const {
    loggedInFacultyId, exams, rooms, students,
    invigilationAllocations, seatingAllocations,
    attendanceRecords, setAttendanceRecords
  } = useStore();

  const [selectedDutyId, setSelectedDutyId] = useState("none");

  const myDuties = useMemo(() => {
    return invigilationAllocations
      .filter((ia) => ia.facultyId === loggedInFacultyId)
      .map((duty) => {
        const exam = exams.find((e) => e.id === duty.examId);
        const room = rooms.find((r) => r.id === duty.roomId);
        return { ...duty, exam, room };
      })
      .filter((d) => d.exam && (d.exam.status === "scheduled" || d.exam.status === "ongoing"));
  }, [invigilationAllocations, loggedInFacultyId, exams, rooms]);

  const selectedDuty = myDuties.find((d) => d.id === selectedDutyId);

  const studentsInRoom = useMemo(() => {
    if (!selectedDuty) return [];
    return seatingAllocations
      .filter((sa) => sa.examId === selectedDuty.examId && sa.roomId === selectedDuty.roomId)
      .map((sa) => {
        const student = students.find((s) => s.id === sa.studentId);
        const attendance = attendanceRecords.find(
          (ar) => ar.examId === sa.examId && ar.roomId === sa.roomId && ar.studentId === sa.studentId
        );
        return { ...sa, student, attendance };
      })
      .sort((a, b) => (a.student?.rollNumber || "").localeCompare(b.student?.rollNumber || ""));
  }, [selectedDuty, seatingAllocations, students, attendanceRecords]);

  const handleMarkAttendance = (studentId, status) => {
    if (!selectedDuty) return;
    setAttendanceRecords((prev) => {
      const existing = prev.findIndex(
        (ar) =>
          ar.examId === selectedDuty.examId &&
          ar.roomId === selectedDuty.roomId &&
          ar.studentId === studentId
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
          signature: status === "present",
        },
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

  return (
    <div className="space-y-6">
      <div>
        <h1>Mark Attendance</h1>
        <p className="text-muted-foreground text-[0.85rem] mt-1">
          Mark student attendance for your assigned rooms
        </p>
      </div>

      {/* Duty selector */}
      <Card>
        <CardContent className="py-4 px-4">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <div className="flex-1">
              <label className="text-[0.8rem] font-medium mb-1.5 block">Select Duty</label>
              <Select value={selectedDutyId} onValueChange={setSelectedDutyId}>
                <SelectTrigger className="w-full text-[0.85rem]">
                  <SelectValue placeholder="Select an assigned duty..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Select a duty...</SelectItem>
                  {myDuties.map((duty) => (
                    <SelectItem key={duty.id} value={duty.id}>
                      {duty.exam?.subject} — Room {duty.room?.roomNumber} ({duty.exam?.date})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedDuty && studentsInRoom.length > 0 && (
              <Button
                size="sm"
                variant="outline"
                className="mt-auto"
                onClick={handleMarkAllPresent}
              >
                <UserCheck className="w-4 h-4 mr-1" /> Mark All Present
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {myDuties.length === 0 && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <ClipboardList className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground">No active duties to mark attendance</p>
              <p className="text-[0.75rem] text-muted-foreground/70 mt-1">
                You need to have assigned invigilation duties with seating allocations
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {selectedDuty && (
        <>
          {/* Room info + counts */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Card className="py-3">
              <CardContent className="px-4 py-0">
                <p className="text-[0.7rem] text-muted-foreground">Total Students</p>
                <p className="text-[1.1rem] font-semibold">{studentsInRoom.length}</p>
              </CardContent>
            </Card>
            <Card className="py-3">
              <CardContent className="px-4 py-0">
                <p className="text-[0.7rem] text-green-600">Present</p>
                <p className="text-[1.1rem] font-semibold text-green-700">{presentCount}</p>
              </CardContent>
            </Card>
            <Card className="py-3">
              <CardContent className="px-4 py-0">
                <p className="text-[0.7rem] text-red-600">Absent</p>
                <p className="text-[1.1rem] font-semibold text-red-700">{absentCount}</p>
              </CardContent>
            </Card>
            <Card className="py-3">
              <CardContent className="px-4 py-0">
                <p className="text-[0.7rem] text-amber-600">Unmarked</p>
                <p className="text-[1.1rem] font-semibold text-amber-700">{unmarkedCount}</p>
              </CardContent>
            </Card>
          </div>

          {/* Student list */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-[0.9rem] flex items-center gap-2">
                <Users className="w-4 h-4" />
                Students in Room {selectedDuty.room?.roomNumber}
                <span className="text-muted-foreground font-normal">
                  ({studentsInRoom.length} students)
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {studentsInRoom.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground text-[0.85rem]">
                    No students allocated to this room for this exam
                  </p>
                  <p className="text-muted-foreground/70 text-[0.75rem] mt-1">
                    Run seating allocation from the admin panel first
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-[0.75rem]">Seat #</TableHead>
                        <TableHead className="text-[0.75rem]">Roll No.</TableHead>
                        <TableHead className="text-[0.75rem]">Name</TableHead>
                        <TableHead className="text-[0.75rem]">Branch</TableHead>
                        <TableHead className="text-[0.75rem]">Status</TableHead>
                        <TableHead className="text-[0.75rem] text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {studentsInRoom.map((entry) => (
                        <TableRow key={entry.id}>
                          <TableCell className="text-[0.8rem] font-mono">
                            {entry.seatNumber}
                          </TableCell>
                          <TableCell className="text-[0.8rem] font-mono">
                            {entry.student?.rollNumber}
                          </TableCell>
                          <TableCell className="text-[0.8rem]">
                            {entry.student?.name}
                          </TableCell>
                          <TableCell className="text-[0.8rem]">
                            <Badge variant="outline" className="text-[0.65rem]">
                              {entry.student?.branch}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                entry.attendance?.status === "present"
                                  ? "default"
                                  : entry.attendance?.status === "absent"
                                  ? "destructive"
                                  : "secondary"
                              }
                              className="text-[0.65rem]"
                            >
                              {entry.attendance?.status || "not-marked"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-1 justify-end">
                              <Button
                                size="sm"
                                variant={entry.attendance?.status === "present" ? "default" : "outline"}
                                className="h-7 w-7 p-0"
                                onClick={() => entry.student && handleMarkAttendance(entry.student.id, "present")}
                              >
                                <Check className="w-3.5 h-3.5" />
                              </Button>
                              <Button
                                size="sm"
                                variant={entry.attendance?.status === "absent" ? "destructive" : "outline"}
                                className="h-7 w-7 p-0"
                                onClick={() => entry.student && handleMarkAttendance(entry.student.id, "absent")}
                              >
                                <X className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}