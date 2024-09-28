import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Button, Icon } from 'native-base';

const PhotoScreen = () => {
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync();
    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
      <Button iconLeft onPress={pickImage}>
        <Icon name="camera" />
        <Text>Take a Photo</Text>
      </Button>
    </View>
  );
};

export default PhotoScreen;