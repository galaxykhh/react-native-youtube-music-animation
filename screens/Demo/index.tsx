import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MusicPlayer, { Track } from '../../MusicPlayer';
import { useMusicPlayerRef } from '../../MusicPlayer/hooks/useMusicPlayerRef';
import { colors } from '../../styles/colors';
import TrackListItem from './components/TrackListItem';
import { h, sp, w } from '../../styles/size';
import PlaylistListItem from './components/PlaylistListItem';
import { tracks } from '../../data/tracks';
import { playlists } from '../../data/playlists';

export type Playlist = {
    id: number;
    title: string;
    artwork: string;
    tracks: Track[];
}

const Demo = () => {
    const [remoteTracks,] = useState<Track[]>(tracks);
    const [remotePlaylists,] = useState<Playlist[]>(playlists);
    const ref = useMusicPlayerRef();

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Tracks</Text>
            <View style={styles.trackList}>
                {remoteTracks.map(t => (
                    <TrackListItem
                        key={t.id}
                        track={t}
                        onPress={() => ref.current?.playTrack(t)}
                    />
                ))}
            </View>

            <Text style={styles.title}>Playlists</Text>
            <ScrollView
                horizontal
                style={{ flexGrow: 1 }}
                contentContainerStyle={styles.playlistList}
            >
                {remotePlaylists.map(p => (
                    <PlaylistListItem
                        key={p.id}
                        playlist={p}
                        onPress={() => ref.current?.playTracks(p.tracks)}
                    />
                ))}
            </ScrollView>
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
    title: {
        fontSize: sp(28),
        paddingHorizontal: w(8),
        marginVertical: h(12),
        color: colors.textA,
        fontWeight: 'bold',
    },
    trackList: {
        gap: h(12),
    },
    playlistList: {
        paddingHorizontal: w(8),
        gap: w(12),
    },
});

export default Demo;