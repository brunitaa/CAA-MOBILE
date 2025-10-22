import { CaregiverProvider } from "@/context/caregiverContext";
import { SpeakerProvider } from "@/context/speakerContext";
import { Stack } from "expo-router";
import React from "react";

export default function RootLayout() {
  return (
    <CaregiverProvider>
      <SpeakerProvider>
        <Stack screenOptions={{ headerShown: false }}>
          {/* Pantallas principales */}
          <Stack.Screen name="index" />
          <Stack.Screen name="login-caregiver" />
          <Stack.Screen name="register-caregiver" />
          <Stack.Screen name="create-speaker" />
          <Stack.Screen name="speaker-selection" />
          <Stack.Screen name="caregiver" />
        </Stack>
      </SpeakerProvider>
    </CaregiverProvider>
  );
}
