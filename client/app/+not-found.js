import { Link, Stack } from 'expo-router';
import { Text, View } from 'react-native';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops' }} />
      <View className="flex-1 items-center justify-center bg-white px-6">
        <Text className="mb-2 text-2xl font-bold text-slate-900">Page not found</Text>
        <Text className="mb-6 text-center text-slate-600">This screen does not exist.</Text>
        <Link href="/" className="text-base font-semibold text-brand-700">
          Go back home
        </Link>
      </View>
    </>
  );
}
