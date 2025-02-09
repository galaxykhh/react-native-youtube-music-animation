import { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';
import { h, w } from '../../styles/size';

type Props = PropsWithChildren & {
    backgroundColor: string;
}

const Capsule = (props: Props) => {
    return (
        <View
            style={{
                ...styles.container,
                backgroundColor: props.backgroundColor,
            }}
        >
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
        borderRadius: 999,
    }
});

export default Capsule;