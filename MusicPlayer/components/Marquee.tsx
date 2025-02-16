import React, { PropsWithChildren, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { SharedValue, useAnimatedStyle, useFrameCallback, useSharedValue } from 'react-native-reanimated';
import { BODY_ARTWORK_SIZE } from '../values';
import { w } from '../../styles/size';

const SPACING = w(80);

type MeasureElementProps = PropsWithChildren & {
    onLayout: (v: number) => void;
}

const MeasureElement = ({ onLayout, children }: MeasureElementProps) => (
    <Animated.ScrollView
        horizontal
        style={styles.hidden}
        pointerEvents="box-none">
        <View onLayout={(ev) => onLayout(ev.nativeEvent.layout.width)}>
            {children}
        </View>
    </Animated.ScrollView>
);

type TranslatedElementProps = PropsWithChildren & {
    index: number;
    offset: SharedValue<number>;
    childrenWidth: number;
}

const TranslatedElement = ({ index, children, offset, childrenWidth }: TranslatedElementProps) => {
    const animatedStyle = useAnimatedStyle(() => {
        return {
            left: (index - 1) * childrenWidth,
            transform: [
                {
                    translateX: -offset.value,
                },
            ],
        };
    }, []);

    return (
        <Animated.View style={[styles.animatedStyle, animatedStyle, { marginRight: SPACING }]}>
            {children}
        </Animated.View>
    );
};

const getIndicesArray = (length: number) => Array.from({ length }, (_, i) => i);

type ClonerProps = {
    count: number;
    renderChild: (index: number) => React.JSX.Element;
}

const Cloner = ({ count, renderChild }: ClonerProps) => (
    <>{getIndicesArray(count).map(renderChild)}</>
);

type ChildrenScrollerProps = PropsWithChildren & {
    duration: number;
    childrenWidth: number;
    parentWidth: number;
}

const ChildrenScroller = ({
    duration,
    childrenWidth,
    parentWidth,
    children,
}: ChildrenScrollerProps) => {
    const offset = useSharedValue(0);
    const totalWidth = childrenWidth + SPACING;

    useFrameCallback((i) => {
        offset.value += (i.timeSincePreviousFrame ?? 1) * totalWidth / duration;
        offset.value = offset.value % totalWidth;
    }, true);

    const count = Math.ceil(parentWidth / totalWidth) + 2;
    const renderChild = (index: number) => (
        <TranslatedElement
            key={`clone-${index}`}
            index={index}
            offset={offset}
            childrenWidth={totalWidth}>
            {children}
        </TranslatedElement>
    );

    return <Cloner count={count} renderChild={renderChild} />;
};

const Marquee = ({ duration = 10000, children }) => {
    const [parentWidth, setParentWidth] = useState<number>(0);
    const [childrenWidth, setChildrenWidth] = useState<number>(0);
    const [shouldAnimate, setShouldAnimate] = useState<boolean>(true);

    return (
        (
            <View
                onLayout={(e) => setParentWidth(e.nativeEvent.layout.width)}
                pointerEvents="box-none">
                <View style={styles.row} pointerEvents="box-none">
                    <MeasureElement onLayout={(e) => {
                        setChildrenWidth(e);
                        setShouldAnimate(e >= BODY_ARTWORK_SIZE);
                    }}>
                        {children}
                    </MeasureElement>
                    {
                        shouldAnimate
                            ? (
                                childrenWidth > 0 && parentWidth > 0 && (
                                    <ChildrenScroller
                                        duration={duration}
                                        parentWidth={parentWidth}
                                        childrenWidth={childrenWidth}>
                                        {children}
                                    </ChildrenScroller>
                                )
                            )
                            : children
                    }
                </View>
            </View>
        )

    );
};

const styles = StyleSheet.create({
    animatedStyle: { position: 'absolute' },
    hidden: { opacity: 0, zIndex: -1 },
    row: { flexDirection: 'row-reverse', justifyContent: 'flex-start', overflow: 'hidden' },
});

export default Marquee;