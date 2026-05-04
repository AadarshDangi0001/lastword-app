import { Text, View, ScrollView, ImageBackground, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
              <View className="h-16 w-16 rounded-xl bg-slate-400" />
              <View>
                <Text className="font-poppins text-2xl font-semibold text-black ">Hello,</Text>
                <Text className="font-poppins text-2xl font-semibold text-black ">Aadarsh</Text>
              </View>
            </View>
            <Pressable className="h-16 w-16 items-center justify-center rounded-xl bg-slate-200">
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
            className=" background-cover "
            resizeMode="contain"
          >
            <View className="relative z-10 px-8 py-16">
              <View className="flex-row items-center justify-between">
                <View>
                  <View className="mb-2 flex-row items-baseline gap-2">
                    <Text className="font-poppins text-8xl font-bold text-slate-900">{days}</Text>
                    <Text className="font-poppins text-6xl text-slate-900">Days</Text>
                  </View>
                  <Text className="font-poppins text-4xl text-slate-900">
                    <Text className="font-bold">{hours}</Text> <Text className="text-3xl">Hours</Text> <Text className="font-bold">{minutes}</Text> <Text className="text-3xl">Mins</Text>
                  </Text>
                </View>
               
              </View>
            </View>
          </ImageBackground>

          {/* Message Section */}
          <View className="mb-8 "
          style={{
            width:'100%',
            height:"20%"
          
          }}>
            <Text className="font-poppins text-4xl leading-[44px]  text-slate-900">
            Please Add{"\n"}
  Contact Before{"\n"}
  Start Timer
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
