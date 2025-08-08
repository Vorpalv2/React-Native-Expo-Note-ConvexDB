import "@/app/globals.css";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { Text, View } from "react-native";
import Toast from "react-native-toast-message";

const toastConfig = {
  success: (internalState: any) => (
    <View
      style={{
        backgroundColor: "#4CAF50",
        borderColor: "#388E3C",
        borderWidth: 1,
        borderRadius: 8,
        padding: 16,
        marginHorizontal: 16,
        marginVertical: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        elevation: 5,
      }}
    >
      <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
        {internalState.text1}
      </Text>
      {internalState.text2 && (
        <Text style={{ color: "white", fontSize: 14, marginTop: 4 }}>
          {internalState.text2}
        </Text>
      )}
    </View>
  ),
  error: (internalState: any) => (
    <View
      style={{
        backgroundColor: "#F44336",
        borderColor: "#D32F2F",
        borderWidth: 1,
        borderRadius: 8,
        padding: 16,
        marginHorizontal: 16,
        marginVertical: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      }}
    >
      <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
        {internalState.text1}
      </Text>
      {internalState.text2 && (
        <Text style={{ color: "white", fontSize: 14, marginTop: 4 }}>
          {internalState.text2}
        </Text>
      )}
    </View>
  ),
};

export default function RootLayout() {
  const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
    unsavedChangesWarning: false,
  });

  const [fontsLoaded, error] = useFonts({
    "Quicksand-Bold": require("@/assets/fonts/Quicksand-Bold.ttf"),
    "Quicksand-Light": require("@/assets/fonts/Quicksand-Light.ttf"),
    "Quicksand-Medium": require("@/assets/fonts/Quicksand-Medium.ttf"),
    "Quicksand-Regular": require("@/assets/fonts/Quicksand-Regular.ttf"),
    "Quicksand-SemiBold": require("@/assets/fonts/Quicksand-SemiBold.ttf"),
  });

  useEffect(() => {
    if (error) {
      console.error("Error loading fonts:", error);
      return;
    }
    if (fontsLoaded) {
      SplashScreen.hideAsync().catch(console.error);
    }
  }, [fontsLoaded, error]);

  return (
    <ConvexProvider client={convex}>
      <Toast config={toastConfig} />
      <Stack screenOptions={{ headerShown: false }} />
    </ConvexProvider>
  );
}
