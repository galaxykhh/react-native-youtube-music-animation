import React, { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { AnimatedStyle } from 'react-native-reanimated';
import { w, h, sp } from '../styles/size';
import { colors } from '../styles/colors';
import { Ionicons } from '@expo/vector-icons';

export const TOOLBAR_HEIGHT = h(50);

type Props = {
    animation: AnimatedStyle;
    onClosePress: () => void;
    actions: ReactNode;
}

const Toolbar = (props: Props) => {
    return (
        <Animated.View style={[props.animation, styles.container]}>
            <Pressable
                onPress={props.onClosePress}
                hitSlop={{ top: h(16), bottom: h(16), left: w(20), right: w(20) }}
            >
                <Ionicons
                    name='chevron-down-sharp'
                    size={sp(18)}
                    color={colors.textA}
                />
            </Pressable>
            <View style={styles.actionsContainer}>
                {props.actions}
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: w(12),
        height: TOOLBAR_HEIGHT,
        backgroundColor: colors.background0,
    },
    actionsContainer: {
        flexDirection: 'row',
        gap: w(20),
    }
});

export default Toolbar;