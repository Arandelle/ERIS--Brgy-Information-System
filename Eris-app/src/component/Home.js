import React from 'react';
import { View, Text, Button, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Home = ({ setAuth }) => {
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('isAuth');
      setAuth(false);
      navigation.navigate('LoginForm');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View className="h-full flex items-center justify-center">
      <Text className="mb-20">This is the home</Text>
      <View className="flex flex-row w-60 justify-between">
        <Button title='Logout' onPress={handleLogout} />
        <Button title='Signup' onPress={()=> navigation.navigate('Signup')}/>
      </View>
    </View>
  );
};

export default Home;
