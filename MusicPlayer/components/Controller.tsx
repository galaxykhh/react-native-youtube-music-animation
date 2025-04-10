import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { w, h, sp } from '../../styles/size';
import { colors } from '../../styles/colors';
import { BODY_ARTWORK_PADDING_HORIZONTAL } from '../values';
import { PlaybackState } from '../hooks/useTrack';

const HIT_SLOP = w(16);

const iconSizes = {
    play: sp(75),
    others: sp(25),
};

export type ControllerProps = {
    playbackState: PlaybackState;
    isShuffle: boolean;
    isRepeat: boolean;
    canSkipBack: boolean;
    canSkipForward: boolean;
    onShufflePress: () => void;
    onSkipBackPress: () => void;
    onPlayPress: () => void;
    onPausePress: () => void;
    onSkipForwardPress: () => void;
    onRepeatPress: () => void;
};

const Controller = (props: ControllerProps) => {

    return (
        <View style={styles.container}>
            <Pressable hitSlop={HIT_SLOP} onPress={props.onShufflePress}>
                <Ionicons
                    name='shuffle'
                    color={props.isShuffle ? colors.textA : colors.textC}
                    size={iconSizes.others}
                />
            </Pressable>
            <Pressable hitSlop={HIT_SLOP} onPress={props.onSkipBackPress}>
                <Ionicons
                    name={'play-skip-back'}
                    color={props.canSkipBack ? colors.textA : colors.textC}
                    size={iconSizes.others}
                />
            </Pressable>
            <Pressable hitSlop={HIT_SLOP} onPress={props.playbackState === PlaybackState.playing ? props.onPausePress : props.onPlayPress}>
                <Ionicons
                    name={props.playbackState === PlaybackState.playing ? 'pause-circle' : 'play-circle'}
                    color={colors.textA}
                    size={iconSizes.play}
                />
            </Pressable>
            <Pressable hitSlop={HIT_SLOP} onPress={props.onSkipForwardPress}>
                <Ionicons
                    name='play-skip-forward'
                    color={props.canSkipForward ? colors.textA : colors.textC}
                    size={iconSizes.others}
                />
            </Pressable>
            <Pressable hitSlop={HIT_SLOP} onPress={props.onRepeatPress}>
                <Ionicons
                    name='repeat'
                    color={props.isRepeat ? colors.textA : colors.textC}
                    size={iconSizes.others}
                />
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: BODY_ARTWORK_PADDING_HORIZONTAL,
        paddingTop: h(16),
    }
});

export default Controller;