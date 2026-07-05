import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, fonts, radius, type } from '../theme';

interface ChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

export function Chip({ label, selected, onPress }: ChipProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, selected && styles.chipSelected]}
      hitSlop={4}
    >
      <Text style={[styles.label, selected && styles.labelSelected]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: radius.chip,
    borderWidth: 1,
    borderColor: colors.inkLine,
    backgroundColor: 'transparent',
    marginRight: 8,
    marginBottom: 8,
  },
  chipSelected: {
    backgroundColor: colors.marigold,
    borderColor: colors.marigold,
  },
  label: {
    fontFamily: fonts.bodyMedium,
    fontSize: type.small,
    color: colors.boneOnInk,
  },
  labelSelected: {
    color: colors.ink,
  },
});
