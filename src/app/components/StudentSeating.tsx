import { useMemo } from "react";
import { useStore } from "../lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "./ui/table";
import { Grid3X3, MapPin, Clock, BookOpen } from "lucide-react";

export function StudentSeating() {
  const {
    loggedInStudentId, students, exams, rooms, seatingAllocations
  } = useStore();

  const currentStudent = students.find((s) => s.id === loggedInStudentId);

  const mySeats = useMemo(() => {
    if (!currentStudent) return [];
    return seatingAllocations
      .filter((sa) => sa.studentId === currentStudent.id)
      .map((sa) => {
        const exam = exams.find((e) => e.id === sa.examId);
        const room = rooms.find((r) => r.id === sa.roomId);
        return { ...sa, exam, room };
      })
      .sort((a, b) => (a.exam?.date || "").localeCompare(b.exam?.date || ""));
  }, [seatingAllocations, currentStudent, exams, rooms]);

  return (
    <div className="space-y-6">
      <div>
        <h1>My Seat Allocations</h1>
        <p className="text-muted-foreground text-[0.85rem] mt-1">
          View your assigned seats for each exam
        </p>
      </div>

      {mySeats.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Grid3X3 className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground">No seat allocations found</p>
              <p className="text-[0.75rem] text-muted-foreground/70 mt-1">
                Seat assignments will appear here after the admin runs the seating allocation algorithm
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Visual seat cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mySeats.map((seat) => (
              <Card key={seat.id} className="relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-blue-50 rounded-bl-[2rem] flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-[0.55rem] text-blue-500 uppercase font-medium">Seat</p>
                    <p className="text-[1.1rem] font-bold text-blue-700 leading-none">{seat.seatNumber}</p>
                  </div>
                </div>
                <CardContent className="pt-4 pb-4">
                  <div className="pr-14">
                    <div className="flex items-center gap-2 mb-1">
                      <BookOpen className="w-4 h-4 text-blue-600 shrink-0" />
                      <p className="text-[0.9rem] font-medium truncate">{seat.exam?.subject || "—"}</p>
                    </div>
                    <p className="text-[0.7rem] text-muted-foreground ml-6">
                      {seat.exam?.name}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <Badge variant="outline" className="text-[0.6rem]">
                      <Clock className="w-3 h-3 mr-1" />
                      {seat.exam ? new Date(seat.exam.date).toLocaleDateString("en-US", {
                        weekday: "short", month: "short", day: "numeric"
                      }) : "—"}
                    </Badge>
                    <Badge variant="outline" className="text-[0.6rem]">
                      {seat.exam?.startTime} - {seat.exam?.endTime}
                    </Badge>
                    <Badge variant="outline" className="text-[0.6rem]">
                      <MapPin className="w-3 h-3 mr-1" />
                      Room {seat.room?.roomNumber}
                    </Badge>
                  </div>
                  <p className="text-[0.65rem] text-muted-foreground mt-2">
                    {seat.room?.building} &bull; Floor {seat.room?.floor}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Table view */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-[0.9rem]">Detailed View</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-[0.75rem]">Exam</TableHead>
                      <TableHead className="text-[0.75rem]">Subject</TableHead>
                      <TableHead className="text-[0.75rem]">Date & Time</TableHead>
                      <TableHead className="text-[0.75rem]">Room</TableHead>
                      <TableHead className="text-[0.75rem]">Building</TableHead>
                      <TableHead className="text-[0.75rem]">Seat No.</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mySeats.map((seat) => (
                      <TableRow key={seat.id}>
                        <TableCell className="text-[0.8rem]">{seat.exam?.name || "—"}</TableCell>
                        <TableCell className="text-[0.8rem] font-medium">{seat.exam?.subject || "—"}</TableCell>
                        <TableCell className="text-[0.8rem]">
                          <div>{seat.exam ? new Date(seat.exam.date).toLocaleDateString() : "—"}</div>
                          <div className="text-[0.7rem] text-muted-foreground">
                            {seat.exam?.startTime} - {seat.exam?.endTime}
                          </div>
                        </TableCell>
                        <TableCell className="text-[0.8rem]">{seat.room?.roomNumber || "—"}</TableCell>
                        <TableCell className="text-[0.8rem]">{seat.room?.building || "—"}</TableCell>
                        <TableCell>
                          <Badge className="bg-blue-100 text-blue-700 text-[0.75rem]">
                            #{seat.seatNumber}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}