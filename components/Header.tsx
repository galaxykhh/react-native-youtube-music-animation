import { View, Text, Pressable, Image } from 'react-native';
import Animated, { AnimatedStyle } from 'react-native-reanimated';
import { headerStyles as styles } from '../styles/headerStyles';
import { Music } from './MusicPlayer';

type HeaderProps = {
    music: Music;
    animation: AnimatedStyle;
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
            <Image
                source={{ uri: props.music.cover }}
                style={styles.album}
            />
            <View style={styles.titleWithArtistContainer}>
                <Text style={styles.title}>{props.music.title}</Text>
                <Text style={styles.artist}>{props.music.artist}</Text>
            </View>
            <View style={styles.controllerContainer}>
                <Text>Play</Text>
            </View>
        </AnimatedPressable>
    );
}

export default Header;