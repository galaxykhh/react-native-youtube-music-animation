import { BottomTabNavigationProp, BottomTabScreenProps, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MusicListScreen from '../screens/MusicList';
import ProfileScreen from '../screens/Profile';
import { createNativeStackNavigator, NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import MusicDetailsScreen from '../screens/MusicDetails';
import MusicPlayer from '../components/MusicPlayer';

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

            <MusicPlayer
                music={{
                    title: 'The End of the World',
                    artist: 'Skeeter Davis',
                    cover: {
                        main: 'https://lh3.googleusercontent.com/qSL8OhDZrb2B3wlJT_jXU1m7fraQcD41y2BTU28ofspF0S1SBd0tlz0R0jMsg57AWu5XYXuDKT8vGEHm=w544-h544-s-l90-rj',
                        thumbnail: 'https://lh3.googleusercontent.com/qSL8OhDZrb2B3wlJT_jXU1m7fraQcD41y2BTU28ofspF0S1SBd0tlz0R0jMsg57AWu5XYXuDKT8vGEHm=w60-h60-s-l90-rj',
                    }
                }}
            />
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