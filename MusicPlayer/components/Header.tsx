import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, { AnimatedStyle } from 'react-native-reanimated';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Track } from '..';
import { colors } from '../../styles/colors';
import { w, h, sp } from '../../styles/size';
import { PlaybackState } from '../hooks/useTrack';
import ProgressBar, { ProgressBarProps } from './ProgressBar';
import { AnimationState } from '../hooks/usePlayerAnimation';

export const HEADER_HEIGHT = h(74);

type HeaderProps = {
    track: Track;
    animation: AnimatedStyle;
    artworkAnimation: AnimatedStyle;
    animationState: AnimationState;
    playbackState: PlaybackState;
    backgroundColor: string;
    progress: ProgressBarProps;
    onHeaderPress: () => void;
    onPlayPress: () => void;
    onPausePress: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const Header = (props: HeaderProps) => {
    return (
        <AnimatedPressable
            onPress={props.onHeaderPress}
            style={[
                props.animation,
                {
                    ...styles.container,
                    backgroundColor: props.backgroundColor,
                }
            ]}
        >
            <View style={styles.trackContainer}>
                <Animated.Image
                    source={{ uri: props.track.artworkThumbnail }}
                    resizeMode='cover'
                    style={[props.artworkAnimation, styles.artwork]}
                />
                <View style={styles.titleWithArtistContainer}>
                    <Text style={styles.title}>{props.track.title}</Text>
                    <Text style={styles.artist}>{props.track.artist}</Text>
                </View>
                <View style={styles.controllerContainer}>
                    <Pressable
                        onPress={props.playbackState === PlaybackState.playing ? props.onPausePress : props.onPlayPress}
                        hitSlop={w(20)}
                    >
                        <Ionicons
                            name={props.playbackState === PlaybackState.playing ? 'pause-sharp' : 'play-sharp'}
                            size={sp(20)}
                            color={colors.textA}
                        />
                    </Pressable>
                </View>
            </View>
            {props.animationState === 'collapsed' && <ProgressBar {...props.progress} />}
        </AnimatedPressable>
    );
}

export const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '100%',
        height: HEADER_HEIGHT,
    },
    trackContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: w(12),
        paddingHorizontal: w(8),
    },
    artwork: {
        width: w(40),
        height: w(40),
        borderRadius: 4,
    },
    titleWithArtistContainer: {
        flex: 1,
        justifyContent: 'center',
        rowGap: h(4),
    },
    title: {
        fontSize: sp(14),
        fontWeight: '700',
        color: colors.textA,
    },
    artist: {
        fontSize: sp(12),
        fontWeight: '400',
        color: colors.textB,
    },
    controllerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: w(12),
        paddingRight: w(12),
    },
});

export default Header;