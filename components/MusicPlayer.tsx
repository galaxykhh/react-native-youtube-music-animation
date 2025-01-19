import { useCallback, useMemo } from 'react';
import { StyleSheet, useWindowDimensions, View, Text } from 'react-native';
import Animated, { interpolate, interpolateColor, runOnJS, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
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
    const offsetY = useSharedValue<number>(foldedOffsetY);
    const bodyAlbumSize = useMemo(() => dimensions.width * 0.8, []);
    const bodyAlbumPaddingHorizontal = useMemo(() => (dimensions.width - bodyAlbumSize - headerStyles.container.paddingHorizontal * 2) / 2, []);


    const playerAnimation = useAnimatedStyle(() => ({
        transform: [
            {
                translateY: withSpring(offsetY.value, {
                    damping: 20,
                    mass: 0.2,
                })
            },
        ],
    }), []);

    const headerAnimation = useAnimatedStyle(() => ({
        opacity: interpolate(
            offsetY.value,
            [foldedOffsetY, 0],
            [1, 0],
            'clamp',
        ),
    }), []);

    const bodyAlbumAnimation = useAnimatedStyle(() => {
        const paddingTop = headerStyles.container.height + (bodyAlbumSize - headerStyles.container.height) / 2;

        return {
            width: interpolate(
                offsetY.value,
                [foldedOffsetY, 0],
                [headerStyles.album.width, bodyAlbumSize]
            ),
            height: interpolate(
                offsetY.value,
                [foldedOffsetY, 0],
                [headerStyles.album.height, bodyAlbumSize]
            ),
            borderRadius: interpolate(
                offsetY.value,
                [foldedOffsetY, 0],
                [headerStyles.album.borderRadius, 20]
            ),
            transform: [
                {
                    translateX: interpolate(
                        offsetY.value,
                        [foldedOffsetY, 0],
                        [0, bodyAlbumPaddingHorizontal],
                    )
                },
                {
                    translateY: interpolate(
                        offsetY.value,
                        [foldedOffsetY, 0],
                        [0, paddingTop],
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
        )
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
        <GestureDetector gesture={gesture}>
            <Animated.View style={[playerAnimation, styles.container]}>

                {/** Body Header */}
                <View style={{ ...headerStyles.container, position: 'static', zIndex: 100 }}>
                    <Animated.View style={[bodyAlbumAnimation, headerStyles.album]}></Animated.View>
                </View>
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
                    <Text style={{ fontSize: 20 }}>Title</Text>
                    <Text style={{ fontSize: 14 }}>Artist</Text>
                </Animated.View>
                {/** Header */}
                <Header
                    animation={headerAnimation}
                    backgroundColor={headerColor}
                />
            </Animated.View>
        </GestureDetector>
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