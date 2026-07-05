import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts, radius, space, type } from '../theme';
import { useApp } from '../AppState';
import { Nav } from '../navigation';

export function SettingsScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const { settings, updateSettings, constraints, updateConstraints } = useApp();

  const [apiKey, setApiKey] = useState(settings.apiKey);
  const [dietary, setDietary] = useState(constraints.dietary.join(', '));
  const [exceptions, setExceptions] = useState(constraints.exceptions.join(', '));
  const [note, setNote] = useState(constraints.note);

  const splitList = (raw: string) =>
    raw
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

  const save = () => {
    updateSettings({ ...settings, apiKey: apiKey.trim() });
    updateConstraints({
      dietary: splitList(dietary),
      exceptions: splitList(exceptions),
      note: note.trim(),
    });
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
          <Text style={styles.back}>← mood</Text>
        </Pressable>
        <Text style={styles.title}>Settings</Text>

        <Text style={styles.fieldLabel}>Anthropic API key</Text>
        <Text style={styles.fieldHint}>
          The engine calls Claude directly from your phone. Your key stays on this device.
        </Text>
        <TextInput
          style={styles.input}
          value={apiKey}
          onChangeText={setApiKey}
          placeholder="sk-ant-…"
          placeholderTextColor={colors.boneFaint}
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry
        />

        <Text style={styles.fieldLabel}>Dietary constraints</Text>
        <Text style={styles.fieldHint}>Comma-separated. Yours, whatever they are.</Text>
        <TextInput
          style={styles.input}
          value={dietary}
          onChangeText={setDietary}
          placeholder="gluten-free, dairy-free, soy-free"
          placeholderTextColor={colors.boneFaint}
          autoCapitalize="none"
        />

        <Text style={styles.fieldLabel}>Exceptions</Text>
        <TextInput
          style={styles.input}
          value={exceptions}
          onChangeText={setExceptions}
          placeholder="A2 milk permitted"
          placeholderTextColor={colors.boneFaint}
          autoCapitalize="none"
        />

        <Text style={styles.fieldLabel}>Constraint note</Text>
        <TextInput
          style={[styles.input, styles.noteInput]}
          value={note}
          onChangeText={setNote}
          placeholder="How you actually treat the diet when a place is worth it"
          placeholderTextColor={colors.boneFaint}
          multiline
        />

        <View style={styles.switchRow}>
          <View style={styles.switchText}>
            <Text style={styles.switchLabel}>Destination mode</Text>
            <Text style={styles.fieldHint}>
              The meal that is the trip — the tasting menu you book weeks out.
            </Text>
          </View>
          <Switch
            value={settings.destinationMode}
            onValueChange={(v) => updateSettings({ ...settings, destinationMode: v })}
            trackColor={{ false: colors.inkLine, true: colors.marigold }}
            thumbColor={colors.bone}
          />
        </View>

        <Pressable onPress={save} style={styles.saveButton}>
          <Text style={styles.saveLabel}>Save</Text>
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
    fontFamily: fonts.body,
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
    minHeight: 72,
    textAlignVertical: 'top',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginTop: space.l,
  },
  switchText: {
    flex: 1,
  },
  switchLabel: {
    fontFamily: fonts.bodySemiBold,
    fontSize: type.body,
    color: colors.bone,
    marginBottom: 4,
  },
  saveButton: {
    marginTop: space.xl,
    backgroundColor: colors.marigold,
    borderRadius: radius.card,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveLabel: {
    fontFamily: fonts.bodySemiBold,
    fontSize: type.body,
    color: colors.ink,
  },
});
