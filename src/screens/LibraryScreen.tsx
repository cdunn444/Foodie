import React from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, dietFlagColor, fonts, radius, space, type } from '../theme';
import { MODES } from '../modes';
import { useApp } from '../AppState';
import { Nav } from '../navigation';
import { Place } from '../types';

function PlaceRow({ place, onLongPress }: { place: Place; onLongPress: () => void }) {
  return (
    <Pressable onLongPress={onLongPress} style={styles.placeRow}>
      <View style={styles.placeMain}>
        <Text style={styles.placeName}>{place.name}</Text>
        <Text style={styles.placeMeta}>
          {place.type} · {place.city}
        </Text>
        {place.whatCarriesIt ? (
          <Text style={styles.placeCarries}>{place.whatCarriesIt}</Text>
        ) : null}
        {place.note ? (
          <Text style={styles.placeNote} numberOfLines={2}>
            {place.note}
          </Text>
        ) : null}
      </View>
      {place.dietFit ? (
        <View style={[styles.dietDot, { backgroundColor: dietFlagColor(place.dietFit) }]} />
      ) : null}
    </Pressable>
  );
}

export function LibraryScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const { library, removePlace } = useApp();

  const confirmRemove = (place: Place) => {
    Alert.alert('Remove place', `Remove ${place.name} from your library?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => removePlace(place.id) },
    ]);
  };

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + space.m, paddingBottom: insets.bottom + 96 },
        ]}
      >
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <Text style={styles.back}>← mood</Text>
        </Pressable>
        <Text style={styles.title}>Your library</Text>

        {library.length === 0 && (
          <Text style={styles.empty}>Add a place you love to start.</Text>
        )}

        {MODES.map((mode) => {
          const places = library.filter((p) => p.modes.includes(mode.id));
          if (places.length === 0) return null;
          return (
            <View key={mode.id} style={styles.section}>
              <Text style={styles.sectionTitle}>{mode.name}</Text>
              {places.map((place) => (
                <PlaceRow
                  key={`${mode.id}-${place.id}`}
                  place={place}
                  onLongPress={() => confirmRemove(place)}
                />
              ))}
            </View>
          );
        })}
      </ScrollView>

      <Pressable
        onPress={() => navigation.navigate('AddPlace')}
        style={[styles.addButton, { bottom: insets.bottom + space.l }]}
      >
        <Text style={styles.addLabel}>+ Add a place</Text>
      </Pressable>
    </View>
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
    marginBottom: space.l,
  },
  empty: {
    fontFamily: fonts.displayItalic,
    fontSize: type.body,
    color: colors.boneOnInk,
    marginTop: space.l,
  },
  section: {
    marginBottom: space.l,
  },
  sectionTitle: {
    fontFamily: fonts.displayItalic,
    fontSize: type.heading,
    color: colors.marigold,
    marginBottom: space.s,
  },
  placeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.inkRaised,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.inkLine,
    padding: 14,
    marginBottom: 8,
  },
  placeMain: {
    flex: 1,
  },
  placeName: {
    fontFamily: fonts.bodySemiBold,
    fontSize: type.body,
    color: colors.bone,
  },
  placeMeta: {
    fontFamily: fonts.body,
    fontSize: type.small,
    color: colors.boneFaint,
    marginTop: 2,
  },
  placeCarries: {
    fontFamily: fonts.displayItalic,
    fontSize: type.small,
    color: colors.marigold,
    marginTop: 4,
  },
  placeNote: {
    fontFamily: fonts.body,
    fontSize: type.small,
    lineHeight: 18,
    color: colors.boneOnInk,
    marginTop: 4,
  },
  dietDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginLeft: 10,
    marginTop: 5,
  },
  addButton: {
    position: 'absolute',
    left: space.l,
    right: space.l,
    backgroundColor: colors.marigold,
    borderRadius: radius.card,
    paddingVertical: 16,
    alignItems: 'center',
  },
  addLabel: {
    fontFamily: fonts.bodySemiBold,
    fontSize: type.body,
    color: colors.ink,
  },
});
