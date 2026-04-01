import { useMemo } from "react";
import { useStore } from "../lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "./ui/table";
import {
  ClipboardList, CheckCircle2, AlertTriangle, Clock
} from "lucide-react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip
} from "recharts";

const COLORS = ["#22c55e", "#ef4444", "#94a3b8"];

export function StudentAttendance() {
  const {
    loggedInStudentId, students, exams, rooms, attendanceRecords
  } = useStore();

  const currentStudent = students.find((s) => s.id === loggedInStudentId);

  const myAttendance = useMemo(() => {
    if (!currentStudent) return [];
    return attendanceRecords
      .filter((ar) => ar.studentId === currentStudent.id)
      .map((ar) => {
        const exam = exams.find((e) => e.id === ar.examId);
        const room = rooms.find((r) => r.id === ar.roomId);
        return { ...ar, exam, room };
      })
      .sort((a, b) => (a.exam?.date || "").localeCompare(b.exam?.date || ""));
  }, [attendanceRecords, currentStudent, exams, rooms]);

  const presentCount = myAttendance.filter((a) => a.status === "present").length;
  const absentCount = myAttendance.filter((a) => a.status === "absent").length;
  const notMarkedCount = myAttendance.filter((a) => a.status === "not-marked").length;

  const pieData = [
    { name: "Present", value: presentCount },
    { name: "Absent", value: absentCount },
    { name: "Not Marked", value: notMarkedCount },
  ].filter((d) => d.value > 0);

  const attendanceRate = myAttendance.length > 0
    ? Math.round((presentCount / myAttendance.length) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1>My Attendance</h1>
        <p className="text-muted-foreground text-[0.85rem] mt-1">
          Track your exam attendance record
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="py-3">
          <CardContent className="px-4 py-0">
            <p className="text-[0.7rem] text-muted-foreground">Total Exams</p>
            <p className="text-[1.25rem] font-semibold">{myAttendance.length}</p>
          </CardContent>
        </Card>
        <Card className="py-3">
          <CardContent className="px-4 py-0">
            <p className="text-[0.7rem] text-green-600">Present</p>
            <p className="text-[1.25rem] font-semibold text-green-700">{presentCount}</p>
          </CardContent>
        </Card>
        <Card className="py-3">
          <CardContent className="px-4 py-0">
            <p className="text-[0.7rem] text-red-600">Absent</p>
            <p className="text-[1.25rem] font-semibold text-red-700">{absentCount}</p>
          </CardContent>
        </Card>
        <Card className="py-3">
          <CardContent className="px-4 py-0">
            <p className="text-[0.7rem] text-muted-foreground">Attendance Rate</p>
            <p className="text-[1.25rem] font-semibold">
              {myAttendance.length > 0 ? `${attendanceRate}%` : "—"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Pie chart */}
        {pieData.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-[0.9rem]">Attendance Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Summary per exam */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-[0.9rem]">Quick Summary</CardTitle>
          </CardHeader>
          <CardContent>
            {myAttendance.length === 0 ? (
              <div className="text-center py-8">
                <ClipboardList className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-muted-foreground text-[0.85rem]">No records yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {myAttendance.map((record) => (
                  <div
                    key={record.id}
                    className="flex items-center gap-3 p-2.5 bg-accent/30 rounded-lg"
                  >
                    {record.status === "present" ? (
                      <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                    ) : record.status === "absent" ? (
                      <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                    ) : (
                      <Clock className="w-4 h-4 text-muted-foreground shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-[0.8rem] font-medium truncate">
                        {record.exam?.subject || "—"}
                      </p>
                      <p className="text-[0.65rem] text-muted-foreground">
                        Room {record.room?.roomNumber}
                      </p>
                    </div>
                    <Badge
                      variant={
                        record.status === "present" ? "default" :
                        record.status === "absent" ? "destructive" : "secondary"
                      }
                      className="text-[0.6rem] shrink-0"
                    >
                      {record.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Full table */}
      {myAttendance.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-[0.9rem]">Detailed Records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-[0.75rem]">Exam</TableHead>
                    <TableHead className="text-[0.75rem]">Subject</TableHead>
                    <TableHead className="text-[0.75rem]">Date</TableHead>
                    <TableHead className="text-[0.75rem]">Room</TableHead>
                    <TableHead className="text-[0.75rem]">Status</TableHead>
                    <TableHead className="text-[0.75rem]">Signature</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myAttendance.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="text-[0.8rem]">{record.exam?.name || "—"}</TableCell>
                      <TableCell className="text-[0.8rem] font-medium">{record.exam?.subject || "—"}</TableCell>
                      <TableCell className="text-[0.8rem]">
                        {record.exam ? new Date(record.exam.date).toLocaleDateString() : "—"}
                      </TableCell>
                      <TableCell className="text-[0.8rem]">
                        Room {record.room?.roomNumber || "—"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            record.status === "present" ? "default" :
                            record.status === "absent" ? "destructive" : "secondary"
                          }
                          className="text-[0.65rem]"
                        >
                          {record.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-[0.8rem]">
                        {record.signature ? (
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
