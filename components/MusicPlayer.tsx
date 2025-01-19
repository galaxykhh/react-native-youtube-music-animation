import { useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import Animated, { interpolate, interpolateColor, runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

const HEADER_HEIGHT = 74;
const FAST_VELOCITY_Y = 1000;

const MusicPlayer = () => {
    const dimensions = useWindowDimensions();
    const expandedOffsetY = useMemo(() => 0, []);
    const foldedOffsetY = useMemo(() => dimensions.height - HEADER_HEIGHT, []);
    const offsetY = useSharedValue<number>(foldedOffsetY);


    const playerStyle = useAnimatedStyle(() => ({
        transform: [
            { translateY: offsetY.value },
        ],
    }), []);

    const headerStyle = useAnimatedStyle(() => ({
        opacity: interpolate(
            offsetY.value,
            [foldedOffsetY, expandedOffsetY],
            [1, 0]
        ),
    }), []);

    const bodyStyle = useAnimatedStyle(() => ({
        backgroundColor: interpolateColor(
            offsetY.value,
            [foldedOffsetY, expandedOffsetY],
            ['#fff', 'blue']
        )
    }), []);

    const fold = useCallback(() => {
        offsetY.value = withTiming(foldedOffsetY);
    }, []);

    const expand = useCallback(() => {
        offsetY.value = withTiming(expandedOffsetY);
    }, []);

    const gesture = Gesture.Pan()
        .onChange(event => {
            const delta = event.changeY + offsetY.value;
            offsetY.value = delta > foldedOffsetY ? foldedOffsetY : delta;
        })
        .onEnd(event => {
            const isFast = Math.abs(event.velocityY) >= FAST_VELOCITY_Y;
            if (isFast) {
                const shouldExpand = event.velocityY < FAST_VELOCITY_Y;
                runOnJS(shouldExpand ? expand : fold)();
                return;
            }

            const isOver = Math.abs(offsetY.value) > dimensions.height * 0.5;
            console.log(isOver, offsetY.value - HEADER_HEIGHT, dimensions.height * 0.5);
            runOnJS(isOver ? fold : expand)();
        });

    return (
        <GestureDetector gesture={gesture}>
            <Animated.View style={[playerStyle, styles.container]}>
                {/** TODO: Body */}
                <Animated.View style={[bodyStyle, styles.bodyContainer]}>
                    <Text>BODY</Text>
                </Animated.View>

                {/** Header */}
                <Animated.View style={[headerStyle, styles.headerContainer]}>
                    <View style={styles.album} />
                    <View style={styles.titleWithArtistContainer}>
                        <Text style={styles.title}>それを愛と呼ぶなら</Text>
                        <Text style={styles.artist}>Uru</Text>
                    </View>
                    <View style={styles.controllerContainer}>
                        <Text>Play</Text>
                    </View>
                </Animated.View>
            </Animated.View>
        </GestureDetector>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'absolute',
        width: '100%',
        height: '100%',
        bottom: 0,
    },
    headerContainer: {
        position: 'absolute',
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        columnGap: 12,
        height: HEADER_HEIGHT,
        paddingHorizontal: 8,
        backgroundColor: 'blue',
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
    bodyContainer: {
        flex: 1,
        paddingTop: HEADER_HEIGHT,
    },
});

export default MusicPlayer;