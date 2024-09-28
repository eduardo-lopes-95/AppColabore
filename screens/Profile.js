import React, { useState, useContext, useEffect } from 'react';
import { SafeAreaView } from 'react-native';
import { ScrollView, Box, VStack, Image, Button, Icon, Actionsheet, useDisclose, Text, HStack, Pressable, Spinner, Center } from 'native-base';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import Photo from './Photo';
import { useNavigation } from '@react-navigation/native';
import { ProfileContext } from '../contexts/ProfileContext';
import { supabase, supabaseHelper } from '../configs/supabaseClient';

const Profile = () => {
  const { isOpen, onOpen, onClose } = useDisclose();
  const { profileImage, setProfileImage } = useContext(ProfileContext);
  const [showPicMe, setShowPicMe] = useState(false);
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const userFields = [
    { label: 'Nome', key: 'full_name', icon: 'user' },
    { label: 'Matrícula', key: 'registration_number', icon: 'hash' },
    { label: 'Setor', key: 'department', icon: 'briefcase' },
    { label: 'Função', key: 'job_title', icon: 'award' },
    { label: 'Localização', key: 'location', icon: 'map-pin' },
  ];

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      if (user) {
        const { data, error } = await supabase
          .from('Profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        setUserData(data);
        if (data.profile_image_url) {
          setProfileImage(data.profile_image_url);
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const uploadProfileImage = async (imageUri) => {
    try {
      setLoading(true);
      const fileName = `profile_${Date.now()}.jpg`;
      const filePath = `profile/${fileName}`;

      const { data, error } = await supabaseHelper.uploadFileFromUri('app-colabore', filePath, imageUri, {
        contentType: 'image/jpeg',
      });

      if (error) throw error;

      const publicUrl = supabaseHelper.getPublicUrl('app-colabore', filePath);

      const { data: updateData, error: updateError } = await supabase
        .from('Profiles')
        .update({ profile_image_url: publicUrl })
        .eq('id', userData.id);

      if (updateError) throw updateError;

      setProfileImage(publicUrl);
      setUserData({ ...userData, profile_image_url: publicUrl });
    } catch (error) {
      console.error('Error uploading profile image:', error.message);
      alert('Failed to upload profile image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelection = async (type) => {
    if (type === 'gallery') {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        await uploadProfileImage(result.assets[0].uri);
      }
    } else if (type === 'camera') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        const imageUri = result.assets[0].uri;
        await uploadProfileImage(imageUri);
      }
    }
    onClose();
  };

  const handlePicMeCapture = (imageUri) => {
    setProfileImage(imageUri);
    setShowPicMe(false);
  };

  const handleOpenOnboarding = () => {
    navigation.navigate('Onboarding');
  };

  const handleOpenResume = () => {
    navigation.navigate('Resume');
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 10, backgroundColor: '#fff' }}>
      <Box
        justifyContent="center"
        alignItems="center"
        padding={4}
        backgroundColor="#009688"
        shadow={2}
        rounded="md"
        mb={4}
      >
        <HStack alignItems="center">
          <Text fontSize="2xl" fontWeight="bold" color="white" mr={4}>
            Colabore
          </Text>
          <VStack alignItems="flex-start">
            <Text fontSize="lg" color="white">Perfil do Usuário</Text>
          </VStack>
        </HStack>
      </Box>
      
      <Box
        padding={4}
        backgroundColor="#fff"
        borderRadius={10}
        mb={4}
        alignItems="center"
      >
        <Box position="relative" alignItems="center" mb={6}>
          <Box
            borderColor="#009688"
            borderWidth={3}
            borderRadius="full"
            padding={1}
          >
            <Image 
              source={{ uri: profileImage || 'https://via.placeholder.com/150' }} 
              alt="Avatar" 
              borderRadius="full" 
              size="2xl" 
              fallbackSource={{ uri: 'https://via.placeholder.com/150' }}
            />
          </Box>
          <Pressable 
            position="absolute" 
            bottom={-5}
            right={45}
            bg="#009688"
            borderRadius="full"
            p={2}
            onPress={onOpen}
          >
            <Icon as={Feather} name="camera" size="2xl" color="white" />
          </Pressable>
        </Box>
        
        {loading ? (
          <Spinner size="lg" color="#009688" />
        ) : userData ? (
          <VStack space={4} width="100%" alignItems="center">
            {userFields.map((field, index) => (
              <Box key={index} bg="coolGray.100" p={3} borderRadius="md" width="90%" alignItems="center">
                <Text fontSize="xs" color="coolGray.500" mb={1}>{field.label}</Text>
                <Text fontSize="md" fontWeight="bold" textAlign="center">{userData[field.key] || 'N/A'}</Text>
              </Box>
            ))}
          </VStack>
        ) : (
          <Text textAlign="center">No user data available</Text>
        )}
      </Box>

      <VStack space={4} mt={6} alignItems="center">
        <Button 
          leftIcon={<Icon as={Feather} name="upload" size="sm" color="white" />}
          bg="#009688"
          width="90%"
          onPress={handleOpenResume}
        >
          Cadastrar Currículum
        </Button>
        <Button 
          leftIcon={<Icon as={Feather} name="check-circle" size="sm" color="white" />}
          onPress={handleOpenOnboarding}
          bg="#009688"
          width="90%"
        >
          Verificar Checklist de Documentos
        </Button>
      </VStack>

      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content>
          <Actionsheet.Item onPress={() => handleImageSelection('gallery')}>Escolher da Galeria</Actionsheet.Item>
          <Actionsheet.Item onPress={() => handleImageSelection('camera')}>Abrir Câmera</Actionsheet.Item>
        </Actionsheet.Content>
      </Actionsheet>
      
      {showPicMe && <Photo onCapture={handlePicMeCapture} onClose={() => setShowPicMe(false)} />}
    </ScrollView>
  );
};

export default Profile;