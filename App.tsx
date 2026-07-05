import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  useFonts,
  Fraunces_600SemiBold,
  Fraunces_500Medium_Italic,
} from '@expo-google-fonts/fraunces';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from '@expo-google-fonts/inter';
import { AppProvider } from './src/AppState';
import { RootStackParamList } from './src/navigation';
import { colors } from './src/theme';
import { MoodScreen } from './src/screens/MoodScreen';
import { ResultsScreen } from './src/screens/ResultsScreen';
import { LibraryScreen } from './src/screens/LibraryScreen';
import { AddPlaceScreen } from './src/screens/AddPlaceScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.ink,
    card: colors.ink,
    text: colors.bone,
    primary: colors.marigold,
  },
};

export default function App() {
  const [fontsLoaded] = useFonts({
    Fraunces_600SemiBold,
    Fraunces_500Medium_Italic,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: colors.ink }} />;
  }

  return (
    <SafeAreaProvider>
      <AppProvider>
        <NavigationContainer theme={navTheme}>
          <StatusBar style="light" />
          <Stack.Navigator
            initialRouteName="Mood"
            screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.ink } }}
          >
            <Stack.Screen name="Mood" component={MoodScreen} />
            <Stack.Screen name="Results" component={ResultsScreen} />
            <Stack.Screen name="Library" component={LibraryScreen} />
            <Stack.Screen name="AddPlace" component={AddPlaceScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </AppProvider>
    </SafeAreaProvider>
  );
}
