import React, { useContext } from 'react';
import { Box, VStack, Avatar, Pressable, Text } from 'native-base';
import { ProfileContext } from '../contexts/ProfileContext';
import { useAuth } from '../contexts/AuthContext';

const CustomDrawerContent = ({ navigation }) => {
  const { profileImage } = useContext(ProfileContext);
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigation.navigate('Home'); // Navigate to Home screen after signing out
  };

  return (
    <Box flex={1} p={4}>
      <VStack space={4}>
        <Box alignItems="center" mt={15}>
          <Avatar
            size="xl"
            source={{ uri: profileImage }}
            mb={5}
          />
        </Box>
        <Pressable onPress={() => navigation.navigate('Profile')}>
          <Box borderBottomWidth={1} borderBottomColor="gray.200" py={2}>
            <Text>Perfil</Text>
          </Box>
        </Pressable>
        <Pressable onPress={() => navigation.navigate('Home')}>
          <Box borderBottomWidth={1} borderBottomColor="gray.200" py={2}>
            <Text>Home</Text>
          </Box>
        </Pressable>
        <Pressable onPress={() => navigation.navigate('JobListing')}>
          <Box borderBottomWidth={1} borderBottomColor="gray.200" py={2}>
            <Text>Lista de Vagas</Text>
          </Box>
        </Pressable>
        <Pressable onPress={() => navigation.navigate('Job')}>
          <Box borderBottomWidth={1} borderBottomColor="gray.200" py={2}>
            <Text>Publicar Vagas</Text>
          </Box>
        </Pressable>
        <Pressable onPress={() => navigation.navigate('TaskManagement')}>
          <Box borderBottomWidth={1} borderBottomColor="gray.200" py={2}>
            <Text>Minhas Tarefas</Text>
          </Box>
        </Pressable>
        <Pressable onPress={() => navigation.navigate('PerformanceManagement')}>
          <Box borderBottomWidth={1} borderBottomColor="gray.200" py={2}>
            <Text>Gestão Desempenho</Text>
          </Box>
        </Pressable>
        <Pressable onPress={() => navigation.navigate('DigitalTimesheet')}>
          <Box borderBottomWidth={1} borderBottomColor="gray.200" py={2}>
            <Text>Registrar Ponto</Text>
          </Box>
        </Pressable>
        <Pressable onPress={() => navigation.navigate('LearningAndDevelopment')}>
          <Box borderBottomWidth={1} borderBottomColor="gray.200" py={2}>
            <Text>Desenvolvimento Pessoal</Text>
          </Box>
        </Pressable>
        <Pressable onPress={() => navigation.navigate('Communication')}>
          <Box borderBottomWidth={1} borderBottomColor="gray.200" py={2}>
            <Text>Comunicação Interna</Text>
          </Box>
        </Pressable>
        <Pressable onPress={() => navigation.navigate('Analitycs')}>
          <Box borderBottomWidth={1} borderBottomColor="gray.200" py={2}>
            <Text>Análises</Text>
          </Box>
        </Pressable>
        
        {/* Add Sign Out button */}
        <Pressable onPress={handleSignOut}>
          <Box borderBottomWidth={1} borderBottomColor="gray.200" py={2}>
            <Text color="red.500">Sair</Text>
          </Box>
        </Pressable>
      </VStack>
    </Box>
  );
};

export default CustomDrawerContent;