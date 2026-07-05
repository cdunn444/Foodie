import { ModeId, Place, RecResult, SearchInput } from './types';
import { modeById } from './modes';

// No-API engine: ranks the user's own library within the selected mode's
// logic. Peak modes reward the standout axes; floor modes reward low fuss
// and diet ease. All heuristics stay generic — no user-specific taste here.

const PEAK_AXES: Partial<Record<ModeId, ('energy' | 'formality' | 'design' | 'crowd' | 'novelty')[]>> = {
  scene: ['energy', 'design', 'crowd'],
  craft: ['design', 'novelty', 'formality'],
  destination: ['design', 'novelty', 'formality'],
};

const norm = (s: string) => s.trim().toLowerCase();

function cityMatches(placeCity: string, searchCity: string): boolean {
  const a = norm(placeCity);
  const b = norm(searchCity);
  if (!a || !b) return false;
  return a.includes(b) || b.includes(a);
}

function scorePlace(place: Place, input: SearchInput): number {
  const mode = modeById(input.mode);
  let score = 55; // it's in your library and in this mode — already a strong start

  if (mode.kind === 'peak') {
    // Reward the standout: average the mode's signature axes where rated.
    const axes = PEAK_AXES[mode.id] ?? [];
    const rated = axes
      .map((k) => place.axes[k])
      .filter((v): v is number => v !== null);
    if (rated.length > 0) {
      const avg = rated.reduce((a, b) => a + b, 0) / rated.length;
      score += (avg - 3) * 8; // 5s push toward the top, 1s sink
    }
    // Worth breaking the diet for is the peak-mode signal, not a penalty.
    if (place.dietFit === 'worth-it') score += 4;
  } else {
    // Floor modes: consistency and ease. Diet friction matters here.
    if (place.dietFit === 'easy') score += 10;
    else if (place.dietFit === 'workable') score += 5;
    else if (place.dietFit === 'hard') score -= 12;
    // A floor place shouldn't be a scene; gently prefer lower energy/crowd.
    const energy = place.axes.energy;
    if (energy !== null) score -= (energy - 3) * 3;
  }

  if (place.nailsSpecialty) score += 6;
  if (place.wouldReturn === 'yes') score += 4;
  if (place.note) score += 4;
  if (place.whatCarriesIt) score += 3;
  if (input.city && cityMatches(place.city, input.city)) score += 14;
  if (input.daypart && place.dayparts.includes(input.daypart)) score += 5;

  return Math.max(40, Math.min(99, Math.round(score)));
}

function whyLine(place: Place): string {
  if (place.note) {
    const firstSentence = place.note.split(/(?<=[.!?])\s/)[0];
    return firstSentence;
  }
  if (place.whatCarriesIt) {
    return `You loved it for ${place.whatCarriesIt}.`;
  }
  return `Your ${place.type.toLowerCase() || 'go-to'} pick in ${place.city}.`;
}

const TITLES: Record<'peak' | 'floor', string[]> = {
  peak: [
    '{mode} energy, no notes',
    'big {mode} night',
    'the {mode} shortlist',
  ],
  floor: [
    'easy {mode} kind of night',
    'no misses tonight',
    'the {mode} regulars',
  ],
};

function makeTitle(input: SearchInput): string {
  const mode = modeById(input.mode);
  const options = TITLES[mode.kind];
  const template = options[Math.floor(Math.random() * options.length)];
  let title = template.replace('{mode}', mode.name.toLowerCase());
  if (input.daypart) title = `${title}, ${input.daypart} edition`;
  return title;
}

export function rankLibrary(library: Place[], input: SearchInput): RecResult {
  let candidates = library.filter((p) => p.modes.includes(input.mode));

  if (input.daypart) {
    const inDaypart = candidates.filter(
      (p) => p.dayparts.length === 0 || p.dayparts.includes(input.daypart!),
    );
    if (inDaypart.length > 0) candidates = inDaypart;
  }

  // Prefer places in the searched city, but fall back to the whole mode
  // rather than returning nothing.
  if (input.city) {
    const inCity = candidates.filter((p) => cityMatches(p.city, input.city));
    if (inCity.length >= 3) candidates = inCity;
  }

  const picks = candidates
    .map((place) => ({
      name: place.name,
      match: scorePlace(place, input),
      why: whyLine(place),
      order: place.whatCarriesIt,
      dietFlag: place.dietFit ?? 'workable',
    }))
    .sort((a, b) => b.match - a.match)
    .slice(0, 8);

  return { title: makeTitle(input), picks };
}
