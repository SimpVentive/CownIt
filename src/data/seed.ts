type Person = {
  id: string
  name: string
  initials: string
  department: string
  role: 'individual' | 'hr' | 'ceo'
  avatarColor: string
  avatarTextColor: string
}

type Commit = {
  id: string
  personId: string
  level: 'self' | 'team' | 'org'
  statement: string
  createdAt: string
}

type Achievement = {
  id: string
  personId: string
  commitId: string
  title: string
  evidence: string
  cpqsdp: Array<'C' | 'P' | 'Q' | 'S' | 'D' | 'O'>
  impactRating: number
  date: string
  fileAttachment: string | null
}

type MonthlyUpdate = {
  id: string
  personId: string
  month: number
  year: number
  note: string
  updatedAt: string
}

type Message = {
  id: string
  fromRole: 'hr' | 'ceo'
  fromName: string
  toPersonId: string
  body: string
  date: string
  read: boolean
}

type HRComment = {
  id: string
  achievementId: string
  authorName: string
  body: string
  date: string
}

type AppData = {
  people: Person[]
  commits: Commit[]
  achievements: Achievement[]
  monthlyUpdates: MonthlyUpdate[]
  messages: Message[]
  hrComments: HRComment[]
}

const people: Person[] = [
  {
    id: 'p1',
    name: 'John Smith',
    initials: 'JS',
    department: 'Operations',
    role: 'individual',
    avatarColor: '#EEEDFE',
    avatarTextColor: '#3C3489'
  },
  {
    id: 'p2',
    name: 'Priya Sharma',
    initials: 'PS',
    department: 'Quality',
    role: 'individual',
    avatarColor: '#E1F5EE',
    avatarTextColor: '#085041'
  },
  {
    id: 'p3',
    name: 'Rohan Das',
    initials: 'RD',
    department: 'Safety',
    role: 'individual',
    avatarColor: '#FAEEDA',
    avatarTextColor: '#633806'
  },
  {
    id: 'p4',
    name: 'Meena Iyer',
    initials: 'MI',
    department: 'HR',
    role: 'hr',
    avatarColor: '#FAECE7',
    avatarTextColor: '#993C1D'
  },
  {
    id: 'p5',
    name: 'Rajiv Kumar',
    initials: 'RK',
    department: 'Executive',
    role: 'ceo',
    avatarColor: '#F3E5F5',
    avatarTextColor: '#4A148C'
  }
]

const commits: Commit[] = [
  {
    id: 'c1',
    personId: 'p1',
    level: 'self',
    statement: 'Developed revised operational runbook for Q3 process improvements',
    createdAt: '2026-02-14T08:30:00Z'
  },
  {
    id: 'c2',
    personId: 'p1',
    level: 'team',
    statement: 'Coordinated cross-functional team to resolve critical supply chain delay',
    createdAt: '2026-04-22T11:15:00Z'
  },
  {
    id: 'c3',
    personId: 'p1',
    level: 'org',
    statement: 'Implemented new operational excellence framework across all divisions',
    createdAt: '2026-06-18T09:45:00Z'
  },
  {
    id: 'c4',
    personId: 'p2',
    level: 'self',
    statement: 'Completed comprehensive quality audit of manufacturing line B with 98% compliance',
    createdAt: '2026-03-05T13:20:00Z'
  },
  {
    id: 'c5',
    personId: 'p2',
    level: 'team',
    statement: 'Led collaborative quality review with procurement and production teams',
    createdAt: '2026-05-10T10:00:00Z'
  },
  {
    id: 'c6',
    personId: 'p2',
    level: 'org',
    statement: 'Established integrated quality metrics dashboard for enterprise-wide monitoring',
    createdAt: '2026-06-20T14:30:00Z'
  },
  {
    id: 'c7',
    personId: 'p3',
    level: 'self',
    statement: 'Completed detailed analysis of near-miss incidents and developed preventive actions',
    createdAt: '2026-01-28T09:00:00Z'
  },
  {
    id: 'c8',
    personId: 'p3',
    level: 'team',
    statement: 'Organized and conducted safety certification training for 25 warehouse personnel',
    createdAt: '2026-05-15T08:30:00Z'
  },
  {
    id: 'c9',
    personId: 'p3',
    level: 'org',
    statement: 'Revised and updated company safety protocols to meet new OSHA requirements',
    createdAt: '2026-06-25T10:15:00Z'
  },
  {
    id: 'c10',
    personId: 'p4',
    level: 'self',
    statement: 'Streamlined employee onboarding process reducing time-to-productivity by 30%',
    createdAt: '2026-02-20T10:45:00Z'
  },
  {
    id: 'c11',
    personId: 'p4',
    level: 'team',
    statement: 'Facilitated team conflict resolution workshop with 15 cross-functional leaders',
    createdAt: '2026-04-18T14:00:00Z'
  },
  {
    id: 'c12',
    personId: 'p4',
    level: 'org',
    statement: 'Launched company-wide mentorship and leadership development program',
    createdAt: '2026-06-22T11:20:00Z'
  }
]

const achievements: Achievement[] = [
  {
    id: 'a1',
    personId: 'p1',
    commitId: 'c1',
    title: 'Operational Runbook Optimization',
    evidence: 'Comprehensive runbook developed and approved by operations leadership, now used as reference standard for all divisions',
    cpqsdp: ['P', 'Q'],
    impactRating: 7,
    date: '2026-06-15T08:30:00Z',
    fileAttachment: null
  },
  {
    id: 'a2',
    personId: 'p1',
    commitId: 'c2',
    title: 'Supply Chain Coordination Success',
    evidence: 'Successfully resolved critical supply chain issue through effective cross-functional coordination, saving 2 weeks of delay',
    cpqsdp: ['Q', 'D'],
    impactRating: 8,
    date: '2026-06-22T11:15:00Z',
    fileAttachment: null
  },
  {
    id: 'a3',
    personId: 'p1',
    commitId: 'c3',
    title: 'Enterprise Excellence Framework',
    evidence: 'Operational excellence framework adopted across all divisions with measurable improvements in efficiency and customer satisfaction metrics',
    cpqsdp: ['C', 'Q', 'S'],
    impactRating: 9,
    date: '2026-06-28T09:45:00Z',
    fileAttachment: null
  }
]

const monthlyUpdates: MonthlyUpdate[] = [
  {
    id: 'm1',
    personId: 'p1',
    month: 6,
    year: 2026,
    note: 'Strong month with successful completion of operational excellence framework rollout. Three major achievements delivered ahead of schedule.',
    updatedAt: '2026-06-29T10:00:00Z'
  },
  {
    id: 'm2',
    personId: 'p2',
    month: 6,
    year: 2026,
    note: 'Quality metrics continue to exceed targets. Dashboard implementation enabling real-time monitoring across all production lines.',
    updatedAt: '2026-06-24T14:30:00Z'
  }
]

const messages: Message[] = [
  {
    id: 'msg1',
    fromRole: 'hr',
    fromName: 'Ritu Nair',
    toPersonId: 'p1',
    body: 'Hi Arjun, reminder to submit your June monthly update by end of day. Your contributions this month have been outstanding.',
    date: '2026-06-26T09:00:00Z',
    read: false
  },
  {
    id: 'msg2',
    fromRole: 'ceo',
    fromName: 'Rajiv Kumar',
    toPersonId: 'p1',
    body: 'Excellent work on closing out the CAPA initiatives ahead of schedule. Your attention to detail and follow-through is driving real impact across operations.',
    date: '2026-06-23T16:30:00Z',
    read: false
  }
]

const hrComments: HRComment[] = [
  {
    id: 'hrc1',
    achievementId: 'a1',
    authorName: 'Ritu Nair',
    body: 'Outstanding work on the operational runbook. This level of documentation and process rigor is exactly what we need to develop our leadership pipeline. Arjun is showing strong potential for advancement.',
    date: '2026-06-27T11:00:00Z'
  }
]

export type { Person, Commit, Achievement, MonthlyUpdate, Message, HRComment, AppData }
export { people, commits, achievements, monthlyUpdates, messages, hrComments }

export const initialData: AppData = {
  people,
  commits,
  achievements,
  monthlyUpdates,
  messages,
  hrComments
}
