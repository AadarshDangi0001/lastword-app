import { ImageBackground, ScrollView, Text, View } from 'react-native';
import AppContainer from '../../src/components/layout/AppContainer';

const aboutBg = require('../../assets/bg-imgs/aboutbg.png');

export default function AboutScreen() {
  return (
    <AppContainer>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        <Text className="mb-8 text-4xl font-poppins-medium text-slate-900">About</Text>

        <View className="rounded-3xl bg-white overflow-hidden">
          <ImageBackground
            source={aboutBg}
            resizeMode="contain"
            imageStyle={{ borderRadius: 24 }}
            style={{ width: 410, height: 750 }}
          >
            <View className="flex-1 items-center justify-center px-6 py-8">
              <Text className="font-poppins text-center text-xl leading-6 text-slate-900">
                Our app is a secure digital platform that allows you to create and schedule
                meaningful messages for the future. Whether it is a note to a loved one, an
                important reminder, or a personal message, you can decide exactly when and how
                it should be delivered.{"\n\n"}
                With built-in scheduling and inactivity-based triggers, your messages are sent
                only when your chosen conditions are met. We focus on privacy, reliability, and
                giving you complete control over your data.{"\n\n"}
                This app is designed to help you stay connected with people who matter even when
                you are not around or unable to respond.{"\n\n"}
                With smart inactivity detection and secure storage, your messages remain safe
                until the time comes. You are always in control, and you can update or cancel
                your messages anytime.
              </Text>
            </View>
          </ImageBackground>
        </View>
      </ScrollView>
    </AppContainer>
  );
}
