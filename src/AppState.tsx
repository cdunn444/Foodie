import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Constraints, Place, Settings } from './types';
import {
  loadConstraints,
  loadLibrary,
  loadSettings,
  saveConstraints,
  saveLibrary,
  saveSettings,
} from './storage';

interface AppState {
  ready: boolean;
  library: Place[];
  constraints: Constraints;
  settings: Settings;
  addPlace: (place: Place) => void;
  removePlace: (id: string) => void;
  updateConstraints: (constraints: Constraints) => void;
  updateSettings: (settings: Settings) => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [library, setLibrary] = useState<Place[]>([]);
  const [constraints, setConstraints] = useState<Constraints>({
    dietary: [],
    exceptions: [],
    note: '',
  });
  const [settings, setSettings] = useState<Settings>({
    apiKey: '',
    destinationMode: false,
  });

  useEffect(() => {
    (async () => {
      const [lib, cons, sett] = await Promise.all([
        loadLibrary(),
        loadConstraints(),
        loadSettings(),
      ]);
      setLibrary(lib);
      setConstraints(cons);
      setSettings(sett);
      setReady(true);
    })();
  }, []);

  const addPlace = useCallback((place: Place) => {
    setLibrary((prev) => {
      const next = [...prev.filter((p) => p.id !== place.id), place];
      saveLibrary(next);
      return next;
    });
  }, []);

  const removePlace = useCallback((id: string) => {
    setLibrary((prev) => {
      const next = prev.filter((p) => p.id !== id);
      saveLibrary(next);
      return next;
    });
  }, []);

  const updateConstraints = useCallback((next: Constraints) => {
    setConstraints(next);
    saveConstraints(next);
  }, []);

  const updateSettings = useCallback((next: Settings) => {
    setSettings(next);
    saveSettings(next);
  }, []);

  return (
    <AppContext.Provider
      value={{
        ready,
        library,
        constraints,
        settings,
        addPlace,
        removePlace,
        updateConstraints,
        updateSettings,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
