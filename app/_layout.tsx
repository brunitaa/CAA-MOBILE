import { CaregiverProvider } from "@/context/caregiverContext";
import { GridProvider } from "@/context/gridContext";
import { GridPictogramProvider } from "@/context/gridPictogramContext";
import { PictogramProvider } from "@/context/pictogramContext";
import { SelectedGridProvider } from "@/context/selectedGridContext";
import { SelectedPictogramProvider } from "@/context/selectedPictogramContext";
import { SelectedSpeakerProvider } from "@/context/selectedSpeakerContext";
import { SpeakerProvider } from "@/context/speakerContext";
import { Stack } from "expo-router";
import React from "react";

export default function RootLayout() {
  return (
    <CaregiverProvider>
      <SpeakerProvider>
        <PictogramProvider>
          <SelectedSpeakerProvider>
            <SelectedPictogramProvider>
              <GridProvider>
                <GridPictogramProvider>
                  <SelectedGridProvider>
                    <Stack screenOptions={{ headerShown: false }} />
                  </SelectedGridProvider>
                </GridPictogramProvider>
              </GridProvider>
            </SelectedPictogramProvider>
          </SelectedSpeakerProvider>
        </PictogramProvider>
      </SpeakerProvider>
    </CaregiverProvider>
  );
}
