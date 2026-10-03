export type Role = "individual" | "hr" | "ceo";

export type CommitLevel = "individual" | "hr" | "ceo";

export type Dim = "C" | "P" | "Q" | "S" | "D" | "O";

export interface Person {
  id: string;
  name: string;
  initials: string;
  department: string;
  role: string;
}

export interface Commit {
  id: string;
  personId: string;
  level: CommitLevel;
  statement: string;
  createdAt: string;
}

export interface Achievement {
  id: string;
  personId: string;
  commitId: string;
  title: string;
  evidence: string;
  cpqsdp: Dim[];
  impactRating: number;
  date: string;
  fileAttachment?: Attachment | string | null;
  fileAttachments?: Partial<Record<Dim, Attachment | string>>;
  dimensionDetails?: Partial<Record<Dim, {
    title: string;
    notes: string;
    rating: number;
  }>>;
}

export interface Attachment {
  filename: string;
  name: string;
}

export interface AchievementDraft {
  selectedLevel: CommitLevel | null;
  selectedCommitId: string;
  title: string;
  selectedDims: Dim[];
  dimensionData: Partial<Record<Dim, {
    rating: number;
    title: string;
    notes: string;
    attachment?: Attachment | string | null;
  }>>;
}

export interface MonthlyUpdate {
  id: string;
  personId: string;
  month: number;
  year: number;
  note: string;
  updatedAt: string;
}

export interface AppMessage {
  id: string;
  fromRole: Role;
  fromName: string;
  toPersonId: string;
  body: string;
  date: string;
  read: boolean;
}

export interface HrComment {
  id: string;
  achievementId: string;
  authorName: string;
  body: string;
  date: string;
}

export interface AppData {
  people: Person[];
  commits: Commit[];
  achievements: Achievement[];
  monthlyUpdates: MonthlyUpdate[];
  messages: AppMessage[];
  hrComments: HrComment[];
}

export interface Session {
  role: Role;
  loginRole: Role;
  userId: string;
  userName: string;
}
