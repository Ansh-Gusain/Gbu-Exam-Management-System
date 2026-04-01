import { useState, useMemo } from "react";
import { useStore } from "../lib/store";
import { allocateInvigilators } from "../lib/algorithms";
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
  UserCheck, Play, AlertCircle, CheckCircle2, BarChart3,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { toast } from "sonner";

export function InvigilatorAllocation() {
  const {
    rooms, exams, faculty,
    invigilationAllocations, setInvigilationAllocations, setFaculty,
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
    return faculty
      .filter((f) => f.isAvailable)
      .map((f) => ({
        name: f.name.split(" ").slice(-1)[0],
        duties: f.totalDuties + (counts[f.id] || 0),
      }))
      .sort((a, b) => b.duties - a.duties)
      .slice(0, 15);
  }, [faculty, invigilationAllocations]);

  const handleAllocate = () => {
    if (!selectedExam) return;
    setAllocating(true);
    setTimeout(() => {
      const result = allocateInvigilators(
        faculty, rooms, selectedExam, invigilationAllocations
      );
      if (result.error) {
        toast.error(result.error);
      } else {
        setInvigilationAllocations((prev) => [
          ...prev.filter((ia) => ia.examId !== selectedExamId),
          ...result.allocations,
        ]);
        // Update faculty duty counts
        setFaculty((prev) =>
          prev.map((f) => {
            const newDuties = result.allocations.filter(
              (a) => a.facultyId === f.id
            ).length;
            return newDuties > 0
              ? { ...f, totalDuties: f.totalDuties + newDuties }
              : f;
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
    setInvigilationAllocations((prev) =>
      prev.filter((ia) => ia.examId !== selectedExamId)
    );
    toast.success("Invigilation allocations cleared.");
  };

  return (
    <div className="space-y-4">
      <div>
        <h1>Invigilator Allocation</h1>
      </div>

      {/* Controls */}
      <Card>
        <CardContent className="py-4 px-4">
          <div className="flex flex-col sm:flex-row gap-3 items-end">
            <div className="flex-1">
              <label className="text-[0.8rem] text-muted-foreground mb-1 block">
                Select Exam
              </label>
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
                {allocating ? "Allocating..." : "Auto Assign"}
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
              <span>
                Available Faculty: <strong>{faculty.filter((f) => f.isAvailable).length}</strong>
              </span>
              <span>
                Assigned: <strong>{examAllocations.length}</strong>
              </span>
              <span>
                {examAllocations.length > 0 ? (
                  <Badge className="bg-green-100 text-green-700 text-[0.7rem]">
                    <CheckCircle2 className="w-3 h-3 mr-1" /> Assigned
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="text-[0.7rem]">
                    <AlertCircle className="w-3 h-3 mr-1" /> Not Assigned
                  </Badge>
                )}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="allocations">
        <TabsList>
          <TabsTrigger value="allocations" className="text-[0.8rem]">
            Duty Chart
          </TabsTrigger>
          <TabsTrigger value="distribution" className="text-[0.8rem]">
            Workload Distribution
          </TabsTrigger>
          <TabsTrigger value="faculty" className="text-[0.8rem]">
            Faculty Overview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="allocations">
          {examAllocations.length > 0 ? (
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-[0.75rem]">Room</TableHead>
                        <TableHead className="text-[0.75rem]">Building</TableHead>
                        <TableHead className="text-[0.75rem]">Invigilator</TableHead>
                        <TableHead className="text-[0.75rem]">Department</TableHead>
                        <TableHead className="text-[0.75rem]">Role</TableHead>
                        <TableHead className="text-[0.75rem]">Total Duties</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {examAllocations.map((ia) => {
                        const room = rooms.find((r) => r.id === ia.roomId);
                        const fac = faculty.find((f) => f.id === ia.facultyId);
                        if (!room || !fac) return null;
                        return (
                          <TableRow key={ia.id}>
                            <TableCell className="text-[0.8rem]">
                              Room {room.roomNumber}
                            </TableCell>
                            <TableCell className="text-[0.8rem]">
                              {room.building}
                            </TableCell>
                            <TableCell className="text-[0.8rem]">
                              {fac.name}
                            </TableCell>
                            <TableCell className="text-[0.8rem]">
                              {fac.department}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={ia.role === "chief" ? "default" : "secondary"}
                                className="text-[0.7rem]"
                              >
                                {ia.role}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-[0.8rem] font-mono">
                              {fac.totalDuties}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground text-[0.85rem]">
                <UserCheck className="w-10 h-10 mx-auto mb-3 opacity-30" />
                Select an exam and click "Auto Assign" to allocate invigilators.
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="distribution">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-[0.9rem] flex items-center gap-2">
                <BarChart3 className="w-4 h-4" /> Faculty Duty Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dutyDistribution} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 11 }}
                    width={100}
                  />
                  <Tooltip />
                  <Bar dataKey="duties" fill="#6366f1" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="faculty">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-[0.75rem]">Employee ID</TableHead>
                      <TableHead className="text-[0.75rem]">Name</TableHead>
                      <TableHead className="text-[0.75rem]">Department</TableHead>
                      <TableHead className="text-[0.75rem]">Designation</TableHead>
                      <TableHead className="text-[0.75rem]">Total Duties</TableHead>
                      <TableHead className="text-[0.75rem]">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {faculty
                      .sort((a, b) => a.totalDuties - b.totalDuties)
                      .map((f) => (
                        <TableRow key={f.id}>
                          <TableCell className="text-[0.8rem] font-mono">
                            {f.employeeId}
                          </TableCell>
                          <TableCell className="text-[0.8rem]">{f.name}</TableCell>
                          <TableCell className="text-[0.8rem]">
                            {f.department}
                          </TableCell>
                          <TableCell className="text-[0.8rem]">
                            {f.designation}
                          </TableCell>
                          <TableCell className="text-[0.8rem] font-mono">
                            {f.totalDuties}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={f.isAvailable ? "default" : "secondary"}
                              className={`text-[0.7rem] ${
                                f.isAvailable
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {f.isAvailable ? "Available" : "Unavailable"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}