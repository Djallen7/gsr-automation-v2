export const SEGMENTS = [
  { value: 'show_intro',             label: 'Show Intro' },
  { value: 'opening_monologue',      label: 'Opening Monologue' },
  { value: 'interview_1',            label: 'Interview 1' },
  { value: 'interview_2',            label: 'Interview 2' },
  { value: 'kids_corner',            label: "Kids Corner" },
  { value: 'genesis_science_qa',     label: 'Genesis Science Q&A' },
  { value: 'ministry_report',        label: 'Ministry Report' },
  { value: 'viewer_voices',          label: 'Viewer Voices' },
  { value: 'featured_resource',      label: 'Featured Resource' },
  { value: 'heavens_declare',        label: 'Heavens Declare' },
  { value: 'genesis_science_minute', label: 'Genesis Science Minute' },
  { value: 'other',                  label: 'Other' },
] as const

export type SegmentValue = (typeof SEGMENTS)[number]['value']
