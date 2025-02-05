import React, { useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import MusicPlayer, { Music } from './components/MusicPlayer';
import { colors } from './styles/colors';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import fixtures from './fixture/musics.json';

const Inner = () => {
  const insets = useSafeAreaInsets();
  const [musics, setMusics] = useState<Music[]>(fixtures);
  const [cursor, setCursor] = useState<number>(2);
  const currentMusic = musics[cursor];

  return (
    <MusicPlayer
      music={currentMusic}
      headerColor={colors.background1}
      bodyColor={colors.background0}
      bottomInsets={insets.bottom}
    />
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        {Platform.select({
          android: (
            <SafeAreaView style={styles.container} edges={['top']}>
              <Inner />
            </SafeAreaView>
          ),
          ios: (
            <View style={styles.container}>
              <Inner />
            </View>
          )
        })}
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#131313',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
