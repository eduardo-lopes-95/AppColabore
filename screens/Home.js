import React, { useState, useEffect } from 'react';
import { VStack, Text, Button, Box, Center, Heading, Link, Alert } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import JobListining from '../components/JobListing';
import Logo from '../components/Logo';
import { supabase } from '../configs/supabaseClient';

function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };
    checkSession();

    const listener = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

   return () => {
      supabase.auth.onAuthStateChange(() => {});
    };
  }, []);

  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 2000); 
      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  const handleProtectedNavigation = (screen) => {
    if (isAuthenticated) {
      navigation.navigate(screen);
    } else {
      setShowAlert(true);
    }
  };

  return (
    <VStack flex={1} bg="white">
      <Box bg="teal.500" py={4} px={5} alignItems="center">
        <Logo />
        <VStack space={3} alignItems="center" w="full" mt={4}>
          <Button
            w="80%"
            bg="teal.700"
            onPress={() => navigation.navigate('SignIn')}>
            <Text color="white" textAlign="center">Entrar</Text>
          </Button>
          <Button
            w="80%"
            bg="teal.700"
            isDisabled={!isAuthenticated}
            onPress={() => handleProtectedNavigation('Resumes')}>
            <Text color="white" textAlign="center">Cadastrar Currículo</Text>
          </Button>
          <Button
            w="80%"
            bg="teal.700"
            isDisabled={!isAuthenticated}
            onPress={() => handleProtectedNavigation('Job')}>
            <Text color="white" textAlign="center">Publicar vaga</Text>
          </Button>
        </VStack>
      </Box>

      <Center py={10} px={5} bg="teal.700">
        <Heading size="lg" color="white" textAlign="center">
          O seu próximo passo está aqui!
        </Heading>
        <Text fontSize="md" color="white" textAlign="center" mt={3}>
          Confira as vagas disponibilizadas internamente.
        </Text>
      </Center>

      <Box py={6} px={5} bg="gray.900" alignItems="center">
        <Heading size="md" color="white" mb={4}>
          Vagas em destaque
        </Heading>
        <Link
          _text={{
            color: 'white',
            fontSize: 'lg',
            textDecorationLine: 'none',
          }}
          onPress={() => handleProtectedNavigation('JobListing')}
          mb={4}>
          Ver todas as vagas
        </Link>
        <JobListining searchTerm={searchTerm} limit={10} />
      </Box>

      {showAlert && (
        <Alert w="100%" status="warning" onClose={() => setShowAlert(false)}>
          <VStack space={2} flexShrink={1} w="100%">
            <Text fontSize="md" color="black" textAlign="center">
              Por favor, entre no app para ver todas as vagas.
            </Text>
          </VStack>
        </Alert>
      )}
    </VStack>
  );
}

export default Home;
