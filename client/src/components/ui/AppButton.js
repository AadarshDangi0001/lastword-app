import { Pressable, Text } from 'react-native';

export default function AppButton({ label, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      className="items-center rounded-xl bg-brand-700 px-4 py-3 active:opacity-80"
    >
      <Text className="text-base font-semibold text-white">{label}</Text>
    </Pressable>
  );
}
