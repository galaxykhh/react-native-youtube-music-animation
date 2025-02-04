import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import MusicPlayer from './components/MusicPlayer';
import { colors } from './styles/colors';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const Inner = () => {
  const insets = useSafeAreaInsets();

  return (
    <MusicPlayer
      music={{
        title: 'The End of the World',
        artist: 'Skeeter Davis',
        cover: {
          main: 'https://lh3.googleusercontent.com/qSL8OhDZrb2B3wlJT_jXU1m7fraQcD41y2BTU28ofspF0S1SBd0tlz0R0jMsg57AWu5XYXuDKT8vGEHm=w544-h544-s-l90-rj',
          thumbnail: 'https://lh3.googleusercontent.com/qSL8OhDZrb2B3wlJT_jXU1m7fraQcD41y2BTU28ofspF0S1SBd0tlz0R0jMsg57AWu5XYXuDKT8vGEHm=w60-h60-s-l90-rj',
        }
      }}
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
