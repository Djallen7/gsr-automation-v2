// ProPresenter staging export for GSR lower thirds.
//
// The lower third is plain TEXT. This module turns approved lower-thirds into a
// .txt that ProPresenter imports as one slide per line (File > Import, or paste,
// with Parsing set to "Line Break = 1"). It never talks to ProPresenter and never
// triggers anything live — it only produces a file an operator chooses to import.
//
// It also flags any line that breaks the locked broadcast format so a non-compliant
// slide never gets staged by accident.

export interface ExportGraphic {
  segment: string
  beat_number: number | null
  /** The text to stage: approved_text if present, else the initial text. */
  text: string
}

export interface L3Issue {
  beat_number: number | null
  text: string
  reasons: string[]
}

export const L3_MAX_LEN = 65

/**
 * Check one lower-third line against the locked GSR broadcast rules.
 * Returns a list of human-readable reasons it fails, empty if it's clean.
 */
export function validateL3(text: string): string[] {
  const reasons: string[] = []
  if (text.length > L3_MAX_LEN) reasons.push(`over ${L3_MAX_LEN} characters (${text.length})`)
  if (text.includes(',')) reasons.push('contains a comma')
  if (/[—–]/.test(text)) reasons.push('contains an em or en dash')
  if (/[a-z]/.test(text)) reasons.push('not all caps')
  return reasons
}

/** Every graphic that fails validation, in the order given. */
export function findL3Issues(graphics: ExportGraphic[]): L3Issue[] {
  return graphics
    .map((g) => ({ beat_number: g.beat_number, text: g.text, reasons: validateL3(g.text) }))
    .filter((issue) => issue.reasons.length > 0)
}

/**
 * Build the ProPresenter import text for one segment: one lower third per line,
 * in the order given, with a single trailing newline. Import with Parsing set to
 * "Line Break = 1" to get one slide per lower third.
 */
export function buildSegmentTxt(graphics: ExportGraphic[]): string {
  return graphics.map((g) => g.text).join('\n') + '\n'
}

/** Safe, descriptive download filename, e.g. S03Ep007_interview_1_lower-thirds.txt */
export function exportFilename(episodeLabel: string, segment: string): string {
  const ep = episodeLabel.replace(/\s+/g, '')
  return `${ep}_${segment}_lower-thirds.txt`
}
