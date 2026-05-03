import { Text, View } from 'react-native';
import AppButton from '../../src/components/ui/AppButton';
import AppContainer from '../../src/components/layout/AppContainer';
import { APP_NAME } from '../../src/constants/app';

export default function HomeScreen() {
  return (
    <AppContainer>
      <View className="rounded-3xl border border-brand-100 bg-brand-50 p-5">
        <Text className="text-3xl font-extrabold text-slate-900">{APP_NAME}</Text>
        <Text className="mt-2 text-base leading-6 text-slate-700">
          Production-ready Expo JavaScript setup with NativeWind is now configured.
        </Text>
      </View>

      <View className="mt-5 gap-3">
        <AppButton label="Create your first feature" />
        <Text className="text-sm text-slate-500">
          Start by adding screens in app and business logic in src/features.
        </Text>
      </View>
    </AppContainer>
  );
}
