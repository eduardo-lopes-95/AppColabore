import React, { useState } from 'react';
import { Center, Box, Heading, VStack, Input, Button, Checkbox, Select, Pressable, Text, Alert } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { supabase } from '../configs/supabaseClient';

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cpf, setCpf] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigation = useNavigation();

  const handleSignUp = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { cpf } 
      }
    });

    if (error) {
      setErrorMessage(error.message);
    } else {
      navigation.navigate('Resumes');
    }
  };

  return (
    <Center flex={1} bg="gray.100">
      <Box bg="#fff" p={5} rounded="lg" w="90%" maxW="400px">
        <Heading color="#2C2C2C" textAlign="center" mb={4}>
          Crie seu perfil gratuitamente
        </Heading>
        <Text color="gray.400" textAlign="center" mb={6}>
          Conquiste o seu próximo emprego agora!
        </Text>

        {errorMessage ? (
          <Alert w="100%" status="error" mb={5}>
            <Text>{errorMessage}</Text>
          </Alert>
        ) : null}

        <VStack space={4}>
          <Input
            placeholder="E-mail"
            variant="outline"
            color="black"
            placeholderTextColor="gray.400"
            _focus={{ borderColor: 'blue.500' }}
            value={email}
            onChangeText={(text) => setEmail(text)}
          />

          <Input
            placeholder="Senha"
            variant="outline"
            color="black"
            placeholderTextColor="gray.400"
            type={showPassword ? "text" : "password"}
            _focus={{ borderColor: 'blue.500' }}
            value={password}
            onChangeText={(text) => setPassword(text)}
            InputRightElement={
              <Pressable onPress={() => setShowPassword(!showPassword)}>
                <MaterialIcons name={showPassword ? "visibility" : "visibility-off"} size={20} color="gray" />
              </Pressable>
            }
          />
          <Text color="gray.500" fontSize="xs">
            De 7 a 20 caracteres (números e letras)
          </Text>

          <Input
            placeholder="CPF"
            variant="outline"
            color="black"
            placeholderTextColor="gray.400"
            _focus={{ borderColor: 'blue.500' }}
            value={cpf}
            onChangeText={(text) => setCpf(text)}
          />
          <Text color="gray.500" fontSize="xs" mb={2}>
            (Usamos apenas para evitar duplicidade)
          </Text>

          <Text color="blue.500" fontSize="sm" textAlign="right">
            SOU ESTRANGEIRO
          </Text>

          <Select
            selectedValue="pt-BR"
            minWidth="200"
            accessibilityLabel="Idioma do Perfil"
            placeholder="Idioma do Perfil"
            _selectedItem={{
              bg: "blue.500",
              endIcon: <MaterialIcons name="check" size={5} />
            }}
            mt={1}
          >
            <Select.Item label="Português (Brasil)" value="pt-BR" />
            <Select.Item label="English (US)" value="en-US" />
          </Select>

          <Checkbox value="terms" colorScheme="blue" mt={4}>
            <Text color="gray.400">Li e aceito os </Text>
            <Text color="blue.500">termos de uso</Text>
          </Checkbox>

          <Button bg="#009688" mt={6} onPress={handleSignUp}>
            <Text color="white">COMEÇAR A USAR AGORA!</Text>
          </Button>

          <Button 
            variant="outline"
            mt={3} bg="#009688"
            onPress={() => navigation.navigate('LogIn')}>
            <Text color="white">JÁ TENHO PERFIL</Text>
          </Button>
        </VStack>
      </Box>
    </Center>
  );
};

export default SignIn;
