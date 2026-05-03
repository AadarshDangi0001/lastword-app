import { Text, View } from 'react-native';
import AppContainer from '../../src/components/layout/AppContainer';
import { API_URL } from '../../src/config/env';

export default function SettingsScreen() {
  return (
    <AppContainer>
      <Text className="text-2xl font-bold text-slate-900">Settings</Text>
      <View className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <Text className="text-xs font-semibold uppercase tracking-wide text-slate-500">API URL</Text>
        <Text className="mt-1 text-sm text-slate-800">{API_URL}</Text>
      </View>
    </AppContainer>
  );
}
