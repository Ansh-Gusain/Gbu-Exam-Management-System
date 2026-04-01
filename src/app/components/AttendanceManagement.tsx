import { useState, useMemo } from "react";
import { useStore } from "../lib/store";
import { generateAttendanceSheet } from "../lib/algorithms";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "./ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "./ui/table";
import {
  ClipboardList, Download, CheckCircle2, XCircle, Minus,
  Users, Printer,
} from "lucide-react";
import { toast } from "sonner";

export function AttendanceManagement() {
  const {
    students, rooms, exams,
    seatingAllocations,
    attendanceRecords, setAttendanceRecords,
    invigilationAllocations, faculty,
  } = useStore();

  const [selectedExamId, setSelectedExamId] = useState("");
  const [selectedRoomId, setSelectedRoomId] = useState("");

  const selectedExam = exams.find((e) => e.id === selectedExamId);

  const examRooms = useMemo(() => {
    const roomIds = [
      ...new Set(
        seatingAllocations
          .filter((sa) => sa.examId === selectedExamId)
          .map((sa) => sa.roomId)
      ),
    ];
    return roomIds
      .map((rid) => rooms.find((r) => r.id === rid))
      .filter(Boolean);
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
    seatingAllocations,
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
        (ar) =>
          ar.examId === selectedExamId &&
          ar.roomId === selectedRoomId &&
          ar.studentId === studentId
      );
      if (existing) {
        return prev.map((ar) =>
          ar.id === existing.id ? { ...ar, status, signature: status === "present" } : ar
        );
      }
      const record = {
        id: `att-${Date.now()}-${studentId}`,
        examId: selectedExamId,
        roomId: selectedRoomId,
        studentId,
        status,
        signature: status === "present",
      };
      return [...prev, record];
    });
  };

  const markAllPresent = () => {
    const newRecords = roomAttendance.map((ra) => ({
      ...ra,
      id: ra.id || `att-${Date.now()}-${ra.studentId}`,
      status: "present",
      signature: true,
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

  return (
    <div className="space-y-4">
      <div>
        <h1>Attendance Management</h1>
      </div>

      {/* Controls */}
      <Card>
        <CardContent className="py-4 px-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <label className="text-[0.8rem] text-muted-foreground mb-1 block">
                Select Exam
              </label>
              <Select
                value={selectedExamId}
                onValueChange={(v) => {
                  setSelectedExamId(v);
                  setSelectedRoomId("");
                }}
              >
                <SelectTrigger className="text-[0.85rem]">
                  <SelectValue placeholder="Choose an exam..." />
                </SelectTrigger>
                <SelectContent>
                  {exams.map((exam) => (
                    <SelectItem key={exam.id} value={exam.id}>
                      {exam.subject} — {exam.name} ({exam.date})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label className="text-[0.8rem] text-muted-foreground mb-1 block">
                Select Room
              </label>
              <Select
                value={selectedRoomId}
                onValueChange={setSelectedRoomId}
                disabled={examRooms.length === 0}
              >
                <SelectTrigger className="text-[0.85rem]">
                  <SelectValue
                    placeholder={
                      examRooms.length === 0
                        ? "Allocate seating first"
                        : "Choose a room..."
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {examRooms.map((room) => (
                    <SelectItem key={room.id} value={room.id}>
                      Room {room.roomNumber} ({room.building})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Sheet */}
      {selectedExamId && selectedRoomId && roomAttendance.length > 0 && (
        <Card>
          <CardHeader className="py-3 px-4 border-b border-border">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <CardTitle className="text-[0.9rem]">
                  Attendance Sheet — Room{" "}
                  {rooms.find((r) => r.id === selectedRoomId)?.roomNumber}
                </CardTitle>
                <div className="flex gap-3 mt-1 text-[0.75rem] text-muted-foreground">
                  {selectedExam && (
                    <>
                      <span>{selectedExam.subject}</span>
                      <span>&bull;</span>
                      <span>{selectedExam.date}</span>
                      <span>&bull;</span>
                      <span>
                        {selectedExam.startTime} - {selectedExam.endTime}
                      </span>
                    </>
                  )}
                  {roomInvigilator && (
                    <>
                      <span>&bull;</span>
                      <span>Invigilator: {roomInvigilator.name}</span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={markAllPresent}>
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Mark All Present
                </Button>
              </div>
            </div>

            <div className="flex gap-4 mt-3 text-[0.8rem]">
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                Present: {presentCount}
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                Absent: {absentCount}
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-gray-300" />
                Not Marked: {notMarkedCount}
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                Total: {roomAttendance.length}
              </span>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-[0.75rem] w-16">#</TableHead>
                    <TableHead className="text-[0.75rem]">Roll Number</TableHead>
                    <TableHead className="text-[0.75rem]">Name</TableHead>
                    <TableHead className="text-[0.75rem]">Branch</TableHead>
                    <TableHead className="text-[0.75rem]">Status</TableHead>
                    <TableHead className="text-[0.75rem]">Signature</TableHead>
                    <TableHead className="text-[0.75rem]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {roomAttendance.map((record, idx) => {
                    const student = students.find(
                      (s) => s.id === record.studentId
                    );
                    if (!student) return null;
                    return (
                      <TableRow key={record.id || record.studentId}>
                        <TableCell className="text-[0.8rem] font-mono">
                          {idx + 1}
                        </TableCell>
                        <TableCell className="text-[0.8rem] font-mono">
                          {student.rollNumber}
                        </TableCell>
                        <TableCell className="text-[0.8rem]">
                          {student.name}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="text-[0.7rem]">
                            {student.branch}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {record.status === "present" ? (
                            <Badge className="bg-green-100 text-green-700 text-[0.7rem]">
                              <CheckCircle2 className="w-3 h-3 mr-1" /> Present
                            </Badge>
                          ) : record.status === "absent" ? (
                            <Badge className="bg-red-100 text-red-700 text-[0.7rem]">
                              <XCircle className="w-3 h-3 mr-1" /> Absent
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="text-[0.7rem]">
                              <Minus className="w-3 h-3 mr-1" /> Not Marked
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-[0.8rem]">
                          {record.signature ? (
                            <span className="text-green-600 italic text-[0.75rem]">
                              Signed
                            </span>
                          ) : (
                            <span className="text-muted-foreground text-[0.75rem]">
                              —
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant={
                                record.status === "present"
                                  ? "default"
                                  : "outline"
                              }
                              className="h-6 px-2 text-[0.7rem]"
                              onClick={() =>
                                markAttendance(record.studentId, "present")
                              }
                            >
                              P
                            </Button>
                            <Button
                              size="sm"
                              variant={
                                record.status === "absent"
                                  ? "destructive"
                                  : "outline"
                              }
                              className="h-6 px-2 text-[0.7rem]"
                              onClick={() =>
                                markAttendance(record.studentId, "absent")
                              }
                            >
                              A
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {selectedExamId && examRooms.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground text-[0.85rem]">
            <ClipboardList className="w-10 h-10 mx-auto mb-3 opacity-30" />
            No seating allocations found for this exam. Please allocate seating
            first.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
