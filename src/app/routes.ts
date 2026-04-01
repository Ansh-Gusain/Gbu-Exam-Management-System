import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Dashboard } from "./components/Dashboard";
import { StudentManagement } from "./components/StudentManagement";
import { FacultyManagement } from "./components/FacultyManagement";
import { RoomManagement } from "./components/RoomManagement";
import { ExamManagement } from "./components/ExamManagement";
import { SeatingAllocation } from "./components/SeatingAllocation";
import { InvigilatorAllocation } from "./components/InvigilatorAllocation";
import { AttendanceManagement } from "./components/AttendanceManagement";
import { ReplacementManagement } from "./components/ReplacementManagement";
import { Reports } from "./components/Reports";
import { AcademicStructure } from "./components/AcademicStructure";
import { NotFound } from "./components/NotFound";
import { LoginAdmin } from "./components/LoginAdmin";
import { LoginFaculty } from "./components/LoginFaculty";
import { LoginStudent } from "./components/LoginStudent";
import { FacultyLayout } from "./components/FacultyLayout";
import { FacultyDashboard } from "./components/FacultyDashboard";
import { FacultyDuties } from "./components/FacultyDuties";
import { FacultyAttendance } from "./components/FacultyAttendance";
import { FacultyReplacements } from "./components/FacultyReplacements";
import { StudentLayout } from "./components/StudentLayout";
import { StudentDashboard } from "./components/StudentDashboard";
import { StudentExams } from "./components/StudentExams";
import { StudentSeating } from "./components/StudentSeating";
import { StudentAttendance } from "./components/StudentAttendance";

export const router = createBrowserRouter([
  {
    path: "/login/admin",
    Component: LoginAdmin,
  },
  {
    path: "/login/faculty",
    Component: LoginFaculty,
  },
  {
    path: "/login/student",
    Component: LoginStudent,
  },
  // Admin portal
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "academic", Component: AcademicStructure },
      { path: "students", Component: StudentManagement },
      { path: "faculty-management", Component: FacultyManagement },
      { path: "rooms", Component: RoomManagement },
      { path: "exams", Component: ExamManagement },
      { path: "seating", Component: SeatingAllocation },
      { path: "invigilation", Component: InvigilatorAllocation },
      { path: "attendance", Component: AttendanceManagement },
      { path: "replacements", Component: ReplacementManagement },
      { path: "reports", Component: Reports },
      { path: "*", Component: NotFound },
    ],
  },
  // Faculty portal
  {
    path: "/faculty",
    Component: FacultyLayout,
    children: [
      { index: true, Component: FacultyDashboard },
      { path: "duties", Component: FacultyDuties },
      { path: "attendance", Component: FacultyAttendance },
      { path: "replacements", Component: FacultyReplacements },
      { path: "*", Component: NotFound },
    ],
  },
  // Student portal
  {
    path: "/student",
    Component: StudentLayout,
    children: [
      { index: true, Component: StudentDashboard },
      { path: "exams", Component: StudentExams },
      { path: "seating", Component: StudentSeating },
      { path: "attendance", Component: StudentAttendance },
      { path: "*", Component: NotFound },
    ],
  },
]);