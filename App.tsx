import React, { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import TrackPlayer from 'react-native-track-player';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Demo from './screens/Demo';

export default function App() {
  const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(() => {
    TrackPlayer.setupPlayer().then(() => setIsReady(true));
  }, []);

  if (!isReady) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Demo />
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
