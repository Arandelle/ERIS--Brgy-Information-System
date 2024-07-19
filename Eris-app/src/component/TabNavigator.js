import React, { useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "./Home";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Map from "./Map";
import Request from "./Request";
import Notification from "./Notification";
import Profile from "./Profile";
import SignupForm from "./SignupForm";
import { View, Text } from "react-native";

const Tab = createBottomTabNavigator();

const TabNavigator = ({ setAuth }) => {
  const [badgeSize, setBadgeSize] = useState(0);
  const [isProfileComplete, setIsProfileComplete] = useState(false);

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: true,
        tabBarIcon: ({ focused, color, size }) => {

          const icons = {
            Home: "home-outline",
            Map: "map-marker-outline",
            Request: "plus",
            Notification: "bell-outline",
            Profile: "account-circle-outline"
          }

          const iconName = icons[route.name]
          const isMiddle = route.name === "Request";

          return (
            <View className="items-center">
              <View
                className={`items-center justify-center ${isMiddle ? "h-[55px] w-[55px] bottom-[25px] rounded-full border-white border bg-blue-400" : "bg-transparent"}`}
              >
                <Icon
                  name={iconName}
                  size={isMiddle ? size : size + 4}
                  color={isMiddle ? "white" : color}
                />
              </View>
            </View>
          );
        },
        tabBarActiveTintColor: "#42a5f5",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          paddingBottom: 10,
          paddingTop: 10,
          height: 70,
          position: "absolute",
          bottom: 16,
          right: 16,
          left: 16,
          borderRadius: 10,
        },
        tabBarLabelStyle: {
          fontSize: 15,
        },
        tabBarHideOnKeyboard: true,
      })}
    >
      <Tab.Screen name="Home" options={{title: "ERIS"}}>
        {(props) => (
          <Home
            {...props}
            setAuth={setAuth}
            badgeSize={badgeSize}
            setBadgeSize={setBadgeSize}
          />
        )}
      </Tab.Screen>
      <Tab.Screen
        name="Map"
        component={Map}
        options={{ title: "Map" }}
      />
      <Tab.Screen name="Request" component={Request} />
      <Tab.Screen
        name="Notification"
        component={Notification}
        options={{
          title: "Notification",
          tabBarBadge: badgeSize === 0 ? null : badgeSize,
        }}
      />
      <Tab.Screen
        name="Profile"
        options={{
          title: "Profile",
          headerShown: true,
          tabBarBadge: isProfileComplete ? null : true,
        }}
      >
        {(props) => (
          <Profile {...props} setIsProfileComplete={setIsProfileComplete} />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export default TabNavigator;
