import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const loginbg = require("../../assets/bg-imgs/loginbg.png");

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f8f9fa" }}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 items-center justify-center px-4 py-8">
          {/* Title */}
          <Text className="mb-12 font-poppins text-5xl font-bold text-slate-900">
            Last Word
          </Text>

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
                <Text className="font-poppins text-2xl font-bold text-slate-900">
                  Login to your account
                </Text>
                <Text className="mt-2 font-poppins text-sm text-slate-500">
                  Welcome back! Please enter your details
                </Text>
              </View>

              {/* Email Input */}
              <View className="mb-5 mt-4">
                <TextInput
                  placeholder="test@test.com"
                  value={email}
                  onChangeText={setEmail}
                  placeholderTextColor="#a1a1a1"
                  className="font-poppins rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900"
                  keyboardType="email-address"
                />
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
                      name={showPassword ? "eye" : "eye-off"}
                      size={20}
                      color="#999"
                    />
                  </Pressable>
                </View>
              </View>

              {/* Forgot Password */}
              <View className="mb-6 flex-row justify-end">
                <Pressable>
                  <Text className="font-poppins text-sm font-semibold text-blue-600">
                    Forgot Password
                  </Text>
                </Pressable>
              </View>

              {/* Login Button */}
              <Pressable
                onPress={() => router.push('/')}
                className={`mb-6 items-center rounded-full py-3 ${agreed ? 'bg-blue-600 active:opacity-80' : 'bg-blue-300'}`}
                disabled={!agreed}
              >
                <Text className="font-poppins text-base font-semibold text-white">
                  Login now
                </Text>
              </Pressable>

              {/* Privacy & Terms */}
              <Pressable onPress={() => setAgreed(!agreed)} className="mb-6 flex-row items-center justify-center gap-2">
                <Ionicons
                  name={agreed ? 'checkbox' : 'checkbox-outline'}
                  size={18}
                  color={agreed ? '#0066cc' : '#999'}
                />
                <Text className="font-poppins text-xs text-slate-600">
                  I agree to the{" "}
                </Text>
                <Pressable>
                  <Text className="font-poppins text-xs font-semibold text-blue-600">
                    Privacy Policy
                  </Text>
                </Pressable>
                <Text className="font-poppins text-xs text-slate-600">
                  {" "}
                  and{" "}
                </Text>
                <Pressable>
                  <Text className="font-poppins text-xs font-semibold text-blue-600">
                    Terms of Service
                  </Text>
                </Pressable>
              </Pressable>

              {/* Divider */}
              <View className="mb-5 flex-row items-center">
                <View className="flex-1 border-t border-slate-200" />
                <Text className="font-poppins mx-3 text-slate-400 text-xs">
                  OR
                </Text>
                <View className="flex-1 border-t border-slate-200" />
              </View>

              {/* Sign Up Link */}
              <View className="flex-row items-center justify-center gap-2">
                <Text className="font-poppins text-sm text-slate-600">
                  Don't have an account?{" "}
                </Text>
                <Pressable onPress={() => router.push("/auth/signup")}>
                  <Text className="font-poppins text-sm font-semibold text-blue-600">
                    Sign up
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
