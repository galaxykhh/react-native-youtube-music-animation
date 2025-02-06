import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, { AnimatedStyle } from 'react-native-reanimated';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Track } from './MusicPlayer';
import { colors } from '../styles/colors';
import { w, h, sp } from '../styles/size';

type HeaderProps = {
    track: Track;
    animation: AnimatedStyle;
    albumAnimation: AnimatedStyle;
    backgroundColor: string;
    onPress: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const Header = (props: HeaderProps) => {
    return (
        <AnimatedPressable
            onPress={props.onPress}
            style={[
                props.animation,
                {
                    ...styles.container,
                    backgroundColor: props.backgroundColor,
                }
            ]}
        >
            <Animated.Image
                source={{ uri: props.track.cover.thumbnail }}
                resizeMode='cover'
                style={[props.albumAnimation, styles.album]}
            />
            <View style={styles.titleWithArtistContainer}>
                <Text style={styles.title}>{props.track.title}</Text>
                <Text style={styles.artist}>{props.track.artist}</Text>
            </View>
            <View style={styles.controllerContainer}>
                <Ionicons
                    name='play-sharp'
                    size={sp(20)}
                    color={colors.textA}
                />
            </View>
        </AnimatedPressable>
    );
}

export const HEADER_HEIGHT = h(74);

export const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        height: HEADER_HEIGHT,
        gap: w(12),
        paddingHorizontal: w(8),
    },
    album: {
        width: w(40),
        height: w(40),
        borderRadius: 4,
    },
    titleWithArtistContainer: {
        flex: 1,
        justifyContent: 'center',
        rowGap: 4,
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