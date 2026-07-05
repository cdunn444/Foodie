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
import { DAYPARTS, MODES, OCCASIONS } from '../modes';
import { Daypart, ModeId } from '../types';
import { ModeCard } from '../components/ModeCard';
import { Chip } from '../components/Chip';
import { useApp } from '../AppState';
import { Nav } from '../navigation';

export function MoodScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const { settings } = useApp();

  const [mode, setMode] = useState<ModeId | null>(null);
  const [city, setCity] = useState('');
  const [daypart, setDaypart] = useState<Daypart | null>(null);
  const [occasion, setOccasion] = useState<string | null>(null);

  const modes = MODES.filter((m) => m.id !== 'destination' || settings.destinationMode);
  const canSearch = mode !== null && city.trim().length > 1;

  const search = () => {
    if (!mode || !canSearch) return;
    navigation.navigate('Results', {
      input: { mode, city: city.trim(), daypart, occasion },
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + space.l, paddingBottom: insets.bottom + space.xl },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.headerRow}>
          <Text style={styles.wordmark}>palate</Text>
          <View style={styles.headerLinks}>
            <Pressable onPress={() => navigation.navigate('Library')} hitSlop={8}>
              <Text style={styles.headerLink}>library</Text>
            </Pressable>
            <Pressable onPress={() => navigation.navigate('Settings')} hitSlop={8}>
              <Text style={styles.headerLink}>settings</Text>
            </Pressable>
          </View>
        </View>

        <Text style={styles.hero}>What are you in the{'\n'}mood for?</Text>

        <View style={styles.modes}>
          {modes.map((m) => (
            <ModeCard
              key={m.id}
              mode={m}
              selected={mode === m.id}
              onPress={() => setMode(m.id)}
            />
          ))}
        </View>

        <Text style={styles.fieldLabel}>Where</Text>
        <TextInput
          style={styles.cityInput}
          value={city}
          onChangeText={setCity}
          placeholder="City — e.g. Austin, TX"
          placeholderTextColor={colors.boneFaint}
          autoCapitalize="words"
          returnKeyType="search"
          onSubmitEditing={search}
        />

        <Text style={styles.fieldLabel}>When (optional)</Text>
        <View style={styles.chipRow}>
          {DAYPARTS.map((d) => (
            <Chip
              key={d}
              label={d}
              selected={daypart === d}
              onPress={() => setDaypart(daypart === d ? null : d)}
            />
          ))}
        </View>

        <Text style={styles.fieldLabel}>Occasion (optional)</Text>
        <View style={styles.chipRow}>
          {OCCASIONS.map((o) => (
            <Chip
              key={o}
              label={o}
              selected={occasion === o}
              onPress={() => setOccasion(occasion === o ? null : o)}
            />
          ))}
        </View>

        <Pressable
          onPress={search}
          disabled={!canSearch}
          style={[styles.searchButton, !canSearch && styles.searchButtonDisabled]}
        >
          <Text style={[styles.searchLabel, !canSearch && styles.searchLabelDisabled]}>
            Find my places
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: space.l,
  },
  wordmark: {
    fontFamily: fonts.displayItalic,
    fontSize: type.heading,
    color: colors.marigold,
  },
  headerLinks: {
    flexDirection: 'row',
    gap: 20,
  },
  headerLink: {
    fontFamily: fonts.bodyMedium,
    fontSize: type.small,
    color: colors.boneOnInk,
  },
  hero: {
    fontFamily: fonts.display,
    fontSize: type.hero,
    lineHeight: 40,
    color: colors.bone,
    marginBottom: space.l,
  },
  modes: {
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
  cityInput: {
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
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  searchButton: {
    marginTop: space.l,
    backgroundColor: colors.marigold,
    borderRadius: radius.card,
    paddingVertical: 16,
    alignItems: 'center',
  },
  searchButtonDisabled: {
    backgroundColor: colors.inkRaised,
  },
  searchLabel: {
    fontFamily: fonts.bodySemiBold,
    fontSize: type.body,
    color: colors.ink,
  },
  searchLabelDisabled: {
    color: colors.boneFaint,
  },
});
