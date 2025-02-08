import { StyleSheet, Image, Text, Pressable } from 'react-native';
import { Playlist } from '..';
import { w, h, sp } from '../../../styles/size';
import { colors } from '../../../styles/colors';

type PlaylistListItemProps = {
    playlist: Playlist;
    onPress: () => void;
};

const PlaylistListItem = (props: PlaylistListItemProps) => {
    return (
        <Pressable
            style={styles.container}
            onPress={props.onPress}
        >
            <Image
                style={styles.artwork}
                source={{ uri: props.playlist.artwork }}
            />
            <Text style={styles.title}>{props.playlist.title}</Text>
            <Text style={styles.trackCount}>{props.playlist.tracks.length}</Text>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        width: w(375) * 0.35,
        aspectRatio: .7,
        gap: h(4),
    },
    artwork: {
        width: '100%',
        aspectRatio: 1,
    },
    title: {
        fontSize: sp(14),
        fontWeight: 'semibold',
        color: colors.textA,
    },
    trackCount: {
        fontSize: sp(12),
        fontWeight: 'regular',
        color: colors.textB,
    }
});

export default PlaylistListItem;
