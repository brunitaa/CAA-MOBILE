import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WelcomeScreen from "../app/welcome";
import HomeScreen from "./HomeScreen";
import LoginCaregiverScreen from "./LoginCaregiverScreen";
import LoginSpeakerScreen from "./LoginSpeakerScreen";
import ProfileScreen from "./ProfileScreen";
import RegisterCaregiverScreen from "./RegisterCaregiverScreen";

const Stack = createNativeStackNavigator();

export default function StackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{
        headerShown: false, // quitar header por defecto
      }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="LoginSpeaker" component={LoginSpeakerScreen} />
      <Stack.Screen name="LoginCaregiver" component={LoginCaregiverScreen} />
      <Stack.Screen
        name="RegisterCaregiver"
        component={RegisterCaregiverScreen}
      />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}
