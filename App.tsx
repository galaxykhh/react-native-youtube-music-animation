import React from 'react';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import MusicPlayer from './components/MusicPlayer';
import { colors } from './styles/colors';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
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
        />
      </View>
    </GestureHandlerRootView>
  );
}

// export default function App() {
//   return (
//     <GestureHandlerRootView style={{ flex: 1 }}>
//       <NavigationContainer>
//         <RootNavigation />
//       </NavigationContainer>
//     </GestureHandlerRootView>
//   );
// }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#131313',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
