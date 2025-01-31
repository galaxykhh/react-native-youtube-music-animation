import { StyleSheet, View } from 'react-native';
import { colors } from '../styles/colors';
import { PropsWithChildren } from 'react';

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
        gap: 4,
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: colors.background1,
        borderRadius: 999,
    }
});

export default Capsule;