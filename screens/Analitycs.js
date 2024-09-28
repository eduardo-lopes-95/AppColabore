import React from 'react';
import { ScrollView, Box, Text, VStack, HStack, Heading, Pressable } from 'native-base';
import { Dimensions, SafeAreaView, StatusBar } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const Analitycs = () => {
  const screenWidth = Dimensions.get('window').width;

  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43],
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
        strokeWidth: 2
      }
    ]
  };

  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBar barStyle="light-content" backgroundColor="#009688" />
      <ScrollView contentContainerStyle={{ padding: 10, backgroundColor: '#fff' }}>
        <Box
          padding={4}
          backgroundColor="#fff"
          borderRadius={10}
          mb={4}
          flex={1}
        >
          <VStack space={4}>
            <Box bg="white" p={4} rounded="md" shadow={2}>
              <Heading size="md" mb={2}>Desempenho dos Colaboradores</Heading>
              <LineChart
                data={data}
                width={screenWidth - 60}
                height={220}
                chartConfig={chartConfig}
                bezier
              />
            </Box>

            <HStack space={4} justifyContent="space-between">
              <Box bg="white" p={4} rounded="md" shadow={2} flex={1}>
                <Heading size="sm" mb={2}>Total de Colaboradores</Heading>
                <Text fontSize="2xl" fontWeight="bold">150</Text>
              </Box>
              <Box bg="white" p={4} rounded="md" shadow={2} flex={1}>
                <Heading size="sm" mb={2}>Produtividade Média</Heading>
                <Text fontSize="2xl" fontWeight="bold">85%</Text>
              </Box>
            </HStack>

            <Pressable 
              bg="#009688" 
              p={4} 
              rounded="md" 
              onPress={() => console.log('Gerar relatório')}
            >
              <Text color="white" textAlign="center">Enviar Relatório Customizado</Text>
            </Pressable>

            <Pressable 
              bg="#009688" 
              p={4} 
              rounded="md" 
              onPress={() => console.log('Integrar com ERP')}
            >
              <Text color="white" textAlign="center">Entrar no ERP</Text>
            </Pressable>
          </VStack>
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Analitycs;
