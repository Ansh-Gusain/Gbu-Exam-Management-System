import { useMemo } from "react";
import { useStore } from "../lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  FileText, Grid3X3, ClipboardList, CheckCircle2,
  Clock, MapPin, BookOpen, Calendar, AlertTriangle
} from "lucide-react";

export function StudentDashboard() {
  const {
    loggedInStudentId, students, exams, rooms,
    seatingAllocations, attendanceRecords
  } = useStore();

  const currentStudent = students.find((s) => s.id === loggedInStudentId);

  // Exams relevant to this student (matching branch + semester)
  const myExams = useMemo(() => {
    if (!currentStudent) return [];
    return exams
      .filter(
        (e) =>
          e.branches.includes(currentStudent.branch) &&
          e.semester === currentStudent.semester
      )
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [exams, currentStudent]);

  const upcomingExams = myExams.filter((e) => e.status === "scheduled");
  const completedExams = myExams.filter((e) => e.status === "completed");

  // Seating allocations for this student
  const mySeats = useMemo(() => {
    if (!currentStudent) return [];
    return seatingAllocations
      .filter((sa) => sa.studentId === currentStudent.id)
      .map((sa) => {
        const exam = exams.find((e) => e.id === sa.examId);
        const room = rooms.find((r) => r.id === sa.roomId);
        return { ...sa, exam, room };
      });
  }, [seatingAllocations, currentStudent, exams, rooms]);

  // Attendance for this student
  const myAttendance = useMemo(() => {
    if (!currentStudent) return [];
    return attendanceRecords
      .filter((ar) => ar.studentId === currentStudent.id)
      .map((ar) => {
        const exam = exams.find((e) => e.id === ar.examId);
        const room = rooms.find((r) => r.id === ar.roomId);
        return { ...ar, exam, room };
      });
  }, [attendanceRecords, currentStudent, exams, rooms]);

  const presentCount = myAttendance.filter((a) => a.status === "present").length;
  const absentCount = myAttendance.filter((a) => a.status === "absent").length;
  const attendanceRate = myAttendance.length > 0
    ? Math.round((presentCount / myAttendance.length) * 100)
    : 0;

  const stats = [
    {
      label: "Upcoming Exams",
      value: upcomingExams.length,
      icon: FileText,
      color: "text-blue-600 bg-blue-50",
    },
    {
      label: "Seats Allocated",
      value: mySeats.length,
      icon: Grid3X3,
      color: "text-blue-600 bg-blue-50",
    },
    {
      label: "Exams Attended",
      value: presentCount,
      icon: ClipboardList,
      color: "text-green-600 bg-green-50",
    },
    {
      label: "Attendance Rate",
      value: myAttendance.length > 0 ? `${attendanceRate}%` : "—",
      icon: CheckCircle2,
      color: "text-teal-600 bg-teal-50",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-[1.5rem]">
          Welcome, {currentStudent?.name || "Student"}
        </h1>
        <p className="text-muted-foreground text-[0.85rem] mt-1">
          {currentStudent?.rollNumber} &bull; {currentStudent?.branch} &bull; Semester {currentStudent?.semester} &bull; Section {currentStudent?.section}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((stat) => (
          <Card key={stat.label} className="py-3">
            <CardContent className="px-4 py-0">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-4 h-4" />
                </div>
              </div>
              <p className="text-[1.25rem] font-semibold">{stat.value}</p>
              <p className="text-[0.7rem] text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upcoming Exams */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-[0.9rem] flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              Upcoming Exam Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingExams.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-[0.85rem] text-muted-foreground">
                    No upcoming exams
                  </p>
                </div>
              ) : (
                upcomingExams.map((exam) => {
                  const seat = mySeats.find((s) => s.examId === exam.id);
                  return (
                    <div
                      key={exam.id}
                      className="p-3 bg-accent/50 rounded-lg border border-border/50"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-[0.85rem] font-medium">{exam.subject}</p>
                          <p className="text-[0.7rem] text-muted-foreground">
                            {exam.name}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-[0.65rem] shrink-0">
                          {exam.branches.join(", ")}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="outline" className="text-[0.65rem]">
                          <Clock className="w-3 h-3 mr-1" />
                          {new Date(exam.date).toLocaleDateString("en-US", {
                            weekday: "short", month: "short", day: "numeric"
                          })}
                        </Badge>
                        <Badge variant="outline" className="text-[0.65rem]">
                          {exam.startTime} - {exam.endTime}
                        </Badge>
                        {seat ? (
                          <Badge className="text-[0.65rem] bg-blue-100 text-blue-700">
                            <MapPin className="w-3 h-3 mr-1" />
                            Room {seat.room?.roomNumber} &bull; Seat {seat.seatNumber}
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-[0.65rem]">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Seat not yet allocated
                          </Badge>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>

        {/* Seat Allocations */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-[0.9rem] flex items-center gap-2">
              <Grid3X3 className="w-4 h-4 text-blue-600" />
              My Seat Allocations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mySeats.length === 0 ? (
                <div className="text-center py-8">
                  <Grid3X3 className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-[0.85rem] text-muted-foreground">
                    No seats allocated yet
                  </p>
                  <p className="text-[0.75rem] text-muted-foreground/70 mt-1">
                    Seats will appear here after the admin runs seating allocation
                  </p>
                </div>
              ) : (
                mySeats.map((seat) => (
                  <div
                    key={seat.id}
                    className="flex items-center gap-3 p-3 bg-accent/50 rounded-lg border border-border/50"
                  >
                    <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                      <div className="text-center">
                        <p className="text-[0.6rem] uppercase">Seat</p>
                        <p className="text-[1rem] font-bold leading-none">{seat.seatNumber}</p>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[0.85rem] font-medium">{seat.exam?.subject || "—"}</p>
                      <p className="text-[0.7rem] text-muted-foreground">
                        {seat.exam?.name}
                      </p>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="outline" className="text-[0.6rem]">
                          <MapPin className="w-3 h-3 mr-1" />
                          Room {seat.room?.roomNumber} &bull; {seat.room?.building}
                        </Badge>
                        <Badge variant="outline" className="text-[0.6rem]">
                          {seat.exam ? new Date(seat.exam.date).toLocaleDateString("en-US", {
                            month: "short", day: "numeric"
                          }) : "—"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Record */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-[0.9rem] flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-green-600" />
            Attendance Record
          </CardTitle>
        </CardHeader>
        <CardContent>
          {myAttendance.length === 0 ? (
            <div className="text-center py-8">
              <ClipboardList className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-[0.85rem] text-muted-foreground">
                No attendance records yet
              </p>
              <p className="text-[0.75rem] text-muted-foreground/70 mt-1">
                Attendance will appear here after exams are conducted
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {myAttendance.map((record) => (
                <div
                  key={record.id}
                  className="flex items-center justify-between p-3 bg-accent/30 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="shrink-0">
                      {record.status === "present" ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      ) : record.status === "absent" ? (
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                      ) : (
                        <Clock className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <p className="text-[0.85rem] font-medium">{record.exam?.subject || "—"}</p>
                      <p className="text-[0.7rem] text-muted-foreground">
                        {record.exam?.name} &bull; Room {record.room?.roomNumber}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant={
                        record.status === "present" ? "default" :
                        record.status === "absent" ? "destructive" : "secondary"
                      }
                      className="text-[0.65rem]"
                    >
                      {record.status}
                    </Badge>
                    <p className="text-[0.65rem] text-muted-foreground mt-1">
                      {record.exam ? new Date(record.exam.date).toLocaleDateString() : "—"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}