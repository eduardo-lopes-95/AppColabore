import React, { useState, useEffect, useCallback } from 'react';
import { RefreshControl } from 'react-native';
import { ScrollView, Box, Text, VStack, HStack, Input, TextArea, Button, FlatList, useToast } from 'native-base';
import { supabaseHelper } from '../configs/supabaseClient';
import { useAuth } from '../contexts/AuthContext';

const PerformanceManagement = () => {
  const [evaluations, setEvaluations] = useState([]);
  const [currentEvaluation, setCurrentEvaluation] = useState({
    nome_funcionario: '',
    feedback: '',
    metas_individuais_equipes: '',
    reconhecimento_recompensas: '',
  });
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();
  const toast = useToast();

  const fetchEvaluations = async () => {
    const { data, error } = await supabaseHelper.select('PerformanceManagement');
    if (error) {
      console.error('Error fetching evaluations:', error);
      toast.show({
        title: "Erro ao carregar avaliações",
        status: "error",
        description: error.message
      });
    } else {
      setEvaluations(data);
    }
  };

  useEffect(() => {
    fetchEvaluations();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchEvaluations().then(() => setRefreshing(false));
  }, []);

  const handleCreateEvaluation = async () => {
    if (currentEvaluation.nome_funcionario) {
      const newEvaluation = {
        ...currentEvaluation,
        user_id: user?.id,
      };

      const { data, error } = await supabaseHelper.insert('PerformanceManagement', newEvaluation);

      if (error) {
        console.error('Error creating evaluation:', error);
        toast.show({
          title: "Erro ao criar avaliação",
          status: "error",
          description: error.message
        });
      } else if (data) {
        setEvaluations(prevEvaluations => [...prevEvaluations, ...(Array.isArray(data) ? data : [data])]);
        setCurrentEvaluation({
          nome_funcionario: '',
          feedback: '',
          metas_individuais_equipes: '',
          reconhecimento_recompensas: '',
        });
        toast.show({
          title: "Avaliação criada com sucesso",
          status: "success"
        });
      } else {
        console.error('No data returned from insert operation');
        toast.show({
          title: "Erro ao criar avaliação",
          status: "error",
          description: "Nenhum dado retornado da operação de inserção"
        });
      }
    }
  };

  return (
    <ScrollView 
      contentContainerStyle={{ padding: 10, backgroundColor: '#fff' }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
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
            <Text fontSize="lg" color="white">Avaliação de Desempenho</Text>
          </VStack>
        </HStack>
      </Box>
      <Box
        padding={4}
        backgroundColor="#fff"
        borderRadius={10}
        mb={4}
      >
        <Text fontSize="lg" mb={4}>Nova Avaliação de Desempenho</Text>
        <VStack space={4}>
          <VStack space={2}>
            <Text fontWeight="bold">Nome do Funcionário</Text>
            <Input
              value={currentEvaluation.nome_funcionario}
              onChangeText={(text) => setCurrentEvaluation({ ...currentEvaluation, nome_funcionario: text })}
              placeholder="Nome do Funcionário"
            />
          </VStack>
          <VStack space={2}>
            <Text fontWeight="bold">Feedback</Text>
            <TextArea
              value={currentEvaluation.feedback}
              onChangeText={(text) => setCurrentEvaluation({ ...currentEvaluation, feedback: text })}
              placeholder="Feedback"
              height={100}
            />
          </VStack>
          <VStack space={2}>
            <Text fontWeight="bold">Metas Individuais e de Equipe</Text>
            <TextArea
              value={currentEvaluation.metas_individuais_equipes}
              onChangeText={(text) => setCurrentEvaluation({ ...currentEvaluation, metas_individuais_equipes: text })}
              placeholder="Metas Individuais e de Equipe"
              height={100}
            />
          </VStack>
          <VStack space={2}>
            <Text fontWeight="bold">Reconhecimento e Recompensas</Text>
            <TextArea
              value={currentEvaluation.reconhecimento_recompensas}
              onChangeText={(text) => setCurrentEvaluation({ ...currentEvaluation, reconhecimento_recompensas: text })}
              placeholder="Reconhecimento e Recompensas"
              height={100}
            />
          </VStack>
          <Button
            backgroundColor="#009688"
            onPress={handleCreateEvaluation}
          >
            Salvar Avaliação
          </Button>
        </VStack>
      </Box>
      <Text fontSize="lg" mb={4}>Avaliações Existentes</Text>
      <FlatList
        data={evaluations}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Box
            padding={4}
            borderColor="#ccc"
            borderWidth={1}
            borderRadius={5}
            mb={4}
          >
            <Text fontSize="lg" fontWeight="bold" mb={2}>
              {item.nome_funcionario}
            </Text>
            <Text>Feedback: {item.feedback}</Text>
            <Text>Metas: {item.metas_individuais_equipes}</Text>
            <Text>Reconhecimento: {item.reconhecimento_recompensas}</Text>
          </Box>
        )}
      />
    </ScrollView>
  );
};

export default PerformanceManagement;
