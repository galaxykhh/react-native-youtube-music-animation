import { useCallback, useMemo } from 'react';
import { StyleSheet, useWindowDimensions, Text } from 'react-native';
import Animated, { Extrapolation, interpolate, interpolateColor, runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Header from './Header';
import { headerStyles } from '../styles/headerStyles';

const HEADER_HEIGHT = 74;
const FAST_VELOCITY_Y = 1000;

export type MusicPlayerProps = {
    headerColor?: string;
    bodyColor?: string;
};

const MusicPlayer = ({
    headerColor = '#ffffff',
    bodyColor = '#ffffff'
}: MusicPlayerProps) => {

    /** sizes */
    const dimensions = useWindowDimensions();
    const foldedOffsetY = useMemo(() => dimensions.height - HEADER_HEIGHT, []);
    const bodyAlbumSize = useMemo(() => dimensions.width * 0.8, []);
    const bodyAlbumPaddingHorizontal = useMemo(() => (dimensions.width - bodyAlbumSize - headerStyles.container.paddingHorizontal * 2) / 2, []);
    const offsetY = useSharedValue<number>(foldedOffsetY);

    const playerAnimation = useAnimatedStyle(() => ({
        transform: [{ translateY: offsetY.value }],
    }), []);

    const headerAnimation = useAnimatedStyle(() => ({
        backgroundColor: interpolateColor(
            offsetY.value,
            [foldedOffsetY, 0],
            [headerColor, bodyColor]
        ),
        opacity: interpolate(
            offsetY.value,
            [foldedOffsetY, 0],
            [1, 0]
        ),
    }), []);

    const bodyHeaderAnimation = useAnimatedStyle(() => ({
        backgroundColor: interpolateColor(
            offsetY.value,
            [foldedOffsetY, 0],
            ['#ffffff00', bodyColor]
        ),
    }), []);

    const bodyContentAnimation = useAnimatedStyle(() => ({
        opacity: interpolate(
            offsetY.value,
            [foldedOffsetY, 0],
            [0, 1]
        ),
        transform: [
            {
                translateY: interpolate(
                    offsetY.value,
                    [foldedOffsetY, 0],
                    [-bodyAlbumSize, 0]
                )
            }
        ]
    }), []);

    const bodyAlbumAnimation = useAnimatedStyle(() => {
        const size = interpolate(
            offsetY.value,
            [foldedOffsetY, 0],
            [headerStyles.album.width, bodyAlbumSize],
            Extrapolation.CLAMP,
        );
        // 헤더 높이 + 대형 앨범사이즈에서 헤더높이를 제외한 한쪽부분
        const translateY = headerStyles.container.height + (bodyAlbumSize - headerStyles.container.height) / 2;

        return {
            width: size,
            height: size,
            borderRadius: interpolate(
                offsetY.value,
                [foldedOffsetY, 0],
                [headerStyles.album.borderRadius, 20],
            ),
            transform: [
                {
                    translateX: interpolate(
                        offsetY.value,
                        [foldedOffsetY, 0],
                        [0, bodyAlbumPaddingHorizontal],
                        Extrapolation.CLAMP,
                    )
                },
                {
                    translateY: interpolate(
                        offsetY.value,
                        [foldedOffsetY, 0],
                        [0, translateY],
                        Extrapolation.CLAMP,
                    )
                },
            ],

        }
    }, []);

    const bodyAnimation = useAnimatedStyle(() => ({
        backgroundColor: interpolateColor(
            offsetY.value,
            [foldedOffsetY, 0],
            [headerColor, bodyColor]
        ),
    }), [headerColor, bodyColor]);

    const minimize = useCallback(() => {
        offsetY.value = withTiming(foldedOffsetY);
    }, []);

    const expand = useCallback(() => {
        offsetY.value = withTiming(0);
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
                runOnJS(shouldExpand ? expand : minimize)();
                return;
            }

            const shouldExpand = offsetY.value < dimensions.height * 0.5;
            runOnJS(shouldExpand ? expand : minimize)();
        });

    return (
        <>
            <GestureDetector gesture={gesture}>
                <Animated.View style={
                    [
                        playerAnimation,
                        {
                            ...styles.container,
                        }
                    ]
                }>
                    {/** Body Header */}
                    <Animated.View style={[bodyHeaderAnimation, { ...headerStyles.container, position: 'static', zIndex: 100 }]}>
                        <Animated.View style={[bodyAlbumAnimation, headerStyles.album]}></Animated.View>
                    </Animated.View>

                    {/** Body */}
                    <Animated.View style={[
                        bodyAnimation,
                        {
                            ...bodyStyles.container,
                            backgroundColor: bodyColor,
                            paddingTop: bodyAlbumSize + 20,
                            paddingHorizontal: bodyAlbumPaddingHorizontal,
                        }
                    ]}>
                        <Animated.View style={bodyContentAnimation}>
                            <Text style={{ fontSize: 20 }}>Title</Text>
                            <Text style={{ fontSize: 14 }}>Artist</Text>
                        </Animated.View>
                    </Animated.View>
                    {/** Header */}
                    <Header
                        animation={headerAnimation}
                        backgroundColor={headerColor}
                    />
                </Animated.View>
            </GestureDetector>
        </>
    );
}

const bodyStyles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'flex-start',
    }
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'absolute',
        width: '100%',
        height: '100%',
        bottom: 0,
    },
});

export default MusicPlayer;