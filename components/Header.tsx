import { View, Text, Pressable } from 'react-native';
import Animated, { AnimatedStyle } from 'react-native-reanimated';
import { headerStyles as styles } from '../styles/headerStyles';

type HeaderProps = {
    title: string;
    artist: string;
    animation: AnimatedStyle,
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
            <View style={styles.album} />
            <View style={styles.titleWithArtistContainer}>
                <Text style={styles.title}>{props.title}</Text>
                <Text style={styles.artist}>{props.artist}</Text>
            </View>
            <View style={styles.controllerContainer}>
                <Text>Play</Text>
            </View>
        </AnimatedPressable>
    );
}

export default Header;