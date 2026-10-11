import { ExpoConfig } from '@expo/config';

const config: ExpoConfig = {
  name: 'Deus ex machina',
  slug: 'deus-mobile',
  scheme: 'deusmobile',
  version: '1.0.0',
  orientation: 'portrait',
  userInterfaceStyle: 'automatic',
  icon: './assets/icon.png',
  updates: { enabled: false },
  android: {
    package: 'ru.lex42.deus',
    versionCode: 1,
    allowBackup: false,
    adaptiveIcon: { foregroundImage: './assets/adaptive-icon.png', backgroundColor: '#000000' },
  },
  plugins: [
    'expo-router', 'expo-localization', 'expo-asset', 'expo-secure-store',
    ['expo-splash-screen', { image: './assets/splash-dark.png', backgroundColor: '#000000', imageWidth: 100 }],
    ['expo-image-picker', { photosPermission: 'Выбор изображений для чата Deus.', cameraPermission: 'Фото для чата Deus.' }],
    ['expo-audio', { microphonePermission: 'Запись голоса для Deus.', enableBackgroundPlayback: false, enableBackgroundRecording: false }],
    ['expo-build-properties', { android: { usesCleartextTraffic: false } }],
  ],
  extra: { env: 'production' },
};
export default config;

