export function normalize(s: string): string {
  return s
    .normalize('NFC')
    .toLowerCase()
    .replace(/[’‘`]/g, "'")
    .replace(/[.!?,;:]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

export function isCorrect(input: string, expected: string): boolean {
  return normalize(input) === normalize(expected)
}
