import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import MusicPlayer from './components/MusicPlayer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <MusicPlayer />
        <StatusBar style="dark" />
      </View>
    </GestureHandlerRootView>
  );
}

// export default function App() {
//   return (
//     <GestureHandlerRootView style={{ flex: 1 }}>
//       <NavigationContainer>
//         <RootNavigation/>
//       </NavigationContainer>
//     </GestureHandlerRootView>
//   );
// }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
