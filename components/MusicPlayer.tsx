import { useCallback, useMemo } from 'react';
import { StyleSheet, useWindowDimensions, Text, View, Pressable, ScrollView } from 'react-native';
import Animated, { Easing, Extrapolation, interpolate, interpolateColor, runOnJS, useAnimatedStyle, useDerivedValue, useSharedValue, withTiming } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Ionicons from '@expo/vector-icons/Ionicons';
import Header from './Header';
import { headerStyles } from '../styles/headerStyles';
import { colors } from '../styles/colors';
import Capsule from './Capsule';

const HEADER_HEIGHT = 74;
const TOOLBAR_HEIGHT = 50;
const FAST_VELOCITY_Y = 1000;
const EASING_BEZIER = Easing.bezier(0.25, 0.5, 0, 1);
const PLAYER_ANIMATION_DURATION = 500;

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

    const foldedOffsetY = useMemo(() => {
        return dimensions.height - HEADER_HEIGHT - (rest.bottomInsets ?? 0);
    }, [rest.bottomInsets]);

    const bodyAlbumSize = useMemo(() => {
        return dimensions.width * 0.85;
    }, []);

    const bodyAlbumPaddingHorizontal = useMemo(() => {
        return (dimensions.width - bodyAlbumSize) / 2;
    }, []);

    /** 플레이어 offset Y */
    const offsetY = useSharedValue<number>(foldedOffsetY);

    /** 헤더 배경색 */
    const headerBackgroundColor = useDerivedValue(() => interpolateColor(
        offsetY.value,
        [foldedOffsetY, foldedOffsetY / 3],
        [headerColor, bodyColor],
    ));

    /** 바디(컨텐츠) 투명도 */
    const bodyOpacity = useDerivedValue(() => interpolate(
        offsetY.value,
        [foldedOffsetY, 0],
        [0, 1],
        Extrapolation.CLAMP,
    ));

    const playerAnimation = useAnimatedStyle(() => ({
        transform: [{ translateY: offsetY.value }],
    }), []);

    const headerAnimation = useAnimatedStyle(() => {
        return {
            backgroundColor: headerBackgroundColor.value,
            opacity: interpolate(
                offsetY.value,
                [foldedOffsetY, foldedOffsetY / 3],
                [1, 0],
                Extrapolation.CLAMP,
            ),
        }
    }, []);

    const bodyHeaderAnimation = useAnimatedStyle(() => ({
        backgroundColor: headerBackgroundColor.value,
    }), []);

    const bodyContentAnimation = useAnimatedStyle(() => ({
        opacity: bodyOpacity.value,
    }), []);

    const toolbarAnimation = useAnimatedStyle(() => ({
        opacity: bodyOpacity.value,
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
            pointerEvents: offsetY.value === foldedOffsetY ? 'none' : 'auto',
            borderRadius: interpolate(
                offsetY.value,
                [foldedOffsetY, 0],
                [headerStyles.album.borderRadius, 0],
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
                        [
                            foldedOffsetY,
                            0,
                        ],
                        [
                            -(HEADER_HEIGHT + TOOLBAR_HEIGHT - (HEADER_HEIGHT - headerStyles.album.height) / 2),
                            0,
                        ],
                        Extrapolation.CLAMP,
                    )
                },
            ],
        }
    }, []);

    const minimize = useCallback(() => {
        offsetY.value = withTiming(foldedOffsetY, {
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

                    {/** Body Header */}
                    <View style={{ backgroundColor: bodyColor, zIndex: 1 }}>

                        {/** Body Toolbar */}
                        <Animated.View style={[toolbarAnimation, bodyStyles.toolbar]}>
                            <Pressable
                                onPress={minimize}
                                hitSlop={{ top: 16, bottom: 16, left: 20, right: 20 }}
                            >
                                <Ionicons
                                    name='chevron-down-sharp'
                                    size={18}
                                    color={colors.textA}
                                />
                            </Pressable>
                            <View style={bodyStyles.toolbarActionsContainer}>
                                <Ionicons
                                    name='ellipsis-vertical'
                                    size={18}
                                    color={colors.textA}
                                />
                            </View>
                        </Animated.View>

                        {/** Body Album */}
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

                    {/** Body */}
                    <View style={[
                        {
                            ...bodyStyles.container,
                            backgroundColor: bodyColor,
                            paddingTop: 20,
                        }
                    ]}>
                        <Animated.View style={bodyContentAnimation}>
                            <View style={{ paddingHorizontal: bodyAlbumPaddingHorizontal }}>
                                <Text style={bodyStyles.title}>{music.title}</Text>
                                <Text style={bodyStyles.artist}>{music.artist}</Text>
                            </View>

                            {/** Actions Container */}
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
                                    <Text style={{ color: colors.textA }}>Add</Text>
                                </Capsule>

                                <Capsule>
                                    <Ionicons name='share-social' color={colors.textA} />
                                    <Text style={{ color: colors.textA }}>Share</Text>
                                </Capsule>

                                <Capsule>
                                    <Ionicons name='save' color={colors.textA} />
                                    <Text style={{ color: colors.textA }}>Save</Text>
                                </Capsule>

                                <Capsule>
                                    <Ionicons name='radio' color={colors.textA} />
                                    <Text style={{ color: colors.textA }}>Radio</Text>
                                </Capsule>
                            </ScrollView>

                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                paddingHorizontal: bodyAlbumPaddingHorizontal
                            }}>
                                <Ionicons name='shuffle' color={colors.textA} size={30} />
                                <Ionicons name='play-skip-back' color={colors.textA} size={30} />
                                <Ionicons name='play-circle' color={colors.textA} size={80} />
                                <Ionicons name='play-skip-forward' color={colors.textA} size={30} />
                                <Ionicons name='repeat' color={colors.textA} size={30} />
                            </View>

                        </Animated.View>
                    </View>

                    {/** Header */}
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
        fontSize: 24,
        fontWeight: 700,
        marginBottom: 4,
        color: colors.textA,
    },
    artist: {
        fontSize: 16,
        fontWeight: 400,
        color: colors.textB,
    },
    toolbar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 12,
        height: TOOLBAR_HEIGHT,
    },
    toolbarActionsContainer: {
        flexDirection: 'row',
        gap: 20,
    },
    actionsContainer: {
        flexGrow: 0,
        alignItems: 'center',
        alignSelf: 'stretch',
        height: 50,
        marginVertical: 20,
        paddingHorizontal: 12,
        gap: 8,
        backgroundColor: colors.background0,
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