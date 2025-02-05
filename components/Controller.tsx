import { StyleSheet, View } from 'react-native';
import { h, sp } from '../styles/size';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../styles/colors';
import { BODY_ALBUM_PADDING_HORIZONTAL } from './values';

const iconSizes = {
    play: sp(75),
    others: sp(25),
};

type Props = {
    onShufflePress: () => void;
    onSkipBackPress: () => void;
    onPlayPress: () => void;
    onSkipForwardPress: () => void;
    onRepeatPress: () => void;
};

const Controller = (props: Props) => {
    return (
        <View style={styles.container}>
            <Ionicons
                name='shuffle'
                color={colors.textA}
                size={iconSizes.others}
            />
            <Ionicons
                name='play-skip-back'
                color={colors.textA}
                size={iconSizes.others}
            />
            <Ionicons
                name='play-circle'
                color={colors.textA}
                size={iconSizes.play}
            />
            <Ionicons
                name='play-skip-forward'
                color={colors.textA}
                size={iconSizes.others}
            />
            <Ionicons
                name='repeat'
                color={colors.textA}
                size={iconSizes.others}
            />
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