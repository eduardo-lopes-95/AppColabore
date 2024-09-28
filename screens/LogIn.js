import React, { useState } from 'react';
import { Center, Box, Heading, VStack, Input, Button, Pressable, Text } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { supabase } from '../configs/supabaseClient'; 
import { Alert } from 'react-native'; 
import { useNavigation } from '@react-navigation/native';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error) {
      Alert.alert('Erro de Login', error.message);
    } else {
      Alert.alert('Sucesso', 'Login realizado com sucesso!');
      navigation.navigate('JobListing')
    }
  };

  return (
    <Center flex={1} bg="gray.100">
      <Box bg="#fff" p={5} rounded="lg" w="90%" maxW="400px">
        <Heading color="#2C2C2C" textAlign="center" mb={6}>
          Entrar na sua conta
        </Heading>

        <VStack space={4}>
          <Input
            placeholder="E-mail"
            variant="outline"
            color="black"
            placeholderTextColor="gray.400"
            value={email}
            onChangeText={setEmail}
            _focus={{ borderColor: 'blue.500' }}
          />

          <Input
            placeholder="Senha"
            variant="outline"
            color="black"
            placeholderTextColor="gray.400"
            type={showPassword ? "text" : "password"}
            value={password}
            onChangeText={setPassword}
            _focus={{ borderColor: 'blue.500' }}
            InputRightElement={
              <Pressable onPress={() => setShowPassword(!showPassword)}>
                <MaterialIcons name={showPassword ? "visibility" : "visibility-off"} size={20} color="gray" />
              </Pressable>
            }
          />

          <Text color="blue.500" fontSize="sm" textAlign="right">
            Esqueceu sua senha?
          </Text>

          <Button
            bg="#009688"
            mt={6}
            isLoading={loading} // Mostra o loading no botão durante o processo de login
            onPress={handleLogin}
          >
            ENTRAR
          </Button>
        </VStack>
      </Box>
    </Center>
  );
};

export default Login;
