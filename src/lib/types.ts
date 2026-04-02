// ─── User ────────────────────────────────────────────
export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt?: string;
}

export interface AuthResponse extends User {
  token: string;
}

// ─── Leads ───────────────────────────────────────────
export type LeadStatus =
  | "New"
  | "Contacted"
  | "Qualified"
  | "Converted"
  | "Lost";
export type LeadSource =
  | "Generated"
  | "Manual"
  | "Referral"
  | "Social Media"
  | "Other";

export interface GeneratedLead {
  companyName: string;
  domain: string;
  logoUrl: string;
  description: string;
  email: string;
  isSaved: boolean;
}

export interface SavedLead {
  _id: string;
  user: string;
  companyName: string;
  domain: string;
  logoUrl: string;
  description: string;
  email: string;
  source: LeadSource;
  status: LeadStatus;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface RemovedLead {
  _id: string;
  user: string;
  companyName: string;
  domain: string;
  logoUrl: string;
  description: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Todos ───────────────────────────────────────────
export type TodoPriority = "Low" | "Medium" | "High";

export interface Todo {
  _id: string;
  user: string;
  title: string;
  description: string;
  priority: TodoPriority;
  isCompleted: boolean;
  dueDate?: string;
  calendarEvent?: string | CalendarEvent;
  createdAt: string;
  updatedAt: string;
}

// ─── Calendar ────────────────────────────────────────
export interface CalendarEvent {
  _id: string;
  user: string;
  title: string;
  description: string;
  startDate: string;
  endDate?: string;
  color: string;
  linkedTodo?: string | Todo;
  createdAt: string;
  updatedAt: string;
}
