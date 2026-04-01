import { useMemo } from "react";
import { useStore } from "../lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "./ui/table";
import { CalendarDays, MapPin, Award, Clock, CheckCircle2 } from "lucide-react";

export function FacultyDuties() {
  const {
    loggedInFacultyId, faculty, exams, rooms,
    invigilationAllocations
  } = useStore();

  const currentFaculty = faculty.find((f) => f.id === loggedInFacultyId);

  const allDuties = useMemo(() => {
    return invigilationAllocations
      .filter((ia) => ia.facultyId === loggedInFacultyId)
      .map((duty) => {
        const exam = exams.find((e) => e.id === duty.examId);
        const room = rooms.find((r) => r.id === duty.roomId);
        return { ...duty, exam, room };
      })
      .sort((a, b) => {
        if (!a.exam || !b.exam) return 0;
        return a.exam.date.localeCompare(b.exam.date);
      });
  }, [invigilationAllocations, loggedInFacultyId, exams, rooms]);

  const upcomingDuties = allDuties.filter((d) => d.exam?.status === "scheduled");
  const completedDuties = allDuties.filter((d) => d.exam?.status === "completed");
  const ongoingDuties = allDuties.filter((d) => d.exam?.status === "ongoing");

  return (
    <div className="space-y-6">
      <div>
        <h1>My Invigilation Duties</h1>
        <p className="text-muted-foreground text-[0.85rem] mt-1">
          {currentFaculty?.name} &bull; Total assignments: {allDuties.length}
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="py-3">
          <CardContent className="px-4 py-0">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-amber-600" />
              <p className="text-[0.75rem] text-muted-foreground">Upcoming</p>
            </div>
            <p className="text-[1.25rem] font-semibold">{upcomingDuties.length}</p>
          </CardContent>
        </Card>
        <Card className="py-3">
          <CardContent className="px-4 py-0">
            <div className="flex items-center gap-2 mb-1">
              <CalendarDays className="w-4 h-4 text-blue-600" />
              <p className="text-[0.75rem] text-muted-foreground">Ongoing</p>
            </div>
            <p className="text-[1.25rem] font-semibold">{ongoingDuties.length}</p>
          </CardContent>
        </Card>
        <Card className="py-3">
          <CardContent className="px-4 py-0">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <p className="text-[0.75rem] text-muted-foreground">Completed</p>
            </div>
            <p className="text-[1.25rem] font-semibold">{completedDuties.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Duties Table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-[0.9rem]">All Assigned Duties</CardTitle>
        </CardHeader>
        <CardContent>
          {allDuties.length === 0 ? (
            <div className="text-center py-12">
              <CalendarDays className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground">No duties assigned yet</p>
              <p className="text-[0.75rem] text-muted-foreground/70 mt-1">
                Duties will appear here once the admin runs invigilator allocation
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-[0.75rem]">Exam</TableHead>
                    <TableHead className="text-[0.75rem]">Subject</TableHead>
                    <TableHead className="text-[0.75rem]">Date & Time</TableHead>
                    <TableHead className="text-[0.75rem]">Room</TableHead>
                    <TableHead className="text-[0.75rem]">Role</TableHead>
                    <TableHead className="text-[0.75rem]">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allDuties.map((duty) => (
                    <TableRow key={duty.id}>
                      <TableCell className="text-[0.8rem]">
                        {duty.exam?.name || "—"}
                      </TableCell>
                      <TableCell className="text-[0.8rem] font-medium">
                        {duty.exam?.subject || "—"}
                      </TableCell>
                      <TableCell className="text-[0.8rem]">
                        <div>
                          {duty.exam ? new Date(duty.exam.date).toLocaleDateString("en-US", {
                            month: "short", day: "numeric", year: "numeric"
                          }) : "—"}
                        </div>
                        <div className="text-[0.7rem] text-muted-foreground">
                          {duty.exam?.startTime} - {duty.exam?.endTime}
                        </div>
                      </TableCell>
                      <TableCell className="text-[0.8rem]">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-muted-foreground" />
                          {duty.room?.roomNumber || "—"}
                        </div>
                        <div className="text-[0.7rem] text-muted-foreground">
                          {duty.room?.building}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`text-[0.65rem] ${
                            duty.role === "chief"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          <Award className="w-3 h-3 mr-1" />
                          {duty.role === "chief" ? "Chief" : "Assistant"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            duty.exam?.status === "completed" ? "default" :
                            duty.exam?.status === "ongoing" ? "secondary" : "outline"
                          }
                          className="text-[0.65rem]"
                        >
                          {duty.exam?.status || "unknown"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
