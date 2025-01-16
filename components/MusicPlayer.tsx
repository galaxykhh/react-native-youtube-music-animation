import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useEffect } from 'react';

const MusicPlayer = () => {
    const dimensions = useWindowDimensions();
    const fullScreenY = useSharedValue<number>(0);
    const style = useAnimatedStyle(() => ({
        // bottom: withTiming(`${offsetY.value}%`, { duration: 500 }),
        transform: [
            { translateY: fullScreenY.value },
        ],
    }), []);

    useEffect(() => {
        console.log(fullScreenY.value >= dimensions.height * .8)
    }, [fullScreenY.value]);

    const miniToFullscreenGesture = Gesture.Pan()
        .onChange((event) => {
            // const delta = event.changeY + offsetY.value;
            const delta = event.changeY + fullScreenY.value;
            fullScreenY.value = delta < 0 ? delta : 0;
        })
        .onEnd((event) => {
            const isFast = Math.abs(event.velocityY) >= 1000;

            if (!isFast) {

                const isOver = Math.abs(fullScreenY.value) >= dimensions.height * 0.5;
                if (isOver) {

                }

                return;
            }
        });

    return (
        // Mini
        <GestureDetector gesture={miniToFullscreenGesture}>
            <Animated.View style={[style, styles.container]}>
                <View style={styles.album} />
                <View style={styles.titleWithArtistContainer}>
                    <Text style={styles.title}>それを愛と呼ぶなら</Text>
                    <Text style={styles.artist}>Uru</Text>
                </View>
                <View style={styles.controllerContainer}>
                    <Text>Play</Text>
                </View>
            </Animated.View>
        </GestureDetector>

        // TODO: Fullscreen here
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        columnGap: 12,
        position: 'absolute',
        width: '100%',
        paddingHorizontal: 8,
        paddingVertical: 10,
        bottom: 0,
    },
    album: {
        width: 42,
        height: 42,
        backgroundColor: 'green',
    },
    titleWithArtistContainer: {
        flex: 1,
        justifyContent: 'center',
        rowGap: 4,
    },
    title: {
        fontSize: 14,
        fontWeight: 'bold',
        color: 'black'
    },
    artist: {
        fontSize: 12,
        color: 'grey'
    },
    controllerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: 12,
    },
});

export default MusicPlayer;