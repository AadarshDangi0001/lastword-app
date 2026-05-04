import { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const TAB_CONFIG = [
  { name: 'index', label: 'Home', icon: 'home-outline' },
  { name: 'contacts', label: 'Contacts', icon: 'people-outline' },
  { name: 'about', label: 'About', icon: 'information-circle-outline' },
  { name: 'profile', label: 'Profile', icon: 'person-outline' },
];

function CustomTabBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();
  const animValues = useRef(state.routes.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    const animations = animValues.map((value, index) =>
      Animated.timing(value, {
        toValue: index === state.index ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      })
    );

    Animated.parallel(animations).start();
  }, [animValues, state.index]);

  return (
    <View style={[styles.tabBarWrap, { bottom: insets.bottom + 8 }]}>
      <View style={styles.tabBar}> 
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          const config = TAB_CONFIG.find(item => item.name === route.name);
          const label = config?.label ?? options.title ?? route.name;
          const iconName = config?.icon ?? 'help-circle-outline';
          const animValue = animValues[index];

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const scale = animValue.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 1.08],
          });

          const labelOpacity = animValue;
          const labelTranslate = animValue.interpolate({
            inputRange: [0, 1],
            outputRange: [10, 0],
          });

          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              style={[styles.tabItem, isFocused ? styles.tabItemActive : styles.tabItemInactive]}
            >
              <Animated.View style={[styles.iconWrap, { transform: [{ scale }] }]}>
                <View style={[styles.iconBox, isFocused ? styles.iconBoxActive : styles.iconBoxInactive]}>
                  <Ionicons
                    name={iconName}
                    size={22}
                    color={isFocused ? '#000000' : '#ffffff'}
                  />
                </View>
              </Animated.View>
              <Animated.Text
                style={[
                  styles.tabLabel,
                  isFocused ? styles.tabLabelActive : styles.tabLabelHidden,
                  { opacity: labelOpacity, transform: [{ translateX: labelTranslate }] },
                ]}
              >
                {label}
              </Animated.Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        headerShadowVisible: false,
      }}
      tabBar={props => <CustomTabBar {...props} />}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="contacts" options={{ title: 'Contacts' }} />
      <Tabs.Screen name="about" options={{ title: 'About' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  tabBar: {
    minWidth: '75%',
    backgroundColor: '#000000',
    borderRadius: 22,
    paddingHorizontal: 10,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    flexDirection: 'row',
    borderRadius: 16,
    overflow: 'hidden',
    marginHorizontal: 2,
    paddingRight: 8,
    marginLeft: 8,
    minWidth: 56,
  },
  tabItemActive: {
    backgroundColor: '#ffffff',
     
  },
  tabItemInactive: {
    backgroundColor: 'transparent',
   
  },
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBox: {
    width: 50,
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBoxActive: {
    backgroundColor: '#ffffff',
  },
  iconBoxInactive: {
    backgroundColor: '#4A4A4B',
  },
  tabLabel: {

   
    fontSize: 18,
    fontWeight: '500',
  },
  tabLabelActive: {
    color: '#000000',
  },
  tabLabelHidden: {
    color: 'transparent',
    marginLeft: 0,
    width: 0,
  },
});
