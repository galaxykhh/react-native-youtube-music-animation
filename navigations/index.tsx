import { BottomTabNavigationProp, BottomTabScreenProps, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MusicListScreen from '../screens/MusicList';
import ProfileScreen from '../screens/Profile';
import { createNativeStackNavigator, NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import MusicDetailsScreen from '../screens/MusicDetails';

type HomeTabParamList = {
    MusicList: undefined;
    Profile: undefined;
}

const HomeTab = createBottomTabNavigator<HomeTabParamList>();
export type HomeTabNavigationProps = BottomTabNavigationProp<HomeTabParamList>;
export type MusicListScreenProps = BottomTabScreenProps<HomeTabParamList, 'MusicList'>;
export type ProfileScreenProps = BottomTabScreenProps<HomeTabParamList, 'Profile'>;

export const HomeTabNavigation = () => {
    return (
        <>
            <HomeTab.Navigator
                screenOptions={{
                    headerShown: false,
                    animation: 'shift',
                }}
            >
                <HomeTab.Screen
                    name='MusicList'
                    component={MusicListScreen}
                />
                <HomeTab.Screen
                    name='Profile'
                    component={ProfileScreen}
                />
            </HomeTab.Navigator>

        </>
    );
};

type RootStackParamList = {
    HomeTab: undefined;
    MusicDetails: undefined;
}

const RootStack = createNativeStackNavigator<RootStackParamList>();
export type RootStackNavigationProps = NativeStackNavigationProp<RootStackParamList>;
export type HomeTabScreenProps = NativeStackScreenProps<RootStackParamList, 'HomeTab'>;
export type MusicDetailsScreenProps = NativeStackScreenProps<RootStackParamList, 'MusicDetails'>;

export const RootNavigation = () => {
    return (
        <RootStack.Navigator>
            <RootStack.Screen
                name='HomeTab'
                component={HomeTabNavigation}
                options={{ headerShown: false }}
            />
            <RootStack.Screen
                name='MusicDetails'
                component={MusicDetailsScreen}
            />
        </RootStack.Navigator>
    );
}