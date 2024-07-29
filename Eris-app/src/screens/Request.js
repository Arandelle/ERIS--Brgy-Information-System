import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

const Request = () => {
  const [emergencyType, setEmergencyType] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");

  const handleSubmit = () => {
    // Here you would typically send the data to your backend
    // For now, we'll just show an alert
    Alert.alert("Emergency Request Submitted", "Help is on the way!");
  };

  return (
    <ScrollView className="flex-1 p-5 bg-gray-100">
      <Text className="font-bold text-xl text-center text-red-600 mb-5">
        Emergency Request
      </Text>

      <View className="space-y-5">
        <View className="">
          <Text className="text-lg mb-1 text-gray-600">Emergency Type:</Text>
          <View className="border border-gray-300 rounded-md bg-white">
            <Picker
              selectedValue={emergencyType}
              onValueChange={(itemValue) => setEmergencyType(itemValue)}
              className="h-22"
            >
              <Picker.Item label="Select type" value="" />
              <Picker.Item label="Medical" value="medical" />
              <Picker.Item label="Fire" value="fire" />
              <Picker.Item label="Police" value="police" />
              <Picker.Item label="Natural Disaster" value="disaster" />
            </Picker>
          </View>
        </View>

        <View>
          <Text className="text-lg mb-1 text-gray-600">Description:</Text>
          <TextInput
            className="border p-2.5 rounded-md border-gray-300 bg-white text-sm"
            multiline
            numberOfLines={4}
            onChangeText={setDescription}
            value={description}
            placeholder="Briefly describe the emergency"
          />
        </View>

        <View>
          <Text className="text-lg mb-1 text-gray-600">Location:</Text>
          <TextInput
            className="border p-2.5 rounded-md border-gray-300 bg-white text-sm"
            onChangeText={setLocation}
            value={location}
            placeholder="Your current location"
          />
        </View>
        <TouchableOpacity className="bg-red-600 p-3.5 rounded-md items-center" onPress={handleSubmit}>
          <Text className="text-white text-lg font-bold">Submit Emergency Request</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Request;