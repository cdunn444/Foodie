import React, { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors, fonts, radius, type } from '../theme';
import { ModeDef } from '../modes';

interface ModeCardProps {
  mode: ModeDef;
  selected: boolean;
  onPress: () => void;
}

export function ModeCard({ mode, selected, onPress }: ModeCardProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = () => {
    Animated.spring(scale, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 40,
      bounciness: 0,
    }).start();
  };

  const pressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 24,
      bounciness: 9,
    }).start();
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    onPress();
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        onPressIn={pressIn}
        onPressOut={pressOut}
        onPress={handlePress}
        style={[styles.card, selected && styles.cardSelected]}
      >
        <View style={styles.topRow}>
          <Text style={[styles.kind, selected && styles.kindSelected]}>
            {mode.kind === 'peak' ? 'peak' : 'floor'}
          </Text>
        </View>
        <Text style={[styles.name, selected && styles.nameSelected]}>{mode.name}</Text>
        <Text style={[styles.job, selected && styles.jobSelected]}>{mode.job}</Text>
        <Text style={[styles.seeks, selected && styles.seeksSelected]} numberOfLines={2}>
          {mode.seeks}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bone,
    borderRadius: radius.card,
    padding: 18,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: colors.bone,
  },
  cardSelected: {
    backgroundColor: colors.marigold,
    borderColor: colors.marigold,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  kind: {
    fontFamily: fonts.bodySemiBold,
    fontSize: type.micro,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: colors.inkOnBoneSoft,
  },
  kindSelected: {
    color: colors.ink,
  },
  name: {
    fontFamily: fonts.display,
    fontSize: type.title,
    color: colors.ink,
    marginTop: -6,
  },
  nameSelected: {
    color: colors.ink,
  },
  job: {
    fontFamily: fonts.displayItalic,
    fontSize: type.body,
    color: colors.inkOnBoneSoft,
    marginTop: 2,
  },
  jobSelected: {
    color: 'rgba(22, 26, 34, 0.75)',
  },
  seeks: {
    fontFamily: fonts.body,
    fontSize: type.small,
    color: colors.inkOnBoneSoft,
    marginTop: 8,
  },
  seeksSelected: {
    color: 'rgba(22, 26, 34, 0.75)',
  },
});
