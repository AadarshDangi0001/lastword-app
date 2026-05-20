import { Pressable, ScrollView, Text, View } from 'react-native';
import { router } from 'expo-router';
import AppContainer from '../../src/components/layout/AppContainer';
import { logoutUser } from '../../src/services/api/auth';
import { getItem, removeItem } from '../../src/lib/storage';
import { STORAGE_KEYS } from '../../src/constants/app';

export default function ProfileScreen() {
  const handleLogout = async () => {
    const refreshToken = await getItem(STORAGE_KEYS.refreshToken);
    try {
      await logoutUser({ refreshToken });
    } catch (error) {
      // Ignore logout errors to ensure local session clears.
    } finally {
      await removeItem(STORAGE_KEYS.authToken);
      await removeItem(STORAGE_KEYS.refreshToken);
      await removeItem(STORAGE_KEYS.user);
      router.replace('/auth/login');
    }
  };

  return (
    <AppContainer>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        <Text className="mb-8 text-4xl font-poppins-medium text-slate-900">Profile</Text>

        <View className="rounded-2xl border mb-8 border-slate-300 bg-white p-3 shadow-sm">
          <View className="flex-row items-center gap-4">
            <View className="h-24 w-24 items-center justify-center rounded-2xl bg-slate-300">
              <Text className="font-poppins-semibold text-xl text-slate-800">AD</Text>
            </View>
            <View className="flex-1">
              <Text className="font-poppins-semibold text-3xl text-slate-900">Aadarsh Dangi</Text>
              <Text className="mt-1 font-poppins text-xl text-slate-900">aadarsh0001@test.com</Text>
              <Text className="mt-1 font-poppins text-xl text-slate-900">DOB-04/09/2004</Text>
            </View>
          </View>

          <Pressable
            className="mt-4 items-center rounded-xl bg-black py-4"
            onPress={() => router.push('/profile/update')}
          >
            <Text className="font-poppins-semibold text-xl text-white">Update Profile</Text>
          </Pressable>
        </View>

        <View className="mt-8">
          <Text className="mb-3 font-poppins-semibold text-2xl text-slate-900">Help & Support</Text>
          <Text className="mb-3 font-poppins text-2xl text-slate-900">Terms & Conditions</Text>
          <Text className="font-poppins text-2xl text-slate-900">Privacy Policy</Text>
        </View>

        <Pressable
          className="mt-96 items-center rounded-xl border border-red-500 bg-red-50 py-4"
          onPress={handleLogout}
        >
          <Text className="font-poppins text-xl text-red-500">Logout</Text>
        </Pressable>
      </ScrollView>
    </AppContainer>
  );
}
