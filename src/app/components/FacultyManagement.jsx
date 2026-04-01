import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useMemo } from "react";
import { useStore } from "../lib/store";
import {
  SCHOOLS,
  DEPARTMENTS_BY_SCHOOL,
  BRANCHES_BY_DEPARTMENT,
  DEPARTMENT_FULL_NAMES
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
function FacultyManagement() {
  const { faculty, setFaculty } = useStore();
  const [search, setSearch] = useState("");
  const [schoolFilter, setSchoolFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [branchFilter, setBranchFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [page, setPage] = useState(0);
  const pageSize = 15;
  const defaultForm = {
    employeeId: "",
    name: "",
    school: "SOICT",
    department: "CSE",
    branch: "BCS",
    designation: "Assistant Professor",
    email: "",
    phone: ""
  };
  const [formData, setFormData] = useState(defaultForm);
  const filterDepartments = useMemo(() => {
    if (schoolFilter === "all") {
      return [...new Set(faculty.map((f) => f.department))].sort();
    }
    return DEPARTMENTS_BY_SCHOOL[schoolFilter] || [];
  }, [schoolFilter, faculty]);
  const filterBranches = useMemo(() => {
    if (departmentFilter === "all") {
      if (schoolFilter === "all") {
        return [...new Set(faculty.map((f) => f.branch))].sort();
      }
      const depts = DEPARTMENTS_BY_SCHOOL[schoolFilter] || [];
      return depts.flatMap((d) => BRANCHES_BY_DEPARTMENT[d] || []);
    }
    return BRANCHES_BY_DEPARTMENT[departmentFilter] || [];
  }, [departmentFilter, schoolFilter, faculty]);
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
  const clearAllFilters = () => {
    setSearch("");
    setSchoolFilter("all");
    setDepartmentFilter("all");
    setBranchFilter("all");
    setPage(0);
  };
  const hasActiveFilters = schoolFilter !== "all" || departmentFilter !== "all" || branchFilter !== "all" || search !== "";
  const filtered = useMemo(() => {
    return faculty.filter((f) => {
      const matchSearch = f.name.toLowerCase().includes(search.toLowerCase()) || f.employeeId.toLowerCase().includes(search.toLowerCase());
      const matchSchool = schoolFilter === "all" || f.school === schoolFilter;
      const matchDept = departmentFilter === "all" || f.department === departmentFilter;
      const matchBranch = branchFilter === "all" || f.branch === branchFilter;
      return matchSearch && matchSchool && matchDept && matchBranch;
    }).sort((a, b) => a.employeeId.localeCompare(b.employeeId));
  }, [faculty, search, schoolFilter, departmentFilter, branchFilter]);
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
  const handleAdd = () => {
    if (!formData.employeeId || !formData.name) return;
    const newFaculty = {
      id: `f-${Date.now()}`,
      employeeId: formData.employeeId,
      name: formData.name,
      school: formData.school,
      department: formData.department,
      branch: formData.branch,
      designation: formData.designation,
      email: formData.email || `${formData.name.split(" ").pop()?.toLowerCase()}@gbu.ac.in`,
      phone: formData.phone || "",
      totalDuties: 0,
      isAvailable: true
    };
    setFaculty((prev) => [...prev, newFaculty]);
    setDialogOpen(false);
    setFormData(defaultForm);
  };
  const handleBulkUpload = () => {
    const newFaculty = [];
    const configs = [
      { school: "SOICT", department: "CSE", branch: "BCS" },
      { school: "SOICT", department: "ECE", branch: "B.Tech ECE" },
      { school: "SOE", department: "Mechanical", branch: "B.Tech ME" },
      { school: "SOVSAS", department: "PH", branch: "B.Sc Physics" },
      { school: "SOM", department: "Management", branch: "BBA" }
    ];
    const designations2 = ["Professor", "Associate Professor", "Assistant Professor", "Lecturer"];
    for (let i = 0; i < 10; i++) {
      const id = Date.now() + i;
      const config = configs[i % configs.length];
      newFaculty.push({
        id: `f-${id}`,
        employeeId: `EMP${String(faculty.length + i + 1).padStart(4, "0")}`,
        name: `Faculty Member ${faculty.length + i + 1}`,
        school: config.school,
        department: config.department,
        branch: config.branch,
        designation: designations2[i % designations2.length],
        email: `faculty${faculty.length + i + 1}@gbu.ac.in`,
        phone: `98${String(Math.floor(Math.random() * 1e8)).padStart(8, "0")}`,
        totalDuties: 0,
        isAvailable: true
      });
    }
    setFaculty((prev) => [...prev, ...newFaculty]);
  };
  const formDepartments = DEPARTMENTS_BY_SCHOOL[formData.school] || [];
  const formBranches = BRANCHES_BY_DEPARTMENT[formData.department] || [];
  const designations = ["Professor", "Associate Professor", "Assistant Professor", "Lecturer"];
  return /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { children: "Faculty Management" }),
        /* @__PURE__ */ jsxs("p", { className: "text-[0.8rem] text-muted-foreground", children: [
          filtered.length,
          " faculty members found"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxs(Button, { variant: "outline", size: "sm", onClick: handleBulkUpload, children: [
          /* @__PURE__ */ jsx(Upload, { className: "w-4 h-4 mr-1" }),
          " Bulk Upload"
        ] }),
        /* @__PURE__ */ jsxs(Button, { size: "sm", onClick: () => setDialogOpen(true), children: [
          /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4 mr-1" }),
          " Add Faculty"
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
              placeholder: "Search by name or faculty no...",
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
            filterDepartments.map((d) => /* @__PURE__ */ jsx(SelectItem, { value: d, children: DEPARTMENT_FULL_NAMES[d] || d }, d))
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
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(CardContent, { className: "p-0", children: [
      /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs(Table, { children: [
        /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableHead, { className: "text-[0.75rem]", children: "Faculty No." }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-[0.75rem]", children: "Faculty Name" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-[0.75rem]", children: "School" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-[0.75rem]", children: "Department" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-[0.75rem]", children: "Branch" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-[0.75rem]", children: "Designation" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-[0.75rem]", children: "Email" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-[0.75rem]", children: "Duties" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-[0.75rem]", children: "Status" })
        ] }) }),
        /* @__PURE__ */ jsx(TableBody, { children: paged.length === 0 ? /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { colSpan: 9, className: "text-center text-[0.8rem] text-muted-foreground py-8", children: "No faculty found matching the filters." }) }) : paged.map((member) => /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableCell, { className: "text-[0.78rem] font-mono", children: member.employeeId }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-[0.78rem]", children: member.name }),
          /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-[0.68rem]", children: member.school }) }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-[0.78rem]", children: member.department }),
          /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "text-[0.68rem]", children: member.branch }) }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-[0.78rem]", children: member.designation }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-[0.78rem] text-muted-foreground", children: member.email }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-[0.78rem]", children: member.totalDuties }),
          /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(
            Badge,
            {
              variant: member.isAvailable ? "default" : "destructive",
              className: "text-[0.65rem]",
              children: member.isAvailable ? "Available" : "Unavailable"
            }
          ) })
        ] }, member.id)) })
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
        /* @__PURE__ */ jsx(DialogTitle, { children: "Add New Faculty" }),
        /* @__PURE__ */ jsx(DialogDescription, { children: "Enter the faculty details below. School, Department, and Branch are cascading fields." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { className: "text-[0.8rem]", children: "Faculty No." }),
            /* @__PURE__ */ jsx(
              Input,
              {
                value: formData.employeeId,
                onChange: (e) => setFormData({ ...formData, employeeId: e.target.value }),
                placeholder: "e.g., EMP0031",
                className: "text-[0.85rem]"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { className: "text-[0.8rem]", children: "Faculty Name" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                value: formData.name,
                onChange: (e) => setFormData({ ...formData, name: e.target.value }),
                placeholder: "Full name",
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
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { className: "text-[0.8rem]", children: "Designation" }),
            /* @__PURE__ */ jsxs(
              Select,
              {
                value: formData.designation,
                onValueChange: (v) => setFormData({ ...formData, designation: v }),
                children: [
                  /* @__PURE__ */ jsx(SelectTrigger, { className: "text-[0.8rem]", children: /* @__PURE__ */ jsx(SelectValue, {}) }),
                  /* @__PURE__ */ jsx(SelectContent, { children: designations.map((d) => /* @__PURE__ */ jsx(SelectItem, { value: d, children: d }, d)) })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { className: "text-[0.8rem]", children: "Email" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                value: formData.email,
                onChange: (e) => setFormData({ ...formData, email: e.target.value }),
                placeholder: "email@gbu.ac.in",
                className: "text-[0.85rem]"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { className: "text-[0.8rem]", children: "Phone" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                value: formData.phone,
                onChange: (e) => setFormData({ ...formData, phone: e.target.value }),
                placeholder: "Phone number",
                className: "text-[0.85rem]"
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => setDialogOpen(false), children: "Cancel" }),
        /* @__PURE__ */ jsx(Button, { onClick: handleAdd, children: "Add Faculty" })
      ] })
    ] }) })
  ] });
}
export {
  FacultyManagement
};
