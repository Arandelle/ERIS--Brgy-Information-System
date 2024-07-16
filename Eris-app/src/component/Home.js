import React, { useState, useEffect } from "react";
import { View, Text, Button, TextInput, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ref, update, onValue } from "firebase/database";
import { auth, database } from "./firebaseConfig";

const Home = ({ setAuth, badgeSize, setBadgeSize }) => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [userData, setUserData] = useState(null);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("isAuth");
      await AsyncStorage.removeItem("userData");
      setAuth(false);
      navigation.navigate("Login");
    } catch (e) {
      console.error(e);
    }
  };

  const handleBadgeSize = () => {
    setBadgeSize(badgeSize + 1);
  };

  const handleAddInfo = async () => {
    const user = auth.currentUser;
    if (user) {
      const userRef = ref(database, `users/${user.uid}`);
      try {
        await update(userRef, {
          name,
          age,
          email: user.email, // Add this line
        });
        await update(userRef, updatedData);
        await AsyncStorage.setItem("userData", JSON.stringify(updatedData));
        setUserData(updatedData);
        Alert.alert("Success", "User info updated successfully");
      } catch (error) {
        Alert.alert("Error", error.message);
      }
    } else {
      Alert.alert("Error", "User not authenticated");
    }
  };

  const loadUserData = async () => {
    try {
      const savedUserData = await AsyncStorage.getItem("userData");
      if (savedUserData) {
        const parsedUserData = JSON.parse(savedUserData);
        setUserData(parsedUserData);
        setName(parsedUserData.name || "");
        setAge(parsedUserData.age || "");
        setEmail(parsedUserData.email || "");
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  useEffect(() => {
    loadUserData();
    const user = auth.currentUser;
    if (user) {
      const userRef = ref(database, `users/${user.uid}`);
      const unsubscribe = onValue(userRef, async (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setUserData(data);
          setName(data.name || "");
          setAge(data.age || "");
          setEmail(data.email || "");
          await AsyncStorage.setItem("userData", JSON.stringify(data));
        }
      });

      // Cleanup function
      return () => unsubscribe();
    }
  }, []);

  return (
    <View className="h-full flex items-center justify-center bg-gray-100">
      <View className="flex flex-row w-72 justify-between">
        <Button title="Logout" onPress={handleLogout} />
        <Button title="Add Notification" onPress={handleBadgeSize} />
        <Button title="Add Info" onPress={handleAddInfo} />
      </View>
      <View className="w-full max-w-sm p-4">
        <Text className="text-lg mb-2">Name</Text>
        <TextInput
          className="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
        />
        <Text className="text-lg mb-2">Age</Text>
        <TextInput
          className="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
          value={age}
          onChangeText={setAge}
          placeholder="Enter your age"
        />
        <Text>Email: {email}</Text>
        <Text>Name: {userData?.name}</Text>
        <Text>Age: {userData?.age}</Text>
      </View>
    </View>
  );
};

export default Home;
