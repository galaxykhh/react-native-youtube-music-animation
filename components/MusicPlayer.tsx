import { useCallback, useMemo } from 'react';
import { StyleSheet, useWindowDimensions, Text, View, Pressable, ScrollView } from 'react-native';
import Animated, { Easing, Extrapolation, interpolate, interpolateColor, runOnJS, useAnimatedStyle, useDerivedValue, useSharedValue, withTiming } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Ionicons from '@expo/vector-icons/Ionicons';
import Header from './Header';
import { HEADER_HEIGHT, headerStyles } from '../styles/headerStyles';
import { colors } from '../styles/colors';
import Capsule from './Capsule';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { h, sp, w } from '../styles/size';

const TOOLBAR_HEIGHT = h(50);
const FAST_VELOCITY_Y = 1000;
const EASING_BEZIER = Easing.bezier(0.25, 0.5, 0, 1);
const PLAYER_ANIMATION_DURATION = 500;
const BODY_ALBUM_SIZE = w(310);
const SHEET_HEADER_HEIGHT = h(70);
const controllerIconSizes = {
    play: sp(75),
    others: sp(25),
};

type PlayerState =
    | 'collapsed' // 축소
    | 'expanded' // 확장
    | 'fullyExpanded'; // 최대 확장

export type MusicCover = {
    thumbnail: string;
    main: string;
};

export type Music = {
    title: string;
    artist: string;
    cover: MusicCover;
}

export type MusicPlayerProps = {
    music: Music
    headerColor?: string;
    bodyColor?: string;
    bottomInsets?: number;
};

const MusicPlayer = ({
    music,
    headerColor = '#ffffff',
    bodyColor = '#ffffff',
    ...rest
}: MusicPlayerProps) => {
    /** 고정 사이즈 */
    const dimensions = useWindowDimensions();
    const safeAreaInsets = useSafeAreaInsets();

    /** 하단 시트 높이 */
    const sheetHeight = useMemo(() => {
        return dimensions.height - HEADER_HEIGHT - safeAreaInsets.top;
    }, [dimensions.height, safeAreaInsets.top]);

    /** 바디 내 앨범 횡패딩 */
    const bodyAlbumPaddingHorizontal = useMemo(() => {
        return (sp(375) - BODY_ALBUM_SIZE) / 2
    }, []);

    /** 최대 OffsetY */
    const maxOffsetY = useMemo(() => {
        return dimensions.height - HEADER_HEIGHT - rest.bottomInsets;
    }, [dimensions.height, rest.bottomInsets]);

    /** 최소 offsetY */
    const minOffsetY = useMemo(() => {
        return -1 * (dimensions.height - HEADER_HEIGHT - safeAreaInsets.top - SHEET_HEADER_HEIGHT + rest.bottomInsets);
    }, [dimensions.height, safeAreaInsets.top]);


    /** 플레이어 offset Y */
    const offsetY = useSharedValue<number>(maxOffsetY);

    /** 플레이어 상태 */
    const playerState = useDerivedValue<PlayerState>(() => {
        const isFullyExpanded = offsetY.value === minOffsetY;

        if (isFullyExpanded) {
            return 'fullyExpanded';
        }

        const isExpanded = offsetY.value === 0;

        if (isExpanded) {
            return 'expanded'
        }

        return 'collapsed';
    });

    /** 헤더 배경색 */
    const headerBackgroundColor = useDerivedValue(() => interpolateColor(
        offsetY.value,
        [maxOffsetY, maxOffsetY / 3],
        [headerColor, bodyColor],
    ));

    /** 헤더 높이 */
    const headerHeight = useDerivedValue(() => interpolate(
        offsetY.value,
        [minOffsetY, 0, maxOffsetY],
        [HEADER_HEIGHT, safeAreaInsets.top, HEADER_HEIGHT],
        Extrapolation.CLAMP,
    ));

    /** 바디(컨텐츠) 투명도 */
    const bodyOpacity = useDerivedValue(() => interpolate(
        offsetY.value,
        [minOffsetY, 0, maxOffsetY],
        [0, 1, 0],
        Extrapolation.CLAMP,
    ));

    const sheetAnimation = useAnimatedStyle(() => ({
        backgroundColor: interpolateColor(
            offsetY.value,
            [0, minOffsetY],
            [bodyColor, headerColor],
        ),
        transform: [
            {
                translateY: interpolate(
                    offsetY.value,
                    [0, minOffsetY],
                    [-rest.bottomInsets, 0],
                )
            }
        ]
    }), []);

    const playerAnimation = useAnimatedStyle(() => ({
        transform: [{ translateY: offsetY.value }],
    }), []);

    const headerAnimation = useAnimatedStyle(() => {
        return {
            backgroundColor: headerBackgroundColor.value,
            opacity: interpolate(
                offsetY.value,
                [minOffsetY, 0, maxOffsetY],
                [1, 0, 1],
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

    const bodyHeaderAnimation = useAnimatedStyle(() => ({
        backgroundColor: headerBackgroundColor.value,
        height: headerHeight.value,
    }), []);

    const bodyContentAnimation = useAnimatedStyle(() => ({
        opacity: bodyOpacity.value,
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

    const toolbarAnimation = useAnimatedStyle(() => ({
        opacity: bodyOpacity.value,
    }), []);

    const bodyAlbumAnimation = useAnimatedStyle(() => {
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
            pointerEvents: offsetY.value === maxOffsetY ? 'none' : 'auto',
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
                            headerStyles.container.paddingHorizontal,
                            bodyAlbumPaddingHorizontal,
                            headerStyles.container.paddingHorizontal,
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
        }
    }, []);

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

    return (
        <>
            <GestureDetector gesture={gesture}>
                <Animated.View
                    style={
                        [
                            playerAnimation,
                            {
                                ...styles.container,
                            }
                        ]
                    }>
                    {/* Body Header */}
                    <Animated.View style={
                        [
                            bodyHeaderAnimation,
                            {
                                ...headerStyles.container,
                                position: 'static'
                            }
                        ]
                    } />

                    {/* Body Header Background */}
                    <View style={{ backgroundColor: bodyColor, zIndex: 1 }}>

                        {/* Body Toolbar */}
                        <Animated.View style={[toolbarAnimation, bodyStyles.toolbar]}>
                            <Pressable
                                onPress={collapse}
                                hitSlop={{ top: sp(16), bottom: sp(16), left: w(20), right: w(20) }}
                            >
                                <Ionicons
                                    name='chevron-down-sharp'
                                    size={sp(18)}
                                    color={colors.textA}
                                />
                            </Pressable>
                            <View style={bodyStyles.toolbarActionsContainer}>
                                <Ionicons
                                    name='ellipsis-vertical'
                                    size={sp(18)}
                                    color={colors.textA}
                                />
                            </View>
                        </Animated.View>

                        {/* Body Album */}
                        <Animated.Image
                            source={{ uri: music.cover.main }}
                            resizeMode='cover'
                            style={[
                                bodyAlbumAnimation,
                                {
                                    ...headerStyles.album,
                                }]}
                        />
                    </View>

                    {/* Body */}
                    <View
                        style={[
                            {
                                ...bodyStyles.container,
                                backgroundColor: bodyColor,
                                paddingTop: h(20),
                            }
                        ]}>
                        <Animated.View style={bodyContentAnimation}>
                            <View style={{ paddingHorizontal: bodyAlbumPaddingHorizontal }}>
                                <Text style={bodyStyles.title}>{music.title}</Text>
                                <Text style={bodyStyles.artist}>{music.artist}</Text>
                            </View>

                            {/* Actions Container */}
                            <ScrollView
                                horizontal
                                style={{ flexGrow: 0 }}
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={bodyStyles.actionsContainer}
                            >
                                <Capsule>
                                    <Ionicons name='thumbs-up' color={colors.textA} />
                                    <Text style={{ color: colors.textA }}>5588</Text>
                                </Capsule>

                                <Capsule>
                                    <Ionicons name='mail' color={colors.textA} />
                                    <Text style={{ color: colors.textA }}>30</Text>
                                </Capsule>

                                <Capsule>
                                    <Ionicons name='add' color={colors.textA} />
                                    <Text style={{ color: colors.textA }}>Save</Text>
                                </Capsule>

                                <Capsule>
                                    <Ionicons name='share-social' color={colors.textA} />
                                    <Text style={{ color: colors.textA }}>Share</Text>
                                </Capsule>

                                <Capsule>
                                    <Ionicons name='save' color={colors.textA} />
                                    <Text style={{ color: colors.textA }}>Download</Text>
                                </Capsule>

                                <Capsule>
                                    <Ionicons name='radio' color={colors.textA} />
                                    <Text style={{ color: colors.textA }}>Radio</Text>
                                </Capsule>
                            </ScrollView>

                            {/* Track Bar */}
                            <View style={{ ...bodyStyles.trackBar, width: BODY_ALBUM_SIZE, alignSelf: 'center' }}>

                            </View>

                            {/* Controller */}
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                paddingHorizontal: bodyAlbumPaddingHorizontal,
                                paddingTop: h(16),
                            }}>
                                <Ionicons name='shuffle' color={colors.textA} size={controllerIconSizes.others} />
                                <Ionicons name='play-skip-back' color={colors.textA} size={controllerIconSizes.others} />
                                <Ionicons name='play-circle' color={colors.textA} size={controllerIconSizes.play} />
                                <Ionicons name='play-skip-forward' color={colors.textA} size={controllerIconSizes.others} />
                                <Ionicons name='repeat' color={colors.textA} size={controllerIconSizes.others} />
                            </View>
                        </Animated.View>

                        {/* Sheet */}
                        <Animated.View
                            style={
                                [
                                    {
                                        ...bodyStyles.sheetTabContainer,
                                        bottom: -1 * (dimensions.height - HEADER_HEIGHT - safeAreaInsets.top + rest.bottomInsets - SHEET_HEADER_HEIGHT),
                                        height: sheetHeight,
                                    },
                                    sheetAnimation,
                                ]
                            }
                        >
                            <Text style={bodyStyles.tab}>UP NEXT</Text>
                            <Text style={bodyStyles.tab}>LYRICS</Text>
                            <Text style={bodyStyles.tab}>RELATED</Text>
                        </Animated.View>
                    </View>

                    {/* Header */}
                    <Header
                        onPress={expand}
                        music={music}
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
        fontSize: sp(24),
        fontWeight: 700,
        marginBottom: h(4),
        color: colors.textA,
    },
    artist: {
        fontSize: sp(16),
        fontWeight: 400,
        color: colors.textB,
    },
    toolbar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: w(12),
        height: TOOLBAR_HEIGHT,
        backgroundColor: colors.background0,
    },
    toolbarActionsContainer: {
        flexDirection: 'row',
        gap: w(20),
    },
    actionsContainer: {
        flexGrow: 0,
        alignItems: 'center',
        alignSelf: 'stretch',
        height: h(50),
        marginVertical: h(20),
        paddingHorizontal: w(12),
        gap: w(8),
        backgroundColor: colors.background0,
    },
    trackBar: {
        height: h(2),
        backgroundColor: colors.textB,
    },
    sheetTabContainer: {
        position: 'absolute',
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: colors.background0,
        padding: w(20),
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
    },
    tab: {
        color: colors.textB,
        fontWeight: 600,
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