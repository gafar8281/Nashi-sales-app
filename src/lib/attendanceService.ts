// src/lib/attendanceService.ts
import {
    doc,
    setDoc,
    updateDoc,
    collection,
    query,
    where,
    orderBy,
    limit,
    getDocs,
  } from "firebase/firestore";
  import { db } from "./firebase";
  
  export type AttendanceRecord = {
    employeeId: string;
    date: string;         // "DD MMM YYYY"
    dateISO: string;      // "YYYY-MM-DD" — used for ordering & doc ID
    checkIn: string;      // "HH:MM AM/PM" or ""
    checkOut: string;     // "HH:MM AM/PM" or ""
    status: "In progress" | "Present" | "Off";
  };
  
  // Stable doc ID: one record per employee per day
  const docId = (employeeId: string, dateISO: string) =>
    `${employeeId}_${dateISO}`;
  
  const todayISO = () => new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"
  
  const todayLabel = () =>
    new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }); // "05 May 2026"
  
  /**
   * Create or overwrite the check-in record for today.
   */
  export async function saveCheckIn(
    employeeId: string,
    checkInTime: string
  ): Promise<void> {
    const iso = todayISO();
    const ref = doc(db, "attendance", docId(employeeId, iso));
  
    const record: AttendanceRecord = {
      employeeId,
      date: todayLabel(),
      dateISO: iso,
      checkIn: checkInTime,
      checkOut: "",
      status: "In progress",
    };
  
    await setDoc(ref, record, { merge: false });
  }
  
  /**
   * Update the existing today-record with check-out time and final status.
   */
  export async function saveCheckOut(
    employeeId: string,
    checkOutTime: string
  ): Promise<void> {
    const iso = todayISO();
    const ref = doc(db, "attendance", docId(employeeId, iso));
  
    await updateDoc(ref, {
      checkOut: checkOutTime,
      status: "Present",
    });
  }
  
  /**
   * Fetch the last `count` attendance records for an employee, newest first.
   */
//   export async function getAttendanceHistory(
//     employeeId: string,
//     count = 10
//   ): Promise<AttendanceRecord[]> {
//     const col = collection(db, "attendance");
//     const q = query(
//       col,
//       where("employeeId", "==", employeeId),
//       orderBy("dateISO", "desc"),
//       limit(count)
//     );
  
//     const snapshot = await getDocs(q);
//     return snapshot.docs.map((d) => d.data() as AttendanceRecord);
//   }

  export async function getAttendanceHistory(
        employeeId: string,
    ): Promise<AttendanceRecord[]> {
        const col = collection(db, "attendance");
        const q = query(
        col,
        where("employeeId", "==", employeeId),
        );
    
        const snapshot = await getDocs(q);
    
        return snapshot.docs
        .map((d) => d.data() as AttendanceRecord)
        .sort((a, b) => b.dateISO.localeCompare(a.dateISO)); // newest first
    }