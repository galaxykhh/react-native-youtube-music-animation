import { StyleSheet, Text, View, ScrollView, Image } from 'react-native';
import Animated, { runOnJS, useAnimatedReaction } from 'react-native-reanimated';
import { GestureDetector } from 'react-native-gesture-handler';
import Ionicons from '@expo/vector-icons/Ionicons';
import Header, { styles as headerStyles } from './Header';
import Capsule from './Capsule';
import Controller from './Controller';
import Toolbar from './Toolbar';
import { BODY_ALBUM_PADDING_HORIZONTAL, BODY_ALBUM_SIZE } from './values';
import { colors } from '../styles/colors';
import { h, sp, w } from '../styles/size';
import ProgressBar from './ProgressBar';
import { usePlayerAnimation } from './usePlayerAnimation';
import { useCallback, useEffect, useRef, useState } from 'react';

type PlayerState =
    | 'collapsed'
    | 'expanded'
    | 'fullyExpanded';

export type TrackCover = {
    thumbnail: string;
    main: string;
};

export type Track = {
    title: string;
    artist: string;
    cover: TrackCover;
}

export type MusicPlayerProps = {
    tracks: Track[];
    initialIndex?: number;
    headerColor?: string;
    bodyColor?: string;
    bottomInsets?: number;
    onStateChanged: (state: PlayerState) => void;
};

const MusicPlayer = ({
    tracks,
    initialIndex = 0,
    headerColor = '#ffffff',
    bodyColor = '#ffffff',
    ...rest
}: MusicPlayerProps) => {
    const [playerState, setPlayerState] = useState<PlayerState>('collapsed');
    const [isZeroOffset, setIsZeroOffset] = useState<boolean>(false);
    const [index, setIndex] = useState<number>(initialIndex);
    const currentTrack = tracks[index];
    const scrollRef = useRef<Animated.ScrollView>(null);

    // Animations
    const {
        maxOffsetY,
        minOffsetY,
        offsetY,
        sheetAnimation,
        playerAnimation,
        headerAnimation,
        headerAlbumAnimation,
        bodyHeaderAnimation,
        bodyContentAnimation,
        toolbarAnimation,
        bodyAlbumAnimation,
        tracksScrollViewAnimation,
        collapse,
        expand,
        expandFully,
        gesture,
    } = usePlayerAnimation({
        headerColor,
        bodyColor,
        bottomInsets: rest.bottomInsets,
    });

    /** Returns the scroll offset based on the index */
    const getScrollOffsetByIndex = useCallback((index: number) => {
        return index * w(375);
    }, []);

    /** Returns the index based on the scroll offset */
    const getIndexByScrollOffset = useCallback((offset: number) => {
        const divided = offset / w(375);
        const decimal = divided - Math.floor(divided);
        const operator = decimal < 0.5 ? Math.ceil : Math.round;

        return operator(divided);
    }, []);

    /** Moves to the previous track */
    const skipBack = () => {
        const canBack = index > 0;

        if (canBack) {
            setIndex(i => {
                const nextIndex = i - 1;
                scrollRef.current?.scrollTo({
                    x: getScrollOffsetByIndex(nextIndex),
                    y: 0,
                    animated: false,
                });

                return nextIndex;
            });
        }
    }

    /** Moves to the next track */
    const skipForward = () => {
        const canForward = index < tracks.length - 1;

        if (canForward) {
            setIndex(i => {
                const nextIndex = i + 1;
                scrollRef.current?.scrollTo({
                    x: getScrollOffsetByIndex(nextIndex),
                    y: 0,
                    animated: false,
                });

                return nextIndex;
            });
        }
    }

    // Reaction: Set player state by offsetY
    useAnimatedReaction(
        () => offsetY,
        (offsetY) => {
            if (offsetY.value === minOffsetY) {
                return runOnJS(setPlayerState)('fullyExpanded');
            }

            if (offsetY.value === 0) {
                return runOnJS(setPlayerState)('expanded');
            }

            if (offsetY.value === maxOffsetY) {
                return runOnJS(setPlayerState)('collapsed');
            }
        },
    );

    // Reaction: Set has zero offset by offsetY (Image <-> ScrollView)
    useAnimatedReaction(
        () => offsetY,
        (offsetY) => {
            runOnJS(setIsZeroOffset)(offsetY.value === 0);
        },
    );

    // Effect: onStateChanged callback
    useEffect(() => {
        rest.onStateChanged(playerState);
    }, [playerState]);

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

                        {/* Toolbar */}
                        <Toolbar
                            animation={toolbarAnimation}
                            onClosePress={collapse}
                            actions={(
                                <Ionicons
                                    name='ellipsis-vertical'
                                    size={sp(18)}
                                    color={colors.textA}
                                />
                            )}
                        />

                        {/* Body Album */}
                        <View style={{ height: BODY_ALBUM_SIZE }}>
                            {/* Animated Album */}
                            <Animated.Image
                                source={{ uri: currentTrack.cover.main }}
                                resizeMode='cover'
                                style={[
                                    bodyAlbumAnimation,
                                    {
                                        ...headerStyles.album,
                                    }]}
                            />

                            {/* Scrollable Area */}
                            <Animated.ScrollView
                                ref={scrollRef}
                                style={tracksScrollViewAnimation}
                                contentOffset={{ x: w(375) * initialIndex, y: 0 }}
                                horizontal
                                pagingEnabled
                                decelerationRate='fast'
                                showsHorizontalScrollIndicator={false}
                                onMomentumScrollEnd={(e) => setIndex(getIndexByScrollOffset(e.nativeEvent.contentOffset.x))}
                            >
                                {tracks.map(t => (
                                    <View
                                        key={t.title}
                                        style={{ width: w(375), alignItems: 'center' }}
                                    >
                                        <Image
                                            source={{ uri: t.cover.main }}
                                            resizeMode='cover'
                                            style={{ width: BODY_ALBUM_SIZE, height: BODY_ALBUM_SIZE }}
                                        />
                                    </View>
                                ))}
                            </Animated.ScrollView>
                        </View>
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
                            <View style={{ paddingHorizontal: BODY_ALBUM_PADDING_HORIZONTAL }}>
                                <Text style={bodyStyles.title}>{currentTrack.title}</Text>
                                <Text style={bodyStyles.artist}>{currentTrack.artist}</Text>
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

                            {/* Progress Bar */}
                            <ProgressBar />

                            {/* Controller */}
                            <Controller
                                onShufflePress={() => { }}
                                onSkipBackPress={skipBack}
                                onPlayPress={() => { }}
                                onSkipForwardPress={skipForward}
                                onRepeatPress={() => { }}
                            />
                        </Animated.View>

                        {/* Sheet */}
                        <Animated.View style={[bodyStyles.sheetTabContainer, sheetAnimation]}>
                            <Text style={bodyStyles.tab}>UP NEXT</Text>
                            <Text style={bodyStyles.tab}>LYRICS</Text>
                            <Text style={bodyStyles.tab}>RELATED</Text>
                        </Animated.View>
                    </View>

                    {/* Header */}
                    <Header
                        onPress={expand}
                        track={currentTrack}
                        animation={headerAnimation}
                        albumAnimation={headerAlbumAnimation}
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