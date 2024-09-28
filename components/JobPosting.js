import React, { useState } from 'react';
import {
  View,
  Text,
  Button,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'native-base';
import { TextInput } from 'react-native';
import { Input, TextArea, Box, VStack, HStack } from 'native-base';

function JobPosting() {
  const [jobs, setJobs] = useState([]);
  const [jobTitle, setJobTitle] = useState('');
  const [jobLocation, setJobLocation] = useState('');
  const [jobSector, setJobSector] = useState('');
  const [jobDescription, setJobDescription] = useState('');

  const handleSubmit = () => {
    setJobs([
      ...jobs,
      {
        title: jobTitle,
        location: jobLocation,
        sector: jobSector,
        description: jobDescription,
      },
    ]);
    setJobTitle('');
    setJobLocation('');
    setJobSector('');
    setJobDescription('');
  };

  return (
    <ScrollView>
      <Box
        padding={4}
        backgroundColor="#fff"
        borderRadius={10}
        mb={4}
      >
        <Text fontSize="lg" mb={4}>Detalhe os dados de sua vaga</Text>
        <VStack space={4}>
          <VStack space={2}>
            <Text fontWeight="bold">Título da Vaga</Text>
            <Input
              value={jobTitle}
              onChangeText={setJobTitle}
              placeholder="Título da Vaga"
            />
          </VStack>
          <VStack space={2}>
            <Text fontWeight="bold">Setor</Text>
            <Input
              value={jobSector}
              onChangeText={setJobSector}
              placeholder="Setor"
            />
          </VStack>
          <VStack space={2}>
            <Text fontWeight="bold">Local</Text>
            <Input
              value={jobLocation}
              onChangeText={setJobLocation}
              placeholder="Local"
            />
          </VStack>
          <VStack space={2}>
            <Text fontWeight="bold">Descrição da Vaga</Text>
            <TextArea
              value={jobDescription}
              onChangeText={setJobDescription}
              placeholder="Descrição da Vaga"
              height={100}
            />
          </VStack>
          <Button
            backgroundColor="#009688"
            onPress={handleSubmit}
          >
            Publicar
          </Button>
        </VStack>
      </Box>
      <FlatList
        data={jobs}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Box
            padding={4}
            borderColor="#ccc"
            borderWidth={1}
            borderRadius={5}
            mb={4}
            alignItems="center"
          >
            <Text fontSize="lg" fontWeight="bold" mb={2}>
              {item.title}
            </Text>
            <Text>{item.location}</Text>
            <Text>{item.sector}</Text>
            <Text>{item.description}</Text>
          </Box>
        )}
      />
    </ScrollView>
  );
}

export default JobPosting;