import { useState } from 'react';
import { Button, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MusicPlayer, { Track } from './components/MusicPlayer';
import fixtures from './fixture/tracks.json';
import { colors } from './styles/colors';
import { useMusicPlayerRef } from './components/useMusicPlayerRef';

const Demo = () => {
    const [remoteTracks,] = useState<Track[]>(fixtures);
    const ref = useMusicPlayerRef();

    return (
        <SafeAreaView style={styles.container}>
            {[0, 1, 2, 3, 4].map(i => (
                <Button key={i} title='ADD' onPress={() => {
                    ref.current?.addTrackAndPlay(remoteTracks[i])
                }} />
            ))}
            <Button title='ADD2' onPress={() => console.log('HELLO')} />
            <MusicPlayer
                ref={ref}
                headerColor={colors.background1}
                bodyColor={colors.background0}
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