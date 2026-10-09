export type Group = 'Platform' | 'Self-hosted' | 'Small service' | 'Experiment'

export interface Screen {
  /** Path under public/ — an HTML design page (Nth `.sy` shell shown) or an image. */
  src: string
  /** Which `.sy` app shell of the page to show. Default 0. */
  t?: number
}

export interface Feature {
  /** 1–3 words, noun phrase. */
  title: string
  /** What it does, concretely. ≤ 16 words. */
  line: string
  screen?: Screen
  /** 3–5 sentences: problem → decision → consequence. */
  explainer?: string
}

export interface System {
  name: string
  group: Group
  /** OKLCH hue, 0–360. Unique per system. */
  h: number
  /** ≤ 7 words, a claim not a category. */
  tag?: string
  /** Two sentences. */
  blurb?: string
  /** " · " separated, most important first, ≤ 4. */
  lang?: string
  surfaces?: string
  /** ≤ 6 words. */
  design?: string
  /** Rendered architecture map (FOLIO-3) — omit if none. */
  arch?: string
  /** Fallback screen when a feature has none. */
  img?: string
  /** In development: tile shows "In dev", no dossier unless it also has features. */
  pending?: boolean
  features?: Feature[]
}
