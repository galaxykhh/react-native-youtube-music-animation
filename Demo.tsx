import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import MusicPlayer, { Track } from './components/MusicPlayer';
import fixtures from './fixture/tracks.json';
import { colors } from './styles/colors';

const Demo = () => {
    const insets = useSafeAreaInsets();
    const [tracks,] = useState<Track[]>(fixtures);

    return (
        <SafeAreaView style={styles.container}>
            <Text style={{ color: 'white' }}>Hello</Text>
            <Text style={{ color: 'white' }}>Hello</Text>
            <Text style={{ color: 'white' }}>Hello</Text>
            <MusicPlayer
                tracks={tracks}
                headerColor={colors.background1}
                bodyColor={colors.background0}
                bottomInsets={insets.bottom}
                onAnimationStateChanged={state => console.log('current animation state: ', state)}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background0,
    },
});

export default Demo;