import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "../src/context/AuthContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerTitleStyle: {
            fontWeight: "700"
          },
          headerBackTitle: "Назад",
          contentStyle: {
            backgroundColor: "#f7f8fa"
          }
        }}
      >
        <Stack.Screen name="index" options={{ title: "Главная" }} />
        <Stack.Screen name="login" options={{ title: "Вход" }} />
        <Stack.Screen name="register" options={{ title: "Регистрация" }} />
        <Stack.Screen name="psychologists" options={{ title: "Психологи" }} />
        <Stack.Screen name="articles" options={{ title: "Статьи" }} />
        <Stack.Screen name="profile" options={{ title: "Профиль" }} />
        <Stack.Screen name="users" options={{ title: "Пользователи" }} />
        <Stack.Screen name="health" options={{ title: "API Health" }} />
      </Stack>
    </AuthProvider>
  );
}
