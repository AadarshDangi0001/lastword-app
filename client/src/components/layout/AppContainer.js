import { SafeAreaView } from 'react-native-safe-area-context';

export default function AppContainer({ children }) {
  return <SafeAreaView className="flex-1 bg-white px-5 py-4">{children}</SafeAreaView>;
}
