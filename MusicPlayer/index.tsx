import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from 'react';
import { StyleSheet, Text, View, Image, ListRenderItemInfo } from 'react-native';
import Animated, { SlideInDown } from 'react-native-reanimated';
import { GestureDetector, FlatList, ScrollView } from 'react-native-gesture-handler';
import Ionicons from '@expo/vector-icons/Ionicons';
import { BODY_ARTWORK_PADDING_HORIZONTAL, BODY_ARTWORK_SIZE } from './values';
import { colors } from '../styles/colors';
import { h, sp, w } from '../styles/size';
import { AnimationState, usePlayerAnimation } from './hooks/usePlayerAnimation';
import { useTrack } from './hooks/useTrack';
import Header, { styles as headerStyles } from './components/Header';
import Capsule from './components/Capsule';
import Controller from './components/Controller';
import Toolbar from './components/Toolbar';
import ProgressBar from './components/ProgressBar';
import Marquee from './components/Marquee';

export type Track = {
    id: number;
    title: string;
    artist: string;
    artwork: string;
    artworkThumbnail: string;
    url: string;
}

export type MusicPlayerProps = {
    initialIndex?: number;
    headerColor?: string;
    bodyColor?: string;

    /**
     * Add spacing at the bottom in the collapsed state.
     * Useful for setting an appropriate height when using a bottom navigation
     */
    bottomInsets?: number;

    onAnimationStateChanged: (state: AnimationState) => void;
};

export type MusicPlayerHandler = {
    playTrack: (track: Track) => Promise<void>;
    playTracks: (tracks: Track[]) => Promise<void>;
};

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const MusicPlayer = forwardRef<MusicPlayerHandler, MusicPlayerProps>((
    {
        headerColor = '#ffffff',
        bodyColor = '#ffffff',
        ...rest
    },
    ref,
) => {
    const {
        playbackState,
        queue,
        index,
        isShuffle,
        isRepeat,
        canSkipBack,
        canSkipForward,
        duration,
        buffered,
        position,
        play,
        pause,
        playTrack,
        playTracks,
        toggleShuffle,
        toggleRepeat,
        skip,
        skipBack,
        skipForward,
    } = useTrack();

    const currentTrack = queue[index];
    const scrollRef = useRef<FlatList>(null);

    // Animations
    const {
        animationState,
        wrapperAnimation,
        sheetAnimation,
        playerAnimation,
        headerAnimation,
        headerArtworkAnimation,
        bodyHeaderAnimation,
        bodyAnimation,
        bodyContentAnimation,
        toolbarAnimation,
        bodyArtworkAnimation,
        tracksScrollAnimation,
        tracksScrollWrapperAnimations,
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
        const operator = decimal < 0.5 ? Math.floor : Math.round;

        return operator(divided);
    }, []);

    /** Handles skipping to the next track when the scroll end */
    const skipTrackOnScrollEnd = useCallback((offset: number) => {
        const nextIndex = getIndexByScrollOffset(offset);

        if (index !== nextIndex) {
            skip(nextIndex);
        }
    }, [index]);

    const renderTrack = useCallback(({ item }: ListRenderItemInfo<Track>) => {
        return (
            <View style={styles.trackContainer}>
                <Image
                    source={{ uri: item.artwork }}
                    resizeMode='cover'
                    style={styles.track}
                />
            </View>
        );
    }, []);

    // Effect: onAnimationStateChanged callback
    useEffect(() => {
        rest.onAnimationStateChanged(animationState);
    }, [animationState]);

    // Effect: set scroll offset by index
    useEffect(() => {
        scrollRef.current?.scrollToOffset({
            offset: getScrollOffsetByIndex(index),
            animated: false,
        });
    }, [index])

    useImperativeHandle(ref, () => ({
        playTrack,
        playTracks,
    }));

    return (
        <GestureDetector gesture={gesture}>
            <Animated.View style={[wrapperAnimation, styles.wrapper]}>
                {Boolean(queue.length) && (
                    <Animated.View
                        entering={SlideInDown}
                        style={playerAnimation}
                    >
                        {/* Body Header */}
                        <Animated.View style={
                            [
                                bodyHeaderAnimation,
                                {
                                    ...headerStyles.container,
                                    position: 'static',
                                }
                            ]
                        } />

                        {/* Body Header Background */}
                        < View style={{ backgroundColor: bodyColor, zIndex: 1 }}>
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

                            {/* Tracks Scroll Wrapper */}
                            <Animated.View style={tracksScrollWrapperAnimations}>
                                {/* Animated Artwork */}
                                <Animated.Image
                                    source={{ uri: currentTrack.artwork }}
                                    resizeMode='cover'
                                    style={[bodyArtworkAnimation, headerStyles.artwork]}
                                />

                                {/* Tracks Scroll View */}
                                <AnimatedFlatList
                                    style={tracksScrollAnimation}
                                    ref={scrollRef}
                                    data={queue}
                                    renderItem={renderTrack}
                                    keyExtractor={(item, index) => item['id'] + index}
                                    getItemLayout={(_, index) => ({
                                        length: w(375),
                                        offset: w(375) * index,
                                        index,
                                    })}
                                    scrollEventThrottle={16}
                                    horizontal
                                    pagingEnabled
                                    showsHorizontalScrollIndicator={false}
                                    onMomentumScrollEnd={e => skipTrackOnScrollEnd(e.nativeEvent.contentOffset.x)}
                                />
                            </Animated.View>
                        </View>

                        {/* Body */}
                        <Animated.View style={[bodyAnimation, styles.body]}>
                            <Animated.View style={bodyContentAnimation}>
                                <View style={{ paddingHorizontal: BODY_ARTWORK_PADDING_HORIZONTAL }}>
                                    <Marquee>
                                        <Text style={styles.title}>{currentTrack.title}</Text>
                                    </Marquee>
                                    <Text style={styles.artist}>{currentTrack.artist}</Text>
                                </View>

                                {/* Actions Container */}
                                <ScrollView
                                    horizontal
                                    style={{ flexGrow: 0 }}
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={styles.actionsContainer}
                                >
                                    <Capsule backgroundColor={colors.background1}>
                                        <Ionicons name='thumbs-up' color={colors.textA} />
                                        <Text style={{ color: colors.textA }}>5588</Text>
                                    </Capsule>

                                    <Capsule backgroundColor={colors.background1}>
                                        <Ionicons name='mail' color={colors.textA} />
                                        <Text style={{ color: colors.textA }}>30</Text>
                                    </Capsule>

                                    <Capsule backgroundColor={colors.background1}>
                                        <Ionicons name='add' color={colors.textA} />
                                        <Text style={{ color: colors.textA }}>Save</Text>
                                    </Capsule>

                                    <Capsule backgroundColor={colors.background1}>
                                        <Ionicons name='share-social' color={colors.textA} />
                                        <Text style={{ color: colors.textA }}>Share</Text>
                                    </Capsule>

                                    <Capsule backgroundColor={colors.background1}>
                                        <Ionicons name='save' color={colors.textA} />
                                        <Text style={{ color: colors.textA }}>Download</Text>
                                    </Capsule>

                                    <Capsule backgroundColor={colors.background1}>
                                        <Ionicons name='radio' color={colors.textA} />
                                        <Text style={{ color: colors.textA }}>Radio</Text>
                                    </Capsule>
                                </ScrollView>

                                {/* Progress Bar */}
                                <ProgressBar
                                    height={h(2)}
                                    width={BODY_ARTWORK_SIZE}
                                    duration={duration}
                                    buffered={buffered}
                                    position={position}
                                />

                                {/* Controller */}
                                <Controller
                                    playbackState={playbackState}
                                    isShuffle={isShuffle}
                                    isRepeat={isRepeat}
                                    canSkipBack={canSkipBack}
                                    canSkipForward={canSkipForward}
                                    onShufflePress={toggleShuffle}
                                    onSkipBackPress={skipBack}
                                    onPlayPress={play}
                                    onPausePress={pause}
                                    onSkipForwardPress={skipForward}
                                    onRepeatPress={toggleRepeat}
                                />
                            </Animated.View>
                        </Animated.View>

                        {/* Header */}
                        <Header
                            track={currentTrack}
                            animationState={animationState}
                            playbackState={playbackState}
                            animation={headerAnimation}
                            artworkAnimation={headerArtworkAnimation}
                            backgroundColor={headerColor}
                            progress={{
                                height: h(1),
                                width: w(375),
                                duration: duration,
                                buffered: buffered,
                                position: position,
                            }}
                            onHeaderPress={expand}
                            onPlayPress={play}
                            onPausePress={pause}
                        />

                        {/* Sheet */}
                        <Animated.View style={[styles.sheetTabContainer, sheetAnimation]}>
                            <Text style={styles.tab}>UP NEXT</Text>
                            <Text style={styles.tab}>LYRICS</Text>
                            <Text style={styles.tab}>RELATED</Text>
                        </Animated.View>
                    </Animated.View>

                )}
            </Animated.View>
        </GestureDetector>
    );
});

const styles = StyleSheet.create({
    wrapper: {
        position: 'absolute',
        pointerEvents: 'box-none',
        width: w(375),
        height: h(812),
    },
    body: {
        paddingTop: h(24),
    },
    trackContainer: {
        width: w(375),
        alignItems: 'center',
    },
    track: {
        width: BODY_ARTWORK_SIZE,
        height: BODY_ARTWORK_SIZE,
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
        alignItems: 'center',
        height: h(50),
        marginVertical: h(20),
        paddingHorizontal: w(12),
        gap: w(8),
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

export default MusicPlayer;