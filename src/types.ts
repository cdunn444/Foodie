export type ModeId = 'scene' | 'craft' | 'solid-easy' | 'reliable-local' | 'destination';

export type Daypart =
  | 'breakfast'
  | 'brunch'
  | 'lunch'
  | 'dinner'
  | 'coffee'
  | 'drinks'
  | 'late-night';

export type DietFit = 'easy' | 'workable' | 'worth-it' | 'hard';

export type AxisKey = 'energy' | 'formality' | 'design' | 'crowd' | 'novelty' | 'price';

export type Axes = Record<AxisKey, number | null>;

export interface Place {
  id: string;
  name: string;
  city: string;
  type: string;
  modes: ModeId[];
  dayparts: Daypart[];
  axes: Axes;
  axisNotes: Partial<Record<AxisKey, string>>;
  nailsSpecialty: boolean;
  whatCarriesIt: string;
  wouldReturn: string;
  dietFit: DietFit | null;
  note: string;
}

export interface Constraints {
  dietary: string[];
  exceptions: string[];
  note: string;
}

export interface Settings {
  apiKey: string;
  destinationMode: boolean;
}

export interface SearchInput {
  mode: ModeId;
  city: string;
  daypart: Daypart | null;
  occasion: string | null;
}

export interface RecPick {
  name: string;
  match: number;
  why: string;
  order: string;
  dietFlag: DietFit | string;
}

export interface RecResult {
  title: string;
  picks: RecPick[];
}
