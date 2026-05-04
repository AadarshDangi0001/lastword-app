import { Text, View, ScrollView, ImageBackground, Pressable, SafeAreaView } from 'react-native';
import { useState, useEffect } from 'react';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const uppertab = require('../../assets/bg-imgs/uppertab.png');
const lowertab = require('../../assets/bg-imgs/lowertab.png');

export default function HomeScreen() {
  const [days, setDays] = useState(365);
  const [hours, setHours] = useState(24);
  const [minutes, setMinutes] = useState(59);

  // Countdown timer effect (optional - can be connected to actual countdown logic)
  useEffect(() => {
    const timer = setInterval(() => {
      setMinutes(prev => {
        if (prev > 0) {
          return prev - 1;
        } else {
          setHours(prev => {
            if (prev > 0) {
              return prev - 1;
            } else {
              setDays(prev => (prev > 0 ? prev - 1 : 0));
              return 23;
            }
          });
          return 59;
        }
      });
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 px-4 py-4">
          {/* Header Section */}
          <View className="mb-8 flex-row items-center justify-between">
            <View className="flex-row items-center gap-3">
              <View className="h-12 w-12 rounded-full bg-slate-400" />
              <View>
                <Text className="font-poppins text-sm text-slate-600">Hello,</Text>
                <Text className="font-poppins text-lg font-bold text-slate-900">Aadarsh</Text>
              </View>
            </View>
            <Pressable className="h-12 w-12 items-center justify-center rounded-full bg-slate-200">
              <Ionicons name="notifications" size={24} color="#333" />
            </Pressable>
          </View>

          {/* Upper Timer Card */}
          <ImageBackground
            source={uppertab}
            style={{
              borderRadius: 24,
              overflow: 'hidden',
              height: 280,
             
            }}
            className=" "
            resizeMode="contain"
          >
            <View className="relative z-10 px-6 py-8">
              <View className="flex-row items-center justify-between">
                <View>
                  <View className="mb-2 flex-row items-baseline gap-2">
                    <Text className="font-poppins text-5xl font-bold text-slate-900">{days}</Text>
                    <Text className="font-poppins text-2xl text-slate-900">Days</Text>
                  </View>
                  <Text className="font-poppins text-lg text-slate-700">
                    <Text className="font-bold">{hours}</Text> Hours, <Text className="font-bold">{minutes}</Text> Min
                  </Text>
                </View>
               
              </View>
            </View>
          </ImageBackground>

          {/* Message Section */}
          <View className="mb-8">
            <Text className="font-poppins text-2xl font-semibold text-slate-900">
              Please Add Contact Before Start Timer
            </Text>
          </View>

          {/* Lower Last Word Card */}
          <ImageBackground
            source={lowertab}
            style={{
              borderRadius: 24,
              overflow: 'hidden',
              width: '65%',
              height: 70,
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
            }}
            className="mb-2"
            resizeMode="contain"
          >
      
          </ImageBackground>

          {/* Start Button */}
          <Pressable 
            style={{ backgroundColor: '#4A4A4B' }}
            className="mb-6 items-center rounded-xl py-6"
          >
            <Text className="font-poppins text-3xl font-semibold text-white">Start</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
