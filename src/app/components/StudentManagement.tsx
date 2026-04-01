import { useState, useMemo } from "react";
import { useStore } from "../lib/store";
import {
  SCHOOLS, SCHOOL_FULL_NAMES, DEPARTMENTS_BY_SCHOOL,
  BRANCHES_BY_DEPARTMENT, SECTIONS, YEARS, SEMESTERS, SESSIONS,
  getYearFromSemester, getSemestersForYear,
} from "../lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "./ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "./ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "./ui/select";
import { Search, Plus, Upload, Filter, X } from "lucide-react";

export function StudentManagement() {
  const { students, setStudents } = useStore();
  const [search, setSearch] = useState("");
  const [schoolFilter, setSchoolFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [branchFilter, setBranchFilter] = useState("all");
  const [semesterFilter, setSemesterFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");
  const [sectionFilter, setSectionFilter] = useState("all");
  const [sessionFilter, setSessionFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [page, setPage] = useState(0);
  const pageSize = 20;

  const defaultForm = {
    rollNumber: "",
    name: "",
    school: "SOICT",
    department: "CSE",
    branch: "BCS",
    semester: 3,
    year: "2nd",
    section: "A",
    session: "2024-2028",
  };
  const [formData, setFormData] = useState(defaultForm);

  // Cascading filter options
  const filterDepartments = useMemo(() => {
    if (schoolFilter === "all") {
      return [...new Set(students.map((s) => s.department))].sort();
    }
    return DEPARTMENTS_BY_SCHOOL[schoolFilter] || [];
  }, [schoolFilter, students]);

  const filterBranches = useMemo(() => {
    if (departmentFilter === "all") {
      if (schoolFilter === "all") {
        return [...new Set(students.map((s) => s.branch))].sort();
      }
      const depts = DEPARTMENTS_BY_SCHOOL[schoolFilter] || [];
      return depts.flatMap((d) => BRANCHES_BY_DEPARTMENT[d] || []);
    }
    return BRANCHES_BY_DEPARTMENT[departmentFilter] || [];
  }, [departmentFilter, schoolFilter, students]);

  // Cascading semester options from year filter
  const filterSemesters = useMemo(() => {
    if (yearFilter === "all") return SEMESTERS;
    return getSemestersForYear(yearFilter);
  }, [yearFilter]);

  // Reset dependent filters when parent changes
  const handleSchoolFilterChange = (v) => {
    setSchoolFilter(v);
    setDepartmentFilter("all");
    setBranchFilter("all");
    setPage(0);
  };

  const handleDepartmentFilterChange = (v) => {
    setDepartmentFilter(v);
    setBranchFilter("all");
    setPage(0);
  };

  const handleYearFilterChange = (v) => {
    setYearFilter(v);
    setSemesterFilter("all");
    setSectionFilter("all");
    setPage(0);
  };

  const handleSemesterFilterChange = (v) => {
    setSemesterFilter(v);
    setSectionFilter("all");
    setPage(0);
  };

  const clearAllFilters = () => {
    setSearch("");
    setSchoolFilter("all");
    setDepartmentFilter("all");
    setBranchFilter("all");
    setSemesterFilter("all");
    setYearFilter("all");
    setSectionFilter("all");
    setSessionFilter("all");
    setPage(0);
  };

  const hasActiveFilters = schoolFilter !== "all" || departmentFilter !== "all" ||
    branchFilter !== "all" || semesterFilter !== "all" || yearFilter !== "all" ||
    sectionFilter !== "all" || sessionFilter !== "all" || search !== "";

  const filtered = useMemo(() => {
    return students
      .filter((s) => {
        const matchSearch =
          s.name.toLowerCase().includes(search.toLowerCase()) ||
          s.rollNumber.toLowerCase().includes(search.toLowerCase());
        const matchSchool = schoolFilter === "all" || s.school === schoolFilter;
        const matchDept = departmentFilter === "all" || s.department === departmentFilter;
        const matchBranch = branchFilter === "all" || s.branch === branchFilter;
        const matchSem = semesterFilter === "all" || s.semester === Number(semesterFilter);
        const matchYear = yearFilter === "all" || s.year === yearFilter;
        const matchSection = sectionFilter === "all" || s.section === sectionFilter;
        const matchSession = sessionFilter === "all" || s.session === sessionFilter;
        return matchSearch && matchSchool && matchDept && matchBranch && matchSem && matchYear && matchSection && matchSession;
      })
      .sort((a, b) => {
        // Primary: Year (1st < 2nd < 3rd < 4th)
        const yearOrder = { "1st": 1, "2nd": 2, "3rd": 3, "4th": 4 };
        const yearDiff = (yearOrder[a.year] || 0) - (yearOrder[b.year] || 0);
        if (yearDiff !== 0) return yearDiff;
        // Secondary: Semester
        const semDiff = a.semester - b.semester;
        if (semDiff !== 0) return semDiff;
        // Tertiary: Section
        const secDiff = a.section.localeCompare(b.section);
        if (secDiff !== 0) return secDiff;
        // Quaternary: Roll number
        return a.rollNumber.localeCompare(b.rollNumber);
      });
  }, [students, search, schoolFilter, departmentFilter, branchFilter, semesterFilter, yearFilter, sectionFilter, sessionFilter]);

  const paged = filtered.slice(page * pageSize, (page + 1) * pageSize);
  const totalPages = Math.ceil(filtered.length / pageSize);

  // Form cascading handlers
  const handleFormSchoolChange = (v) => {
    const depts = DEPARTMENTS_BY_SCHOOL[v] || [];
    const firstDept = depts[0] || "";
    const branches = BRANCHES_BY_DEPARTMENT[firstDept] || [];
    const firstBranch = branches[0] || "";
    setFormData({ ...formData, school: v, department: firstDept, branch: firstBranch });
  };

  const handleFormDeptChange = (v) => {
    const branches = BRANCHES_BY_DEPARTMENT[v] || [];
    const firstBranch = branches[0] || "";
    setFormData({ ...formData, department: v, branch: firstBranch });
  };

  const handleFormYearChange = (v) => {
    const sems = getSemestersForYear(v);
    setFormData({ ...formData, year: v, semester: sems[0] });
  };

  const handleFormSemesterChange = (v) => {
    const sem = Number(v);
    setFormData({ ...formData, semester: sem, year: getYearFromSemester(sem) });
  };

  const handleAdd = () => {
    if (!formData.rollNumber || !formData.name) return;
    const newStudent = {
      id: `s-${Date.now()}`,
      rollNumber: formData.rollNumber,
      name: formData.name,
      school: formData.school,
      department: formData.department,
      branch: formData.branch,
      semester: formData.semester,
      year: formData.year,
      section: formData.section,
      session: formData.session,
    };
    setStudents((prev) => [...prev, newStudent]);
    setDialogOpen(false);
    setFormData(defaultForm);
  };

  const handleBulkUpload = () => {
    const newStudents = [];
    const configs = [
      { school: "SOICT", department: "CSE", branch: "BCS" },
      { school: "SOICT", department: "CSE", branch: "CSE-AI" },
      { school: "SOICT", department: "ECE", branch: "B.Tech ECE" },
      { school: "SOE", department: "Mechanical", branch: "B.Tech ME" },
      { school: "SOVSAS", department: "PH", branch: "B.Sc Physics" },
    ];
    for (let i = 0; i < 50; i++) {
      const id = Date.now() + i;
      const config = configs[i % configs.length];
      const sem = ((i % 8) + 1);
      newStudents.push({
        id: `s-${id}`,
        rollNumber: `NEW${String(students.length + i + 1).padStart(4, "0")}`,
        name: `Student ${students.length + i + 1}`,
        school: config.school,
        department: config.department,
        branch: config.branch,
        semester: sem,
        year: getYearFromSemester(sem),
        section: SECTIONS[i % SECTIONS.length],
        session: SESSIONS[i % SESSIONS.length],
      });
    }
    setStudents((prev) => [...prev, ...newStudents]);
  };

  // Get available departments and branches for the form
  const formDepartments = DEPARTMENTS_BY_SCHOOL[formData.school] || [];
  const formBranches = BRANCHES_BY_DEPARTMENT[formData.department] || [];
  const formSemesters = getSemestersForYear(formData.year);

  // Unique sessions from data
  const uniqueSessions = [...new Set(students.map((s) => s.session))].sort();

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1>Student Management</h1>
          <p className="text-[0.8rem] text-muted-foreground">{filtered.length} students found</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleBulkUpload}>
            <Upload className="w-4 h-4 mr-1" /> Bulk Upload
          </Button>
          <Button size="sm" onClick={() => setDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-1" /> Add Student
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="py-3 px-4">
          <div className="space-y-3">
            {/* Search bar */}
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or roll number..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(0); }}
                  className="pl-9 h-9 text-[0.85rem]"
                />
              </div>
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearAllFilters} className="h-9 text-[0.8rem]">
                  <X className="w-3 h-3 mr-1" /> Clear Filters
                </Button>
              )}
            </div>

            {/* Filter dropdowns - Row 1: School → Department → Branch */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <Select value={schoolFilter} onValueChange={handleSchoolFilterChange}>
                <SelectTrigger className="h-9 text-[0.8rem]">
                  <Filter className="w-3 h-3 mr-1 shrink-0" />
                  <SelectValue placeholder="School" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Schools</SelectItem>
                  {SCHOOLS.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={departmentFilter} onValueChange={handleDepartmentFilterChange}>
                <SelectTrigger className="h-9 text-[0.8rem]">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {filterDepartments.map((d) => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={branchFilter} onValueChange={(v) => { setBranchFilter(v); setPage(0); }}>
                <SelectTrigger className="h-9 text-[0.8rem]">
                  <SelectValue placeholder="Branch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Branches</SelectItem>
                  {filterBranches.map((b) => (
                    <SelectItem key={b} value={b}>{b}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Filter dropdowns - Row 2: Year → Semester → Section (cascading) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <Select value={yearFilter} onValueChange={handleYearFilterChange}>
                <SelectTrigger className="h-9 text-[0.8rem]">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  {YEARS.map((y) => (
                    <SelectItem key={y} value={y}>{y} Year</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={semesterFilter} onValueChange={handleSemesterFilterChange}>
                <SelectTrigger className="h-9 text-[0.8rem]">
                  <SelectValue placeholder="Semester" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Semesters</SelectItem>
                  {filterSemesters.map((s) => (
                    <SelectItem key={s} value={String(s)}>Semester {s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sectionFilter} onValueChange={(v) => { setSectionFilter(v); setPage(0); }}>
                <SelectTrigger className="h-9 text-[0.8rem]">
                  <SelectValue placeholder="Section" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sections</SelectItem>
                  {SECTIONS.map((s) => (
                    <SelectItem key={s} value={s}>Section {s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sessionFilter} onValueChange={(v) => { setSessionFilter(v); setPage(0); }}>
                <SelectTrigger className="h-9 text-[0.8rem]">
                  <SelectValue placeholder="Session" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sessions</SelectItem>
                  {SESSIONS.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[0.75rem]">Roll No.</TableHead>
                  <TableHead className="text-[0.75rem]">Name</TableHead>
                  <TableHead className="text-[0.75rem]">School</TableHead>
                  <TableHead className="text-[0.75rem]">Dept</TableHead>
                  <TableHead className="text-[0.75rem]">Branch</TableHead>
                  <TableHead className="text-[0.75rem]">Year</TableHead>
                  <TableHead className="text-[0.75rem]">Sem</TableHead>
                  <TableHead className="text-[0.75rem]">Sec</TableHead>
                  <TableHead className="text-[0.75rem]">Session</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paged.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center text-[0.8rem] text-muted-foreground py-8">
                      No students found matching the filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  paged.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="text-[0.78rem] font-mono">{student.rollNumber}</TableCell>
                      <TableCell className="text-[0.78rem]">{student.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[0.68rem]">{student.school}</Badge>
                      </TableCell>
                      <TableCell className="text-[0.78rem]">{student.department}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-[0.68rem]">{student.branch}</Badge>
                      </TableCell>
                      <TableCell className="text-[0.78rem]">{student.year}</TableCell>
                      <TableCell className="text-[0.78rem]">{student.semester}</TableCell>
                      <TableCell className="text-[0.78rem]">{student.section}</TableCell>
                      <TableCell className="text-[0.78rem]">{student.session}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-border">
            <p className="text-[0.75rem] text-muted-foreground">
              Showing {filtered.length === 0 ? 0 : page * pageSize + 1}–{Math.min((page + 1) * pageSize, filtered.length)} of {filtered.length}
            </p>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 0}
                onClick={() => setPage(page - 1)}
                className="text-[0.75rem] h-7"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages - 1}
                onClick={() => setPage(page + 1)}
                className="text-[0.75rem] h-7"
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Student Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Student</DialogTitle>
            <DialogDescription>
              Enter the student details below. School, Department, and Branch are cascading fields.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {/* Roll Number & Name */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-[0.8rem]">Roll Number</Label>
                <Input
                  value={formData.rollNumber}
                  onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                  placeholder="e.g., CS3001"
                  className="text-[0.85rem]"
                />
              </div>
              <div>
                <Label className="text-[0.8rem]">Full Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Student name"
                  className="text-[0.85rem]"
                />
              </div>
            </div>

            {/* School → Department → Branch (cascading) */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label className="text-[0.8rem]">School</Label>
                <Select value={formData.school} onValueChange={handleFormSchoolChange}>
                  <SelectTrigger className="text-[0.8rem]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {SCHOOLS.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-[0.8rem]">Department</Label>
                <Select value={formData.department} onValueChange={handleFormDeptChange}>
                  <SelectTrigger className="text-[0.8rem]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {formDepartments.map((d) => (
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-[0.8rem]">Branch</Label>
                <Select
                  value={formData.branch}
                  onValueChange={(v) => setFormData({ ...formData, branch: v })}
                >
                  <SelectTrigger className="text-[0.8rem]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {formBranches.map((b) => (
                      <SelectItem key={b} value={b}>{b}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Year → Semester (linked) */}
            <div className="grid grid-cols-4 gap-3">
              <div>
                <Label className="text-[0.8rem]">Year</Label>
                <Select value={formData.year} onValueChange={handleFormYearChange}>
                  <SelectTrigger className="text-[0.8rem]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {YEARS.map((y) => (
                      <SelectItem key={y} value={y}>{y}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-[0.8rem]">Semester</Label>
                <Select value={String(formData.semester)} onValueChange={handleFormSemesterChange}>
                  <SelectTrigger className="text-[0.8rem]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {formSemesters.map((s) => (
                      <SelectItem key={s} value={String(s)}>Sem {s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-[0.8rem]">Section</Label>
                <Select
                  value={formData.section}
                  onValueChange={(v) => setFormData({ ...formData, section: v })}
                >
                  <SelectTrigger className="text-[0.8rem]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {SECTIONS.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-[0.8rem]">Session</Label>
                <Select
                  value={formData.session}
                  onValueChange={(v) => setFormData({ ...formData, session: v })}
                >
                  <SelectTrigger className="text-[0.8rem]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {SESSIONS.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAdd}>Add Student</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}