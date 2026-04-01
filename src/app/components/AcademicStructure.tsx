import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  School, BookOpen, ChevronRight, ChevronDown, GraduationCap,
  Building2, User, Clock, Award, FlaskConical, FolderOpen,
  Layers, ArrowLeft
} from "lucide-react";
import { Button } from "./ui/button";
import { schools } from "../lib/academic-data";

const typeColors = {
  core: "bg-blue-100 text-blue-700",
  elective: "bg-amber-100 text-amber-700",
  lab: "bg-green-100 text-green-700",
  project: "bg-purple-100 text-purple-700",
};

const typeLabels = {
  core: "Core",
  elective: "Elective",
  lab: "Lab",
  project: "Project",
};

function CourseTable({ courses, semLabel }) {
  const totalCredits = courses.reduce((sum, c) => sum + c.credits, 0);
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <div className="bg-accent/50 px-4 py-2 flex items-center justify-between">
        <span className="text-[0.8rem] font-medium">{semLabel}</span>
        <Badge variant="secondary" className="text-[0.65rem]">
          {totalCredits} Credits &bull; {courses.length} Courses
        </Badge>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-[0.8rem]">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left px-4 py-2 font-medium text-muted-foreground">Code</th>
              <th className="text-left px-4 py-2 font-medium text-muted-foreground">Course Name</th>
              <th className="text-center px-4 py-2 font-medium text-muted-foreground">Credits</th>
              <th className="text-center px-4 py-2 font-medium text-muted-foreground">Type</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.code} className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors">
                <td className="px-4 py-2 font-mono text-[0.75rem]">{course.code}</td>
                <td className="px-4 py-2">{course.name}</td>
                <td className="px-4 py-2 text-center font-medium">{course.credits}</td>
                <td className="px-4 py-2 text-center">
                  <Badge className={`text-[0.6rem] ${typeColors[course.type]}`}>
                    {typeLabels[course.type]}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function YearView({ year, programmeShortName }) {
  const [expanded, setExpanded] = useState(false);
  const allCourses = [...year.semester1, ...year.semester2];
  const totalCredits = allCourses.reduce((sum, c) => sum + c.credits, 0);

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-accent/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Layers className="w-4 h-4" />
          </div>
          <div className="text-left">
            <p className="text-[0.85rem] font-medium">Year {year.year}</p>
            <p className="text-[0.7rem] text-muted-foreground">
              Semester {year.year * 2 - 1} & {year.year * 2} &bull; {allCourses.length} Courses &bull; {totalCredits} Credits
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex gap-1">
            <Badge variant="outline" className="text-[0.6rem]">
              {year.semester1.length} courses in Sem {year.year * 2 - 1}
            </Badge>
            <Badge variant="outline" className="text-[0.6rem]">
              {year.semester2.length} courses in Sem {year.year * 2}
            </Badge>
          </div>
          {expanded ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
        </div>
      </button>
      {expanded && (
        <div className="p-4 pt-0 space-y-4">
          <CourseTable
            courses={year.semester1}
            semLabel={`Semester ${year.year * 2 - 1}`}
          />
          <CourseTable
            courses={year.semester2}
            semLabel={`Semester ${year.year * 2}`}
          />
        </div>
      )}
    </div>
  );
}

function ProgrammeView({ programme, onBack }) {
  const allCourses = programme.curriculum.flatMap((y) => [...y.semester1, ...y.semester2]);
  const coreCount = allCourses.filter((c) => c.type === "core").length;
  const electiveCount = allCourses.filter((c) => c.type === "elective").length;
  const labCount = allCourses.filter((c) => c.type === "lab").length;
  const projectCount = allCourses.filter((c) => c.type === "project").length;

  return (
    <div className="space-y-4">
      <Button variant="ghost" size="sm" onClick={onBack} className="text-[0.8rem] -ml-2">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Programmes
      </Button>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <CardTitle className="text-[1rem]">{programme.name}</CardTitle>
              <p className="text-[0.8rem] text-muted-foreground mt-1">
                {programme.degree} &bull; {programme.duration} Year{programme.duration > 1 ? "s" : ""} Programme
              </p>
            </div>
            <Badge className="text-[0.7rem] bg-indigo-100 text-indigo-700 shrink-0">
              {programme.totalCredits} Total Credits
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-blue-50">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <div>
                <p className="text-[0.85rem] font-semibold text-blue-700">{coreCount}</p>
                <p className="text-[0.65rem] text-blue-600">Core Courses</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-amber-50">
              <FolderOpen className="w-4 h-4 text-amber-600" />
              <div>
                <p className="text-[0.85rem] font-semibold text-amber-700">{electiveCount}</p>
                <p className="text-[0.65rem] text-amber-600">Electives</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-green-50">
              <FlaskConical className="w-4 h-4 text-green-600" />
              <div>
                <p className="text-[0.85rem] font-semibold text-green-700">{labCount}</p>
                <p className="text-[0.65rem] text-green-600">Lab Courses</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-purple-50">
              <Award className="w-4 h-4 text-purple-600" />
              <div>
                <p className="text-[0.85rem] font-semibold text-purple-700">{projectCount}</p>
                <p className="text-[0.65rem] text-purple-600">Projects</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {programme.curriculum.map((year) => (
              <YearView key={year.year} year={year} programmeShortName={programme.shortName} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function AcademicStructure() {
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedProgramme, setSelectedProgramme] = useState(null);

  // Programme detail view
  if (selectedProgramme && selectedSchool && selectedBranch) {
    return (
      <div className="space-y-4">
        <div>
          <h1>Academic Structure</h1>
          <div className="flex items-center gap-1.5 text-[0.75rem] text-muted-foreground mt-1 flex-wrap">
            <button onClick={() => { setSelectedSchool(null); setSelectedBranch(null); setSelectedProgramme(null); }} className="hover:text-foreground transition-colors">
              Schools
            </button>
            <ChevronRight className="w-3 h-3" />
            <button onClick={() => { setSelectedBranch(null); setSelectedProgramme(null); }} className="hover:text-foreground transition-colors">
              {selectedSchool.shortName}
            </button>
            <ChevronRight className="w-3 h-3" />
            <button onClick={() => setSelectedProgramme(null)} className="hover:text-foreground transition-colors">
              {selectedBranch.shortName}
            </button>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground font-medium">{selectedProgramme.shortName}</span>
          </div>
        </div>
        <ProgrammeView
          programme={selectedProgramme}
          onBack={() => setSelectedProgramme(null)}
        />
      </div>
    );
  }

  // Branch & programme list view
  if (selectedSchool) {
    return (
      <div className="space-y-4">
        <div>
          <h1>Academic Structure</h1>
          <div className="flex items-center gap-1.5 text-[0.75rem] text-muted-foreground mt-1">
            <button onClick={() => { setSelectedSchool(null); setSelectedBranch(null); }} className="hover:text-foreground transition-colors">
              Schools
            </button>
            <ChevronRight className="w-3 h-3" />
            {selectedBranch ? (
              <>
                <button onClick={() => setSelectedBranch(null)} className="hover:text-foreground transition-colors">
                  {selectedSchool.shortName}
                </button>
                <ChevronRight className="w-3 h-3" />
                <span className="text-foreground font-medium">{selectedBranch.shortName}</span>
              </>
            ) : (
              <span className="text-foreground font-medium">{selectedSchool.shortName}</span>
            )}
          </div>
        </div>

        <Button variant="ghost" size="sm" onClick={() => { if (selectedBranch) setSelectedBranch(null); else setSelectedSchool(null); }} className="text-[0.8rem] -ml-2">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to {selectedBranch ? "Branches" : "Schools"}
        </Button>

        {!selectedBranch ? (
          <>
            {/* School header card */}
            <Card className={`border-l-4 ${selectedSchool.color.replace("text-", "border-")}`}>
              <CardContent className="py-4 px-5">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl ${selectedSchool.iconBg} flex items-center justify-center shrink-0`}>
                    <School className={`w-6 h-6 ${selectedSchool.color}`} />
                  </div>
                  <div>
                    <h2 className="text-[1rem] font-semibold">{selectedSchool.name}</h2>
                    <p className="text-[0.8rem] text-muted-foreground">
                      <User className="w-3 h-3 inline mr-1" />Dean: {selectedSchool.dean} &bull; {selectedSchool.branches.length} Department{selectedSchool.branches.length > 1 ? "s" : ""} &bull; {selectedSchool.branches.reduce((sum, b) => sum + b.programmes.length, 0)} Programmes
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Branches grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {selectedSchool.branches.map((branch) => (
                <Card
                  key={branch.id}
                  className="cursor-pointer hover:shadow-md hover:border-primary/30 transition-all"
                  onClick={() => setSelectedBranch(branch)}
                >
                  <CardContent className="py-4 px-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 rounded-lg ${selectedSchool.iconBg} flex items-center justify-center`}>
                        <Building2 className={`w-5 h-5 ${selectedSchool.color}`} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[0.85rem] font-medium truncate">{branch.name}</p>
                        <p className="text-[0.7rem] text-muted-foreground truncate">HoD: {branch.hod}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="text-[0.65rem]">
                        {branch.programmes.length} Programme{branch.programmes.length > 1 ? "s" : ""}
                      </Badge>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        ) : (
          <>
            {/* Branch header */}
            <Card className={`border-l-4 ${selectedSchool.color.replace("text-", "border-")}`}>
              <CardContent className="py-4 px-5">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl ${selectedSchool.iconBg} flex items-center justify-center shrink-0`}>
                    <Building2 className={`w-6 h-6 ${selectedSchool.color}`} />
                  </div>
                  <div>
                    <h2 className="text-[1rem] font-semibold">{selectedBranch.name}</h2>
                    <p className="text-[0.8rem] text-muted-foreground">
                      <User className="w-3 h-3 inline mr-1" />HoD: {selectedBranch.hod} &bull; {selectedBranch.programmes.length} Programme{selectedBranch.programmes.length > 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Programmes list */}
            <div className="space-y-3">
              {selectedBranch.programmes.map((programme) => {
                const allCourses = programme.curriculum.flatMap((y) => [...y.semester1, ...y.semester2]);
                return (
                  <Card
                    key={programme.id}
                    className="cursor-pointer hover:shadow-md hover:border-primary/30 transition-all"
                    onClick={() => setSelectedProgramme(programme)}
                  >
                    <CardContent className="py-4 px-5">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                            <GraduationCap className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[0.85rem] font-medium">{programme.name}</p>
                            <div className="flex items-center gap-2 flex-wrap mt-1">
                              <Badge variant="outline" className="text-[0.6rem]">
                                <Clock className="w-3 h-3 mr-0.5" /> {programme.duration} Year{programme.duration > 1 ? "s" : ""}
                              </Badge>
                              <Badge variant="outline" className="text-[0.6rem]">
                                <Award className="w-3 h-3 mr-0.5" /> {programme.totalCredits} Credits
                              </Badge>
                              <Badge variant="outline" className="text-[0.6rem]">
                                <BookOpen className="w-3 h-3 mr-0.5" /> {allCourses.length} Courses
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </>
        )}
      </div>
    );
  }

  // Schools overview
  const totalBranches = schools.reduce((sum, s) => sum + s.branches.length, 0);
  const totalProgrammes = schools.reduce((sum, s) => sum + s.branches.reduce((bs, b) => bs + b.programmes.length, 0), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1>Academic Structure</h1>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="py-3">
          <CardContent className="px-4 py-0">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-50 text-blue-600">
                <School className="w-4 h-4" />
              </div>
            </div>
            <p className="text-[1.25rem]">{schools.length}</p>
            <p className="text-[0.7rem] text-muted-foreground">Schools</p>
          </CardContent>
        </Card>
        <Card className="py-3">
          <CardContent className="px-4 py-0">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-green-50 text-green-600">
                <Building2 className="w-4 h-4" />
              </div>
            </div>
            <p className="text-[1.25rem]">{totalBranches}</p>
            <p className="text-[0.7rem] text-muted-foreground">Departments</p>
          </CardContent>
        </Card>
        <Card className="py-3">
          <CardContent className="px-4 py-0">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-purple-50 text-purple-600">
                <GraduationCap className="w-4 h-4" />
              </div>
            </div>
            <p className="text-[1.25rem]">{totalProgrammes}</p>
            <p className="text-[0.7rem] text-muted-foreground">Programmes</p>
          </CardContent>
        </Card>
      </div>

      {/* Schools grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {schools.map((school) => {
          const branchCount = school.branches.length;
          const progCount = school.branches.reduce((sum, b) => sum + b.programmes.length, 0);
          return (
            <Card
              key={school.id}
              className="cursor-pointer hover:shadow-md hover:border-primary/30 transition-all group"
              onClick={() => setSelectedSchool(school)}
            >
              <CardContent className="py-5 px-5">
                <div className={`w-12 h-12 rounded-xl ${school.iconBg} flex items-center justify-center mb-3`}>
                  <School className={`w-6 h-6 ${school.color}`} />
                </div>
                <Badge className={`text-[0.6rem] mb-2 ${school.iconBg} ${school.color}`}>
                  {school.shortName}
                </Badge>
                <p className="text-[0.85rem] font-medium leading-tight mb-1">
                  {school.name}
                </p>
                <p className="text-[0.7rem] text-muted-foreground mb-3">
                  Dean: {school.dean}
                </p>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-[0.6rem]">
                    {branchCount} Dept{branchCount > 1 ? "s" : ""}
                  </Badge>
                  <Badge variant="secondary" className="text-[0.6rem]">
                    {progCount} Prog{progCount > 1 ? "s" : ""}
                  </Badge>
                </div>
                <div className="flex items-center gap-1 mt-3 text-[0.75rem] text-muted-foreground group-hover:text-foreground transition-colors">
                  <span>Explore</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}