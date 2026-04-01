import React, { createContext, useContext, useState } from "react";
import {
  initialStudents, initialRooms, initialExams, initialFaculty,
  initialSeatingAllocations, initialInvigilationAllocations,
  initialAttendanceRecords, initialReplacementLogs
} from "./data";

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [students, setStudents] = useState(initialStudents);
  const [rooms, setRooms] = useState(initialRooms);
  const [exams, setExams] = useState(initialExams);
  const [faculty, setFaculty] = useState(initialFaculty);
  const [seatingAllocations, setSeatingAllocations] = useState(initialSeatingAllocations);
  const [invigilationAllocations, setInvigilationAllocations] = useState(initialInvigilationAllocations);
  const [attendanceRecords, setAttendanceRecords] = useState(initialAttendanceRecords);
  const [replacementLogs, setReplacementLogs] = useState(initialReplacementLogs);
  const [currentRole, setCurrentRole] = useState("admin");
  const [loggedInFacultyId, setLoggedInFacultyId] = useState(null);
  const [loggedInStudentId, setLoggedInStudentId] = useState(null);

  return (
    <StoreContext.Provider
      value={{
        students, setStudents,
        rooms, setRooms,
        exams, setExams,
        faculty, setFaculty,
        seatingAllocations, setSeatingAllocations,
        invigilationAllocations, setInvigilationAllocations,
        attendanceRecords, setAttendanceRecords,
        replacementLogs, setReplacementLogs,
        currentRole, setCurrentRole,
        loggedInFacultyId, setLoggedInFacultyId,
        loggedInStudentId, setLoggedInStudentId,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
