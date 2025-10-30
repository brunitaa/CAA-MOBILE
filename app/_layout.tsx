import { CaregiverProvider } from "@/context/caregiverContext";
import { GridProvider } from "@/context/gridContext";
import { GridPictogramProvider } from "@/context/gridPictogramContext";
import { PictogramProvider } from "@/context/pictogramContext";
import { SelectedGridProvider } from "@/context/selectedGridContext";
import { SelectedPictogramProvider } from "@/context/selectedPictogramContext";
import { SelectedSpeakerProvider } from "@/context/selectedSpeakerContext";
import { SelectedSpeakerLoginProvider } from "@/context/selectSpeakerLoginContext";
import { SentenceProvider } from "@/context/sentenceContext";
import { SpeakerProvider } from "@/context/speakerContext";
import { Stack } from "expo-router";
import React from "react";

export default function RootLayout() {
  return (
    <CaregiverProvider>
      <SpeakerProvider>
        <SelectedSpeakerProvider>
          <PictogramProvider>
            <SelectedPictogramProvider>
              <GridProvider>
                <GridPictogramProvider>
                  <SelectedGridProvider>
                    <SelectedSpeakerLoginProvider>
                      <SentenceProvider>
                        <Stack screenOptions={{ headerShown: false }} />
                      </SentenceProvider>
                    </SelectedSpeakerLoginProvider>
                  </SelectedGridProvider>
                </GridPictogramProvider>
              </GridProvider>
            </SelectedPictogramProvider>
          </PictogramProvider>
        </SelectedSpeakerProvider>
      </SpeakerProvider>
    </CaregiverProvider>
  );
}
