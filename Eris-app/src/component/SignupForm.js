import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { app, auth } from "./firebaseConfig";
import Icon from "react-native-vector-icons/MaterialIcons";

const SignupForm = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [showPass, setShowPass] = useState(false);
  const [createType, setCreateType] = useState(true);
  const [isChecked, setChecked] = useState(false);

  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    return regex.test(email);
  };

  const handleSignup = async () => {

    if (!validateEmail(email)) {
      setError("Please use a valid gmail.com email address.");
      Alert.alert("Error signing up", error);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      await sendEmailVerification(user);
      console.log("User created:", user.uid);
      Alert.alert("Success", "Please check your email for verification")
      setEmail("")
      setPassword("")
      // Handle navigation or other logic after successful signup
    } catch (error) {
      setError(error.message);
      console.error("Error signing up:", error);
      Alert.alert("Error signing up", error)
    }
  };

  const toggleCheckbox = () => {
    setChecked(!isChecked);
  };

  const handleShowPass = () => {
    setShowPass(!showPass);
  };

  const handleCreateAccount = () => {
    setCreateType(!createType);
  };

  return (
    <View className="flex items-center">
      <View className="w-full max-w-sm mt-10">
        <View className="space-y-4">
          <View className="flex flex-row space-x-6">
            <TouchableOpacity onPress={handleCreateAccount}>
              <Text
                className={`text-xl ${
                  createType
                    ? "text-blue-500 border-b-2 pb-0.5 border-blue-500"
                    : "text-gray-400"
                } font-extrabold`}
              >
                Email
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleCreateAccount}>
              <Text
                className={`text-xl ${
                  !createType
                    ? "text-blue-500 border-b-2 pb-0.5 border-blue-500"
                    : "text-gray-400"
                } font-extrabold`}
              >
                Phone
              </Text>
            </TouchableOpacity>
          </View>
          <View className="space-y-2">
            <Text className="text-lg">{createType ? "Email" : "Phone"}</Text>
            <View className="relative z-10">
              <View className="flex items-center absolute top-4 left-3 z-50">
                <Icon
                  name={createType ? "email" : "call"}
                  size={20}
                  color="black"
                />
              </View>
              <TextInput
                className="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full ps-10 p-2.5 pl-10 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder={
                  createType ? "user@gmail.com" : "0 9 x x - x x x x - x x x"
                }
                autoCapitalize="none"
                onChangeText={setEmail}
                value={email}
              />
            </View>
          </View>
          <View className="space-y-2">
            <View className="flex flex-row items-center justify-between">
              <Text className="text-lg">Password</Text>
            </View>
            <View className="relative z-10">
              <View className="flex items-center absolute top-4 left-3 z-50">
                <Icon name="lock" size={20} color="black" />
              </View>
              <TextInput
                className="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full ps-10 p-2.5 pl-10 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                onChangeText={setPassword}
                value={password}
                placeholder="Type your password"
                secureTextEntry={!showPass}
              />
              <TouchableOpacity
                className="absolute right-4 top-4 flex items-center"
                onPress={handleShowPass}
              >
                <Icon
                  name={showPass ? "visibility" : "visibility-off"}
                  size={20}
                  color="black"
                />
              </TouchableOpacity>
            </View>
            <View className="py-3">
              <TouchableOpacity
                className="flex flex-row items-center"
                onPress={toggleCheckbox}
              >
                <View
                  className={`w-5 h-5 mr-2 border-[1px] rounded-md border-gray-300 bg-white ${
                    isChecked && "bg-blue-400"
                  }`}
                />
                <Text className="text-md">
                  I have read and agree to Eris'{" "}
                  <Text className="text-blue-600">Terms of Service</Text> and{" "}
                  <Text className="text-blue-600">Privacy Policy</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity
            className="w-full bg-blue-500 p-3 rounded"
            onPress={handleSignup}
          >
            <Text className="text-center text-lg text-white font-bold">
              Signup
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default SignupForm;
