import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, dietFlagColor, fonts, radius, space, type } from '../theme';
import { RootStackParamList, Nav } from '../navigation';
import { useApp } from '../AppState';
import { recommend } from '../engine';
import { RecPick, RecResult } from '../types';
import { modeById } from '../modes';

type ResultsRoute = RouteProp<RootStackParamList, 'Results'>;

const LOADING_LINES = [
  'reading your library…',
  'learning the pattern…',
  'searching the city…',
  'ranking for your mode…',
];

function PickCard({ pick, index }: { pick: RecPick; index: number }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translate = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 340,
        delay: index * 90,
        useNativeDriver: true,
      }),
      Animated.timing(translate, {
        toValue: 0,
        duration: 340,
        delay: index * 90,
        useNativeDriver: true,
      }),
    ]).start();
  }, [index, opacity, translate]);

  return (
    <Animated.View
      style={[styles.card, { opacity, transform: [{ translateY: translate }] }]}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardName} numberOfLines={2}>
          {pick.name}
        </Text>
        <Text style={styles.cardMatch}>{pick.match}</Text>
      </View>
      <Text style={styles.cardWhy}>{pick.why}</Text>
      {pick.order ? <Text style={styles.cardOrder}>order: {pick.order}</Text> : null}
      <View style={[styles.dietFlag, { backgroundColor: dietFlagColor(pick.dietFlag) }]}>
        <Text style={styles.dietFlagText}>{pick.dietFlag}</Text>
      </View>
    </Animated.View>
  );
}

export function ResultsScreen() {
  const route = useRoute<ResultsRoute>();
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const { library, constraints, settings } = useApp();
  const { input } = route.params;

  const [result, setResult] = useState<RecResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingLine, setLoadingLine] = useState(0);

  const run = useCallback(() => {
    setResult(null);
    setError(null);
    recommend(settings.apiKey, library, constraints, input)
      .then(setResult)
      .catch((e: unknown) => {
        setError(e instanceof Error ? e.message : 'Something went wrong.');
      });
  }, [settings.apiKey, library, constraints, input]);

  useEffect(run, [run]);

  useEffect(() => {
    if (result || error) return;
    const timer = setInterval(
      () => setLoadingLine((n) => (n + 1) % LOADING_LINES.length),
      2600,
    );
    return () => clearInterval(timer);
  }, [result, error]);

  const mode = modeById(input.mode);

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + space.m, paddingBottom: insets.bottom + space.xl },
      ]}
    >
      <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
        <Text style={styles.back}>← mood</Text>
      </Pressable>

      <Text style={styles.context}>
        {mode.name.toLowerCase()} · {input.city.toLowerCase()}
        {input.daypart ? ` · ${input.daypart}` : ''}
      </Text>

      {!result && !error && (
        <View style={styles.loading}>
          <ActivityIndicator color={colors.marigold} size="large" />
          <Text style={styles.loadingText}>{LOADING_LINES[loadingLine]}</Text>
        </View>
      )}

      {error && (
        <View style={styles.loading}>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable onPress={run} style={styles.retryButton}>
            <Text style={styles.retryLabel}>Try again</Text>
          </Pressable>
        </View>
      )}

      {result && (
        <>
          <Text style={styles.title}>{result.title}</Text>
          {result.picks.map((pick, i) => (
            <PickCard key={`${pick.name}-${i}`} pick={pick} index={i} />
          ))}
        </>
      )}
    </ScrollView>
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
  context: {
    fontFamily: fonts.bodySemiBold,
    fontSize: type.micro,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: colors.boneFaint,
    marginBottom: space.s,
  },
  title: {
    fontFamily: fonts.displayItalic,
    fontSize: type.title,
    lineHeight: 32,
    color: colors.marigold,
    marginBottom: space.l,
  },
  loading: {
    marginTop: 120,
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontFamily: fonts.displayItalic,
    fontSize: type.body,
    color: colors.boneOnInk,
  },
  errorText: {
    fontFamily: fonts.body,
    fontSize: type.body,
    color: colors.clay,
    textAlign: 'center',
    paddingHorizontal: space.l,
  },
  retryButton: {
    backgroundColor: colors.marigold,
    borderRadius: radius.small,
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  retryLabel: {
    fontFamily: fonts.bodySemiBold,
    fontSize: type.small,
    color: colors.ink,
  },
  card: {
    backgroundColor: colors.bone,
    borderRadius: radius.card,
    padding: 18,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  cardName: {
    flex: 1,
    fontFamily: fonts.display,
    fontSize: type.heading,
    color: colors.ink,
  },
  cardMatch: {
    fontFamily: fonts.display,
    fontSize: type.heading,
    color: colors.clay,
  },
  cardWhy: {
    fontFamily: fonts.body,
    fontSize: type.body,
    lineHeight: 21,
    color: colors.inkOnBone,
    marginTop: 6,
  },
  cardOrder: {
    fontFamily: fonts.bodyMedium,
    fontSize: type.small,
    color: colors.inkOnBoneSoft,
    marginTop: 8,
  },
  dietFlag: {
    alignSelf: 'flex-start',
    borderRadius: radius.chip,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginTop: 10,
  },
  dietFlagText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: type.micro,
    color: colors.ink,
  },
});
