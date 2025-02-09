import { useCallback, useMemo, useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Gesture, PanGesture } from 'react-native-gesture-handler';
import { AnimatedStyle, Extrapolation, interpolate, interpolateColor, runOnJS, useAnimatedReaction, useAnimatedStyle, useDerivedValue, useSharedValue, withTiming } from 'react-native-reanimated';
import { BODY_ALBUM_PADDING_HORIZONTAL, BODY_ALBUM_SIZE, EASING_BEZIER, FAST_VELOCITY_Y, PLAYER_ANIMATION_DURATION, SHEET_HEADER_HEIGHT } from '../values';
import { HEADER_HEIGHT, styles as headerStyles } from '../components/Header';
import { TOOLBAR_HEIGHT } from '../components/Toolbar';

export type AnimationState =
    | 'collapsed'
    | 'expanded'
    | 'fullyExpanded';

type UsePlayerAnimationOptions = {
    headerColor: string;
    bodyColor: string;
    bottomInsets?: number;
};

type UsePlayerAnimationHooks = {
    animationState: AnimationState;
    wrapperAnimation: AnimatedStyle;
    sheetAnimation: AnimatedStyle;
    playerAnimation: AnimatedStyle;
    headerAnimation: AnimatedStyle;
    headerAlbumAnimation: AnimatedStyle;
    bodyHeaderAnimation: AnimatedStyle;
    bodyAnimation: AnimatedStyle;
    bodyContentAnimation: AnimatedStyle;
    toolbarAnimation: AnimatedStyle;
    bodyAlbumAnimation: AnimatedStyle;
    tracksScrollAnimation: AnimatedStyle;
    tracksScrollWrapperAnimations: AnimatedStyle;
    collapse: () => void;
    expand: () => void;
    expandFully: () => void;
    gesture: PanGesture;
};

export const usePlayerAnimation = (options: UsePlayerAnimationOptions): UsePlayerAnimationHooks => {
    const dimensions = useWindowDimensions();
    const safeAreaInsets = useSafeAreaInsets();

    const [animationState, setAnimationState] = useState<AnimationState>('collapsed');

    const sheetHeight = useMemo(() => {
        return dimensions.height - HEADER_HEIGHT - safeAreaInsets.top;
    }, [dimensions.height, safeAreaInsets.top]);

    /**
     * The maximum value of offsetY.
     * maximum value indicates the [collapsed] state.
     */
    const maxOffsetY = useMemo(() => {
        return dimensions.height - HEADER_HEIGHT - safeAreaInsets.bottom - (options.bottomInsets ?? 0);
    }, [dimensions.height, safeAreaInsets.bottom, options.bottomInsets]);

    /**
     * The minimum value of offset Y.
     * minimum value indicates the [fullyExpanded] state.
     */
    const minOffsetY = useMemo(() => {
        return -1 * (dimensions.height - HEADER_HEIGHT - safeAreaInsets.top - SHEET_HEADER_HEIGHT + safeAreaInsets.bottom);
    }, [dimensions.height, safeAreaInsets.top, safeAreaInsets.bottom]);

    const offsetY = useSharedValue<number>(maxOffsetY);

    const headerBackgroundColor = useDerivedValue(() => interpolateColor(
        offsetY.value,
        [maxOffsetY, maxOffsetY / 3],
        [options.headerColor, options.bodyColor],
    ));

    const headerHeight = useDerivedValue(() => interpolate(
        offsetY.value,
        [-TOOLBAR_HEIGHT * 3, 0, maxOffsetY],
        [HEADER_HEIGHT, safeAreaInsets.top, HEADER_HEIGHT],
        Extrapolation.CLAMP,
    ));

    const bodyHeight = useMemo(() => {
        return dimensions.height - safeAreaInsets.top - TOOLBAR_HEIGHT - BODY_ALBUM_SIZE;
    }, [dimensions.height, safeAreaInsets.top]);

    const wrapperAnimation = useAnimatedStyle(() => ({
        backgroundColor: interpolateColor(
            offsetY.value,
            [maxOffsetY, 0],
            [`${options.bodyColor}00`, options.bodyColor],
            undefined,
        ),
    }), []);

    const sheetAnimation = useAnimatedStyle(() => {
        return {
            backgroundColor: interpolateColor(
                offsetY.value,
                [minOffsetY, 0],
                [options.headerColor, options.bodyColor],
            ),
            height: sheetHeight,
            top: interpolate(
                offsetY.value,
                [minOffsetY, 0],
                [
                    dimensions.height + safeAreaInsets.bottom - SHEET_HEADER_HEIGHT,
                    maxOffsetY + (options.bottomInsets ?? 0),
                ],
                Extrapolation.CLAMP,
            ),
        };
    }, [options.bodyColor, options.headerColor, safeAreaInsets.bottom]);

    const playerAnimation = useAnimatedStyle(() => ({
        transform: [{ translateY: offsetY.value }],
    }), []);

    const headerAnimation = useAnimatedStyle(() => {
        return {
            backgroundColor: headerBackgroundColor.value,
            opacity: interpolate(
                offsetY.value,
                [-safeAreaInsets.top * 3, -safeAreaInsets.top, 0, maxOffsetY],
                [1, 0, 0, 1],
                Extrapolation.CLAMP,
            ),
            height: headerHeight.value,
            transform: [
                {
                    translateY: interpolate(
                        offsetY.value,
                        [0, minOffsetY],
                        [0, safeAreaInsets.top - minOffsetY],
                        Extrapolation.CLAMP,
                    )
                }
            ],
        }
    }, []);

    const headerAlbumAnimation = useAnimatedStyle(() => ({
        opacity: offsetY.value === maxOffsetY || offsetY.value === minOffsetY ? 1 : 0,
    }), []);

    const bodyHeaderAnimation = useAnimatedStyle(() => ({
        backgroundColor: headerBackgroundColor.value,
        height: headerHeight.value,
    }), []);

    const bodyAnimation = useAnimatedStyle(() => ({
        height: bodyHeight,
        backgroundColor: options.bodyColor,
        transform: [
            {
                translateY: interpolate(
                    offsetY.value,
                    [minOffsetY, 0],
                    [-minOffsetY, 0],
                    Extrapolation.CLAMP,
                )
            }
        ],
    }), []);

    const bodyContentAnimation = useAnimatedStyle(() => ({
        opacity: interpolate(
            offsetY.value,
            [minOffsetY, 0, maxOffsetY],
            [0, 1, 0],
            Extrapolation.CLAMP,
        )
    }), []);

    const toolbarAnimation = useAnimatedStyle(() => ({
        opacity: interpolate(
            offsetY.value,
            [-TOOLBAR_HEIGHT, 0, maxOffsetY],
            [0, 1, 0],
            Extrapolation.CLAMP,
        ),
        pointerEvents: offsetY.value === 0 ? 'auto' : 'none',
        backgroundColor: headerBackgroundColor.value,
        transform: [
            {
                translateY: interpolate(
                    offsetY.value,
                    [minOffsetY, 0],
                    [-minOffsetY, 0],
                    Extrapolation.CLAMP,
                )
            }
        ]
    }), []);

    const bodyAlbumAnimation = useAnimatedStyle<{}>(() => {
        const size = interpolate(
            offsetY.value,
            [minOffsetY, 0, maxOffsetY],
            [headerStyles.album.width, BODY_ALBUM_SIZE, headerStyles.album.width],
            Extrapolation.CLAMP,
        );

        return {
            width: size,
            height: size,
            opacity: offsetY.value === maxOffsetY || offsetY.value === minOffsetY ? 0 : 1,
            pointerEvents: 'none',
            borderRadius: interpolate(
                offsetY.value,
                [minOffsetY, 0, maxOffsetY],
                [headerStyles.album.borderRadius, 0, headerStyles.album.borderRadius],
            ),
            transform: [
                {
                    translateX: interpolate(
                        offsetY.value,
                        [
                            minOffsetY,
                            0,
                            maxOffsetY,
                        ],
                        [
                            headerStyles.trackContainer.paddingHorizontal,
                            BODY_ALBUM_PADDING_HORIZONTAL,
                            headerStyles.trackContainer.paddingHorizontal,
                        ],
                        Extrapolation.CLAMP,
                    )
                },
                {
                    translateY: interpolate(
                        offsetY.value,
                        [
                            minOffsetY,
                            0,
                            maxOffsetY,
                        ],
                        [
                            -minOffsetY + safeAreaInsets.top - TOOLBAR_HEIGHT - (HEADER_HEIGHT + headerStyles.album.height) / 2,
                            0,
                            - 1 * (HEADER_HEIGHT + TOOLBAR_HEIGHT - (HEADER_HEIGHT - headerStyles.album.height) / 2),
                        ],
                        Extrapolation.CLAMP,
                    )
                },
            ],
        };
    }, []);

    const tracksScrollWrapperAnimations = useAnimatedStyle(() => ({
        height: interpolate(
            offsetY.value,
            [minOffsetY, 0, maxOffsetY],
            [0, BODY_ALBUM_SIZE, 0],
        ),
        backgroundColor: options.bodyColor,
    }), []);

    const tracksScrollAnimation = useAnimatedStyle(() => ({
        position: 'absolute',
        width: '100%',
        opacity: offsetY.value === 0 ? 1 : 0,
        backgroundColor: headerBackgroundColor.value,
    }), []);

    const collapse = useCallback(() => {
        offsetY.value = withTiming(maxOffsetY, {
            easing: EASING_BEZIER,
            duration: PLAYER_ANIMATION_DURATION,
        });
    }, []);

    const expand = useCallback(() => {
        offsetY.value = withTiming(0, {
            easing: EASING_BEZIER,
            duration: PLAYER_ANIMATION_DURATION,
        });
    }, []);

    const expandFully = useCallback(() => {
        offsetY.value = withTiming(minOffsetY, {
            easing: EASING_BEZIER,
            duration: PLAYER_ANIMATION_DURATION,
        });
    }, []);

    const gesture = Gesture.Pan()
        .onChange(event => {
            const delta = event.changeY + offsetY.value;
            offsetY.value = delta > maxOffsetY
                ? maxOffsetY
                : delta < minOffsetY
                    ? minOffsetY : delta;
        })
        .onEnd(event => {
            const isFast = Math.abs(event.velocityY) >= FAST_VELOCITY_Y;

            if (isFast) {
                const isScrolledUp = event.velocityY < 0;

                if (isScrolledUp) {
                    // collapsed -> expanded
                    const shouldExpand = (offsetY.value < maxOffsetY && offsetY.value > 0)
                    return runOnJS(shouldExpand ? expand : expandFully)();
                }
                // fullyExpanded -> expanded
                const shouldExpand = offsetY.value < 0 && offsetY.value > minOffsetY;
                return runOnJS(shouldExpand ? expand : collapse)();
            }

            const shouldExpand = offsetY.value < dimensions.height * 0.5;
            const shouldExpandFully = shouldExpand && offsetY.value < -(dimensions.height * 0.5 - HEADER_HEIGHT);
            runOnJS(shouldExpandFully ? expandFully : shouldExpand ? expand : collapse)();
        });

    // Reaction: Set player state by offsetY
    useAnimatedReaction(
        () => offsetY,
        (offsetY) => {
            if (offsetY.value === minOffsetY) {
                return runOnJS(setAnimationState)('fullyExpanded');
            }

            if (offsetY.value === 0) {
                return runOnJS(setAnimationState)('expanded');
            }

            if (offsetY.value === maxOffsetY) {
                return runOnJS(setAnimationState)('collapsed');
            }
        },
    );

    return {
        animationState,
        wrapperAnimation,
        sheetAnimation,
        playerAnimation,
        headerAnimation,
        headerAlbumAnimation,
        bodyHeaderAnimation,
        bodyAnimation,
        bodyContentAnimation,
        toolbarAnimation,
        bodyAlbumAnimation,
        tracksScrollAnimation,
        tracksScrollWrapperAnimations,
        collapse,
        expand,
        expandFully,
        gesture,
    };
}