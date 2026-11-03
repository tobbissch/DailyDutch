import type { ReactNode } from 'react'

function Icon({ size = 22, children }: { size?: number; children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

export const HomeIcon = () => (
  <Icon>
    <path d="M4 11l8-7 8 7v9h-5v-6H9v6H4z" />
  </Icon>
)

export const ReviewIcon = () => (
  <Icon>
    <path d="M4 12a8 8 0 0 1 13.7-5.6L20 9M20 4v5h-5M20 12a8 8 0 0 1-13.7 5.6L4 15M4 20v-5h5" />
  </Icon>
)

export const WordsIcon = () => (
  <Icon>
    <path d="M5 4h12a2 2 0 0 1 2 2v14H7a2 2 0 0 1-2-2zM5 18a2 2 0 0 1 2-2h12M9 8h6" />
  </Icon>
)

export const SoundsIcon = () => (
  <Icon>
    <path d="M4 9v6h4l5 4V5L8 9zM16 8.5a5 5 0 0 1 0 7" />
  </Icon>
)

export const CheckIcon = ({ size }: { size?: number }) => (
  <Icon size={size}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </Icon>
)

export const FlameIcon = () => (
  <Icon size={24}>
    <path d="M12 3c.5 3.5 5.5 6 5.5 11a5.5 5.5 0 0 1-11 0c0-2 1-3.5 2.2-4.5.2 1.5 1 2.3 1.8 2.5C10 9 10.5 6 12 3z" />
  </Icon>
)
