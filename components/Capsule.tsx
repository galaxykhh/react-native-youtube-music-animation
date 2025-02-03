import { StyleSheet, View } from 'react-native';
import { colors } from '../styles/colors';
import { PropsWithChildren } from 'react';
import { h, w } from '../styles/size';

const Capsule = (props: PropsWithChildren) => {
    return (
        <View style={styles.container}>
            {props.children}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: w(4),
        paddingHorizontal: w(12),
        paddingVertical: h(8),
        backgroundColor: colors.background1,
        borderRadius: 999,
    }
});

export default Capsule;