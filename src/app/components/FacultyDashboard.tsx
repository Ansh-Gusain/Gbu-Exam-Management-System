import { useMemo } from "react";
import { useStore } from "../lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  CalendarDays, ClipboardList, RefreshCw, CheckCircle2,
  Clock, AlertCircle, MapPin, BookOpen, Award
} from "lucide-react";

export function FacultyDashboard() {
  const {
    loggedInFacultyId, faculty, exams, rooms,
    invigilationAllocations, replacementLogs, attendanceRecords, seatingAllocations
  } = useStore();

  const currentFaculty = faculty.find((f) => f.id === loggedInFacultyId);

  const myDuties = useMemo(() => {
    return invigilationAllocations.filter((ia) => ia.facultyId === loggedInFacultyId);
  }, [invigilationAllocations, loggedInFacultyId]);

  const upcomingDuties = useMemo(() => {
    return myDuties
      .map((duty) => {
        const exam = exams.find((e) => e.id === duty.examId);
        const room = rooms.find((r) => r.id === duty.roomId);
        return { ...duty, exam, room };
      })
      .filter((d) => d.exam && d.exam.status === "scheduled")
      .sort((a, b) => (a.exam!.date).localeCompare(b.exam!.date));
  }, [myDuties, exams, rooms]);

  const completedDuties = useMemo(() => {
    return myDuties
      .map((duty) => {
        const exam = exams.find((e) => e.id === duty.examId);
        const room = rooms.find((r) => r.id === duty.roomId);
        return { ...duty, exam, room };
      })
      .filter((d) => d.exam && d.exam.status === "completed");
  }, [myDuties, exams, rooms]);

  const myReplacements = useMemo(() => {
    return replacementLogs.filter((r) => r.originalFacultyId === loggedInFacultyId);
  }, [replacementLogs, loggedInFacultyId]);

  const pendingReplacements = myReplacements.filter((r) => r.status === "pending").length;
  const approvedReplacements = myReplacements.filter((r) => r.status === "approved").length;

  const stats = [
    {
      label: "Total Duties",
      value: currentFaculty?.totalDuties || myDuties.length,
      icon: CalendarDays,
      color: "text-blue-600 bg-blue-50",
    },
    {
      label: "Upcoming",
      value: upcomingDuties.length,
      icon: Clock,
      color: "text-amber-600 bg-amber-50",
    },
    {
      label: "Completed",
      value: completedDuties.length,
      icon: CheckCircle2,
      color: "text-green-600 bg-green-50",
    },
    {
      label: "Pending Requests",
      value: pendingReplacements,
      icon: RefreshCw,
      color: "text-orange-600 bg-orange-50",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <div>
        <h1 className="text-[1.5rem]">
          Welcome, {currentFaculty?.name || "Faculty"}
        </h1>
        <p className="text-muted-foreground text-[0.85rem] mt-1">
          {currentFaculty?.department} &bull; {currentFaculty?.designation} &bull; {currentFaculty?.employeeId}
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
        {/* Upcoming Duties */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-[0.9rem] flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-green-600" />
              Upcoming Invigilation Duties
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingDuties.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-[0.85rem] text-muted-foreground">
                    No upcoming duties assigned
                  </p>
                  <p className="text-[0.75rem] text-muted-foreground/70 mt-1">
                    Duties will appear here once the admin allocates invigilators
                  </p>
                </div>
              ) : (
                upcomingDuties.map((duty) => (
                  <div
                    key={duty.id}
                    className="flex items-start gap-3 p-3 bg-accent/50 rounded-lg border border-border/50"
                  >
                    <div className="w-10 h-10 rounded-lg bg-green-50 text-green-700 flex items-center justify-center shrink-0 mt-0.5">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[0.85rem] font-medium">{duty.exam!.subject}</p>
                      <p className="text-[0.7rem] text-muted-foreground">
                        {duty.exam!.name}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="outline" className="text-[0.65rem]">
                          <Clock className="w-3 h-3 mr-1" />
                          {new Date(duty.exam!.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          {" "}{duty.exam!.startTime} - {duty.exam!.endTime}
                        </Badge>
                        <Badge variant="outline" className="text-[0.65rem]">
                          <MapPin className="w-3 h-3 mr-1" />
                          Room {duty.room?.roomNumber} &bull; {duty.room?.building}
                        </Badge>
                        <Badge
                          className={`text-[0.65rem] ${
                            duty.role === "chief"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          <Award className="w-3 h-3 mr-1" />
                          {duty.role === "chief" ? "Chief Invigilator" : "Assistant"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Replacement Requests */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-[0.9rem] flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-orange-600" />
              My Replacement Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {myReplacements.length === 0 ? (
                <div className="text-center py-8">
                  <RefreshCw className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-[0.85rem] text-muted-foreground">
                    No replacement requests
                  </p>
                  <p className="text-[0.75rem] text-muted-foreground/70 mt-1">
                    You can request replacements from the Replacements page
                  </p>
                </div>
              ) : (
                myReplacements.map((rep) => {
                  const exam = exams.find((e) => e.id === rep.examId);
                  const room = rooms.find((r) => r.id === rep.roomId);
                  const replacementFac = faculty.find((f) => f.id === rep.replacementFacultyId);
                  return (
                    <div
                      key={rep.id}
                      className="flex items-start gap-3 p-3 bg-accent/50 rounded-lg border border-border/50"
                    >
                      <div className="shrink-0 mt-0.5">
                        {rep.status === "approved" ? (
                          <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center">
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                          </div>
                        ) : rep.status === "pending" ? (
                          <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center">
                            <Clock className="w-4 h-4 text-amber-600" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center">
                            <AlertCircle className="w-4 h-4 text-red-600" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-[0.85rem] font-medium truncate">
                            {exam?.subject || "Exam"}
                          </p>
                          <Badge
                            variant={
                              rep.status === "approved" ? "default" :
                              rep.status === "pending" ? "secondary" : "destructive"
                            }
                            className="text-[0.6rem] shrink-0"
                          >
                            {rep.status}
                          </Badge>
                        </div>
                        <p className="text-[0.7rem] text-muted-foreground mt-0.5">
                          Room {room?.roomNumber} &bull; Reason: {rep.reason}
                        </p>
                        {replacementFac && (
                          <p className="text-[0.7rem] text-muted-foreground">
                            Replacement: {replacementFac.name}
                          </p>
                        )}
                        <p className="text-[0.65rem] text-muted-foreground/70 mt-1">
                          Requested: {new Date(rep.requestedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Completed Duties */}
      {completedDuties.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-[0.9rem] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              Completed Duties
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {completedDuties.map((duty) => (
                <div
                  key={duty.id}
                  className="flex items-center justify-between p-3 bg-accent/30 rounded-lg"
                >
                  <div>
                    <p className="text-[0.85rem]">{duty.exam!.subject}</p>
                    <p className="text-[0.7rem] text-muted-foreground">
                      Room {duty.room?.roomNumber} &bull; {duty.role === "chief" ? "Chief Invigilator" : "Assistant"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[0.75rem]">{new Date(duty.exam!.date).toLocaleDateString()}</p>
                    <Badge variant="outline" className="text-[0.6rem] text-green-600 border-green-200">
                      Completed
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
