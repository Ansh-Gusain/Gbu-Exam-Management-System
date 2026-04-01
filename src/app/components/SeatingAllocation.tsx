import { useState, useMemo } from "react";
import { useStore } from "../lib/store";
import { allocateSeating } from "../lib/algorithms";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "./ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "./ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Grid3X3, Play, Printer, AlertCircle, CheckCircle2, Users, DoorOpen,
} from "lucide-react";
import { toast } from "sonner";

export function SeatingAllocation() {
  const {
    students, rooms, exams,
    seatingAllocations, setSeatingAllocations,
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
      const room = rooms.find((r) => r.id === rid)!;
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
        // Remove existing allocations for this exam first
        setSeatingAllocations((prev) => [
          ...prev.filter((sa) => sa.examId !== selectedExamId),
          ...result.allocations,
        ]);
        toast.success(`Successfully allocated ${result.allocations.length} students across ${new Set(result.allocations.map(a => a.roomId)).size} rooms.`);
      }
      setAllocating(false);
    }, 500);
  };

  const handleClear = () => {
    setSeatingAllocations((prev) => prev.filter((sa) => sa.examId !== selectedExamId));
    toast.success("Seating allocations cleared.");
  };

  const eligibleCount = selectedExam
    ? students.filter(
        (s) => selectedExam.branches.includes(s.branch) && s.semester === selectedExam.semester
      ).length
    : 0;

  return (
    <div className="space-y-4">
      <div>
        <h1>Seating Allocation</h1>
      </div>

      {/* Controls */}
      <Card>
        <CardContent className="py-4 px-4">
          <div className="flex flex-col sm:flex-row gap-3 items-end">
            <div className="flex-1">
              <label className="text-[0.8rem] text-muted-foreground mb-1 block">Select Exam</label>
              <Select value={selectedExamId} onValueChange={setSelectedExamId}>
                <SelectTrigger className="text-[0.85rem]">
                  <SelectValue placeholder="Choose an exam..." />
                </SelectTrigger>
                <SelectContent>
                  {scheduledExams.map((exam) => (
                    <SelectItem key={exam.id} value={exam.id}>
                      {exam.subject} — {exam.name} ({exam.date})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleAllocate}
                disabled={!selectedExamId || allocating}
              >
                <Play className="w-4 h-4 mr-1" />
                {allocating ? "Allocating..." : "Auto Allocate"}
              </Button>
              {examAllocations.length > 0 && (
                <Button size="sm" variant="outline" onClick={handleClear}>
                  Clear
                </Button>
              )}
            </div>
          </div>
          {selectedExam && (
            <div className="flex flex-wrap gap-4 mt-3 pt-3 border-t border-border text-[0.8rem]">
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-muted-foreground" />
                Eligible: <strong>{eligibleCount}</strong>
              </span>
              <span className="flex items-center gap-1">
                <Grid3X3 className="w-3.5 h-3.5 text-muted-foreground" />
                Allocated: <strong>{examAllocations.length}</strong>
              </span>
              <span className="flex items-center gap-1">
                <DoorOpen className="w-3.5 h-3.5 text-muted-foreground" />
                Rooms Used: <strong>{allocatedRooms.length}</strong>
              </span>
              <span>
                {examAllocations.length > 0 ? (
                  <Badge className="bg-green-100 text-green-700 text-[0.7rem]">
                    <CheckCircle2 className="w-3 h-3 mr-1" /> Allocated
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="text-[0.7rem]">
                    <AlertCircle className="w-3 h-3 mr-1" /> Not Allocated
                  </Badge>
                )}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {examAllocations.length > 0 && (
        <Tabs defaultValue="rooms">
          <TabsList>
            <TabsTrigger value="rooms" className="text-[0.8rem]">Room Summary</TabsTrigger>
            <TabsTrigger value="students" className="text-[0.8rem]">Student List</TabsTrigger>
          </TabsList>

          <TabsContent value="rooms">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {allocatedRooms.map(({ room, studentCount }) => (
                <Card key={room.id} className="cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => setSelectedRoomId(room.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-[0.9rem]">Room {room.roomNumber}</h3>
                      <Badge variant="secondary" className="text-[0.7rem]">{room.building}</Badge>
                    </div>
                    <div className="flex items-center justify-between text-[0.8rem]">
                      <span className="text-muted-foreground">Students</span>
                      <span>{studentCount} / {room.capacity}</span>
                    </div>
                    <div className="mt-2 w-full bg-accent rounded-full h-2">
                      <div
                        className="bg-primary rounded-full h-2 transition-all"
                        style={{ width: `${Math.min((studentCount / room.capacity) * 100, 100)}%` }}
                      />
                    </div>
                    <p className="text-[0.7rem] text-muted-foreground mt-1 text-right">
                      {Math.round((studentCount / room.capacity) * 100)}% utilized
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="students">
            <Card>
              <CardHeader className="py-3 px-4">
                <div className="flex items-center gap-3">
                  <label className="text-[0.8rem] text-muted-foreground">Filter by Room:</label>
                  <Select value={selectedRoomId} onValueChange={setSelectedRoomId}>
                    <SelectTrigger className="w-[200px] h-8 text-[0.8rem]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Rooms</SelectItem>
                      {allocatedRooms.map(({ room }) => (
                        <SelectItem key={room.id} value={room.id}>
                          Room {room.roomNumber} ({room.building})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-[0.75rem]">Seat #</TableHead>
                        <TableHead className="text-[0.75rem]">Roll Number</TableHead>
                        <TableHead className="text-[0.75rem]">Name</TableHead>
                        <TableHead className="text-[0.75rem]">Branch</TableHead>
                        <TableHead className="text-[0.75rem]">Room</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {roomAllocations.map((sa) => {
                        const student = students.find((s) => s.id === sa.studentId);
                        const room = rooms.find((r) => r.id === sa.roomId);
                        if (!student || !room) return null;
                        return (
                          <TableRow key={sa.id}>
                            <TableCell className="text-[0.8rem] font-mono">{sa.seatNumber}</TableCell>
                            <TableCell className="text-[0.8rem] font-mono">{student.rollNumber}</TableCell>
                            <TableCell className="text-[0.8rem]">{student.name}</TableCell>
                            <TableCell>
                              <Badge variant="secondary" className="text-[0.7rem]">{student.branch}</Badge>
                            </TableCell>
                            <TableCell className="text-[0.8rem]">{room.roomNumber}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}