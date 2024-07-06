// LoginForm.js
import React, { useState } from "react";
import { View, Text, TextInput,TouchableOpacity, Button, StyleSheet } from "react-native";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [text, setTextView] = useState("");

  const handleLogin = () => {
    // Handle login logic here
    console.log("Logging in with:", username, password);
    setTextView(
      `successfully log on, your username is ${username} and password is ${password}`
    );
  };

  return (
    <View className="flex h-screen w-full items-center justify-center bg-gray-100 dark:bg-gray-800 px-4">
      <View className="w-full max-w-md">
        <View className="space-y-1 mb-3">
          <Text className="text-center text-2xl">Welcome to Eris App!</Text>
        </View>

        <View className="space-y-4">
          <View className="space-y-2">
            <Text className="text-lg">Username</Text>
            <View className="relative">
              <TextInput
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                onChangeText={setUsername}
                value={username}
                placeholder="Enter your username"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View className="space-y-2">
            <View className="flex flex-row items-center justify-between">
              <Text className="text-lg">Password</Text>
              <Text className="text-lg">Forget Password</Text>
            </View>
            <View className="relative">
              <TextInput
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                onChangeText={setPassword}
                value={password}
                placeholder="Enter your password"
                secureTextEntry
              />
            </View>
          </View>

          <View>
          <TouchableOpacity className="w-full bg-blue-500 p-4 rounded" onPress={handleLogin}>
            <Text className="text-center text-white text-bold" >Login</Text>
          </TouchableOpacity>
            <Text>{text}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default LoginForm;
