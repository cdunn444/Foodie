import { Daypart, ModeId } from './types';

export interface ModeDef {
  id: ModeId;
  name: string;
  kind: 'peak' | 'floor';
  job: string;
  seeks: string;
}

export const MODES: ModeDef[] = [
  {
    id: 'scene',
    name: 'Scene',
    kind: 'peak',
    job: 'The night out',
    seeks: 'Max energy + design, price no object',
  },
  {
    id: 'craft',
    name: 'Craft',
    kind: 'peak',
    job: 'The room and the cooking',
    seeks: 'Max design + nails a specialty',
  },
  {
    id: 'solid-easy',
    name: 'Solid & easy',
    kind: 'floor',
    job: 'One thing done great, plain wrapper',
    seeks: 'High execution on its specialty, low fuss',
  },
  {
    id: 'reliable-local',
    name: 'Reliable local',
    kind: 'floor',
    job: 'The safe local call, no misses',
    seeks: 'Broad competence, low variance',
  },
  {
    id: 'destination',
    name: 'Destination',
    kind: 'peak',
    job: 'The meal that is the trip',
    seeks: 'Book weeks out, the whole night bends to it',
  },
];

export const modeById = (id: ModeId): ModeDef => {
  const mode = MODES.find((m) => m.id === id);
  if (!mode) throw new Error(`Unknown mode: ${id}`);
  return mode;
};

export const DAYPARTS: Daypart[] = [
  'breakfast',
  'brunch',
  'lunch',
  'dinner',
  'coffee',
  'drinks',
  'late-night',
];

export const OCCASIONS = ['date', 'solo', 'group', 'work'];
