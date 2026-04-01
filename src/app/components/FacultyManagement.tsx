import { useState, useMemo } from "react";
import { useStore } from "../lib/store";
import {
  SCHOOLS, DEPARTMENTS_BY_SCHOOL, BRANCHES_BY_DEPARTMENT, DEPARTMENT_FULL_NAMES,
} from "../lib/data";
import { Card, CardContent } from "./ui/card";
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
import { Search, Plus, Upload, Filter, X, UserCog } from "lucide-react";

export function FacultyManagement() {
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
    phone: "",
  };
  const [formData, setFormData] = useState(defaultForm);

  // Cascading filter options
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

  // Reset dependent filters
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

  const hasActiveFilters = schoolFilter !== "all" || departmentFilter !== "all" ||
    branchFilter !== "all" || search !== "";

  const filtered = useMemo(() => {
    return faculty
      .filter((f) => {
        const matchSearch =
          f.name.toLowerCase().includes(search.toLowerCase()) ||
          f.employeeId.toLowerCase().includes(search.toLowerCase());
        const matchSchool = schoolFilter === "all" || f.school === schoolFilter;
        const matchDept = departmentFilter === "all" || f.department === departmentFilter;
        const matchBranch = branchFilter === "all" || f.branch === branchFilter;
        return matchSearch && matchSchool && matchDept && matchBranch;
      })
      .sort((a, b) => a.employeeId.localeCompare(b.employeeId));
  }, [faculty, search, schoolFilter, departmentFilter, branchFilter]);

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
      isAvailable: true,
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
      { school: "SOM", department: "Management", branch: "BBA" },
    ];
    const designations = ["Professor", "Associate Professor", "Assistant Professor", "Lecturer"];
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
        designation: designations[i % designations.length],
        email: `faculty${faculty.length + i + 1}@gbu.ac.in`,
        phone: `98${String(Math.floor(Math.random() * 100000000)).padStart(8, "0")}`,
        totalDuties: 0,
        isAvailable: true,
      });
    }
    setFaculty((prev) => [...prev, ...newFaculty]);
  };

  // Form options
  const formDepartments = DEPARTMENTS_BY_SCHOOL[formData.school] || [];
  const formBranches = BRANCHES_BY_DEPARTMENT[formData.department] || [];
  const designations = ["Professor", "Associate Professor", "Assistant Professor", "Lecturer"];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1>Faculty Management</h1>
          <p className="text-[0.8rem] text-muted-foreground">{filtered.length} faculty members found</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleBulkUpload}>
            <Upload className="w-4 h-4 mr-1" /> Bulk Upload
          </Button>
          <Button size="sm" onClick={() => setDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-1" /> Add Faculty
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
                  placeholder="Search by name or faculty no..."
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

            {/* Filter dropdowns: School → Department → Branch */}
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
                    <SelectItem key={d} value={d}>
                      {DEPARTMENT_FULL_NAMES[d] || d}
                    </SelectItem>
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
                  <TableHead className="text-[0.75rem]">Faculty No.</TableHead>
                  <TableHead className="text-[0.75rem]">Faculty Name</TableHead>
                  <TableHead className="text-[0.75rem]">School</TableHead>
                  <TableHead className="text-[0.75rem]">Department</TableHead>
                  <TableHead className="text-[0.75rem]">Branch</TableHead>
                  <TableHead className="text-[0.75rem]">Designation</TableHead>
                  <TableHead className="text-[0.75rem]">Email</TableHead>
                  <TableHead className="text-[0.75rem]">Duties</TableHead>
                  <TableHead className="text-[0.75rem]">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paged.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center text-[0.8rem] text-muted-foreground py-8">
                      No faculty found matching the filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  paged.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="text-[0.78rem] font-mono">{member.employeeId}</TableCell>
                      <TableCell className="text-[0.78rem]">{member.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[0.68rem]">{member.school}</Badge>
                      </TableCell>
                      <TableCell className="text-[0.78rem]">{member.department}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-[0.68rem]">{member.branch}</Badge>
                      </TableCell>
                      <TableCell className="text-[0.78rem]">{member.designation}</TableCell>
                      <TableCell className="text-[0.78rem] text-muted-foreground">{member.email}</TableCell>
                      <TableCell className="text-[0.78rem]">{member.totalDuties}</TableCell>
                      <TableCell>
                        <Badge
                          variant={member.isAvailable ? "default" : "destructive"}
                          className="text-[0.65rem]"
                        >
                          {member.isAvailable ? "Available" : "Unavailable"}
                        </Badge>
                      </TableCell>
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

      {/* Add Faculty Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Faculty</DialogTitle>
            <DialogDescription>
              Enter the faculty details below. School, Department, and Branch are cascading fields.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {/* Faculty No. & Name */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-[0.8rem]">Faculty No.</Label>
                <Input
                  value={formData.employeeId}
                  onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                  placeholder="e.g., EMP0031"
                  className="text-[0.85rem]"
                />
              </div>
              <div>
                <Label className="text-[0.8rem]">Faculty Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Full name"
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
                      <SelectItem key={s} value={s}>{s}</SelectItem>
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

            {/* Designation, Email, Phone */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label className="text-[0.8rem]">Designation</Label>
                <Select
                  value={formData.designation}
                  onValueChange={(v) => setFormData({ ...formData, designation: v })}
                >
                  <SelectTrigger className="text-[0.8rem]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {designations.map((d) => (
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-[0.8rem]">Email</Label>
                <Input
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@gbu.ac.in"
                  className="text-[0.85rem]"
                />
              </div>
              <div>
                <Label className="text-[0.8rem]">Phone</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Phone number"
                  className="text-[0.85rem]"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAdd}>Add Faculty</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
