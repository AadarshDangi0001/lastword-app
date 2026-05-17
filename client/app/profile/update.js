import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import AppContainer from '../../src/components/layout/AppContainer';

export default function ProfileUpdateScreen() {
  const [name, setName] = useState('Aadarsh Dangi');
  const [email, setEmail] = useState('aadarsh0001@test.com');
  const [dob, setDob] = useState('04/09/2004');

  return (
    <AppContainer>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        <Pressable onPress={() => router.back()} className="mb-6 flex-row items-center gap-2">
          <Ionicons name="chevron-back" size={22} color="#0f172a" />
          <Text className="font-poppins-medium text-3xl text-slate-900">Back</Text>
        </Pressable>

        <View className="rounded-3xl  p-4">
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Full Name"
            className="mb-4 rounded-2xl bg-slate-200 px-4 py-4 font-poppins text-xl text-slate-900"
          />
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            className="mb-4 rounded-2xl bg-slate-200 px-4 py-4 font-poppins text-xl text-slate-900"
          />
          <TextInput
            value={dob}
            onChangeText={setDob}
            placeholder="DOB"
            className="mb-4 rounded-2xl bg-slate-200 px-4 py-4 font-poppins text-xl text-slate-900"
          />

          <View className="mb-4 flex-row items-center justify-between rounded-2xl bg-slate-200 px-4 py-4">
            <Text className="font-poppins text-xl text-slate-900">Profile Image</Text>
            <View className="h-10 w-10 items-center justify-center rounded-md border border-slate-800">
              <Ionicons name="arrow-up" size={20} color="#0f172a" />
            </View>
          </View>

          <Pressable className="items-center rounded-xl bg-black py-4">
            <Text className="font-poppins-semibold text-xl text-white">Update Profile</Text>
          </Pressable>
        </View>
      </ScrollView>
    </AppContainer>
  );
}
