import { View, Text } from 'react-native';
import Animated, { AnimatedStyle } from 'react-native-reanimated';
import { headerStyles as styles } from '../styles/headerStyles';

type HeaderProps = {
    animation: AnimatedStyle,
    backgroundColor: string;
}

const Header = (props: HeaderProps) => {
    return (
        <Animated.View style={[
            props.animation,
            {
                ...styles.container,
                backgroundColor: props.backgroundColor,
            }
        ]}>
            <View style={styles.album} />
            <View style={styles.titleWithArtistContainer}>
                <Text style={styles.title}>それを愛と呼ぶなら</Text>
                <Text style={styles.artist}>Uru</Text>
            </View>
            <View style={styles.controllerContainer}>
                <Text>Play</Text>
            </View>
        </Animated.View>
    );
}

export default Header;