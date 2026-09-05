import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import { useEffect } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { lessons } from '@/content'
import { validateAll } from '@/engine/validate-lesson'
import { colors } from '@/ui/theme/colors'
import { useAppFonts } from '@/ui/theme/use-app-fonts'

// L'écran de lancement reste affiché tant que les polices ne sont pas chargées.
void SplashScreen.preventAutoHideAsync()

if (__DEV__) {
  const errors = validateAll(lessons)
  if (errors.length > 0) throw new Error(`Leçons invalides :\n${errors.join('\n')}`)
}

export default function RootLayout() {
  // Si une police échoue (connexion instable sous Expo Go), on lance quand même : les styles retombent sur la police système.
  const fontsReady = useAppFonts()

  useEffect(() => {
    if (fontsReady) void SplashScreen.hideAsync()
  }, [fontsReady])

  if (!fontsReady) return null

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.papier }}>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.papier } }} />
    </GestureHandlerRootView>
  )
}
