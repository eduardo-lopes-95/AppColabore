import React, { useState, useEffect } from 'react';
import { Box, Text, VStack, HStack, Badge, IconButton, FlatList } from 'native-base';
import { Feather } from '@expo/vector-icons';
import { supabaseHelper } from '../configs/supabaseClient';

const TaskManagement = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const { data, error } = await supabaseHelper.select('TaskManagement');
    if (error) {
      console.error('Error fetching tasks:', error);
    } else {
      setTasks(data);
    }
  };

  const updateTaskStatus = async (id, newStatus) => {
    const { error } = await supabaseHelper.update('TaskManagement', { status: newStatus }, { id: id });
    if (error) {
      console.error('Error updating task status:', error);
    } else {
      setTasks(tasks.map(task => 
        task.id === id ? { ...task, status: newStatus } : task
      ));
    }
  };

  const renderItem = ({ item }) => (
    <Box
      padding={4}
      borderColor="#ccc"
      borderWidth={1}
      borderRadius={5}
      mb={4}
    >
      <Text fontSize="lg" fontWeight="bold" mb={2}>
        {item.title}
      </Text>
      <HStack justifyContent="space-between" alignItems="center" mb={2}>
        <Text>Prazo: {item.deadline}</Text>
        <Badge colorScheme={item.priority === 'Alta' ? 'red' : item.priority === 'Média' ? 'yellow' : 'green'}>
          {item.priority}
        </Badge>
      </HStack>
      <HStack justifyContent="space-between" alignItems="center">
        <Text>Status: {item.status}</Text>
        <HStack space={2}>
          <IconButton
            icon={<Feather name="check" size={20} color="green" />}
            onPress={() => updateTaskStatus(item.id, 'Concluída')}
          />
          <IconButton
            icon={<Feather name="clock" size={20} color="orange" />}
            onPress={() => updateTaskStatus(item.id, 'Em andamento')}
          />
          <IconButton
            icon={<Feather name="x" size={20} color="red" />}
            onPress={() => updateTaskStatus(item.id, 'Pendente')}
          />
        </HStack>
      </HStack>
    </Box>
  );

  const ListHeader = () => (
    <Box
      padding={4}
      backgroundColor="#fff"
      borderRadius={10}
      mb={4}
    >
      <Text fontSize="lg" mb={4}>Minhas Tarefas</Text>
    </Box>
  );

  return (
    <FlatList
      data={tasks}
      keyExtractor={item => item.id}
      renderItem={renderItem}
      ListHeaderComponent={ListHeader}
      contentContainerStyle={{ padding: 10, backgroundColor: '#fff' }}
    />
  );
};

export default TaskManagement;
