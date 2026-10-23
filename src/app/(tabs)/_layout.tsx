import { Tabs } from "expo-router";
import { Bolt, Newspaper, PlusCircle } from "lucide-react-native";

const PURPLE = "#A78BFA";
const MUTED = "#77748D";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: PURPLE,
        tabBarInactiveTintColor: MUTED,
        tabBarStyle: {
          backgroundColor: "#11111A",
          borderTopColor: "#292637",
          borderTopWidth: 1,
          height: 70,
          paddingTop: 10,
          paddingBottom: 12,
          elevation: 0,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },
        sceneStyle: {
          backgroundColor: "#09090F",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "feed",
          tabBarIcon: ({ color, size, focused }) => (
            <Newspaper color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="create"
        options={{
          title: "Create",
          tabBarIcon: ({ color, size }) => (
            <PlusCircle color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="about"
        options={{
          title: "About",
          tabBarIcon: ({ color, size }) => <Bolt color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
