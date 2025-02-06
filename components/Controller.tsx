import { Pressable, StyleSheet, View } from 'react-native';
import { h, sp } from '../styles/size';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../styles/colors';
import { BODY_ALBUM_PADDING_HORIZONTAL } from './values';

const HIT_SLOP = 16;

const iconSizes = {
    play: sp(75),
    others: sp(25),
};

export type ControllerProps = {
    onShufflePress: () => void;
    onSkipBackPress: () => void;
    onPlayPress: () => void;
    onSkipForwardPress: () => void;
    onRepeatPress: () => void;
};

const Controller = (props: ControllerProps) => {
    return (
        <View style={styles.container}>
            <Pressable hitSlop={HIT_SLOP} onPress={props.onShufflePress}>
                <Ionicons
                    name='shuffle'
                    color={colors.textA}
                    size={iconSizes.others}
                />
            </Pressable>
            <Pressable hitSlop={HIT_SLOP} onPress={props.onSkipBackPress}>
                <Ionicons
                    name='play-skip-back'
                    color={colors.textA}
                    size={iconSizes.others}
                />
            </Pressable>
            <Pressable hitSlop={HIT_SLOP} onPress={props.onPlayPress}>
                <Ionicons
                    name='play-circle'
                    color={colors.textA}
                    size={iconSizes.play}
                />
            </Pressable>
            <Pressable hitSlop={HIT_SLOP} onPress={props.onSkipForwardPress}>
                <Ionicons
                    name='play-skip-forward'
                    color={colors.textA}
                    size={iconSizes.others}
                />
            </Pressable>
            <Pressable hitSlop={HIT_SLOP} onPress={props.onRepeatPress}>
                <Ionicons
                    name='repeat'
                    color={colors.textA}
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
        paddingHorizontal: BODY_ALBUM_PADDING_HORIZONTAL,
        paddingTop: h(16),
    }
});

export default Controller;