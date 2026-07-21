const base = 'w-4 h-4'

// Real pokeball image (same GitHub sprite source the game already uses for Pokemon sprites)
export const POKEBALL_IMG = '/pokeball.png'

export function BatteryIcon({ className = 'w-4 h-4' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="2" y="7" width="17" height="10" rx="2" />
      <path d="M21 10v4" />
      <rect x="4.5" y="9.5" width="9" height="5" fill="currentColor" stroke="none" />
    </svg>
  )
}

function Svg({ className = base, children }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" className={className}>
      {children}
    </svg>
  )
}

export function PokeballIcon({ className = base }) {
  return (
    <Svg className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h6M15 12h6" />
      <circle cx="12" cy="12" r="2.4" fill="currentColor" stroke="none" />
    </Svg>
  )
}

export function CoinIcon({ className = base }) {
  return (
    <Svg className={className}>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v8M9.5 9.5c0-1 1-1.5 2.5-1.5s2.5.6 2.5 1.5-1 1.3-2.5 1.5-2.5.6-2.5 1.5 1 1.5 2.5 1.5 2.5-.5 2.5-1.5" />
    </Svg>
  )
}

export function BookIcon({ className = base }) {
  return (
    <Svg className={className}>
      <path d="M4 5.5C4 4.7 4.7 4 5.5 4H12v16H5.5A1.5 1.5 0 0 1 4 18.5z" />
      <path d="M20 5.5c0-.8-.7-1.5-1.5-1.5H12v16h6.5a1.5 1.5 0 0 0 1.5-1.5z" />
    </Svg>
  )
}

export function GraduationCapIcon({ className = base }) {
  return (
    <Svg className={className}>
      <path d="M2 8l10-4 10 4-10 4-10-4z" />
      <path d="M6 10.5V16c0 1 2.7 2 6 2s6-1 6-2v-5.5" />
      <path d="M22 8v6" />
    </Svg>
  )
}

export function EggIcon({ className = base }) {
  return (
    <Svg className={className}>
      <path d="M12 2C8 7 5 11.5 5 15a7 7 0 0 0 14 0c0-3.5-3-8-7-13z" />
    </Svg>
  )
}

export function RulerIcon({ className = base }) {
  return (
    <Svg className={className}>
      <rect x="4" y="7" width="16" height="10" rx="1.5" />
      <path d="M8 7v3M12 7v4M16 7v3" />
    </Svg>
  )
}

export function WeightIcon({ className = base }) {
  return (
    <Svg className={className}>
      <path d="M7 8h10l2 12H5z" />
      <path d="M9 8a3 3 0 0 1 6 0" />
    </Svg>
  )
}

export function DropletIcon({ className = base }) {
  return (
    <Svg className={className}>
      <path d="M12 3c4 5 6.5 8.3 6.5 11.5a6.5 6.5 0 0 1-13 0C5.5 11.3 8 8 12 3z" />
    </Svg>
  )
}

export function PawIcon({ className = base }) {
  return (
    <Svg className={className}>
      <circle cx="7" cy="9" r="1.6" />
      <circle cx="12" cy="6.5" r="1.6" />
      <circle cx="17" cy="9" r="1.6" />
      <path d="M8.5 14c0-2 1.5-3 3.5-3s3.5 1 3.5 3-1.5 4-3.5 4-3.5-2-3.5-4z" />
    </Svg>
  )
}

export function LayersIcon({ className = base }) {
  return (
    <Svg className={className}>
      <path d="M12 3l9 5-9 5-9-5z" />
      <path d="M3 13l9 5 9-5" />
    </Svg>
  )
}

export function BoltIcon({ className = base }) {
  return (
    <Svg className={className}>
      <path d="M13 2 4 14h6l-1 8 9-12h-6z" />
    </Svg>
  )
}

export function LinkIcon({ className = base }) {
  return (
    <Svg className={className}>
      <path d="M9 15l6-6" />
      <path d="M8 16.5 5.5 14a3.5 3.5 0 0 1 0-5l2-2a3.5 3.5 0 0 1 5 0" />
      <path d="M16 7.5 18.5 10a3.5 3.5 0 0 1 0 5l-2 2a3.5 3.5 0 0 1-5 0" />
    </Svg>
  )
}

export function ScrollIcon({ className = base }) {
  return (
    <Svg className={className}>
      <path d="M6 4h11a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2z" />
      <path d="M6 4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2" />
      <path d="M9 9h6M9 13h6" />
    </Svg>
  )
}

export function GhostIcon({ className = base }) {
  return (
    <Svg className={className}>
      <path d="M5 20V11a7 7 0 0 1 14 0v9l-2.5-2-2 2-2.5-2-2 2-2.5-2z" />
      <circle cx="9.5" cy="11" r="0.8" fill="currentColor" stroke="none" />
      <circle cx="14.5" cy="11" r="0.8" fill="currentColor" stroke="none" />
    </Svg>
  )
}

export const CLUE_ICONS = {
  generation: GraduationCapIcon,
  egg_group: EggIcon,
  height_range: RulerIcon,
  weight_range: WeightIcon,
  type: DropletIcon,
  species: PawIcon,
  evolution_stage: LayersIcon,
  ability: BoltIcon,
  evolution_chain: LinkIcon,
  pokedex_entry: ScrollIcon,
  silhouette: GhostIcon,
}

/* --- added for Pokedex / Stats / Achievements / Regions tabs --- */

export function TrophyIcon({ className = base }) {
  return (
    <Svg className={className}>
      <path d="M7 4h10v4a5 5 0 0 1-10 0z" />
      <path d="M7 5H4v2a3 3 0 0 0 3 3M17 5h3v2a3 3 0 0 1-3 3" />
      <path d="M12 13v3M9 20h6M10 17h4v3h-4z" />
    </Svg>
  )
}

export function TargetIcon({ className = base }) {
  return (
    <Svg className={className}>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
    </Svg>
  )
}

export function ClockIcon({ className = base }) {
  return (
    <Svg className={className}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </Svg>
  )
}

export function StarIcon({ className = base }) {
  return (
    <Svg className={className}>
      <path d="M12 3.5l2.6 5.3 5.9.8-4.3 4.1 1 5.8L12 16.6l-5.2 2.7 1-5.8-4.3-4.1 5.9-.8z" />
    </Svg>
  )
}

export function EyeIcon({ className = base }) {
  return (
    <Svg className={className}>
      <path d="M2 12s3.5-6.5 10-6.5S22 12 22 12s-3.5 6.5-10 6.5S2 12 2 12z" />
      <circle cx="12" cy="12" r="2.5" />
    </Svg>
  )
}

export function TagIcon({ className = base }) {
  return (
    <Svg className={className}>
      <path d="M12 3h6a2 2 0 0 1 2 2v6l-9 9-8-8z" />
      <circle cx="15" cy="8" r="1.2" fill="currentColor" stroke="none" />
    </Svg>
  )
}

export function MedalIcon({ className = base }) {
  return (
    <Svg className={className}>
      <circle cx="12" cy="14" r="6" />
      <path d="M9 8.5 7 3h3l2 5M15 8.5 17 3h-3l-2 5" />
      <path d="M10 14l1.4 1.4L14.5 12" />
    </Svg>
  )
}

export function LockIcon({ className = base }) {
  return (
    <Svg className={className}>
      <rect x="5" y="10.5" width="14" height="9" rx="1.5" />
      <path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" />
    </Svg>
  )
}

export function MapIcon({ className = base }) {
  return (
    <Svg className={className}>
      <path d="M9 4 4 6v14l5-2 6 2 5-2V4l-5 2-6-2z" />
      <path d="M9 4v14M15 6v14" />
    </Svg>
  )
}

export function HourglassIcon({ className = base }) {
  return (
    <Svg className={className}>
      <path d="M6 3h12M6 21h12" />
      <path d="M7 3v3.5c0 2 2 3.5 5 5.5-3 2-5 3.5-5 5.5V21M17 3v3.5c0 2-2 3.5-5 5.5 3 2 5 3.5 5 5.5V21" />
    </Svg>
  )
}

export function CheckIcon({ className = base }) {
  return (
    <Svg className={className}>
      <path d="M5 12.5 9.5 17 19 7" />
    </Svg>
  )
}