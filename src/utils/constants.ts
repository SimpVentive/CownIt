export const CPQSDP_LABELS: Record<string, string> = {
  C: 'Cost',
  P: 'Productivity',
  Q: 'Quality',
  S: 'Safety',
  D: 'Delivery',
  O: 'People'
}

export const CPQSDP_COLORS: Record<string, string> = {
  C: '#534AB7',
  P: '#0F6E56',
  Q: '#3B6D11',
  S: '#993C1D',
  D: '#185FA5',
  O: '#854F0B'
}

export const LEVEL_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  self: { bg: '#EEEDFE', text: '#3C3489', label: 'Self' },
  team: { bg: '#E1F5EE', text: '#085041', label: 'Team / dept' },
  org: { bg: '#FAEEDA', text: '#633806', label: 'Organisation' }
}

export const IMPACT_GUIDE = [
  { range: '1–3', label: 'Minor' },
  { range: '4–6', label: 'Moderate' },
  { range: '7–8', label: 'Significant' },
  { range: '9–10', label: 'Transformational' }
]

export const CURRENT_PERSON_ID = 'p1'
