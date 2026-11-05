import { colors } from '@/constants/colors';
import { Stack } from 'expo-router';

export default function OnboardingLayout() {
    return (
        <Stack
            screenOptions={{
                title: '',
                headerStyle: { backgroundColor: colors.bg },
                headerTintColor: colors.textPrimary,
                headerShadowVisible: false,
                headerBackButtonDisplayMode: 'minimal',
                contentStyle: { backgroundColor: colors.bg },
            }}
        >
            <Stack.Screen name="hero" />
            <Stack.Screen name="explanation"/>
            <Stack.Screen name="winexampleinput" />
            <Stack.Screen name="addphotos" />
            <Stack.Screen name="showmockup" />
            <Stack.Screen name="valueprop" />
            <Stack.Screen name="profeaturesone" />
            <Stack.Screen name="profeaturestwo" />
            <Stack.Screen name="paywall" options={{ headerShown: false }} />
        </Stack>
    );
}
