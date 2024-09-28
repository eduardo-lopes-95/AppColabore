import React, { useState } from 'react';
import {
  Box,
  Button,
  Center,
  HStack,
  ScrollView,
  Switch,
  Text,
  VStack,
  useToast,
} from 'native-base';
import * as DocumentPicker from 'expo-document-picker';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../configs/supabaseClient';
import * as FileSystem from 'expo-file-system';

const Resume = () => {
  const [file, setFile] = useState(null);
  const [isChecked, setIsChecked] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFileUrl, setUploadedFileUrl] = useState(null); 
  const toast = useToast();
  const navigation = useNavigation();

  const handleUpload = async () => {
    try {
      setIsUploading(true);
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        copyToCacheDirectory: true,
      });

      if (result.type === "success") {
        const { uri, name } = result;
        setFile(result);
        
        toast.show({
          title: "PDF Selecionado",
          status: "success",
          description: `Arquivo "${name}" selecionado com sucesso!`,
        });

        // Lê o arquivo como binário (base64 ou array buffer não é necessário aqui)
        const fileContent = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.UTF8,
        });

        // Preparando o arquivo para upload como Blob ou usando FormData
        const formData = new FormData();
        formData.append('file', {
          uri,
          name: `curriculo_${Date.now()}.pdf`,
          type: 'application/pdf',
        });

        // Fazendo o upload usando fetch (ou usando supabase storage se preferir)
        const { data, error } = await supabase
          .storage
          .from('app-colabore')
          .upload(`curriculo/${name}`, uri, {
            cacheControl: '3600',
            upsert: false,
          });

        if (error) {
          throw error;
        }

        setUploadedFileUrl(data.Key); 
        toast.show({
          title: "Upload Concluído",
          status: "success",
          description: "Arquivo enviado com sucesso para o Supabase!",
        });
      }
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      toast.show({
        title: "Erro",
        status: "error",
        description: "Falha ao selecionar ou enviar o documento. Tente novamente.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = () => {
    if (file && isChecked && uploadedFileUrl) {
      navigation.navigate('JobListing');
    } else {
      toast.show({
        title: "Atenção",
        status: "warning",
        description: "Por favor, faça o upload do currículo e confirme a validade do documento.",
      });
    }
  };

  const handleSwitchChange = (value) => {
    setIsChecked(value);
  };

  return (
    <Box flex={1} bg="white">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <VStack flex={1} p={4}>
          <Box
            padding={4}
            backgroundColor="#fff"
            borderRadius={10}
            mb={4}
          >
            <Text fontSize="lg" mb={4}>Upload do seu currículum</Text>
            <VStack space={4} w="100%">
              <HStack justifyContent="flex-start" alignItems="center" mb={4}>
                <Center
                  w={6}
                  h={6}
                  borderRadius="full"
                  borderWidth={2}
                  borderColor="gray.500"
                  mr={2}
                  justifyContent="center"
                  alignItems="center"
                >
                  <Text color="gray.500">1</Text>
                </Center>
                <Text fontSize="md" color="gray.500">
                  Upload document
                </Text>
              </HStack>
              <Button 
                variant="outline"
                borderStyle="dashed"
                borderColor="gray.400"
                onPress={handleUpload}
                w="100%"
                p={5}
                isLoading={isUploading}
                isLoadingText="Selecionando..."
              >
                <Text color="blue.500">Selecionar PDF</Text>
              </Button>
              {file && (
                <Text mt={2} fontSize="md" color="gray.600">
                  Arquivo selecionado: {file.name}
                </Text>
              )}
              <HStack alignItems="center" mt={5}>
                <Switch
                  value={isChecked}
                  onValueChange={handleSwitchChange}
                  colorScheme="teal"
                  mr={2}
                />
                <Text fontSize="sm" color="gray.600">
                  I confirm this document is valid.
                </Text>
              </HStack>
              <Button
                backgroundColor="#009688"
                onPress={handleSubmit}
                mt={4}
                isDisabled={!file || !isChecked || !uploadedFileUrl} // Garante que o arquivo foi enviado
              >
                Enviar Currículum
              </Button>
            </VStack>
          </Box>
        </VStack>
      </ScrollView>
    </Box>
  );
};

export default Resume;
