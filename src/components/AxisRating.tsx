import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, type } from '../theme';

interface AxisRatingProps {
  label: string;
  lowHint: string;
  highHint: string;
  max?: number;
  value: number | null;
  onChange: (value: number | null) => void;
}

// Tap a dot to set the value; tap the current value again to clear it
// (missing axis values are allowed by the data model).
export function AxisRating({
  label,
  lowHint,
  highHint,
  max = 5,
  value,
  onChange,
}: AxisRatingProps) {
  return (
    <View style={styles.row}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.hint}>
          {lowHint} → {highHint}
        </Text>
      </View>
      <View style={styles.dots}>
        {Array.from({ length: max }, (_, i) => i + 1).map((n) => (
          <Pressable
            key={n}
            onPress={() => onChange(value === n ? null : n)}
            style={[styles.dot, value !== null && n <= value && styles.dotFilled]}
            hitSlop={6}
          >
            <Text style={[styles.dotText, value !== null && n <= value && styles.dotTextFilled]}>
              {n}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    marginBottom: 18,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  label: {
    fontFamily: fonts.bodySemiBold,
    fontSize: type.body,
    color: colors.bone,
  },
  hint: {
    fontFamily: fonts.body,
    fontSize: type.micro,
    color: colors.boneFaint,
  },
  dots: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.inkLine,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotFilled: {
    backgroundColor: colors.marigold,
    borderColor: colors.marigold,
  },
  dotText: {
    fontFamily: fonts.bodyMedium,
    fontSize: type.small,
    color: colors.boneFaint,
  },
  dotTextFilled: {
    color: colors.ink,
  },
});
