import { useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import Animated, { interpolate, runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

const HEADER_HEIGHT = 74;
const FAST_VELOCITY_Y = 1000;

const MusicPlayer = () => {
    const dimensions = useWindowDimensions();
    const offsetY = useSharedValue<number>(0);

    const expandedOffsetY = useMemo(() => -dimensions.height + HEADER_HEIGHT * 1.5, []);

    const style = useAnimatedStyle(() => ({
        opacity: interpolate(offsetY.value, [0, expandedOffsetY], [1, 0]),
        transform: [
            { translateY: offsetY.value },
        ],
    }), []);

    const fold = useCallback(() => {
        offsetY.value = withTiming(0);
    }, []);

    const expand = useCallback(() => {
        offsetY.value = withTiming(expandedOffsetY);
    }, []);

    const gesture = Gesture.Pan()
        .onChange(event => {
            const delta = event.changeY + offsetY.value;
            offsetY.value = delta > 0 ? 0 : delta;
        })
        .onEnd(event => {
            const isFast = Math.abs(event.velocityY) >= FAST_VELOCITY_Y;
            if (isFast) {
                const shouldExpand = event.velocityY >= FAST_VELOCITY_Y;
                runOnJS(shouldExpand ? fold : expand)();
                return;
            }

            const isOver = Math.abs(offsetY.value - HEADER_HEIGHT) > dimensions.height * 0.5;
            runOnJS(isOver ? expand : fold)();
        });

    return (
        <GestureDetector gesture={gesture}>
            <Animated.View style={[style, styles.headerContainer]}>
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

    );
}

const styles = StyleSheet.create({
    headerContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: 12,
        position: 'absolute',
        width: '100%',
        height: HEADER_HEIGHT,
        paddingHorizontal: 8,
        bottom: 0,
    },
    album: {
        width: 40,
        height: 40,
        backgroundColor: 'green',
    },
    titleWithArtistContainer: {
        flex: 1,
        justifyContent: 'center',
        rowGap: 4,
    },
    title: {
        fontSize: 14,
        fontWeight: '700',
        color: 'black'
    },
    artist: {
        fontSize: 12,
        fontWeight: '400',
        color: 'grey'
    },
    controllerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: 12,
    },
});

export default MusicPlayer;