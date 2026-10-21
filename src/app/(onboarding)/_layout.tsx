import { colors } from '@/constants/colors';
import { Stack } from 'expo-router';

export default function OnboardingLayout() {
    return (
        // Borderless nav bar on the screen background with a plain back chevron
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
            <Stack.Screen name="goalexampleinput" />
            <Stack.Screen name="winexampleinput" />
            <Stack.Screen name="addphotos" />
            <Stack.Screen name="showmockup" />
            <Stack.Screen name="valueprop" />
            {/* <Stack.Screen name="science" /> */}
            
            <Stack.Screen name="profeaturesone" />
            <Stack.Screen name="profeaturestwo" />
            {/* <Stack.Screen name="progressionmap" />
            <Stack.Screen name="reviews" /> */}
            <Stack.Screen name="paywall" /> 
        </Stack>
    );
}
