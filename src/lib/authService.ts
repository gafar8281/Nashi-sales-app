// src/lib/authService.ts

import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "./firebase";

export interface Employee {
  id: string;
  name: string;
  email: string;
  contact: string;
  branch: string;
  job_title: string;
  password: string;
  target: number;
}

const COLLECTION = "nashi_employees_data";

export async function loginEmployee(
  employeeId: string,
  password: string
): Promise<Employee> {
  if (!employeeId || !password) {
    throw new Error("Employee ID and password are required.");
  }

  // Firestore may store `id` as a number or a string — try both
  const asString = employeeId.trim();
  const asNumber = Number(asString);
  const idVariants: Array<string | number> = isNaN(asNumber)
    ? [asString]
    : [asString, asNumber];

  let matchedData: Employee | null = null;

  for (const idValue of idVariants) {
    const q = query(collection(db, COLLECTION), where("id", "==", idValue));

    let snapshot;
    try {
      snapshot = await getDocs(q);
    } catch (err) {
      console.error("Firestore query failed:", err);
      throw new Error("Unable to reach the server. Please check your connection.");
    }

    if (!snapshot.empty) {
      matchedData = snapshot.docs[0].data() as Employee;
      break;
    }
  }

  if (!matchedData) {
    throw new Error("Incorrect employee ID or password.");
  }

  // Trim both sides before comparing to avoid whitespace issues
  const storedPassword = String(matchedData.password).trim();
  const enteredPassword = password.trim();

  if (storedPassword !== enteredPassword) {
    throw new Error("Incorrect employee ID or password.");
  }

  return { ...matchedData, id: String(matchedData.id) };
}