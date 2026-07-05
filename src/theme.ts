export const colors = {
  ink: '#161A22',
  inkRaised: '#1F2430',
  inkLine: '#2A3040',
  bone: '#EFE9DD',
  boneDim: '#D8D2C6',
  marigold: '#E8A33D',
  sage: '#8FA68E',
  clay: '#C25B46',
  boneOnInk: 'rgba(239, 233, 221, 0.68)',
  boneFaint: 'rgba(239, 233, 221, 0.38)',
  inkOnBone: '#161A22',
  inkOnBoneSoft: 'rgba(22, 26, 34, 0.62)',
};

export const fonts = {
  display: 'Fraunces_600SemiBold',
  displayItalic: 'Fraunces_500Medium_Italic',
  body: 'Inter_400Regular',
  bodyMedium: 'Inter_500Medium',
  bodySemiBold: 'Inter_600SemiBold',
};

export const type = {
  hero: 34,
  title: 26,
  heading: 20,
  body: 15,
  small: 13,
  micro: 11,
};

export const space = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
};

export const radius = {
  card: 14,
  chip: 999,
  small: 8,
};

export const dietFlagColor = (flag: string): string => {
  switch (flag) {
    case 'easy':
      return colors.sage;
    case 'workable':
      return colors.marigold;
    case 'worth-it':
      return colors.clay;
    case 'hard':
      return colors.clay;
    default:
      return colors.boneFaint;
  }
};
