import { View, Text, TextInput, Pressable, ScrollView, Image, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { router } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

const loginbg = require('../../assets/bg-imgs/loginbg.png');

export default function SignupScreen() {
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date(2000, 0, 1));

  const handleDateChange = (event, date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (date) {
      setSelectedDate(date);
      const formattedDate = date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
      setDob(formattedDate);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 items-center justify-center px-4 py-8">
            {/* Title */}
            <Text className="mb-12 font-poppins-bold text-5xl text-slate-900">Last Word</Text>

            {/* Card Container */}
            <View className="w-full max-w-sm rounded-3xl bg-white shadow-2xl overflow-hidden relative">
              {/* Decorative Image */}
               <Image
                            source={loginbg}
                            style={{
                              position: "absolute",
                              right: -175,
                              top: -5,
                              width: 700,
                              height: 560,
                              opacity: 0.8,
                              // transform: [{ translateX: 50 }]
                            }}
                            resizeMode="contain"
                          />
              {/* Decorative Blue Shape (Left Side) */}
              <View className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-blue-200 via-blue-100 to-transparent rounded-r-3xl" />
              
            

              {/* Content Container */}
              <View className="px-6 py-8 relative z-10">
                {/* Header */}
                <View className="mb-6">
                  <Text className="font-poppins-bold text-2xl text-slate-900">
                    Create an account
                  </Text>
                  <Text className="mt-2 font-poppins text-sm text-slate-500">
                    Join us and explore new possibilities!
                  </Text>
                </View>

                {/* Email Input */}
                <View className="mb-4 mt-4">
                <TextInput
                  placeholder="test@test.com"
                  value={email}
                  onChangeText={setEmail}
                  placeholderTextColor="#a1a1a1"
                  className="font-poppins rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900"
                  keyboardType="email-address"
                />
                </View>

                {/* DOB Input */}
                <View className="mb-4">
                <View className="relative">
                  <TextInput
                    placeholder="DOB (DD/MM/YYYY)"
                    value={dob}
                    onChangeText={setDob}
                    placeholderTextColor="#a1a1a1"
                    className="font-poppins rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 pr-12 text-slate-900"
                  />
                  <Pressable
                    onPress={() => setShowDatePicker(true)}
                    className="absolute right-4 top-3"
                  >
                    <MaterialCommunityIcons
                      name="calendar"
                      size={20}
                      color="#0066cc"
                    />
                  </Pressable>
                </View>
                </View>

                {/* Password Input */}
                <View className="mb-5">
                  <View className="relative">
                    <TextInput
                      placeholder="Enter your password"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                      placeholderTextColor="#a1a1a1"
                      className="font-poppins rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 pr-12 text-slate-900"
                    />
                    <Pressable
                      onPress={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-3"
                    >
                      <Ionicons
                        name={showPassword ? 'eye' : 'eye-off'}
                        size={20}
                        color="#999"
                      />
                    </Pressable>
                  </View>
                </View>

                {/* Create Account Button */}
                <Pressable
                  onPress={() => router.push('/')}
                  className={`mb-6 items-center rounded-full py-3 ${agreed ? 'bg-blue-600 active:opacity-80' : 'bg-blue-300'}`}
                  disabled={!agreed}
                >
                  <Text className="font-poppins-semibold text-base text-white">
                    Create account
                  </Text>
                </Pressable>

                {/* Privacy & Terms */}
                <Pressable onPress={() => setAgreed(!agreed)} className="mb-5 flex-row items-center justify-center gap-2">
                  <Ionicons
                    name={agreed ? 'checkbox' : 'checkbox-outline'}
                    size={18}
                    color={agreed ? '#0066cc' : '#999'}
                  />
                  <Text className="font-poppins text-xs text-slate-600">I agree to the </Text>
                  <Pressable>
                    <Text className="font-poppins-semibold text-xs text-blue-600">
                      Privacy Policy
                    </Text>
                  </Pressable>
                  <Text className="font-poppins text-xs text-slate-600"> and </Text>
                  <Pressable>
                    <Text className="font-poppins-semibold text-xs text-blue-600">
                      Terms of Service
                    </Text>
                  </Pressable>
                </Pressable>

                {/* Divider */}
                <View className="mb-5 flex-row items-center">
                  <View className="flex-1 border-t border-slate-200" />
                  <Text className="font-poppins mx-3 text-slate-400 text-xs">OR</Text>
                  <View className="flex-1 border-t border-slate-200" />
                </View>

                {/* Login Link */}
                <View className="flex-row items-center justify-center gap-2">
                  <Text className="font-poppins text-sm text-slate-600">Already have an account? </Text>
                  <Pressable onPress={() => router.push('/auth/login')}>
                    <Text className="font-poppins-semibold text-sm text-blue-600">Log in</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>

        {showDatePicker && (
          <View>
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleDateChange}
              maximumDate={new Date()}
            />
            {Platform.OS === 'ios' && (
              <Pressable
                onPress={() => setShowDatePicker(false)}
                className="bg-blue-600 py-3 items-center"
              >
                <Text className="font-poppins-semibold text-base text-white">Done</Text>
              </Pressable>
            )}
          </View>
        )}
      </SafeAreaView>
  );
}
