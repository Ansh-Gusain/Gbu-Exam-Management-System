import { useMemo, useState } from "react";
import { useStore } from "../lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "./ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "./ui/select";
import {
  BarChart3, DoorOpen, UserCheck, ClipboardList, Users,
  TrendingUp, Award,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
  LineChart, Line,
} from "recharts";

const COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6", "#f97316"];

export function Reports() {
  const {
    students, rooms, exams, faculty,
    seatingAllocations, invigilationAllocations,
    attendanceRecords, replacementLogs,
  } = useStore();

  const [selectedExamId, setSelectedExamId] = useState("all");

  // Room Utilization Report
  const roomUtilization = useMemo(() => {
    return rooms.map((room) => {
      const allocations = seatingAllocations.filter(
        (sa) => sa.roomId === room.id && (selectedExamId === "all" || sa.examId === selectedExamId)
      );
      return {
        room: room.roomNumber,
        building: room.building,
        capacity: room.capacity,
        allocated: allocations.length,
        utilization: room.capacity > 0 ? Math.round((allocations.length / room.capacity) * 100) : 0,
      };
    }).filter((r) => r.allocated > 0);
  }, [rooms, seatingAllocations, selectedExamId]);

  // Faculty Duty Summary
  const facultyDutySummary = useMemo(() => {
    return faculty
      .map((f) => {
        const duties = invigilationAllocations.filter(
          (ia) => ia.facultyId === f.id
        ).length;
        const chiefDuties = invigilationAllocations.filter(
          (ia) => ia.facultyId === f.id && ia.role === "chief"
        ).length;
        const replacements = replacementLogs.filter(
          (r) => r.originalFacultyId === f.id && r.status === "approved"
        ).length;
        return {
          name: f.name,
          department: f.department,
          designation: f.designation,
          totalDuties: f.totalDuties + duties,
          chiefDuties,
          assistantDuties: duties - chiefDuties,
          replacementsRequested: replacements,
        };
      })
      .sort((a, b) => b.totalDuties - a.totalDuties);
  }, [faculty, invigilationAllocations, replacementLogs]);

  // Attendance Summary by Exam
  const attendanceSummary = useMemo(() => {
    return exams.map((exam) => {
      const records = attendanceRecords.filter((ar) => ar.examId === exam.id);
      const present = records.filter((r) => r.status === "present").length;
      const absent = records.filter((r) => r.status === "absent").length;
      const total = records.length;
      return {
        exam: exam.subject,
        date: exam.date,
        total,
        present,
        absent,
        rate: total > 0 ? Math.round((present / total) * 100) : 0,
      };
    }).filter((a) => a.total > 0);
  }, [exams, attendanceRecords]);

  // Department-wise allocation chart
  const deptAllocation = useMemo(() => {
    const deptMap = {};
    for (const ia of invigilationAllocations) {
      const fac = faculty.find((f) => f.id === ia.facultyId);
      if (fac) {
        deptMap[fac.department] = (deptMap[fac.department] || 0) + 1;
      }
    }
    return Object.entries(deptMap).map(([dept, count]) => ({
      name: dept,
      value: count,
    }));
  }, [invigilationAllocations, faculty]);

  // Branch student count
  const branchStudentCount = useMemo(() => {
    const map = {};
    for (const s of students) {
      map[s.branch] = (map[s.branch] || 0) + 1;
    }
    return Object.entries(map).map(([branch, count]) => ({
      branch,
      count,
    }));
  }, [students]);

  // Summary stats
  const totalAllocations = seatingAllocations.length;
  const totalInvigilations = invigilationAllocations.length;
  const totalAttendanceMarked = attendanceRecords.length;
  const approvedReplacements = replacementLogs.filter(r => r.status === "approved").length;

  return (
    <div className="space-y-4">
      <div>
        <h1>Reports & Analytics</h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="py-3">
          <CardContent className="px-4 py-0">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-blue-600" />
              <span className="text-[0.75rem] text-muted-foreground">Seats Allocated</span>
            </div>
            <p className="text-[1.1rem]">{totalAllocations}</p>
          </CardContent>
        </Card>
        <Card className="py-3">
          <CardContent className="px-4 py-0">
            <div className="flex items-center gap-2 mb-1">
              <UserCheck className="w-4 h-4 text-green-600" />
              <span className="text-[0.75rem] text-muted-foreground">Invigilation Duties</span>
            </div>
            <p className="text-[1.1rem]">{totalInvigilations}</p>
          </CardContent>
        </Card>
        <Card className="py-3">
          <CardContent className="px-4 py-0">
            <div className="flex items-center gap-2 mb-1">
              <ClipboardList className="w-4 h-4 text-amber-600" />
              <span className="text-[0.75rem] text-muted-foreground">Attendance Marked</span>
            </div>
            <p className="text-[1.1rem]">{totalAttendanceMarked}</p>
          </CardContent>
        </Card>
        <Card className="py-3">
          <CardContent className="px-4 py-0">
            <div className="flex items-center gap-2 mb-1">
              <Award className="w-4 h-4 text-purple-600" />
              <span className="text-[0.75rem] text-muted-foreground">Replacements</span>
            </div>
            <p className="text-[1.1rem]">{approvedReplacements}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="rooms">
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="rooms" className="text-[0.8rem]">Room Utilization</TabsTrigger>
          <TabsTrigger value="faculty" className="text-[0.8rem]">Faculty Duties</TabsTrigger>
          <TabsTrigger value="attendance" className="text-[0.8rem]">Attendance</TabsTrigger>
          <TabsTrigger value="distribution" className="text-[0.8rem]">Distribution</TabsTrigger>
        </TabsList>

        {/* Room Utilization */}
        <TabsContent value="rooms">
          <div className="space-y-4">
            <Card>
              <CardHeader className="py-3 px-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-[0.9rem] flex items-center gap-2">
                    <DoorOpen className="w-4 h-4" /> Room Utilization
                  </CardTitle>
                  <Select value={selectedExamId} onValueChange={setSelectedExamId}>
                    <SelectTrigger className="w-[200px] h-8 text-[0.8rem]">
                      <SelectValue placeholder="Filter exam" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Exams</SelectItem>
                      {exams.map((exam) => (
                        <SelectItem key={exam.id} value={exam.id}>
                          {exam.subject} ({exam.date})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                {roomUtilization.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={roomUtilization}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="room" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} unit="%" />
                      <Tooltip
                        formatter={(value, name) => [
                          `${value}%`,
                          name === "utilization" ? "Utilization" : name,
                        ]}
                      />
                      <Bar dataKey="utilization" fill="#6366f1" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-center text-muted-foreground text-[0.85rem] py-12">
                    No seating allocations yet. Allocate seats to see utilization data.
                  </p>
                )}
              </CardContent>
            </Card>

            {roomUtilization.length > 0 && (
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-[0.75rem]">Room</TableHead>
                        <TableHead className="text-[0.75rem]">Building</TableHead>
                        <TableHead className="text-[0.75rem]">Capacity</TableHead>
                        <TableHead className="text-[0.75rem]">Allocated</TableHead>
                        <TableHead className="text-[0.75rem]">Utilization</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {roomUtilization.map((r) => (
                        <TableRow key={r.room}>
                          <TableCell className="text-[0.8rem]">Room {r.room}</TableCell>
                          <TableCell className="text-[0.8rem]">{r.building}</TableCell>
                          <TableCell className="text-[0.8rem] font-mono">{r.capacity}</TableCell>
                          <TableCell className="text-[0.8rem] font-mono">{r.allocated}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-20 bg-accent rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full ${r.utilization > 90 ? 'bg-red-500' : r.utilization > 70 ? 'bg-amber-500' : 'bg-green-500'}`}
                                  style={{ width: `${Math.min(r.utilization, 100)}%` }}
                                />
                              </div>
                              <span className="text-[0.75rem] font-mono">{r.utilization}%</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Faculty Duties */}
        <TabsContent value="faculty">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-[0.9rem] flex items-center gap-2">
                <UserCheck className="w-4 h-4" /> Faculty Duty Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-[0.75rem]">Faculty</TableHead>
                      <TableHead className="text-[0.75rem]">Department</TableHead>
                      <TableHead className="text-[0.75rem]">Designation</TableHead>
                      <TableHead className="text-[0.75rem]">Total Duties</TableHead>
                      <TableHead className="text-[0.75rem]">Chief</TableHead>
                      <TableHead className="text-[0.75rem]">Assistant</TableHead>
                      <TableHead className="text-[0.75rem]">Replacements</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {facultyDutySummary.slice(0, 20).map((f) => (
                      <TableRow key={f.name}>
                        <TableCell className="text-[0.8rem]">{f.name}</TableCell>
                        <TableCell className="text-[0.8rem]">{f.department}</TableCell>
                        <TableCell className="text-[0.8rem]">{f.designation}</TableCell>
                        <TableCell className="text-[0.8rem] font-mono">{f.totalDuties}</TableCell>
                        <TableCell className="text-[0.8rem] font-mono">{f.chiefDuties}</TableCell>
                        <TableCell className="text-[0.8rem] font-mono">{f.assistantDuties}</TableCell>
                        <TableCell className="text-[0.8rem] font-mono">{f.replacementsRequested}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Attendance */}
        <TabsContent value="attendance">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-[0.9rem] flex items-center gap-2">
                <ClipboardList className="w-4 h-4" /> Attendance Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              {attendanceSummary.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={attendanceSummary}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="exam" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="present" fill="#22c55e" name="Present" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="absent" fill="#ef4444" name="Absent" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                  <div className="mt-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-[0.75rem]">Exam</TableHead>
                          <TableHead className="text-[0.75rem]">Date</TableHead>
                          <TableHead className="text-[0.75rem]">Total</TableHead>
                          <TableHead className="text-[0.75rem]">Present</TableHead>
                          <TableHead className="text-[0.75rem]">Absent</TableHead>
                          <TableHead className="text-[0.75rem]">Rate</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {attendanceSummary.map((a) => (
                          <TableRow key={a.exam}>
                            <TableCell className="text-[0.8rem]">{a.exam}</TableCell>
                            <TableCell className="text-[0.8rem]">{a.date}</TableCell>
                            <TableCell className="text-[0.8rem] font-mono">{a.total}</TableCell>
                            <TableCell className="text-[0.8rem] font-mono text-green-600">{a.present}</TableCell>
                            <TableCell className="text-[0.8rem] font-mono text-red-600">{a.absent}</TableCell>
                            <TableCell>
                              <Badge className={`text-[0.7rem] ${a.rate > 75 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                {a.rate}%
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </>
              ) : (
                <p className="text-center text-muted-foreground text-[0.85rem] py-12">
                  No attendance data available. Mark attendance to see reports.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Distribution Charts */}
        <TabsContent value="distribution">
          <div className="grid lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-[0.9rem]">Students by Branch</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={branchStudentCount}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={90}
                      paddingAngle={3}
                      dataKey="count"
                      nameKey="branch"
                      label={({ branch, count }) => `${branch}: ${count}`}
                    >
                      {branchStudentCount.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-[0.9rem]">Invigilation by Department</CardTitle>
              </CardHeader>
              <CardContent>
                {deptAllocation.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={deptAllocation}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={90}
                        paddingAngle={3}
                        dataKey="value"
                        nameKey="name"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {deptAllocation.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-center text-muted-foreground text-[0.85rem] py-12">
                    No invigilation data yet.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}