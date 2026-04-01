import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useMemo } from "react";
import { useStore } from "../lib/store";
import {
  SCHOOLS,
  DEPARTMENTS_BY_SCHOOL,
  BRANCHES_BY_DEPARTMENT,
  SECTIONS,
  YEARS,
  SEMESTERS,
  SESSIONS,
  getYearFromSemester,
  getSemestersForYear
} from "../lib/data";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "./ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "./ui/select";
import { Search, Plus, Upload, Filter, X } from "lucide-react";
function StudentManagement() {
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
    session: "2024-2028"
  };
  const [formData, setFormData] = useState(defaultForm);
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
  const filterSemesters = useMemo(() => {
    if (yearFilter === "all") return SEMESTERS;
    return getSemestersForYear(yearFilter);
  }, [yearFilter]);
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
  const hasActiveFilters = schoolFilter !== "all" || departmentFilter !== "all" || branchFilter !== "all" || semesterFilter !== "all" || yearFilter !== "all" || sectionFilter !== "all" || sessionFilter !== "all" || search !== "";
  const filtered = useMemo(() => {
    return students.filter((s) => {
      const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.rollNumber.toLowerCase().includes(search.toLowerCase());
      const matchSchool = schoolFilter === "all" || s.school === schoolFilter;
      const matchDept = departmentFilter === "all" || s.department === departmentFilter;
      const matchBranch = branchFilter === "all" || s.branch === branchFilter;
      const matchSem = semesterFilter === "all" || s.semester === Number(semesterFilter);
      const matchYear = yearFilter === "all" || s.year === yearFilter;
      const matchSection = sectionFilter === "all" || s.section === sectionFilter;
      const matchSession = sessionFilter === "all" || s.session === sessionFilter;
      return matchSearch && matchSchool && matchDept && matchBranch && matchSem && matchYear && matchSection && matchSession;
    }).sort((a, b) => {
      const yearOrder = { "1st": 1, "2nd": 2, "3rd": 3, "4th": 4 };
      const yearDiff = (yearOrder[a.year] || 0) - (yearOrder[b.year] || 0);
      if (yearDiff !== 0) return yearDiff;
      const semDiff = a.semester - b.semester;
      if (semDiff !== 0) return semDiff;
      const secDiff = a.section.localeCompare(b.section);
      if (secDiff !== 0) return secDiff;
      return a.rollNumber.localeCompare(b.rollNumber);
    });
  }, [students, search, schoolFilter, departmentFilter, branchFilter, semesterFilter, yearFilter, sectionFilter, sessionFilter]);
  const paged = filtered.slice(page * pageSize, (page + 1) * pageSize);
  const totalPages = Math.ceil(filtered.length / pageSize);
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
      session: formData.session
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
      { school: "SOVSAS", department: "PH", branch: "B.Sc Physics" }
    ];
    for (let i = 0; i < 50; i++) {
      const id = Date.now() + i;
      const config = configs[i % configs.length];
      const sem = i % 8 + 1;
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
        session: SESSIONS[i % SESSIONS.length]
      });
    }
    setStudents((prev) => [...prev, ...newStudents]);
  };
  const formDepartments = DEPARTMENTS_BY_SCHOOL[formData.school] || [];
  const formBranches = BRANCHES_BY_DEPARTMENT[formData.department] || [];
  const formSemesters = getSemestersForYear(formData.year);
  const uniqueSessions = [...new Set(students.map((s) => s.session))].sort();
  return /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { children: "Student Management" }),
        /* @__PURE__ */ jsxs("p", { className: "text-[0.8rem] text-muted-foreground", children: [
          filtered.length,
          " students found"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxs(Button, { variant: "outline", size: "sm", onClick: handleBulkUpload, children: [
          /* @__PURE__ */ jsx(Upload, { className: "w-4 h-4 mr-1" }),
          " Bulk Upload"
        ] }),
        /* @__PURE__ */ jsxs(Button, { size: "sm", onClick: () => setDialogOpen(true), children: [
          /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4 mr-1" }),
          " Add Student"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, { className: "py-3 px-4", children: /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "relative flex-1", children: [
          /* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              placeholder: "Search by name or roll number...",
              value: search,
              onChange: (e) => {
                setSearch(e.target.value);
                setPage(0);
              },
              className: "pl-9 h-9 text-[0.85rem]"
            }
          )
        ] }),
        hasActiveFilters && /* @__PURE__ */ jsxs(Button, { variant: "ghost", size: "sm", onClick: clearAllFilters, className: "h-9 text-[0.8rem]", children: [
          /* @__PURE__ */ jsx(X, { className: "w-3 h-3 mr-1" }),
          " Clear Filters"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-3 gap-2", children: [
        /* @__PURE__ */ jsxs(Select, { value: schoolFilter, onValueChange: handleSchoolFilterChange, children: [
          /* @__PURE__ */ jsxs(SelectTrigger, { className: "h-9 text-[0.8rem]", children: [
            /* @__PURE__ */ jsx(Filter, { className: "w-3 h-3 mr-1 shrink-0" }),
            /* @__PURE__ */ jsx(SelectValue, { placeholder: "School" })
          ] }),
          /* @__PURE__ */ jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsx(SelectItem, { value: "all", children: "All Schools" }),
            SCHOOLS.map((s) => /* @__PURE__ */ jsx(SelectItem, { value: s, children: s }, s))
          ] })
        ] }),
        /* @__PURE__ */ jsxs(Select, { value: departmentFilter, onValueChange: handleDepartmentFilterChange, children: [
          /* @__PURE__ */ jsx(SelectTrigger, { className: "h-9 text-[0.8rem]", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Department" }) }),
          /* @__PURE__ */ jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsx(SelectItem, { value: "all", children: "All Departments" }),
            filterDepartments.map((d) => /* @__PURE__ */ jsx(SelectItem, { value: d, children: d }, d))
          ] })
        ] }),
        /* @__PURE__ */ jsxs(Select, { value: branchFilter, onValueChange: (v) => {
          setBranchFilter(v);
          setPage(0);
        }, children: [
          /* @__PURE__ */ jsx(SelectTrigger, { className: "h-9 text-[0.8rem]", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Branch" }) }),
          /* @__PURE__ */ jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsx(SelectItem, { value: "all", children: "All Branches" }),
            filterBranches.map((b) => /* @__PURE__ */ jsx(SelectItem, { value: b, children: b }, b))
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-2", children: [
        /* @__PURE__ */ jsxs(Select, { value: yearFilter, onValueChange: handleYearFilterChange, children: [
          /* @__PURE__ */ jsx(SelectTrigger, { className: "h-9 text-[0.8rem]", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Year" }) }),
          /* @__PURE__ */ jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsx(SelectItem, { value: "all", children: "All Years" }),
            YEARS.map((y) => /* @__PURE__ */ jsxs(SelectItem, { value: y, children: [
              y,
              " Year"
            ] }, y))
          ] })
        ] }),
        /* @__PURE__ */ jsxs(Select, { value: semesterFilter, onValueChange: handleSemesterFilterChange, children: [
          /* @__PURE__ */ jsx(SelectTrigger, { className: "h-9 text-[0.8rem]", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Semester" }) }),
          /* @__PURE__ */ jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsx(SelectItem, { value: "all", children: "All Semesters" }),
            filterSemesters.map((s) => /* @__PURE__ */ jsxs(SelectItem, { value: String(s), children: [
              "Semester ",
              s
            ] }, s))
          ] })
        ] }),
        /* @__PURE__ */ jsxs(Select, { value: sectionFilter, onValueChange: (v) => {
          setSectionFilter(v);
          setPage(0);
        }, children: [
          /* @__PURE__ */ jsx(SelectTrigger, { className: "h-9 text-[0.8rem]", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Section" }) }),
          /* @__PURE__ */ jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsx(SelectItem, { value: "all", children: "All Sections" }),
            SECTIONS.map((s) => /* @__PURE__ */ jsxs(SelectItem, { value: s, children: [
              "Section ",
              s
            ] }, s))
          ] })
        ] }),
        /* @__PURE__ */ jsxs(Select, { value: sessionFilter, onValueChange: (v) => {
          setSessionFilter(v);
          setPage(0);
        }, children: [
          /* @__PURE__ */ jsx(SelectTrigger, { className: "h-9 text-[0.8rem]", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Session" }) }),
          /* @__PURE__ */ jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsx(SelectItem, { value: "all", children: "All Sessions" }),
            SESSIONS.map((s) => /* @__PURE__ */ jsx(SelectItem, { value: s, children: s }, s))
          ] })
        ] })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(CardContent, { className: "p-0", children: [
      /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs(Table, { children: [
        /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableHead, { className: "text-[0.75rem]", children: "Roll No." }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-[0.75rem]", children: "Name" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-[0.75rem]", children: "School" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-[0.75rem]", children: "Dept" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-[0.75rem]", children: "Branch" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-[0.75rem]", children: "Year" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-[0.75rem]", children: "Sem" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-[0.75rem]", children: "Sec" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-[0.75rem]", children: "Session" })
        ] }) }),
        /* @__PURE__ */ jsx(TableBody, { children: paged.length === 0 ? /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { colSpan: 9, className: "text-center text-[0.8rem] text-muted-foreground py-8", children: "No students found matching the filters." }) }) : paged.map((student) => /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableCell, { className: "text-[0.78rem] font-mono", children: student.rollNumber }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-[0.78rem]", children: student.name }),
          /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-[0.68rem]", children: student.school }) }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-[0.78rem]", children: student.department }),
          /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "text-[0.68rem]", children: student.branch }) }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-[0.78rem]", children: student.year }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-[0.78rem]", children: student.semester }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-[0.78rem]", children: student.section }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-[0.78rem]", children: student.session })
        ] }, student.id)) })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-4 py-3 border-t border-border", children: [
        /* @__PURE__ */ jsxs("p", { className: "text-[0.75rem] text-muted-foreground", children: [
          "Showing ",
          filtered.length === 0 ? 0 : page * pageSize + 1,
          "\u2013",
          Math.min((page + 1) * pageSize, filtered.length),
          " of ",
          filtered.length
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-1", children: [
          /* @__PURE__ */ jsx(
            Button,
            {
              variant: "outline",
              size: "sm",
              disabled: page === 0,
              onClick: () => setPage(page - 1),
              className: "text-[0.75rem] h-7",
              children: "Previous"
            }
          ),
          /* @__PURE__ */ jsx(
            Button,
            {
              variant: "outline",
              size: "sm",
              disabled: page >= totalPages - 1,
              onClick: () => setPage(page + 1),
              className: "text-[0.75rem] h-7",
              children: "Next"
            }
          )
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(Dialog, { open: dialogOpen, onOpenChange: setDialogOpen, children: /* @__PURE__ */ jsxs(DialogContent, { className: "max-w-lg", children: [
      /* @__PURE__ */ jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsx(DialogTitle, { children: "Add New Student" }),
        /* @__PURE__ */ jsx(DialogDescription, { children: "Enter the student details below. School, Department, and Branch are cascading fields." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { className: "text-[0.8rem]", children: "Roll Number" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                value: formData.rollNumber,
                onChange: (e) => setFormData({ ...formData, rollNumber: e.target.value }),
                placeholder: "e.g., CS3001",
                className: "text-[0.85rem]"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { className: "text-[0.8rem]", children: "Full Name" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                value: formData.name,
                onChange: (e) => setFormData({ ...formData, name: e.target.value }),
                placeholder: "Student name",
                className: "text-[0.85rem]"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { className: "text-[0.8rem]", children: "School" }),
            /* @__PURE__ */ jsxs(Select, { value: formData.school, onValueChange: handleFormSchoolChange, children: [
              /* @__PURE__ */ jsx(SelectTrigger, { className: "text-[0.8rem]", children: /* @__PURE__ */ jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsx(SelectContent, { children: SCHOOLS.map((s) => /* @__PURE__ */ jsx(SelectItem, { value: s, children: s }, s)) })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { className: "text-[0.8rem]", children: "Department" }),
            /* @__PURE__ */ jsxs(Select, { value: formData.department, onValueChange: handleFormDeptChange, children: [
              /* @__PURE__ */ jsx(SelectTrigger, { className: "text-[0.8rem]", children: /* @__PURE__ */ jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsx(SelectContent, { children: formDepartments.map((d) => /* @__PURE__ */ jsx(SelectItem, { value: d, children: d }, d)) })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { className: "text-[0.8rem]", children: "Branch" }),
            /* @__PURE__ */ jsxs(
              Select,
              {
                value: formData.branch,
                onValueChange: (v) => setFormData({ ...formData, branch: v }),
                children: [
                  /* @__PURE__ */ jsx(SelectTrigger, { className: "text-[0.8rem]", children: /* @__PURE__ */ jsx(SelectValue, {}) }),
                  /* @__PURE__ */ jsx(SelectContent, { children: formBranches.map((b) => /* @__PURE__ */ jsx(SelectItem, { value: b, children: b }, b)) })
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-4 gap-3", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { className: "text-[0.8rem]", children: "Year" }),
            /* @__PURE__ */ jsxs(Select, { value: formData.year, onValueChange: handleFormYearChange, children: [
              /* @__PURE__ */ jsx(SelectTrigger, { className: "text-[0.8rem]", children: /* @__PURE__ */ jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsx(SelectContent, { children: YEARS.map((y) => /* @__PURE__ */ jsx(SelectItem, { value: y, children: y }, y)) })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { className: "text-[0.8rem]", children: "Semester" }),
            /* @__PURE__ */ jsxs(Select, { value: String(formData.semester), onValueChange: handleFormSemesterChange, children: [
              /* @__PURE__ */ jsx(SelectTrigger, { className: "text-[0.8rem]", children: /* @__PURE__ */ jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsx(SelectContent, { children: formSemesters.map((s) => /* @__PURE__ */ jsxs(SelectItem, { value: String(s), children: [
                "Sem ",
                s
              ] }, s)) })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { className: "text-[0.8rem]", children: "Section" }),
            /* @__PURE__ */ jsxs(
              Select,
              {
                value: formData.section,
                onValueChange: (v) => setFormData({ ...formData, section: v }),
                children: [
                  /* @__PURE__ */ jsx(SelectTrigger, { className: "text-[0.8rem]", children: /* @__PURE__ */ jsx(SelectValue, {}) }),
                  /* @__PURE__ */ jsx(SelectContent, { children: SECTIONS.map((s) => /* @__PURE__ */ jsx(SelectItem, { value: s, children: s }, s)) })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { className: "text-[0.8rem]", children: "Session" }),
            /* @__PURE__ */ jsxs(
              Select,
              {
                value: formData.session,
                onValueChange: (v) => setFormData({ ...formData, session: v }),
                children: [
                  /* @__PURE__ */ jsx(SelectTrigger, { className: "text-[0.8rem]", children: /* @__PURE__ */ jsx(SelectValue, {}) }),
                  /* @__PURE__ */ jsx(SelectContent, { children: SESSIONS.map((s) => /* @__PURE__ */ jsx(SelectItem, { value: s, children: s }, s)) })
                ]
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => setDialogOpen(false), children: "Cancel" }),
        /* @__PURE__ */ jsx(Button, { onClick: handleAdd, children: "Add Student" })
      ] })
    ] }) })
  ] });
}
export {
  StudentManagement
};
