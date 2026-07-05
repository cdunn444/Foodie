import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts, radius, space, type } from '../theme';
import { DAYPARTS, MODES } from '../modes';
import { Axes, AxisKey, Daypart, DietFit, ModeId, Place } from '../types';
import { Chip } from '../components/Chip';
import { AxisRating } from '../components/AxisRating';
import { useApp } from '../AppState';
import { Nav } from '../navigation';

const AXES: { key: AxisKey; label: string; low: string; high: string; max: number }[] = [
  { key: 'energy', label: 'Energy', low: 'dead quiet', high: 'buzzing', max: 5 },
  { key: 'formality', label: 'Formality', low: 'dive', high: 'fine dining', max: 5 },
  { key: 'design', label: 'Design', low: 'generic', high: 'highly intentional', max: 5 },
  { key: 'crowd', label: 'Crowd', low: 'neighborhood locals', high: 'destination/scene', max: 5 },
  { key: 'novelty', label: 'Novelty', low: 'comfort/familiar', high: 'experimental', max: 5 },
  { key: 'price', label: 'Price', low: '$', high: '$$$$', max: 4 },
];

const DIET_FITS: DietFit[] = ['easy', 'workable', 'worth-it', 'hard'];

const slugify = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || `place-${Date.now()}`;

export function AddPlaceScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const { addPlace } = useApp();

  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [placeType, setPlaceType] = useState('');
  const [note, setNote] = useState('');
  const [modes, setModes] = useState<ModeId[]>([]);
  const [dayparts, setDayparts] = useState<Daypart[]>([]);
  const [axes, setAxes] = useState<Axes>({
    energy: null,
    formality: null,
    design: null,
    crowd: null,
    novelty: null,
    price: null,
  });
  const [whatCarriesIt, setWhatCarriesIt] = useState('');
  const [dietFit, setDietFit] = useState<DietFit | null>(null);

  const toggleMode = (id: ModeId) =>
    setModes((prev) => (prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]));

  const toggleDaypart = (d: Daypart) =>
    setDayparts((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]));

  const canSave = name.trim().length > 0 && city.trim().length > 0 && modes.length > 0;

  const save = () => {
    if (!canSave) return;
    const place: Place = {
      id: slugify(name.trim()),
      name: name.trim(),
      city: city.trim(),
      type: placeType.trim(),
      modes,
      dayparts,
      axes,
      axisNotes: {},
      nailsSpecialty: true,
      whatCarriesIt: whatCarriesIt.trim(),
      wouldReturn: 'yes',
      dietFit,
      note: note.trim(),
    };
    addPlace(place);
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + space.m, paddingBottom: insets.bottom + space.xl },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <Text style={styles.back}>← library</Text>
        </Pressable>
        <Text style={styles.title}>Add a place</Text>

        <Text style={styles.fieldLabel}>Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="The place you love"
          placeholderTextColor={colors.boneFaint}
          autoCapitalize="words"
        />

        <View style={styles.pairRow}>
          <View style={styles.pairItem}>
            <Text style={styles.fieldLabel}>City</Text>
            <TextInput
              style={styles.input}
              value={city}
              onChangeText={setCity}
              placeholder="Miami, FL"
              placeholderTextColor={colors.boneFaint}
              autoCapitalize="words"
            />
          </View>
          <View style={styles.pairItem}>
            <Text style={styles.fieldLabel}>Type</Text>
            <TextInput
              style={styles.input}
              value={placeType}
              onChangeText={setPlaceType}
              placeholder="Tacos, Italian…"
              placeholderTextColor={colors.boneFaint}
              autoCapitalize="words"
            />
          </View>
        </View>

        {/* The note is the highest-signal field in the schema — keep it up top. */}
        <Text style={styles.fieldLabel}>The note</Text>
        <Text style={styles.fieldHint}>
          The one thing you'd tell a friend. "Get the branzino, brutal for groups, the
          natural wine is the reason to go."
        </Text>
        <TextInput
          style={[styles.input, styles.noteInput]}
          value={note}
          onChangeText={setNote}
          placeholder="This tells the engine more than all six ratings combined"
          placeholderTextColor={colors.boneFaint}
          multiline
        />

        <Text style={styles.fieldLabel}>Mode(s)</Text>
        <View style={styles.chipRow}>
          {MODES.map((m) => (
            <Chip
              key={m.id}
              label={m.name.toLowerCase()}
              selected={modes.includes(m.id)}
              onPress={() => toggleMode(m.id)}
            />
          ))}
        </View>

        <Text style={styles.fieldLabel}>Daypart(s)</Text>
        <View style={styles.chipRow}>
          {DAYPARTS.map((d) => (
            <Chip
              key={d}
              label={d}
              selected={dayparts.includes(d)}
              onPress={() => toggleDaypart(d)}
            />
          ))}
        </View>

        <Text style={styles.fieldLabel}>What it is (not whether it's good)</Text>
        <View style={styles.axes}>
          {AXES.map((axis) => (
            <AxisRating
              key={axis.key}
              label={axis.label}
              lowHint={axis.low}
              highHint={axis.high}
              max={axis.max}
              value={axes[axis.key]}
              onChange={(v) => setAxes((prev) => ({ ...prev, [axis.key]: v }))}
            />
          ))}
        </View>

        <Text style={styles.fieldLabel}>What carries it</Text>
        <TextInput
          style={styles.input}
          value={whatCarriesIt}
          onChangeText={setWhatCarriesIt}
          placeholder="the dumplings, the room, the setting…"
          placeholderTextColor={colors.boneFaint}
        />

        <Text style={styles.fieldLabel}>Diet fit</Text>
        <View style={styles.chipRow}>
          {DIET_FITS.map((d) => (
            <Chip
              key={d}
              label={d}
              selected={dietFit === d}
              onPress={() => setDietFit(dietFit === d ? null : d)}
            />
          ))}
        </View>

        <Pressable
          onPress={save}
          disabled={!canSave}
          style={[styles.saveButton, !canSave && styles.saveButtonDisabled]}
        >
          <Text style={[styles.saveLabel, !canSave && styles.saveLabelDisabled]}>
            Save to library
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.ink,
  },
  content: {
    paddingHorizontal: space.l,
  },
  back: {
    fontFamily: fonts.bodyMedium,
    fontSize: type.small,
    color: colors.boneOnInk,
    marginBottom: space.m,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: type.hero,
    color: colors.bone,
    marginBottom: space.m,
  },
  fieldLabel: {
    fontFamily: fonts.bodySemiBold,
    fontSize: type.micro,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: colors.boneFaint,
    marginTop: space.m,
    marginBottom: space.s,
  },
  fieldHint: {
    fontFamily: fonts.displayItalic,
    fontSize: type.small,
    lineHeight: 18,
    color: colors.boneOnInk,
    marginBottom: space.s,
  },
  input: {
    backgroundColor: colors.inkRaised,
    borderRadius: radius.small,
    borderWidth: 1,
    borderColor: colors.inkLine,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: fonts.body,
    fontSize: type.body,
    color: colors.bone,
  },
  noteInput: {
    minHeight: 88,
    textAlignVertical: 'top',
    borderColor: colors.marigold,
  },
  pairRow: {
    flexDirection: 'row',
    gap: 12,
  },
  pairItem: {
    flex: 1,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  axes: {
    marginTop: space.s,
  },
  saveButton: {
    marginTop: space.l,
    backgroundColor: colors.marigold,
    borderRadius: radius.card,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: colors.inkRaised,
  },
  saveLabel: {
    fontFamily: fonts.bodySemiBold,
    fontSize: type.body,
    color: colors.ink,
  },
  saveLabelDisabled: {
    color: colors.boneFaint,
  },
});
