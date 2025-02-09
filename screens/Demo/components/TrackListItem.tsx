import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Track } from '../../../MusicPlayer';
import { w, h, sp } from '../../../styles/size';
import { colors } from '../../../styles/colors';

type TrackListItemProps = {
    track: Track;
    onPress: () => void;
};

const TrackListItem = (props: TrackListItemProps) => {
    return (
        <Pressable
            style={styles.container}
            onPress={props.onPress}
        >
            <Image
                style={styles.artwork}
                source={{ uri: props.track.artworkThumbnail }}
            />
            <View style={styles.titleWithArtistContainer}>
                <Text style={styles.title}>{props.track.title}</Text>
                <Text style={styles.artist}>{props.track.artist}</Text>
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        height: h(40),
        paddingHorizontal: w(12),
    },
    titleWithArtistContainer: {
        height: h(36),
        gap: h(2),
    },
    artwork: {
        width: w(40),
        aspectRatio: 1,
        marginRight: w(8),
    },
    title: {
        fontSize: sp(14),
        fontWeight: 'semibold',
        color: colors.textA,
    },
    artist: {
        fontSize: sp(12),
        fontWeight: 'regular',
        color: colors.textB,
    },
});

export default TrackListItem