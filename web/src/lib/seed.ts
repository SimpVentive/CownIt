import type {
  Person,
  Commit,
  Achievement,
  MonthlyUpdate,
  AppMessage,
  HrComment,
  AppData,
  Role,
} from "./types";

export const people: Person[] = [
  { id: "p1", name: "John Smith", initials: "JS", department: "Operations", role: "individual" },
  { id: "p2", name: "Sarah Johnson", initials: "SJ", department: "Quality", role: "individual" },
  { id: "p3", name: "Mike Chen", initials: "MC", department: "Safety", role: "individual" },
  { id: "p4", name: "Lisa Davis", initials: "LD", department: "HR", role: "individual" },
];

export const commits: Commit[] = [
  { id: "c1", personId: "p1", level: "self", statement: "Completed process documentation for Q2", createdAt: "2026-06-15T10:30:00Z" },
  { id: "c2", personId: "p1", level: "team", statement: "Led training session for new team members", createdAt: "2026-06-18T14:00:00Z" },
  { id: "c3", personId: "p1", level: "org", statement: "Implemented new operational standards across departments", createdAt: "2026-06-20T09:15:00Z" },
  { id: "c4", personId: "p2", level: "self", statement: "Completed quality audit for product line A", createdAt: "2026-06-10T11:00:00Z" },
  { id: "c5", personId: "p2", level: "team", statement: "Coordinated quality review with cross-functional team", createdAt: "2026-06-17T13:30:00Z" },
  { id: "c6", personId: "p2", level: "org", statement: "Established company-wide quality metrics framework", createdAt: "2026-06-22T15:45:00Z" },
  { id: "c7", personId: "p3", level: "self", statement: "Completed safety incident report analysis", createdAt: "2026-06-12T09:00:00Z" },
  { id: "c8", personId: "p3", level: "team", statement: "Organized safety training for warehouse staff", createdAt: "2026-06-19T10:30:00Z" },
  { id: "c9", personId: "p3", level: "org", statement: "Updated company safety protocols to meet regulatory standards", createdAt: "2026-06-25T14:20:00Z" },
  { id: "c10", personId: "p4", level: "self", statement: "Processed employee onboarding for new hires", createdAt: "2026-06-08T10:00:00Z" },
  { id: "c11", personId: "p4", level: "team", statement: "Facilitated conflict resolution between team members", createdAt: "2026-06-16T11:00:00Z" },
  { id: "c12", personId: "p4", level: "org", statement: "Developed company-wide employee engagement program", createdAt: "2026-06-23T16:00:00Z" },
];

export const achievements: Achievement[] = [
  {
    id: "a1",
    personId: "p1",
    commitId: "c1",
    title: "Process Documentation Excellence",
    evidence: "Comprehensive documentation completed and approved by management",
    cpqsdp: ["P", "Q"],
    impactRating: 8,
    date: "2026-06-15T10:30:00Z",
    fileAttachment: null,
  },
  {
    id: "a2",
    personId: "p1",
    commitId: "c2",
    title: "Team Development Initiative",
    evidence: "Training session conducted for 15 team members with positive feedback",
    cpqsdp: ["D", "O"],
    impactRating: 7,
    date: "2026-06-18T14:00:00Z",
    fileAttachment: null,
  },
  {
    id: "a3",
    personId: "p1",
    commitId: "c3",
    title: "Organizational Standards Implementation",
    evidence: "New operational standards adopted across all departments",
    cpqsdp: ["C", "P", "O"],
    impactRating: 9,
    date: "2026-06-20T09:15:00Z",
    fileAttachment: null,
  },
];

export const monthlyUpdates: MonthlyUpdate[] = [
  { id: "m1", personId: "p1", month: 6, year: 2026, note: "Strong performance this month with three major achievements", updatedAt: "2026-06-29T10:00:00Z" },
  { id: "m2", personId: "p2", month: 6, year: 2026, note: "Quality metrics on track for end of quarter", updatedAt: "2026-06-28T14:30:00Z" },
];

export const messages: AppMessage[] = [
  {
    id: "msg1",
    fromRole: "hr",
    fromName: "Lisa Davis",
    toPersonId: "p1",
    body: "Great work on the team training session last week. Your leadership is appreciated.",
    date: "2026-06-19T09:00:00Z",
    read: true,
  },
  {
    id: "msg2",
    fromRole: "ceo",
    fromName: "Robert Kim",
    toPersonId: "p1",
    body: "The new operational standards you implemented are making a real difference. Keep up the excellent work.",
    date: "2026-06-24T15:30:00Z",
    read: false,
  },
];

export const hrComments: HrComment[] = [
  {
    id: "hrc1",
    achievementId: "a1",
    authorName: "Lisa Davis",
    body: "Excellent documentation work. This will be a valuable resource for the entire team.",
    date: "2026-06-16T11:00:00Z",
  },
];

export function initialData(): AppData {
  return { people, commits, achievements, monthlyUpdates, messages, hrComments };
}

export interface DemoUser {
  id: string;
  name: string;
}

/** First demo user per role — used by the demo login. */
export const demoUsers: Record<Role, DemoUser[]> = {
  individual: [
    { id: "p1", name: "John Smith" },
    { id: "p2", name: "Sarah Johnson" },
    { id: "p3", name: "Mike Chen" },
    { id: "p4", name: "Lisa Davis" },
  ],
  hr: [{ id: "hr-user", name: "HR Manager" }],
  ceo: [{ id: "ceo-user", name: "CEO" }],
};
