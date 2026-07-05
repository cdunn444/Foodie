import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SearchInput } from './types';

export type RootStackParamList = {
  Mood: undefined;
  Results: { input: SearchInput };
  Library: undefined;
  AddPlace: undefined;
  Settings: undefined;
};

export type Nav = NativeStackNavigationProp<RootStackParamList>;
