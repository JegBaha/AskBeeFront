import { useEffect } from 'react';
import { Typography, Colors, Spacings } from 'react-native-ui-lib';

export function useFrameworkReady() {
  useEffect(() => {
    // Initialize framework components
    Typography.loadTypographies({
      h1: { fontSize: 32, fontWeight: 'bold' },
      h2: { fontSize: 24, fontWeight: 'bold' },
      h3: { fontSize: 18, fontWeight: 'bold' },
      text: { fontSize: 16 },
      small: { fontSize: 14 },
    });

    Colors.loadColors({
      primary: '#4A90E2',
      secondary: '#FF6B6B',
      accent: '#FFB347',
      textPrimary: '#2D3436',
      textSecondary: '#636E72',
      background: '#F8F9FA',
    });

    Spacings.loadSpacings({
      page: 20,
      card: 12,
      component: 8,
    });
  }, []);
}