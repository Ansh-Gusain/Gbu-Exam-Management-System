import { useMemo } from "react";
import { useStore } from "../lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "./ui/table";
import { FileText, Clock, CheckCircle2, Play } from "lucide-react";

export function StudentExams() {
  const { loggedInStudentId, students, exams } = useStore();
  const currentStudent = students.find((s) => s.id === loggedInStudentId);

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

  const scheduled = myExams.filter((e) => e.status === "scheduled");
  const completed = myExams.filter((e) => e.status === "completed");
  const ongoing = myExams.filter((e) => e.status === "ongoing");

  return (
    <div className="space-y-6">
      <div>
        <h1>Exam Schedule</h1>
        <p className="text-muted-foreground text-[0.85rem] mt-1">
          View your exam schedule for {currentStudent?.branch} — Semester {currentStudent?.semester}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Card className="py-3">
          <CardContent className="px-4 py-0">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-amber-600" />
              <p className="text-[0.75rem] text-muted-foreground">Scheduled</p>
            </div>
            <p className="text-[1.25rem] font-semibold">{scheduled.length}</p>
          </CardContent>
        </Card>
        <Card className="py-3">
          <CardContent className="px-4 py-0">
            <div className="flex items-center gap-2 mb-1">
              <Play className="w-4 h-4 text-blue-600" />
              <p className="text-[0.75rem] text-muted-foreground">Ongoing</p>
            </div>
            <p className="text-[1.25rem] font-semibold">{ongoing.length}</p>
          </CardContent>
        </Card>
        <Card className="py-3">
          <CardContent className="px-4 py-0">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <p className="text-[0.75rem] text-muted-foreground">Completed</p>
            </div>
            <p className="text-[1.25rem] font-semibold">{completed.length}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-[0.9rem]">All Exams</CardTitle>
        </CardHeader>
        <CardContent>
          {myExams.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground">No exams found for your branch and semester</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-[0.75rem]">Exam</TableHead>
                    <TableHead className="text-[0.75rem]">Subject</TableHead>
                    <TableHead className="text-[0.75rem]">Date</TableHead>
                    <TableHead className="text-[0.75rem]">Time</TableHead>
                    <TableHead className="text-[0.75rem]">Branches</TableHead>
                    <TableHead className="text-[0.75rem]">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myExams.map((exam) => (
                    <TableRow key={exam.id}>
                      <TableCell className="text-[0.8rem]">{exam.name}</TableCell>
                      <TableCell className="text-[0.8rem] font-medium">{exam.subject}</TableCell>
                      <TableCell className="text-[0.8rem]">
                        {new Date(exam.date).toLocaleDateString("en-US", {
                          weekday: "short", month: "short", day: "numeric", year: "numeric"
                        })}
                      </TableCell>
                      <TableCell className="text-[0.8rem]">
                        {exam.startTime} - {exam.endTime}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1 flex-wrap">
                          {exam.branches.map((b) => (
                            <Badge key={b} variant="outline" className="text-[0.6rem]">{b}</Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            exam.status === "completed" ? "default" :
                            exam.status === "ongoing" ? "secondary" : "outline"
                          }
                          className="text-[0.65rem]"
                        >
                          {exam.status}
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
