import { useCallback, useMemo } from 'react';
import { StyleSheet, useWindowDimensions, Text, View } from 'react-native';
import Animated, { Easing, Extrapolation, interpolate, interpolateColor, runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Header from './Header';
import { headerStyles } from '../styles/headerStyles';
import { DefaultStyle } from 'react-native-reanimated/lib/typescript/hook/commonTypes';

const HEADER_HEIGHT = 74;
const TOOLBAR_HEIGHT = 74;
const FAST_VELOCITY_Y = 1000;
const EASING_BEZIER = Easing.bezier(0.25, 0.5, 0, 1);

export type MusicPlayerProps = {
    title: string;
    artist: string;
    headerColor?: string;
    bodyColor?: string;
};

const MusicPlayer = ({
    title,
    artist,
    headerColor = '#ffffff',
    bodyColor = '#ffffff'
}: MusicPlayerProps) => {

    /** sizes */
    const dimensions = useWindowDimensions();
    const foldedOffsetY = useMemo(() => dimensions.height - HEADER_HEIGHT, []);
    const bodyAlbumSize = useMemo(() => dimensions.width * 0.8, []);
    const bodyAlbumPaddingHorizontal = useMemo(() => (dimensions.width - bodyAlbumSize) / 2, []);
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
    }), []);

    const bodyAlbumAnimation = useAnimatedStyle(() => {
        const size = interpolate(
            offsetY.value,
            [foldedOffsetY, 0],
            [headerStyles.album.width, bodyAlbumSize],
            Extrapolation.CLAMP,
        );
        // 헤더 높이 + 대형 앨범사이즈에서 헤더높이를 제외한 한쪽부분

        return {
            width: size,
            height: size,
            opacity: offsetY.value === foldedOffsetY ? 0 : 1,

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
                        [headerStyles.container.paddingHorizontal, bodyAlbumPaddingHorizontal],
                        Extrapolation.CLAMP,
                    )
                },
                {
                    translateY: interpolate(
                        offsetY.value,
                        [foldedOffsetY, 0],
                        [-(HEADER_HEIGHT + TOOLBAR_HEIGHT - (HEADER_HEIGHT - headerStyles.album.height) / 2), 0],
                        Extrapolation.CLAMP,
                    )
                },
            ],
        } as DefaultStyle
    }, []);

    const bodyAnimation = useAnimatedStyle(() => ({
        backgroundColor: interpolateColor(
            offsetY.value,
            [foldedOffsetY, 0],
            [headerColor, bodyColor]
        ),
    }), [headerColor, bodyColor]);

    const minimize = useCallback(() => {
        offsetY.value = withTiming(foldedOffsetY, {
            easing: EASING_BEZIER,
            duration: 500,
        });
    }, []);

    const expand = useCallback(() => {
        offsetY.value = withTiming(0, {
            easing: EASING_BEZIER,
            duration: 500,
        });
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
                    <Animated.View style={
                        [
                            bodyHeaderAnimation,
                            {
                                ...headerStyles.container,
                                position: 'static'
                            }
                        ]
                    } />

                    {/** Body Album */}
                    <View style={{ backgroundColor: bodyColor, zIndex: 1, }}>

                        {/** Body Toolbar */}
                        <View style={bodyStyles.toolbar}></View>

                        <Animated.View style={[
                            bodyAlbumAnimation,
                            {
                                ...headerStyles.album,
                                backgroundColor: 'red',
                            }]}
                        />
                    </View>

                    {/** Body */}
                    <Animated.View style={[
                        bodyAnimation,
                        {
                            ...bodyStyles.container,
                            backgroundColor: bodyColor,
                            paddingTop: 20,
                            paddingHorizontal: bodyAlbumPaddingHorizontal,
                        }
                    ]}>
                        <Animated.View style={bodyContentAnimation}>
                            <Text style={bodyStyles.title}>{title}</Text>
                            <Text style={bodyStyles.artist}>{artist}</Text>
                        </Animated.View>
                    </Animated.View>

                    {/** Header */}
                    <Header
                        title={title}
                        artist={artist}
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
    },
    title: {
        fontSize: 24,
        fontWeight: 700,
    },
    artist: {
        fontSize: 16,
        fontWeight: 400,
    },
    toolbar: {
        height: TOOLBAR_HEIGHT,
        backgroundColor: 'green',
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