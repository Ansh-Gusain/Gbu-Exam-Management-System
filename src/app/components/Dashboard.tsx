import { useStore } from "../lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Users, DoorOpen, FileText, UserCheck, Grid3X3,
  ClipboardList, RefreshCw, AlertCircle, CheckCircle2,
  Clock, TrendingUp
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";

const COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6"];

export function Dashboard() {
  const {
    students, rooms, exams, faculty,
    seatingAllocations, invigilationAllocations,
    replacementLogs
  } = useStore();

  const scheduledExams = exams.filter((e) => e.status === "scheduled").length;
  const completedExams = exams.filter((e) => e.status === "completed").length;
  const pendingReplacements = replacementLogs.filter((r) => r.status === "pending").length;
  const totalCapacity = rooms.reduce((sum, r) => sum + r.capacity, 0);
  const availableFaculty = faculty.filter((f) => f.isAvailable).length;

  const stats = [
    { label: "Total Students", value: students.length, icon: Users, color: "text-blue-600 bg-blue-50" },
    { label: "Rooms", value: rooms.length, icon: DoorOpen, color: "text-green-600 bg-green-50" },
    { label: "Upcoming Exams", value: scheduledExams, icon: FileText, color: "text-amber-600 bg-amber-50" },
    { label: "Faculty Available", value: availableFaculty, icon: UserCheck, color: "text-purple-600 bg-purple-50" },
    { label: "Seats Allocated", value: seatingAllocations.length, icon: Grid3X3, color: "text-indigo-600 bg-indigo-50" },
    { label: "Total Capacity", value: totalCapacity, icon: TrendingUp, color: "text-teal-600 bg-teal-50" },
  ];

  const branchData = ["SOICT", "SOE", "SOVSAS", "SOM", "SOBT", "SOLJG", "SOHSS"]
    .map((school) => ({
      branch: school,
      students: students.filter((s) => s.school === school).length,
    }))
    .filter((d) => d.students > 0);

  const examStatusData = [
    { name: "Scheduled", value: scheduledExams },
    { name: "Completed", value: completedExams },
    { name: "Ongoing", value: exams.filter((e) => e.status === "ongoing").length },
  ].filter((d) => d.value > 0);

  const upcomingExams = exams
    .filter((e) => e.status === "scheduled")
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 5);

  const recentReplacements = replacementLogs.slice(0, 3);

  return (
    <div className="space-y-6">
      <div>
        <h1>Dashboard</h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {stats.map((stat) => (
          <Card key={stat.label} className="py-3">
            <CardContent className="px-4 py-0">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-4 h-4" />
                </div>
              </div>
              <p className="text-[1.25rem]">{stat.value.toLocaleString()}</p>
              <p className="text-[0.7rem] text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Branch Distribution Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-[0.9rem]">Students by School</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={branchData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="branch" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="students" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Exam Status Pie */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-[0.9rem]">Exam Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={examStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={5}
                    dataKey="value"
                    nameKey="name"
                    isAnimationActive={false}
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {examStatusData.map((entry, i) => (
                      <Cell key={`pie-cell-${entry.name}`} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upcoming Exams */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-[0.9rem] flex items-center gap-2">
              <Clock className="w-4 h-4" /> Upcoming Exams
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingExams.length === 0 ? (
                <p className="text-[0.8rem] text-muted-foreground py-4 text-center">
                  No upcoming exams
                </p>
              ) : (
                upcomingExams.map((exam) => (
                  <div
                    key={exam.id}
                    className="flex items-center justify-between p-3 bg-accent/50 rounded-lg"
                  >
                    <div>
                      <p className="text-[0.8rem]">{exam.subject}</p>
                      <p className="text-[0.7rem] text-muted-foreground">
                        {exam.name} &bull; Sem {exam.semester}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[0.75rem]">{new Date(exam.date).toLocaleDateString()}</p>
                      <p className="text-[0.7rem] text-muted-foreground">
                        {exam.startTime} - {exam.endTime}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Alerts & Replacements */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-[0.9rem] flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> Alerts & Replacements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingReplacements > 0 && (
                <div className="flex items-center gap-3 p-3 bg-amber-50 text-amber-800 rounded-lg">
                  <RefreshCw className="w-4 h-4 shrink-0" />
                  <p className="text-[0.8rem]">
                    {pendingReplacements} pending replacement request(s)
                  </p>
                </div>
              )}
              {recentReplacements.map((rep) => {
                const origFaculty = faculty.find((f) => f.id === rep.originalFacultyId);
                return (
                  <div key={rep.id} className="flex items-center gap-3 p-3 bg-accent/50 rounded-lg">
                    <div className="shrink-0">
                      {rep.status === "approved" ? (
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      ) : rep.status === "pending" ? (
                        <Clock className="w-4 h-4 text-amber-600" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[0.8rem] truncate">
                        {origFaculty?.name} — {rep.reason}
                      </p>
                      <Badge
                        variant={rep.status === "approved" ? "default" : rep.status === "pending" ? "secondary" : "destructive"}
                        className="text-[0.65rem] mt-1"
                      >
                        {rep.status}
                      </Badge>
                    </div>
                  </div>
                );
              })}
              {recentReplacements.length === 0 && pendingReplacements === 0 && (
                <p className="text-[0.8rem] text-muted-foreground py-4 text-center">
                  No alerts at this time
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}