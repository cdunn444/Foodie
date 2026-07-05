import AsyncStorage from '@react-native-async-storage/async-storage';
import { Constraints, Place, Settings } from './types';
import seed from './data/seed.json';

const KEYS = {
  library: 'palate:library',
  constraints: 'palate:constraints',
  settings: 'palate:settings',
};

const seedPlaces = seed.places as unknown as Place[];
const seedConstraints = seed.constraints as unknown as Constraints;

const DEFAULT_SETTINGS: Settings = {
  apiKey: '',
  destinationMode: false,
};

export async function loadLibrary(): Promise<Place[]> {
  const raw = await AsyncStorage.getItem(KEYS.library);
  if (!raw) return seedPlaces;
  try {
    return JSON.parse(raw) as Place[];
  } catch {
    return seedPlaces;
  }
}

export async function saveLibrary(places: Place[]): Promise<void> {
  await AsyncStorage.setItem(KEYS.library, JSON.stringify(places));
}

export async function loadConstraints(): Promise<Constraints> {
  const raw = await AsyncStorage.getItem(KEYS.constraints);
  if (!raw) return seedConstraints;
  try {
    return JSON.parse(raw) as Constraints;
  } catch {
    return seedConstraints;
  }
}

export async function saveConstraints(constraints: Constraints): Promise<void> {
  await AsyncStorage.setItem(KEYS.constraints, JSON.stringify(constraints));
}

export async function loadSettings(): Promise<Settings> {
  const raw = await AsyncStorage.getItem(KEYS.settings);
  if (!raw) return DEFAULT_SETTINGS;
  try {
    return { ...DEFAULT_SETTINGS, ...(JSON.parse(raw) as Partial<Settings>) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function saveSettings(settings: Settings): Promise<void> {
  await AsyncStorage.setItem(KEYS.settings, JSON.stringify(settings));
}
