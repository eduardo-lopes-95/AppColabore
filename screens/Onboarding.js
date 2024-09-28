import React, { useState } from 'react';
import { Checkbox, Box, VStack, Text, Button } from 'native-base';

const Onboarding = () => {
  const [tasksCompleted, setTasksCompleted] = useState({
    task1: false,
    task2: false,
    task3: false,
  });

  const handleTaskCompletion = (task) => {
    setTasksCompleted((prevState) => ({
      ...prevState,
      [task]: !prevState[task],
    }));
  };

  return (
    <Box p={5}>
      <VStack space={4}>
        <Text fontSize="xl" bold>Checklist de Integração</Text>

        <Checkbox value="task1" isChecked={tasksCompleted.task1} onChange={() => handleTaskCompletion('task1')}>
          Tarefa 1: Concluir o cadastro no sistema
        </Checkbox>

        <Checkbox value="task2" isChecked={tasksCompleted.task2} onChange={() => handleTaskCompletion('task2')}>
          Tarefa 2: Realizar o treinamento inicial
        </Checkbox>

        <Checkbox value="task3" isChecked={tasksCompleted.task3} onChange={() => handleTaskCompletion('task3')}>
          Tarefa 3: Entregar documentos necessários digitalmente
        </Checkbox>

        <Button onPress={() => alert('Checklist enviado com sucesso!')} mt={4} colorScheme="blue">
          Enviar Checklist
        </Button>
      </VStack>
    </Box>
  );
};

export default Onboarding;